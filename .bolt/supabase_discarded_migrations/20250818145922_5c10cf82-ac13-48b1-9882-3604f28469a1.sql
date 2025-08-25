-- Update the contracts bucket to be public for file previews
UPDATE storage.buckets 
SET public = true 
WHERE id = 'contracts';