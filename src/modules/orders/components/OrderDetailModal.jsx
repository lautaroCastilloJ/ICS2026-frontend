import { useState, useEffect } from 'react';
import { getOrderById } from '../services/orderService';

/**
 * Modal de detalle de orden con diseño responsive.
 */
function OrderDetailModal({ order, orderId, isAdmin = false, onClose }) {
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderDetails, setOrderDetails] = useState(order || null);
  const [loading, setLoading] = useState(false);

  const effectiveId = orderId || order?.id;

  useEffect(() => {
    if (effectiveId) {
      loadOrderDetails();
    }
  }, [effectiveId, isAdmin]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await getOrderById(effectiveId);
      if (error) {
        console.error('Error al cargar detalles:', error);
        processOrderData(order || {});
        return;
      }
      processOrderData(data);
      setOrderDetails(data);
    } catch (err) {
      console.error('Error inesperado:', err);
      processOrderData(order || {});
    } finally {
      setLoading(false);
    }
  };

  const processOrderData = (orderData) => {
    if (!orderData) return;
    const items = orderData.orderItems || orderData.OrderItems || orderData.items || [];
    setOrderItems(items);
    if (items && items.length > 0) {
      const calculatedTotal = items.reduce((sum, item) => {
        const price = item.unitPrice || item.UnitPrice || 0;
        const quantity = item.quantity || item.Quantity || 0;
        return sum + price * quantity;
      }, 0);
      setTotal(calculatedTotal);
    } else {
      setTotal(orderData.totalAmount || orderData.TotalAmount || 0);
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Fecha no disponible';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      enviado: 'Enviado',
      delivered: 'Entregado',
      entregado: 'Entregado',
      cancelled: 'Cancelado',
      cancelado: 'Cancelado',
    };
    return statusMap[status?.toLowerCase()] || status || 'Desconocido';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-950 border border-yellow-200 text-yellow-200';
      case 'confirmed':
      case 'enviado':
        return 'bg-blue-950 border border-blue-200 text-blue-200';
      case 'delivered':
      case 'entregado':
        return 'bg-green-950 border border-green-200 text-green-200';
      case 'cancelled':
      case 'cancelado':
        return 'bg-red-950 border border-red-200 text-red-200';
      default:
        return 'bg-gray-950 border border-gray-200 text-gray-200';
    }
  };

  const orderData = orderDetails || order || {};

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Detalle de Orden
              </p>
              <h2 className="text-xl font-bold text-zinc-50">
                Orden #{orderData.id?.substring(0, 8) || effectiveId || 'N/A'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-lg text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          <div className="space-y-6 px-6 py-5">
            {loading ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-600 border-t-transparent" />
                <p className="text-zinc-200">Cargando detalles de la orden...</p>
              </div>
            ) : (
              <>
                {/* Info general */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold text-zinc-300">Fecha de Orden</p>
                      <p className="text-zinc-50">{formatDate(orderData.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-300">Estado</p>
                      <span className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(orderData.status)}`}>
                        {getStatusLabel(orderData.status)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-300">Cliente</p>
                      <p className="text-zinc-50">{orderData.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-300">Total</p>
                      <p className="text-2xl font-bold text-zinc-50">
                        ${(orderData.totalAmount || total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Productos */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-zinc-50">Productos</h3>
                  {orderItems && orderItems.length > 0 ? (
                    <div className="space-y-3">
                      {/* Encabezado desktop */}
                      <div className="hidden grid-cols-12 gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 md:grid">
                        <div className="col-span-6">Producto</div>
                        <div className="col-span-2 text-center">Cantidad</div>
                        <div className="col-span-2 text-right">Precio Unit.</div>
                        <div className="col-span-2 text-right">Subtotal</div>
                      </div>

                      {orderItems.map((item, index) => {
                        const unitPrice = item.unitPrice || item.UnitPrice || 0;
                        const quantity = item.quantity || item.Quantity || 0;
                        const subtotal = unitPrice * quantity;

                        return (
                          <div
                            key={index}
                            className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 transition hover:border-zinc-700"
                          >
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center md:gap-4">
                              <div className="md:col-span-6">
                                <p className="text-base font-semibold text-zinc-50">
                                  {item.productName || item.ProductName || `Producto ${index + 1}`}
                                </p>
                                <p className="mt-1 text-xs text-zinc-500">
                                  ID: {item.productId || item.ProductId || 'N/A'}
                                </p>
                              </div>

                              <div className="flex items-center justify-between md:col-span-2 md:block md:text-center">
                                <span className="text-sm text-zinc-400 md:hidden">Cantidad</span>
                                <p className="text-lg font-semibold text-zinc-50">{quantity}</p>
                              </div>

                              <div className="flex items-center justify-between md:col-span-2 md:block md:text-right">
                                <span className="text-sm text-zinc-400 md:hidden">Precio Unit.</span>
                                <p className="text-base font-semibold text-zinc-50">
                                  ${unitPrice.toFixed(2)}
                                </p>
                              </div>

                              <div className="flex items-center justify-between md:col-span-2 md:block md:text-right">
                                <span className="text-sm text-zinc-400 md:hidden">Subtotal</span>
                                <p className="text-lg font-bold text-zinc-50">
                                  ${subtotal.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-50 md:flex-row md:items-center md:justify-between">
                        <span className="text-base font-semibold">TOTAL:</span>
                        <span className="text-xl font-bold">${(orderData.totalAmount || total).toFixed(2)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 text-center text-zinc-200">
                      No hay informacion de productos disponible
                    </div>
                  )}
                </div>

                {/* Direcciones */}
                {(orderData.shippingAddress || orderData.ShippingAddress || orderData.billingAddress || orderData.BillingAddress) && (
                  <div className="space-y-3 border-t border-zinc-800 pt-4">
                    <h3 className="text-lg font-semibold text-zinc-50">Informacion de Envio</h3>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {(orderData.shippingAddress || orderData.ShippingAddress) && (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                          <p className="text-sm font-semibold text-zinc-300 mb-1">Direccion de Envio</p>
                          <p className="text-sm text-zinc-100">
                            {orderData.shippingAddress || orderData.ShippingAddress}
                          </p>
                        </div>
                      )}
                      {(orderData.billingAddress || orderData.BillingAddress) && (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                          <p className="text-sm font-semibold text-zinc-300 mb-1">Direccion de Facturacion</p>
                          <p className="text-sm text-zinc-100">
                            {orderData.billingAddress || orderData.BillingAddress}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notas */}
                {(orderData.notes || orderData.Notes) && (
                  <div className="space-y-2 border-t border-zinc-800 pt-4">
                    <h3 className="text-lg font-semibold text-zinc-50">Notas</h3>
                    <div className="rounded-xl border border-amber-200/40 bg-amber-900/20 p-4">
                      <p className="text-sm text-amber-100">{orderData.notes || orderData.Notes}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end px-6 py-4 border-t border-zinc-800 bg-zinc-900">
            <button
              onClick={onClose}
              className="shadow-s rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetailModal;
