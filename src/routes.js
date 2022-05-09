import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Order from './pages/Order';
import Dish from './pages/Dish';
import Material from './pages/Material';
// import User from './pages/User';
import Suppliers from './pages/Suppliers';

import NotFound from './pages/Page404';
import KithenPerformance from './pages/KitchenPerformance';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'order', element: <Order /> },
        { path: 'dish', element: <Dish /> },
        { path: 'suppliers', element: <Suppliers /> },
        { path: 'kitchen', element: <KithenPerformance /> },
        { path: 'material', element: <Material /> }
      ]
    },
    {
      path: '/',
      element: <Login />
    },
    {
      path: '/signup',
      element: <Register />
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
