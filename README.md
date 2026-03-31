# SmartCrop - Professional AgTech Platform

A production-ready agricultural disease detection platform powered by AI. Built with React and Flask, SmartCrop helps farmers detect crop diseases using computer vision and provides actionable treatment recommendations.

## 🌟 Features

- **AI-Powered Disease Detection**: Upload crop images for instant disease analysis
- **38 Disease Classes**: Supports detection across multiple crops including tomato, potato, corn, grape, apple, and more
- **Smart Prescriptions**: Get detailed diagnosis, immediate action steps, and prevention measures
- **Professional Dashboard**: Track scans, view statistics, and monitor weather conditions
- **Mock Authentication**: Demo-ready login system (easily replaceable with Firebase/Auth0)
- **Responsive Design**: Mobile-first design optimized for farmers in the field

## 🚀 Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for smooth animations
- Lucide React for icons
- React Router for navigation

### Backend
- Flask (Python)
- TensorFlow 2.15 for ML model serving
- Custom layer support for .h5 model loading
- CORS enabled for cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- pip

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

   The frontend will start at `http://localhost:5173`

### Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended)**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # OR
   source venv/bin/activate  # Mac/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Flask server**
   ```bash
   python app.py
   ```

   The backend will start at `http://localhost:5000`

## 🎯 Usage

1. **Start both servers**: Run the backend (`python app.py`) and frontend (`npm run dev`)

2. **Open the app**: Navigate to `http://localhost:5173` in your browser

3. **Login**: Use any email and password (demo mode accepts all credentials)

4. **Dashboard**: View your stats, weather information, and access the analyzer

5. **Analyze Crops**:
   - Click "Start Crop Analysis"
   - Upload or drag-and-drop a crop image
   - Click "Analyze Crop"
   - View results with confidence meter
   - Get Smart Prescription with treatment recommendations

## 📂 Project Structure

```
FINAL/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── requirements.txt       # Python dependencies
│   ├── plant_disease_mobilenetv2.h5  # TensorFlow model
│   └── class_names.json       # Disease class labels
├── src/
│   ├── components/
│   │   ├── auth/             # Login & Register
│   │   ├── dashboard/        # Dashboard, Stats, Weather
│   │   └── analyzer/         # Crop analyzer components
│   ├── data/
│   │   └── remedies.js       # Treatment recommendations database
│   ├── utils/
│   │   └── mockAuth.js       # Mock authentication utilities
│   ├── App.jsx               # Main app with routing
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── index.html                # HTML template
├── package.json              # Frontend dependencies
├── vite.config.js            # Vite configuration
└── tailwind.config.js        # Tailwind theme configuration
```

## 🎨 Design System

- **Primary Color**: Forest Green (#10b981)
- **Typography**: Inter & Poppins
- **Theme**: Modern AgTech with professional SaaS aesthetic
- **Animations**: Framer Motion for smooth, engaging interactions

## 🔐 Authentication

Currently uses mock authentication for demo purposes:
- Any email/password combination will log you in
- Session stored in localStorage
- Easily replaceable with Firebase, Auth0, or custom backend

To replace with real auth:
1. Modify `src/utils/mockAuth.js`
2. Implement your auth provider's SDK
3. Update login/register components

## 🧪 Model Integration

The backend uses a MobileNetV2-based model trained on plant diseases:
- **Input**: 224x224 RGB images
- **Preprocessing**: Normalize to [-1, 1] range
- **Output**: Disease class with confidence score
- **Custom Layers**: TrueDivide and CustomRescaling for compatibility

## 📊 Supported Crops & Diseases

- Apple (scab, black rot, cedar rust, healthy)
- Tomato (9 disease types + healthy)
- Potato (early blight, late blight, healthy)
- Corn (3 disease types + healthy)
- Grape (3 disease types + healthy)
- And many more...

See `backend/class_names.json` for complete list.

## 🌐 API Endpoints

### POST `/predict`
- **Description**: Analyze crop image for disease detection
- **Input**: FormData with 'file' field (image)
- **Output**: JSON with class, confidence, severity

### GET `/health`
- **Description**: Check server health
- **Output**: Server status and model load state

## 🔮 Future Enhancements

- Real authentication with Firebase/Auth0
- Historical scan tracking
- Multi-language support
- Weather API integration
- Export reports as PDF
- Mobile app version
- Community forum for farmers

## 🤝 Contributing

This is a demo project. Feel free to fork and enhance!

## 📝 License

MIT License - feel free to use for educational and commercial purposes.

## 👨‍💻 Developer Notes

- Frontend proxy configured in `vite.config.js` for seamless API calls
- All 38 disease classes have detailed remedy information in `src/data/remedies.js`
- Confidence meter uses color coding: Green (≥90%), Yellow (70-89%), Red (<70%)
- Loading animation shows AI thinking process for better UX

## 🐛 Troubleshooting

**Backend won't start:**
- Ensure TensorFlow is installed correctly
- Check model file path is correct
- Verify Python version (3.10+ recommended)

**Frontend not connecting to backend:**
- Check both servers are running
- Verify CORS is enabled in Flask
- Check proxy configuration in `vite.config.js`

**Model loading errors:**
- Ensure custom layer classes are registered
- Check TensorFlow version compatibility
- Verify .h5 file is not corrupted

---

**Built with ❤️ for farmers worldwide 🌾**
