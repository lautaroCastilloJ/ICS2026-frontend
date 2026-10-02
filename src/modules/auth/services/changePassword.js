import { instance } from '../../shared/api/axiosInstance';
import { getErrorMessage } from '../../shared/helpers/apiError';

/**
 * Cambia la contraseña del usuario autenticado (el backend lo toma del token).
 *
 * @param {string} currentPassword - Contraseña actual
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<{error: null | string}>}
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    await instance.post('api/auth/change-password', { currentPassword, newPassword });

    return { error: null };
  } catch (error) {
    return { error: getErrorMessage(error, 'Error al cambiar la contraseña') };
  }
};
