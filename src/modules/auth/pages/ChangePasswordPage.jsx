import ChangePasswordForm from '../components/ChangePasswordForm';
import { MIN_ADMIN_PASSWORD_LENGTH } from '../helpers/userRules';
import PageHeader from '../../shared/ui/PageHeader';

/** Cambio de contraseña dentro del panel: los administradores necesitan 12+ caracteres. */
function ChangePasswordPage() {
  return (
    <div className="max-w-xl">
      <PageHeader
        title="Cambiar contraseña"
        description="Por seguridad, primero confirmá tu contraseña actual."
      />
      <ChangePasswordForm minLength={MIN_ADMIN_PASSWORD_LENGTH} />
    </div>
  );
}

export default ChangePasswordPage;
