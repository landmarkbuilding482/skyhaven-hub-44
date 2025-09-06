-- Create vendor_contractor_contracts table
CREATE TABLE public.vendor_contractor_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT NOT NULL,
  contract_file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor_contractor_activity_logs table
CREATE TABLE public.vendor_contractor_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vendor_contractor_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_contractor_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for contracts table
CREATE POLICY "Allow all operations on vendor_contractor_contracts" 
ON public.vendor_contractor_contracts 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for activity logs table
CREATE POLICY "Allow all operations on vendor_contractor_activity_logs" 
ON public.vendor_contractor_activity_logs 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_vendor_contractor_contracts_updated_at
BEFORE UPDATE ON public.vendor_contractor_contracts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_contractor_activity_logs_updated_at
BEFORE UPDATE ON public.vendor_contractor_activity_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();