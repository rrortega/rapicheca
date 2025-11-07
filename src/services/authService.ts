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
      // Solo intentar obtener usuario si tenemos una sesión válida
      // Verificar primero si hay sesión sin provocar error 401
      const sessionResult = await this.checkSession();
      
      if (!sessionResult.valid) {
        if (process.env.NODE_ENV === 'development') {
          console.log('No hay sesión válida, no autenticado');
        }
        return null;
      }
      
      // Solo si la sesión es válida, intentar obtener el usuario
      return await account.get();
    } catch (error) {
      // Si es un error de autorización por falta de permisos, asumir usuario no autenticado
      if (error?.code === 401 || error?.type === 'general_unauthorized_scope' ||
          error?.message?.includes('missing scope') || error?.message?.includes('role: guests')) {
        // No log para evitar spam en consola
        return null;
      }
      
      // Para otros errores de sesión, retornar null
      if (error?.code === 401 || error?.message?.includes('No active session')) {
        return null;
      }
      
      // Solo log de errores reales en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.error('Error obteniendo usuario actual:', error);
      }
      return null;
    }
  },

  // Método adicional para verificar el estado de la sesión
  async checkSession() {
    try {
      // Para usuarios con rol "guests", getSession puede fallar con 401
      // Manejar esto de forma completamente silenciosa
      const session = await account.getSession('current');
      if (session) {
        // Verificar que la sesión es válida
        const now = new Date().getTime();
        const expiresAt = new Date(session.expire).getTime();
        
        if (expiresAt > now) {
          return { valid: true, session };
        } else {
          // Solo log en desarrollo
          if (process.env.NODE_ENV === 'development') {
            console.warn('Sesión expirada, eliminando...');
          }
          try {
            await account.deleteSession('current');
          } catch (deleteError) {
            // Ignorar errores de limpieza
          }
          return { valid: false, reason: 'expired' };
        }
      }
      return { valid: false, reason: 'no_session' };
    } catch (sessionError) {
      // Si getSession falla por cualquier razón, asumir no autenticado
      // No log para evitar spam en consola
      return { valid: false, reason: 'no_permissions' };
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
