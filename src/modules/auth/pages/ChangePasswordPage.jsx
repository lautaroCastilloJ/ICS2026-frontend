import ChangePasswordForm from '../components/ChangePasswordForm';

// Igual que el backend (UserRules.MinAdminPasswordLength)
const MIN_ADMIN_PASSWORD_LENGTH = 12;

function ChangePasswordPage() {
  return (
    <ChangePasswordForm minLength={MIN_ADMIN_PASSWORD_LENGTH} />
  );
}

export default ChangePasswordPage;
