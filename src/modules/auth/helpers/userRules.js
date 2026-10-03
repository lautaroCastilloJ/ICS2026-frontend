// Mismas reglas que UserRules del backend (ValidUserName, ValidPassword): si el
// formulario las acepta, el servidor tambien.
export const MIN_PASSWORD_LENGTH = 8;
// UserRules.MinAdminPasswordLength
export const MIN_ADMIN_PASSWORD_LENGTH = 12;

/**
 * Reglas de react-hook-form para una contraseña nueva.
 * @param {number} [minLength=MIN_PASSWORD_LENGTH]
 */
export const newPasswordRules = (minLength = MIN_PASSWORD_LENGTH) => ({
  required: 'La contraseña es obligatoria',
  minLength: { value: minLength, message: `Debe tener al menos ${minLength} caracteres` },
  validate: {
    upper: (value) => /[A-Z]/.test(value) || 'Debe incluir una letra mayúscula',
    lower: (value) => /[a-z]/.test(value) || 'Debe incluir una letra minúscula',
    digit: (value) => /\d/.test(value) || 'Debe incluir un número',
    symbol: (value) => /[\W_]/.test(value) || 'Debe incluir un carácter especial',
  },
});

export const passwordHint = (minLength = MIN_PASSWORD_LENGTH) =>
  `Al menos ${minLength} caracteres, con mayúscula, minúscula, número y símbolo.`;

// UserRules.ValidUserName
export const USERNAME_RULES = {
  required: 'El usuario es obligatorio',
  minLength: { value: 3, message: 'Debe tener entre 3 y 20 caracteres' },
  maxLength: { value: 20, message: 'Debe tener entre 3 y 20 caracteres' },
  pattern: {
    value: /^[a-zA-Z0-9_.-]+$/,
    message: 'Solo letras, números, puntos, guiones y guiones bajos',
  },
};

// UserRules.ValidDisplayName
export const DISPLAY_NAME_RULES = {
  required: 'El nombre es obligatorio',
  minLength: { value: 3, message: 'Debe tener entre 3 y 100 caracteres' },
  maxLength: { value: 100, message: 'Debe tener entre 3 y 100 caracteres' },
};

export const EMAIL_RULES = {
  required: 'El email es obligatorio',
  maxLength: { value: 150, message: 'No puede superar los 150 caracteres' },
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Email inválido',
  },
};
