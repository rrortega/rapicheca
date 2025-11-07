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
      return await account.get();
    } catch (error) {
      return null;
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
