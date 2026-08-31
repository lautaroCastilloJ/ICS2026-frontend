import { useEffect, useState } from 'react';
import { getAllOrders } from '../services/adminOrderService';
import OrderDetailModal from '../components/OrderDetailModal';

function ListOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Cargar ordenes cuando cambia pagina o tamano
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await getAllOrders(pageNumber, pageSize);

      if (error) {
        console.error('Error al cargar ordenes:', error);
        return;
      }

      setTotal(data.total);
      setOrders(data.items || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pageNumber, pageSize]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  // Manejar apertura del modal de detalles
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setSelectedOrderId(order.id);
    setShowDetailModal(true);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const renderStatusBadge = (status) => {
    const normalized = status?.toLowerCase() || '';
    const style = normalized.includes('complet') // completada/completed
      ? 'bg-emerald-500/15 text-emerald-200'
      : normalized.includes('pend') // pendiente/pending
      ? 'bg-amber-500/15 text-amber-200'
      : normalized.includes('cancel') // cancelada/cancelled
      ? 'bg-red-500/15 text-red-200'
      : 'bg-zinc-700/60 text-zinc-200';

    return (
      <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${style}`}>
        {status || 'Desconocido'}
      </span>
    );
  };

  return (
    <div className="w-full min-h-full bg-zinc-900 text-white shadow-l rounded-xl p-4">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Ventas</p>
            <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">Ordenes</h1>
            <p className="text-sm text-zinc-400 sm:text-base">
              Revisa y gestiona el historial de ordenes con detalles completos.
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
            <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs font-semibold text-emerald-300">
              Total: {total}
            </span>
          </div>
        </div>

        {/* Resumen rapido */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-l">
            <p className="text-sm text-zinc-400">Ordenes totales</p>
            <p className="text-3xl font-bold text-zinc-50 sm:text-4xl">{total}</p>
            <p className="mt-1 text-sm text-zinc-500">Incluye todas las paginas del listado.</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-l">
            <p className="text-sm text-zinc-400">Vista</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-400 sm:text-sm">
              <span className="rounded-full border border-zinc-800 px-3 py-1">Tabla desktop</span>
              <span className="rounded-full border border-zinc-800 px-3 py-1">Tarjetas mobile</span>
              <span className="rounded-full border border-zinc-800 px-3 py-1">Modal de detalle</span>
            </div>
          </div>
        </div>

        {/* Lista de ordenes */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-l sm:p-5">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-600 border-t-transparent" />
              <span className="ml-3 text-sm text-zinc-400">Cargando ordenes...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-10 text-center text-zinc-400">
              No hay ordenes registradas
            </div>
          ) : (
            <>
              {/* Tabla escritorio */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/60 text-left text-sm uppercase tracking-wide text-zinc-400">
                      <th className="px-4 py-3">ID Orden</th>
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 text-center">Estado</th>
                      <th className="px-4 py-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-zinc-800/60 text-sm text-zinc-200 transition hover:bg-zinc-900">
                        <td className="px-4 py-3 font-mono text-xs text-zinc-400">#{order.id}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-zinc-100">{order.customerName || 'N/A'}</div>
                          <div className="text-xs text-zinc-500">{order.customerId || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-3 text-zinc-200">{formatDate(order.date)}</td>
                        <td className="px-4 py-3 text-right font-semibold">
                          ${order.totalAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-4 py-3 text-center">{renderStatusBadge(order.status)}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-400"
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista mobile/cards */}
              <div className="grid grid-cols-1 gap-3 lg:hidden">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-sm transition hover:border-zinc-700"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-500">#{order.id}</p>
                        <p className="text-lg font-semibold text-zinc-50">{order.customerName || 'N/A'}</p>
                        <p className="text-xs text-zinc-500">{order.customerId || 'N/A'}</p>
                      </div>
                      {renderStatusBadge(order.status)}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                      <span className="rounded-full border border-zinc-800 px-3 py-1 font-semibold">
                        {formatDate(order.date)}
                      </span>
                      <span className="rounded-full border border-zinc-800 px-3 py-1 font-semibold">
                        ${order.totalAmount?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="flex-1 rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
                      >
                        Ver detalle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Paginacion */}
        {orders.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-200 sm:px-5">
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber(pageNumber - 1)}
              className="rounded-lg bg-zinc-800 px-4 py-2 font-semibold transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-800/60"
            >
              Anterior
            </button>

            <span className="px-2 text-sm font-semibold">
              Pagina {pageNumber} de {totalPages}
            </span>

            <button
              disabled={pageNumber === totalPages || totalPages === 0}
              onClick={() => setPageNumber(pageNumber + 1)}
              className="rounded-lg bg-zinc-800 px-4 py-2 font-semibold transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-800/60"
            >
              Siguiente
            </button>

            <select
              value={pageSize}
              onChange={(evt) => {
                setPageNumber(1);
                setPageSize(Number(evt.target.value));
              }}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-medium text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
            >
              <option className="bg-zinc-900" value="5">5 por pagina</option>
              <option className="bg-zinc-900" value="10">10 por pagina</option>
              <option className="bg-zinc-900" value="15">15 por pagina</option>
              <option className="bg-zinc-900" value="20">20 por pagina</option>
            </select>
          </div>
        )}

        {/* Modal de detalles */}
        {showDetailModal && (
          <OrderDetailModal
            orderId={selectedOrderId}
            order={selectedOrder}
            isAdmin
            onClose={() => {
              setShowDetailModal(false);
              setSelectedOrderId(null);
              setSelectedOrder(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ListOrdersPage;
