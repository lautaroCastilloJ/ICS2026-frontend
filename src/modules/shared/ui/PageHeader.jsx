/**
 * Encabezado de una pantalla del panel: titulo, descripcion y acciones.
 *
 * @param {string} title
 * @param {string} [description]
 * @param {React.ReactNode} [actions] - Botones a la derecha (abajo en celular)
 */
function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[34px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[40px]">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-[15px] text-muted sm:text-[17px]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export default PageHeader;
