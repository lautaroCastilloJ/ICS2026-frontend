import { useId } from 'react';
import { cn } from './cn';

/**
 * Campo de formulario con etiqueta, ayuda y error asociados al control
 * (htmlFor / aria-describedby). Acepta `ref`, por lo que funciona con
 * `{...register('campo')}` de react-hook-form.
 *
 * @param {string} label
 * @param {string} [error] - Mensaje de error; marca el campo como invalido
 * @param {string} [hint] - Texto de ayuda bajo el campo
 * @param {boolean} [multiline] - Renderiza un <textarea>
 */
function TextField({ label, error, hint, multiline = false, required, className, id, ...props }) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const Control = multiline ? 'textarea' : 'input';

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={fieldId} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-muted" aria-hidden="true"> *</span>}
      </label>
      <Control
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(hintId, errorId) || undefined}
        aria-required={required || undefined}
        className={cn(
          'w-full rounded-xl border bg-canvas px-4 text-[17px] text-ink shadow-none transition',
          'placeholder:text-faint hover:shadow-none focus:outline-none focus:ring-4',
          multiline ? 'min-h-24 py-3' : 'h-12',
          error
            ? 'border-danger focus:ring-danger/20'
            : 'border-line-strong focus:border-link focus:ring-link/20',
        )}
        {...props}
      />
      {hint && !error && <p id={hintId} className="text-xs text-muted">{hint}</p>}
      {error && <p id={errorId} className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

export default TextField;
