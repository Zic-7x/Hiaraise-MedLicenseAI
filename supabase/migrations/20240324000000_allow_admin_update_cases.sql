    -- Add RLS policy for admins to update cases table
    CREATE POLICY "Admins can update cases"
        ON cases
        FOR UPDATE
        USING (
            EXISTS (
                SELECT 1 FROM profiles
                WHERE id = auth.uid()
                AND role = 'admin'
            )
        ); 