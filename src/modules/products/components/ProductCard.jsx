import { useState } from 'react';
import { addProductToCart, hasAvailableStock, readCart } from '../../orders/helpers/cart';

/**
 * Agrega una unidad al carrito; las cantidades se modifican en el carrito.
 * Permite agregar aun sin estar autenticado (se guarda en localStorage).
 */
function ProductCard({ product }) {
  const [feedback, setFeedback] = useState('');

  const handleAddToCart = () => {
    const cart = readCart();
    const updatedCart = addProductToCart(cart, product);

    if (updatedCart === cart) {
      setFeedback('Ya agregaste todas las unidades disponibles. Podés revisar la cantidad en el carrito.');
      return;
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setFeedback('Agregado al carrito');
  };

  return (
    <>
      <div className="shadow-l rounded-xl p-4 bg-zinc-900 text-white">
        <div className="bg-gray-200 aspect-square overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-gray-400 text-center w-full h-full flex flex-col items-center justify-center">
              <p>Sin imagen</p>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-zinc-50 font-semibold h-15 text-lg mb-1 line-clamp-2">
            {product.name}
          </h3>

          <p className="text-zinc-400 text-xl mb-3">
            ${product.currentUnitPrice.toFixed(2)}
          </p>

          {product.stockQuantity > 0 ? (
            <p className="text-zinc-400 text-sm font-medium mb-3">
              Stock: {product.stockQuantity}
            </p>
          ) : (
            <p className="text-red-600 text-sm font-medium mb-3">
              Sin stock
            </p>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!hasAvailableStock(product)}
            className="w-full shadow-s rounded-xl p-4 bg-zinc-900 text-white transition hover:bg-zinc-50 hover:text-zinc-900 disabled:bg-gray-500 disabled:cursor-not-allowed
                     font-semibold py-2"
          >
            Agregar al carrito
          </button>

          {feedback && (
            <p role="status" className="text-zinc-300 text-sm text-center mt-2 font-medium">
              {feedback}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductCard;
