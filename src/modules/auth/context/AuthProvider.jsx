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

    localStorage.setItem('token', data);
    setIsAuthenticated(true);

    return { error: null };
  };

  const singup = async (userName, email, password, displayName, phoneNumber) => {
    const { data, error } = await signup(userName, email, password, displayName, phoneNumber);

    if (error) {
      return { error };
    }

    localStorage.setItem('token', data);
    setIsAuthenticated(true);

    return { error: null };
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
