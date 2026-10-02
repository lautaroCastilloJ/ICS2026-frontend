import { cn } from './cn';

const TONES = {
  neutral: 'bg-surface text-muted dark:bg-line',
  info: 'bg-link/12 text-link',
  warn: 'bg-warn/12 text-warn',
  success: 'bg-success-surface text-success',
  danger: 'bg-danger-surface text-danger',
};

/**
 * Etiqueta corta de estado. El texto ya dice el estado: el color solo refuerza.
 *
 * @param {'neutral'|'info'|'warn'|'success'|'danger'} [tone='neutral']
 */
function Badge({ tone = 'neutral', className, children }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', TONES[tone], className)}>
      {children}
    </span>
  );
}

export default Badge;
