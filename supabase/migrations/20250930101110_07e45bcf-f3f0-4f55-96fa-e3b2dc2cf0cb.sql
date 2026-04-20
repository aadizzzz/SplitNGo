-- Phase 1: Admin Hierarchy System - Database Schema (Fixed)

-- 1. Create app_role enum only if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM (
      'super_admin',
      'zone_admin', 
      'division_admin',
      'station_admin',
      'tte',
      'user'
    );
  END IF;
END $$;

-- 2. User roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Zones table
CREATE TABLE IF NOT EXISTS public.zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_code TEXT NOT NULL UNIQUE,
  zone_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;

-- 4. Divisions table
CREATE TABLE IF NOT EXISTS public.divisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  division_code TEXT NOT NULL UNIQUE,
  division_name TEXT NOT NULL,
  zone_id UUID NOT NULL REFERENCES public.zones(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;

-- 5. Stations table (railway stations with hierarchy)
CREATE TABLE IF NOT EXISTS public.railway_stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  station_code TEXT NOT NULL UNIQUE,
  station_name TEXT NOT NULL,
  division_id UUID NOT NULL REFERENCES public.divisions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.railway_stations ENABLE ROW LEVEL SECURITY;

-- 6. Zone Admins table
CREATE TABLE IF NOT EXISTS public.zone_admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  zone_id UUID NOT NULL REFERENCES public.zones(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, zone_id)
);

ALTER TABLE public.zone_admins ENABLE ROW LEVEL SECURITY;

-- 7. Division Admins table
CREATE TABLE IF NOT EXISTS public.division_admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  division_id UUID NOT NULL REFERENCES public.divisions(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, division_id)
);

ALTER TABLE public.division_admins ENABLE ROW LEVEL SECURITY;

-- 8. Station Admins table
CREATE TABLE IF NOT EXISTS public.station_admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  station_id UUID NOT NULL REFERENCES public.railway_stations(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, station_id)
);

ALTER TABLE public.station_admins ENABLE ROW LEVEL SECURITY;

-- 9. TTEs table
CREATE TABLE IF NOT EXISTS public.ttes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tte_code TEXT NOT NULL UNIQUE,
  station_id UUID NOT NULL REFERENCES public.railway_stations(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'active',
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.ttes ENABLE ROW LEVEL SECURITY;

-- 10. Audit Logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  actor_id UUID NOT NULL REFERENCES auth.users(id),
  target_id UUID,
  target_role app_role,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 11. Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
  )
$$;

-- 12. Create function to get user's highest role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
    AND is_active = true
  ORDER BY 
    CASE role
      WHEN 'super_admin' THEN 1
      WHEN 'zone_admin' THEN 2
      WHEN 'division_admin' THEN 3
      WHEN 'station_admin' THEN 4
      WHEN 'tte' THEN 5
      WHEN 'user' THEN 6
    END
  LIMIT 1
$$;

-- 13. Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Super admins can view all roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Super admins can insert roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Super admins can update roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Everyone can view zones" ON public.zones;
  DROP POLICY IF EXISTS "Super admins can manage zones" ON public.zones;
  DROP POLICY IF EXISTS "Everyone can view divisions" ON public.divisions;
  DROP POLICY IF EXISTS "Super admins can manage divisions" ON public.divisions;
  DROP POLICY IF EXISTS "Everyone can view stations" ON public.railway_stations;
  DROP POLICY IF EXISTS "Super admins can manage stations" ON public.railway_stations;
  DROP POLICY IF EXISTS "Zone admins can view their assignments" ON public.zone_admins;
  DROP POLICY IF EXISTS "Super admins can manage zone admins" ON public.zone_admins;
  DROP POLICY IF EXISTS "Division admins can view their assignments" ON public.division_admins;
  DROP POLICY IF EXISTS "Zone admins can manage division admins in their zone" ON public.division_admins;
  DROP POLICY IF EXISTS "Station admins can view their assignments" ON public.station_admins;
  DROP POLICY IF EXISTS "Division admins can manage station admins in their division" ON public.station_admins;
  DROP POLICY IF EXISTS "TTEs can view their own profile" ON public.ttes;
  DROP POLICY IF EXISTS "Station admins can view TTEs at their station" ON public.ttes;
  DROP POLICY IF EXISTS "Station admins can manage TTEs at their station" ON public.ttes;
  DROP POLICY IF EXISTS "Admins can view relevant audit logs" ON public.audit_logs;
  DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

-- 14. RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can update roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'super_admin'));

-- 15. RLS Policies for zones
CREATE POLICY "Everyone can view zones"
  ON public.zones FOR SELECT
  USING (true);

CREATE POLICY "Super admins can manage zones"
  ON public.zones FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

-- 16. RLS Policies for divisions
CREATE POLICY "Everyone can view divisions"
  ON public.divisions FOR SELECT
  USING (true);

CREATE POLICY "Super admins can manage divisions"
  ON public.divisions FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

-- 17. RLS Policies for railway_stations
CREATE POLICY "Everyone can view stations"
  ON public.railway_stations FOR SELECT
  USING (true);

CREATE POLICY "Super admins can manage stations"
  ON public.railway_stations FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

-- 18. RLS Policies for zone_admins
CREATE POLICY "Zone admins can view their assignments"
  ON public.zone_admins FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage zone admins"
  ON public.zone_admins FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

-- 19. RLS Policies for division_admins
CREATE POLICY "Division admins can view their assignments"
  ON public.division_admins FOR SELECT
  USING (
    auth.uid() = user_id 
    OR public.has_role(auth.uid(), 'super_admin')
    OR EXISTS (
      SELECT 1 FROM public.zone_admins za
      JOIN public.divisions d ON d.zone_id = za.zone_id
      WHERE za.user_id = auth.uid() AND d.id = division_id
    )
  );

CREATE POLICY "Zone admins can manage division admins in their zone"
  ON public.division_admins FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.zone_admins za
      JOIN public.divisions d ON d.zone_id = za.zone_id
      WHERE za.user_id = auth.uid() AND d.id = division_id AND za.is_active = true
    )
  );

-- 20. RLS Policies for station_admins
CREATE POLICY "Station admins can view their assignments"
  ON public.station_admins FOR SELECT
  USING (
    auth.uid() = user_id 
    OR public.has_role(auth.uid(), 'super_admin')
    OR EXISTS (
      SELECT 1 FROM public.division_admins da
      JOIN public.railway_stations rs ON rs.division_id = da.division_id
      WHERE da.user_id = auth.uid() AND rs.id = station_id
    )
  );

CREATE POLICY "Division admins can manage station admins in their division"
  ON public.station_admins FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.division_admins da
      JOIN public.railway_stations rs ON rs.division_id = da.division_id
      WHERE da.user_id = auth.uid() AND rs.id = station_id AND da.is_active = true
    )
  );

-- 21. RLS Policies for ttes
CREATE POLICY "TTEs can view their own profile"
  ON public.ttes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Station admins can view TTEs at their station"
  ON public.ttes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.station_admins sa
      WHERE sa.user_id = auth.uid() AND sa.station_id = ttes.station_id AND sa.is_active = true
    )
  );

CREATE POLICY "Station admins can manage TTEs at their station"
  ON public.ttes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.station_admins sa
      WHERE sa.user_id = auth.uid() AND sa.station_id = ttes.station_id AND sa.is_active = true
    )
  );

-- 22. RLS Policies for audit_logs
CREATE POLICY "Admins can view relevant audit logs"
  ON public.audit_logs FOR SELECT
  USING (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'zone_admin')
    OR public.has_role(auth.uid(), 'division_admin')
    OR public.has_role(auth.uid(), 'station_admin')
  );

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

-- 23. Triggers for updated_at timestamps
DROP TRIGGER IF EXISTS update_zones_updated_at ON public.zones;
CREATE TRIGGER update_zones_updated_at
  BEFORE UPDATE ON public.zones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_divisions_updated_at ON public.divisions;
CREATE TRIGGER update_divisions_updated_at
  BEFORE UPDATE ON public.divisions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_railway_stations_updated_at ON public.railway_stations;
CREATE TRIGGER update_railway_stations_updated_at
  BEFORE UPDATE ON public.railway_stations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_zone_admins_updated_at ON public.zone_admins;
CREATE TRIGGER update_zone_admins_updated_at
  BEFORE UPDATE ON public.zone_admins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_division_admins_updated_at ON public.division_admins;
CREATE TRIGGER update_division_admins_updated_at
  BEFORE UPDATE ON public.division_admins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_station_admins_updated_at ON public.station_admins;
CREATE TRIGGER update_station_admins_updated_at
  BEFORE UPDATE ON public.station_admins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_ttes_updated_at ON public.ttes;
CREATE TRIGGER update_ttes_updated_at
  BEFORE UPDATE ON public.ttes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 24. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_divisions_zone_id ON public.divisions(zone_id);
CREATE INDEX IF NOT EXISTS idx_railway_stations_division_id ON public.railway_stations(division_id);
CREATE INDEX IF NOT EXISTS idx_zone_admins_user_id ON public.zone_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_zone_admins_zone_id ON public.zone_admins(zone_id);
CREATE INDEX IF NOT EXISTS idx_division_admins_user_id ON public.division_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_division_admins_division_id ON public.division_admins(division_id);
CREATE INDEX IF NOT EXISTS idx_station_admins_user_id ON public.station_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_station_admins_station_id ON public.station_admins(station_id);
CREATE INDEX IF NOT EXISTS idx_ttes_user_id ON public.ttes(user_id);
CREATE INDEX IF NOT EXISTS idx_ttes_station_id ON public.ttes(station_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);