import { useState, useEffect } from 'react';
import { instance } from '../../shared/api/axiosInstance';

/**
 * Pagina principal del panel administrativo
 * Muestra estadisticas generales: cantidad de productos y ordenes
 */
function AdminHome() {
  // Estado para almacenar las estadisticas
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    loading: true,
  });

  // Efecto que carga las estadisticas al montar el componente
  useEffect(() => {
    loadStatistics();
  }, []);

  // Carga las estadisticas desde el backend
  const loadStatistics = async () => {
    try {
      const productsResponse = await instance.get('api/products/admin', {
        params: {
          pageSize: 1,
          pageNumber: 1,
        },
      });
      const productsCount = productsResponse.data.totalCount || 0;

      const ordersResponse = await instance.get('api/orders/admin', {
        params: {
          pageSize: 1,
          pageNumber: 1,
        },
      });
      const ordersCount = ordersResponse.data.totalCount || 0;

      setStats({
        productsCount,
        ordersCount,
        loading: false,
      });
    } catch (error) {
      console.error('Error al cargar estadisticas:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="w-full min-h-full bg-zinc-900 text-white shadow-l rounded-xl p-4">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Resumen</p>
            <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
              Panel de Administracion
            </h1>
            <p className="text-sm text-zinc-400 sm:text-base">
              Bienvenido al panel administrativo.
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-3 sm:w-auto sm:justify-end">
            <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400 sm:text-sm">
              Datos en tiempo real
            </span>
            <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs font-medium text-emerald-400 sm:text-sm">
              Estado: Activo
            </span>
          </div>
        </div>

        {/* Estadisticas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Card de Productos */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-l transition hover:border-zinc-700">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Inventario</p>
                <h2 className="text-xl font-semibold text-zinc-50">Productos</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-200">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042L5.96 9H9a2 2 0 100-4H6.77l-.447-1.79A.999.999 0 005 2H3zM15 19c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              {stats.loading ? (
                <div className="flex h-12 items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-600 border-t-transparent" />
                  <span className="text-sm text-zinc-500">Cargando datos...</span>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-zinc-400">Cantidad de productos</p>
                    <p className="text-4xl font-bold text-zinc-100 sm:text-5xl">
                      {stats.productsCount}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                    + Inventario
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Card de Ordenes */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-l transition hover:border-zinc-700">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Ventas</p>
                <h2 className="text-xl font-semibold text-zinc-50">Ordenes</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-200">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              {stats.loading ? (
                <div className="flex h-12 items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-600 border-t-transparent" />
                  <span className="text-sm text-zinc-500">Cargando datos...</span>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-zinc-400">Cantidad de ordenes</p>
                    <p className="text-4xl font-bold text-zinc-100 sm:text-5xl">
                      {stats.ordersCount}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
                    + Seguimiento
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Accesos rapidos */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-l sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-zinc-50">Accesos rapidos</h3>
              <p className="text-sm text-zinc-400">Accede a las secciones clave con un solo toque.</p>
            </div>
            <div className="flex gap-2 text-xs text-zinc-400 sm:text-sm">
              <span className="rounded-full border border-zinc-800 px-3 py-1">Vista mobile</span>
              <span className="rounded-full border border-zinc-800 px-3 py-1">Vista escritorio</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2">
            <a
              href="/admin/products"
              className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 transition hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-800"
            >
              <div>
                <p className="font-semibold text-zinc-50">Gestionar Productos</p>
                <p className="text-sm text-zinc-500">Ver, crear y editar productos</p>
              </div>
              <span className="text-lg text-zinc-500 transition group-hover:translate-x-1 group-hover:text-zinc-200">
                &rarr;
              </span>
            </a>

            <a
              href="/admin/orders"
              className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 transition hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-800"
            >
              <div>
                <p className="font-semibold text-zinc-50">Gestionar ordenes</p>
                <p className="text-sm text-zinc-500">Ver y actualizar estado de ordenes</p>
              </div>
              <span className="text-lg text-zinc-500 transition group-hover:translate-x-1 group-hover:text-zinc-200">
                &rarr;
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
