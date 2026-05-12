-- Migration: Remove price column from wedding combo service tables
ALTER TABLE public.wedding_combo_services DROP COLUMN IF EXISTS price;
ALTER TABLE public.wedding_contract_combo_services DROP COLUMN IF EXISTS price;
