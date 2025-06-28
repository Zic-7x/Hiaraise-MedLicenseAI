-- Add bank_name, account_number, and account_title columns to the payments table
ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS account_number TEXT,
ADD COLUMN IF NOT EXISTS account_title TEXT;

-- Add comments for the new columns
COMMENT ON COLUMN public.payments.bank_name IS 'Name of the bank for the payment.';
COMMENT ON COLUMN public.payments.account_number IS 'Bank account number for the payment.';
COMMENT ON COLUMN public.payments.account_title IS 'Bank account title for the payment.';

-- Refactored function for payment visibility to avoid recursion
CREATE OR REPLACE FUNCTION is_payment_visible_to_user(
  payment_case_id UUID,
  payment_milestone_step_id UUID
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  -- Case-level payment
  SELECT (
    payment_milestone_step_id IS NULL AND payment_case_id IN (
      SELECT id FROM cases WHERE user_id = auth.uid()
    )
  )
  OR
  -- Milestone-level payment
  (
    payment_milestone_step_id IS NOT NULL AND EXISTS (
      SELECT 1
      FROM milestone_steps ms
      JOIN milestones m ON ms.milestone_id = m.id
      JOIN cases c ON m.case_id = c.id
      WHERE ms.id = payment_milestone_step_id AND c.user_id = auth.uid()
    )
  );
$$; 