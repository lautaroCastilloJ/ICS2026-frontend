import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/create';
import ProductFields from './ProductFields';
import { EMPTY_PRODUCT } from '../helpers/productForm';
import Alert from '../../shared/ui/Alert';
import Button, { ButtonLink } from '../../shared/ui/Button';
import PageHeader from '../../shared/ui/PageHeader';

/** Alta de un producto en el panel de administracion. */
function CreateProductForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_PRODUCT });

  const onValid = async (formData) => {
    setErrorMessage('');

    const { error } = await createProduct(formData);

    if (error) {
      setErrorMessage(error);

      return;
    }

    navigate('/admin/products');
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Crear producto" description="Completá los datos del producto nuevo." />

      <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-8" noValidate>
        {errorMessage && <Alert tone="danger">{errorMessage}</Alert>}

        <ProductFields register={register} errors={errors} disabled={isSubmitting} />

        <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
          <ButtonLink to="/admin/products" variant="secondary" size="lg">Cancelar</ButtonLink>
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Creando…' : 'Crear producto'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateProductForm;
