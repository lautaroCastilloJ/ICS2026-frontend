import axios from 'axios';
import { expireSession, getValidToken } from '../../auth/helpers/session';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    // Un token vencido no se envia: getValidToken lo descarta.
    const token = getValidToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (config) => { return config; },
  (error) => {
    if (error.status === 401) {
      if (window.location.pathname.includes('/admin/')) {
        localStorage.clear();
        window.location.href = '/login';
      } else {
        // Avisar a AuthProvider: sin esto el Header seguia mostrando la sesion
        // abierta aunque el token ya no existiera.
        expireSession();
      }
    }

    return Promise.reject(error);
  },
);

export { instance };
