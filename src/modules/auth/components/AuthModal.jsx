import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

/**
 * Componente AuthModal - Modal de autenticación para clientes
 * Permite tanto login como signup en una interfaz modal
 * Se utiliza en la página de inicio para que los clientes se autentiquen
 * 
 * @component
 * @param {function} onClose - Función para cerrar el modal
 * @param {string} initialMode - Modo inicial: 'login' o 'signup'
 * @returns {JSX.Element} Modal de autenticación
 */
function AuthModal({ onClose, initialMode = 'login' }) {
  // Estado para saber si estamos en modo login o signup
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  
  // Estado para mostrar mensajes de error
  const [errorMessage, setErrorMessage] = useState('');
  
  // Estado para mostrar mensajes de éxito
  const [successMessage, setSuccessMessage] = useState('');
  
  // Hook para utilizar formularios con react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      displayName: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Hook personalizado para manejar autenticación
  const { singin, singup } = useAuth();

  /**
   * Maneja el envío del formulario de login
   * Valida las credenciales y redirige si es exitoso
   */
  const onLoginSubmit = async (formData) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');

      // Llamamos al servicio de login
      const { error } = await singin(formData.username, formData.password);

      if (error) {
        setErrorMessage(error.frontendErrorMessage || 'Error al iniciar sesión');
        return;
      }

      // Si es exitoso, mostramos un mensaje y cerramos el modal
      setSuccessMessage('¡Sesión iniciada correctamente!');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (error) {
      if (error?.response?.data?.code) {
        setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
      } else {
        setErrorMessage('Error inesperado. Intenta nuevamente');
      }
    }
  };

  /**
   * Maneja el envío del formulario de signup
   * Valida los datos y crea una nueva cuenta de cliente
   */
  const onSignupSubmit = async (formData) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');

      // Validar que las contraseñas coincidan
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden');
        return;
      }

      // Llamamos al servicio de signup con todos los parámetros requeridos
      const { error } = await singup(
        formData.username,
        formData.email,
        formData.password,
        formData.displayName,
        formData.phoneNumber
      );

      if (error) {
        setErrorMessage(error.frontendErrorMessage || 'Error al registrarse');
        return;
      }

      // Si es exitoso, mostramos un mensaje y cambiamos a login
      setSuccessMessage('¡Cuenta creada exitosamente! Inicia sesión con tus credenciales');
      reset();
      setTimeout(() => {
        setIsLogin(true);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      if (error?.response?.data?.code) {
        setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
      } else {
        setErrorMessage('Error inesperado. Intenta nuevamente');
      }
    }
  };

  /**
   * Alterna entre modo login y signup
   */
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setSuccessMessage('');
    reset();
  };

  return (
    <>
      {/* Fondo con efecto blur */}
      <div 
        className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className=" shadow-xl max-w-md w-full shadow-s rounded-xl p-4 bg-zinc-900 text-white transition">
          
          {/* Header del modal */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-zinc-100">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Contenido del modal */}
          <div className="p-6">
            
            {/* Mostrar error si existe */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {errorMessage}
              </div>
            )}

            {/* Mostrar éxito si existe */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                {successMessage}
              </div>
            )}

            {/* Formulario */}
            <form 
              onSubmit={handleSubmit(isLogin ? onLoginSubmit : onSignupSubmit)}
              className="space-y-4"
            >
              {/* Campo Usuario */}
              <div>
                <label className="block text-zinc-100 font-semibold mb-2">
                  Usuario
                </label>
                <input
                  type="text"
                  {...register('username', {
                    required: 'El usuario es obligatorio',
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tu nombre de usuario"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              {/* Campo Email - Solo en signup */}
              {!isLogin && (
                <div>
                  <label className="block text-zinc-100 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'El email es obligatorio',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido',
                      },
                    })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              )}

              {/* Campo Nombre Mostrado - Solo en signup */}
              {!isLogin && (
                <div>
                  <label className="block text-zinc-100 font-semibold mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    {...register('displayName', {
                      required: 'El nombre completo es obligatorio',
                    })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white${
                      errors.displayName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tu nombre completo"
                  />
                  {errors.displayName && (
                    <p className="text-red-500 text-sm mt-1">{errors.displayName.message}</p>
                  )}
                </div>
              )}

              {/* Campo Teléfono - Solo en signup */}
              {!isLogin && (
                <div>
                  <label className="block text-zinc-100 font-semibold mb-2">
                    Número de Teléfono
                  </label>
                  <input
                    type="tel"
                    {...register('phoneNumber', {
                      required: 'El número de teléfono es obligatorio',
                    })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tu número de teléfono"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>
              )}

              {/* Campo Contraseña */}
              <div>
                <label className="block text-zinc-100 font-semibold mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres',
                    },
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Campo Confirmar Contraseña - Solo en signup */}
              {!isLogin && (
                <div>
                  <label className="block text-zinc-100 font-semibold mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    {...register('confirmPassword', {
                      required: 'Debe confirmar la contraseña',
                    })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              )}

              {/* Botón de envío */}
              <button
                type="submit"
                className="w-full shadow-l p-4 bg-zinc-900 text-white hover:bg-zinc-100 hover:text-zinc-900 font-semibold py-2 rounded-lg transition mt-6"
              >
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </button>
            </form>

            {/* Enlaces para cambiar entre login y signup */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <button
                  onClick={toggleAuthMode}
                  className="text-zinc-50 hover:text-zinc-400 font-semibold ml-2 transition"
                >
                  {isLogin ? 'Registrate aquí' : 'Inicia sesión'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthModal;
