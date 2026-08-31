import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { adminLogin } from '../services/adminLogin';
import { frontendErrorMessage } from '../helpers/backendError';

/**
 * Componente LoginForm
 * Formulario de login SOLO para administradores
 * 
 * @component
 * @returns {JSX.Element} Formulario de login
 */
function LoginForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();

  /**
   * Maneja el envío del formulario de login
   * Solo permite acceso a administradores
   */
  const onValid = async (formData) => {
    try {
      setLoading(true);
      setErrorMessage('');

      // Llamamos al servicio de login para administradores
      const { data, error } = await adminLogin(formData.username, formData.password);

      if (error) {
        setErrorMessage(typeof error === 'string' ? error : 'Error al iniciar sesión');
        return;
      }

      // Si es exitoso, guardamos el token y el rol
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      
      // Redirigimos al panel de administración
      navigate('/admin');
      
      // Recargamos la página para actualizar el estado de autenticación
      window.location.reload();
    } catch (error) {
      setErrorMessage('Error inesperado al iniciar sesión');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      className='
        flex
        flex-col
        gap-20
        bg-zinc-900
        p-8
        sm:w-md
        sm:gap-4
        sm:rounded-lg
        sm:shadow-l
        text-white
        shadow-l rounded-xl
      '
      onSubmit={handleSubmit(onValid)}
    >
      {/* Título */}
      <div className="sm:mb-4 text-zinc-50">
        <h1 className="text-2xl font-bold text-zinc-50 mb-2">
          Panel Administrativo
        </h1>
        <p className="text-sm text-zinc-400">
          Solo administradores pueden acceder
        </p>
      </div>

      {/* Campo usuario */}
      <Input
        label='Usuario'
        { ...register('username', {
          required: 'Usuario es obligatorio',
        }) }
        error={errors.username?.message}
        disabled={loading}
      />

      {/* Campo contraseña */}
      <Input
        label='Contraseña'
        { ...register('password', {
          required: 'Contraseña es obligatoria',
        }) }
        type='password'
        error={errors.password?.message}
        disabled={loading}
      />

      {/* Botón de login */}
      <Button 
        type='submit'
        disabled={loading}
        className='shadow-l rounded-xl p-4 bg-zinc-900 text-white hover:bg-zinc-800'
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      <Button 
        variant='secondary'
        onClick={() => navigate('/signup')}
        type='button'
        className='shadow-l rounded-xl p-4 bg-zinc-900 text-white hover:bg-zinc-800'
      >
        Crear Cuenta
      </Button>

      {/* Mensaje de error */}
      {errorMessage && (
        <div className="bg-red-950 border border-red-200 text-red-200 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      {/* Enlace para volver a inicio */}
      <Button 
        variant='secondary'
        onClick={() => navigate('/')}
        type='button'
        className='shadow-l rounded-xl p-4 bg-zinc-900 text-white hover:bg-zinc-800'
      >
        Volver a Inicio
      </Button>
    </form>
  );
}

export default LoginForm;
