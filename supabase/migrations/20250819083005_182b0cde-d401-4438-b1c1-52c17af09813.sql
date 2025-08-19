-- Add tenant_id column to store the new format
ALTER TABLE tenants ADD COLUMN tenant_id TEXT;

-- Update floors to match building structure and assign new tenant IDs
UPDATE tenants SET 
  floor = '5',
  space_type = 'office',
  tenant_id = 'LMT-5001'
WHERE id = '1d57b50d-f6d3-4981-bf66-04316336c66c'; -- TechCorp Solutions

UPDATE tenants SET 
  floor = 'G',
  space_type = 'retail',
  tenant_id = 'LMT-G001'
WHERE id = 'f37bc614-33a0-46a8-88d4-b3612d6cd05d'; -- Fashion Boutique LLC

UPDATE tenants SET 
  floor = '8',
  space_type = 'restaurant',
  business_type = 'Legal Services',
  tenant_id = 'LMT-8001'
WHERE id = 'baa76c6a-5da6-4c28-a750-c9d749ff618f'; -- Legal Associates Inc (moved to floor 8)

UPDATE tenants SET 
  floor = '3',
  space_type = 'office',
  tenant_id = 'LMT-3001'
WHERE id = '326dd7a5-e02f-458c-a138-3e5f0ef8f0a9'; -- Creative Studio Arts

UPDATE tenants SET 
  floor = 'B',
  space_type = 'parking',
  tenant_id = 'LMT-B001'
WHERE id = '7df19c77-c8a6-43a6-bd49-330298b77905'; -- Global Imports Warehouse

UPDATE tenants SET 
  floor = '2',
  space_type = 'office',
  tenant_id = 'LMT-2001'
WHERE id = '7e609de3-451f-4ca4-8604-3103e4166758'; -- Fitness Plus Gym

UPDATE tenants SET 
  floor = '7',
  space_type = 'office',
  tenant_id = 'LMT-7001'
WHERE id = '22fb5dc3-0aea-48ba-ae4b-a9048113fabf'; -- Data Analytics Pro

UPDATE tenants SET 
  floor = 'G',
  space_type = 'retail',
  tenant_id = 'LMT-G002'
WHERE id = '0c373112-dbec-47b6-a575-bacc6a85d241'; -- Artisan Coffee Roasters

-- Update lease_agreements and rent_payments to reference tenant_id instead of tenant internal id
ALTER TABLE lease_agreements ADD COLUMN tenant_reference TEXT;
ALTER TABLE rent_payments ADD COLUMN tenant_reference TEXT;

-- Update lease agreements with tenant references
UPDATE lease_agreements la SET tenant_reference = t.tenant_id 
FROM tenants t WHERE la.tenant_id = t.id;

-- Update rent payments with tenant references  
UPDATE rent_payments rp SET tenant_reference = t.tenant_id 
FROM tenants t WHERE rp.tenant_id = t.id;

-- Make tenant_id unique and not null
ALTER TABLE tenants ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE tenants ADD CONSTRAINT unique_tenant_id UNIQUE (tenant_id);