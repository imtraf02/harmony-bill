-- Add discount column to contracts table
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS discount NUMERIC NOT NULL DEFAULT 0;
