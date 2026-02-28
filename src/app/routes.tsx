import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { BillingPage } from './pages/BillingPage';
import { KhataPage } from './pages/KhataPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'products', Component: ProductsPage },
      { path: 'billing', Component: BillingPage },
      { path: 'khata', Component: KhataPage },
      { path: 'reports', Component: ReportsPage },
      { path: 'settings', Component: SettingsPage },
    ],
  },
]);
