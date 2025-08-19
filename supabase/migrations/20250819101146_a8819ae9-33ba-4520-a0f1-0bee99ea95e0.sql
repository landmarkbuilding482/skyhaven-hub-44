-- Create utilities table
CREATE TABLE public.utilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.utilities ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can restrict this later based on user roles)
CREATE POLICY "Allow all operations on utilities" 
ON public.utilities 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_utilities_updated_at
BEFORE UPDATE ON public.utilities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.utilities (date, type, amount) VALUES
('2024-08-01', 'Electricity', 2450.00),
('2024-08-01', 'Water', 890.50),
('2024-08-01', 'Gas', 320.75),
('2024-08-01', 'Internet', 450.00),
('2024-07-01', 'Electricity', 2380.25),
('2024-07-01', 'Water', 875.00),
('2024-07-01', 'Gas', 315.50);