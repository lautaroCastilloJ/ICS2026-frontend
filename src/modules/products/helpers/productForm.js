// Valores iniciales de un producto nuevo. Los nombres coinciden con ProductRequest.
export const EMPTY_PRODUCT = {
  sku: '',
  internalCode: '',
  name: '',
  description: '',
  imageUrl: '',
  currentUnitPrice: '',
  stockQuantity: 0,
};

// Valores del formulario a partir de un ProductResponse.
export const toProductForm = (product) => ({
  sku: product.sku ?? '',
  internalCode: product.internalCode ?? '',
  name: product.name ?? '',
  description: product.description ?? '',
  imageUrl: product.imageUrl ?? '',
  currentUnitPrice: product.currentUnitPrice ?? '',
  stockQuantity: product.stockQuantity ?? 0,
});
