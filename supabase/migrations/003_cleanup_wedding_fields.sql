-- Migration to remove unused fields from wedding_contracts table
ALTER TABLE public.wedding_contracts 
DROP COLUMN IF EXISTS groom_name,
DROP COLUMN IF EXISTS bride_name,
DROP COLUMN IF EXISTS wedding_location;
