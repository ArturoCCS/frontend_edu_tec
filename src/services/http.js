import { useAuthStore } from '@/stores/authStore.js';
import axios from 'axios';

const http = axios.create({
  baseURL: (import.meta.env.VITE_APP_URL_BACKEND || 'http://localhost:3000') + '/api',
  withCredentials: true, 
});

http.interceptors.request.use((config) => {
  try {
    const authStore = useAuthStore();
    const token = authStore?.token || localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export default http;