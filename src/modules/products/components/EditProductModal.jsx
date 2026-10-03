import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateProduct } from '../services/update';
import ProductFields from './ProductFields';
import { toProductForm } from '../helpers/productForm';
import Alert from '../../shared/ui/Alert';
import Button from '../../shared/ui/Button';
import Modal from '../../shared/ui/Modal';

/**
 * Modal para editar un producto existente
 * @param {object} product - Producto a editar (ProductResponse del listado)
 * @param {function} onClose - Callback cuando se cierra el modal
 * @param {function} onSuccess - Callback cuando se actualiza correctamente
 */
function EditProductModal({ product, onClose, onSuccess }) {
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: toProductForm(product) });

  const onSubmit = async (formData) => {
    setErrorMessage('');

    const { error } = await updateProduct(product.id, formData);

    if (error) {
      setErrorMessage(error);

      return;
    }

    onSuccess?.();
    onClose();
  };

  // Mientras se guarda no se puede cerrar el dialogo.
  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <Modal title="Editar producto" onClose={handleClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
        {errorMessage && <Alert tone="danger">{errorMessage}</Alert>}

        <ProductFields register={register} errors={errors} disabled={isSubmitting} />

        <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
          <Button variant="secondary" size="lg" onClick={handleClose} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EditProductModal;
