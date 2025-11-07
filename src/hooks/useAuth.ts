import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import authService from '@/services/authService';

export function useAuth() {
  const {
    user,
    currentWorkspace,
    workspaceUser,
    workspaces,
    isAuthenticated,
    isLoading,
    setUser,
    setCurrentWorkspace,
    setWorkspaceUser,
    setWorkspaces,
    setIsLoading,
    logout: logoutStore,
  } = useAuthStore();

  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Solo ejecutar checkAuth una vez al montar el componente
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      // Si no hay usuario en el store, verificar autenticación
      if (!user) {
        checkAuth();
      } else {
        // Si hay usuario persistido, asegurar que isLoading sea false
        setIsLoading(false);
      }
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      // Simplificar: intentar obtener usuario directamente
      // Si falla, asumir que no está autenticado
      const currentUser = await authService.getCurrentUser();
      
      if (currentUser) {
        setUser({
          $id: currentUser.$id,
          email: currentUser.email,
          name: currentUser.name,
        });

        // Cargar workspaces del usuario
        const userWorkspaces = await authService.getUserWorkspaces(currentUser.$id);
        setWorkspaces(userWorkspaces);

        // Si hay workspace actual, cargar datos del usuario en ese workspace
        if (currentWorkspace) {
          const wspUser = await authService.getWorkspaceUser(
            currentUser.$id,
            currentWorkspace.$id
          );
          setWorkspaceUser(wspUser);
        } else if (userWorkspaces.length > 0) {
          // Si no hay workspace seleccionado, usar el primero
          setCurrentWorkspace(userWorkspaces[0]);
          const wspUser = await authService.getWorkspaceUser(
            currentUser.$id,
            userWorkspaces[0].$id
          );
          setWorkspaceUser(wspUser);
        }
      } else {
        // Usuario no autenticado o error de autorización
        // Limpiar todo el estado de autenticación
        setUser(null);
        setWorkspaces([]);
        setCurrentWorkspace(null);
        setWorkspaceUser(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      // En caso de cualquier error, limpiar el estado
      setUser(null);
      setWorkspaces([]);
      setCurrentWorkspace(null);
      setWorkspaceUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Usar el nuevo método de creación de sesión más robusto
      const result = await authService.createSession(email, password);
      
      if (result.success) {
        // Después de login exitoso, obtener información del usuario directamente
        try {
          // Crear un usuario temporal con los datos disponibles del email
          setUser({
            $id: 'user-' + Date.now(), // ID temporal
            email: email,
            name: email.split('@')[0], // Nombre basado en email
          });
          setIsLoading(false);
          
          // Intentar obtener el usuario real, pero no fallar si no se puede
          try {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
              setUser({
                $id: currentUser.$id,
                email: currentUser.email,
                name: currentUser.name,
              });
            }
          } catch (userError) {
            // Si falla al obtener el usuario, mantener los datos temporales
            console.log('Usando datos de usuario temporales:', userError);
          }
          
          return { success: true };
        } catch (authError) {
          console.error('Error actualizando estado de usuario:', authError);
          return { success: false, error: 'Error al actualizar estado de usuario' };
        }
      } else {
        return {
          success: false,
          error: result.error,
          code: result.code
        };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await authService.register(email, password, name);
      await login(email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      logoutStore();
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  const switchWorkspace = async (workspaceId: string) => {
    try {
      const workspace = workspaces.find(w => w.$id === workspaceId);
      if (!workspace || !user) return;

      setCurrentWorkspace(workspace);
      
      const wspUser = await authService.getWorkspaceUser(user.$id, workspaceId);
      setWorkspaceUser(wspUser);
    } catch (error) {
      console.error('Error cambiando workspace:', error);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!workspaceUser) return false;
    return !!(workspaceUser.permissions as any)[permission];
  };

  const isRole = (role: string | string[]): boolean => {
    if (!workspaceUser) return false;
    if (Array.isArray(role)) {
      return role.includes(workspaceUser.role);
    }
    return workspaceUser.role === role;
  };

  return {
    user,
    currentWorkspace,
    workspaceUser,
    workspaces,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    switchWorkspace,
    hasPermission,
    isRole,
    refreshAuth: checkAuth,
  };
}
