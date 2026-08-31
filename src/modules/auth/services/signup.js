import { instance } from '../../shared/api/axiosInstance';

/**
 * Servicio para registrar un nuevo usuario.
 * Por defecto crea clientes, pero permite especificar el rol.
 *
 * @param {string} userName - Nombre de usuario.
 * @param {string} email - Email del usuario.
 * @param {string} password - Contrasena del usuario.
 * @param {string} displayName - Nombre mostrado del usuario (se usa userName si no se envia).
 * @param {string} phoneNumber - Numero de telefono del usuario.
 * @param {string} role - Rol del usuario (Administrador | Cliente). Por defecto Cliente.
 * @returns {Promise<{data: string | null, error: null | object}>} Token JWT si es exitoso, error si falla.
 */
export const signup = async (userName, email, password, displayName, phoneNumber, role = 'Cliente') => {
  try {
    const response = await instance.post('api/auth/register', {
      userName,
      password,
      email,
      displayName: displayName || userName,
      phoneNumber,
      role,
    });

    return {
      data: response.data.token,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response?.data || error.message,
    };
  }
};
