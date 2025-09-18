-- Add service_charge column to rent_payments table
ALTER TABLE public.rent_payments 
ADD COLUMN service_charge numeric DEFAULT 0;