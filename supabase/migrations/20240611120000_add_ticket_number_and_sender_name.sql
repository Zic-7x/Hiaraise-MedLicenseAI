-- Add ticket_number to tickets if not exists
ALTER TABLE tickets
ADD COLUMN IF NOT EXISTS ticket_number text UNIQUE;
 
-- Add sender_name to ticket_messages if not exists
ALTER TABLE ticket_messages
ADD COLUMN IF NOT EXISTS sender_name text; 