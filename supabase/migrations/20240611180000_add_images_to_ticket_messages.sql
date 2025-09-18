-- Add images column to ticket_messages for storing image URLs
ALTER TABLE ticket_messages
ADD COLUMN IF NOT EXISTS images text[]; 