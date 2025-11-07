// @ts-nocheck
import { account, databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import type { Workspace, WorkspaceUser } from '@/store/authStore';

const service = {
  // Autenticación
  async login(email: string, password: string) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  async register(email: string, password: string, name: string) {
    try {
      return await account.create(ID.unique(), email, password, name);
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      // Primero verificar si hay una sesión activa
      const session = await account.getSession('current');
      
      // Si hay sesión, intentar obtener el usuario
      if (session) {
        return await account.get();
      }
      
      return null;
    } catch (error) {
      // Si es un error de autorización, limpiar la sesión y retornar null
      if (error?.code === 401 || error?.type === 'general_unauthorized_scope' || error?.message?.includes('missing scope')) {
        console.warn('Usuario no autorizado o sin permisos, limpiando sesión');
        try {
          // Intentar limpiar la sesión actual
          await account.deleteSession('current');
        } catch (deleteError) {
          console.error('Error al limpiar sesión:', deleteError);
        }
        return null;
      }
      
      // Para otros errores, verificar si es porque no hay sesión
      if (error?.code === 401 || error?.message?.includes('No active session')) {
        return null;
      }
      
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  },

  // Método adicional para verificar el estado de la sesión
  async checkSession() {
    try {
      const session = await account.getSession('current');
      if (session) {
        // Verificar que la sesión es válida
        const now = new Date().getTime();
        const expiresAt = new Date(session.expire).getTime();
        
        if (expiresAt > now) {
          return { valid: true, session };
        } else {
          console.warn('Sesión expirada, eliminando...');
          await account.deleteSession('current');
          return { valid: false, reason: 'expired' };
        }
      }
      return { valid: false, reason: 'no_session' };
    } catch (error) {
      console.error('Error verificando sesión:', error);
      return { valid: false, reason: 'error', error: error.message };
    }
  },

  // Método mejorado para crear sesión de forma más robusta
  async createSession(email: string, password: string) {
    try {
      // Limpiar cualquier sesión existente primero
      try {
        await account.deleteSession('current');
      } catch (deleteError) {
        // Ignorar errores al limpiar sesión
        console.log('No había sesión previa para limpiar');
      }

      // Crear nueva sesión
      const session = await account.createEmailPasswordSession(email, password);
      
      return { success: true, session };
    } catch (error) {
      console.error('Error creando sesión:', error);
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  },

  //  Workspaces del usuario
  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    try {
      // Obtener workspace_users del usuario
      const workspaceUsers = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WORKSPACE_USERS,
        [Query.equal('user_id', userId)]
      );

      if (workspaceUsers.documents.length === 0) {
        return [];
      }

      // Obtener los workspaces
      const workspaceIds = workspaceUsers.documents.map((wu: any) => wu.workspace_id);
      const workspaces = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WORKSPACES,
        [Query.equal('$id', workspaceIds)]
      );

      return workspaces.documents.map((doc: any) => ({
        $id: doc.$id,
        name: doc.name,
        domain: doc.domain,
        plan: doc.plan,
        status: doc.status,
        credits_balance: doc.credits_balance,
        branding: JSON.parse(doc.branding || '{}'),
        limits: JSON.parse(doc.limits || '{}'),
        features: JSON.parse(doc.features || '{}'),
      }));
    } catch (error) {
      console.error('Error obteniendo workspaces:', error);
      return [];
    }
  },

  // Obtener datos de usuario en workspace
  async getWorkspaceUser(userId: string, workspaceId: string): Promise<WorkspaceUser | null> {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WORKSPACE_USERS,
        [
          Query.equal('user_id', userId),
          Query.equal('workspace_id', workspaceId)
        ]
      );

      if (result.documents.length === 0) {
        return null;
      }

      const doc = result.documents[0];
      return {
        $id: doc.$id,
        workspace_id: doc.workspace_id,
        user_id: doc.user_id,
        email: doc.email,
        full_name: doc.full_name,
        role: doc.role,
        permissions: JSON.parse(doc.permissions || '{}'),
        status: doc.status,
      };
    } catch (error) {
      console.error('Error obteniendo workspace user:', error);
      return null;
    }
  },
};

export default service;
