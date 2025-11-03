import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

export interface Case {
  $id: string;
  workspace_id: string;
  case_number: string;
  applicant: {
    full_name: string;
    email: string;
    phone: string;
    curp?: string;
    birth_date?: string;
    address?: any;
  };
  status: 'draft' | 'docs_pending' | 'docs_uploaded' | 'extracting' | 'extracted' | 'analyzing' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  type: 'initial' | 'renewal' | 'update';
  documents: any[];
  analysis?: {
    score?: number;
    risk_level?: string;
    recommendations?: string[];
    summary?: string;
  };
  timeline: any[];
  assigned_to?: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export const casesService = {
  // Listar casos del workspace
  async listCases(workspaceId: string, filters?: {
    status?: string;
    assigned_to?: string;
    limit?: number;
  }) {
    try {
      const queries = [Query.equal('workspace_id', workspaceId)];
      
      if (filters?.status) {
        queries.push(Query.equal('status', filters.status));
      }
      
      if (filters?.assigned_to) {
        queries.push(Query.equal('assigned_to', filters.assigned_to));
      }
      
      if (filters?.limit) {
        queries.push(Query.limit(filters.limit));
      }
      
      queries.push(Query.orderDesc('created_at'));

      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CASES,
        queries
      );

      return result.documents.map((doc: any) => ({
        ...doc,
        applicant: JSON.parse(doc.applicant || '{}'),
        documents: JSON.parse(doc.documents || '[]'),
        analysis: JSON.parse(doc.analysis || '{}'),
        timeline: JSON.parse(doc.timeline || '[]'),
      })) as Case[];
    } catch (error) {
      console.error('Error listando casos:', error);
      return [];
    }
  },

  // Crear nuevo caso
  async createCase(workspaceId: string, caseData: Partial<Case>) {
    try {
      const now = new Date().toISOString();
      const caseNumber = `CASE-${Date.now()}`;

      const newCase = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CASES,
        ID.unique(),
        {
          workspace_id: workspaceId,
          case_number: caseNumber,
          applicant: JSON.stringify(caseData.applicant || {}),
          status: caseData.status || 'draft',
          priority: caseData.priority || 'medium',
          type: caseData.type || 'initial',
          documents: JSON.stringify(caseData.documents || []),
          analysis: JSON.stringify(caseData.analysis || {}),
          timeline: JSON.stringify([
            {
              action: 'created',
              timestamp: now,
              user: caseData.assigned_to || 'system',
            }
          ]),
          assigned_to: caseData.assigned_to || null,
          created_at: now,
          updated_at: now,
        }
      );

      return newCase;
    } catch (error) {
      console.error('Error creando caso:', error);
      throw error;
    }
  },

  // Obtener caso por ID
  async getCase(caseId: string) {
    try {
      const doc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.CASES,
        caseId
      );

      return {
        ...doc,
        applicant: JSON.parse(doc.applicant || '{}'),
        documents: JSON.parse(doc.documents || '[]'),
        analysis: JSON.parse(doc.analysis || '{}'),
        timeline: JSON.parse(doc.timeline || '[]'),
      } as unknown as Case;
    } catch (error) {
      console.error('Error obteniendo caso:', error);
      throw error;
    }
  },

  // Actualizar caso
  async updateCase(caseId: string, updates: Partial<Case>) {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.status) updateData.status = updates.status;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.assigned_to) updateData.assigned_to = updates.assigned_to;
      if (updates.applicant) updateData.applicant = JSON.stringify(updates.applicant);
      if (updates.documents) updateData.documents = JSON.stringify(updates.documents);
      if (updates.analysis) updateData.analysis = JSON.stringify(updates.analysis);
      if (updates.timeline) updateData.timeline = JSON.stringify(updates.timeline);

      const updated = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CASES,
        caseId,
        updateData
      );

      return updated;
    } catch (error) {
      console.error('Error actualizando caso:', error);
      throw error;
    }
  },

  // Estadísticas de casos
  async getCaseStats(workspaceId: string) {
    try {
      const allCases = await this.listCases(workspaceId);
      
      const stats = {
        total: allCases.length,
        draft: allCases.filter(c => c.status === 'draft').length,
        in_progress: allCases.filter(c => ['docs_pending', 'docs_uploaded', 'extracting', 'extracted', 'analyzing'].includes(c.status)).length,
        completed: allCases.filter(c => c.status === 'completed').length,
        rejected: allCases.filter(c => c.status === 'rejected').length,
        by_priority: {
          low: allCases.filter(c => c.priority === 'low').length,
          medium: allCases.filter(c => c.priority === 'medium').length,
          high: allCases.filter(c => c.priority === 'high').length,
        }
      };

      return stats;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return null;
    }
  },
};

export default casesService;
