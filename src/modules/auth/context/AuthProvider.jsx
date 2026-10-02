import { createContext, useState } from 'react';
import { login } from '../services/login';
import { signup } from '../services/signup';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');

    return Boolean(token);
  });

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
