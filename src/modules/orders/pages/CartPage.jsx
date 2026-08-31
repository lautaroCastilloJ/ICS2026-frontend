import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/components/Header";
import AuthModal from "../../auth/components/AuthModal";
import CheckoutModal from "../components/CheckoutModal";
import useAuth from "../../auth/hook/useAuth";

/**
 * Pagina de Carrito de Compras
 *
 * Muestra:
 * - Listado de items en el carrito
 * - Opciones para modificar cantidades
 * - Totales (subtotal, impuestos, total)
 * - Boton para finalizar compra
 */
function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem("token");

  // Cargar carrito cuando cambia autenticacion
  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  const loadCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
    } catch (err) {
      console.error("Error al cargar el carrito:", err);
      setCartItems([]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 0) return;
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.currentUnitPrice * item.quantity;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxRate = 0.21;
    const taxes = subtotal * taxRate;
    return subtotal + taxes;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setError("El carrito esta vacio");
      return;
    }
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleOrderSuccess = (orderData) => {
    setOrderConfirmation(orderData);
    setShowCheckoutModal(false);
    setCartItems([]);
    localStorage.removeItem("cart");
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const handleClearCart = () => {
    if (window.confirm("¿Estas seguro de que deseas vaciar el carrito?")) {
      setCartItems([]);
      localStorage.removeItem("cart");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-50">Carrito de Compras</h1>
        </div>

        {orderConfirmation && (
          <div className="bg-green-950 border border-green-400 text-green-400 px-6 py-4 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-2">¡Orden Confirmada!</h2>
            <p className="mb-2">Tu orden ha sido creada exitosamente.</p>
            <p className="text-sm">
              Numero de orden: <strong>{orderConfirmation.id}</strong>
            </p>
            <p className="text-sm mt-2">
              Seras redirigido a la pagina principal en breve...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-950 border border-red-400 text-red-400 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {cartItems.length === 0 && !orderConfirmation && (
          <div className="bg-zinc-900 rounded-lg p-12 text-center">
            <p className="text-zinc-200 text-lg mb-4">Tu carrito esta vacio</p>
            <button
              onClick={() => navigate("/")}
              className="w-60 shadow-s p-4 bg-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
            >
              Volver a Productos
            </button>
          </div>
        )}

        {cartItems.length > 0 && !orderConfirmation && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Lista de items */}
            <div className="lg:col-span-2">
              <div className="bg-zinc-900 rounded-lg shadow-s p-4 text-white space-y-4">
                {/* Encabezado (solo desktop) */}
                <div className="hidden px-6 py-4 border-b border-zinc-800 md:block">
                  <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-zinc-50">
                    <div>Producto</div>
                    <div className="text-center">Cantidad</div>
                    <div className="text-right">Precio Unitario</div>
                    <div className="text-right">Total</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const itemTotal = (item.currentUnitPrice * item.quantity).toFixed(2);
                    return (
                      <div
                        key={item.id}
                        className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 transition hover:border-zinc-700"
                      >
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:items-center md:gap-4">
                          <div>
                            <p className="font-semibold text-zinc-50 line-clamp-2">{item.name}</p>
                            <p className="text-sm text-zinc-400 mt-1">SKU: {item.sku || "N/A"}</p>
                          </div>

                          <div className="flex items-center justify-start gap-2 md:justify-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-9 w-9 shadow-s rounded-xl bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              −
                            </button>
                            <span className="min-w-[32px] text-center text-lg font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-9 w-9 shadow-s rounded-xl bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center justify-between md:block">
                            <span className="text-sm text-zinc-400 md:hidden">Precio Unitario</span>
                            <p className="text-base font-semibold text-zinc-50 text-right md:text-right">
                              ${item.currentUnitPrice.toFixed(2)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between md:block md:text-right">
                            <div className="flex flex-col items-start md:items-end">
                              <span className="text-sm text-zinc-400 md:hidden">Total</span>
                              <p className="text-lg font-bold text-zinc-50">${itemTotal}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="mt-2 inline-flex items-center justify-center rounded-lg border border-red-900/50 bg-red-900/20 px-3 py-2 text-sm font-semibold text-red-300 transition hover:border-red-800 hover:bg-red-900/30 md:mt-3"
                            >
                              Quitar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Resumen de compra */}
            <div>
              <div className="bg-zinc-900 rounded-lg shadow p-6 sticky top-8 shadow-s text-white transition">
                <h2 className="text-xl font-bold text-zinc-50 mb-6">Resumen de Compra</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Subtotal</span>
                    <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Impuestos (21%)</span>
                    <span className="font-semibold">
                      ${(calculateSubtotal() * 0.21).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-zinc-400">Total</span>
                  <span className="text-2xl font-bold text-zinc-50">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full shadow-s p-4 bg-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-zinc-50 font-bold py-3 rounded-lg transition"
                  >
                    {loading ? "Procesando..." : "Finalizar Compra"}
                  </button>

                  <button
                    onClick={handleClearCart}
                    className="w-full shadow-s p-4 bg-zinc-900 hover:bg-red-950 hover:text-red-400 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
                  >
                    Vaciar Carrito
                  </button>

                  <button
                    onClick={() => navigate("/")}
                    className="w-full shadow-s p-4 bg-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
                  >
                    Continuar Comprando
                  </button>
                </div>

                {!token && (
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Necesitas iniciar sesion para finalizar la compra
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {showCheckoutModal && (
        <CheckoutModal
          cartItems={cartItems}
          onClose={() => setShowCheckoutModal(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}

export default CartPage;
