import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import LoginPage from './modules/auth/pages/LoginPage';
import Dashboard from './modules/templates/components/Dashboard';
import AdminHome from './modules/templates/pages/AdminHome';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage';
import CartPage from './modules/orders/pages/CartPage';
import OrdersHistoryPage from './modules/orders/pages/OrdersHistoryPage';
import Home from './modules/home/pages/Home';
import ListProductsPage from './modules/products/pages/ListProductsPage';
import CreateProductPage from './modules/products/pages/CreateProductPage';
import CreateAdminPage from './modules/users/pages/CreateAdminPage';
import ChangePasswordPage from './modules/auth/pages/ChangePasswordPage';
import CustomerChangePasswordPage from './modules/auth/pages/CustomerChangePasswordPage';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/cart',
      element: <CartPage />,
    },
    {
      path: '/orders',
      element: <OrdersHistoryPage />,
    },
    {
      path: '/account/password',
      element: <CustomerChangePasswordPage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/admin/home',
          element: <AdminHome />,
        },
        {
          path: '/admin/products',
          element: <ListProductsPage />,
        },
        {
          path: '/admin/products/create',
          element: <CreateProductPage />,
        },
        {
          path: '/admin/orders',
          element: <ListOrdersPage />,
        },
        {
          path: '/admin/users/create',
          element: <CreateAdminPage />,
        },
        {
          path: '/admin/account/password',
          element: <ChangePasswordPage />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
