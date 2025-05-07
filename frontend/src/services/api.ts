// src/services/api.ts
import axios, { AxiosError } from 'axios';
import useAuthStore from '../store/useAuthStore';

// Create a singleton axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: inject the JWT if present
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: catch 401 to auto-logout or refresh
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Optionally clear token & redirect to login
      useAuthStore.getState().setToken(null);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;