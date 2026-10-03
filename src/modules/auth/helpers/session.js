// Sesion del usuario: el JWT vive en localStorage y AuthProvider refleja si es
// valido. Este modulo es el unico que decide si hay sesion, para que el Header,
// las paginas y axios no tengan opiniones distintas.

// Avisa a AuthProvider que la sesion termino (token vencido o rechazado: 401).
export const SESSION_EXPIRED_EVENT = 'auth:session-expired';

/** Fecha de vencimiento (ms) del claim "exp" del JWT, o null si no se puede leer. */
const tokenExpiry = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload));

    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
};

/**
 * Token guardado si todavia no vencio; si vencio o esta corrupto, lo borra.
 * La firma la valida el backend: aca solo se evita usar un token muerto.
 */
export const getValidToken = () => {
  const token = localStorage.getItem('token');

  if (!token) return null;

  const expiry = tokenExpiry(token);

  if (expiry === null || expiry <= Date.now()) {
    clearSession();

    return null;
  }

  return token;
};

export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};

/** Cierra la sesion local y avisa a AuthProvider (lo usa el interceptor ante un 401). */
export const expireSession = () => {
  clearSession();
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
};
