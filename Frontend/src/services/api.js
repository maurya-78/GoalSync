import axios from 'axios';
import toast from 'react-hot-toast';

// 1. Create Axios Instance
const API = axios.create({
  // Vite .env se URL uthayega, fallback to local
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookies handle karne ke liye (important for Auth)
});

// 2. Request Interceptor: Inject JWT Token
// Har request nikalne se pehle check karega ki LocalStorage mein token hai ya nahi
API.interceptors.request.use(
  (config) => {
    const userState = localStorage.getItem('user_state');
    if (userState) {
      const { token } = JSON.parse(userState);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Global Error Handling
// Backend se aane wale response ko filter karta hai
API.interceptors.response.use(
  (response) => response, // Status 2xx hai toh direct pass
  (error) => {
    const message = error.response?.data?.message || 'Network Protocol Error';
    
    // Status 401: Token expired ya invalid identity
    if (error.response?.status === 401) {
      localStorage.removeItem('user_state');
      toast.error("Session Void: Re-authorization Required.");
      // Soft redirect to login if window exists
      if (typeof window !== 'undefined') window.location.href = '/login';
    } 
    
    // Status 403: Forbidden access (Role issue)
    else if (error.response?.status === 403) {
      toast.error("Access Denied: Insufficient Clearance Level.");
    } 
    
    // Generic Errors (404, 500 etc)
    else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default API;