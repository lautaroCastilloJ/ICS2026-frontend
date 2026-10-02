import { Link } from 'react-router-dom';

// Las paginas de ayuda, legales y redes todavia no existen: sus enlaces quedan
// sin destino (to: null) hasta que se creen. Completar `to` o `href` al tenerlas.
const COLUMNS = [
  {
    title: 'Tienda',
    links: [
      { label: 'Inicio', to: '/' },
      { label: 'Carrito', to: '/cart' },
      { label: 'Mis pedidos', to: '/orders' },
    ],
  },
  {
    title: 'Ayuda',
    links: [
      { label: 'Contacto', to: null },
      { label: 'Preguntas frecuentes', to: null },
      { label: 'Envíos y devoluciones', to: null },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Términos y condiciones', to: null },
      { label: 'Privacidad', to: null },
    ],
  },
  {
    title: 'Redes',
    links: [
      { label: 'Instagram', href: null },
      { label: 'Facebook', href: null },
      { label: 'X', href: null },
    ],
  },
];

const linkClass = 'text-sm text-muted transition hover:text-ink';

function FooterLink({ label, to, href }) {
  if (to) return <Link to={to} className={linkClass}>{label}</Link>;

  if (href) return <a href={href} target="_blank" rel="noreferrer" className={linkClass}>{label}</a>;

  // Sin destino todavia: se muestra como texto, no como un enlace roto.
  return <span className="text-sm text-faint" title="Próximamente">{label}</span>;
}

/** Pie de pagina de la tienda: marca, columnas de enlaces y copyright. */
function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className="max-w-xs">
            <Link to="/" className="text-xl font-semibold tracking-tight text-ink">Tienda</Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Productos seleccionados, compra simple y seguimiento de cada pedido en un solo lugar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="mb-4 text-xs font-semibold text-ink">{column.title}</h2>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}><FooterLink {...link} /></li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <p className="mt-16 border-t border-line py-7 text-center text-xs text-muted">
          © {new Date().getFullYear()} Tienda. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
