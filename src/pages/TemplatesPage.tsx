import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { templatesService, Template } from '@/services/templatesService';
import { Plus, Edit2, Copy, Trash2, PlayCircle } from 'lucide-react';

export default function TemplatesPage() {
  const { currentWorkspace, user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentWorkspace) {
      loadTemplates();
    }
  }, [currentWorkspace]);

  const loadTemplates = async () => {
    if (!currentWorkspace) return;

    try {
      setLoading(true);
      const data = await templatesService.listTemplates(currentWorkspace.$id);
      setTemplates(data);
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (templateId: string) => {
    if (!user) return;
    try {
      await templatesService.duplicateTemplate(templateId, user.$id);
      await loadTemplates();
    } catch (error) {
      console.error('Error duplicando plantilla:', error);
    }
  };

  const CATEGORY_LABELS: Record<string, string> = {
    kyc: 'KYC',
    financial: 'Financiero',
    background: 'Antecedentes',
    comprehensive: 'Completo',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Plantillas</h1>
              <p className="mt-1 text-sm text-gray-500">
                Builder de flujos personalizados para dictamenes
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Nueva Plantilla
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando plantillas...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No hay plantillas creadas</p>
            <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
              Crear primera plantilla
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.$id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                {/* Template Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {template.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {template.description || 'Sin descripcion'}
                      </p>
                    </div>
                    {template.is_default && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        Por defecto
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">
                      Categoria: <span className="font-medium text-gray-700">
                        {CATEGORY_LABELS[template.category] || template.category}
                      </span>
                    </span>
                    <span className="text-gray-500">
                      v{template.version}
                    </span>
                  </div>
                </div>

                {/* Template Stats */}
                <div className="px-6 py-4 bg-gray-50">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-500">Pasos:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {template.workflow?.steps?.length || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Usos:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {template.usage_count}
                      </span>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        template.is_active 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {template.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium flex items-center justify-center">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDuplicate(template.$id)}
                      className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                      title="Duplicar"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                      title="Ejecutar"
                    >
                      <PlayCircle className="h-4 w-4" />
                    </button>
                    <button
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
