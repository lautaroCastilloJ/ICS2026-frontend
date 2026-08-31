import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
import { useState } from 'react';
import { frontendErrorMessage } from '../helpers/backendError';

function CreateProductForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      sku: '',
      cui: '',
      name: '',
      description: '',
      imageUrl: '',
      price: 0,
      stock: 0,
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const navigate = useNavigate();

  const onValid = async (formData) => {
    try {
      await createProduct(formData);

      navigate('/admin/products');
    } catch (error) {
      if (error.response?.data?.detail) {
        const errorMessage = frontendErrorMessage[error.response.data.code];

        setErrorBackendMessage(errorMessage);
      } else {
        setErrorBackendMessage('Contactar a Soporte');
      }
    }
  };

  return (
    <div className="w-full min-h-full bg-zinc-900 text-white">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Catalogo</p>
            <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">Crear producto</h1>
            <p className="text-sm text-zinc-400 sm:text-base">Completa la informacion del nuevo producto.</p>
          </div>
        </div>

        <Card className="bg-zinc-900 text-white">
          <form
            className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 sm:gap-6"
            onSubmit={handleSubmit(onValid)}
          >
            <Input
              label="SKU"
              error={errors.sku?.message}
              {...register('sku', {
                required: 'SKU es requerido',
              })}
            />
            <Input
              label="Codigo Interno"
              error={errors.cui?.message}
              {...register('cui', {
                required: 'Codigo Interno es requerido',
              })}
            />
            <Input
              label="Nombre"
              error={errors.name?.message}
              {...register('name', {
                required: 'Nombre es requerido',
              })}
            />
            <Input
              label="Descripcion"
              error={errors.description?.message}
              {...register('description')}
            />
            <Input
              label="URL de imagen"
              type="url"
              placeholder="https://..."
              error={errors.imageUrl?.message}
              {...register('imageUrl', {
                maxLength: {
                  value: 500,
                  message: 'La URL es demasiado larga',
                },
              })}
            />
            <Input
              label="Precio"
              error={errors.price?.message}
              type="number"
              {...register('price', {
                min: {
                  value: 0,
                  message: 'No puede tener un precio negativo',
                },
              })}
            />
            <Input
              label="Stock"
              error={errors.stock?.message}
              type="number"
              {...register('stock', {
                min: {
                  value: 0,
                  message: 'No puede tener un stock negativo',
                },
              })}
            />

            <div className="sm:col-span-2 flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="submit"
                  className="w-full sm:w-auto hover:bg-zinc-800 hover:text-white transition"
                >
                  Crear Producto
                </Button>
                <Button
                  type="button"
                  className="w-full sm:w-auto hover:bg-red-800 hover:text-red-200 transition"
                  onClick={() => navigate('/admin/products')}
                >
                  Cancelar
                </Button>
              </div>
              {errorBackendMessage && <span className="text-red-500 text-sm">{errorBackendMessage}</span>}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateProductForm;
