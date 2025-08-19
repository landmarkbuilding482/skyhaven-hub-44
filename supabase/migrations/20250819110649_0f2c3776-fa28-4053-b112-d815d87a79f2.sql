-- Create foot_traffic table
CREATE TABLE public.foot_traffic (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TIME NOT NULL,
  floor TEXT NOT NULL,
  company TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'Work',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.foot_traffic ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is admin functionality)
CREATE POLICY "Allow all operations on foot_traffic" 
ON public.foot_traffic 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_foot_traffic_updated_at
BEFORE UPDATE ON public.foot_traffic
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();