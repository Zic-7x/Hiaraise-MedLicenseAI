-- Migration: Add admin_message column to exam_bookings table
-- This adds the missing admin_message column for admin communication

-- Add admin_message column to exam_bookings table
ALTER TABLE public.exam_bookings 
ADD COLUMN IF NOT EXISTS admin_message TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN public.exam_bookings.admin_message IS 'Admin message for the candidate regarding their exam booking';
