-- Insert sample vendor contractor contracts
INSERT INTO public.vendor_contractor_contracts (contractor_name, service_type, start_date, end_date, description) VALUES 
('PowerTech Solutions', 'Electricity Maintenance Company', '2024-01-15', '2025-01-14', 'Comprehensive electrical maintenance including monthly inspections, emergency repairs, and preventive maintenance. SLA: 4-hour response time for emergencies, 24-hour resolution for critical issues.'),
('AquaFlow Services', 'Plumbing Maintenance Company', '2024-03-01', '2025-02-28', 'Full plumbing maintenance services covering all water systems, drainage, and sewage. Terms include quarterly pipe inspections, leak detection, and 24/7 emergency response.'),
('BuildRight Construction', 'Construction Maintenance Company', '2024-02-10', '2025-02-09', 'Structural maintenance and repairs including concrete work, painting, and general construction. ToR includes monthly structural assessments and annual building integrity reports.'),
('SecureGuard Systems', 'Security Services Company', '2024-01-01', '2024-12-31', 'Complete security services including 24/7 surveillance, access control systems, and security personnel. SLA guarantees maximum 2-minute response time for security incidents.');

-- Insert sample vendor contractor activity logs
INSERT INTO public.vendor_contractor_activity_logs (contractor_name, date, activity_type, description, status, rating) VALUES 
('PowerTech Solutions', '2024-01-20', 'Routine Maintenance', 'Monthly electrical panel inspection and testing of backup generators. All systems functioning within normal parameters.', 'Completed', 5),
('PowerTech Solutions', '2024-01-25', 'Emergency Repair', 'Power outage on Floor 3 due to circuit breaker failure. Replaced faulty breaker and restored power within 2 hours.', 'Completed', 4),
('AquaFlow Services', '2024-03-15', 'Installation', 'Installed new water filtration system in main utility room. System tested and operational.', 'Completed', 5),
('AquaFlow Services', '2024-03-20', 'Emergency Repair', 'Burst pipe on Floor 5 causing water damage. Emergency repair completed but response time exceeded SLA.', 'Completed', 2),
('BuildRight Construction', '2024-02-18', 'Routine Maintenance', 'Quarterly building inspection and minor concrete repairs on parking garage level.', 'Completed', 4),
('BuildRight Construction', '2024-03-01', 'Inspection', 'Annual structural integrity assessment. Building meets all safety standards with minor recommendations.', 'Completed', 5),
('SecureGuard Systems', '2024-01-10', 'Installation', 'Upgraded CCTV cameras in lobby and parking areas. Enhanced night vision capabilities installed.', 'Completed', 4),
('SecureGuard Systems', '2024-02-05', 'Routine Maintenance', 'Monthly security system check and access card system maintenance. All systems operational.', 'In Progress', 3);