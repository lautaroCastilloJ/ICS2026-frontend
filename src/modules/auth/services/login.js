import { instance } from '../../shared/api/axiosInstance';

/**
 * Servicio para iniciar sesión
 * Valida que el usuario no sea un administrador
 * Los administradores solo pueden acceder por /login
 * 
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<{data: string | null, error: null | object}>} Token JWT si es exitoso y es cliente, error si falla o es administrador
 */
export const login = async (username, password) => {
  try {
    const response = await instance.post('api/auth/login', { username, password });

    // Verificar si la respuesta contiene información del rol
    // Si el backend retorna un rol "Administrador", rechazamos el login desde el modal
    if (response.data.role === 'Administrador') {
      return { 
        data: null, 
        error: 'Los administradores deben usar /login para acceder' 
      };
    }

    // Si es un cliente, retornamos el token
    return { 
      data: response.data.token, 
      error: null 
    };
  } catch (error) {
    return { 
      data: null, 
      error: error.response?.data || error.message 
    };
  }
};