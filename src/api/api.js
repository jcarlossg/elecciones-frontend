import axios from 'axios';
import { logout } from '../utils/auth';

//const API_URL = 'http://localhost:8080/api'; // Ajusta URL según backend
const API_URL = 'https://elecciones-r62h.onrender.com/api/';
// Instancia axios con baseURL
const api = axios.create({
  baseURL: API_URL,
});

// Agrega interceptor para añadir JWT en cada request si existe
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403) {
      // Si da 403, limpia sesión y redirige
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
