import { cn } from './cn';

/**
 * Boton circular de 44px con solo un icono. `label` es obligatorio: es el
 * nombre que anuncian los lectores de pantalla.
 */
function IconButton({ label, className, type = 'button', children, ...props }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex size-11 items-center justify-center rounded-full p-0 shadow-none overflow-visible',
        'bg-transparent text-ink cursor-pointer transition hover:bg-hover disabled:cursor-not-allowed disabled:text-faint',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default IconButton;
