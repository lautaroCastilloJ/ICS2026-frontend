import { useEffect, useId, useRef } from 'react';
import IconButton from './IconButton';
import { CloseIcon } from './icons';
import { cn } from './cn';

const SIZES = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-2xl',
};

/**
 * Dialogo modal accesible: cierra con Escape o clic en el fondo, bloquea el
 * scroll de la pagina, mueve el foco al dialogo y lo devuelve al cerrar.
 *
 * @param {string} title - Titulo visible y nombre accesible del dialogo
 * @param {function} onClose
 * @param {'sm'|'md'|'lg'} [size='md']
 * @param {boolean} [bare] - Sin barra de titulo: el contenido arma su propio
 *   encabezado (el titulo sigue siendo el nombre accesible)
 * @param {'dialog'|'alertdialog'} [role='dialog'] - alertdialog para confirmaciones
 */
function Modal({ title, onClose, size = 'md', bare = false, role = 'dialog', children }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    // Respeta un autoFocus del contenido (por ej. "Cancelar" en una confirmacion).
    if (!dialogRef.current?.contains(document.activeElement)) dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="modal-backdrop absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role={role}
        aria-modal="true"
        aria-labelledby={bare ? undefined : titleId}
        aria-label={bare ? title : undefined}
        tabIndex={-1}
        className={cn(
          'modal-panel relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-canvas text-ink shadow-2xl',
          'focus:outline-none sm:rounded-3xl dark:bg-surface',
          SIZES[size],
        )}
      >
        {!bare && (
          <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
            <h2 id={titleId} className="text-[21px] font-semibold tracking-tight">{title}</h2>
            <IconButton label="Cerrar" onClick={onClose} className="-mr-2">
              <CloseIcon />
            </IconButton>
          </div>
        )}
        <div className="overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
