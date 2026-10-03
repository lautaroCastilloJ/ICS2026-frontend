import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/adminLogin';
import Alert from '../../shared/ui/Alert';
import Button, { ButtonLink } from '../../shared/ui/Button';
import TextField from '../../shared/ui/TextField';
import { ShieldIcon } from '../../shared/ui/icons';

/**
 * Componente LoginForm
 * Formulario de login SOLO para administradores
 *
 * @component
 * @returns {JSX.Element} Formulario de login
 */
function LoginForm() {
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();

  /**
   * Inicia sesión; el servicio rechaza a quien no sea administrador
   */
  const onValid = async (formData) => {
    try {
      setErrorMessage('');

      const { data, error } = await adminLogin(formData.username, formData.password);

      if (error) {
        setErrorMessage(error);

        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      navigate('/admin');
      // Recargamos la página para actualizar el estado de autenticación
      window.location.reload();
    } catch (error) {
      setErrorMessage('Error inesperado al iniciar sesión.');
      console.error('Login error:', error);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onValid)} noValidate>
      <div className="mb-3 flex flex-col items-center text-center">
        <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-surface text-ink dark:bg-canvas">
          <ShieldIcon size={26} />
        </div>
        <h1 className="text-[28px] font-semibold tracking-tight">Panel de administración</h1>
        <p className="mt-2 text-[15px] text-muted">Ingresá con tu cuenta de administrador.</p>
      </div>

      {errorMessage && <Alert tone="danger">{errorMessage}</Alert>}

      <TextField
        label="Usuario"
        required
        autoComplete="username"
        error={errors.username?.message}
        disabled={isSubmitting}
        {...register('username', { required: 'El usuario es obligatorio' })}
      />

      <TextField
        label="Contraseña"
        type="password"
        required
        autoComplete="current-password"
        error={errors.password?.message}
        disabled={isSubmitting}
        {...register('password', { required: 'La contraseña es obligatoria' })}
      />

      <Button type="submit" size="lg" block className="mt-2" disabled={isSubmitting}>
        {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
      </Button>

      <ButtonLink to="/" variant="ghost" block>Volver a la tienda</ButtonLink>
    </form>
  );
}

export default LoginForm;
