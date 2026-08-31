import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import { getUserOrders } from '../services/orderService';
import OrderDetailModal from '../components/OrderDetailModal';
import useAuth from '../../auth/hook/useAuth';

/**
 * Página de Historial de Órdenes
 * 
 * Muestra:
 * - Lista de todas las órdenes del usuario autenticado
 * - Detalles de cada orden (ID, fecha, total, estado)
 * - Opción para ver detalles completos de cada orden
 * 
 * @component
 * @returns {JSX.Element} Página del historial de órdenes
 */
function OrdersHistoryPage() {
  // Estado para almacenar las órdenes del usuario
  const [orders, setOrders] = useState([]);
  
  // Estado para mostrar mensajes de carga
  const [loading, setLoading] = useState(true);
  
  // Estado para mostrar mensajes de error
  const [error, setError] = useState(null);
  
  // Estado para la orden seleccionada para ver detalle
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Hook para navegar entre páginas
  const navigate = useNavigate();
  
  // Hook para obtener el estado de autenticación
  const { isAuthenticated } = useAuth();
  
  // Obtenemos el token para saber si el usuario está autenticado
  const token = localStorage.getItem('token');

  /**
   * Efecto que se ejecuta al cargar la página
   * Carga las órdenes del usuario desde el backend
   */
  useEffect(() => {
    // Si el usuario no está autenticado, redirige a inicio
    if (!token) {
      navigate('/');
      return;
    }

    loadOrders();
  }, [isAuthenticated, token]);

  /**
   * Carga las órdenes del usuario desde el backend
   */
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Llamamos al servicio para obtener las órdenes
      const { data, error: ordersError } = await getUserOrders();

      if (ordersError) {
        setError(ordersError || 'Error al cargar las órdenes');
        return;
      }

      // Establecemos las órdenes en el estado
      // Si data es un array, lo usamos directamente, si es un objeto con items, extraemos los items
      const ordersData = Array.isArray(data) ? data : data?.items || [];
      setOrders(ordersData);
    } catch (err) {
      setError('Error inesperado al cargar las órdenes');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formatea una fecha a formato legible
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  const formatDate = (dateString) => {
    try {
      // Si no hay fecha, retornar vacío
      if (!dateString) return 'Fecha no disponible';
      
      const date = new Date(dateString);
      
      // Verificar si es una fecha válida
      if (isNaN(date.getTime())) {
        return dateString; // Retornar la cadena original si no es válida
      }
      
      return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  /**
   * Retorna el color de fondo según el estado de la orden
   * @param {string} status - Estado de la orden
   * @returns {string} Clase de Tailwind para el color de fondo
   */
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-950 border-yellow-200 text-yellow-200';
      case 'confirmed':
      case 'enviado':
        return 'bg-blue-950 border-blue-200 text-blue-200';
      case 'delivered':
      case 'entregado':
        return 'bg-green-950 border-green-200 text-green2900';
      case 'cancelled':
      case 'cancelado':
        return 'bg-red-950 border-red-200 text-red-200';
      default:
        return 'bg-zinc-900 border-gray-200 text-gray-800';
    }
  };

  /**
   * Retorna el texto del estado en español
   * @param {string} status - Estado en inglés
   * @returns {string} Estado en español
   */
  const getStatusLabel = (status) => {
    const statusMap = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      enviado: 'Enviado',
      delivered: 'Entregado',
      entregado: 'Entregado',
      cancelled: 'Cancelado',
      cancelado: 'Cancelado',
    };
    return statusMap[status?.toLowerCase()] || status || 'Desconocido';
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <Header />

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-50 mb-2">
            Historial de Órdenes
          </h1>
          <p className="text-zinc-400">
            Visualiza el estado de todas tus compras
          </p>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <div className="bg-red-950 border border-red-700 text-red-700 px-6 py-4 rounded-lg mb-8">
            {error}
            <button
              onClick={loadOrders}
              className="ml-4 underline hover:no-underline font-semibold"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-gray-100 rounded-lg p-12 text-center">
            <p className="text-zinc-50 text-lg mb-4">
              Cargando órdenes...
            </p>
            <div className="inline-block animate-spin">
              <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
            </div>
          </div>
        )}

        {/* Sin órdenes */}
        {!loading && orders.length === 0 && !error && (
          <div className="bg-gray-100 rounded-lg p-12 text-center">
            <p className="text-zinc-50 text-lg mb-4">
              No tienes órdenes aún
            </p>
            <button
              onClick={() => navigate('/')}
              className="shadow-s rounded-xl p-4 bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition"
            >
              Ir a Comprar
            </button>
          </div>
        )}

        {/* Lista de órdenes */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-zinc-900 rounded-lg shadow-s overflow-hidden">
                
                {/* Encabezado de la orden */}
                <div className="px-6 py-4  ">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    
                    {/* ID de la orden */}
                    <div>
                      <p className="text-xs text-zinc-50 font-semibold uppercase tracking-wide">Número de Orden</p>
                      <p className="text-zinc-50 font-mono text-sm break-all mt-1">
                        {order.id}
                      </p>
                    </div>

                    {/* Fecha */}
                    <div>
                      <p className="text-xs text-zinc-50 font-semibold uppercase tracking-wide">Fecha</p>
                      <p className="text-zinc-50 mt-1">
                        {formatDate(order.date)}
                      </p>
                    </div>

                    {/* Total */}
                    <div>
                      <p className="text-xs text-zinc-50 font-semibold uppercase tracking-wide">Total</p>
                      <p className="text-zinc-50 font-semibold text-2xl mt-1">
                        ${(order.totalAmount || 0).toFixed(2)}
                      </p>
                    </div>

                    {/* Estado */}
                    <div>
                      <p className="text-xs text-zinc-50 font-semibold uppercase tracking-wide">Estado</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border mt-1 ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>
                {/* Información del cliente */}
                <div className="px-6 py-4 border-b border-gray-200 bg-zinc-900">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombre del cliente */}
                    <div>
                      <p className="text-sm text-zinc-50 font-semibold mb-1">Cliente</p>
                      <p className="text-zinc-50">
                        {order.customerName || 'No especificado'}
                      </p>
                    </div>

                    {/* ID del cliente */}
                    <div>
                      <p className="text-sm text-zinc-50 font-semibold mb-1">ID del Cliente</p>
                      <p className="text-zinc-50 font-mono text-sm">
                        {order.customerId || 'No especificado'}
                      </p>
                    </div>
                  </div>
                </div>
                </div>


                {/* Botones de acción */}
                <div className="px-6 py-4 flex gap-3 justify-end">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="shadow-s rounded-xl p-4 bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition text-sm"
                  >
                    Ver Detalle
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="shadow-s rounded-xl p-4 bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition text-sm"
                  >
                    Comprar Más
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de detalle de orden */}
      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default OrdersHistoryPage;
