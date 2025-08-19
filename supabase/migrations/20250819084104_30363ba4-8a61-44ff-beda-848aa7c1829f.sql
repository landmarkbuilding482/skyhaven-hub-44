-- Update tenants table to support multiple floors
ALTER TABLE public.tenants 
ALTER COLUMN floor TYPE text[] USING string_to_array(floor, ',');

-- Update lease_agreements table to support multiple floors (if it has a floor column)
-- Note: lease_agreements doesn't have a floor column, floors come from tenants relationship