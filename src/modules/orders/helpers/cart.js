// El carrito persiste entre versiones de la app: validar sus datos al leerlo.
export const normalizeCart = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item.id === 'string' && item.id.trim())
    .map((item) => {
      const rawPrice = item.currentUnitPrice;
      const price = typeof rawPrice === 'number' ||
        (typeof rawPrice === 'string' && rawPrice.trim())
        ? Number(rawPrice)
        : NaN;
      const quantity = Number(item.quantity);
      const rawStock = item.stockQuantity;
      const stock = typeof rawStock === 'number' ||
        (typeof rawStock === 'string' && rawStock.trim())
        ? Number(rawStock)
        : NaN;

      return {
        ...item,
        currentUnitPrice: Number.isFinite(price) && price > 0 ? price : null,
        quantity: Number.isSafeInteger(quantity) && quantity > 0 ? quantity : 1,
        stockQuantity: Number.isSafeInteger(stock) && stock >= 0 ? stock : null,
      };
    });
};

export const readCart = () => {
  try {
    return normalizeCart(JSON.parse(localStorage.getItem('cart')));
  } catch {
    return [];
  }
};

export const refreshCart = async (cart, getProduct) => {
  const items = await Promise.all(normalizeCart(cart).map(async (item) => {
    try {
      const product = await getProduct(item.id);

      return {
        ...item,
        ...product,
        id: item.id,
        quantity: item.quantity,
        currentUnitPrice: product?.currentUnitPrice,
        stockQuantity: product?.stockQuantity,
      };
    } catch {
      // No autorizar la compra con stock guardado que no pudimos verificar.
      return { ...item, stockQuantity: null };
    }
  }));

  return normalizeCart(items);
};

export const hasAvailableStock = (item) =>
  item.isActive !== false && Number.isSafeInteger(item.stockQuantity) && item.stockQuantity > 0;

export const canPurchaseItem = (item) =>
  hasAvailableStock(item) && Number.isSafeInteger(item.quantity) &&
  item.quantity > 0 && item.quantity <= item.stockQuantity;

export const addProductToCart = (cart, product, quantity = 1) => {
  const existingItem = cart.find((item) => item.id === product.id);
  const nextQuantity = (existingItem?.quantity ?? 0) + quantity;

  if (!Number.isSafeInteger(quantity) || quantity <= 0 ||
    !canPurchaseItem({ ...product, quantity: nextQuantity })) {
    return cart;
  }

  const updatedItem = {
    ...existingItem,
    ...product,
    quantity: nextQuantity,
  };

  return normalizeCart(existingItem
    ? cart.map((item) => item.id === product.id ? updatedItem : item)
    : [...cart, updatedItem]);
};
