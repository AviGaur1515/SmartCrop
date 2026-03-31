from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import tensorflow as tf
from tensorflow import keras
import numpy as np
from PIL import Image
import io
import json
import os
from datetime import datetime, timedelta
from database import (
    init_database, create_user, get_user_by_email, get_user_by_id,
    update_last_login, save_analysis, get_user_analyses, get_analysis_stats,
    delete_analysis, delete_all_analyses,
    create_crop, get_user_crops, get_crop_by_id, get_crop_trend, delete_crop,
    get_db_connection, DATABASE_PATH
)
from auth_utils import validate_email, validate_password

# Custom layer classes for model loading
@tf.keras.utils.register_keras_serializable()
class TrueDivide(keras.layers.Layer):
    def __init__(self, value=127.5, **kwargs):
        super().__init__(**kwargs)
        self.value = value

    def call(self, inputs):
        return tf.divide(inputs, self.value)

    def get_config(self):
        config = super().get_config()
        config.update({"value": self.value})
        return config


@tf.keras.utils.register_keras_serializable()
class CustomRescaling(keras.layers.Layer):
    def __init__(self, offset=-1.0, **kwargs):
        super().__init__(**kwargs)
        self.offset = offset

    def call(self, inputs):
        return inputs + self.offset

    def get_config(self):
        config = super().get_config()
        config.update({"offset": self.offset})
        return config


# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'smartcrop-secret-key-change-in-production-2024'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
jwt = JWTManager(app)

# Initialize database
init_database()

# Load the model and class names
MODEL_PATH = 'plant_disease_mobilenetv2.h5'
CLASS_NAMES_PATH = 'class_names.json'

print("Loading model...")
try:
    model = keras.models.load_model(
        MODEL_PATH,
        custom_objects={
            'TrueDivide': TrueDivide,
            'CustomRescaling': CustomRescaling
        }
    )
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# Load class names
try:
    with open(CLASS_NAMES_PATH, 'r') as f:
        class_names = json.load(f)
    print(f"✅ Loaded {len(class_names)} class names")
except Exception as e:
    print(f"❌ Error loading class names: {e}")
    class_names = []


def preprocess_image(image_file):
    """Preprocess the uploaded image for model prediction."""
    try:
        image = Image.open(io.BytesIO(image_file.read()))
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        image = image.resize((224, 224))
        img_array = np.array(image, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    
    except Exception as e:
        raise ValueError(f"Error preprocessing image: {e}")


def get_severity(confidence):
    """Determine severity based on confidence level"""
    if confidence >= 90:
        return "High"
    elif confidence >= 70:
        return "Medium"
    else:
        return "Low"


# ==================== AUTHENTICATION ENDPOINTS ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('name') or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        name = data['name'].strip()
        email = data['email'].strip().lower()
        password = data['password']
        
        # Validate email
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Check if user already exists
        existing_user = get_user_by_email(email)
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 409
        
        # Hash password
        password_hash = generate_password_hash(password)
        
        # Create user
        user_id = create_user(
            name=name,
            email=email,
            password_hash=password_hash,
            farm_size=data.get('farmSize'),
            location=data.get('location'),
            primary_crops=data.get('primaryCrops')
        )
        
        if not user_id:
            return jsonify({'error': 'Failed to create user'}), 500
        
        # Create access token with user ID as string for JWT compatibility
        access_token = create_access_token(identity=str(user_id))
        
        # Get user data
        user = get_user_by_id(user_id)
        user_data = {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'farmSize': user['farm_size'],
            'location': user['location'],
            'primaryCrops': user['primary_crops']
        }
        
        return jsonify({
            'message': 'Registration successful',
            'token': access_token,
            'user': user_data
        }), 201
    
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Missing email or password'}), 400
        
        email = data.get('email').strip().lower()
        password = data.get('password')
        
        # Get user
        user = get_user_by_email(email)
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check password
        if not check_password_hash(user['password_hash'], password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Update last login
        update_last_login(user['id'])
        
        # Create access token with user ID as string for JWT compatibility
        access_token = create_access_token(identity=str(user['id']))
        
        # Return user data
        user_data = {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'farmSize': user['farm_size'],
            'location': user['location'],
            'primaryCrops': user['primary_crops']
        }
        
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': user_data
        }), 200
    
    except Exception as e:
        print(f"❌ Login error: {e}")
        return jsonify({'error': f'Login failed: {str(e)}'}), 500


@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user profile"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        user = get_user_by_id(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user_data = {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'farmSize': user['farm_size'],
            'location': user['location'],
            'primaryCrops': user['primary_crops'],
            'createdAt': user['created_at'],
            'lastLogin': user['last_login']
        }
        
        return jsonify({'user': user_data}), 200
    
    except Exception as e:
        print(f"❌ Error fetching user: {e}")
        return jsonify({'error': str(e)}), 500


# ==================== PREDICTION ENDPOINTS ====================

@app.route('/api/predict', methods=['POST'])
@jwt_required()
def predict():
    """Predict plant disease from uploaded image"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int for database
        
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400
        
        # Preprocess and predict
        try:
            img_array = preprocess_image(file)
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        
        predictions = model.predict(img_array)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx] * 100)
        predicted_class = class_names[predicted_class_idx]
        severity = get_severity(confidence)
        
        # Extract crop name from model class
        crop_name = predicted_class.split('___')[0] if '___' in predicted_class else 'Unknown'
        
        # NOTE: We do NOT save here. The frontend will save after farmer confirms.
        result = {
            'class': predicted_class,
            'confidence': round(confidence, 2),
            'severity': severity,
            'cropName': crop_name
        }
        
        print(f"✅ Prediction (stateless): {predicted_class} ({confidence:.2f}%)")
        return jsonify(result), 200
    
    except Exception as e:
        print(f"❌ Error during prediction: {e}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500


@app.route('/api/history', methods=['GET'])
@jwt_required()
def get_history():
    """Get user's analysis history"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        limit = request.args.get('limit', 50, type=int)
        
        analyses = get_user_analyses(user_id, limit=limit)
        
        return jsonify({'analyses': analyses, 'count': len(analyses)}), 200
    
    except Exception as e:
        print(f"❌ Error fetching history: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """Get user's analysis statistics"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        stats = get_analysis_stats(user_id)
        
        return jsonify(stats), 200
    
    except Exception as e:
        print(f"❌ Error fetching stats: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/history/<int:analysis_id>', methods=['DELETE'])
@jwt_required()
def delete_single_history(analysis_id):
    """Delete a single analysis from history"""
    try:
        user_id = int(get_jwt_identity())
        success = delete_analysis(analysis_id, user_id)
        
        if success:
            return jsonify({'message': 'Analysis deleted successfully'}), 200
        else:
            return jsonify({'error': 'Analysis not found or not authorized'}), 404
    
    except Exception as e:
        print(f"❌ Error deleting analysis: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/history', methods=['DELETE'])
@jwt_required()
def delete_all_history():
    """Delete all analyses for a user"""
    try:
        user_id = int(get_jwt_identity())
        deleted_count = delete_all_analyses(user_id)
        
        return jsonify({
            'message': f'Deleted {deleted_count} analyses successfully',
            'deleted_count': deleted_count
        }), 200
    
    except Exception as e:
        print(f"❌ Error deleting all analyses: {e}")
        return jsonify({'error': str(e)}), 500


# ==================== HEALTH ENDPOINTS ====================

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'classes_loaded': len(class_names)
    }), 200


# ==================== SAVE ANALYSIS (after farmer confirms) ====================

@app.route('/api/analyses/save', methods=['POST'])
@jwt_required()
def save_confirmed_analysis():
    """Save a confirmed analysis to database (called after farmer validates the result)"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data or not data.get('diseaseClass') or data.get('confidence') is None:
            return jsonify({'error': 'diseaseClass and confidence are required'}), 400
        
        crop_id = data.get('cropId')
        if crop_id:
            try:
                crop_id = int(crop_id)
            except (ValueError, TypeError):
                crop_id = None
        
        analysis_id = save_analysis(
            user_id=user_id,
            image_filename=data.get('imageFilename', 'unknown'),
            disease_class=data['diseaseClass'],
            confidence=float(data['confidence']),
            crop_name=data.get('cropName', 'Unknown'),
            crop_id=crop_id
        )
        
        return jsonify({'message': 'Analysis saved', 'id': analysis_id}), 201
    
    except Exception as e:
        print(f"❌ Error saving analysis: {e}")
        return jsonify({'error': str(e)}), 500


# ==================== CROP ENDPOINTS ====================

@app.route('/api/crops', methods=['POST'])
@jwt_required()
def create_new_crop():
    """Create a new crop for the user"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data or not data.get('cropType') or not data.get('nickname'):
            return jsonify({'error': 'cropType and nickname are required'}), 400
        
        crop_id = create_crop(
            user_id=user_id,
            crop_type=data['cropType'].strip(),
            nickname=data['nickname'].strip(),
            planted_date=data.get('plantedDate')
        )
        
        return jsonify({
            'message': 'Crop created successfully',
            'crop': {
                'id': crop_id,
                'cropType': data['cropType'].strip(),
                'nickname': data['nickname'].strip(),
                'plantedDate': data.get('plantedDate')
            }
        }), 201
    
    except Exception as e:
        print(f"❌ Error creating crop: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/crops', methods=['GET'])
@jwt_required()
def list_crops():
    """List all crops for the authenticated user"""
    try:
        user_id = int(get_jwt_identity())
        crops = get_user_crops(user_id)
        return jsonify({'crops': crops}), 200
    
    except Exception as e:
        print(f"❌ Error listing crops: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/crops/<int:crop_id>', methods=['DELETE'])
@jwt_required()
def remove_crop(crop_id):
    """Delete a crop and unlink its analyses"""
    try:
        user_id = int(get_jwt_identity())
        success = delete_crop(crop_id, user_id)
        
        if success:
            return jsonify({'message': 'Crop deleted successfully'}), 200
        else:
            return jsonify({'error': 'Crop not found or not authorized'}), 404
    
    except Exception as e:
        print(f"❌ Error deleting crop: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/crops/<int:crop_id>/trend', methods=['GET'])
@jwt_required()
def crop_trend(crop_id):
    """Get longitudinal trend of disease confidence scores for a specific crop"""
    try:
        user_id = int(get_jwt_identity())
        trend = get_crop_trend(crop_id, user_id)
        
        if trend is None:
            return jsonify({'error': 'Crop not found or not authorized'}), 404
        
        return jsonify({
            'cropId': crop_id,
            'trend': trend,
            'count': len(trend)
        }), 200
    
    except Exception as e:
        print(f"❌ Error fetching crop trend: {e}")
        return jsonify({'error': str(e)}), 500


# ==================== AUTH EXTRAS ====================

@app.route('/api/auth/password', methods=['PUT'])
@jwt_required()
def change_password():
    """Change the current user's password"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data or not data.get('currentPassword') or not data.get('newPassword'):
            return jsonify({'error': 'currentPassword and newPassword are required'}), 400
        
        user = get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if not check_password_hash(user['password_hash'], data['currentPassword']):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        is_valid, message = validate_password(data['newPassword'])
        if not is_valid:
            return jsonify({'error': message}), 400
        
        new_hash = generate_password_hash(data['newPassword'])
        conn = get_db_connection()
        conn.execute('UPDATE users SET password_hash = ? WHERE id = ?', (new_hash, user_id))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Password changed successfully'}), 200
    
    except Exception as e:
        print(f"❌ Error changing password: {e}")
        return jsonify({'error': str(e)}), 500


# ==================== DEV ENDPOINTS (Testing only) ====================

@app.route('/api/dev/inject-trend', methods=['POST'])
@jwt_required()
def dev_inject_trend():
    """DEV ONLY: Inject backdated test analyses for longitudinal trend testing"""
    import sqlite3 as _sqlite3
    from datetime import datetime, timedelta
    import random
    
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        crop_id = data.get('cropId')
        
        if not crop_id:
            return jsonify({'error': 'cropId required'}), 400
        
        crop = get_crop_by_id(int(crop_id), user_id)
        if not crop:
            return jsonify({'error': 'Crop not found or not authorized'}), 404
        
        # Generate 6 backdated entries (1 per week, last 6 weeks)
        import sqlite3 as _sqlite3
        import random
        conn = _sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        disease_pool = [
            ('Tomato___healthy', 92.5), ('Tomato___Early_blight', 78.3),
            ('Tomato___Late_blight', 88.1), ('Tomato___healthy', 95.0),
            ('Tomato___Septoria_leaf_spot', 71.4), ('Tomato___healthy', 89.7)
        ]
        
        inserted = []
        for i in range(6):
            weeks_ago = 6 - i
            fake_date = datetime.now() - timedelta(weeks=weeks_ago)
            disease_class, base_conf = disease_pool[i]
            confidence = base_conf + random.uniform(-3, 3)
            crop_name = crop['crop_type']
            
            cursor.execute('''
                INSERT INTO analyses (user_id, image_filename, disease_class, confidence, crop_name, crop_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (user_id, 'dev_test.jpg', disease_class, round(confidence, 2), crop_name, crop_id, fake_date.strftime('%Y-%m-%d %H:%M:%S')))
            inserted.append({'date': fake_date.strftime('%Y-%m-%d'), 'class': disease_class, 'confidence': round(confidence, 2)})
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': f'Injected {len(inserted)} test analyses', 'data': inserted}), 201
    
    except Exception as e:
        print(f"❌ Dev inject error: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("\n" + "="*50)
    print("🌱 SmartCrop Backend Server v2.0")
    print("="*50)
    print(f"Model: {'✅ Loaded' if model else '❌ Not Loaded'}")
    print(f"Classes: {len(class_names)} loaded")
    print(f"Database: ✅ Initialized")
    print(f"JWT Auth: ✅ Enabled")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
