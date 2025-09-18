-- Create external parking table for tracking company external parking allocations
CREATE TABLE public.external_parking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  spots_allowed INTEGER NOT NULL DEFAULT 0,
  fee_paid NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.external_parking ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on external_parking" 
ON public.external_parking 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create external parking statistics table
CREATE TABLE public.external_parking_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  spots_available INTEGER NOT NULL DEFAULT 0,
  spots_occupied INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.external_parking_statistics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on external_parking_statistics" 
ON public.external_parking_statistics 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add trigger for automatic timestamp updates on external_parking
CREATE TRIGGER update_external_parking_updated_at
BEFORE UPDATE ON public.external_parking
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for automatic timestamp updates on external_parking_statistics
CREATE TRIGGER update_external_parking_statistics_updated_at
BEFORE UPDATE ON public.external_parking_statistics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial external parking statistics record
INSERT INTO public.external_parking_statistics (spots_available, spots_occupied) 
VALUES (0, 0);