import { useSyncExternalStore } from 'react';

// Debe coincidir con el script de index.html que aplica el tema antes del render.
export const THEME_STORAGE_KEY = 'theme';

const listeners = new Set();

const readStoredTheme = () => {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);

    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
};

const systemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getTheme = () => document.documentElement.dataset.theme || readStoredTheme() || systemTheme();

const emit = () => listeners.forEach((listener) => listener());

export const setTheme = (theme) => {
  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Sin almacenamiento (modo privado): el tema vale solo para esta visita.
  }

  emit();
};

// Mientras el usuario no elija un tema, se sigue el del sistema operativo.
const media = window.matchMedia('(prefers-color-scheme: dark)');

media.addEventListener('change', () => {
  if (readStoredTheme()) return;

  document.documentElement.dataset.theme = systemTheme();
  emit();
});

const subscribe = (listener) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};

/**
 * Tema actual ('light' | 'dark') y funcion para alternarlo. Todos los
 * componentes que lo usan se mantienen sincronizados.
 */
export const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getTheme);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return { theme, toggleTheme };
};
