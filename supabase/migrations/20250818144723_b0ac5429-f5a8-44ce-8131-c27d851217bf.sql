-- Create lease_agreements table
CREATE TABLE public.lease_agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  lease_start DATE NOT NULL,
  lease_end DATE NOT NULL,
  monthly_rent NUMERIC NOT NULL,
  terms_summary TEXT,
  contract_file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lease_agreements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on lease_agreements" 
ON public.lease_agreements 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create storage bucket for contracts
INSERT INTO storage.buckets (id, name, public) VALUES ('contracts', 'contracts', false);

-- Create storage policies for contracts
CREATE POLICY "Users can view contract files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'contracts');

CREATE POLICY "Users can upload contract files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'contracts');

CREATE POLICY "Users can update contract files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'contracts');

CREATE POLICY "Users can delete contract files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'contracts');

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_lease_agreements_updated_at
BEFORE UPDATE ON public.lease_agreements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample lease agreements based on existing tenants
INSERT INTO public.lease_agreements (tenant_id, lease_start, lease_end, monthly_rent, terms_summary, contract_file_path)
SELECT 
  t.id,
  t.registration_date,
  t.registration_date + INTERVAL '1 year',
  t.monthly_rent,
  CASE 
    WHEN t.business_type = 'Technology' THEN 'Standard commercial lease with technology equipment provisions. Includes utilities, internet infrastructure, and 24/7 access.'
    WHEN t.business_type = 'Retail' THEN 'Retail lease agreement with display window rights, customer parking, and extended business hours provisions.'
    WHEN t.business_type = 'Professional Services' THEN 'Professional office lease with meeting room access, reception services, and client parking allocation.'
    WHEN t.business_type = 'Healthcare' THEN 'Medical office lease with specialized ventilation, patient privacy compliance, and medical waste disposal.'
    WHEN t.business_type = 'Food & Beverage' THEN 'Commercial kitchen lease with health department compliance, grease trap maintenance, and equipment specifications.'
    WHEN t.business_type = 'Manufacturing' THEN 'Industrial lease with heavy machinery allowance, loading dock access, and safety compliance requirements.'
    WHEN t.business_type = 'Creative' THEN 'Creative space lease with flexible layout options, sound insulation, and equipment storage provisions.'
    ELSE 'Standard commercial lease agreement with basic utilities and standard business hour access.'
  END,
  'contracts/' || t.id::text || '_lease_agreement.pdf'
FROM public.tenants t
WHERE t.status = 'active';