-- Alter cases table to change path column to TEXT[]
ALTER TABLE cases 
ALTER COLUMN path TYPE TEXT[] USING ARRAY[path],
ALTER COLUMN path DROP NOT NULL;

-- Drop the old CHECK constraint if it exists (it might be automatically dropped with type change)
-- If not, you might need to find its name and drop it explicitly:
-- ALTER TABLE cases DROP CONSTRAINT IF EXISTS cases_path_check;

-- Add new CHECK constraint for valid values (optional, but good for data integrity if you want to validate array elements)
-- This example checks if all elements in the array are within the allowed list.
-- You might need to adjust this based on how you want to enforce validation for arrays.
-- For now, let's just remove the single-value check and rely on application logic for combinations.

-- Update comment to reflect the new structure
COMMENT ON COLUMN cases.path IS 'Array of selected licensing paths. Allows multiple for certain types (e.g., document verification, exam booking) and single for others (e.g., complete license process).'; 