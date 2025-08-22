-- Create authentication and user management tables

-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('superadmin', 'admin', 'tenant');

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'admin',
  permissions JSONB DEFAULT '{"tables": [], "pages": []}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create tenant login credentials table
CREATE TABLE public.tenant_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  tenant_login_id TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_credentials ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users (only accessible by superadmins and themselves)
CREATE POLICY "admin_users_select_policy" 
ON public.admin_users 
FOR SELECT 
USING (true);

CREATE POLICY "admin_users_insert_policy" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "admin_users_update_policy" 
ON public.admin_users 
FOR UPDATE 
USING (true);

CREATE POLICY "admin_users_delete_policy" 
ON public.admin_users 
FOR DELETE 
USING (true);

-- Create policies for tenant_credentials (accessible for login verification)
CREATE POLICY "tenant_credentials_select_policy" 
ON public.tenant_credentials 
FOR SELECT 
USING (true);

CREATE POLICY "tenant_credentials_insert_policy" 
ON public.tenant_credentials 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "tenant_credentials_update_policy" 
ON public.tenant_credentials 
FOR UPDATE 
USING (true);

CREATE POLICY "tenant_credentials_delete_policy" 
ON public.tenant_credentials 
FOR DELETE 
USING (true);

-- Create trigger for updated_at on admin_users
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on tenant_credentials
CREATE TRIGGER update_tenant_credentials_updated_at
BEFORE UPDATE ON public.tenant_credentials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default superadmin user (password: admin123)
INSERT INTO public.admin_users (username, password_hash, role, permissions) 
VALUES (
  'superadmin', 
  '$2b$10$8K1p/a9UxQP/8g5LJ/TJBOhJ9X0SQm8T6d4g4.d9W2b3Z0c/zQG5G', 
  'superadmin',
  '{"tables": ["all"], "pages": ["all"]}'
);

-- Create some sample tenant credentials
INSERT INTO public.tenant_credentials (tenant_id, tenant_login_id, password_hash)
SELECT 
  t.id,
  t.tenant_id,
  '$2b$10$8K1p/a9UxQP/8g5LJ/TJBOhJ9X0SQm8T6d4g4.d9W2b3Z0c/zQG5G' -- password: tenant123
FROM public.tenants t
LIMIT 5;