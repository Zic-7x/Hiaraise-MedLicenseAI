-- Update cases table to use JSONB for documents
ALTER TABLE cases 
DROP COLUMN IF EXISTS documents_url,
ADD COLUMN IF NOT EXISTS documents JSONB;

-- Add comment to explain the documents structure
COMMENT ON COLUMN cases.documents IS 'JSON object containing URLs for all uploaded documents with keys: cnicFront, cnicBack, passport, universityDegree, universityTranscript, additionalDegree, alliedHealthLicense, experienceLetter, additionalExperience';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cases_documents ON cases USING gin (documents); 