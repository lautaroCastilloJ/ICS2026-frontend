import assert from 'node:assert/strict';
import { test } from 'node:test';
import { addProductToCart, canPurchaseItem, normalizeCart, readCart, refreshCart } from '../src/modules/orders/helpers/cart.js';

test('convierte precios y cantidades persistidos como texto antes de calcular totales', () => {
  const [item] = normalizeCart([{ id: 'producto', currentUnitPrice: '1500.50', quantity: '2' }]);
  assert.equal(item.currentUnitPrice.toFixed(2), '1500.50');
  assert.equal(item.quantity + 1, 3);
  assert.equal(item.currentUnitPrice * item.quantity, 3001);
});

test('no convierte precios ausentes o invalidos en productos gratis', () => {
  for (const price of [undefined, null, '', ' ', 'incorrecto', false, [], {}, Infinity, -1, 0]) {
    const [item] = normalizeCart([{ id: 'producto', currentUnitPrice: price, quantity: 2 }]);
    assert.equal(item.currentUnitPrice, null);
    assert.equal(item.quantity, 2);
  }
});

test('tolera estructuras invalidas del almacenamiento', () => {
  assert.deepEqual(normalizeCart({}), []);
  assert.deepEqual(normalizeCart([null, {}, 5]), []);
  assert.equal(normalizeCart([{ id: 'producto', quantity: -2 }])[0].quantity, 1);
});

test('actualiza precios y stock de todos los productos conservando las cantidades elegidas', async () => {
  const queriedIds = [];
  const result = await refreshCart([
    { id: 'antiguo', name: 'Nombre viejo', quantity: 3 },
    { id: 'valido', currentUnitPrice: 50, stockQuantity: 8, quantity: 2 },
  ], async (id) => {
    queriedIds.push(id);
    return { id, name: 'Nombre actual', currentUnitPrice: 100, stockQuantity: 4 };
  });
  assert.deepEqual(queriedIds, ['antiguo', 'valido']);
  assert.equal(result[0].currentUnitPrice.toFixed(2), '100.00');
  assert.equal(result[0].quantity, 3);
  assert.equal(result[0].name, 'Nombre actual');
  assert.equal(result[1].stockQuantity, 4);
  assert.equal(result.reduce((total, item) => total + item.currentUnitPrice * item.quantity, 0), 500);
});

test('conserva el producto sin precio si la API falla o devuelve datos incompletos', async () => {
  const cart = [{ id: 'antiguo', quantity: 2 }];
  const offline = await refreshCart(cart, async () => { throw new Error('Sin conexion'); });
  const incomplete = await refreshCart(cart, async () => ({}));
  assert.equal(offline[0].currentUnitPrice, null);
  assert.equal(incomplete[0].currentUnitPrice, null);
  assert.equal(offline[0].quantity, 2);
  assert.equal(canPurchaseItem(offline[0]), false);
  assert.equal(canPurchaseItem(incomplete[0]), false);
});

test('volver a agregar un producto repara sus datos sin duplicarlo ni perder cantidades', () => {
  const cart = normalizeCart([{ id: 'producto', name: 'Viejo', quantity: '2' }]);
  const result = addProductToCart(cart, { id: 'producto', name: 'Actual', currentUnitPrice: 150, stockQuantity: 8 });
  assert.equal(result.length, 1);
  assert.equal(result[0].quantity, 3);
  assert.equal(result[0].currentUnitPrice, 150);
  assert.equal(result[0].name, 'Actual');
  assert.equal(cart[0].currentUnitPrice, null);
  assert.equal(addProductToCart([], { id: 'nuevo', currentUnitPrice: 20, stockQuantity: 8 })[0].quantity, 1);
});

test('agrega una unidad por clic sin descontar stock y nunca excede la disponibilidad', () => {
  const product = { id: 'producto', currentUnitPrice: 1000, stockQuantity: 2 };
  const once = addProductToCart([], product);
  const twice = addProductToCart(once, product);
  const third = addProductToCart(twice, product);
  assert.equal(once[0].quantity, 1);
  assert.equal(twice[0].quantity, 2);
  assert.deepEqual(third, twice);
  assert.equal(product.stockQuantity, 2);
  assert.equal(twice[0].stockQuantity, 2);
  assert.deepEqual(addProductToCart([], { ...product, stockQuantity: 0 }), []);
  assert.deepEqual(addProductToCart([], { ...product, isActive: false }), []);
});

test('si el stock baja, conserva la cantidad pero impide comprar hasta ajustarla', async () => {
  const [item] = await refreshCart([
    { id: 'producto', currentUnitPrice: 1000, stockQuantity: 8, quantity: 5 },
  ], async () => ({ currentUnitPrice: 1000, stockQuantity: 2 }));
  assert.equal(item.quantity, 5);
  assert.equal(item.stockQuantity, 2);
  assert.equal(canPurchaseItem(item), false);
  assert.equal(canPurchaseItem({ ...item, quantity: 2 }), true);
  assert.equal(canPurchaseItem({ ...item, quantity: 0 }), false);
  assert.equal(canPurchaseItem({ ...item, quantity: 1, stockQuantity: 0 }), false);
});

test('no confia en el stock guardado si la consulta falla', async () => {
  const [item] = await refreshCart([
    { id: 'producto', currentUnitPrice: 1000, stockQuantity: 8, quantity: 1 },
  ], async () => { throw new Error('Sin conexion'); });
  assert.equal(item.stockQuantity, null);
  assert.equal(item.currentUnitPrice, 1000);
  assert.equal(canPurchaseItem(item), false);
});

test('un JSON roto o la falta de acceso a localStorage no rompe la lectura', (t) => {
  t.mock.method(StorageStub, 'getItem', () => '{roto');
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: StorageStub });
  t.after(() => {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else delete globalThis.localStorage;
  });
  assert.deepEqual(readCart(), []);
  StorageStub.getItem = () => { throw new Error('Acceso bloqueado'); };
  assert.deepEqual(readCart(), []);
});

const StorageStub = { getItem: () => null };
