import api from './axios'; // Hamara custom axios instance

/**
 * AUTHENTICATION SERVICE
 * -----------------------
 * Ye service identity management aur session persistence 
 * ke liye zimmedar hai.
 */
const authService = {
  
  /**
   * User Login: Backend se token aur user data fetch karta hai
   * @param {Object} credentials - { email, password }
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    // Agar response mein token hai, toh session ko persist karein
    if (response.data.token) {
      localStorage.setItem('user_state', JSON.stringify(response.data));
    }
    
    return response.data;
  },

  /**
   * User Registration: Naya account create karta hai
   * @param {Object} userData - { name, email, password, role }
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    
    // Register ke baad aksar system auto-login karwata hai
    if (response.data.token) {
      localStorage.setItem('user_state', JSON.stringify(response.data));
    }
    
    return response.data;
  },

  /**
   * Logout: Local state aur storage ko clear karta hai
   */
  logout: () => {
    localStorage.removeItem('user_state');
    // Note: Redux state update component level ya slice level par hogi
  },

  /**
   * Get Current Session: Storage se user data nikalta hai
   */
  getCurrentUser: () => {
    const userState = localStorage.getItem('user_state');
    return userState ? JSON.parse(userState) : null;
  },

  /**
   * Password Reset Request
   */
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }
};

export default authService;