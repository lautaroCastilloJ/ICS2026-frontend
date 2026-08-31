import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import { getProducts, getProductById } from '../services/list';
import { deleteProduct } from '../services/delete';
import EditProductModal from '../components/EditProductModal';

const productStatus = {
  ALL: 'all',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
};

function ListProductsPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(productStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para el modal de edicion
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  // Estado para confirmacion de eliminacion
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Cargar productos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await getProducts(searchTerm, status, pageNumber, pageSize);

      if (fetchError) {
        setError(fetchError);
        return;
      }

      setTotal(data.total);
      setProducts(data.productItems || []);
    } catch (error) {
      setError('Error al cargar los productos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar cuando cambia la paginacion o estado
  useEffect(() => {
    fetchProducts();
  }, [status, pageSize, pageNumber]);

  const totalPages = Math.ceil(total / pageSize);

  // Manejar busqueda
  const handleSearch = async () => {
    setPageNumber(1);
    await fetchProducts();
  };

  // Manejar Enter en busqueda
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Manejar edicion
  const handleEditClick = async (product) => {
    setLoadingEdit(true);
    try {
      const { data, error } = await getProductById(product.id);
      const detail = data?.item || data?.product || data || {};
      const normalizedDescription =
        detail.description ??
        detail.Description ??
        detail.productDescription ??
        product.description ??
        '';
      const normalizedInternalCode =
        detail.internalCode ||
        detail.cui ||
        detail.internal_code ||
        detail.code ||
        product.internalCode ||
        product.cui ||
        '';
      const merged = {
        ...product,
        ...detail,
        internalCode: normalizedInternalCode,
        description: normalizedDescription,
      };
      setEditingProduct(merged);
      setShowEditModal(true);
    } catch (err) {
      console.error('Error al cargar producto para edicion:', err);
      setEditingProduct(product);
      setShowEditModal(true);
    } finally {
      setLoadingEdit(false);
    }
  };

  // Manejar eliminacion
  const handleDeleteClick = async (id) => {
    if (deletingId === id) {
      // Confirmar eliminacion
      try {
        setDeleteLoading(true);
        const { error: deleteError } = await deleteProduct(id);

        if (deleteError) {
          setError(deleteError);
          return;
        }

        // Actualizar lista
        await fetchProducts();
        setDeletingId(null);
      } finally {
        setDeleteLoading(false);
      }
    } else {
      // Mostrar confirmacion
      setDeletingId(id);
    }
  };

  // Cancelar eliminacion
  const handleCancelDelete = () => {
    setDeletingId(null);
  };

  return (
    <div className="w-full min-h-full bg-zinc-900 text-white shadow-l rounded-xl p-4">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Catalogo</p>
            <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">Productos</h1>
            <p className="text-sm text-zinc-400 sm:text-base">
              Gestiona tu catalogo, busca productos y edita su disponibilidad.
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
            <Button
              className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 sm:w-auto sm:text-base"
              onClick={() => navigate('/admin/products/create')}
            >
              + Crear Producto
            </Button>
          </div>
        </div>

        {/* Busqueda y filtros */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-l sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/40">
                <input
                  value={searchTerm}
                  onChange={(evt) => setSearchTerm(evt.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  type="text"
                  placeholder="Buscar por nombre o SKU..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 border-0 focus:outline-none sm:text-base"
                />
                <Button
                  className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 sm:px-4"
                  onClick={handleSearch}
                >
                Buscar
                </Button>
              </div>
              <div className="flex gap-2">
                <select
                  value={status}
                  onChange={(evt) => {
                    setStatus(evt.target.value);
                    setPageNumber(1);
                  }}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm font-medium text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2 sm:w-48 sm:text-base"
                >
                  <option className="bg-zinc-900" value={productStatus.ALL}>Todos</option>
                  <option className="bg-zinc-900" value={productStatus.ENABLED}>Habilitados</option>
                  <option className="bg-zinc-900" value={productStatus.DISABLED}>Inhabilitados</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-900/40 bg-red-900/30 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-l sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Total productos</p>
                <p className="text-2xl font-bold text-zinc-50">{total}</p>
              </div>
              <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                Vista responsive
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-400 sm:text-sm">
              <span className="rounded-full border border-zinc-800 px-3 py-1">Filtros activos</span>
              <span className="rounded-full border border-zinc-800 px-3 py-1">Busqueda rapida</span>
              <span className="rounded-full border border-zinc-800 px-3 py-1">Tabla y tarjetas</span>
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-l sm:p-5">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-600 border-t-transparent" />
              <span className="ml-3 text-sm text-zinc-400">Cargando productos...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-zinc-400">No hay productos que mostrar</p>
            </div>
          ) : (
            <>
              {/* Tabla escritorio */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/60 text-left text-sm uppercase tracking-wide text-zinc-400">
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3 text-right">Precio</th>
                      <th className="px-4 py-3 text-center">Stock</th>
                      <th className="px-4 py-3 text-center">Estado</th>
                      <th className="px-4 py-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-zinc-800/60 text-sm text-zinc-200 transition hover:bg-zinc-900">
                        <td className="px-4 py-3 font-mono text-xs text-zinc-400">{product.sku}</td>
                        <td className="px-4 py-3 font-medium">{product.name}</td>
                        <td className="px-4 py-3 text-right font-semibold">
                          ${product.currentUnitPrice?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                              product.stockQuantity > 10
                                ? 'bg-emerald-500/15 text-emerald-200'
                                : product.stockQuantity > 0
                                ? 'bg-amber-500/15 text-amber-200'
                                : 'bg-red-500/15 text-red-200'
                            }`}
                          >
                            {product.stockQuantity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                              product.isActive
                                ? 'bg-blue-500/15 text-blue-200'
                                : 'bg-zinc-700/60 text-zinc-200'
                            }`}
                          >
                            {product.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick(product)}
                              disabled={loadingEdit}
                              className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-500/60"
                            >
                              ✏️ Editar
                            </button>
                            {deletingId === product.id ? (
                              <div className="inline-flex gap-1">
                                <button
                                  onClick={() => handleDeleteClick(product.id)}
                                  disabled={deleteLoading}
                                  className="rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white transition hover:bg-red-500 disabled:bg-red-400"
                                >
                                  {deleteLoading ? '...' : 'Confirmar'}
                                </button>
                                <button
                                  onClick={handleCancelDelete}
                                  disabled={deleteLoading}
                                  className="rounded-lg bg-zinc-700 px-2 py-1 text-xs font-semibold text-white transition hover:bg-zinc-600 disabled:bg-zinc-600/70"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDeleteClick(product.id)}
                                className="rounded-lg bg-red-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-400"
                              >
                                🗑️ Eliminar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista mobile/cards */}
              <div className="grid grid-cols-1 gap-3 lg:hidden">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-sm transition hover:border-zinc-700"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-500">{product.sku}</p>
                        <p className="text-lg font-semibold text-zinc-50">{product.name}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.isActive ? 'bg-blue-500/15 text-blue-200' : 'bg-zinc-700/60 text-zinc-200'
                        }`}
                      >
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                      <span className="rounded-full border border-zinc-800 px-3 py-1 font-semibold">
                        ${product.currentUnitPrice?.toFixed(2) || '0.00'}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 font-semibold ${
                          product.stockQuantity > 10
                            ? 'bg-emerald-500/15 text-emerald-200'
                            : product.stockQuantity > 0
                            ? 'bg-amber-500/15 text-amber-200'
                            : 'bg-red-500/15 text-red-200'
                        }`}
                      >
                        Stock: {product.stockQuantity}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        disabled={loadingEdit}
                        className="flex-1 rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-500/60"
                      >
                        ✏️ Editar
                      </button>
                      {deletingId === product.id ? (
                        <>
                          <button
                            onClick={() => handleDeleteClick(product.id)}
                            disabled={deleteLoading}
                            className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:bg-red-400"
                          >
                            {deleteLoading ? '...' : 'Confirmar'}
                          </button>
                          <button
                            onClick={handleCancelDelete}
                            disabled={deleteLoading}
                            className="flex-1 rounded-lg bg-zinc-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-600 disabled:bg-zinc-600/70"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
                        >
                          🗑️ Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Paginacion */}
        {products.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-200 sm:px-5">
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber(pageNumber - 1)}
              className="rounded-lg bg-zinc-800 px-4 py-2 font-semibold transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-800/60"
            >
              Anterior
            </button>

            <span className="px-2 text-sm font-semibold">
              Pagina {pageNumber} de {totalPages || 1}
            </span>

            <button
              disabled={pageNumber === totalPages || totalPages === 0}
              onClick={() => setPageNumber(pageNumber + 1)}
              className="rounded-lg bg-zinc-800 px-4 py-2 font-semibold transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-800/60"
            >
              Siguiente
            </button>

            <select
              value={pageSize}
              onChange={(evt) => {
                setPageNumber(1);
                setPageSize(Number(evt.target.value));
              }}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-medium text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
            >
              <option className="bg-zinc-900" value="5">5 por pagina</option>
              <option className="bg-zinc-900" value="10">10 por pagina</option>
              <option className="bg-zinc-900" value="15">15 por pagina</option>
              <option className="bg-zinc-900" value="20">20 por pagina</option>
            </select>
          </div>
        )}

        {/* Modal de edicion */}
        {showEditModal && editingProduct && (
          <EditProductModal
            product={editingProduct}
            onClose={() => {
              setShowEditModal(false);
              setEditingProduct(null);
            }}
            onSuccess={fetchProducts}
          />
        )}
      </div>
    </div>
  );
}

export default ListProductsPage;
