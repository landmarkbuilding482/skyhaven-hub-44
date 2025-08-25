-- Create asset_inventory table
CREATE TABLE public.asset_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id TEXT NOT NULL DEFAULT ('A-' || lpad((floor((random() * 999999) + 1))::text, 6, '0')),
  asset_name TEXT NOT NULL,
  category TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  condition TEXT NOT NULL DEFAULT 'Good',
  last_maintenance DATE,
  next_maintenance DATE,
  warranty_month INTEGER,
  warranty_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.asset_inventory ENABLE ROW LEVEL SECURITY;

-- Create policies for asset_inventory
CREATE POLICY "Allow all operations on asset_inventory" 
ON public.asset_inventory 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_asset_inventory_updated_at
BEFORE UPDATE ON public.asset_inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();