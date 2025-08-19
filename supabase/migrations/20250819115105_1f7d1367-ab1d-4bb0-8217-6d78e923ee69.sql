-- Insert sample feedback & complaints data
INSERT INTO public.feedback_complaints (
  complaint_id,
  date,
  tenant_id,
  type,
  category,
  description,
  status,
  assigned_to
) VALUES 
  ('FC-0282090180', '2024-01-15', (SELECT id FROM tenants LIMIT 1), 'Complaint', 'Maintenance', 'Air conditioning system not working properly in office space. Temperature is too hot during working hours.', 'In Progress', 'Maintenance Team'),
  ('FC-0282090181', '2024-01-14', (SELECT id FROM tenants LIMIT 1 OFFSET 1), 'Feedback', 'Amenities', 'Would like to suggest adding more parking spaces for visitors. Current spaces are always full.', 'Under Review', 'Building Manager'),
  ('FC-0282090182', '2024-01-13', NULL, 'Suggestion', 'Security', 'Consider installing better lighting in the parking garage for safety concerns during evening hours.', 'Under Review', 'Security'),
  ('FC-0282090183', '2024-01-12', (SELECT id FROM tenants LIMIT 1 OFFSET 2), 'Complaint', 'Cleanliness', 'Restrooms on the 5th floor are not being cleaned regularly. Paper towels are often empty.', 'Closed', 'Building Manager'),
  ('FC-0282090184', '2024-01-11', (SELECT id FROM tenants LIMIT 1), 'Feedback', 'Staff', 'The front desk staff has been very helpful and professional. Great customer service!', 'Closed', 'Admin'),
  ('FC-0282090185', '2024-01-10', NULL, 'Complaint', 'Noise', 'Construction noise from renovation work is too loud and disruptive during business hours.', 'In Progress', 'Building Manager'),
  ('FC-0282090186', '2024-01-09', (SELECT id FROM tenants LIMIT 1 OFFSET 1), 'Suggestion', 'Billing', 'Monthly billing statements should include more detailed breakdown of charges and fees.', 'Under Review', 'Customer Service'),
  ('FC-0282090187', '2024-01-08', (SELECT id FROM tenants LIMIT 1 OFFSET 2), 'Complaint', 'Parking', 'Assigned parking space is being used by other tenants. Need better enforcement of parking rules.', 'In Progress', 'Security');