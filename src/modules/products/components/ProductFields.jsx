import TextField from '../../shared/ui/TextField';

const isHttpUrl = (value) => {
  if (!value) return true;

  try {
    const url = new URL(value);

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Campos de un producto para react-hook-form, con las mismas reglas que
 * ProductRequestValidator del backend. Los usan crear y editar producto.
 *
 * @param {function} register - register de useForm
 * @param {object} errors - formState.errors
 * @param {boolean} [disabled]
 */
function ProductFields({ register, errors, disabled = false }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <TextField
        label="SKU"
        required
        hint="Mayúsculas, números y guiones. Ej: ZAP-PEG-01"
        className="[&_input]:uppercase"
        disabled={disabled}
        error={errors.sku?.message}
        {...register('sku', {
          setValueAs: (value) => String(value).trim().toUpperCase(),
          required: 'El SKU es obligatorio',
          minLength: { value: 3, message: 'Debe tener entre 3 y 50 caracteres' },
          maxLength: { value: 50, message: 'Debe tener entre 3 y 50 caracteres' },
          pattern: { value: /^[A-Z0-9-]+$/, message: 'Solo mayúsculas, números y guiones' },
        })}
      />
      <TextField
        label="Código interno"
        required
        disabled={disabled}
        error={errors.internalCode?.message}
        {...register('internalCode', {
          setValueAs: (value) => String(value).trim(),
          required: 'El código interno es obligatorio',
          maxLength: { value: 50, message: 'No puede superar los 50 caracteres' },
        })}
      />
      <TextField
        label="Nombre"
        required
        className="sm:col-span-2"
        disabled={disabled}
        error={errors.name?.message}
        {...register('name', {
          setValueAs: (value) => String(value).trim(),
          required: 'El nombre es obligatorio',
          minLength: { value: 3, message: 'Debe tener entre 3 y 100 caracteres' },
          maxLength: { value: 100, message: 'Debe tener entre 3 y 100 caracteres' },
        })}
      />
      <TextField
        label="Descripción"
        hint="Opcional, hasta 250 caracteres"
        multiline
        rows={3}
        className="sm:col-span-2"
        disabled={disabled}
        error={errors.description?.message}
        {...register('description', {
          maxLength: { value: 250, message: 'No puede superar los 250 caracteres' },
        })}
      />
      <TextField
        label="URL de la imagen"
        type="url"
        hint="Opcional. Ej: https://…"
        className="sm:col-span-2"
        disabled={disabled}
        error={errors.imageUrl?.message}
        {...register('imageUrl', {
          setValueAs: (value) => String(value).trim(),
          maxLength: { value: 500, message: 'No puede superar los 500 caracteres' },
          validate: (value) => isHttpUrl(value) || 'Tiene que ser una URL que empiece con http:// o https://',
        })}
      />
      <TextField
        label="Precio"
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0.01"
        required
        disabled={disabled}
        error={errors.currentUnitPrice?.message}
        {...register('currentUnitPrice', {
          valueAsNumber: true,
          validate: (value) => (Number.isFinite(value) && value > 0) || 'El precio debe ser mayor a 0',
        })}
      />
      <TextField
        label="Stock"
        type="number"
        inputMode="numeric"
        step="1"
        min="0"
        required
        disabled={disabled}
        error={errors.stockQuantity?.message}
        {...register('stockQuantity', {
          valueAsNumber: true,
          validate: (value) =>
            (Number.isInteger(value) && value >= 0) || 'El stock debe ser un número entero, 0 o mayor',
        })}
      />
    </div>
  );
}

export default ProductFields;
