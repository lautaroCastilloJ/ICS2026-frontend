import { Link } from 'react-router-dom';
import { buttonClasses } from './buttonStyles';

/**
 * Boton del design system.
 *
 * @param {'primary'|'secondary'|'ghost'|'link'|'danger'|'destructive'} [variant='primary']
 * @param {'sm'|'md'|'lg'} [size='md'] - md y lg cumplen el minimo tactil de 44px
 * @param {boolean} [block] - Ocupa todo el ancho disponible
 */
function Button({ variant, size, block, className, type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, block, className })}
      {...props}
    />
  );
}

/** Enlace de react-router con la apariencia de un boton. */
export function ButtonLink({ variant, size, block, className, ...props }) {
  return <Link className={buttonClasses({ variant, size, block, className })} {...props} />;
}

export default Button;
