-- Create maintenance_repairs table with all required columns
CREATE TABLE public.maintenance_repairs (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    date_reported date NOT NULL DEFAULT CURRENT_DATE,
    floor text NOT NULL,
    issue_reporter text NOT NULL,
    issue_type text NOT NULL,
    material_affected text NOT NULL,
    description text NOT NULL,
    assigned_vendor text,
    cost numeric DEFAULT 0,
    status text NOT NULL DEFAULT 'Reported',
    completion_date date,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.maintenance_repairs ENABLE ROW LEVEL SECURITY;

-- Create policy for all operations
CREATE POLICY "Allow all operations on maintenance_repairs" 
ON public.maintenance_repairs 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_maintenance_repairs_updated_at
BEFORE UPDATE ON public.maintenance_repairs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-set completion_date when status is 'Completed'
CREATE OR REPLACE FUNCTION public.set_completion_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
        NEW.completion_date = CURRENT_DATE;
    ELSIF NEW.status != 'Completed' THEN
        NEW.completion_date = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto completion date
CREATE TRIGGER auto_set_completion_date
BEFORE UPDATE ON public.maintenance_repairs
FOR EACH ROW
EXECUTE FUNCTION public.set_completion_date();