import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const userState = localStorage.getItem('user_state');
    if (userState) {
      try {
        const { token } = JSON.parse(userState);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        localStorage.removeItem('user_state');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Agar backend crash ho gaya ya response nahi aaya
    if (!error.response) {
      toast.error("Critical: Network Protocol Breach or Server Offline");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message = error.response.data?.message || 'Gateway Communication Failure';

    // 2. Session Expired (401)
    if (status === 401) {
      // Multiple toasts se bachne ke liye check
      if (window.location.pathname !== '/login') {
        toast.error('Session Void. Re-authenticating...');
        localStorage.removeItem('user_state');
        window.location.href = '/login';
      }
    } 
    
    // 3. Permission Denied (403)
    else if (status === 403) {
      toast.error('Access Denied: Insufficient Clearance.');
    }

    // 4. Rate Limiting (429)
    else if (status === 429) {
      toast.error('Too many requests. Please slow down.');
    }

    // 5. General Errors (SABSE IMPORTANT: Yahan hum error message dikhayenge)
    else {
      // Multiple error toasts ko block karne ke liye ek hi bar toast dikhayein
      toast.error(message, { id: 'api-error' }); 
    }

    return Promise.reject(error);
  }
);

export default api;