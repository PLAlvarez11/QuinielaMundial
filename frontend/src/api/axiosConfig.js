import axios from 'axios';

// URL base del backend desde variable de entorno
const API_BASE_URL = `${window.location.origin}/api`;

// Crear instancia de axios configurada
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para agregar token de autenticación si existe
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      console.warn('Sesión expirada. Limpiando datos locales...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/m1-auth/login';
    } else if (error.response?.status === 403) {
      // Acceso prohibido
      console.warn('Acceso prohibido (403)');
    } else if (error.response?.status >= 500) {
      // Error del servidor
      console.error('Error del servidor:', error.response?.status);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

