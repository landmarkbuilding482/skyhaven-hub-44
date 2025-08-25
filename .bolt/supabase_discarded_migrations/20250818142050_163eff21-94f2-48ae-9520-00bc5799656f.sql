-- Insert 8 random tenant entries
INSERT INTO public.tenants (
    name, 
    floor, 
    space_type, 
    business_type, 
    registration_date, 
    monthly_rent, 
    phone_number, 
    email, 
    first_payment_date, 
    status
) VALUES 
(
    'TechCorp Solutions', 
    '5A', 
    'office', 
    'Technology Consulting', 
    '2023-01-15', 
    4200.00, 
    '+1-555-0123', 
    'contact@techcorp.com', 
    '2023-01-20', 
    'active'
),
(
    'Fashion Boutique LLC', 
    '1B', 
    'retail', 
    'Fashion Retail', 
    '2023-03-10', 
    3800.50, 
    '+1-555-0456', 
    'info@fashionboutique.com', 
    '2023-03-15', 
    'active'
),
(
    'Legal Associates Inc', 
    '8C', 
    'office', 
    'Legal Services', 
    '2022-06-01', 
    6500.00, 
    '+1-555-0789', 
    'admin@legalassoc.com', 
    '2022-06-05', 
    'active'
),
(
    'Creative Studio Arts', 
    '3A', 
    'studio', 
    'Graphic Design', 
    '2023-08-20', 
    2900.75, 
    '+1-555-0321', 
    'hello@creativestudio.com', 
    '2023-08-25', 
    'active'
),
(
    'Global Imports Warehouse', 
    'B1', 
    'warehouse', 
    'Import/Export', 
    '2023-02-14', 
    5200.00, 
    '+1-555-0654', 
    'operations@globalimports.com', 
    '2023-02-20', 
    'active'
),
(
    'Fitness Plus Gym', 
    '2A', 
    'other', 
    'Fitness & Wellness', 
    '2023-09-01', 
    4800.00, 
    '+1-555-0987', 
    'manager@fitnessplus.com', 
    '2023-09-10', 
    'active'
),
(
    'Data Analytics Pro', 
    '7B', 
    'office', 
    'Data Science', 
    '2024-01-05', 
    3600.25, 
    '+1-555-0147', 
    'team@dataanalytics.com', 
    NULL, 
    'pending'
),
(
    'Artisan Coffee Roasters', 
    '1A', 
    'retail', 
    'Food & Beverage', 
    '2023-11-15', 
    2750.00, 
    '+1-555-0258', 
    'orders@artisancoffee.com', 
    '2023-11-18', 
    'inactive'
);