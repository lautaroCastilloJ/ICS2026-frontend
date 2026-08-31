import { instance } from '../../shared/api/axiosInstance';

export const getAllOrders = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await instance.get('api/orders/admin', {
      params: {
        pageNumber,
        pageSize,
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
      error: error.response?.data?.message || error.message || 'Error al cargar las ordenes',
    };
  }
};

export const getAdminOrderById = async (orderId) => {
  try {
    const response = await instance.get(`api/orders/admin/${orderId}`);
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    if (error?.response?.status === 404) {
      try {
        const fallback = await instance.get(`api/orders/${orderId}`);
        return { data: fallback.data, error: null };
      } catch (err) {
        console.error('Fallback order detail error:', err);
        return {
          data: null,
          error: err.response?.data?.message || err.message || 'Error al cargar el detalle de la orden',
        };
      }
    }
    console.error('Error fetching admin order detail:', error);
    return {
      data: null,
      error: error.response?.data?.message || error.message || 'Error al cargar el detalle de la orden',
    };
  }
};
