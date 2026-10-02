import { cn } from './cn';

// shadow-none, overflow-visible y los paddings anulan los estilos heredados
// de elements.css sobre <button>.
const BASE = 'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap ' +
  'shadow-none overflow-visible cursor-pointer transition duration-200 ' +
  'disabled:cursor-not-allowed';

const VARIANTS = {
  // Accion principal de la pantalla (una por vista).
  primary: 'bg-accent text-accent-ink hover:brightness-92 dark:hover:brightness-112 ' +
    'disabled:bg-surface disabled:text-muted disabled:hover:brightness-100',
  // Accion secundaria con borde.
  secondary: 'border border-line-strong bg-transparent text-ink hover:bg-hover ' +
    'disabled:border-line disabled:text-faint disabled:hover:bg-transparent',
  // Accion de bajo peso, sin borde.
  ghost: 'bg-transparent text-ink hover:bg-hover disabled:text-faint',
  // Texto con color de enlace.
  link: 'bg-transparent text-link hover:underline disabled:text-faint disabled:no-underline',
  // Accion destructiva de bajo peso (quitar, vaciar).
  danger: 'bg-transparent text-danger hover:underline disabled:text-faint',
  // Accion destructiva principal, para confirmar en un dialogo.
  destructive: 'bg-danger text-white dark:text-black hover:brightness-92 dark:hover:brightness-112 ' +
    'disabled:bg-surface disabled:text-muted',
};

const SIZES = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-6 text-[17px]',
};

// Los variantes de texto no llevan padding horizontal para alinearse con el contenido.
const TEXT_VARIANTS = ['link', 'danger'];

export const buttonClasses = ({ variant = 'primary', size = 'md', block = false, className } = {}) => cn(
  BASE,
  VARIANTS[variant],
  SIZES[size],
  TEXT_VARIANTS.includes(variant) && 'px-0',
  block && 'w-full',
  className,
);
