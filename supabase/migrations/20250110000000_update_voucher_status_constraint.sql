-- Migration: Update voucher_purchases status constraint to include 'pending' and 'approved'
-- This allows vouchers to have pending status before admin approval and approved status after

-- 1. Drop the existing check constraint
ALTER TABLE public.voucher_purchases 
DROP CONSTRAINT IF EXISTS voucher_purchases_status_check;

-- 2. Add the new check constraint with additional status values
ALTER TABLE public.voucher_purchases 
ADD CONSTRAINT voucher_purchases_status_check 
CHECK (status IN ('pending', 'purchased', 'approved', 'used', 'expired', 'cancelled'));

-- 3. Update the voucher slot capacity function to handle new statuses
CREATE OR REPLACE FUNCTION update_voucher_slot_capacity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Only increment current_bookings when voucher status is 'purchased' or 'approved'
    IF NEW.status IN ('purchased', 'approved') THEN
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
    -- Handle status changes
    IF OLD.status != NEW.status THEN
      IF NEW.status IN ('purchased', 'approved') AND OLD.status NOT IN ('purchased', 'approved') THEN
        -- Voucher was approved/purchased - increment bookings
        UPDATE public.voucher_slots 
        SET current_bookings = current_bookings + 1,
            is_available = CASE 
              WHEN current_bookings + 1 >= max_capacity THEN false 
              ELSE true 
            END,
            updated_at = now()
        WHERE id = NEW.slot_id;
      ELSIF NEW.status IN ('cancelled', 'expired') AND OLD.status IN ('purchased', 'approved') THEN
        -- Voucher was cancelled or expired after being purchased/approved - decrement bookings
        UPDATE public.voucher_slots 
        SET current_bookings = GREATEST(current_bookings - 1, 0),
            is_available = true,
            updated_at = now()
        WHERE id = NEW.slot_id;
      END IF;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Only decrement if the deleted voucher was purchased or approved
    IF OLD.status IN ('purchased', 'approved') THEN
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

-- 4. Update the expiration function to handle new statuses
CREATE OR REPLACE FUNCTION expire_vouchers_on_exam_date()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Mark vouchers as expired if exam date has passed
  UPDATE public.voucher_purchases 
  SET status = 'expired',
      updated_at = now()
  WHERE status IN ('pending', 'purchased', 'approved')
    AND expires_at < NOW();
END;
$$;

-- 5. Recreate the trigger to use the updated function
DROP TRIGGER IF EXISTS update_voucher_slot_capacity_trigger ON public.voucher_purchases;
CREATE TRIGGER update_voucher_slot_capacity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.voucher_purchases
  FOR EACH ROW EXECUTE FUNCTION update_voucher_slot_capacity();

-- 6. Add comments for documentation
COMMENT ON CONSTRAINT voucher_purchases_status_check ON public.voucher_purchases IS 'Allows status values: pending, purchased, approved, used, expired, cancelled';
COMMENT ON FUNCTION update_voucher_slot_capacity() IS 'Updates voucher slot capacity for purchased and approved vouchers';
COMMENT ON FUNCTION expire_vouchers_on_exam_date() IS 'Automatically expires vouchers when exam date passes, including pending and approved statuses';
