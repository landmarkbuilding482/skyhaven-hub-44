-- Create table for Inspection & Compliance Reports
CREATE TABLE public.inspection_compliance_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inspector text NOT NULL,
  inspection_type text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  rating integer CHECK (rating >= 1 AND rating <= 5),
  report_file_path text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.inspection_compliance_reports ENABLE ROW LEVEL SECURITY;

-- Create policy for all operations
CREATE POLICY "Allow all operations on inspection_compliance_reports"
ON public.inspection_compliance_reports
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_inspection_compliance_reports_updated_at
  BEFORE UPDATE ON public.inspection_compliance_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.inspection_compliance_reports (inspector, inspection_type, date, description, status, rating) VALUES 
('SafetyFirst Inspections', 'Fire Safety Audit', '2024-01-15', 'Comprehensive fire safety inspection including emergency exits, fire extinguishers, alarm systems, and evacuation procedures. All systems meet current fire safety regulations.', 'Completed', 5),
('EnviroCheck Ltd', 'Environmental Assessment', '2024-02-10', 'Environmental impact assessment covering air quality, waste management, and compliance with environmental regulations. Minor recommendations for improvement.', 'Completed', 4),
('SecureAudit Corp', 'Security Risk Assessment', '2024-02-25', 'Complete security vulnerability assessment of building access points, surveillance systems, and security protocols. Identified several areas for enhancement.', 'Completed', 3),
('StructuralSafe Inc', 'Structural Inspection', '2024-03-05', 'Annual structural integrity inspection of building foundation, load-bearing elements, and overall structural safety compliance.', 'In Progress', null),
('ComplianceCheck Pro', 'Regulatory Compliance Review', '2024-03-10', 'Review of all regulatory compliance requirements including building codes, zoning laws, and municipal regulations.', 'Pending', null),
('HealthSafety Solutions', 'Occupational Health & Safety', '2024-03-15', 'Workplace safety assessment covering ergonomics, hazardous materials handling, and employee safety protocols.', 'Scheduled', null);