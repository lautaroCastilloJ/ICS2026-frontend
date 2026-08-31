import { instance } from '../../shared/api/axiosInstance';

/**
 * Servicio para iniciar sesión como administrador
 * Solo permite acceso si el usuario es administrador
 * 
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<{data: object, error: null | object}>} {token, role} si es administrador, error si falla o no es administrador
 */
export const adminLogin = async (username, password) => {
  try {
    const response = await instance.post('api/auth/login', { username, password });

    // Verificar si el usuario es administrador
    if (response.data.role !== 'Administrador' && response.data.role !== 'Admin') {
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
      error: error.response?.data?.message || error.message 
    };
  }
};
