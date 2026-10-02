import { useState, useEffect } from 'react';
import { getOrderById } from '../services/orderService';
import { formatAddress } from '../helpers/address';
import { getOrderStatus, shortOrderNumber } from '../helpers/orderStatus';
import { formatDate, formatPrice } from '../../shared/helpers/format';
import Alert from '../../shared/ui/Alert';
import Badge from '../../shared/ui/Badge';
import Modal from '../../shared/ui/Modal';

// Acepta tanto camelCase como PascalCase en las respuestas del backend.
const pick = (source, camel, pascal) => source?.[camel] ?? source?.[pascal];

/**
 * Modal con el detalle completo de un pedido. Lo usan "Mis pedidos" y el
 * listado de órdenes del panel de administración.
 *
 * @param {object} [order] - Resumen ya cargado (se muestra mientras llega el detalle)
 * @param {string} [orderId] - Id del pedido, si no se pasa `order`
 * @param {function} onClose
 */
function OrderDetailModal({ order, orderId, onClose }) {
  const effectiveId = orderId || order?.id;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(Boolean(effectiveId));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!effectiveId) return;

    let cancelled = false;

    const loadDetails = async () => {
      setLoading(true);
      setError('');

      const { data, error: detailError } = await getOrderById(effectiveId);

      if (cancelled) return;

      if (detailError) {
        console.error('Error al cargar detalles:', detailError);
        setError('No pudimos cargar el detalle completo del pedido.');
      } else {
        setDetails(data);
      }

      setLoading(false);
    };

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [effectiveId]);

  const orderData = details || order || {};
  const items = pick(orderData, 'items', 'Items') || pick(orderData, 'orderItems', 'OrderItems') || [];
  const itemsTotal = items.reduce(
    (sum, item) => sum + (pick(item, 'unitPrice', 'UnitPrice') || 0) * (pick(item, 'quantity', 'Quantity') || 0),
    0,
  );
  const total = pick(orderData, 'totalAmount', 'TotalAmount') || itemsTotal;
  const status = getOrderStatus(pick(orderData, 'status', 'Status'));
  const shippingAddress = pick(orderData, 'shippingAddress', 'ShippingAddress');
  const billingAddress = pick(orderData, 'billingAddress', 'BillingAddress');
  const notes = pick(orderData, 'notes', 'Notes');

  return (
    <Modal title={`Pedido #${shortOrderNumber(effectiveId)}`} onClose={onClose} size="lg">
      {error && <Alert tone="danger" className="mb-6">{error}</Alert>}

      <dl className="grid grid-cols-1 gap-x-8 gap-y-5 rounded-2xl bg-surface p-5 sm:grid-cols-2 dark:bg-canvas">
        <div>
          <dt className="text-xs font-medium text-muted">Fecha</dt>
          <dd className="mt-1 text-[15px]">{formatDate(pick(orderData, 'date', 'Date'))}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted">Estado</dt>
          <dd className="mt-1"><Badge tone={status.tone}>{status.label}</Badge></dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted">Cliente</dt>
          <dd className="mt-1 text-[15px]">{pick(orderData, 'customerName', 'CustomerName') || 'No especificado'}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted">Total</dt>
          <dd className="mt-1 text-[21px] font-semibold tracking-tight">{formatPrice(total)}</dd>
        </div>
      </dl>

      <section aria-labelledby="detalle-productos" className="mt-8">
        <h3 id="detalle-productos" className="mb-2 text-[17px] font-semibold">Productos</h3>

        {loading ? (
          <div aria-hidden="true" className="flex flex-col gap-3 py-4">
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-surface" />
            <div className="h-5 w-1/2 animate-pulse rounded-full bg-surface" />
          </div>
        ) : items.length > 0 ? (
          <>
            <ul className="border-t border-line">
              {items.map((item, index) => {
                const unitPrice = pick(item, 'unitPrice', 'UnitPrice') || 0;
                const quantity = pick(item, 'quantity', 'Quantity') || 0;

                return (
                  <li key={pick(item, 'productId', 'ProductId') ?? index} className="flex items-start justify-between gap-4 border-b border-line py-4">
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium">
                        {pick(item, 'productName', 'ProductName') || `Producto ${index + 1}`}
                      </p>
                      <p className="mt-0.5 text-sm text-muted">{quantity} × {formatPrice(unitPrice)}</p>
                    </div>
                    <p className="whitespace-nowrap text-[15px] font-medium">{formatPrice(unitPrice * quantity)}</p>
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-between pt-4 text-[17px] font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </>
        ) : (
          <p className="py-4 text-[15px] text-muted">No hay información de productos disponible.</p>
        )}
      </section>

      {(shippingAddress || billingAddress) && (
        <section aria-labelledby="detalle-envio" className="mt-8 border-t border-line pt-6">
          <h3 id="detalle-envio" className="mb-4 text-[17px] font-semibold">Envío y facturación</h3>
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {shippingAddress && (
              <div>
                <dt className="text-xs font-medium text-muted">Dirección de envío</dt>
                <dd className="mt-1 text-[15px] leading-relaxed">{formatAddress(shippingAddress)}</dd>
              </div>
            )}
            {billingAddress && (
              <div>
                <dt className="text-xs font-medium text-muted">Dirección de facturación</dt>
                <dd className="mt-1 text-[15px] leading-relaxed">{formatAddress(billingAddress)}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {notes && (
        <section aria-labelledby="detalle-notas" className="mt-8 border-t border-line pt-6">
          <h3 id="detalle-notas" className="mb-2 text-[17px] font-semibold">Notas</h3>
          <p className="text-[15px] leading-relaxed text-muted">{notes}</p>
        </section>
      )}
    </Modal>
  );
}

export default OrderDetailModal;
