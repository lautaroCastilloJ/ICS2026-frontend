import { useState } from 'react';
import { addProductToCart, hasAvailableStock, readCart, writeCart } from '../../orders/helpers/cart';
import { formatPrice } from '../../shared/helpers/format';
import Button from '../../shared/ui/Button';
import { ImageIcon } from '../../shared/ui/icons';

// Desde este stock se avisa "Últimas N unidades".
const LOW_STOCK_THRESHOLD = 3;

const quantityInCart = (productId) => readCart().find((item) => item.id === productId)?.quantity ?? 0;

/**
 * Tarjeta de producto del catalogo.
 * Agrega una unidad al carrito; las cantidades se modifican en el carrito.
 * Permite agregar aun sin estar autenticado (se guarda en localStorage).
 */
function ProductCard({ product }) {
  const [inCart, setInCart] = useState(() => quantityInCart(product.id));
  const [feedback, setFeedback] = useState('');
  const [imageFailed, setImageFailed] = useState(false);

  const inStock = hasAvailableStock(product);
  const canAddMore = inStock && inCart < product.stockQuantity;
  const lowStock = inStock && product.stockQuantity <= LOW_STOCK_THRESHOLD;

  const handleAddToCart = () => {
    const cart = readCart();
    const updatedCart = addProductToCart(cart, product);

    if (updatedCart === cart) {
      setFeedback('Ya agregaste todas las unidades disponibles.');

      return;
    }

    writeCart(updatedCart);
    setInCart(quantityInCart(product.id));
    setFeedback('');
  };

  return (
    <article className="flex flex-col gap-4">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-card bg-surface text-faint">
        {product.imageUrl && !imageFailed ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="size-full object-contain p-6 mix-blend-multiply dark:mix-blend-normal"
          />
        ) : (
          <ImageIcon size={44} role="img" aria-label="Sin imagen" aria-hidden={undefined} />
        )}
      </div>

      <div className="flex flex-col gap-1 px-1">
        {lowStock && (
          <p className="text-xs font-semibold text-warn">
            {product.stockQuantity === 1 ? 'Última unidad' : `Últimas ${product.stockQuantity} unidades`}
          </p>
        )}
        {!inStock && <p className="text-xs font-semibold text-muted">Sin stock</p>}
        <h2 className="line-clamp-2 text-[19px] font-semibold tracking-tight">{product.name}</h2>
        {product.description && (
          <p className="line-clamp-2 text-sm leading-snug text-muted">{product.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex flex-col">
          <span className="text-[17px] font-medium">{formatPrice(product.currentUnitPrice)}</span>
          {inCart > 0 && <span className="text-xs text-muted">{inCart} en el carrito</span>}
        </div>
        <Button onClick={handleAddToCart} disabled={!canAddMore}>
          {!inStock ? 'Agotado' : canAddMore ? 'Agregar' : 'Sin más stock'}
        </Button>
      </div>

      {feedback && <p role="status" className="px-1 text-xs text-muted">{feedback}</p>}
    </article>
  );
}

export default ProductCard;
