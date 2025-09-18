-- Migration: Remove location requirement from voucher_slots table
-- This makes the location column nullable to allow voucher slot creation without location

-- Make location column nullable
ALTER TABLE public.voucher_slots 
ALTER COLUMN location DROP NOT NULL;

-- Add comment to document the change
COMMENT ON COLUMN public.voucher_slots.location IS 'Optional location for the exam slot (nullable)';
