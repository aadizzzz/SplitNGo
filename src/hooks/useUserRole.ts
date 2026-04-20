import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('get_user_role', {
          _user_id: user.id
        });

        if (error) throw error;
        setRole(data as AppRole);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const hasRole = (requiredRole: AppRole): boolean => {
    if (!role) return false;
    
    const roleHierarchy: Record<AppRole, number> = {
      'super_admin': 6,
      'zone_admin': 5,
      'division_admin': 4,
      'station_admin': 3,
      'tte': 2,
      'user': 1,
    };

    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  return { role, loading, hasRole };
};
