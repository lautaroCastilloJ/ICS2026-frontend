// Estados de OrderStatus (backend) con su texto y el tono de su Badge.
const STATUSES = {
  pending: { label: 'Pendiente', tone: 'warn' },
  processing: { label: 'En preparación', tone: 'info' },
  shipped: { label: 'Enviado', tone: 'info' },
  delivered: { label: 'Entregado', tone: 'success' },
  cancelled: { label: 'Cancelado', tone: 'danger' },
};

export const getOrderStatus = (status) =>
  STATUSES[String(status ?? '').toLowerCase()] ?? { label: status || 'Desconocido', tone: 'neutral' };

// Numero corto y legible de un pedido a partir de su GUID.
export const shortOrderNumber = (id) => (id ? String(id).slice(0, 8).toUpperCase() : '—');
