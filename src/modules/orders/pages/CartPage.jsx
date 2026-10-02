import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import AuthModal from '../../auth/components/AuthModal';
import CheckoutModal from '../components/CheckoutModal';
import useAuth from '../../auth/hook/useAuth';
import { instance } from '../../shared/api/axiosInstance';
import { canPurchaseItem, countCartItems, hasAvailableStock, readCart, refreshCart, writeCart } from '../helpers/cart';
import { formatPrice } from '../../shared/helpers/format';
import Alert from '../../shared/ui/Alert';
import Button, { ButtonLink } from '../../shared/ui/Button';
import ConfirmDialog from '../../shared/ui/ConfirmDialog';
import IconButton from '../../shared/ui/IconButton';
import { ChevronLeftIcon, ImageIcon, MinusIcon, PlusIcon, TrashIcon } from '../../shared/ui/icons';

const stockMessage = (item) => {
  if (item.stockQuantity === null) return 'No pudimos consultar el stock';

  if (!hasAvailableStock(item)) return 'Sin stock disponible';

  if (item.quantity > item.stockQuantity) return `Solo quedan ${item.stockQuantity}. Reducí la cantidad.`;

  return `${item.stockQuantity} disponibles`;
};

/**
 * Pagina de Carrito de Compras
 *
 * Muestra:
 * - Listado de items en el carrito
 * - Opciones para modificar cantidades
 * - Total de los productos
 * - Boton para finalizar compra
 */
function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('token');
  const hasMissingPrices = cartItems.some((item) => item.currentUnitPrice === null);
  const hasStockProblems = cartItems.some((item) => !canPurchaseItem(item));
  const itemCount = countCartItems(cartItems);

  // Cargar carrito cuando cambia autenticacion
  useEffect(() => {
    let cancelled = false;

    const loadCart = async () => {
      setLoading(true);
      const cart = readCart();
      const recoveredCart = await refreshCart(cart, async (id) => {
        const { data } = await instance.get(`api/products/${encodeURIComponent(id)}`, {
          timeout: 10000,
        });

        return data;
      });

      if (cancelled) return;

      setCartItems(recoveredCart);
      setLoading(false);
      writeCart(recoveredCart);
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const saveCart = (updatedCart) => {
    setCartItems(updatedCart);
    writeCart(updatedCart);
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = cartItems.find((item) => item.id === productId);

    if (!product || !Number.isSafeInteger(newQuantity) || newQuantity < 1) return;

    if (newQuantity > product.quantity && !canPurchaseItem({ ...product, quantity: newQuantity })) return;

    saveCart(cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item,
    ));
  };

  const removeFromCart = (productId) => {
    saveCart(cartItems.filter((item) => item.id !== productId));
  };

  const calculateTotal = () => cartItems.reduce(
    (total, item) => total + item.currentUnitPrice * item.quantity,
    0,
  );

  const handleCheckout = () => {
    if (loading || hasMissingPrices || hasStockProblems) return;

    if (cartItems.length === 0) {
      setError('El carrito está vacío.');

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
    saveCart([]);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const handleClearCart = () => {
    saveCart([]);
    setShowClearConfirm(false);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-12 sm:px-6 sm:pt-18">
        <h1 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">Tu carrito.</h1>

        {orderConfirmation && (
          <Alert tone="success" title="¡Compra confirmada!" className="mt-10">
            <p>Tu pedido número <strong className="font-semibold">{orderConfirmation.id}</strong> se creó correctamente.</p>
            <p className="mt-1">Te llevamos al catálogo en unos segundos…</p>
          </Alert>
        )}

        {error && <Alert tone="danger" className="mt-10">{error}</Alert>}

        {loading && <p className="mt-6 text-[17px] text-muted" aria-live="polite">Cargando carrito…</p>}

        {!loading && cartItems.length === 0 && !orderConfirmation && (
          <div className="flex flex-col items-center gap-6 py-24 text-center">
            <p className="text-[21px] text-muted">Tu carrito está vacío.</p>
            <ButtonLink to="/" size="lg">Ir al catálogo</ButtonLink>
          </div>
        )}

        {!loading && cartItems.length > 0 && !orderConfirmation && (
          <>
            <p className="mb-12 mt-3 text-[17px] text-muted sm:text-[19px]">
              Revisá los productos antes de finalizar la compra.
            </p>

            {hasMissingPrices && (
              <Alert tone="danger" className="mb-8">
                No pudimos obtener el precio de algunos productos. Volvé a agregarlos desde el catálogo o quitalos para continuar.
              </Alert>
            )}

            {hasStockProblems && (
              <Alert tone="danger" className="mb-8">
                Revisá la disponibilidad de los productos y ajustá las cantidades antes de continuar. Si no pudimos consultar el stock, recargá la página.
              </Alert>
            )}

            <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
              {/* Lista de items */}
              <section aria-label="Productos en el carrito">
                <ul className="border-t border-line">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-5 gap-y-3 border-b border-line py-8 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:gap-x-6"
                    >
                      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-surface text-faint">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="size-full object-contain p-3 mix-blend-multiply dark:mix-blend-normal"
                          />
                        ) : (
                          <ImageIcon size={32} />
                        )}
                      </div>

                      <div className="flex min-w-0 flex-col gap-1">
                        <h2 className="line-clamp-2 text-[19px] font-semibold tracking-tight sm:text-[21px]">{item.name}</h2>
                        <p className="text-sm text-muted">
                          {item.currentUnitPrice === null ? 'Precio no disponible' : `${formatPrice(item.currentUnitPrice)} c/u`}
                        </p>
                        <p className={canPurchaseItem(item) ? 'text-sm text-muted' : 'text-sm font-medium text-danger'}>
                          {stockMessage(item)}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-5">
                          <div role="group" aria-label={`Cantidad de ${item.name}`} className="flex items-center rounded-full border border-line-strong">
                            <IconButton
                              label={`Quitar una unidad de ${item.name}`}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <MinusIcon size={16} />
                            </IconButton>
                            <span aria-live="polite" className="min-w-7 text-center text-[17px] font-medium">{item.quantity}</span>
                            <IconButton
                              label={`Agregar una unidad de ${item.name}`}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={!hasAvailableStock(item) || item.quantity >= item.stockQuantity}
                            >
                              <PlusIcon size={16} />
                            </IconButton>
                          </div>
                          <Button variant="link" onClick={() => removeFromCart(item.id)}>Quitar</Button>
                        </div>
                      </div>

                      <p className="col-start-2 whitespace-nowrap text-[19px] font-medium sm:col-start-3 sm:text-right">
                        {item.currentUnitPrice === null ? '—' : formatPrice(item.currentUnitPrice * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <ButtonLink to="/" variant="link">
                    <ChevronLeftIcon size={14} />
                    Seguir comprando
                  </ButtonLink>
                  <Button variant="danger" onClick={() => setShowClearConfirm(true)}>Vaciar carrito</Button>
                </div>
              </section>

              {/* Resumen de compra */}
              <aside aria-label="Resumen de la compra" className="flex flex-col gap-5 rounded-3xl bg-surface p-8 lg:sticky lg:top-22">
                <h2 className="text-[21px] font-semibold tracking-tight">Resumen</h2>
                <div className="flex justify-between gap-3 text-[15px]">
                  <span className="text-muted">Productos ({itemCount})</span>
                  <span>{hasMissingPrices ? 'Pendiente' : formatPrice(calculateTotal())}</span>
                </div>
                <div className="h-px bg-line-strong" />
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[19px] font-semibold">Total</span>
                  <span className="text-2xl font-semibold tracking-tight">
                    {hasMissingPrices ? 'Pendiente' : formatPrice(calculateTotal())}
                  </span>
                </div>
                <Button
                  size="lg"
                  block
                  onClick={handleCheckout}
                  disabled={loading || hasMissingPrices || hasStockProblems}
                >
                  Finalizar compra
                </Button>
                {!token && (
                  <p className="text-center text-[13px] leading-relaxed text-muted">
                    Para finalizar la compra necesitás{' '}
                    <button
                      type="button"
                      onClick={() => setShowAuthModal(true)}
                      className="cursor-pointer rounded-none bg-transparent p-0 text-link underline shadow-none"
                    >
                      iniciar sesión
                    </button>
                    .
                  </p>
                )}
              </aside>
            </div>
          </>
        )}
      </main>

      <Footer />

      {showClearConfirm && (
        <ConfirmDialog
          destructive
          icon={<TrashIcon size={28} />}
          title="¿Vaciar el carrito?"
          description={`Se van a quitar ${itemCount === 1 ? 'la unidad' : `las ${itemCount} unidades`} que agregaste. Esta acción no se puede deshacer.`}
          confirmLabel="Vaciar carrito"
          cancelLabel="Seguir con mi compra"
          onConfirm={handleClearCart}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}

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
