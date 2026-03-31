"""
Database setup and models for SmartCrop platform
"""
import sqlite3
from datetime import datetime
import os

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'smartcrop.db')

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initialize database with schema"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            farm_size REAL,
            location TEXT,
            primary_crops TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )
    ''')
    
    # Analysis history table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            image_filename TEXT,
            disease_class TEXT NOT NULL,
            confidence REAL NOT NULL,
            crop_name TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    
    # Saved recommendations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS recommendations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            soil_type TEXT,
            climate_zone TEXT,
            water_availability TEXT,
            budget TEXT,
            recommended_crops TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    
    # Consultation bookings table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS consultations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            expert_type TEXT NOT NULL,
            preferred_date TEXT NOT NULL,
            preferred_time TEXT NOT NULL,
            issue_description TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    # Crops table — tracks individual crop instances for longitudinal monitoring
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS crops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            crop_type TEXT NOT NULL,
            nickname TEXT NOT NULL,
            planted_date TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    # Migration: add crop_id FK to analyses (safe for existing DBs)
    try:
        cursor.execute('ALTER TABLE analyses ADD COLUMN crop_id INTEGER REFERENCES crops(id)')
    except Exception:
        pass  # Column already exists — this is fine
    
    conn.commit()
    conn.close()
    print("✓ Database initialized successfully")

def create_user(name, email, password_hash, farm_size=None, location=None, primary_crops=None):
    """Create a new user"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO users (name, email, password_hash, farm_size, location, primary_crops)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (name, email, password_hash, farm_size, location, primary_crops))
        conn.commit()
        user_id = cursor.lastrowid
        return user_id
    except sqlite3.IntegrityError:
        return None
    finally:
        conn.close()

def get_user_by_email(email):
    """Get user by email"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()
    conn.close()
    return dict(user) if user else None

def get_user_by_id(user_id):
    """Get user by ID"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    conn.close()
    return dict(user) if user else None

def update_last_login(user_id):
    """Update user's last login timestamp"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET last_login = ? WHERE id = ?', 
                   (datetime.now(), user_id))
    conn.commit()
    conn.close()

def save_analysis(user_id, image_filename, disease_class, confidence, crop_name=None, crop_id=None):
    """Save analysis to history, optionally linked to a crop"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO analyses (user_id, image_filename, disease_class, confidence, crop_name, crop_id)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (user_id, image_filename, disease_class, confidence, crop_name, crop_id))
    conn.commit()
    analysis_id = cursor.lastrowid
    conn.close()
    return analysis_id

def get_user_analyses(user_id, limit=50):
    """Get user's analysis history"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM analyses 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ?
    ''', (user_id, limit))
    analyses = cursor.fetchall()
    conn.close()
    return [dict(analysis) for analysis in analyses]

def get_analysis_stats(user_id):
    """Get user's analysis statistics"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Total analyses
    cursor.execute('SELECT COUNT(*) as total FROM analyses WHERE user_id = ?', (user_id,))
    total = cursor.fetchone()['total']
    
    # Healthy scans
    cursor.execute('''
        SELECT COUNT(*) as healthy FROM analyses 
        WHERE user_id = ? AND disease_class LIKE '%healthy%'
    ''', (user_id,))
    healthy = cursor.fetchone()['healthy']
    
    # Disease detections
    diseased = total - healthy
    
    conn.close()
    return {'total': total, 'healthy': healthy, 'diseased': diseased}


def delete_analysis(analysis_id, user_id):
    """Delete a single analysis by ID (only if owned by user)"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM analyses WHERE id = ? AND user_id = ?', (analysis_id, user_id))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    return deleted > 0

def delete_all_analyses(user_id):
    """Delete all analyses for a user"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM analyses WHERE user_id = ?', (user_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    return deleted


# ==================== CROP CRUD ====================

def create_crop(user_id, crop_type, nickname, planted_date=None):
    """Create a new crop for a user"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO crops (user_id, crop_type, nickname, planted_date)
        VALUES (?, ?, ?, ?)
    ''', (user_id, crop_type, nickname, planted_date))
    conn.commit()
    crop_id = cursor.lastrowid
    conn.close()
    return crop_id


def get_user_crops(user_id):
    """Get all crops for a user"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM crops
        WHERE user_id = ?
        ORDER BY created_at DESC
    ''', (user_id,))
    crops = cursor.fetchall()
    conn.close()
    return [dict(c) for c in crops]


def get_crop_by_id(crop_id, user_id):
    """Get a single crop by ID (only if owned by user)"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM crops WHERE id = ? AND user_id = ?', (crop_id, user_id))
    crop = cursor.fetchone()
    conn.close()
    return dict(crop) if crop else None


def get_crop_trend(crop_id, user_id):
    """Get the longitudinal trend of analyses for a specific crop"""
    conn = get_db_connection()
    cursor = conn.cursor()
    # Verify ownership first
    cursor.execute('SELECT id FROM crops WHERE id = ? AND user_id = ?', (crop_id, user_id))
    if not cursor.fetchone():
        conn.close()
        return None  # Not found or not owned
    # Fetch analyses linked to this crop, sorted by date
    cursor.execute('''
        SELECT id, disease_class, confidence, crop_name, created_at
        FROM analyses
        WHERE crop_id = ? AND user_id = ?
        ORDER BY created_at ASC
    ''', (crop_id, user_id))
    analyses = cursor.fetchall()
    conn.close()
    return [dict(a) for a in analyses]


def delete_crop(crop_id, user_id):
    """Delete a crop by ID (only if owned by user). Also unlinks analyses."""
    conn = get_db_connection()
    cursor = conn.cursor()
    # Unlink any analyses that referenced this crop
    cursor.execute('UPDATE analyses SET crop_id = NULL WHERE crop_id = ? AND user_id = ?', (crop_id, user_id))
    cursor.execute('DELETE FROM crops WHERE id = ? AND user_id = ?', (crop_id, user_id))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    return deleted > 0


if __name__ == '__main__':
    init_database()
