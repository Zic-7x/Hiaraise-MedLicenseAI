-- Create milestone_steps table
CREATE TABLE IF NOT EXISTS milestone_steps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_milestone_steps_milestone_id ON milestone_steps(milestone_id);
CREATE INDEX IF NOT EXISTS idx_milestone_steps_status ON milestone_steps(status);

-- Add RLS policies
ALTER TABLE milestone_steps ENABLE ROW LEVEL SECURITY;

-- Allow users to view milestone steps for their own cases
CREATE POLICY "Users can view their own milestone steps"
    ON milestone_steps
    FOR SELECT
    USING (
        milestone_id IN (
            SELECT id FROM milestones WHERE case_id IN (
                SELECT id FROM cases WHERE user_id = auth.uid()
            )
        )
    );

-- Allow admins to manage all milestone steps
CREATE POLICY "Admins can manage all milestone steps"
    ON milestone_steps
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_milestone_steps_updated_at
    BEFORE UPDATE ON milestone_steps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment to explain the table
COMMENT ON TABLE milestone_steps IS 'Stores individual steps within each case milestone'; 