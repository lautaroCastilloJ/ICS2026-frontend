import { useSyncExternalStore } from 'react';
import { CART_CHANGE_EVENT, countCartItems, readCart } from '../helpers/cart';

const subscribe = (listener) => {
  window.addEventListener(CART_CHANGE_EVENT, listener);
  // Cambios hechos desde otra pestana.
  window.addEventListener('storage', listener);

  return () => {
    window.removeEventListener(CART_CHANGE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
};

const getCount = () => countCartItems(readCart());

/** Cantidad total de unidades en el carrito, actualizada en vivo. */
const useCartCount = () => useSyncExternalStore(subscribe, getCount);

export default useCartCount;
