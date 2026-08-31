import { useState, useEffect, useCallback } from 'react';
import Header from '../../shared/components/Header';
import { getPublicProducts } from '../services/publicList';
import ProductCard from '../../products/components/ProductCard';

/**
 * Pagina principal (Home) - Listado de productos para clientes
 *
 * Esta pagina muestra:
 * - Header con navegacion y busqueda
 * - Grid de productos con paginacion
 * - Controles de busqueda y paginacion
 *
 * @component
 * @returns {JSX.Element} Pagina principal con listado de productos
 */
function Home() {
  // Estado para almacenar los productos obtenidos del backend
  const [products, setProducts] = useState([]);

  // Estado para el termino de busqueda actual
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para la pagina actual de paginacion
  const [currentPage, setCurrentPage] = useState(1);

  // Estado para el total de paginas disponibles
  const [totalPages, setTotalPages] = useState(1);

  // Estado para el total de productos encontrados
  const [totalProducts, setTotalProducts] = useState(0);

  // Estado para mostrar un indicador de carga
  const [loading, setLoading] = useState(false);

  // Estado para mostrar mensajes de error
  const [error, setError] = useState(null);

  // Cantidad de productos por pagina
  const pageSize = 6;

  /**
   * Obtiene los productos del backend usando el servicio publicList
   * Maneja el estado de carga y errores
   */
  const fetchProducts = useCallback(async () => {
    try {
      // Mostramos el indicador de carga
      setLoading(true);
      // Limpiamos el error anterior (si existe)
      setError(null);

      // Llamamos al servicio para obtener los productos
      const { data, error: fetchError } = await getPublicProducts(
        searchTerm,
        currentPage,
        pageSize
      );

      // Si hay un error, lo mostramos
      if (fetchError) {
        setError('No se pudieron cargar los productos. Intenta nuevamente.');
        console.error('Error:', fetchError);
        return;
      }

      // Actualizamos el estado con los datos obtenidos
      if (data) {
        // Los datos contienen items (productos) y totalPages
        const items = data.items || [];
        const totalFromApi = data.totalCount ?? data.total ?? items.length;
        const pagesFromApi = data.totalPages || Math.max(1, Math.ceil(totalFromApi / pageSize));

        setProducts(items);
        setTotalPages(pagesFromApi);
        setTotalProducts(totalFromApi);
      }
    } catch (err) {
      // Capturamos cualquier error no esperado
      setError('Error inesperado al cargar productos');
      console.error('Unexpected error:', err);
    } finally {
      // Apagamos el indicador de carga
      setLoading(false);
    }
  }, [currentPage, searchTerm, pageSize]);

  /**
   * Efecto que se ejecuta cuando cambia la pagina o el termino de busqueda
   * Realiza una llamada al backend para obtener los productos
   */
  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, fetchProducts]);

  /**
   * Maneja la busqueda de productos
   * Resetea la pagina a 1 y busca con el termino ingresado
   */
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  /**
   * Maneja el clic en el boton de pagina anterior
   */
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  /**
   * Maneja el clic en el boton de pagina siguiente
   */
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header con busqueda */}
      <Header onSearch={handleSearch} />

      {/* Contenido principal */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Titulo e informacion */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-l sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Catalogo</p>
            <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">Productos</h1>
            <p className="text-sm text-zinc-400 sm:text-base">
              Explora el catalogo y encuentra los mejores productos disponibles.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-zinc-300 sm:text-sm">
            <span className="rounded-full border border-zinc-800 px-3 py-1">
              Total: {totalProducts}
            </span>
            <span className="rounded-full border border-zinc-800 px-3 py-1">
              Pagina {currentPage} de {totalPages}
            </span>
            {searchTerm && (
              <span className="rounded-full border border-emerald-600/50 bg-emerald-600/10 px-3 py-1 text-emerald-200">
                Busqueda: {searchTerm}
              </span>
            )}
          </div>
        </div>

        {/* Seccion de productos */}
        {error && (
          // Mostrar error si ocurre uno
          <div className="mb-6 rounded-2xl border border-red-900/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {loading ? (
          // Mostrar indicador de carga
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-zinc-600 border-t-transparent"></div>
              <p className="mt-4 text-zinc-400">Cargando productos...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          // Mostrar mensaje si no hay productos
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 text-center">
            <p className="text-lg text-zinc-400">
              {searchTerm ? 'No se encontraron productos con esa busqueda' : 'No hay productos disponibles'}
            </p>
          </div>
        ) : (
          // Grid de productos
          <>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Controles de paginacion */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-200 sm:px-5">
                {/* Boton anterior */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="rounded-lg bg-zinc-800 px-4 py-2 font-semibold transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-800/60"
                >
                  Anterior
                </button>

                {/* Informacion de paginacion */}
                <span className="px-2 text-sm font-semibold">
                  Pagina <span className="font-bold">{currentPage}</span> de <span className="font-bold">{totalPages}</span>
                </span>

                {/* Boton siguiente */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="rounded-lg bg-zinc-800 px-4 py-2 font-semibold transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-800/60"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
