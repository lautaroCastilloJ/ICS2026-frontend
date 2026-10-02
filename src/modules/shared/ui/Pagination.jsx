import Button from './Button';
import { cn } from './cn';

/**
 * Controles de paginacion. Se muestran siempre que haya resultados, aun con
 * una sola pagina (los botones quedan deshabilitados), para que el usuario
 * sepa en que pagina esta.
 *
 * @param {number} page - Pagina actual (empieza en 1)
 * @param {number} totalPages
 * @param {function} onPageChange - Recibe el numero de la nueva pagina
 */
function Pagination({ page, totalPages, onPageChange, className }) {
  const lastPage = Math.max(1, totalPages);

  return (
    <nav aria-label="Paginación" className={cn('flex items-center justify-center gap-4 text-sm text-muted', className)}>
      <Button variant="secondary" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        Anterior
      </Button>
      <span aria-current="page">
        Página <strong className="font-semibold text-ink">{page}</strong> de {lastPage}
      </span>
      <Button variant="secondary" onClick={() => onPageChange(page + 1)} disabled={page >= lastPage}>
        Siguiente
      </Button>
    </nav>
  );
}

export default Pagination;
