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
      // Para usuarios con rol "guests", intentar directamente account.get()
      // Si falla, retornar null sin intentar verificaciones adicionales
      return await account.get();
    } catch (error) {
      // Si es un error de autorización por falta de permisos, asumir usuario no autenticado
      if (error?.code === 401 || error?.type === 'general_unauthorized_scope' ||
          error?.message?.includes('missing scope') || error?.message?.includes('role: guests')) {
        console.log('Usuario con permisos limitados (guests), asumiendo no autenticado');
        
        // No intentar limpiar la sesión si no tenemos permisos
        // Simplemente retornar null y continuar
        return null;
      }
      
      // Para otros errores de sesión, retornar null
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
      // Para usuarios con rol "guests", incluso getSession puede fallar
      // Manejar esto de forma más elegante
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
      } catch (sessionError) {
        // Si getSession falla, puede ser por falta de permisos
        if (sessionError?.code === 401 || sessionError?.type === 'general_unauthorized_scope' ||
            sessionError?.message?.includes('missing scope')) {
          console.log('Usuario sin permisos para verificar sesión, asumiendo no autenticado');
          return { valid: false, reason: 'no_permissions' };
        }
        throw sessionError; // Re-lanzar otros errores
      }
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
