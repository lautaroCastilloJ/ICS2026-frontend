import { instance } from '../../shared/api/axiosInstance';
import { getErrorMessage } from '../../shared/helpers/apiError';

/**
 * Crea un nuevo administrador. Requiere estar autenticado como administrador:
 * el backend responde 401/403 en cualquier otro caso.
 *
 * @param {object} admin - { userName, email, password, displayName }
 * @returns {Promise<{data: string | null, error: null | string}>} Id del usuario creado
 */
export const createAdmin = async ({ userName, email, password, displayName }) => {
  try {
    const response = await instance.post('api/admin/users', {
      userName,
      email,
      password,
      displayName: displayName || userName,
    });

    return {
      data: response.data.userId,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error, 'Error al crear el administrador'),
    };
  }
};
