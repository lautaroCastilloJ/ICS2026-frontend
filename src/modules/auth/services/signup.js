import { instance } from '../../shared/api/axiosInstance';
import { getErrorMessage } from '../../shared/helpers/apiError';

/**
 * Servicio para registrar un nuevo cliente.
 * El registro publico siempre crea clientes: el backend no acepta el rol.
 * Los administradores se crean desde el panel (modules/users).
 *
 * @param {string} userName - Nombre de usuario.
 * @param {string} email - Email del usuario.
 * @param {string} password - Contrasena del usuario.
 * @param {string} displayName - Nombre mostrado del usuario (se usa userName si no se envia).
 * @param {string} phoneNumber - Numero de telefono del usuario.
 * @returns {Promise<{data: string | null, error: null | string}>} Id del usuario creado si es exitoso, error si falla.
 */
export const signup = async (userName, email, password, displayName, phoneNumber) => {
  try {
    const response = await instance.post('api/auth/register', {
      userName,
      password,
      email,
      displayName: displayName || userName,
      phoneNumber,
    });

    return {
      data: response.data.userId,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error, 'Error al registrar el usuario'),
    };
  }
};
