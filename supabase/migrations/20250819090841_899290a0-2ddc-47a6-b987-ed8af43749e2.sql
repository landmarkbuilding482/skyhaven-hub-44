-- Create table for floor occupancy (floors 8-G)
CREATE TABLE public.floor_occupancy (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  floor TEXT NOT NULL,
  type TEXT NOT NULL,
  square_meters_available NUMERIC NOT NULL DEFAULT 0,
  square_meters_occupied NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for B floor company parking allocations
CREATE TABLE public.parking_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  spots_allowed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for B floor overall statistics
CREATE TABLE public.parking_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  spots_available INTEGER NOT NULL DEFAULT 0,
  spots_occupied INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.floor_occupancy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_statistics ENABLE ROW LEVEL SECURITY;

-- Create policies for full access (since this is admin functionality)
CREATE POLICY "Allow all operations on floor_occupancy" 
ON public.floor_occupancy 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on parking_allocations" 
ON public.parking_allocations 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on parking_statistics" 
ON public.parking_statistics 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_floor_occupancy_updated_at
BEFORE UPDATE ON public.floor_occupancy
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parking_allocations_updated_at
BEFORE UPDATE ON public.parking_allocations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parking_statistics_updated_at
BEFORE UPDATE ON public.parking_statistics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for floor occupancy
INSERT INTO public.floor_occupancy (floor, type, square_meters_available, square_meters_occupied) VALUES
('8', 'Office', 1200, 800),
('7', 'Office', 1200, 950),
('6', 'Office', 1200, 600),
('5', 'Office', 1200, 1100),
('4', 'Retail', 800, 650),
('3', 'Retail', 800, 720),
('2', 'Office', 1000, 850),
('1', 'Lobby', 500, 300),
('G', 'Commercial', 1500, 1200);

-- Insert sample data for parking allocations
INSERT INTO public.parking_allocations (company, spots_allowed) VALUES
('Tech Corp', 25),
('Design Studio', 15),
('Law Firm', 20),
('Marketing Agency', 12),
('Consulting Group', 18);

-- Insert initial parking statistics (only one row should exist)
INSERT INTO public.parking_statistics (spots_available, spots_occupied) VALUES
(100, 75);