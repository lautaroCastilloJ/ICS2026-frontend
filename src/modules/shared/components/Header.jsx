import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../../auth/components/AuthModal';

/**
 * Header principal con navegacion, busqueda y autenticacion.
 * Incluye menu responsive para mobile sin modificar los fondos existentes.
 */
function Header({ onSearch }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' o 'signup'
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
    window.location.reload();
  };

  const handleAdminDashboard = () => navigate('/admin');

  const navLinks = [
    { href: '/', label: 'Productos' },
    { href: '/cart', label: 'Carrito de compras' },
    ...(token ? [{ href: '/orders', label: 'Mis Ordenes' }] : []),
  ];

  const renderAuthButtons = (isMobile = false) => (
    !token ? (
      <div className={`flex gap-2 ${isMobile ? 'w-full flex-col' : ''}`}>
        <button
          onClick={() => {
            setAuthMode('login');
            setShowAuthModal(true);
            setMenuOpen(false);
          }}
          className="shadow-s rounded-xl p-4 bg-zinc-900 text-white transition hover:bg-zinc-50 hover:text-zinc-900 w-full whitespace-nowrap"
        >
          Iniciar Sesion
        </button>
        <button
          onClick={() => {
            setAuthMode('signup');
            setShowAuthModal(true);
            setMenuOpen(false);
          }}
          className="shadow-s rounded-xl p-4 bg-zinc-900 text-white transition hover:bg-zinc-50 hover:text-zinc-900 w-full"
        >
          Registrarse
        </button>
      </div>
    ) : (
      <div className={`flex gap-2 ${isMobile ? 'w-full flex-col' : ''}`}>
        {userRole === 'Admin' && (
          <button
            onClick={handleAdminDashboard}
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 w-full"
          >
            Panel Admin
          </button>
        )}
        <button
          onClick={handleLogout}
          className="shadow-s rounded-xl p-4 bg-zinc-900 text-white transition hover:bg-zinc-50 hover:text-zinc-900 w-full whitespace-nowrap"
        >
          Cerrar Sesion
        </button>
      </div>
    )
  );

  return (
    <>
      <header className="shadow-s rounded-xl bg-zinc-900 text-zinc-50">
        <div className="mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-left"
            >
              <img src="../../../../public/logo.png" alt="Logo" className="h-14 w-auto" />
            </button>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-zinc-50 font-medium transition hover:text-zinc-400"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            className="hidden flex-1 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 shadow-s md:flex md:max-w-md"
          >
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none border-0"
            />
            <button
              type="submit"
              className="text-zinc-100 transition hover:text-white"
              aria-label="Buscar"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </form>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {renderAuthButtons()}
          </div>

          {/* Mobile toggles */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-xl bg-zinc-900 p-3 text-white shadow-s transition hover:bg-zinc-800"
              aria-label="Abrir menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        {menuOpen && (
          <div className="border-t border-zinc-800 bg-zinc-900 px-4 pb-4 pt-3 sm:px-6 md:hidden">
            <form
              onSubmit={handleSearch}
              className="mb-3 flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 shadow-s"
            >
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
              />
              <button
                type="submit"
                className="text-zinc-100 transition hover:text-white"
                aria-label="Buscar"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>

            <div className="flex flex-col gap-3">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-3 py-2 text-zinc-50 transition hover:bg-zinc-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {renderAuthButtons(true)}
            </div>
          </div>
        )}
      </header>

      {/* Modal de autenticacion */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      )}
    </>
  );
}

export default Header;
