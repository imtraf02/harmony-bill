-- Add include_vat column to contracts table
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS include_vat BOOLEAN DEFAULT TRUE;
