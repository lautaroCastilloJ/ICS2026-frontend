/**
 * Utilidades para interpretar los errores de la API.
 *
 * El backend responde siempre con el mismo contrato de error:
 * { code, message, status, traceId, errors? }
 * - code: codigo estable (ej. 'PRODUCT_NOT_FOUND'), apto para logica.
 * - message: texto ya traducido desde Messages.resx, apto para mostrar.
 * - errors: errores por campo (solo en VALIDATION_ERROR).
 */

const DEFAULT_MESSAGE = 'Error inesperado. Intenta nuevamente';
const NETWORK_MESSAGE = 'No se pudo conectar con el servidor. Verifica tu conexion.';

/**
 * Devuelve el codigo de error del backend, o null si no lo hay.
 * @param {unknown} error - Error lanzado por axios
 * @returns {string | null}
 */
export const getErrorCode = (error) => error?.response?.data?.code ?? null;

/**
 * Indica si el error de axios corresponde al codigo de backend indicado.
 * @param {unknown} error - Error lanzado por axios
 * @param {string} code - Codigo esperado (ej. 'NO_PRODUCTS_AVAILABLE')
 * @returns {boolean}
 */
export const isErrorCode = (error, code) => getErrorCode(error) === code;

/**
 * Convierte un error de axios en un mensaje para mostrar al usuario.
 *
 * Prioridad:
 * 1. Mensaje propio del frontend para ese codigo (overrides).
 * 2. Primer error de campo (errores de validacion).
 * 3. Mensaje del backend.
 * 4. Mensaje de red si no hubo respuesta, o el fallback.
 *
 * @param {unknown} error - Error lanzado por axios
 * @param {string} [fallback] - Mensaje si no se puede obtener uno mejor
 * @param {Record<string, string>} [overrides] - Mensajes por codigo de backend
 * @returns {string}
 */
export const getErrorMessage = (error, fallback = DEFAULT_MESSAGE, overrides = {}) => {
  const data = error?.response?.data;

  if (data?.code && overrides[data.code]) {
    return overrides[data.code];
  }

  if (data?.errors) {
    const firstFieldError = Object.values(data.errors).flat()[0];

    if (firstFieldError) return firstFieldError;
  }

  if (data?.message) {
    return data.message;
  }

  if (error?.request && !error?.response) {
    return NETWORK_MESSAGE;
  }

  return fallback;
};
