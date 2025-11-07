import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  User,
  FolderOpen,
  Layers,
  Briefcase,
  Plus,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Expedientes', href: '/cases', icon: FileText },
  { name: 'Plantillas', href: '/templates', icon: LayoutTemplate },
  { name: 'Workspaces', href: '/workspaces', icon: Building2 },
  { name: 'Mi Cuenta', href: '/profile', icon: User },
  { name: 'Usuarios', href: '/users', icon: Users },
  { name: 'Configuración', href: '/settings', icon: Settings },
  { name: 'Facturación', href: '/billing', icon: CreditCard },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, currentWorkspace, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 transition-all duration-300 z-50 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Header con Logo y Toggle */}
        <div className="h-16 flex items-center border-b border-gray-200">
          <div className="flex items-center justify-between w-full px-4">
            {!isCollapsed && (
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-lg font-bold text-gray-900">
                  Estudios
                </span>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
              title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Workspace Info */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 mb-1">Workspace</p>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {currentWorkspace?.name || 'Sin workspace'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Plan: {currentWorkspace?.plan || 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/workspaces/create')}
                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition"
                  title="Crear nuevo workspace"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition group relative ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className={`h-5 w-5 ${
                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                {!isCollapsed && (
                  <span className="ml-3">{item.name}</span>
                )}
                {/* Tooltip para sidebar colapsado */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
              <div className={`bg-blue-100 p-2 rounded-full ${isCollapsed ? '' : 'mr-3'}`}>
                <User className="h-4 w-4 text-blue-600" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || ''}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Outlet />
      </div>

      {/* Overlay para móvil cuando sidebar está abierto */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </div>
  );
}
