-- Create feedback_complaints table
CREATE TABLE public.feedback_complaints (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id TEXT NOT NULL DEFAULT ('FC-' || LPAD(FLOOR(RANDOM() * 10000000000)::TEXT, 10, '0')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    tenant_id UUID REFERENCES public.tenants(id),
    type TEXT NOT NULL CHECK (type IN ('Complaint', 'Feedback', 'Suggestion')),
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Under Review' CHECK (status IN ('In Progress', 'Under Review', 'Closed')),
    assigned_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feedback_complaints ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (since no auth implemented yet)
CREATE POLICY "Allow all operations on feedback_complaints" 
ON public.feedback_complaints 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_feedback_complaints_updated_at
BEFORE UPDATE ON public.feedback_complaints
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on complaint_id
CREATE UNIQUE INDEX idx_feedback_complaints_complaint_id ON public.feedback_complaints(complaint_id);