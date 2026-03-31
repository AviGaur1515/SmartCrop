import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './components/landing/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CropAnalyzer from './components/analyzer/CropAnalyzer';
import CropsPage from './components/crops/CropsPage';
import KnowledgePage from './components/knowledge/KnowledgePage';
import ConsultPage from './components/consult/ConsultPage';
import Layout from './components/layout/Layout';
import { authService } from './services/api';

// Protected Route — wraps children in the Layout sidebar
const ProtectedRoute = ({ children }) => {
    if (!authService.isAuthenticated()) return <Navigate to="/login" replace />;
    return <Layout>{children}</Layout>;
};

function App() {
    return (
        <Router>
            <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes — all wrapped in Layout (sidebar) */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/analyzer" element={<ProtectedRoute><CropAnalyzer /></ProtectedRoute>} />
                <Route path="/crops" element={<ProtectedRoute><CropsPage /></ProtectedRoute>} />
                <Route path="/knowledge" element={<ProtectedRoute><KnowledgePage /></ProtectedRoute>} />
                <Route path="/consult" element={<ProtectedRoute><ConsultPage /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
