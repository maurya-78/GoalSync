import axios from 'axios';
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
instance.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('user_state');
    if (userData) {
      const { token } = JSON.parse(userData);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user_state');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;