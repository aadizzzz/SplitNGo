import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: AppRole;
}

export default function RoleProtectedRoute({ children, requiredRole }: RoleProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { hasRole, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!hasRole(requiredRole)) {
        navigate("/403");
      }
    }
  }, [user, authLoading, roleLoading, hasRole, requiredRole, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !hasRole(requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
