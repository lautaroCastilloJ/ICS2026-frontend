/**
 * Roles de la aplicacion. Deben coincidir con AppRoles del backend
 * (Dsw2025Tpi.Data/Identity/AppRoles.cs), que es quien los asigna en el JWT.
 */
export const ROLES = Object.freeze({
  ADMIN: 'Administrador',
  CUSTOMER: 'Cliente',
});
