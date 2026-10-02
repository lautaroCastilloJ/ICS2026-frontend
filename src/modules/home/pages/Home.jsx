import { useState, useEffect, useCallback } from 'react';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getPublicProducts } from '../services/publicList';
import ProductCard from '../../products/components/ProductCard';
import Alert from '../../shared/ui/Alert';
import Button from '../../shared/ui/Button';
import Pagination from '../../shared/ui/Pagination';
import { SearchIcon } from '../../shared/ui/icons';

// Cantidad de productos por pagina
const PAGE_SIZE = 6;

/**
 * Pagina principal (Home) - Catalogo de productos para clientes
 *
 * Esta pagina muestra:
 * - Encabezado con buscador
 * - Grilla de productos con paginacion
 * - Estados de carga, error y sin resultados
 *
 * @component
 * @returns {JSX.Element} Pagina principal con listado de productos
 */
function Home() {
  const [products, setProducts] = useState([]);
  // Texto del buscador mientras se escribe; searchTerm es la busqueda aplicada
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtiene los productos del backend usando el servicio publicList
   * Maneja el estado de carga y errores
   */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await getPublicProducts(searchTerm, currentPage, PAGE_SIZE);

      if (fetchError) {
        setError('No se pudieron cargar los productos. Intentá nuevamente.');
        console.error('Error:', fetchError);

        return;
      }

      if (data) {
        // Los datos contienen items (productos) y totalPages
        const items = data.items || [];
        const totalFromApi = data.totalCount ?? data.total ?? items.length;
        const pagesFromApi = data.totalPages || Math.max(1, Math.ceil(totalFromApi / PAGE_SIZE));

        setProducts(items);
        setTotalPages(pagesFromApi);
        setTotalProducts(totalFromApi);
      }
    } catch (err) {
      setError('Error inesperado al cargar productos.');
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Aplica la busqueda escrita y vuelve a la primera pagina
   */
  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const productCountLabel = `${totalProducts} ${totalProducts === 1 ? 'producto' : 'productos'}`;

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="flex-1">
        {/* Encabezado con buscador */}
        <section className="px-4 pb-12 pt-16 text-center sm:px-6 sm:pb-16 sm:pt-24">
          <p className="mb-3 text-[15px] font-medium text-muted">Catálogo</p>
          <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[64px]">
            Productos.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[17px] leading-snug text-muted sm:text-[21px]">
            Explorá el catálogo y encontrá lo que buscás.
          </p>

          <form
            role="search"
            onSubmit={handleSearch}
            className="mx-auto mt-10 flex h-13 max-w-xl items-center gap-3 rounded-full bg-surface pl-5 pr-2 text-muted focus-within:ring-4 focus-within:ring-link/20"
          >
            <SearchIcon size={18} />
            <label htmlFor="buscar-productos" className="sr-only">Buscar productos</label>
            <input
              id="buscar-productos"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Buscar productos"
              className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent p-0 text-[17px] text-ink shadow-none outline-none placeholder:text-muted hover:shadow-none"
            />
            <Button type="submit" size="sm">Buscar</Button>
          </form>
        </section>

        <section aria-label="Productos" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-5 text-sm text-muted">
            <p aria-live="polite">
              {loading ? 'Cargando productos…' : productCountLabel}
              {searchTerm && !loading && (
                <>
                  {' '}para “<span className="text-ink">{searchTerm}</span>”
                  <Button variant="link" size="sm" className="ml-3 h-auto" onClick={clearSearch}>
                    Limpiar búsqueda
                  </Button>
                </>
              )}
            </p>
            {products.length > 0 && <p>Página {currentPage} de {totalPages}</p>}
          </div>

          {error && <Alert tone="danger" className="mb-10">{error}</Alert>}

          {loading ? (
            <div aria-hidden="true" className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }, (_, index) => (
                <div key={index} className="flex animate-pulse flex-col gap-4">
                  <div className="aspect-square rounded-card bg-surface" />
                  <div className="h-5 w-2/3 rounded-full bg-surface" />
                  <div className="h-4 w-1/3 rounded-full bg-surface" />
                </div>
              ))}
            </div>
          ) : products.length === 0 && !error ? (
            <div className="py-20 text-center">
              <p className="text-[21px] text-muted">
                {searchTerm ? 'No encontramos productos con esa búsqueda.' : 'Todavía no hay productos disponibles.'}
              </p>
              {searchTerm && (
                <Button variant="secondary" className="mt-6" onClick={clearSearch}>Ver todo el catálogo</Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && products.length > 0 && (
            <Pagination className="mt-18" page={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
