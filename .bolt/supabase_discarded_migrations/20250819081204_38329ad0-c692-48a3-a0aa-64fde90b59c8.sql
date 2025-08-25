-- Insert sample rent payment data using existing tenant IDs
INSERT INTO public.rent_payments (transaction_id, tenant_id, payment_date, month_year_range, amount, method, last_paid_rent_date) VALUES
  ('TXN-2024-001', '1d57b50d-f6d3-4981-bf66-04316336c66c', '2024-08-01', 'August 2024', 5200.00, 'bank_transfer', '2024-07-31'),
  ('TXN-2024-002', 'f37bc614-33a0-46a8-88d4-b3612d6cd05d', '2024-08-03', 'August 2024', 3800.00, 'check', '2024-07-28'),
  ('TXN-2024-003', 'baa76c6a-5da6-4c28-a750-c9d749ff618f', '2024-07-28', 'August 2024', 6500.00, 'card', '2024-06-30'),
  ('TXN-2024-004', '326dd7a5-e02f-458c-a138-3e5f0ef8f0a9', '2024-08-05', 'August 2024', 2900.00, 'bank_transfer', '2024-07-30'),
  ('TXN-2024-005', '7df19c77-c8a6-43a6-bd49-330298b77905', '2024-08-02', 'August 2024', 8500.00, 'bank_transfer', '2024-07-29'),
  ('TXN-2024-006', '7e609de3-451f-4ca4-8604-3103e4166758', '2024-08-04', 'August 2024', 4200.00, 'cash', '2024-07-31'),
  ('TXN-2024-007', '22fb5dc3-0aea-48ba-ae4b-a9048113fabf', '2024-07-30', 'August 2024', 3600.00, 'card', '2024-06-28'),
  ('TXN-2024-008', '0c373112-dbec-47b6-a575-bacc6a85d241', '2024-08-06', 'August 2024', 2200.00, 'bank_transfer', '2024-07-27'),
  
  -- July payments
  ('TXN-2024-009', '1d57b50d-f6d3-4981-bf66-04316336c66c', '2024-07-01', 'July 2024', 5200.00, 'bank_transfer', '2024-06-30'),
  ('TXN-2024-010', 'f37bc614-33a0-46a8-88d4-b3612d6cd05d', '2024-07-05', 'July 2024', 3800.00, 'check', '2024-06-28'),
  ('TXN-2024-011', 'baa76c6a-5da6-4c28-a750-c9d749ff618f', '2024-06-29', 'July 2024', 6500.00, 'bank_transfer', '2024-05-31'),
  ('TXN-2024-012', '326dd7a5-e02f-458c-a138-3e5f0ef8f0a9', '2024-07-02', 'July 2024', 2900.00, 'cash', '2024-06-29'),
  
  -- Some multi-month payments
  ('TXN-2024-013', '7df19c77-c8a6-43a6-bd49-330298b77905', '2024-06-28', 'June-July 2024', 17000.00, 'bank_transfer', '2024-05-30'),
  ('TXN-2024-014', '7e609de3-451f-4ca4-8604-3103e4166758', '2024-06-30', 'June-July 2024', 8400.00, 'card', '2024-05-28'),
  ('TXN-2024-015', '22fb5dc3-0aea-48ba-ae4b-a9048113fabf', '2024-07-15', 'July-August 2024', 7200.00, 'bank_transfer', '2024-06-30');