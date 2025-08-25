-- Insert sample maintenance records
INSERT INTO public.maintenance_repairs (date_reported, floor, issue_reporter, issue_type, material_affected, description, assigned_vendor, cost, status) VALUES
('2024-08-15', '3', 'Building Supervisor', 'HVAC', 'Equipment', 'Air conditioning unit making loud noises and not cooling properly', 'Cool Air Systems', 850, 'In Progress'),
('2024-08-14', '7', 'Maintenance Team', 'Plumbing', 'Fixtures', 'Leaky faucet in employee break room', 'Quick Fix Plumbing', 120, 'Completed'),
('2024-08-13', 'G', 'Tech Innovators Inc.', 'Electrical', 'Systems', 'Flickering lights in lobby area affecting visibility', 'Bright Electric', 300, 'Pending'),
('2024-08-12', '5', 'Building Supervisor', 'Structural', 'Ceiling', 'Water stain on ceiling tiles, possible roof leak', 'Structural Solutions', 1200, 'Reported'),
('2024-08-11', '2', 'Green Solutions Ltd.', 'Cleaning', 'Flooring', 'Coffee stain on carpet in conference room needs professional cleaning', 'Clean Pro', 80, 'Completed'),
('2024-08-10', '4', 'Maintenance Team', 'Security', 'Equipment', 'Security camera in hallway stopped working, needs replacement', 'SecureTech', 450, 'In Progress'),
('2024-08-09', '6', 'Other', 'IT/Technology', 'Systems', 'WiFi router malfunction causing connectivity issues for entire floor', 'Other', 200, 'Pending');