-- Create a function to generate short alphanumeric IDs
CREATE OR REPLACE FUNCTION public.generate_short_id()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..12 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update utilities table to use custom short IDs
ALTER TABLE public.utilities DROP CONSTRAINT utilities_pkey;
ALTER TABLE public.utilities DROP COLUMN id;
ALTER TABLE public.utilities ADD COLUMN id TEXT DEFAULT public.generate_short_id() PRIMARY KEY;

-- Clear existing data and re-insert with new ID format
DELETE FROM public.utilities;

-- Insert sample data with custom short IDs
INSERT INTO public.utilities (date, type, amount) VALUES
('2024-08-01', 'Electricity', 2450.00),
('2024-08-01', 'Water', 890.50),
('2024-08-01', 'Gas', 320.75),
('2024-08-01', 'Internet', 450.00),
('2024-07-01', 'Electricity', 2380.25),
('2024-07-01', 'Water', 875.00),
('2024-07-01', 'Gas', 315.50);