-- Add additional_charge column to milestone_steps table
ALTER TABLE milestone_steps
ADD COLUMN IF NOT EXISTS additional_charge NUMERIC(10, 2);

-- Add comment to explain the new column
COMMENT ON COLUMN milestone_steps.additional_charge IS 'Additional charge amount required for this step'; 