-- Create revenue_expenses table
CREATE TABLE public.revenue_expenses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  revenue_expense_id text NOT NULL DEFAULT ('RE-' || lpad((floor((random() * ('10000000000'::bigint)::double precision)))::text, 11, '0'::text)),
  date date NOT NULL DEFAULT CURRENT_DATE,
  type text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.revenue_expenses ENABLE ROW LEVEL SECURITY;

-- Create policy for all operations (since this is admin-only functionality)
CREATE POLICY "Allow all operations on revenue_expenses" 
ON public.revenue_expenses 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_revenue_expenses_updated_at
BEFORE UPDATE ON public.revenue_expenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();