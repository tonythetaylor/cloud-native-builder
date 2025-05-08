// src/services/api.ts
import axios, { AxiosError } from 'axios';
import useAuthStore from '../store/useAuthStore';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  console.log("🛡 Injecting token:", token);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().setToken(null);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;