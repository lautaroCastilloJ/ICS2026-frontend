import { useState } from 'react';

/**
 * Tarjeta individual de producto con control de cantidad y agregado al carrito.
 * Permite agregar aun sin estar autenticado (se guarda en localStorage).
 */
function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value, 10) || 0;
    if (value < 0) value = 0;
    if (value > product.stockQuantity) value = product.stockQuantity;
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (quantity === 0) {
      alert('Por favor selecciona una cantidad');
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = existingCart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      existingCart.push({
        ...product,
        quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    setQuantity(0);
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

          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={handleDecrease}
              disabled={quantity === 0 || product.stockQuantity === 0}
              className="w-10 h-10 shadow-s rounded-xl p-4 bg-zinc-900 text-white flex items-center justify-center 
                         hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition hover:text-zinc-950"
            >
              -
            </button>

            <input
              type="number"
              min="0"
              max={product.stockQuantity}
              value={quantity}
              onChange={handleQuantityChange}
              className="w-16 text-center rounded-lg border border-zinc-700 bg-zinc-950 text-white py-2"
              disabled={product.stockQuantity === 0}
            />

            <button
              onClick={handleIncrease}
              disabled={quantity >= product.stockQuantity || product.stockQuantity === 0}
              className="w-10 h-10 shadow-s rounded-xl p-4 bg-zinc-900 text-white flex items-center justify-center 
                         hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition hover:text-zinc-950"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={quantity === 0 || product.stockQuantity === 0}
            className="w-full shadow-s rounded-xl p-4 bg-zinc-900 text-white transition hover:bg-zinc-50 hover:text-zinc-900 disabled:bg-gray-500 disabled:cursor-not-allowed
                     font-semibold py-2"
          >
            Agregar
          </button>

          {showSuccess && (
            <p className="text-green-600 text-sm text-center mt-2 font-medium">
              Agregado al carrito
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductCard;
