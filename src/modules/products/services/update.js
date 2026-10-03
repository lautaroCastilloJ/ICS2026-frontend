import { instance } from '../../shared/api/axiosInstance';
import { getErrorMessage } from '../../shared/helpers/apiError';
import { toProductRequest } from './create';

/**
 * Actualiza un producto existente
 * @param {string} id - ID del producto
 * @param {object} formData - Valores de ProductFields
 * @returns {Promise<{data: object, error: null}|{data: null, error: string}>}
 */
export const updateProduct = async (id, formData) => {
  try {
    const response = await instance.put(`/api/products/${id}`, toProductRequest(formData));

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error('Error updating product:', error);

    return {
      data: null,
      error: getErrorMessage(error, 'Error al actualizar el producto'),
    };
  }
};
