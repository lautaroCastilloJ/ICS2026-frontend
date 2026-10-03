import { createContext, useEffect, useState } from 'react';
import { login } from '../services/login';
import { signup } from '../services/signup';
import { SESSION_EXPIRED_EVENT, getValidToken } from '../helpers/session';

const AuthContext = createContext();

// Cada cuanto se revisa si el token vencio con la app abierta.
const EXPIRY_CHECK_MS = 60 * 1000;

function AuthProvider({ children }) {
  // Un token vencido no cuenta como sesion (getValidToken lo descarta).
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getValidToken()));

  useEffect(() => {
    // 401 de la API (interceptor de axios): la sesion termino.
    const handleExpired = () => setIsAuthenticated(false);

    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);

    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    // El token tambien vence sin hacer requests (dura Jwt:ExpireInMinutes).
    const timer = setInterval(() => {
      if (!getValidToken()) setIsAuthenticated(false);
    }, EXPIRY_CHECK_MS);

    return () => clearInterval(timer);
  }, [isAuthenticated]);

  const singout = () => {
    // Eliminar token de autenticación
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Limpiar el carrito de compras
    localStorage.removeItem('cart');

    // Actualizar estado de autenticación
    setIsAuthenticated(false);
  };

  const singin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    // Sesion de cliente: se descarta un posible rol de administrador previo
    localStorage.setItem('token', data);
    localStorage.removeItem('role');
    setIsAuthenticated(true);

    return { error: null };
  };

  // El registro no inicia sesion: el backend devuelve solo el id del usuario
  // creado (sin token), y el usuario debe loguearse a continuacion.
  const singup = async (userName, email, password, displayName, phoneNumber) => {
    const { error } = await signup(userName, email, password, displayName, phoneNumber);

    return { error: error ?? null };
  };

  return (
    <AuthContext.Provider
      value={ {
        isAuthenticated,
        singin,
        singup,
        singout,
      } }
    >
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthProvider,
  AuthContext,
};
