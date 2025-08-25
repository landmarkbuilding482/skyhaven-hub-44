-- Insert sample admin users for testing
INSERT INTO admin_users (username, password_hash, role, permissions) VALUES 
('superadmin', 'superadmin123', 'superadmin', '{"pages": ["admin", "analytics", "forms", "data-tables", "user-management"], "tables": ["all"]}'),
('admin', 'admin123', 'admin', '{"pages": ["admin", "analytics", "forms", "data-tables"], "tables": ["tenants", "rent_payments", "maintenance_repairs", "feedback_complaints"]}');

-- Insert sample tenant credentials for testing
INSERT INTO tenant_credentials (tenant_login_id, password_hash, tenant_id) 
SELECT 
  t.tenant_id as tenant_login_id,
  'tenant123' as password_hash,
  t.id as tenant_id
FROM tenants t
WHERE NOT EXISTS (
  SELECT 1 FROM tenant_credentials tc WHERE tc.tenant_id = t.id
);