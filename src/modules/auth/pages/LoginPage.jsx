import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import ThemeToggle from '../../shared/ui/ThemeToggle';

/** Ingreso al panel de administracion. */
function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface dark:bg-canvas">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="text-xl font-semibold tracking-tight text-ink">Tienda</Link>
        <ThemeToggle />
      </div>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm rounded-3xl bg-canvas p-8 shadow-xl shadow-black/5 dark:bg-surface dark:shadow-none sm:p-10">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
