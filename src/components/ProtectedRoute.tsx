import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface RouteWrapperProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: RouteWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function PublicRoute({ children }: RouteWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Si está cargando, mostrar loading (pero por tiempo limitado)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Si está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si no está autenticado, mostrar la página pública
  return <>{children}</>;
}
