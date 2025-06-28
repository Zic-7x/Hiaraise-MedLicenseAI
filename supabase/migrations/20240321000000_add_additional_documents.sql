-- Create additional_documents table
CREATE TABLE IF NOT EXISTS additional_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    step TEXT NOT NULL,
    documents JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_id UUID REFERENCES payments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_additional_documents_case_id ON additional_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_additional_documents_status ON additional_documents(status);
CREATE INDEX IF NOT EXISTS idx_additional_documents_documents ON additional_documents USING gin (documents);

-- Add RLS policies
ALTER TABLE additional_documents ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own additional documents
CREATE POLICY "Users can view their own additional documents"
    ON additional_documents
    FOR SELECT
    USING (
        case_id IN (
            SELECT id FROM cases WHERE user_id = auth.uid()
        )
    );

-- Allow users to insert their own additional documents
CREATE POLICY "Users can insert their own additional documents"
    ON additional_documents
    FOR INSERT
    WITH CHECK (
        case_id IN (
            SELECT id FROM cases WHERE user_id = auth.uid()
        )
    );

-- Allow admins to update additional documents
CREATE POLICY "Admins can update additional documents"
    ON additional_documents
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_additional_documents_updated_at
    BEFORE UPDATE ON additional_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 