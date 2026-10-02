import { instance } from '../../shared/api/axiosInstance';
import { getErrorMessage } from '../../shared/helpers/apiError';
import { frontendErrorMessage } from '../helpers/backendError';
import { ROLES } from '../../shared/constants/roles';

/**
 * Servicio para iniciar sesión como administrador
 * Solo permite acceso si el usuario es administrador
 * 
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<{data: object, error: null | string}>} {token, role} si es administrador, error si falla o no es administrador
 */
export const adminLogin = async (username, password) => {
  try {
    const response = await instance.post('api/auth/login', { username, password });

    // Verificar si el usuario es administrador
    if (response.data.role !== ROLES.ADMIN) {
      return { 
        data: null, 
        error: 'Solo los administradores pueden acceder a esta sección' 
      };
    }

    // Si es administrador, retornamos el token y el rol
    return { 
      data: {
        token: response.data.token,
        role: response.data.role
      }, 
      error: null 
    };
  } catch (error) {
    return { 
      data: null, 
      error: getErrorMessage(error, 'Error al iniciar sesión', frontendErrorMessage),
    };
  }
};
