import { instance } from '../../shared/api/axiosInstance';
import { getErrorMessage, isErrorCode } from '../../shared/helpers/apiError';

/**
 * Obtiene lista de productos para el administrador con filtros
 * @param {string} search - Término de búsqueda
 * @param {string} status - Estado del producto ('all', 'enabled', 'disabled')
 * @param {number} pageNumber - Número de página
 * @param {number} pageSize - Cantidad de productos por página
 * @returns {Promise<{data: {total, productItems}, error: null}|{data: null, error: string}>}
 */
export const getProducts = async (search = '', status = 'all', pageNumber = 1, pageSize = 10) => {
  try {
    // Mapear estado a lo que espera el backend
    let statusParam = null;
    if (status === 'enabled') statusParam = 'enabled';
    if (status === 'disabled') statusParam = 'disabled';

    const response = await instance.get('api/products/admin', {
      params: {
        search: search || null,
        status: statusParam,
        pageNumber,
        pageSize,
      },
    });

    return {
      data: {
        total: response.data.totalCount || 0,
        productItems: response.data.items || [],
      },
      error: null,
    };
  } catch (error) {
    // El backend responde 404 NO_PRODUCTS_AVAILABLE cuando el filtro no
    // encuentra productos: para la UI es una lista vacia, no un error.
    if (isErrorCode(error, 'NO_PRODUCTS_AVAILABLE')) {
      return { data: { total: 0, productItems: [] }, error: null };
    }

    console.error('Error fetching products:', error);
    return {
      data: null,
      error: getErrorMessage(error, 'Error al cargar los productos'),
    };
  }
};

/**
 * Obtiene detalle de un producto por ID para edicion
 * @param {string|number} id
 */
export const getProductById = async (id) => {
  try {
    // Intentar primero el endpoint publico (evita 404 del admin)
    const response = await instance.get(`api/products/${id}`);
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    // Si el publico falla/404, probar el admin
    if (error?.response?.status === 404) {
      try {
        const fallback = await instance.get(`api/products/admin/${id}`);
        return { data: fallback.data, error: null };
      } catch (err) {
        console.error('Fallback product detail error:', err);
        return {
          data: null,
          error: getErrorMessage(err, 'Error al cargar el producto'),
        };
      }
    }
    console.error('Error fetching product detail:', error);
    return {
      data: null,
      error: getErrorMessage(error, 'Error al cargar el producto'),
    };
  }
};
