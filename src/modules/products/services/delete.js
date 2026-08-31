import { instance } from '../../shared/api/axiosInstance';

/**
 * Elimina un producto (lo deshabilita)
 * @param {string} id - ID del producto
 * @returns {Promise<{data: null, error: null}|{data: null, error: string}>}
 */
export const deleteProduct = async (id) => {
  try {
    await instance.patch(`/api/products/${id}/disable`);

    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      data: null,
      error: error.response?.data?.message || error.message || 'Error al eliminar el producto',
    };
  }
};

/**
 * Habilita un producto
 * @param {string} id - ID del producto
 * @returns {Promise<{data: null, error: null}|{data: null, error: string}>}
 */
export const enableProduct = async (id) => {
  try {
    await instance.patch(`/api/products/${id}/enable`);

    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.error('Error enabling product:', error);
    return {
      data: null,
      error: error.response?.data?.message || error.message || 'Error al habilitar el producto',
    };
  }
};
