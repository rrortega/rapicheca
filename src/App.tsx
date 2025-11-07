import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import TemplatesPage from './pages/TemplatesPage';
import BillingPage from './pages/BillingPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/cases" element={<CasesPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/users" element={<div className="p-8"><h1 className="text-2xl font-bold">Usuarios - En desarrollo</h1></div>} />
              <Route path="/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Configuracion - En desarrollo</h1></div>} />
              <Route path="/billing" element={<BillingPage />} />
            </Route>
          </Route>

          {/* Default Redirect - solo rutas no definidas van a login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
