import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateProduct } from '../services/update';

/**
 * Modal para editar un producto existente
 * @param {object} product - Producto a editar
 * @param {function} onClose - Callback cuando se cierra el modal
 * @param {function} onSuccess - Callback cuando se actualiza correctamente
 */
function EditProductModal({ product, onClose, onSuccess }) {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      sku: product.sku || '',
      name: product.name || '',
      description: product.description || '',
      internalCode: product.internalCode || product.cui || '',
      currentUnitPrice: product.currentUnitPrice || 0,
      stockQuantity: product.stockQuantity || 0,
      imageUrl: product.imageUrl || '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const skuValue = watch('sku');

  // Actualizar valores cuando cambie el producto
  useEffect(() => {
    reset({
      sku: product.sku || '',
      name: product.name || '',
      description: product.description || '',
      internalCode: product.internalCode || product.cui || '',
      currentUnitPrice: product.currentUnitPrice || 0,
      stockQuantity: product.stockQuantity || 0,
      imageUrl: product.imageUrl || '',
    });
  }, [product, reset]);

  // Manejar envio del formulario
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await updateProduct(product.id, data);

      if (updateError) {
        setError(updateError);
        return;
      }

      setSuccess(true);

      // Esperar un momento antes de cerrar
      setTimeout(() => {
        reset();
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (err) {
      setError('Error al actualizar el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/90 shadow-2xl">
        {/* Encabezado */}
        <div className="flex items-start justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Edicion</p>
            <h2 className="text-2xl font-bold text-white">Editar producto</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-lg text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-5">
          {/* Mensajes */}
          {error && (
            <div className="rounded-xl border border-red-900/40 bg-red-900/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-900/40 bg-emerald-900/30 px-4 py-3 text-sm text-emerald-200">
              Producto actualizado correctamente
            </div>
          )}

          {/* SKU */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-200">
              SKU*
              <span className="ml-2 text-xs text-zinc-500">(MAYUSCULAS, numeros y guiones)</span>
            </label>
            <input
              type="text"
              {...register('sku', {
                required: 'SKU es obligatorio',
                minLength: { value: 3, message: 'SKU debe tener al menos 3 caracteres' },
                maxLength: { value: 50, message: 'SKU no puede exceder 50 caracteres' },
                pattern: {
                  value: /^[A-Z0-9\\-]*$/,
                  message: 'SKU solo puede contener MAYUSCULAS, numeros y guiones',
                },
              })}
              onChange={(e) => {
                // Convertir a mayusculas automaticamente
                e.target.value = e.target.value.toUpperCase();
              }}
              disabled={loading || success}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 transition focus:border-emerald-500 focus:ring-2 disabled:bg-zinc-800"
              placeholder="Ej: PROD-001"
            />
            {errors.sku && <span className="text-sm text-red-400">{errors.sku.message}</span>}
            {skuValue && !/^[A-Z0-9\\-]*$/.test(skuValue) && (
              <span className="text-xs text-amber-300">Se convertira a mayusculas al guardar</span>
            )}
          </div>

          {/* Nombre */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-200">Nombre*</label>
            <input
              type="text"
              {...register('name', {
                required: 'Nombre es obligatorio',
                minLength: { value: 3, message: 'Nombre debe tener al menos 3 caracteres' },
                maxLength: { value: 100, message: 'Nombre no puede exceder 100 caracteres' },
              })}
              disabled={loading || success}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 transition focus:border-emerald-500 focus:ring-2 disabled:bg-zinc-800"
              placeholder="Ej: Producto de prueba"
            />
            {errors.name && <span className="text-sm text-red-400">{errors.name.message}</span>}
          </div>

          {/* Codigo Interno */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-200">Codigo Interno*</label>
            <input
              type="text"
              {...register('internalCode', {
                required: 'Codigo Interno es obligatorio',
                minLength: { value: 1, message: 'Codigo Interno es obligatorio' },
                maxLength: { value: 50, message: 'Codigo Interno no puede exceder 50 caracteres' },
              })}
              disabled={loading || success}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 transition focus:border-emerald-500 focus:ring-2 disabled:bg-zinc-800"
              placeholder="Ej: INT-001"
            />
            {errors.internalCode && <span className="text-sm text-red-400">{errors.internalCode.message}</span>}
          </div>

          {/* Descripcion */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-200">Descripcion</label>
            <textarea
              {...register('description', {
                maxLength: { value: 250, message: 'Descripcion no puede exceder 250 caracteres' },
              })}
              disabled={loading || success}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 transition focus:border-emerald-500 focus:ring-2 disabled:bg-zinc-800"
              placeholder="Descripcion del producto"
              rows="3"
            />
            {errors.description && <span className="text-sm text-red-400">{errors.description.message}</span>}
          </div>

          {/* URL de imagen */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-200">URL de imagen</label>
            <input
              type="url"
              {...register('imageUrl', {
                maxLength: { value: 500, message: 'La URL es demasiado larga' },
              })}
              disabled={loading || success}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 transition focus:border-emerald-500 focus:ring-2 disabled:bg-zinc-800"
              placeholder="https://..."
            />
            {errors.imageUrl && <span className="text-sm text-red-400">{errors.imageUrl.message}</span>}
          </div>

          {/* Precio */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-200">Precio*</label>
            <input
              type="number"
              step="0.01"
              {...register('currentUnitPrice', {
                required: 'Precio es obligatorio',
                min: { value: 0.01, message: 'Precio debe ser mayor a 0' },
              })}
              disabled={loading || success}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 transition focus:border-emerald-500 focus:ring-2 disabled:bg-zinc-800"
              placeholder="Ej: 99.99"
            />
            {errors.currentUnitPrice && <span className="text-sm text-red-400">{errors.currentUnitPrice.message}</span>}
          </div>

          {/* Stock */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-200">Stock*</label>
            <input
              type="number"
              {...register('stockQuantity', {
                required: 'Stock es obligatorio',
                min: { value: 0, message: 'Stock no puede ser negativo' },
              })}
              disabled={loading || success}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 transition focus:border-emerald-500 focus:ring-2 disabled:bg-zinc-800"
              placeholder="Ej: 100"
            />
            {errors.stockQuantity && <span className="text-sm text-red-400">{errors.stockQuantity.message}</span>}
          </div>

          {/* Botones */}
          <div className="flex flex-wrap gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:border-zinc-700 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/60"
            >
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
