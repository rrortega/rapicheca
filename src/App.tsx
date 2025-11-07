import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PublicRoute, ProtectedRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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
          {/* Rutas públicas */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          
          {/* Rutas protegidas con DashboardLayout */}
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="cases" element={<CasesPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="workspaces" element={<div className="p-8"><h1 className="text-2xl font-bold">Workspaces - Próximamente</h1><p className="text-gray-600 mt-2">Gestión de workspaces en desarrollo</p></div>} />
            <Route path="workspaces/create" element={<div className="p-8"><h1 className="text-2xl font-bold">Crear Workspace - Próximamente</h1><p className="text-gray-600 mt-2">Formulario de creación en desarrollo</p></div>} />
            <Route path="profile" element={<div className="p-8"><h1 className="text-2xl font-bold">Mi Perfil - Próximamente</h1><p className="text-gray-600 mt-2">Configuración de perfil en desarrollo</p></div>} />
            <Route path="users" element={<div className="p-8"><h1 className="text-2xl font-bold">Usuarios - Próximamente</h1><p className="text-gray-600 mt-2">Gestión de usuarios en desarrollo</p></div>} />
            <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Configuración - Próximamente</h1><p className="text-gray-600 mt-2">Panel de configuración en desarrollo</p></div>} />
            <Route path="billing" element={<BillingPage />} />
          </Route>
          
          {/* Cualquier otra ruta va a login */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
