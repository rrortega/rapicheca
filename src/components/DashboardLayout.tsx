import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  CreditCard,
  LogOut,
  Building2,
  LayoutTemplate,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Casos', href: '/cases', icon: FileText },
  { name: 'Plantillas', href: '/templates', icon: LayoutTemplate },
  { name: 'Usuarios', href: '/users', icon: Users },
  { name: 'Configuracion', href: '/settings', icon: Settings },
  { name: 'Facturacion', href: '/billing', icon: CreditCard },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, currentWorkspace, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Building2 className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-lg font-bold text-gray-900">
            Estudios
          </span>
        </div>

        {/* Workspace Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-600 mb-1">Workspace</p>
            <p className="text-sm font-bold text-gray-900 truncate">
              {currentWorkspace?.name || 'Sin workspace'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Plan: {currentWorkspace?.plan || 'N/A'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || ''}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
              title="Cerrar sesion"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <Outlet />
      </div>
    </div>
  );
}
