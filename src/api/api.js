import axios from 'axios';

//const API_URL = 'http://localhost:8080/api'; // Ajusta URL según backend
const API_URL = 'https://elecciones-r62h.onrender.com';
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

export default api;
