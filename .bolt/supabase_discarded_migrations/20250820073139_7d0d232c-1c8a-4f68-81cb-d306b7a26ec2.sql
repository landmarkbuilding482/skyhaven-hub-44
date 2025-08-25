-- Insert sample data for asset_inventory table
INSERT INTO public.asset_inventory (asset_name, category, purchase_date, value, condition, last_maintenance, next_maintenance, warranty_month, warranty_year) VALUES
('Dell OptiPlex 7090', 'Computer Equipment', '2023-01-15', 1200.00, 'Excellent', '2024-06-15', '2024-12-15', 1, 2025),
('HP LaserJet Pro 4301fdw', 'Office Equipment', '2022-08-20', 450.00, 'Good', '2024-03-10', '2024-09-10', 8, 2024),
('Ergonomic Office Chair', 'Furniture', '2021-11-05', 320.00, 'Needs Repair', '2023-11-05', '2024-05-05', 11, 2023),
('Samsung 27" Monitor', 'Computer Equipment', '2023-06-12', 280.00, 'Excellent', '2024-01-20', '2024-07-20', 6, 2025),
('Cisco Network Switch', 'Network Equipment', '2022-03-18', 890.00, 'Good', '2024-07-22', '2025-01-22', 3, 2025),
('Canon EOS R6 Camera', 'Electronics', '2023-09-30', 2100.00, 'Excellent', '2024-05-15', '2024-11-15', 9, 2025),
('Steelcase Desk', 'Furniture', '2020-12-01', 650.00, 'Needs Replacement', '2023-12-01', '2024-06-01', 12, 2022),
('Epson Projector EB-2247U', 'Electronics', '2022-05-14', 780.00, 'Good', '2024-02-28', '2024-08-28', 5, 2024),
('MacBook Pro 16"', 'Computer Equipment', '2024-01-08', 2800.00, 'Excellent', '2024-08-01', '2025-02-01', 1, 2026),
('Industrial Printer 3D', 'Manufacturing Equipment', '2021-07-22', 4500.00, 'Good', '2024-04-10', '2024-10-10', 7, 2024),
('Conference Table', 'Furniture', '2019-10-15', 1200.00, 'Needs Repair', '2023-10-15', '2024-04-15', 10, 2021),
('UPS Battery Backup', 'Power Equipment', '2023-04-25', 320.00, 'Excellent', '2024-06-01', '2024-12-01', 4, 2026),
('Xerox Color Printer', 'Office Equipment', '2022-12-03', 1100.00, 'Good', '2024-08-15', '2025-02-15', 12, 2024),
('iPad Pro 12.9"', 'Electronics', '2023-11-18', 950.00, 'Excellent', '2024-07-05', '2025-01-05', 11, 2025),
('Server Rack Cabinet', 'Network Equipment', '2021-02-28', 1800.00, 'Good', '2024-03-20', '2024-09-20', 2, 2024);