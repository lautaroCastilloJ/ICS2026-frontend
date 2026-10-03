import { useState, useEffect, useSyncExternalStore } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import IconButton from '../../shared/ui/IconButton';
import ThemeToggle from '../../shared/ui/ThemeToggle';
import { cn } from '../../shared/ui/cn';
import {
  BoxIcon,
  CloseIcon,
  GridIcon,
  KeyIcon,
  LogoutIcon,
  MenuIcon,
  ReceiptIcon,
  ShieldIcon,
  StoreIcon,
} from '../../shared/ui/icons';

const NAV_ITEMS = [
  { to: '/admin/home', label: 'Resumen', icon: <GridIcon /> },
  { to: '/admin/products', label: 'Productos', icon: <BoxIcon /> },
  { to: '/admin/orders', label: 'Pedidos', icon: <ReceiptIcon /> },
  { to: '/admin/users/create', label: 'Administradores', icon: <ShieldIcon /> },
  { to: '/admin/account/password', label: 'Cambiar contraseña', icon: <KeyIcon /> },
];

// Breakpoint lg de Tailwind: desde aca la barra lateral queda fija.
const desktopQuery = window.matchMedia('(min-width: 64rem)');
const subscribeDesktop = (listener) => {
  desktopQuery.addEventListener('change', listener);

  return () => desktopQuery.removeEventListener('change', listener);
};
const isDesktopNow = () => desktopQuery.matches;

const itemClass = 'flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-[15px] transition ' +
  'bg-transparent shadow-none cursor-pointer';

const navLinkClass = ({ isActive }) => cn(
  itemClass,
  isActive ? 'bg-hover font-medium text-ink' : 'text-muted hover:bg-hover hover:text-ink',
);

/**
 * Layout del panel de administracion: barra lateral fija en escritorio y menu
 * deslizable en celular. El contenido de cada seccion se renderiza en <Outlet />.
 */
function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDesktop = useSyncExternalStore(subscribeDesktop, isDesktopNow);

  const navigate = useNavigate();
  const location = useLocation();
  const { singout } = useAuth();

  // /admin redirige a la seccion principal
  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/admin/home');
    }
  }, [location.pathname, navigate]);

  // Al navegar se cierra el menu del celular
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Escape cierra el menu del celular
  useEffect(() => {
    if (!menuOpen) return;

    const handleKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('keydown', handleKey);

    return () => document.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  const logout = () => {
    singout();
    navigate('/login');
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between gap-3 px-3">
        <Link to="/admin/home" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-ink">Tienda</span>
          <span className="rounded-full bg-inverse px-2 py-0.5 text-[11px] font-semibold text-inverse-ink">Admin</span>
        </Link>
        <IconButton label="Cerrar menú" className="lg:hidden" onClick={() => setMenuOpen(false)}>
          <CloseIcon />
        </IconButton>
      </div>

      <nav aria-label="Panel de administración" className="mt-4 flex-1">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink to={to} className={navLinkClass}>
                {icon}
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col gap-1 border-t border-line pt-4">
        <Link to="/" className={cn(itemClass, 'text-muted hover:bg-hover hover:text-ink')}>
          <StoreIcon />
          Ver la tienda
        </Link>
        <button type="button" onClick={logout} className={cn(itemClass, 'text-muted hover:bg-hover hover:text-ink')}>
          <LogoutIcon />
          Cerrar sesión
        </button>
        <div className="flex items-center justify-between px-3 pt-2">
          <span className="text-xs text-muted">Tema</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Barra superior (celular) */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-nav-line bg-nav px-4 backdrop-blur-xl lg:hidden">
        <IconButton
          label="Abrir menú"
          aria-expanded={menuOpen}
          aria-controls="admin-sidebar"
          className="-ml-2"
          onClick={() => setMenuOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <span className="text-[17px] font-semibold tracking-tight">Panel</span>
        <ThemeToggle />
      </header>

      {/* Fondo del menu (celular) */}
      {menuOpen && (
        <div className="modal-backdrop fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}

      {/*
        Barra lateral: fija en escritorio, deslizable en celular. Cerrada en
        celular queda fuera de pantalla: inert evita que Tab entre ahi.
      */}
      <aside
        id="admin-sidebar"
        inert={!isDesktop && !menuOpen}
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-canvas p-3 transition-transform duration-300 dark:bg-surface',
          'lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:w-auto lg:translate-x-0 lg:bg-surface lg:dark:bg-canvas',
          menuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {sidebar}
      </aside>

      <main className="min-w-0 px-4 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
