const formatter = (fractionDigits) => new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: fractionDigits,
  maximumFractionDigits: fractionDigits,
});

const wholeFormatter = formatter(0);
const centsFormatter = formatter(2);

// 329999 -> "$ 329.999"; 12.5 -> "$ 12,50" (los centavos solo si los hay)
export const formatPrice = (value) =>
  (Number.isInteger(value) ? wholeFormatter : centsFormatter).format(value);

// hourCycle 'h23': reloj de 24 horas (00:00 a 23:59), sin "a. m." / "p. m.".
// Se muestra en la zona horaria del navegador; el backend envia la fecha en UTC.
const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

// "2026-10-02T17:23:05Z" -> "2 de octubre de 2026, 14:23" (en Argentina)
export const formatDate = (value) => {
  if (!value) return 'Fecha no disponible';

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? String(value) : dateFormatter.format(date);
};
