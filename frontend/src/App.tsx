import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Customers from './pages/Customers';
import MealPlans from './pages/MealPlans';
import MealPlansOld from './pages/MealPlansOld';
import ShopifyOrders from './pages/ShopifyOrders';
import DailyItems from './pages/DailyItems';
import Connections from './pages/Connections';
import Deliveries from './pages/Deliveries';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="customers" element={<Customers />} />
          <Route path="meal-plans" element={<MealPlans />} />
          <Route path="meal-plans-2" element={<MealPlansOld />} />
          <Route path="shopify-orders" element={<ShopifyOrders />} />
          <Route path="daily-items" element={<DailyItems />} />
          <Route path="connections" element={<Connections />} />
          <Route path="deliveries" element={<Deliveries />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

