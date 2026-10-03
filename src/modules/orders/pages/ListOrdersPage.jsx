import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllOrders } from '../services/adminOrderService';
import OrderDetailModal from '../components/OrderDetailModal';
import { ORDER_STATUSES, getOrderStatus, shortOrderNumber } from '../helpers/orderStatus';
import { formatDate, formatPrice } from '../../shared/helpers/format';
import Alert from '../../shared/ui/Alert';
import Badge from '../../shared/ui/Badge';
import Button from '../../shared/ui/Button';
import PageHeader from '../../shared/ui/PageHeader';
import Pagination from '../../shared/ui/Pagination';
import Select from '../../shared/ui/Select';
import { ReceiptIcon } from '../../shared/ui/icons';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  ...ORDER_STATUSES.map(({ value, label }) => ({ value, label })),
];

const PAGE_SIZE_OPTIONS = [5, 10, 20].map((size) => ({ value: String(size), label: `${size} por página` }));

/**
 * Pedidos de todos los clientes (panel de administracion). El filtro de estado
 * vive en la URL (?status=Pending) para poder enlazarlo desde el resumen.
 */
function ListOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') ?? '';

  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await getAllOrders(pageNumber, pageSize, status);

    if (fetchError) {
      setError(fetchError);
    } else {
      setTotal(data.total);
      setOrders(data.items);
    }

    setLoading(false);
  }, [pageNumber, pageSize, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const changeStatusFilter = (value) => {
    setPageNumber(1);
    setSearchParams(value ? { status: value } : {});
  };

  const handleStatusChanged = (updated) => {
    setNotice(`El pedido #${shortOrderNumber(updated.id)} ahora está ${getOrderStatus(updated.status).label.toLowerCase()}.`);
    fetchOrders();
  };

  return (
    <>
      <PageHeader title="Pedidos" description="Revisá los pedidos de los clientes y actualizá su estado." />

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
        <Select
          label="Estado"
          hideLabel
          options={STATUS_OPTIONS}
          value={status}
          onChange={(event) => changeStatusFilter(event.target.value)}
          className="lg:w-56"
        />
        <Select
          label="Pedidos por página"
          hideLabel
          options={PAGE_SIZE_OPTIONS}
          value={String(pageSize)}
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setPageNumber(1);
          }}
          className="lg:w-44"
        />
      </div>

      {notice && <Alert tone="success" className="mb-6">{notice}</Alert>}
      {error && <Alert tone="danger" className="mb-6">{error}</Alert>}

      <p className="mb-4 text-sm text-muted" aria-live="polite">
        {loading ? 'Cargando pedidos…' : `${total} ${total === 1 ? 'pedido' : 'pedidos'}`}
      </p>

      {loading ? (
        <div aria-hidden="true" className="flex flex-col border-t border-line">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex animate-pulse items-center gap-4 border-b border-line py-5">
              <div className="h-4 w-24 rounded-full bg-surface" />
              <div className="h-4 flex-1 rounded-full bg-surface" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-surface px-6 py-16 text-center">
          <ReceiptIcon size={32} className="text-muted" />
          <p className="text-[17px] text-muted">
            {status ? `No hay pedidos con estado “${getOrderStatus(status).label}”.` : 'Todavía no hay pedidos.'}
          </p>
          {status && <Button variant="secondary" onClick={() => changeStatusFilter('')}>Ver todos los pedidos</Button>}
        </div>
      ) : (
        <>
          {/* Tabla (escritorio) */}
          <div className="hidden lg:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line text-xs text-muted">
                  <th scope="col" className="py-3 pr-4 font-medium">Pedido</th>
                  <th scope="col" className="px-4 py-3 font-medium">Cliente</th>
                  <th scope="col" className="px-4 py-3 font-medium">Fecha</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Total</th>
                  <th scope="col" className="px-4 py-3 font-medium">Estado</th>
                  <th scope="col" className="py-3 pl-4 text-right font-medium"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const orderStatus = getOrderStatus(order.status);

                  return (
                    <tr key={order.id} className="border-b border-line">
                      <td className="py-4 pr-4 font-mono text-sm">#{shortOrderNumber(order.id)}</td>
                      <td className="px-4 py-4 font-medium">{order.customerName || 'Sin nombre'}</td>
                      <td className="px-4 py-4 text-sm text-muted">{formatDate(order.date)}</td>
                      <td className="px-4 py-4 text-right">{formatPrice(order.totalAmount ?? 0)}</td>
                      <td className="px-4 py-4"><Badge tone={orderStatus.tone}>{orderStatus.label}</Badge></td>
                      <td className="py-4 pl-4 text-right">
                        <Button variant="secondary" size="sm" onClick={() => setSelectedOrder(order)}>
                          Ver detalle
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Lista (celular y tablet) */}
          <ul className="border-t border-line lg:hidden">
            {orders.map((order) => {
              const orderStatus = getOrderStatus(order.status);

              return (
                <li key={order.id} className="flex flex-col gap-3 border-b border-line py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{order.customerName || 'Sin nombre'}</p>
                      <p className="text-sm text-muted">#{shortOrderNumber(order.id)} · {formatDate(order.date)}</p>
                    </div>
                    <span className="font-medium">{formatPrice(order.totalAmount ?? 0)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Badge tone={orderStatus.tone}>{orderStatus.label}</Badge>
                    <Button variant="secondary" size="sm" onClick={() => setSelectedOrder(order)}>Ver detalle</Button>
                  </div>
                </li>
              );
            })}
          </ul>

          <Pagination className="mt-10" page={pageNumber} totalPages={totalPages} onPageChange={setPageNumber} />
        </>
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isAdmin
          onStatusChanged={handleStatusChanged}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}

export default ListOrdersPage;
