import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'smartcrop_token';
const USER_KEY = 'smartcrop_user';

// Create axios instance
const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } });

// Auto-attach JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, (error) => Promise.reject(error));

// Auto-logout on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, user } = response.data;
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Registration failed' };
        }
    },
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    },
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return { success: true };
    },
    isAuthenticated: () => !!(localStorage.getItem(TOKEN_KEY) && localStorage.getItem(USER_KEY)),
    getCurrentUser: () => {
        const str = localStorage.getItem(USER_KEY);
        if (str) { try { return JSON.parse(str); } catch { return null; } }
        return null;
    },
    fetchCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            const { user } = response.data;
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            return user;
        } catch { return null; }
    },
    getToken: () => localStorage.getItem(TOKEN_KEY),
    changePassword: async (currentPassword, newPassword) => {
        try {
            const response = await api.put('/auth/password', { currentPassword, newPassword });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to change password' };
        }
    }
};

export const analysisService = {
    // Stateless prediction — does NOT save to DB
    predict: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post('/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Prediction failed' };
        }
    },
    // Called after farmer confirms — saves analysis to DB
    saveAnalysis: async (analysisData) => {
        try {
            const response = await api.post('/analyses/save', analysisData);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to save analysis' };
        }
    },
    getHistory: async (limit = 50) => {
        try {
            const response = await api.get(`/history?limit=${limit}`);
            return { success: true, data: response.data.analyses };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to fetch history' };
        }
    },
    getStats: async () => {
        try {
            const response = await api.get('/stats');
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to fetch stats' };
        }
    },
    deleteHistory: async (analysisId) => {
        try {
            const response = await api.delete(`/history/${analysisId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to delete analysis' };
        }
    },
    deleteAllHistory: async () => {
        try {
            const response = await api.delete('/history');
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to delete history' };
        }
    }
};

export const cropService = {
    createCrop: async (cropData) => {
        try {
            const response = await api.post('/crops', cropData);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to create crop' };
        }
    },
    getCrops: async () => {
        try {
            const response = await api.get('/crops');
            return { success: true, data: response.data.crops };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to fetch crops' };
        }
    },
    deleteCrop: async (cropId) => {
        try {
            const response = await api.delete(`/crops/${cropId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to delete crop' };
        }
    },
    getCropTrend: async (cropId) => {
        try {
            const response = await api.get(`/crops/${cropId}/trend`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to fetch trend' };
        }
    },
    injectTestData: async (cropId) => {
        try {
            const response = await api.post('/dev/inject-trend', { cropId });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Inject failed' };
        }
    }
};

export default api;
