/**
 * Utilidades para el Value Object Address del backend:
 * { street, number, city, province, postalCode }
 */

// Mismos limites y formato que valida el backend (Address / AddressDtoValidator).
export const ADDRESS_RULES = {
  street: { label: 'Calle', maxLength: 150, placeholder: 'Av. Mate de Luna' },
  number: { label: 'Altura', maxLength: 10, placeholder: '1850 o S/N' },
  city: { label: 'Ciudad', maxLength: 100, placeholder: 'San Miguel de Tucumán' },
  province: { label: 'Provincia', maxLength: 100, placeholder: 'Tucumán' },
  postalCode: { label: 'Código Postal', maxLength: 8, placeholder: '4000 o T4000ABC' },
};

export const POSTAL_CODE_PATTERN = /^(\d{4}|[A-Za-z]\d{4}[A-Za-z]{3})$/;

export const EMPTY_ADDRESS = {
  street: '',
  number: '',
  city: '',
  province: '',
  postalCode: '',
};

/**
 * Normaliza los valores del formulario al formato que espera la API.
 * @param {object} address - Direccion cargada en el formulario
 * @returns {object}
 */
export const toAddressRequest = (address) => ({
  street: address.street.trim(),
  number: address.number.trim(),
  city: address.city.trim(),
  province: address.province.trim(),
  postalCode: address.postalCode.trim().toUpperCase(),
});

/**
 * Devuelve la direccion en una linea legible.
 * Acepta tambien un string, por compatibilidad con respuestas antiguas.
 * @param {object | string | null | undefined} address
 * @returns {string}
 */
export const formatAddress = (address) => {
  if (!address) return '';

  if (typeof address === 'string') return address;

  const { street, number, city, province, postalCode } = address;

  return `${street} ${number}, ${city}, ${province} (CP ${postalCode})`;
};
