-- Migration: Add appointment_slot_id to payments table for appointment payments
ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS appointment_slot_id uuid REFERENCES appointment_slots(id) ON DELETE SET NULL; 