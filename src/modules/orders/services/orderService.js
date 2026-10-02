import { instance } from '../../shared/api/axiosInstance';
import { getErrorMessage } from '../../shared/helpers/apiError';

/**
 * Servicio para crear una nueva orden
 * 
 * @param {array} items - Items de la orden [{id, quantity}, ...]
 * @param {object} shippingAddress - Dirección de envío { street, number, city, province, postalCode }
 * @param {object} billingAddress - Dirección de facturación (mismo formato)
 * @param {string} notes - Notas de la orden
 * @returns {Promise<{data: object, error: null | string}>} Respuesta del servidor
 */
export const createOrder = async (items, shippingAddress, billingAddress, notes) => {
  try {
    // Preparamos los datos de la orden para enviar al backend
    const orderPayload = {
      shippingAddress,
      billingAddress,
      notes,
      orderItems: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    // Realizamos una petición POST al endpoint de órdenes
    const response = await instance.post('api/orders', orderPayload);

    // Retornamos la respuesta del servidor
    return { 
      data: response.data, 
      error: null 
    };
  } catch (error) {
    // Si hay un error, lo retornamos
    console.error('Error al crear la orden:', error.message);
    return { 
      data: null, 
      error: getErrorMessage(error, 'Error al procesar la orden'),
    };
  }
};

/**
 * Obtiene los detalles completos de una orden por su ID
 * 
 * @param {string} orderId - ID de la orden
 * @returns {Promise<{data: object, error: null | string}>} Detalles completos de la orden
 */
export const getOrderById = async (orderId) => {
  try {
    // Realizamos una petición GET al endpoint de detalle de orden
    const response = await instance.get(`api/orders/${orderId}`);

    // Retornamos la respuesta del servidor
    return { 
      data: response.data, 
      error: null 
    };
  } catch (error) {
    console.error('Error al obtener detalle de orden:', error.message);
    return { 
      data: null, 
      error: getErrorMessage(error, 'Error al cargar el detalle de la orden'),
    };
  }
};

/**
 * Obtiene el historial de órdenes del usuario autenticado, paginado
 *
 * @param {number} pageNumber - Número de página (empieza en 1)
 * @param {number} pageSize - Cantidad de órdenes por página
 * @returns {Promise<{data: object, error: null | string}>} PagedResult { items, totalCount, totalPages, ... }
 */
export const getUserOrders = async (pageNumber = 1, pageSize = 10) => {
  try {
    // Realizamos una petición GET al endpoint de órdenes del usuario
    const response = await instance.get('api/orders/my-orders', {
      params: { pageNumber, pageSize },
    });

    // Retornamos la respuesta del servidor
    return { 
      data: response.data, 
      error: null 
    };
  } catch (error) {
    console.error('Error al obtener órdenes:', error.message);
    return { 
      data: null, 
      error: getErrorMessage(error, 'Error al cargar las órdenes'),
    };
  }
};
