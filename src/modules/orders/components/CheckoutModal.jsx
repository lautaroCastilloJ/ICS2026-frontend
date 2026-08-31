import { useState } from "react";
import { useForm } from "react-hook-form";
import { createOrder } from "../services/orderService";

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
  // Estado para el estado de carga durante el envío
  const [loading, setLoading] = useState(false);

  // Estado para mostrar mensajes de error
  const [error, setError] = useState("");

  // Hook para manejar formularios con validación
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      shippingAddress: "",
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      notes: "",
    },
  });

  /**
   * Maneja el envío del formulario de checkout
   * Prepara los datos y crea la orden en el backend
   */
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setError("");

      // Llamamos al servicio para crear la orden con los datos completos
      const { data, error: orderError } = await createOrder(
        cartItems,
        formData.shippingAddress,
        `Tarjeta a nombre de: ${formData.cardholderName}`, // BillingAddress
        formData.notes || "Sin notas adicionales"
      );

      if (orderError) {
        setError(orderError || "Error al procesar la orden");
        return;
      }

      // Si es exitoso, llamamos al callback
      onOrderSuccess(data);
    } catch (err) {
      setError("Error inesperado al procesar la orden");
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Fondo con efecto blur */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header del modal */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-zinc-900">
            <h2 className="text-2xl font-bold text-zinc-50">Checkout</h2>
            <button
              onClick={onClose}
              className="text-gray-50 hover:text-gray-400 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Contenido del modal */}
          <div className="p-6">
            {/* Mostrar error si existe */}
            {error && (
              <div className="bg-red-950 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Resumen de compra */}
            <div className="bg-zinc-900 rounded-lg p-4 mb-6  shadow-s text-white">
              <h3 className="font-semibold text-zinc-50 mb-3">
                Resumen de Compra
              </h3>
              <div className="space-y-2 mb-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-zinc-50"
                  >
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>
                      ${(item.currentUnitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-2 font-semibold text-gray-50 flex justify-between">
                <span>Total (con IVA 21%):</span>
                <span>
                  $
                  {(
                    cartItems.reduce(
                      (total, item) =>
                        total + item.currentUnitPrice * item.quantity,
                      0
                    ) * 1.21
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" >
              {/* Sección: Dirección de Envío */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-zinc-50 mb-4">
                  Dirección de Envío
                </h3>

                <div>
                  <label className="block text-zinc-50 font-semibold mb-2">
                    Dirección Completa *
                  </label>
                  <textarea
                    {...register("shippingAddress", {
                      required: "La dirección de envío es obligatoria",
                      minLength: {
                        value: 10,
                        message:
                          "La dirección debe tener al menos 10 caracteres",
                      },
                    })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-50 placeholder:text-zinc-400 text-zinc-50 ${
                      errors.shippingAddress
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Calle, altura, ciudad, provincia, código postal"
                    rows="3"
                  />
                  {errors.shippingAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.shippingAddress.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Sección: Información de Tarjeta */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-zinc-50 mb-4">
                  Información de Pago
                </h3>

                {/* Nombre del Titular */}
                <div className="mb-4">
                  <label className="block text-zinc-50 font-semibold mb-2">
                    Nombre del Titular *
                  </label>
                  <input
                    type="text"
                    {...register("cardholderName", {
                      required: "El nombre del titular es obligatorio",
                    })}
                    className={`w-full placeholder:text-zinc-400 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-50 text-zinc-50 ${
                      errors.cardholderName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Nombre completo del titular"
                  />
                  {errors.cardholderName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cardholderName.message}
                    </p>
                  )}
                </div>

                {/* Número de Tarjeta */}
                <div className="mb-4">
                  <label className="block text-zinc-50 font-semibold mb-2">
                    Número de Tarjeta *
                  </label>
                  <input
                    type="text"
                    {...register("cardNumber", {
                      required: "El número de tarjeta es obligatorio",
                      pattern: {
                        value: /^\d{13,19}$/,
                        message: "Número de tarjeta inválido (13-19 dígitos)",
                      },
                    })}
                    className={`w-full placeholder:text-zinc-400 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-50 text-zinc-50 ${
                      errors.cardNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cardNumber.message}
                    </p>
                  )}
                </div>

                {/* Fecha de Vencimiento y CVV */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Fecha de Vencimiento */}
                  <div>
                    <label className="block text-zinc-50 font-semibold mb-2">
                      Vencimiento (MM/AA) *
                    </label>
                    <input
                      type="text"
                      {...register("expiryDate", {
                        required: "La fecha de vencimiento es obligatoria",
                        pattern: {
                          value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                          message: "Formato: MM/AA",
                        },
                      })}
                      className={`w-full placeholder:text-zinc-400 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-50 text-zinc-50 ${
                        errors.expiryDate ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="12/25"
                      maxLength="5"
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.expiryDate.message}
                      </p>
                    )}
                  </div>

                  {/* CVV */}
                  <div>
                    <label className="block text-zinc-50 font-semibold mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      {...register("cvv", {
                        required: "El CVV es obligatorio",
                        pattern: {
                          value: /^\d{3,4}$/,
                          message: "CVV inválido (3-4 dígitos)",
                        },
                      })}
                      className={`w-full px-4 placeholder:text-zinc-400 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-50 text-zinc-50 ${
                        errors.cvv ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="123"
                      maxLength="4"
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cvv.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sección: Notas */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-zinc-50 mb-4">
                  Notas Adicionales
                </h3>

                <div>
                  <label className="block text-zinc-50 font-semibold mb-2">
                    Notas (Opcional)
                  </label>
                  <textarea
                    {...register("notes")}
                    className="w-full px-4 py-2 border placeholder:text-zinc-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-50 text-zinc-50"
                    placeholder="Ej: Entregar después de las 18:00, dejar en recepción, etc."
                    rows="3"
                  />
                </div>
              </div>

              {/* Botón de compra */}
              <div className="border-t border-gray-200 pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-200 hover:bg-red-950 text-zinc-950 hover:text-red-400 font-semibold py-2 rounded-lg transition"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 w-full shadow-s p-4 bg-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 disabled:bg-gray-400 disabled:cursor-not-allowed
                               text-white font-bold py-3 rounded-lg  transition "
                  disabled={loading}
                >
                  {loading ? "Procesando..." : "Confirmar Compra"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckoutModal;
