import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

export interface Template {
  $id: string;
  workspace_id: string;
  name: string;
  description?: string;
  version: string;
  category: 'kyc' | 'financial' | 'background' | 'comprehensive';
  content: {
    structure?: any;
    variables?: string[];
    conditional_blocks?: any;
  };
  workflow: {
    enabled: boolean;
    steps: Array<{
      id: string;
      type: string;
      config: any;
      order: number;
    }>;
    conditions?: any;
    auto_transitions?: boolean;
  };
  is_default: boolean;
  is_active: boolean;
  usage_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const templatesService = {
  // Listar plantillas del workspace
  async listTemplates(workspaceId: string, activeOnly = false) {
    try {
      const queries = [
        Query.equal('workspace_id', workspaceId),
        Query.orderDesc('created_at')
      ];

      if (activeOnly) {
        queries.push(Query.equal('is_active', true));
      }

      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TEMPLATES,
        queries
      );

      return result.documents.map((doc: any) => ({
        ...doc,
        content: JSON.parse(doc.content || '{}'),
        workflow: JSON.parse(doc.workflow || '{"enabled":false,"steps":[]}'),
      })) as Template[];
    } catch (error) {
      console.error('Error listando plantillas:', error);
      return [];
    }
  },

  // Crear plantilla
  async createTemplate(workspaceId: string, userId: string, templateData: Partial<Template>) {
    try {
      const now = new Date().toISOString();

      const newTemplate = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TEMPLATES,
        ID.unique(),
        {
          workspace_id: workspaceId,
          name: templateData.name || 'Nueva Plantilla',
          description: templateData.description || '',
          version: templateData.version || '1.0',
          category: templateData.category || 'comprehensive',
          content: JSON.stringify(templateData.content || {}),
          workflow: JSON.stringify(templateData.workflow || { enabled: false, steps: [] }),
          is_default: templateData.is_default || false,
          is_active: templateData.is_active !== undefined ? templateData.is_active : true,
          usage_count: 0,
          created_by: userId,
          created_at: now,
          updated_at: now,
        }
      );

      return newTemplate;
    } catch (error) {
      console.error('Error creando plantilla:', error);
      throw error;
    }
  },

  // Obtener plantilla por ID
  async getTemplate(templateId: string) {
    try {
      const doc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.TEMPLATES,
        templateId
      );

      return {
        ...doc,
        content: JSON.parse(doc.content || '{}'),
        workflow: JSON.parse(doc.workflow || '{"enabled":false,"steps":[]}'),
      } as unknown as Template;
    } catch (error) {
      console.error('Error obteniendo plantilla:', error);
      throw error;
    }
  },

  // Actualizar plantilla
  async updateTemplate(templateId: string, updates: Partial<Template>) {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.name) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.version) updateData.version = updates.version;
      if (updates.category) updateData.category = updates.category;
      if (updates.content) updateData.content = JSON.stringify(updates.content);
      if (updates.workflow) updateData.workflow = JSON.stringify(updates.workflow);
      if (updates.is_default !== undefined) updateData.is_default = updates.is_default;
      if (updates.is_active !== undefined) updateData.is_active = updates.is_active;

      const updated = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.TEMPLATES,
        templateId,
        updateData
      );

      return updated;
    } catch (error) {
      console.error('Error actualizando plantilla:', error);
      throw error;
    }
  },

  // Incrementar contador de uso
  async incrementUsage(templateId: string) {
    try {
      const template = await this.getTemplate(templateId);
      await this.updateTemplate(templateId, {
        usage_count: (template.usage_count || 0) + 1,
      });
    } catch (error) {
      console.error('Error incrementando uso de plantilla:', error);
    }
  },

  // Duplicar plantilla
  async duplicateTemplate(templateId: string, userId: string) {
    try {
      const original = await this.getTemplate(templateId);
      
      return await this.createTemplate(original.workspace_id, userId, {
        name: `${original.name} (Copia)`,
        description: original.description,
        version: '1.0',
        category: original.category,
        content: original.content,
        workflow: original.workflow,
        is_default: false,
        is_active: true,
      });
    } catch (error) {
      console.error('Error duplicando plantilla:', error);
      throw error;
    }
  },
};

export default templatesService;
