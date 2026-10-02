import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';
import { ROLES } from '../../shared/constants/roles';

/**
 * Protege las rutas del panel: exige sesion iniciada Y rol de administrador.
 * Es solo una barrera de interfaz (el rol en localStorage se puede editar):
 * la proteccion real la hace el backend con [Authorize(Roles = "Administrador")].
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const isAdmin = localStorage.getItem('role') === ROLES.ADMIN;

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/login' />;
  }

  return children;
};

export default ProtectedRoute;
