import { useId } from 'react';
import { cn } from './cn';

/**
 * <select> nativo con la apariencia del design system. Nativo a proposito:
 * teclado, lectores de pantalla y el selector del celular funcionan solos.
 *
 * @param {string} label - Etiqueta (visible, o solo para lectores con hideLabel)
 * @param {boolean} [hideLabel] - Oculta la etiqueta visualmente
 * @param {Array<{value: string, label: string}>} options
 */
function Select({ label, hideLabel = false, options, className, id, ...props }) {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={selectId} className={hideLabel ? 'sr-only' : 'text-sm font-medium text-ink'}>{label}</label>
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            'h-11 w-full cursor-pointer appearance-none rounded-full border border-line-strong bg-canvas py-0 pl-4 pr-10',
            'text-sm text-ink shadow-none transition hover:shadow-none focus:outline-none focus:ring-4 focus:ring-link/20',
            'dark:bg-surface',
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

export default Select;
