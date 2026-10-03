import { useCallback, useEffect, useState } from 'react';
import { getProducts } from '../services/list';
import { deleteProduct as disableProduct, enableProduct } from '../services/delete';
import EditProductModal from '../components/EditProductModal';
import { formatPrice } from '../../shared/helpers/format';
import Alert from '../../shared/ui/Alert';
import Badge from '../../shared/ui/Badge';
import Button, { ButtonLink } from '../../shared/ui/Button';
import ConfirmDialog from '../../shared/ui/ConfirmDialog';
import PageHeader from '../../shared/ui/PageHeader';
import Pagination from '../../shared/ui/Pagination';
import Select from '../../shared/ui/Select';
import { BoxIcon, ImageIcon, PencilIcon, PlusIcon, SearchIcon } from '../../shared/ui/icons';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'enabled', label: 'Habilitados' },
  { value: 'disabled', label: 'Deshabilitados' },
];

const PAGE_SIZE_OPTIONS = [5, 10, 20].map((size) => ({ value: String(size), label: `${size} por página` }));

const LOW_STOCK_THRESHOLD = 3;

function StockBadge({ stock }) {
  if (stock === 0) return <Badge tone="danger">Sin stock</Badge>;

  if (stock <= LOW_STOCK_THRESHOLD) return <Badge tone="warn">{stock} unidades</Badge>;

  return <Badge>{stock} unidades</Badge>;
}

function StatusBadge({ isActive }) {
  return isActive ? <Badge tone="success">Habilitado</Badge> : <Badge>Deshabilitado</Badge>;
}

function Thumbnail({ product }) {
  return (
    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface text-faint dark:bg-line">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt="" className="size-full object-contain p-1 mix-blend-multiply dark:mix-blend-normal" />
      ) : (
        <ImageIcon size={20} />
      )}
    </div>
  );
}

/** Listado de productos del panel: busqueda, filtro por estado, edicion y habilitacion. */
function ListProductsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [editingProduct, setEditingProduct] = useState(null);
  const [disablingProduct, setDisablingProduct] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await getProducts(searchTerm, status, pageNumber, pageSize);

    if (fetchError) {
      setError(fetchError);
    } else {
      setTotal(data.total);
      setProducts(data.productItems);
    }

    setLoading(false);
  }, [searchTerm, status, pageNumber, pageSize]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
    setPageNumber(1);
  };

  const changeAvailability = async (product, enable) => {
    setBusyId(product.id);
    setNotice('');
    setError('');

    const { error: changeError } = enable ? await enableProduct(product.id) : await disableProduct(product.id);

    setBusyId(null);
    setDisablingProduct(null);

    if (changeError) {
      setError(changeError);

      return;
    }

    setNotice(`“${product.name}” ${enable ? 'se habilitó y vuelve a verse en la tienda' : 'se deshabilitó y ya no se ve en la tienda'}.`);
    fetchProducts();
  };

  const handleEdited = () => {
    setNotice('Producto actualizado.');
    fetchProducts();
  };

  const renderActions = (product) => (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="sm" onClick={() => setEditingProduct(product)} aria-label={`Editar ${product.name}`}>
        <PencilIcon size={16} />
        Editar
      </Button>
      {product.isActive ? (
        <Button variant="danger" size="sm" className="px-3" disabled={busyId === product.id} onClick={() => setDisablingProduct(product)}>
          Deshabilitar
        </Button>
      ) : (
        <Button variant="link" size="sm" className="px-3" disabled={busyId === product.id} onClick={() => changeAvailability(product, true)}>
          Habilitar
        </Button>
      )}
    </div>
  );

  return (
    <>
      <PageHeader
        title="Productos"
        description="Buscá, editá y controlá qué productos se ven en la tienda."
        actions={(
          <ButtonLink to="/admin/products/create">
            <PlusIcon size={16} />
            Crear producto
          </ButtonLink>
        )}
      />

      {/* Barra de herramientas */}
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <form role="search" onSubmit={handleSearch} className="flex h-11 flex-1 items-center gap-3 rounded-full bg-surface pl-4 pr-1.5 text-muted focus-within:ring-4 focus-within:ring-link/20">
          <SearchIcon size={18} />
          <label htmlFor="buscar-admin" className="sr-only">Buscar productos</label>
          <input
            id="buscar-admin"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Buscar por nombre o SKU"
            className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent p-0 text-[15px] text-ink shadow-none outline-none placeholder:text-muted hover:shadow-none"
          />
          <Button type="submit" size="sm">Buscar</Button>
        </form>
        <div className="grid grid-cols-2 gap-3 lg:flex">
          <Select
            label="Estado"
            hideLabel
            options={STATUS_OPTIONS}
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPageNumber(1);
            }}
            className="lg:w-52"
          />
          <Select
            label="Productos por página"
            hideLabel
            options={PAGE_SIZE_OPTIONS}
            value={String(pageSize)}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPageNumber(1);
            }}
            className="lg:w-44"
          />
        </div>
      </div>

      {notice && <Alert tone="success" className="mb-6">{notice}</Alert>}
      {error && <Alert tone="danger" className="mb-6">{error}</Alert>}

      <p className="mb-4 text-sm text-muted" aria-live="polite">
        {loading ? 'Cargando productos…' : `${total} ${total === 1 ? 'producto' : 'productos'}`}
      </p>

      {loading ? (
        <div aria-hidden="true" className="flex flex-col border-t border-line">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex animate-pulse items-center gap-4 border-b border-line py-4">
              <div className="size-12 rounded-xl bg-surface" />
              <div className="h-4 flex-1 rounded-full bg-surface" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-surface px-6 py-16 text-center">
          <BoxIcon size={32} className="text-muted" />
          <p className="text-[17px] text-muted">
            {searchTerm || status !== 'all' ? 'Ningún producto coincide con la búsqueda.' : 'Todavía no hay productos.'}
          </p>
        </div>
      ) : (
        <>
          {/* Tabla (escritorio) */}
          <div className="hidden lg:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line text-xs font-medium text-muted">
                  <th scope="col" className="py-3 pr-4 font-medium">Producto</th>
                  <th scope="col" className="px-4 py-3 font-medium">SKU</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Precio</th>
                  <th scope="col" className="px-4 py-3 font-medium">Stock</th>
                  <th scope="col" className="px-4 py-3 font-medium">Estado</th>
                  <th scope="col" className="py-3 pl-4 text-right font-medium"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-line">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <Thumbnail product={product} />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{product.sku}</td>
                    <td className="px-4 py-3 text-right">{formatPrice(product.currentUnitPrice ?? 0)}</td>
                    <td className="px-4 py-3"><StockBadge stock={product.stockQuantity} /></td>
                    <td className="px-4 py-3"><StatusBadge isActive={product.isActive} /></td>
                    <td className="py-3 pl-4">{renderActions(product)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lista (celular y tablet) */}
          <ul className="border-t border-line lg:hidden">
            {products.map((product) => (
              <li key={product.id} className="flex flex-col gap-3 border-b border-line py-4">
                <div className="flex items-start gap-3">
                  <Thumbnail product={product} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="font-mono text-xs text-muted">{product.sku}</p>
                  </div>
                  <span className="font-medium">{formatPrice(product.currentUnitPrice ?? 0)}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <StockBadge stock={product.stockQuantity} />
                    <StatusBadge isActive={product.isActive} />
                  </div>
                  {renderActions(product)}
                </div>
              </li>
            ))}
          </ul>

          <Pagination className="mt-10" page={pageNumber} totalPages={totalPages} onPageChange={setPageNumber} />
        </>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={handleEdited}
        />
      )}

      {disablingProduct && (
        <ConfirmDialog
          destructive
          icon={<BoxIcon size={28} />}
          title="¿Deshabilitar el producto?"
          description={`“${disablingProduct.name}” deja de verse en la tienda. Podés volver a habilitarlo cuando quieras.`}
          confirmLabel="Deshabilitar"
          onConfirm={() => changeAvailability(disablingProduct, false)}
          onCancel={() => setDisablingProduct(null)}
        />
      )}
    </>
  );
}

export default ListProductsPage;
