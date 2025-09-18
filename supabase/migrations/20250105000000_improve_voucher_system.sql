-- Migration: Improve voucher system for flexible pricing and lifetime validity
-- This updates the existing voucher system to support:
-- 1. Flexible pricing without fixed exam costs
-- 2. Specific exam types (DHA, MOHAP, DOH, QCHP, SCFHS)
-- 3. Lifetime validity until slots expire
-- 4. Dynamic pricing based on current rates

-- 1. Update voucher_slots table to support flexible pricing and exam types
ALTER TABLE public.voucher_slots 
ADD COLUMN IF NOT EXISTS exam_authority TEXT NOT NULL DEFAULT 'prometric' CHECK (exam_authority IN ('DHA', 'MOHAP', 'DOH', 'QCHP', 'SCFHS', 'prometric')),
ADD COLUMN IF NOT EXISTS final_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_lifetime_valid BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS slot_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS exam_description TEXT,
ADD COLUMN IF NOT EXISTS booking_timer_minutes INTEGER DEFAULT NULL;

-- 2. Update voucher_purchases table to support new pricing model
ALTER TABLE public.voucher_purchases 
ADD COLUMN IF NOT EXISTS exam_authority TEXT NOT NULL DEFAULT 'prometric',
ADD COLUMN IF NOT EXISTS final_price_at_purchase NUMERIC(10, 2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_lifetime_valid BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS slot_expires_at TIMESTAMPTZ;

-- 3. Update existing columns to reflect new pricing model
-- Remove the old discount-based pricing columns and replace with simplified pricing
ALTER TABLE public.voucher_slots 
DROP COLUMN IF EXISTS original_price,
DROP COLUMN IF EXISTS discount_price,
DROP COLUMN IF EXISTS discount_percentage,
DROP COLUMN IF EXISTS current_market_price,
DROP COLUMN IF EXISTS our_charge_amount,
DROP COLUMN IF EXISTS price_range_min,
DROP COLUMN IF EXISTS price_range_max,
DROP COLUMN IF EXISTS base_exam_cost,
DROP COLUMN IF EXISTS our_service_fee,
DROP COLUMN IF EXISTS total_charge_amount;

ALTER TABLE public.voucher_purchases 
DROP COLUMN IF EXISTS original_price,
DROP COLUMN IF EXISTS discount_amount,
DROP COLUMN IF EXISTS final_price,
DROP COLUMN IF EXISTS market_price_at_purchase,
DROP COLUMN IF EXISTS our_charge_at_purchase,
DROP COLUMN IF EXISTS base_exam_cost,
DROP COLUMN IF EXISTS our_service_fee,
DROP COLUMN IF EXISTS total_charge_amount;

-- 4. Create function to get suggested final price for exam authority
CREATE OR REPLACE FUNCTION get_suggested_final_price(exam_auth TEXT)
RETURNS NUMERIC(10, 2)
LANGUAGE plpgsql
AS $$
DECLARE
  suggested_price NUMERIC(10, 2);
BEGIN
  -- Set suggested final prices for different exam authorities (in USD)
  CASE exam_auth
    WHEN 'DHA' THEN suggested_price := 280.00;  -- DHA exam final price
    WHEN 'MOHAP' THEN suggested_price := 260.00;  -- MOHAP exam final price
    WHEN 'DOH' THEN suggested_price := 290.00;   -- DOH exam final price
    WHEN 'QCHP' THEN suggested_price := 310.00;  -- QCHP exam final price
    WHEN 'SCFHS' THEN suggested_price := 320.00; -- SCFHS exam final price
    ELSE suggested_price := 250.00;  -- Default for prometric
  END CASE;
  
  RETURN suggested_price;
END;
$$;

-- 5. Create function to update voucher slot with final price
CREATE OR REPLACE FUNCTION update_voucher_slot_final_price()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Set final price if not provided
  IF NEW.final_price = 0 OR NEW.final_price IS NULL THEN
    NEW.final_price := get_suggested_final_price(NEW.exam_authority);
  END IF;
  
  -- Set lifetime validity and expiration
  NEW.is_lifetime_valid := true;
  NEW.slot_expires_at := NEW.exam_date + INTERVAL '1 year';
  
  -- Booking timer is now optional - no default value set
  
  RETURN NEW;
END;
$$;

-- 6. Create trigger to automatically update final price
DROP TRIGGER IF EXISTS update_voucher_slot_final_price_trigger ON public.voucher_slots;
CREATE TRIGGER update_voucher_slot_final_price_trigger
  BEFORE INSERT OR UPDATE ON public.voucher_slots
  FOR EACH ROW EXECUTE FUNCTION update_voucher_slot_final_price();

-- 8. Create function to validate voucher lifetime
CREATE OR REPLACE FUNCTION validate_voucher_lifetime()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if voucher is still valid (lifetime until slot expires)
  IF NEW.is_lifetime_valid AND NEW.slot_expires_at IS NOT NULL THEN
    IF NEW.slot_expires_at < NOW() THEN
      -- Mark voucher as expired if slot has expired
      NEW.status := 'expired';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 9. Create trigger to validate voucher lifetime
DROP TRIGGER IF EXISTS validate_voucher_lifetime_trigger ON public.voucher_purchases;
CREATE TRIGGER validate_voucher_lifetime_trigger
  BEFORE UPDATE ON public.voucher_purchases
  FOR EACH ROW EXECUTE FUNCTION validate_voucher_lifetime();

-- 9. Update voucher purchase function to use simplified pricing model
CREATE OR REPLACE FUNCTION create_voucher_purchase_with_final_price()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  slot_record public.voucher_slots%ROWTYPE;
BEGIN
  -- Get slot information
  SELECT * INTO slot_record FROM public.voucher_slots WHERE id = NEW.slot_id;
  
  -- Set pricing information from slot
  NEW.exam_authority := slot_record.exam_authority;
  NEW.final_price_at_purchase := slot_record.final_price;
  NEW.is_lifetime_valid := slot_record.is_lifetime_valid;
  NEW.slot_expires_at := slot_record.slot_expires_at;
  
  -- Generate voucher code if not provided
  IF NEW.voucher_code IS NULL THEN
    NEW.voucher_code := generate_voucher_code();
  END IF;
  
  RETURN NEW;
END;
$$;

-- 10. Create trigger for voucher purchase final price
DROP TRIGGER IF EXISTS create_voucher_purchase_with_final_price_trigger ON public.voucher_purchases;
CREATE TRIGGER create_voucher_purchase_with_final_price_trigger
  BEFORE INSERT ON public.voucher_purchases
  FOR EACH ROW EXECUTE FUNCTION create_voucher_purchase_with_final_price();

-- 11. Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_voucher_slots_exam_authority ON public.voucher_slots(exam_authority);
CREATE INDEX IF NOT EXISTS idx_voucher_slots_is_lifetime_valid ON public.voucher_slots(is_lifetime_valid);
CREATE INDEX IF NOT EXISTS idx_voucher_slots_slot_expires_at ON public.voucher_slots(slot_expires_at);
CREATE INDEX IF NOT EXISTS idx_voucher_slots_final_price ON public.voucher_slots(final_price);
CREATE INDEX IF NOT EXISTS idx_voucher_purchases_exam_authority ON public.voucher_purchases(exam_authority);
CREATE INDEX IF NOT EXISTS idx_voucher_purchases_is_lifetime_valid ON public.voucher_purchases(is_lifetime_valid);

-- 13. Update RLS policies for new columns
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view available voucher slots" ON public.voucher_slots;
DROP POLICY IF EXISTS "Users can view their own voucher purchases" ON public.voucher_purchases;

-- Create new policies
CREATE POLICY "Users can view available voucher slots" ON public.voucher_slots
  FOR SELECT USING (
    is_available = true AND 
    (slot_expires_at IS NULL OR slot_expires_at > NOW()) AND
    is_lifetime_valid = true
  );

CREATE POLICY "Users can view their own voucher purchases" ON public.voucher_purchases
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (guest_email IS NOT NULL AND guest_email = auth.email())
  );

-- 12. Create view for current voucher pricing
CREATE OR REPLACE VIEW current_voucher_pricing AS
SELECT 
  exam_authority,
  COUNT(*) as available_slots,
  MIN(final_price) as min_price,
  MAX(final_price) as max_price,
  AVG(final_price) as avg_price,
  MIN(slot_expires_at) as earliest_expiry,
  MAX(slot_expires_at) as latest_expiry
FROM public.voucher_slots 
WHERE is_available = true 
  AND is_lifetime_valid = true
  AND (slot_expires_at IS NULL OR slot_expires_at > NOW())
GROUP BY exam_authority;

-- 15. Grant permissions
GRANT SELECT ON current_voucher_pricing TO authenticated;
GRANT SELECT ON current_voucher_pricing TO anon;

-- 13. Add comments for documentation
COMMENT ON COLUMN public.voucher_slots.exam_authority IS 'Exam authority: DHA, MOHAP, DOH, QCHP, SCFHS, or prometric';
COMMENT ON COLUMN public.voucher_slots.final_price IS 'Final price customer pays to book the exam (regardless of actual exam cost)';
COMMENT ON COLUMN public.voucher_slots.is_lifetime_valid IS 'Whether voucher has lifetime validity until slot expires';
COMMENT ON COLUMN public.voucher_slots.slot_expires_at IS 'When this slot expires (lifetime validity ends)';
COMMENT ON COLUMN public.voucher_slots.booking_timer_minutes IS 'Optional timer in minutes for slot booking expiration (NULL = no timer)';

COMMENT ON COLUMN public.voucher_purchases.exam_authority IS 'Exam authority at time of purchase';
COMMENT ON COLUMN public.voucher_purchases.final_price_at_purchase IS 'Final price paid by customer at time of purchase';
COMMENT ON COLUMN public.voucher_purchases.is_lifetime_valid IS 'Whether this voucher has lifetime validity';
COMMENT ON COLUMN public.voucher_purchases.slot_expires_at IS 'When this voucher expires (lifetime validity ends)';
