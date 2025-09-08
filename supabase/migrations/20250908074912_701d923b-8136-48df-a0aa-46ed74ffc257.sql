-- Fix RLS policies for tenant_credentials table to secure login data
DROP POLICY IF EXISTS "tenant_credentials_select_policy" ON public.tenant_credentials;
DROP POLICY IF EXISTS "tenant_credentials_insert_policy" ON public.tenant_credentials;
DROP POLICY IF EXISTS "tenant_credentials_update_policy" ON public.tenant_credentials;
DROP POLICY IF EXISTS "tenant_credentials_delete_policy" ON public.tenant_credentials;

-- Create secure policies for tenant_credentials table
-- Only authenticated admins can view all tenant credentials
CREATE POLICY "Authenticated admins can view tenant credentials" 
ON public.tenant_credentials 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role IN ('admin', 'superadmin')
  )
);

-- Only authenticated admins can create tenant credentials
CREATE POLICY "Authenticated admins can create tenant credentials" 
ON public.tenant_credentials 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role IN ('admin', 'superadmin')
  )
);

-- Only authenticated admins can update tenant credentials
CREATE POLICY "Authenticated admins can update tenant credentials" 
ON public.tenant_credentials 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role IN ('admin', 'superadmin')
  )
);

-- Only authenticated admins can delete tenant credentials
CREATE POLICY "Authenticated admins can delete tenant credentials" 
ON public.tenant_credentials 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role IN ('admin', 'superadmin')
  )
);

-- Additional policy: Allow tenants to view only their own credentials (for login purposes)
CREATE POLICY "Tenants can view their own credentials" 
ON public.tenant_credentials 
FOR SELECT 
TO authenticated
USING (tenant_id = auth.uid());

-- Additional policy: Allow tenants to update only their own credentials (for password changes)
CREATE POLICY "Tenants can update their own credentials" 
ON public.tenant_credentials 
FOR UPDATE 
TO authenticated
USING (tenant_id = auth.uid());