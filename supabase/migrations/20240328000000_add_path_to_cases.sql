-- Add path column to cases table
ALTER TABLE cases 
ADD COLUMN IF NOT EXISTS path TEXT CHECK (path IN ('document_verification_only', 'exam_booking_only', 'health_authority_registration_only', 'complete_license_process', 'choose_best_for_me'));

-- Add comment to explain the path column
COMMENT ON COLUMN cases.path IS 'The selected licensing path: document_verification_only, exam_booking_only, health_authority_registration_only, complete_license_process, or choose_best_for_me';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_cases_path ON cases(path); 