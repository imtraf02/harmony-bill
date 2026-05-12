-- Migration: Add base_price to wedding_contract_combos
ALTER TABLE public.wedding_contract_combos
ADD COLUMN IF NOT EXISTS base_price NUMERIC NOT NULL DEFAULT 0;
