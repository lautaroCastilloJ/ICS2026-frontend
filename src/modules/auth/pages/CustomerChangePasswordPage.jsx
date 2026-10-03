import { Navigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
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
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-28 pt-12 sm:px-6 sm:pt-18">
        <h1 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">Cambiar contraseña.</h1>
        <p className="mb-10 mt-3 text-[17px] text-muted">
          Por seguridad, primero confirmá tu contraseña actual.
        </p>
        <ChangePasswordForm />
      </main>

      <Footer />
    </div>
  );
}

export default CustomerChangePasswordPage;
