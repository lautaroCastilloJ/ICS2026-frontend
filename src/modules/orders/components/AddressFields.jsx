import { ADDRESS_RULES, POSTAL_CODE_PATTERN } from '../helpers/address';

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
    <div className={className}>
      <label className="block text-zinc-50 font-semibold mb-2">
        {ADDRESS_RULES[field].label} *
      </label>
      <input
        type="text"
        { ...register(`${name}.${field}`, fieldRules(field)) }
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-50 placeholder:text-zinc-400 text-zinc-50 ${
          errors[field] ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={ADDRESS_RULES[field].placeholder}
        maxLength={ADDRESS_RULES[field].maxLength}
      />
      {errors[field] && (
        <p className="text-red-500 text-sm mt-1">{errors[field].message}</p>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {renderField('street', 'sm:col-span-2')}
      {renderField('number')}
      {renderField('city')}
      {renderField('province')}
      {renderField('postalCode')}
    </div>
  );
}

export default AddressFields;
