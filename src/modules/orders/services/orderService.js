import { instance } from '../../shared/api/axiosInstance';

/**
 * Servicio para crear una nueva orden
 * 
 * @param {array} items - Items de la orden [{id, quantity}, ...]
 * @param {string} shippingAddress - Dirección de envío
 * @param {string} billingAddress - Dirección de facturación
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
      error: error.response?.data?.message || error.message 
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
      error: error.response?.data?.message || error.message 
    };
  }
};

/**
 * Obtiene el historial de órdenes del usuario autenticado
 * 
 * @returns {Promise<{data: array, error: null | string}>} Lista de órdenes
 */
export const getUserOrders = async () => {
  try {
    // Realizamos una petición GET al endpoint de órdenes del usuario
    const response = await instance.get('api/orders/my-orders');

    // Retornamos la respuesta del servidor
    return { 
      data: response.data, 
      error: null 
    };
  } catch (error) {
    console.error('Error al obtener órdenes:', error.message);
    return { 
      data: null, 
      error: error.response?.data?.message || error.message 
    };
  }
};
