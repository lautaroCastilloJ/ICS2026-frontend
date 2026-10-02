import Button from './Button';
import Modal from './Modal';
import { cn } from './cn';

/**
 * Confirmacion de una accion, al estilo de las alertas de sistema: icono,
 * titulo, explicacion y dos botones. Reemplaza a window.confirm.
 *
 * El foco arranca en "Cancelar": un Enter accidental no ejecuta la accion.
 *
 * @param {string} title - Pregunta corta ("¿Vaciar el carrito?")
 * @param {React.ReactNode} [description] - Consecuencia de la accion
 * @param {string} confirmLabel - Verbo de la accion ("Vaciar carrito")
 * @param {string} [cancelLabel='Cancelar']
 * @param {boolean} [destructive] - La accion borra algo: boton en rojo
 * @param {React.ReactNode} [icon]
 * @param {function} onConfirm
 * @param {function} onCancel - Tambien se llama con Escape o clic afuera
 */
function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  destructive = false,
  icon,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal title={title} onClose={onCancel} size="sm" bare role="alertdialog">
      <div className="flex flex-col items-center px-2 pt-2 text-center">
        {icon && (
          <div
            className={cn(
              'mb-5 flex size-16 items-center justify-center rounded-full',
              destructive ? 'bg-danger-surface text-danger' : 'bg-surface text-ink dark:bg-canvas',
            )}
          >
            {icon}
          </div>
        )}
        <h2 className="text-[21px] font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-2 text-[15px] leading-relaxed text-muted">{description}</p>}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button variant={destructive ? 'destructive' : 'primary'} size="lg" block onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button variant="secondary" size="lg" block onClick={onCancel} autoFocus>
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
