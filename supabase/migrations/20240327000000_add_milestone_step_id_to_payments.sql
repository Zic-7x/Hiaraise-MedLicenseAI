-- Add milestone_step_id column to payments table
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS milestone_step_id UUID REFERENCES milestone_steps(id) ON DELETE SET NULL;

-- Add comment to explain the new column
COMMENT ON COLUMN payments.milestone_step_id IS 'Links payment to a specific milestone step if applicable'; 