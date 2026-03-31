// Mock Authentication Utilities
// This is structured to be easily replaced with Firebase/Auth0

const AUTH_KEY = 'smartcrop_auth';

export const mockAuth = {
    // Login - accepts any email/password for demo
    login: (email, password) => {
        if (email && password) {
            const user = {
                email,
                name: email.split('@')[0],
                authenticated: true,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, error: 'Invalid credentials' };
    },

    // Register - accepts any user data for demo
    register: (name, email, password) => {
        if (name && email && password) {
            const user = {
                email,
                name,
                authenticated: true,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, error: 'Invalid registration data' };
    },

    // Logout
    logout: () => {
        localStorage.removeItem(AUTH_KEY);
        return { success: true };
    },

    // Check if authenticated
    isAuthenticated: () => {
        const authData = localStorage.getItem(AUTH_KEY);
        if (authData) {
            try {
                const user = JSON.parse(authData);
                return user.authenticated === true;
            } catch (e) {
                return false;
            }
        }
        return false;
    },

    // Get current user
    getCurrentUser: () => {
        const authData = localStorage.getItem(AUTH_KEY);
        if (authData) {
            try {
                return JSON.parse(authData);
            } catch (e) {
                return null;
            }
        }
        return null;
    }
};
