import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createAdmin } from '../services/createAdmin';
import {
  DISPLAY_NAME_RULES,
  EMAIL_RULES,
  MIN_ADMIN_PASSWORD_LENGTH,
  USERNAME_RULES,
  newPasswordRules,
  passwordHint,
} from '../../auth/helpers/userRules';
import Alert from '../../shared/ui/Alert';
import Button from '../../shared/ui/Button';
import TextField from '../../shared/ui/TextField';

const EMPTY_ADMIN = {
  userName: '',
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

/**
 * Formulario para que un administrador cree otro administrador.
 * Los clientes se registran solos desde la tienda; este formulario solo
 * existe dentro del panel de administracion.
 */
function CreateAdminForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_ADMIN });

  const onValid = async (formData) => {
    setErrorMessage('');
    setSuccessMessage('');

    const { error } = await createAdmin(formData);

    if (error) {
      setErrorMessage(error);

      return;
    }

    setSuccessMessage(`Listo: “${formData.userName}” ya puede ingresar al panel.`);
    reset();
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onValid)} noValidate>
      {successMessage && <Alert tone="success">{successMessage}</Alert>}
      {errorMessage && <Alert tone="danger">{errorMessage}</Alert>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField
          label="Usuario"
          required
          autoComplete="off"
          error={errors.userName?.message}
          disabled={isSubmitting}
          {...register('userName', USERNAME_RULES)}
        />
        <TextField
          label="Nombre para mostrar"
          required
          autoComplete="off"
          error={errors.displayName?.message}
          disabled={isSubmitting}
          {...register('displayName', DISPLAY_NAME_RULES)}
        />
        <TextField
          label="Email"
          type="email"
          required
          autoComplete="off"
          className="sm:col-span-2"
          error={errors.email?.message}
          disabled={isSubmitting}
          {...register('email', EMAIL_RULES)}
        />
        <TextField
          label="Contraseña"
          type="password"
          required
          autoComplete="new-password"
          hint={passwordHint(MIN_ADMIN_PASSWORD_LENGTH)}
          error={errors.password?.message}
          disabled={isSubmitting}
          {...register('password', newPasswordRules(MIN_ADMIN_PASSWORD_LENGTH))}
        />
        <TextField
          label="Confirmar contraseña"
          type="password"
          required
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          disabled={isSubmitting}
          {...register('confirmPassword', {
            required: 'Confirmá la contraseña',
            validate: (value) => value === getValues('password') || 'Las contraseñas no coinciden',
          })}
        />
      </div>

      <Button type="submit" size="lg" className="mt-2 self-start" disabled={isSubmitting}>
        {isSubmitting ? 'Creando…' : 'Crear administrador'}
      </Button>
    </form>
  );
}

export default CreateAdminForm;
