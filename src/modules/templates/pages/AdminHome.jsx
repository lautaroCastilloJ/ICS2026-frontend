import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { instance } from '../../shared/api/axiosInstance';
import { isErrorCode } from '../../shared/helpers/apiError';
import Alert from '../../shared/ui/Alert';
import PageHeader from '../../shared/ui/PageHeader';
import { ArrowRightIcon, BoxIcon, ReceiptIcon } from '../../shared/ui/icons';

// Solo interesa el total: se pide una pagina de un elemento.
const countOf = async (url, params = {}) => {
  try {
    const { data } = await instance.get(url, { params: { pageSize: 1, pageNumber: 1, ...params } });

    return data.totalCount || 0;
  } catch (error) {
    // Sin productos el backend responde 404 en lugar de una lista vacia.
    if (isErrorCode(error, 'NO_PRODUCTS_AVAILABLE')) return 0;

    throw error;
  }
};

function StatCard({ label, value, loading, to, linkLabel }) {
  return (
    <div className="flex flex-col justify-between gap-6 rounded-3xl bg-surface p-6 dark:bg-surface">
      <p className="text-sm font-medium text-muted">{label}</p>
      {loading ? (
        <div aria-hidden="true" className="h-12 w-20 animate-pulse rounded-xl bg-line" />
      ) : (
        <p className="text-5xl font-semibold tracking-tight">{value}</p>
      )}
      <Link to={to} className="inline-flex items-center gap-1.5 text-sm text-link hover:underline">
        {linkLabel}
        <ArrowRightIcon size={14} />
      </Link>
    </div>
  );
}

function ShortcutCard({ to, title, description, icon }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-3xl border border-line p-5 transition hover:bg-hover"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-surface text-ink dark:bg-line">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-semibold">{title}</span>
        <span className="block text-sm text-muted">{description}</span>
      </span>
      <ArrowRightIcon className="text-muted transition group-hover:translate-x-1 group-hover:text-ink" />
    </Link>
  );
}

/**
 * Pagina principal del panel administrativo: totales y accesos rapidos.
 */
function AdminHome() {
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadStatistics = async () => {
      try {
        const [products, orders, pending] = await Promise.all([
          countOf('api/products/admin'),
          countOf('api/orders/admin'),
          countOf('api/orders/admin', { status: 'Pending' }),
        ]);

        if (!cancelled) setStats({ products, orders, pending });
      } catch (err) {
        console.error('Error al cargar estadisticas:', err);

        if (!cancelled) setError('No pudimos cargar los totales. Recargá la página para reintentar.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadStatistics();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageHeader title="Resumen" description="El estado de la tienda de un vistazo." />

      {error && <Alert tone="danger" className="mb-8">{error}</Alert>}

      <section aria-label="Totales" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Productos" value={stats.products} loading={loading} to="/admin/products" linkLabel="Ver productos" />
        <StatCard label="Pedidos" value={stats.orders} loading={loading} to="/admin/orders" linkLabel="Ver pedidos" />
        <StatCard
          label="Pedidos pendientes"
          value={stats.pending}
          loading={loading}
          to="/admin/orders?status=Pending"
          linkLabel="Atender pendientes"
        />
      </section>

      <section aria-labelledby="accesos" className="mt-14">
        <h2 id="accesos" className="mb-5 text-[21px] font-semibold tracking-tight">Accesos rápidos</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ShortcutCard
            to="/admin/products/create"
            title="Crear producto"
            description="Sumá un producto nuevo al catálogo."
            icon={<BoxIcon />}
          />
          <ShortcutCard
            to="/admin/orders"
            title="Gestionar pedidos"
            description="Revisá pedidos y actualizá su estado."
            icon={<ReceiptIcon />}
          />
        </div>
      </section>
    </>
  );
}

export default AdminHome;
