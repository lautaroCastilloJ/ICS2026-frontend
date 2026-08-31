import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import Button from '../../shared/components/Button';

function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { singout } = useAuth();

  /**
   * Efecto que redirige a /admin/home cuando se carga /admin
   */
  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/admin/home');
    }
  }, [location.pathname, navigate]);

  const logout = () => {
    singout();
    navigate('/login');
  };

  const getLinkStyles = ({ isActive }) => (
    `
      pl-4 w-full block  p-4 transition shadow-l rounded-xl p-4 bg-zinc-900 text-gray-400 hover:bg-zinc-800 
      ${isActive
      ? 'text-zinc-50' 
      : ''
    }
    `
  );

  const renderLogoutButton = (mobile = false) => (
    <Button className={`${mobile ? 'block w-full sm:hidden shadow-l rounded-xl p-4 bg-zinc-900 text-white' :  'shadow-l rounded-xl p-4 bg-zinc-900 text-white hidden sm:block' }`} onClick={logout}>Cerrar sesión</Button>
  );

  return (
    <div
      className="
        h-full
        min-h-screen
        grid
        grid-cols-1
        grid-rows-[auto_1fr]
        bg-zinc-900
        sm:gap-3
        sm:grid-cols-[256px_1fr]

      "
    >
      <header
        className="
          flex
          items-center
          justify-between
          p-4
          shadow-l
          rounded-xl
          bg-zinc-900

          sm:col-span-2
        "
      >
        <h1 className="text-2xl font-bold text-zinc-50">Panel Administrativo</h1>
        {renderLogoutButton()}
        <button
          className="
            sm:hidden
            rounded-xl
            bg-zinc-900
            p-3
            text-white
            shadow-s
            transition
            hover:bg-zinc-800
            border
            border-zinc-800
          "
          onClick={() => setOpenMenu(!openMenu)}
          aria-label={openMenu ? 'Cerrar menu' : 'Abrir menu'}
        >
          {openMenu ? '✕' : '☰'}
        </button>
      </header>
      <aside
        className={`
          absolute
          top-0
          bottom-0
          bg-zinc-900
          w-72
          sm:w-64
          p-6
          ${openMenu ? 'left-0' : 'left-[-288px]'}
          rounded-lg
          shadow-l
          flex
          flex-col
          justify-between

          sm:static
          sm:left-0
          sm:top-auto
          sm:bottom-auto
          sm:h-full
        `}
      >
        <nav>
          <ul
            className='flex flex-col gap-2'
          >
            <li>
              <NavLink
                to='/admin/home'
                className={getLinkStyles}
              >Principal</NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/products'
                className={getLinkStyles}
              >Productos</NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/orders'
                className={getLinkStyles}
              >Ordenes</NavLink>
            </li>
          </ul>
          <hr className='opacity-15 mt-4' />
        </nav>
        {renderLogoutButton(true)}
      </aside>
      <main
        className="
          p-5
          overflow-y-scroll
          sm:h-full
        "
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
