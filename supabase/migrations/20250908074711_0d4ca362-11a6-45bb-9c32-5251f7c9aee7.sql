-- Fix RLS policies for tenants table to restrict access to authenticated admin users only
DROP POLICY IF EXISTS "Allow all operations on tenants" ON public.tenants;

-- Create secure policies for tenants table
CREATE POLICY "Authenticated admins can view tenants" 
ON public.tenants 
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

CREATE POLICY "Authenticated admins can create tenants" 
ON public.tenants 
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

CREATE POLICY "Authenticated admins can update tenants" 
ON public.tenants 
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

CREATE POLICY "Authenticated admins can delete tenants" 
ON public.tenants 
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

-- Fix RLS policies for rent_payments table
DROP POLICY IF EXISTS "Allow all operations on rent_payments" ON public.rent_payments;

CREATE POLICY "Authenticated admins can view rent payments" 
ON public.rent_payments 
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

CREATE POLICY "Authenticated admins can create rent payments" 
ON public.rent_payments 
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

CREATE POLICY "Authenticated admins can update rent payments" 
ON public.rent_payments 
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

CREATE POLICY "Authenticated admins can delete rent payments" 
ON public.rent_payments 
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

-- Fix RLS policies for lease_agreements table
DROP POLICY IF EXISTS "Allow all operations on lease_agreements" ON public.lease_agreements;

CREATE POLICY "Authenticated admins can view lease agreements" 
ON public.lease_agreements 
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

CREATE POLICY "Authenticated admins can create lease agreements" 
ON public.lease_agreements 
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

CREATE POLICY "Authenticated admins can update lease agreements" 
ON public.lease_agreements 
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

CREATE POLICY "Authenticated admins can delete lease agreements" 
ON public.lease_agreements 
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