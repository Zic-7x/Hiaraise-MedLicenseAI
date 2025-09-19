-- Update case_type column to support new license-specific values
-- This migration updates the case_type column to allow the new license-specific values
-- instead of just country names

-- First, let's check if there are any existing CHECK constraints on case_type
-- and drop them if they exist
DO $$ 
BEGIN
    -- Drop existing CHECK constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%case_type%' 
        AND table_name = 'cases'
        AND constraint_type = 'CHECK'
    ) THEN
        -- Find and drop the constraint
        EXECUTE (
            SELECT 'ALTER TABLE cases DROP CONSTRAINT ' || constraint_name
            FROM information_schema.table_constraints 
            WHERE constraint_name LIKE '%case_type%' 
            AND table_name = 'cases'
            AND constraint_type = 'CHECK'
            LIMIT 1
        );
    END IF;
END $$;

-- Add new CHECK constraint for the updated license-specific values
ALTER TABLE cases 
ADD CONSTRAINT cases_case_type_check 
CHECK (case_type IN (
    'saudi_scfhs',      -- SCFHS License - Saudi Arabia
    'uae_dha',          -- DHA License - Dubai, UAE  
    'uae_mohap',        -- MOHAP License - UAE
    'qatar_qchp'        -- QCHP License - Qatar
));

-- Update comment to reflect the new structure
COMMENT ON COLUMN cases.case_type IS 'Specific license type being applied for: saudi_scfhs, uae_dha, uae_mohap, or qatar_qchp';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_cases_case_type ON cases(case_type);

-- Optional: If you have existing data with old values, you might want to migrate them
-- This is commented out by default - uncomment and modify if needed
/*
UPDATE cases 
SET case_type = CASE 
    WHEN case_type = 'saudi' THEN 'saudi_scfhs'
    WHEN case_type = 'uae' THEN 'uae_dha'  -- Default UAE to DHA, admin can change if needed
    WHEN case_type = 'qatar' THEN 'qatar_qchp'
    ELSE case_type
END
WHERE case_type IN ('saudi', 'uae', 'qatar');
*/
