import { instance } from '../../shared/api/axiosInstance';
import { getErrorMessage } from '../../shared/helpers/apiError';

/**
 * Lista paginada de todos los pedidos (solo administradores).
 *
 * @param {number} pageNumber
 * @param {number} pageSize
 * @param {string} [status] - Estado de OrderStatus ('Pending', 'Shipped'...); vacio = todos
 * @returns {Promise<{data: {total: number, items: array} | null, error: null | string}>}
 */
export const getAllOrders = async (pageNumber = 1, pageSize = 10, status = '') => {
  try {
    const response = await instance.get('api/orders/admin', {
      params: {
        pageNumber,
        pageSize,
        status: status || undefined,
      },
    });

    return {
      data: {
        total: response.data.totalCount || 0,
        items: response.data.items || [],
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);

    return {
      data: null,
      error: getErrorMessage(error, 'Error al cargar los pedidos'),
    };
  }
};

/**
 * Cambia el estado de un pedido (PUT /api/orders/{id}/status). El dominio
 * valida la transicion: una no permitida responde 422 con su mensaje.
 *
 * @param {string} orderId
 * @param {string} newStatus - Estado de OrderStatus ('Processing', 'Shipped'...)
 * @returns {Promise<{data: object | null, error: null | string}>} Pedido actualizado
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await instance.put(`api/orders/${orderId}/status`, { newStatus });

    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error updating order status:', error);

    return {
      data: null,
      error: getErrorMessage(error, 'No se pudo actualizar el estado del pedido'),
    };
  }
};
