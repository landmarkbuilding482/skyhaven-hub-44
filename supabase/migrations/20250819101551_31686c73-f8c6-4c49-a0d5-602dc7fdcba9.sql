-- Update utilities table to use shorter integer IDs
ALTER TABLE public.utilities DROP CONSTRAINT utilities_pkey;
ALTER TABLE public.utilities DROP COLUMN id;
ALTER TABLE public.utilities ADD COLUMN id SERIAL PRIMARY KEY;

-- Clear existing data and re-insert with new ID format
DELETE FROM public.utilities;

-- Insert sample data with auto-incrementing IDs
INSERT INTO public.utilities (date, type, amount) VALUES
('2024-08-01', 'Electricity', 2450.00),
('2024-08-01', 'Water', 890.50),
('2024-08-01', 'Gas', 320.75),
('2024-08-01', 'Internet', 450.00),
('2024-07-01', 'Electricity', 2380.25),
('2024-07-01', 'Water', 875.00),
('2024-07-01', 'Gas', 315.50);