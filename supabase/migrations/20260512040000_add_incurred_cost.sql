-- Migration: Add incurred cost and reason to contracts and wedding_contracts

ALTER TABLE public.contracts
ADD COLUMN IF NOT EXISTS incurred_cost NUMERIC NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS incurred_cost_reason TEXT;

ALTER TABLE public.wedding_contracts
ADD COLUMN IF NOT EXISTS incurred_cost NUMERIC NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS incurred_cost_reason TEXT;
