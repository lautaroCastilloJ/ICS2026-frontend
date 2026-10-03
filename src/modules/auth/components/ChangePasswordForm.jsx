import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { changePassword } from '../services/changePassword';
import { MIN_PASSWORD_LENGTH, newPasswordRules, passwordHint } from '../helpers/userRules';
import Alert from '../../shared/ui/Alert';
import Button from '../../shared/ui/Button';
import TextField from '../../shared/ui/TextField';

/**
 * Formulario para cambiar la contraseña del usuario autenticado. Lo usan la
 * tienda (clientes) y el panel (administradores); solo cambia la longitud minima.
 *
 * @component
 * @param {number} [minLength] - Longitud minima de la nueva contraseña
 *   (12 para administradores, igual que el backend).
 * @returns {JSX.Element}
 */
function ChangePasswordForm({ minLength = MIN_PASSWORD_LENGTH }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onValid = async ({ currentPassword, newPassword }) => {
    setErrorMessage('');
    setSuccessMessage('');

    const { error } = await changePassword(currentPassword, newPassword);

    if (error) {
      setErrorMessage(error);

      return;
    }

    setSuccessMessage('Listo: tu contraseña se actualizó. Usala la próxima vez que inicies sesión.');
    reset();
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onValid)} noValidate>
      {successMessage && <Alert tone="success">{successMessage}</Alert>}
      {errorMessage && <Alert tone="danger">{errorMessage}</Alert>}

      <TextField
        label="Contraseña actual"
        type="password"
        required
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        disabled={isSubmitting}
        {...register('currentPassword', { required: 'La contraseña actual es obligatoria' })}
      />

      <TextField
        label="Nueva contraseña"
        type="password"
        required
        autoComplete="new-password"
        hint={passwordHint(minLength)}
        error={errors.newPassword?.message}
        disabled={isSubmitting}
        {...register('newPassword', {
          ...newPasswordRules(minLength),
          validate: {
            ...newPasswordRules(minLength).validate,
            different: (value) =>
              value !== getValues('currentPassword') || 'Debe ser distinta de la contraseña actual',
          },
        })}
      />

      <TextField
        label="Confirmar nueva contraseña"
        type="password"
        required
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        disabled={isSubmitting}
        {...register('confirmPassword', {
          required: 'Confirmá la nueva contraseña',
          validate: (value) => value === getValues('newPassword') || 'Las contraseñas no coinciden',
        })}
      />

      <Button type="submit" size="lg" className="mt-2 self-start" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando…' : 'Cambiar contraseña'}
      </Button>
    </form>
  );
}

export default ChangePasswordForm;
