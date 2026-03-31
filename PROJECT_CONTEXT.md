# SmartCrop: Technical Project Context

This document provides a comprehensive technical overview of the **SmartCrop** platform. It is designed to be fed into an LLM (like Gemini) to provide full context on the project's architecture, logic, and implementation details.

---

## 1. Project Overview
**SmartCrop** is a professional AgTech (Agricultural Technology) platform designed to help farmers detect crop diseases using AI. It provides instant analysis of crop images, diagnostic information, and actionable treatment recommendations ("Smart Prescriptions").

### Key Features
- **AI Disease Detection**: Classification of 38 disease classes across multiple crops.
- **Farmer Dashboard**: Visualized statistics of scans, healthy vs. diseased ratios, and recent activity.
- **Smart Prescriptions**: Detailed diagnosis, immediate actions, and prevention steps for every detected disease.
- **Secure Infrastructure**: JWT-based authentication and a relational database for history tracking.
- **PDF Reporting**: Exporting analysis results as professional reports (using `jsPDF`).

---

## 2. Tech Stack

### Frontend (Modern React SPA)
- **Framework**: React 18 with Vite (Build tool).
- **Styling**: Tailwind CSS (Utility-first CSS) & Vanilla CSS for custom components.
- **Animations**: Framer Motion (for smooth UI transitions and "AI Thinking" states).
- **Icons**: Lucide React.
- **Routing**: React Router DOM v6 (with Protected Routes).
- **State/API**: Axios for HTTP requests, `localStorage` for session persistence.
- **Charts**: Recharts (for dashboard analytics).
- **Notifications**: React Hot Toast.

### Backend (Python Microservices)
- **Framework**: Flask (Web server).
- **Security**: Flask-JWT-Extended (Token-based auth), Werkzeug (Password hashing).
- **Machine Learning**: TensorFlow 2.15 (Model serving), PIL/Pillow (Image processing), NumPy (Matrix ops).
- **Database**: SQLite3 (Relational storage).
- **CORS**: Flask-CORS (Cross-Origin Resource Sharing).

---

## 3. Architecture & Design Patterns

### Frontend Architecture
- **Component-Based**: Organized into `auth/`, `dashboard/`, `analyzer/`, and `landing/` modules.
- **Service Layer**: `src/services/api.js` centralizes all API interactions using an Axios instance with interceptors for automatic JWT attachment.
- **Data-Driven UI**: `src/data/remedies.js` serves as a "Knowledge Base" mapping disease classes to localized advice.

### Backend Architecture
- **RESTful API**: Stateless endpoints for auth, prediction, and history management.
- **Database Layer**: `backend/database.py` uses a standard CRUD pattern with `sqlite3`.
- **Pre-Redirect-Get / JWT flow**: Uses JWT tokens stored in the frontend's `localStorage` for secure session management.

### AI Integration Logic (The "Brain")
- **Model**: MobileNetV2 architecture saved in `.h5` format.
- **Custom Layers**: Implements `TrueDivide` and `CustomRescaling` Keras layers for model compatibility.
- **Image Pipeline**:
    1. Input: Any image (converted to RGB).
    2. Resize: Fixed 224x224 pixels.
    3. Normalization: Handled by custom layers within the model graph.
    4. Prediction: Returns an array of probabilities for 38 classes.
- **Severity Mapping**: Logic in `app.py` maps confidence scores to severity levels:
    - ≥ 90%: "High"
    - ≥ 70%: "Medium"
    - < 70%: "Low"

---

## 4. Data Models (Database Schema)

### `users` Table
- `id` (PK), `name`, `email` (Unique), `password_hash`, `farm_size`, `location`, `primary_crops`, `created_at`, `last_login`.

### `analyses` Table
- `id` (PK), `user_id` (FK), `image_filename`, `disease_class`, `confidence`, `crop_name`, `created_at`.

### Extended Tables (Service Extensions)
- `recommendations`: Custom crop recommendations based on soil/climate.
- `consultations`: Booking system for expert consultations.

---

## 5. API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and get JWT | No |
| GET | `/api/auth/me` | Get current user profile | Yes |
| POST | `/api/predict` | Upload image for analysis | Yes |
| GET | `/api/history` | Get analysis history | Yes |
| GET | `/api/stats` | Get aggregate statistics | Yes |
| DELETE| `/api/history/:id`| Delete specific analysis | Yes |
| GET | `/health` | Check server and model status| No |

---

## 6. Project Structure

```text
FINAL/
├── backend/
│   ├── app.py              # Main Flask entry point & API logic
│   ├── database.py         # SQLite schema and CRUD operations
│   ├── auth_utils.py       # JWT decorators & validation logic
│   ├── smartcrop.db        # SQLite Database file
│   └── plant_disease_mobilenetv2.h5 # AI Model weights
├── src/
│   ├── components/         # UI Components (Auth, Dashboard, Analyzer)
│   ├── services/           # API interaction layer (Axios)
│   ├── data/               # Remedies database (JSON/JS)
│   ├── utils/              # Helper functions
│   └── App.jsx             # Main router and app shell
├── tailwind.config.js      # Global theme configuration
└── package.json            # Frontend dependency manifest
```

---

## 7. How to Setup & Run

### Backend
1. `cd backend`
2. `python -m venv venv`
3. `venv\Scripts\activate`
4. `pip install -r requirements.txt`
5. `python app.py` (Starts at port 5000)

### Frontend
1. `npm install`
2. `npm run dev` (Starts at port 5173 with proxy to 5000)

---

## 8. Logic Breakdown for LLM

- **Authentication**: When a user logs in, the backend generates a JWT. The frontend stores this in `localStorage` and adds it to the `Authorization: Bearer <token>` header for all subsequent requests via Axios interceptors.
- **Disease Mapping**: The backend returns a class name like `Tomato___Early_blight`. The frontend then looks up this key in `src/data/remedies.js` to display the specific `diagnosis`, `immediateAction`, and `prevention`.
- **Dashboards**: The statistics are calculated in `database.py` (SQL counts) and visualized using `Recharts` on the frontend.
- **Image Security**: Images are processed in-memory as `BytesIO` streams and not permanently stored on the disk in the current version (except for the filename in the DB).

---
*Built as a professional-grade AgTech solution.*
