import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipos
export interface User {
  $id: string;
  email: string;
  name: string;
}

export interface Workspace {
  $id: string;
  name: string;
  domain?: string;
  plan: 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'trial' | 'suspended';
  credits_balance: number;
  branding: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    company_name?: string;
  };
  limits: {
    monthly_cases?: number;
    storage_gb?: number;
    api_calls_per_month?: number;
    users_limit?: number;
  };
  features: {
    kyc_enabled?: boolean;
    background_checks?: boolean;
    scoring_engine?: boolean;
    custom_templates?: boolean;
  };
}

export interface WorkspaceUser {
  $id: string;
  workspace_id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: 'owner' | 'admin' | 'analyst' | 'viewer';
  permissions: {
    can_create_cases?: boolean;
    can_edit_cases?: boolean;
    can_delete_cases?: boolean;
    can_manage_users?: boolean;
    can_manage_billing?: boolean;
    can_view_analytics?: boolean;
    can_manage_integrations?: boolean;
  };
  status: 'active' | 'inactive' | 'invited';
}

interface AuthState {
  user: User | null;
  currentWorkspace: Workspace | null;
  workspaceUser: WorkspaceUser | null;
  workspaces: Workspace[];
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setWorkspaceUser: (workspaceUser: WorkspaceUser | null) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      currentWorkspace: null,
      workspaceUser: null,
      workspaces: [],
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user }),

      setCurrentWorkspace: (workspace) =>
        set({ currentWorkspace: workspace }),

      setWorkspaceUser: (workspaceUser) =>
        set({ workspaceUser }),

      setWorkspaces: (workspaces) =>
        set({ workspaces }),

      setIsLoading: (isLoading) =>
        set({ isLoading }),

      logout: () =>
        set({
          user: null,
          currentWorkspace: null,
          workspaceUser: null,
          workspaces: [],
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        currentWorkspace: state.currentWorkspace,
        workspaceUser: state.workspaceUser,
        workspaces: state.workspaces,
      }),
    }
  )
);
