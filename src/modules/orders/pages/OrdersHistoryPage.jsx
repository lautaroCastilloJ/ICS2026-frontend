import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getUserOrders } from '../services/orderService';
import OrderDetailModal from '../components/OrderDetailModal';
import { getOrderStatus, shortOrderNumber } from '../helpers/orderStatus';
import { formatDate, formatPrice } from '../../shared/helpers/format';
import Alert from '../../shared/ui/Alert';
import Badge from '../../shared/ui/Badge';
import Button, { ButtonLink } from '../../shared/ui/Button';
import Pagination from '../../shared/ui/Pagination';

// Cantidad de pedidos por pagina
const PAGE_SIZE = 5;

/**
 * Página de Historial de Pedidos
 *
 * Muestra:
 * - Lista paginada de los pedidos del usuario autenticado
 * - Número, fecha, total y estado de cada pedido
 * - Opción para ver el detalle completo de cada pedido
 *
 * @component
 * @returns {JSX.Element} Página del historial de pedidos
 */
function OrdersHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  /**
   * Carga una página de pedidos del usuario desde el backend
   */
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: ordersError } = await getUserOrders(page, PAGE_SIZE);

      if (ordersError) {
        setError(ordersError || 'Error al cargar tus pedidos.');

        return;
      }

      // El backend devuelve un PagedResult; se acepta tambien un array plano.
      const items = Array.isArray(data) ? data : data?.items || [];
      const total = data?.totalCount ?? items.length;

      setOrders(items);
      setTotalOrders(total);
      setTotalPages(data?.totalPages || Math.max(1, Math.ceil(total / PAGE_SIZE)));
    } catch (err) {
      setError('Error inesperado al cargar tus pedidos.');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    // Si el usuario no está autenticado, redirige a inicio
    if (!token) {
      navigate('/');

      return;
    }

    loadOrders();
  }, [token, navigate, loadOrders]);

  const goToPage = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-28 pt-12 sm:px-6 sm:pt-18">
        <h1 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">Mis pedidos.</h1>
        <p className="mt-3 text-[17px] text-muted sm:text-[19px]">Seguí el estado de todas tus compras.</p>

        {error && (
          <Alert tone="danger" className="mt-10">
            {error}{' '}
            <Button variant="link" size="sm" className="h-auto align-baseline text-danger" onClick={loadOrders}>
              Reintentar
            </Button>
          </Alert>
        )}

        {loading && (
          <ul aria-hidden="true" className="mt-12 border-t border-line">
            {Array.from({ length: 3 }, (_, index) => (
              <li key={index} className="flex animate-pulse flex-col gap-3 border-b border-line py-7">
                <div className="h-5 w-40 rounded-full bg-surface" />
                <div className="h-4 w-64 rounded-full bg-surface" />
              </li>
            ))}
          </ul>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center gap-6 py-24 text-center">
            <p className="text-[21px] text-muted">Todavía no hiciste ningún pedido.</p>
            <ButtonLink to="/" size="lg">Ir al catálogo</ButtonLink>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <>
            <p className="mb-5 mt-12 text-sm text-muted">
              {totalOrders} {totalOrders === 1 ? 'pedido' : 'pedidos'}
            </p>

            <ul className="border-t border-line">
              {orders.map((order) => {
                const status = getOrderStatus(order.status);

                return (
                  <li
                    key={order.id}
                    className="flex flex-col gap-4 border-b border-line py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
                  >
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-[19px] font-semibold tracking-tight">
                          Pedido #{shortOrderNumber(order.id)}
                        </h2>
                        <Badge tone={status.tone}>{status.label}</Badge>
                      </div>
                      <p className="text-sm text-muted">{formatDate(order.date)}</p>
                    </div>

                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      <p className="text-[19px] font-medium">{formatPrice(order.totalAmount || 0)}</p>
                      <Button variant="secondary" onClick={() => setSelectedOrder(order)}>
                        Ver detalle
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Pagination className="mt-14" page={page} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </main>

      <Footer />

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}

export default OrdersHistoryPage;
