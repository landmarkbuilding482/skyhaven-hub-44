-- Update existing rent payment entries to use proper date ranges
UPDATE public.rent_payments SET month_year_range = CASE
  WHEN id IN (SELECT id FROM public.rent_payments WHERE month_year_range = 'August 2024') THEN 'August 2024 - August 2025'
  WHEN id IN (SELECT id FROM public.rent_payments WHERE month_year_range = 'July 2024') THEN 'July 2024 - July 2025'
  WHEN id IN (SELECT id FROM public.rent_payments WHERE month_year_range = 'June-July 2024') THEN 'June 2024 - August 2025'
  WHEN id IN (SELECT id FROM public.rent_payments WHERE month_year_range = 'July-August 2024') THEN 'July 2024 - September 2025'
  ELSE month_year_range
END;