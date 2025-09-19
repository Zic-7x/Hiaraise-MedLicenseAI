-- Migration: Fix voucher slot availability trigger to only update on 'purchased' status
-- This ensures slots are only marked as unavailable when voucher is actually purchased, not just pending

-- 1. Update the voucher slot capacity function to check status
CREATE OR REPLACE FUNCTION update_voucher_slot_capacity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Only increment current_bookings when voucher status is 'purchased'
    IF NEW.status = 'purchased' THEN
      UPDATE public.voucher_slots 
      SET current_bookings = current_bookings + 1,
          is_available = CASE 
            WHEN current_bookings + 1 >= max_capacity THEN false 
            ELSE true 
          END,
          updated_at = now()
      WHERE id = NEW.slot_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status changes (e.g., from pending to purchased, or cancellation)
    IF OLD.status != NEW.status THEN
      IF NEW.status = 'purchased' AND OLD.status != 'purchased' THEN
        -- Voucher was approved/purchased - increment bookings
        UPDATE public.voucher_slots 
        SET current_bookings = current_bookings + 1,
            is_available = CASE 
              WHEN current_bookings + 1 >= max_capacity THEN false 
              ELSE true 
            END,
            updated_at = now()
        WHERE id = NEW.slot_id;
      ELSIF NEW.status = 'cancelled' AND OLD.status = 'purchased' THEN
        -- Voucher was cancelled after being purchased - decrement bookings
        UPDATE public.voucher_slots 
        SET current_bookings = GREATEST(current_bookings - 1, 0),
            is_available = true,
            updated_at = now()
        WHERE id = NEW.slot_id;
      ELSIF NEW.status = 'expired' AND OLD.status = 'purchased' THEN
        -- Voucher expired after being purchased - decrement bookings
        UPDATE public.voucher_slots 
        SET current_bookings = GREATEST(current_bookings - 1, 0),
            is_available = true,
            updated_at = now()
        WHERE id = NEW.slot_id;
      END IF;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Only decrement if the deleted voucher was purchased
    IF OLD.status = 'purchased' THEN
      UPDATE public.voucher_slots 
      SET current_bookings = GREATEST(current_bookings - 1, 0),
          is_available = true,
          updated_at = now()
      WHERE id = OLD.slot_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- 2. Create function to update voucher validity based on exam date/time instead of lifetime
CREATE OR REPLACE FUNCTION update_voucher_validity_on_exam_date()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update voucher validity to expire at exam date and time instead of lifetime
  IF NEW.slot_id IS NOT NULL THEN
    -- Get the exam date and time from the slot
    SELECT exam_date, end_time INTO NEW.expires_at
    FROM public.voucher_slots 
    WHERE id = NEW.slot_id;
    
    -- Set expires_at to exam date + end time
    NEW.expires_at := NEW.expires_at::date + NEW.expires_at::time;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 3. Create trigger for voucher validity update
DROP TRIGGER IF EXISTS update_voucher_validity_on_exam_date_trigger ON public.voucher_purchases;
CREATE TRIGGER update_voucher_validity_on_exam_date_trigger
  BEFORE INSERT OR UPDATE ON public.voucher_purchases
  FOR EACH ROW EXECUTE FUNCTION update_voucher_validity_on_exam_date();

-- 4. Update existing voucher purchases to use exam date/time instead of lifetime
UPDATE public.voucher_purchases 
SET expires_at = (
  SELECT vs.exam_date::date + vs.end_time::time
  FROM public.voucher_slots vs 
  WHERE vs.id = voucher_purchases.slot_id
)
WHERE slot_id IS NOT NULL;

-- 5. Add function to automatically expire vouchers when exam date passes
CREATE OR REPLACE FUNCTION expire_vouchers_on_exam_date()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Mark vouchers as expired if exam date has passed
  UPDATE public.voucher_purchases 
  SET status = 'expired',
      updated_at = now()
  WHERE status IN ('purchased', 'pending')
    AND expires_at < NOW();
END;
$$;

-- 6. Create a scheduled job to run the expiration function (if using pg_cron extension)
-- This would need to be set up separately in the database
-- SELECT cron.schedule('expire-vouchers', '0 * * * *', 'SELECT expire_vouchers_on_exam_date();');

-- 7. Add index for better performance on expiration queries
CREATE INDEX IF NOT EXISTS idx_voucher_purchases_expires_at ON public.voucher_purchases(expires_at);
CREATE INDEX IF NOT EXISTS idx_voucher_purchases_status_expires_at ON public.voucher_purchases(status, expires_at);

-- 8. Update RLS policy to reflect new validity logic
DROP POLICY IF EXISTS "Users can view their own voucher purchases" ON public.voucher_purchases;
CREATE POLICY "Users can view their own voucher purchases" ON public.voucher_purchases
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (guest_email IS NOT NULL AND guest_email = auth.email())
  );

-- 9. Add comments for documentation
COMMENT ON FUNCTION update_voucher_slot_capacity() IS 'Updates voucher slot capacity only when voucher status is purchased, not pending';
COMMENT ON FUNCTION update_voucher_validity_on_exam_date() IS 'Sets voucher expiration to exam date and time instead of lifetime validity';
COMMENT ON FUNCTION expire_vouchers_on_exam_date() IS 'Automatically expires vouchers when exam date passes';
