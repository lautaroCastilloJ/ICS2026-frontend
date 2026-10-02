import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { changePassword } from '../services/changePassword';

/**
 * Formulario para cambiar la contraseña del usuario autenticado.
 *
 * @component
 * @param {number} [minLength] - Longitud minima de la nueva contraseña
 *   (12 para administradores, igual que el backend).
 * @returns {JSX.Element}
 */
function ChangePasswordForm({ minLength = 8 }) {
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
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onValid = async ({ currentPassword, newPassword, confirmPassword }) => {
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas nuevas no coinciden');

      return;
    }

    if (newPassword === currentPassword) {
      setErrorMessage('La nueva contraseña debe ser distinta de la actual');

      return;
    }

    setLoading(true);
    const { error } = await changePassword(currentPassword, newPassword);

    setLoading(false);

    if (error) {
      setErrorMessage(error);

      return;
    }

    setSuccessMessage('Contraseña actualizada correctamente.');
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
        <h1 className="text-2xl font-bold mb-2">Cambiar contraseña</h1>
        <p className="text-sm text-zinc-400">
          Mínimo {minLength} caracteres, con mayúscula, minúscula, número y carácter especial.
        </p>
      </div>

      <Input
        label='Contraseña actual'
        type='password'
        autoComplete='current-password'
        { ...register('currentPassword', { required: 'La contraseña actual es obligatoria' }) }
        error={errors.currentPassword?.message}
        disabled={loading}
      />

      <Input
        label='Nueva contraseña'
        type='password'
        autoComplete='new-password'
        { ...register('newPassword', {
          required: 'La nueva contraseña es obligatoria',
          minLength: {
            value: minLength,
            message: `Debe tener al menos ${minLength} caracteres`,
          },
        }) }
        error={errors.newPassword?.message}
        disabled={loading}
      />

      <Input
        label='Confirmar nueva contraseña'
        type='password'
        autoComplete='new-password'
        { ...register('confirmPassword', { required: 'Debe confirmar la nueva contraseña' }) }
        error={errors.confirmPassword?.message}
        disabled={loading}
      />

      <Button
        type='submit'
        disabled={loading}
        className='shadow-l rounded-xl p-4 bg-zinc-900 text-white hover:bg-zinc-800'
      >
        {loading ? 'Guardando...' : 'Cambiar contraseña'}
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

export default ChangePasswordForm;
