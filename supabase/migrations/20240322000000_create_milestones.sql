-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    assigned_to UUID REFERENCES profiles(id),
    notes TEXT,
    required_documents JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_milestones_case_id ON milestones(case_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_assigned_to ON milestones(assigned_to);

-- Add RLS policies
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own case milestones
CREATE POLICY "Users can view their own case milestones"
    ON milestones
    FOR SELECT
    USING (
        case_id IN (
            SELECT id FROM cases WHERE user_id = auth.uid()
        )
    );

-- Allow admins to manage all milestones
CREATE POLICY "Admins can manage all milestones"
    ON milestones
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_milestones_updated_at
    BEFORE UPDATE ON milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment to explain the table
COMMENT ON TABLE milestones IS 'Tracks the progress of each case through various milestones';

-- Add default milestones for new cases
CREATE OR REPLACE FUNCTION create_default_milestones()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert default milestones for new cases
    INSERT INTO milestones (case_id, name, description, status, due_date)
    VALUES 
        (NEW.id, 'Initial Review', 'Initial review of submitted documents', 'pending', NEW.submitted_at + INTERVAL '7 days'),
        (NEW.id, 'Document Verification', 'Verification of all submitted documents', 'pending', NEW.submitted_at + INTERVAL '14 days'),
        (NEW.id, 'License Application', 'Submission of license application', 'pending', NEW.submitted_at + INTERVAL '21 days'),
        (NEW.id, 'Final Approval', 'Final approval from regulatory body', 'pending', NEW.submitted_at + INTERVAL '30 days');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create default milestones for new cases
CREATE TRIGGER create_case_milestones
    AFTER INSERT ON cases
    FOR EACH ROW
    EXECUTE FUNCTION create_default_milestones(); 