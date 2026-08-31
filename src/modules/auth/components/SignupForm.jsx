import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { signup } from '../services/signup';

/**
 * Formulario de registro para administradores o clientes
 */
function SignupForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',
    },
  });

  const navigate = useNavigate();

  const onValid = async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contrasenas no coinciden');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const { error } = await signup(
        formData.userName,
        formData.email,
        formData.password,
        formData.userName,
        null,
        formData.role,
      );

      if (error) {
        setErrorMessage(typeof error === 'string' ? error : 'Error al registrar el usuario');
        return;
      }

      setSuccessMessage('Usuario registrado. Ahora puedes iniciar sesion.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setErrorMessage('Error inesperado al registrarse');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className='
        flex
        flex-col
        gap-10
        bg-zinc-900
        p-6
        sm:p-8
        w-full
        max-w-md
        sm:gap-8
        sm:rounded-lg
        sm:shadow-l
        text-white
        shadow-l rounded-xl
        mx-auto
      '
      onSubmit={handleSubmit(onValid)}
    >
      <div className="sm:mb-4 text-zinc-50">
        <h1 className="text-2xl font-bold text-zinc-50 mb-2">
          Registrar usuario
        </h1>
        <p className="text-sm text-zinc-400">
          Completa los datos para crear la cuenta
        </p>
      </div>

      <Input
        label='Usuario'
        { ...register('userName', {
          required: 'Usuario es obligatorio',
        }) }
        error={errors.userName?.message}
        disabled={loading}
      />

      <Input
        label='Email'
        { ...register('email', {
          required: 'Email es obligatorio',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email invalido',
          },
        }) }
        error={errors.email?.message}
        disabled={loading}
      />

      <div className='flex flex-col h-20'>
        <label>Role:</label>
        <select
          className={`${errors.role ? 'border-red-400' : ''} rounded border px-3 py-2 text-zinc-500`}
          { ...register('role', { required: 'El rol es obligatorio' }) }
          disabled={loading}
        >
          <option value=''>Seleccione una opcion</option>
          <option value='Administrador'>Administrador</option>
          <option value='Cliente'>Cliente</option>
        </select>
        {errors.role && <p className="text-red-500 text-base sm:text-xs">{errors.role.message}</p>}
      </div>

      <Input
        label='Contrasena'
        { ...register('password', {
          required: 'Contrasena es obligatoria',
          minLength: {
            value: 8,
            message: 'Debe tener al menos 8 caracteres',
          },
        }) }
        type='password'
        error={errors.password?.message}
        disabled={loading}
      />

      <Input
        label='Confirmar contrasena'
        { ...register('confirmPassword', {
          required: 'Debe confirmar la contrasena',
        }) }
        type='password'
        error={errors.confirmPassword?.message}
        disabled={loading}
      />

      <Button
        type='submit'
        disabled={loading}
        className='shadow-l rounded-xl p-4 bg-zinc-900 text-white hover:bg-zinc-800'
      >
        {loading ? 'Registrando...' : 'Registrar Usuario'}
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

      <Button
        variant='secondary'
        onClick={() => navigate('/login')}
        type='button'
        className='shadow-l rounded-xl p-4 bg-zinc-900 text-white hover:bg-zinc-800'
      >
        Ir a Login
      </Button>
    </form>
  );
}

export default SignupForm;
