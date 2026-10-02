import { Navigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import ChangePasswordForm from '../components/ChangePasswordForm';
import useAuth from '../hook/useAuth';

/**
 * Cambio de contraseña para clientes, dentro del layout de la tienda.
 * Usa el mismo formulario que el panel de administracion, con la longitud
 * minima general (8); el backend aplica la regla por rol de todas formas.
 */
function CustomerChangePasswordPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/' />;
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChangePasswordForm />
      </main>
    </div>
  );
}

export default CustomerChangePasswordPage;
