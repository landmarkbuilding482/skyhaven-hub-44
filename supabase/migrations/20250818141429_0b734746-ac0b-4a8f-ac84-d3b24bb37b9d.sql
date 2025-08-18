-- Create the tenants table with all required columns
CREATE TABLE public.tenants (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    floor TEXT NOT NULL,
    space_type TEXT NOT NULL,
    business_type TEXT NOT NULL,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    monthly_rent DECIMAL(10,2) NOT NULL,
    phone_number TEXT,
    email TEXT,
    first_payment_date DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Create policies for full access (adjust based on your auth requirements)
CREATE POLICY "Allow all operations on tenants" 
ON public.tenants 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON public.tenants
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();