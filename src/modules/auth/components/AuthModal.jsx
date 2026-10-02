import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../hook/useAuth';
import Alert from '../../shared/ui/Alert';
import Button from '../../shared/ui/Button';
import Modal from '../../shared/ui/Modal';
import TextField from '../../shared/ui/TextField';

// Mismas reglas que UserRules del backend: si el formulario las acepta, el
// servidor tambien.
const USERNAME_RULES = {
  required: 'El usuario es obligatorio',
  minLength: { value: 3, message: 'Debe tener entre 3 y 20 caracteres' },
  maxLength: { value: 20, message: 'Debe tener entre 3 y 20 caracteres' },
  pattern: {
    value: /^[a-zA-Z0-9_.-]+$/,
    message: 'Solo letras, números, puntos, guiones y guiones bajos',
  },
};

const PASSWORD_RULES = {
  required: 'La contraseña es obligatoria',
  minLength: { value: 8, message: 'Debe tener al menos 8 caracteres' },
  validate: {
    upper: (value) => /[A-Z]/.test(value) || 'Debe incluir una letra mayúscula',
    lower: (value) => /[a-z]/.test(value) || 'Debe incluir una letra minúscula',
    digit: (value) => /\d/.test(value) || 'Debe incluir un número',
    symbol: (value) => /[\W_]/.test(value) || 'Debe incluir un carácter especial',
  },
};

const EMPTY_FORM = {
  username: '',
  email: '',
  displayName: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

/**
 * Componente AuthModal - Modal de autenticación para clientes
 * Permite tanto login como signup en una interfaz modal
 *
 * @component
 * @param {function} onClose - Función para cerrar el modal
 * @param {string} initialMode - Modo inicial: 'login' o 'signup'
 * @returns {JSX.Element} Modal de autenticación
 */
function AuthModal({ onClose, initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ defaultValues: EMPTY_FORM });

  const { singin, singup } = useAuth();

  /**
   * Inicia sesión y recarga la página para reflejar la sesión en toda la app
   */
  const onLoginSubmit = async (formData) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');

      const { error } = await singin(formData.username, formData.password);

      if (error) {
        setErrorMessage(error);

        return;
      }

      setSuccessMessage('¡Sesión iniciada!');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Error inesperado. Intentá nuevamente.');
    }
  };

  /**
   * Crea una cuenta de cliente y pasa al modo login
   */
  const onSignupSubmit = async (formData) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');

      const { error } = await singup(
        formData.username,
        formData.email,
        formData.password,
        formData.displayName,
        formData.phoneNumber.trim() || null,
      );

      if (error) {
        setErrorMessage(error);

        return;
      }

      setSuccessMessage('¡Cuenta creada! Ya podés iniciar sesión.');
      reset();
      setIsLogin(true);
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('Error inesperado. Intentá nuevamente.');
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setSuccessMessage('');
    reset();
  };

  return (
    <Modal title={isLogin ? 'Iniciar sesión' : 'Crear cuenta'} onClose={onClose}>
      {errorMessage && <Alert tone="danger" className="mb-5">{errorMessage}</Alert>}
      {successMessage && <Alert tone="success" className="mb-5">{successMessage}</Alert>}

      <form
        onSubmit={handleSubmit(isLogin ? onLoginSubmit : onSignupSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <TextField
          label="Usuario"
          required
          autoComplete="username"
          placeholder="Tu nombre de usuario"
          error={errors.username?.message}
          {...register('username', isLogin ? { required: 'El usuario es obligatorio' } : USERNAME_RULES)}
        />

        {!isLogin && (
          <>
            <TextField
              label="Email"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'El email es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
            />
            <TextField
              label="Nombre completo"
              required
              autoComplete="name"
              placeholder="Cómo querés que te llamemos"
              error={errors.displayName?.message}
              {...register('displayName', {
                required: 'El nombre completo es obligatorio',
                minLength: { value: 3, message: 'Debe tener entre 3 y 100 caracteres' },
                maxLength: { value: 100, message: 'Debe tener entre 3 y 100 caracteres' },
              })}
            />
            <TextField
              label="Teléfono"
              type="tel"
              autoComplete="tel"
              hint="Opcional"
              placeholder="Ej: 381 555 1234"
              error={errors.phoneNumber?.message}
              {...register('phoneNumber')}
            />
          </>
        )}

        <TextField
          label="Contraseña"
          type="password"
          required
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          hint={isLogin ? undefined : 'Al menos 8 caracteres, con mayúscula, minúscula, número y símbolo.'}
          error={errors.password?.message}
          {...register('password', isLogin ? { required: 'La contraseña es obligatoria' } : PASSWORD_RULES)}
        />

        {!isLogin && (
          <TextField
            label="Confirmar contraseña"
            type="password"
            required
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirmá la contraseña',
              validate: (value) => value === getValues('password') || 'Las contraseñas no coinciden',
            })}
          />
        )}

        <Button type="submit" size="lg" block className="mt-2" disabled={isSubmitting}>
          {isSubmitting ? 'Un momento…' : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
        <Button variant="link" size="sm" className="h-auto" onClick={toggleAuthMode}>
          {isLogin ? 'Creá una' : 'Iniciá sesión'}
        </Button>
      </p>
    </Modal>
  );
}

export default AuthModal;
