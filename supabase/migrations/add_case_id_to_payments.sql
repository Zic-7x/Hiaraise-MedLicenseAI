-- Add case_id column to payments table
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES cases(id) ON DELETE SET NULL; 