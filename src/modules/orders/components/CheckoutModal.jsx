import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createOrder } from '../services/orderService';
import AddressFields from './AddressFields';
import { EMPTY_ADDRESS, toAddressRequest } from '../helpers/address';
import { formatPrice } from '../../shared/helpers/format';
import Alert from '../../shared/ui/Alert';
import Button from '../../shared/ui/Button';
import Modal from '../../shared/ui/Modal';
import TextField from '../../shared/ui/TextField';

function Section({ title, children }) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-4 border-t border-line pt-6">
      <h3 id={titleId} className="text-[17px] font-semibold">{title}</h3>
      {children}
    </section>
  );
}

/**
 * Componente CheckoutModal
 * Modal para que el usuario complete la información de envío, tarjeta y notas antes de confirmar la compra
 *
 * @component
 * @param {array} cartItems - Items del carrito a comprar
 * @param {function} onClose - Función para cerrar el modal
 * @param {function} onOrderSuccess - Función a ejecutar cuando la orden es exitosa
 * @returns {JSX.Element} Modal de checkout
 */
function CheckoutModal({ cartItems, onClose, onOrderSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      shippingAddress: { ...EMPTY_ADDRESS },
      sameBillingAddress: true,
      billingAddress: { ...EMPTY_ADDRESS },
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      notes: '',
    },
  });

  // Si la facturacion usa la misma direccion, no se muestran sus campos
  const sameBillingAddress = watch('sameBillingAddress');
  const total = cartItems.reduce((sum, item) => sum + item.currentUnitPrice * item.quantity, 0);

  /**
   * Maneja el envío del formulario de checkout
   * Prepara los datos y crea la orden en el backend
   */
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');

      const shippingAddress = toAddressRequest(formData.shippingAddress);
      const billingAddress = formData.sameBillingAddress
        ? shippingAddress
        : toAddressRequest(formData.billingAddress);

      const { data, error: orderError } = await createOrder(
        cartItems,
        shippingAddress,
        billingAddress,
        formData.notes || 'Sin notas adicionales',
      );

      if (orderError) {
        setError(orderError || 'Error al procesar la orden');

        return;
      }

      onOrderSuccess(data);
    } catch (err) {
      setError('Error inesperado al procesar la orden');
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mientras se envia la orden no se puede cerrar el dialogo.
  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <Modal title="Finalizar compra" onClose={handleClose} size="lg">
      {error && <Alert tone="danger" className="mb-6">{error}</Alert>}

      {/* Resumen de compra */}
      <div className="mb-6 rounded-2xl bg-surface p-5 dark:bg-canvas">
        <h3 className="mb-3 text-[15px] font-semibold">Resumen</h3>
        <ul className="mb-3 flex flex-col gap-2">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 text-sm">
              <span className="text-muted">
                {item.name} <span aria-label={`${item.quantity} unidades`}>× {item.quantity}</span>
              </span>
              <span>{formatPrice(item.currentUnitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-line-strong pt-3 font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
        <Section title="Dirección de envío">
          <AddressFields name="shippingAddress" register={register} errors={errors.shippingAddress} />
        </Section>

        <Section title="Dirección de facturación">
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
            <input
              type="checkbox"
              className="size-5 rounded-md p-0 accent-accent shadow-none hover:shadow-none"
              {...register('sameBillingAddress')}
            />
            Usar la misma dirección de envío
          </label>

          {!sameBillingAddress && (
            <AddressFields
              name="billingAddress"
              register={register}
              errors={errors.billingAddress}
              shouldUnregister
            />
          )}
        </Section>

        {/*
          La pasarela de pagos todavia no esta integrada: los datos de la tarjeta
          son opcionales y createOrder no los envia. Si se completan, se valida
          el formato (react-hook-form no aplica `pattern` a campos vacios).
        */}
        <Section title="Pago">
          <Alert tone="info">
            El pago en línea todavía no está disponible: podés confirmar el pedido sin completar estos datos.
            No se envían ni se guardan.
          </Alert>
          <TextField
            label="Nombre del titular"
            hint="Opcional"
            autoComplete="cc-name"
            placeholder="Como figura en la tarjeta"
            error={errors.cardholderName?.message}
            {...register('cardholderName')}
          />
          <TextField
            label="Número de tarjeta"
            hint="Opcional"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            error={errors.cardNumber?.message}
            {...register('cardNumber', {
              pattern: {
                value: /^\d{13,19}$/,
                message: 'Número de tarjeta inválido (13-19 dígitos)',
              },
            })}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Vencimiento"
              hint="Opcional"
              autoComplete="cc-exp"
              placeholder="MM/AA"
              maxLength={5}
              error={errors.expiryDate?.message}
              {...register('expiryDate', {
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                  message: 'Formato: MM/AA',
                },
              })}
            />
            <TextField
              label="CVV"
              hint="Opcional"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              maxLength={4}
              error={errors.cvv?.message}
              {...register('cvv', {
                pattern: {
                  value: /^\d{3,4}$/,
                  message: 'CVV inválido (3-4 dígitos)',
                },
              })}
            />
          </div>
        </Section>

        <Section title="Notas">
          <TextField
            label="Notas para la entrega"
            hint="Opcional"
            multiline
            rows={3}
            placeholder="Ej: entregar después de las 18:00, dejar en recepción, etc."
            {...register('notes')}
          />
        </Section>

        <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
          <Button variant="secondary" size="lg" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? 'Procesando…' : 'Confirmar compra'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CheckoutModal;
