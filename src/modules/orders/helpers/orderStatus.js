// Estados de OrderStatus (backend) con su texto y el tono de su Badge.
const STATUSES = {
  pending: { value: 'Pending', label: 'Pendiente', tone: 'warn' },
  processing: { value: 'Processing', label: 'En preparación', tone: 'info' },
  shipped: { value: 'Shipped', label: 'Enviado', tone: 'info' },
  delivered: { value: 'Delivered', label: 'Entregado', tone: 'success' },
  cancelled: { value: 'Cancelled', label: 'Cancelado', tone: 'danger' },
};

export const ORDER_STATUSES = Object.values(STATUSES);

export const getOrderStatus = (status) =>
  STATUSES[String(status ?? '').toLowerCase()] ?? { value: status, label: status || 'Desconocido', tone: 'neutral' };

// Transiciones permitidas: las mismas que Order.ChangeStatus en el dominio.
// Delivered y Cancelled son finales.
const NEXT_STATUSES = {
  pending: ['Processing', 'Cancelled'],
  processing: ['Shipped', 'Cancelled'],
  shipped: ['Delivered', 'Cancelled'],
};

export const getNextOrderStatuses = (status) =>
  (NEXT_STATUSES[String(status ?? '').toLowerCase()] ?? []).map(getOrderStatus);

// Numero corto y legible de un pedido a partir de su GUID.
export const shortOrderNumber = (id) => (id ? String(id).slice(0, 8).toUpperCase() : '—');
