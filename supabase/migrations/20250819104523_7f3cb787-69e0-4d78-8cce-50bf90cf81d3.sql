-- Drop existing visitor_foot_traffic table and recreate it properly
DROP TABLE IF EXISTS public.visitor_foot_traffic CASCADE;

-- Create visitor_foot_traffic table with proper structure
CREATE TABLE public.visitor_foot_traffic (
  id TEXT DEFAULT public.generate_short_id() PRIMARY KEY,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  floor TEXT NOT NULL,
  company TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('Work', 'Client', 'Visitor', 'Other')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitor_foot_traffic ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on visitor_foot_traffic" 
ON public.visitor_foot_traffic 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_visitor_foot_traffic_updated_at
BEFORE UPDATE ON public.visitor_foot_traffic
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.visitor_foot_traffic (date, time, floor, company, purpose) VALUES
('2024-08-19', '09:30', '1st Floor', 'Tech Solutions Inc', 'Client'),
('2024-08-19', '11:15', '2nd Floor', 'Marketing Pro Ltd', 'Work'),
('2024-08-19', '14:45', '3rd Floor', 'Legal Advisors', 'Visitor'),
('2024-08-18', '10:00', '1st Floor', 'Design Studio', 'Client'),
('2024-08-18', '16:20', '2nd Floor', 'Financial Services', 'Other');