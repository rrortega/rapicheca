import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<any>({
    total: 0,
    in_progress: 0,
    completed: 0,
    rejected: 0,
    by_priority: { low: 0, medium: 0, high: 0 }
  });
  const [credits, setCredits] = useState(0);
  const [consumptionStats, setConsumptionStats] = useState<any>({
    total_consumption: 0,
    total_topups: 0,
    net_change: 0
  });

  // Simular datos de ejemplo para que el dashboard se vea funcional
  useEffect(() => {
    if (user) {
      // Datos de ejemplo para mostrar el dashboard
      setStats({
        total: 15,
        in_progress: 3,
        completed: 10,
        rejected: 2,
        by_priority: { low: 5, medium: 7, high: 3 }
      });
      setCredits(125);
      setConsumptionStats({
        total_consumption: 8,
        total_topups: 150,
        net_change: 142
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">No se pudo cargar la información del usuario</p>
          <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Volver al login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Bienvenido, {user.name}
              </p>
              <p className="text-sm text-blue-600">
                Sistema de estudios socioeconómicos
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">Creditos disponibles</p>
                <p className="text-2xl font-bold text-blue-900">{credits}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estado de configuración */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-800">
              Dashboard funcionando con datos de ejemplo. 
              La integración completa con workspaces se configurará en la siguiente fase.
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Casos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.in_progress}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rechazados</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Consumo de Creditos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Consumo de Creditos (30 dias)
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Consumo Total</span>
                <span className="text-lg font-bold text-red-600">
                  -{consumptionStats.total_consumption}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Recargas</span>
                <span className="text-lg font-bold text-green-600">
                  +{consumptionStats.total_topups}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-900">Cambio Neto</span>
                <span className={`text-lg font-bold ${
                  consumptionStats.net_change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {consumptionStats.net_change}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Casos por Prioridad
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Alta</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {stats.by_priority.high}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Media</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {stats.by_priority.medium}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Baja</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {stats.by_priority.low}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Accesos Rapidos */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Accesos Rapidos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <FileText className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Nuevo Caso</span>
            </button>
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <LayoutDashboard className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Builder de Plantillas</span>
            </button>
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Recargar Creditos</span>
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estado del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800">Autenticación</p>
                <p className="text-xs text-green-600">Funcionando correctamente</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <LayoutDashboard className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-800">Dashboard</p>
                <p className="text-xs text-blue-600">Mostrando datos de ejemplo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
