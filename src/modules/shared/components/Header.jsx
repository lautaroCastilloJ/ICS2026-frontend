import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AuthModal from '../../auth/components/AuthModal';
import useAuth from '../../auth/hook/useAuth';
import useCartCount from '../../orders/hook/useCartCount';
import { CART_CHANGE_EVENT } from '../../orders/helpers/cart';
import { ROLES } from '../constants/roles';
import IconButton from '../ui/IconButton';
import ThemeToggle from '../ui/ThemeToggle';
import { BagIcon, UserIcon } from '../ui/icons';
import { cn } from '../ui/cn';

const navLinkClass = ({ isActive }) => cn(
  'text-sm transition hover:text-ink',
  isActive ? 'font-medium text-ink' : 'text-muted',
);

const menuItemClass = 'flex min-h-11 w-full items-center rounded-xl px-3 text-left text-[15px] text-ink ' +
  'bg-transparent shadow-none cursor-pointer transition hover:bg-hover';

/**
 * Barra superior de la tienda: marca, navegacion, tema, cuenta y carrito.
 * La busqueda vive en el catalogo (Home), no aca.
 */
function Header() {
  const [authMode, setAuthMode] = useState(null); // null | 'login' | 'signup'
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const navigate = useNavigate();
  const { isAuthenticated, singout } = useAuth();
  const cartCount = useCartCount();
  const isLoggedIn = isAuthenticated || Boolean(localStorage.getItem('token'));
  const isAdmin = localStorage.getItem('role') === ROLES.ADMIN;

  // Cierra el menu de cuenta con clic afuera o Escape.
  useEffect(() => {
    if (!menuOpen) return;

    const handlePointer = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  const openAuth = (mode) => {
    setMenuOpen(false);
    setAuthMode(mode);
  };

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    singout();
    // singout vacia el carrito: actualizar el contador.
    window.dispatchEvent(new Event(CART_CHANGE_EVENT));
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-nav-line bg-nav backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <Link to="/" className="text-xl font-semibold tracking-tight text-ink">
            Tienda
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
            <NavLink to="/" end className={navLinkClass}>Catálogo</NavLink>
            {isLoggedIn && <NavLink to="/orders" className={navLinkClass}>Mis pedidos</NavLink>}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />

            <div ref={menuRef} className="relative">
              <IconButton
                label="Cuenta"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <UserIcon />
              </IconButton>

              {menuOpen && (
                <div
                  role="menu"
                  aria-label="Cuenta"
                  className="absolute right-0 top-12 w-60 rounded-2xl border border-line bg-canvas p-2 shadow-xl dark:bg-surface"
                >
                  <div className="md:hidden">
                    <button role="menuitem" className={menuItemClass} onClick={() => goTo('/')}>Catálogo</button>
                    {isLoggedIn && (
                      <button role="menuitem" className={menuItemClass} onClick={() => goTo('/orders')}>Mis pedidos</button>
                    )}
                    <div className="my-2 h-px bg-line" />
                  </div>

                  {isLoggedIn ? (
                    <>
                      {isAdmin && (
                        <button role="menuitem" className={menuItemClass} onClick={() => goTo('/admin')}>Panel de administración</button>
                      )}
                      <button role="menuitem" className={menuItemClass} onClick={() => goTo('/account/password')}>Cambiar contraseña</button>
                      <button role="menuitem" className={menuItemClass} onClick={handleLogout}>Cerrar sesión</button>
                    </>
                  ) : (
                    <>
                      <button role="menuitem" className={menuItemClass} onClick={() => openAuth('login')}>Iniciar sesión</button>
                      <button role="menuitem" className={menuItemClass} onClick={() => openAuth('signup')}>Crear cuenta</button>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/cart"
              aria-label={`Carrito, ${cartCount} ${cartCount === 1 ? 'producto' : 'productos'}`}
              className="relative inline-flex size-11 items-center justify-center rounded-full text-ink transition hover:bg-hover"
            >
              <BagIcon />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-inverse px-1.5 text-[11px] font-semibold text-inverse-ink">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {authMode && <AuthModal onClose={() => setAuthMode(null)} initialMode={authMode} />}
    </>
  );
}

export default Header;
