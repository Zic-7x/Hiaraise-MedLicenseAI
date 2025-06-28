-- Add a policy to allow users to insert payments for their own milestone steps
CREATE POLICY "Allow users to insert payments for their milestone steps"
ON payments FOR INSERT WITH CHECK (
  milestone_step_id IS NOT NULL AND EXISTS (
    SELECT 1
    FROM milestone_steps ms
    JOIN milestones m ON ms.milestone_id = m.id
    JOIN cases c ON m.case_id = c.id
    WHERE ms.id = payments.milestone_step_id AND c.user_id = auth.uid()
  )
); 