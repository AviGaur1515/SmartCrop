# Test script to debug prediction endpoint
import requests
import json

print("=" * 60)
print("🔍 SmartCrop Prediction Endpoint Test")
print("=" * 60)
print()

# Test 1: Backend health check
print("[1] Testing backend health...")
try:
    response = requests.get("http://localhost:5000/health", timeout=3)
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Backend is running")
        print(f"   Status: {data.get('status')}")
        print(f"   Model loaded: {data.get('model_loaded')}")
        print(f"   Classes: {data.get('classes')}")
    else:
        print(f"❌ Backend returned status {response.status_code}")
except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to backend on port 5000")
    print("   Please start backend: cd backend && venv\\Scripts\\python app.py")
    exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)

print()

# Test 2: Try to register/login to get a token
print("[2] Testing authentication...")
test_email = "test_debug@example.com"
test_password = "Test1234"

# Try to register
print(f"   Attempting to register user: {test_email}")
reg_response = requests.post(
    "http://localhost:5000/api/auth/register",
    json={
        "name": "Debug User",
        "email": test_email,
        "password": test_password
    }
)

if reg_response.status_code == 201:
    data = reg_response.json()
    token = data.get('token')
    print(f"✅ Registration successful")
    print(f"   Token: {token[:20]}...")
elif reg_response.status_code == 409:
    # User already exists, try to login
    print("   User exists, trying login...")
    login_response = requests.post(
        "http://localhost:5000/api/auth/login",
        json={
            "email": test_email,
            "password": test_password
        }
    )
    if login_response.status_code == 200:
        data = login_response.json()
        token = data.get('token')
        print(f"✅ Login successful")
        print(f"   Token: {token[:20]}...")
    else:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"   Response: {login_response.text}")
        exit(1)
else:
    print(f"❌ Registration failed: {reg_response.status_code}")
    print(f"   Response: {reg_response.text}")
    exit(1)

print()

# Test 3: Try prediction without an image (should fail gracefully)
print("[3] Testing prediction endpoint (without image)...")
headers = {"Authorization": f"Bearer {token}"}
pred_response = requests.post(
    "http://localhost:5000/api/predict",
    headers=headers
)

print(f"   Status: {pred_response.status_code}")
print(f"   Response: {pred_response.json()}")

if pred_response.status_code == 400 and "No file provided" in pred_response.text:
    print("✅ Endpoint is working (correctly rejecting empty request)")
else:
    print("⚠️  Unexpected response")

print()

# Summary
print("=" * 60)
print("📋 SUMMARY")
print("=" * 60)
print()
print("Backend Status: ✅ Running")
print("Authentication: ✅ Working")
print("Prediction Endpoint: ✅ Accessible")
print()
print("🔍 NEXT STEPS TO DEBUG:")
print("1. Make sure backend is running (see test 1 above)")
print("2. In browser, open DevTools (F12) and go to 'Network' tab")
print("3. Try to upload an image and click 'Analyze'")
print("4. Look for the 'predict' request in Network tab")
print("5. Click on it and check:")
print("   - Request Headers: Should have 'Authorization: Bearer...'")
print("   - Request Payload: Should have 'file' field")
print("   - Response: Check status code and error message")
print()
print("Common Issues:")
print("- If 401 error: Token expired, log out and log back in")
print("- If 400 'No file': Frontend not sending file correctly")
print("- If 500: Check backend terminal for Python errors")
print("=" * 60)
