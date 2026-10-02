import { instance } from '../../shared/api/axiosInstance';
import { getErrorMessage } from '../../shared/helpers/apiError';

/**
 * Actualiza un producto existente
 * @param {string} id - ID del producto
 * @param {object} formData - Datos del producto
 * @returns {Promise<{data: object, error: null}|{data: null, error: string}>}
 */
export const updateProduct = async (id, formData) => {
  try {
    // Convertir SKU a mayúsculas y limpiar
    const sku = (formData.sku || '').toUpperCase().trim();
    
    // Usar internalCode o cui, con validación
    const internalCode = (formData.internalCode || formData.cui || 'INT-' + Math.random().toString(36).substr(2, 9)).trim();
    
    const response = await instance.put(`/api/products/${id}`, {
      sku,
      internalCode,
      name: (formData.name || '').trim(),
      description: (formData.description || '').trim() || null,
      currentUnitPrice: Number(formData.currentUnitPrice) || 0,
      stockQuantity: Number(formData.stockQuantity) || 0,
      imageUrl: (formData.imageUrl || '').trim() || null,
    });

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
