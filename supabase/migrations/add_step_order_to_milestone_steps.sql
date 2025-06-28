-- Add an order column to the milestone_steps table
ALTER TABLE milestone_steps
ADD COLUMN step_order INTEGER;

-- Optional: Populate existing rows with a default order
-- This is a placeholder; a proper ordering would require manual setting or a more complex script
-- UPDATE milestone_steps SET step_order = id; -- Example: Use ID as initial order (not recommended for all cases)

-- Consider adding a unique constraint on (milestone_id, step_order) if needed
-- ALTER TABLE milestone_steps ADD CONSTRAINT unique_milestone_step_order UNIQUE (milestone_id, step_order); 