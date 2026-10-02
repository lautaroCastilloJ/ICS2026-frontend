import { cn } from './cn';

const TONES = {
  danger: 'bg-danger-surface text-danger',
  success: 'bg-success-surface text-success',
  info: 'bg-surface text-ink',
};

/**
 * Mensaje en linea. Los errores usan role="alert" (se anuncian enseguida);
 * el resto, role="status".
 *
 * @param {'danger'|'success'|'info'} [tone='info']
 * @param {string} [title]
 */
function Alert({ tone = 'info', title, className, children }) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('rounded-2xl px-5 py-4 text-sm leading-relaxed', TONES[tone], className)}
    >
      {title && <p className="mb-1 text-[15px] font-semibold">{title}</p>}
      <div>{children}</div>
    </div>
  );
}

export default Alert;
