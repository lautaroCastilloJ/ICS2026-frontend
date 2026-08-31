import { instance } from '../../shared/api/axiosInstance';

/**
 * Obtiene los productos disponibles para clientes (sin autenticación requerida)
 * @param {string} search - Término de búsqueda (opcional)
 * @param {number} pageNumber - Número de página (empieza en 1)
 * @param {number} pageSize - Cantidad de productos por página
 * @returns {Promise<{data: object, error: null | Error}>} Datos de productos e información de error
 */
export const getPublicProducts = async (
  search = '',
  pageNumber = 1,
  pageSize = 6
) => {
  try {
    // Construimos los parámetros de la consulta
    const queryString = new URLSearchParams({
      search: search || '',
      pageNumber,
      pageSize,
    });

    // Realizamos la petición GET al endpoint público de productos
    const response = await instance.get(`api/products?${queryString}`);

    // Retornamos los datos y null como error (sin error)
    return { 
      data: response.data, 
      error: null 
    };
  } catch (error) {
    // Si hay un error, lo retornamos
    console.error('Error al obtener productos:', error.message);
    return { 
      data: null, 
      error: error.message 
    };
  }
};
