-- Add RLS policy for admins to insert into notifications table
CREATE POLICY "Admins can insert notifications"
    ON notifications
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    ); 