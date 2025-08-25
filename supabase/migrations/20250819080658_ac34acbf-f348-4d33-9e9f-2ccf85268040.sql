-- Create rent_payments table
CREATE TABLE public.rent_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL UNIQUE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL,
  month_year_range TEXT NOT NULL, -- Format: "January 2024" or "Jan-Feb 2024"
  amount NUMERIC NOT NULL,
  method TEXT NOT NULL, -- e.g., 'cash', 'bank_transfer', 'check', 'card'
  last_paid_rent_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rent_payments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (similar to other tables)
CREATE POLICY "Allow all operations on rent_payments" 
ON public.rent_payments 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_rent_payments_updated_at
  BEFORE UPDATE ON public.rent_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();