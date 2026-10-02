import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { createAdmin } from '../services/createAdmin';

// Igual que el backend (UserRules.MinAdminPasswordLength)
const MIN_ADMIN_PASSWORD_LENGTH = 12;

/**
 * Formulario para que un administrador cree otro administrador.
 * Los clientes se registran solos desde la tienda; este formulario solo
 * existe dentro del panel de administracion.
 */
function CreateAdminForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: '',
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onValid = async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');

      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const { error } = await createAdmin(formData);

    setLoading(false);

    if (error) {
      setErrorMessage(error);

      return;
    }

    setSuccessMessage(`Administrador "${formData.userName}" creado correctamente.`);
    reset();
  };

  return (
    <form
      className='
        flex
        flex-col
        gap-6
        bg-zinc-900
        p-6
        sm:p-8
        w-full
        max-w-md
        sm:rounded-lg
        text-white
        rounded-xl
        mx-auto
      '
      onSubmit={handleSubmit(onValid)}
    >
      <div className="text-zinc-50">
        <h1 className="text-2xl font-bold mb-2">Nuevo administrador</h1>
        <p className="text-sm text-zinc-400">
          Otorga acceso completo al panel. Los clientes se registran desde la tienda.
        </p>
      </div>

      <Input
        label='Usuario'
        { ...register('userName', { required: 'Usuario es obligatorio' }) }
        error={errors.userName?.message}
        disabled={loading}
      />

      <Input
        label='Nombre para mostrar'
        { ...register('displayName', {
          required: 'El nombre es obligatorio',
          minLength: { value: 3, message: 'Debe tener al menos 3 caracteres' },
        }) }
        error={errors.displayName?.message}
        disabled={loading}
      />

      <Input
        label='Email'
        { ...register('email', {
          required: 'Email es obligatorio',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email inválido',
          },
        }) }
        error={errors.email?.message}
        disabled={loading}
      />

      <Input
        label='Contraseña'
        type='password'
        { ...register('password', {
          required: 'Contraseña es obligatoria',
          minLength: {
            value: MIN_ADMIN_PASSWORD_LENGTH,
            message: `Debe tener al menos ${MIN_ADMIN_PASSWORD_LENGTH} caracteres`,
          },
        }) }
        error={errors.password?.message}
        disabled={loading}
      />

      <Input
        label='Confirmar contraseña'
        type='password'
        { ...register('confirmPassword', { required: 'Debe confirmar la contraseña' }) }
        error={errors.confirmPassword?.message}
        disabled={loading}
      />

      <Button
        type='submit'
        disabled={loading}
        className='shadow-l rounded-xl p-4 bg-zinc-900 text-white hover:bg-zinc-800'
      >
        {loading ? 'Creando...' : 'Crear administrador'}
      </Button>

      {successMessage && (
        <div className="bg-green-900 border border-green-200 text-green-200 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-950 border border-red-200 text-red-200 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}
    </form>
  );
}

export default CreateAdminForm;
