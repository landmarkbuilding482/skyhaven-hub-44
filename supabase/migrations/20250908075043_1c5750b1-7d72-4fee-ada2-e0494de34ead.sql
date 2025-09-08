-- Fix RLS policies for admin_users table to secure admin credentials
DROP POLICY IF EXISTS "admin_users_select_policy" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_insert_policy" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_update_policy" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_delete_policy" ON public.admin_users;

-- Create secure policies for admin_users table
-- Allow authenticated admins to view their own record
CREATE POLICY "Admins can view their own record" 
ON public.admin_users 
FOR SELECT 
TO authenticated
USING (id = auth.uid());

-- Allow superadmins to view all admin records
CREATE POLICY "Superadmins can view all admin records" 
ON public.admin_users 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role = 'superadmin'
  )
);

-- Only superadmins can create new admin users
CREATE POLICY "Superadmins can create admin users" 
ON public.admin_users 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role = 'superadmin'
  )
);

-- Allow admins to update their own record, superadmins can update all
CREATE POLICY "Admins can update their own record" 
ON public.admin_users 
FOR UPDATE 
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Superadmins can update all admin records" 
ON public.admin_users 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role = 'superadmin'
  )
);

-- Only superadmins can delete admin users (but not themselves)
CREATE POLICY "Superadmins can delete other admin users" 
ON public.admin_users 
FOR DELETE 
TO authenticated
USING (
  id != auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role = 'superadmin'
  )
);