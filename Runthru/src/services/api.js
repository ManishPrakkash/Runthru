import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SERVER_URL) || 'http://localhost:5000';

const api = axios.create({
  baseURL: SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
