import { instance } from '../../shared/api/axiosInstance';
import { getErrorMessage } from '../../shared/helpers/apiError';

/**
 * Body de ProductRequest a partir del formulario (ProductFields).
 * Los campos opcionales vacios se envian como null.
 */
export const toProductRequest = (formData) => ({
  sku: String(formData.sku ?? '').trim().toUpperCase(),
  internalCode: String(formData.internalCode ?? '').trim(),
  name: String(formData.name ?? '').trim(),
  description: String(formData.description ?? '').trim() || null,
  currentUnitPrice: Number(formData.currentUnitPrice),
  stockQuantity: Number(formData.stockQuantity),
  imageUrl: String(formData.imageUrl ?? '').trim() || null,
});

/**
 * Crea un producto.
 * @param {object} formData - Valores de ProductFields
 * @returns {Promise<{data: object | null, error: null | string}>}
 */
export const createProduct = async (formData) => {
  try {
    const response = await instance.post('/api/products', toProductRequest(formData));

    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error creating product:', error);

    return { data: null, error: getErrorMessage(error, 'Error al crear el producto') };
  }
};
