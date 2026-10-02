import { ADDRESS_RULES, POSTAL_CODE_PATTERN } from '../helpers/address';
import TextField from '../../shared/ui/TextField';

/**
 * Campos de una direccion (Value Object Address) para react-hook-form.
 *
 * @component
 * @param {string} name - Prefijo del campo en el formulario (ej. 'shippingAddress')
 * @param {function} register - register de useForm
 * @param {object} errors - errors[name] de useForm
 * @param {boolean} [shouldUnregister] - Quitar los valores al desmontar el bloque
 * @returns {JSX.Element}
 */
function AddressFields({ name, register, errors = {}, shouldUnregister = false }) {
  const fieldRules = (field) => {
    const { label, maxLength } = ADDRESS_RULES[field];

    return {
      shouldUnregister,
      validate: (value) => value.trim() !== '' || `${label} es obligatorio`,
      maxLength: {
        value: maxLength,
        message: `${label} no puede exceder ${maxLength} caracteres`,
      },
      ...(field === 'postalCode' && {
        pattern: {
          value: POSTAL_CODE_PATTERN,
          message: 'Debe tener 4 dígitos (4000) o formato CPA (T4000ABC)',
        },
      }),
    };
  };

  const renderField = (field, className = '') => (
    <TextField
      className={className}
      label={ADDRESS_RULES[field].label}
      required
      error={errors[field]?.message}
      placeholder={ADDRESS_RULES[field].placeholder}
      maxLength={ADDRESS_RULES[field].maxLength}
      {...register(`${name}.${field}`, fieldRules(field))}
    />
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {renderField('street', 'sm:col-span-2')}
      {renderField('number')}
      {renderField('city')}
      {renderField('province')}
      {renderField('postalCode')}
    </div>
  );
}

export default AddressFields;
