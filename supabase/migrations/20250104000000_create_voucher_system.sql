-- Migration: Create voucher system for Prometric exam date selection with discount pricing
-- This extends the existing appointment system to support voucher purchases

-- 1. Create voucher_slots table (similar to appointment_slots but for vouchers)
CREATE TABLE IF NOT EXISTS public.voucher_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  original_price NUMERIC(10, 2) NOT NULL,
  discount_price NUMERIC(10, 2) NOT NULL,
  discount_percentage NUMERIC(5, 2) NOT NULL,
  max_capacity INTEGER DEFAULT 1,
  current_bookings INTEGER DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  exam_type TEXT NOT NULL DEFAULT 'prometric', -- prometric, other exam types
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create voucher_purchases table (similar to appointment_bookings but for vouchers)
CREATE TABLE IF NOT EXISTS public.voucher_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID REFERENCES public.voucher_slots(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  voucher_code TEXT UNIQUE NOT NULL, -- Generated voucher code
  original_price NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) NOT NULL,
  final_price NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'purchased' CHECK (status IN ('purchased', 'used', 'expired', 'cancelled')),
  expires_at TIMESTAMPTZ NOT NULL, -- Voucher expiration date
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Add voucher_slot_id column to payments table
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS voucher_slot_id UUID REFERENCES public.voucher_slots(id) ON DELETE SET NULL;

-- 4. Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_voucher_slots_exam_date ON public.voucher_slots(exam_date);
CREATE INDEX IF NOT EXISTS idx_voucher_slots_availability ON public.voucher_slots(is_available);
CREATE INDEX IF NOT EXISTS idx_voucher_slots_exam_type ON public.voucher_slots(exam_type);
CREATE INDEX IF NOT EXISTS idx_voucher_purchases_user_id ON public.voucher_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_voucher_purchases_slot_id ON public.voucher_purchases(slot_id);
CREATE INDEX IF NOT EXISTS idx_voucher_purchases_status ON public.voucher_purchases(status);
CREATE INDEX IF NOT EXISTS idx_voucher_purchases_voucher_code ON public.voucher_purchases(voucher_code);
CREATE INDEX IF NOT EXISTS idx_payments_voucher_slot_id ON public.payments(voucher_slot_id);

-- 5. Create function to generate unique voucher codes
CREATE OR REPLACE FUNCTION generate_voucher_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 8-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.voucher_purchases WHERE voucher_code = code) INTO exists;
    
    -- If code doesn't exist, return it
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

-- 6. Create function to update voucher slot capacity
CREATE OR REPLACE FUNCTION update_voucher_slot_capacity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment current_bookings when a voucher is purchased
    UPDATE public.voucher_slots 
    SET current_bookings = current_bookings + 1,
        is_available = CASE 
          WHEN current_bookings + 1 >= max_capacity THEN false 
          ELSE true 
        END,
        updated_at = now()
    WHERE id = NEW.slot_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status changes (e.g., cancellation)
    IF OLD.status != NEW.status AND NEW.status = 'cancelled' THEN
      -- Decrement current_bookings when voucher is cancelled
      UPDATE public.voucher_slots 
      SET current_bookings = GREATEST(current_bookings - 1, 0),
          is_available = true,
          updated_at = now()
      WHERE id = NEW.slot_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement current_bookings when voucher is deleted
    UPDATE public.voucher_slots 
    SET current_bookings = GREATEST(current_bookings - 1, 0),
        is_available = true,
        updated_at = now()
    WHERE id = OLD.slot_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- 7. Create trigger to automatically update slot capacity
CREATE TRIGGER update_voucher_slot_capacity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.voucher_purchases
  FOR EACH ROW EXECUTE FUNCTION update_voucher_slot_capacity();

-- 8. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_voucher_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 9. Create triggers for updated_at timestamps
CREATE TRIGGER update_voucher_slots_updated_at
  BEFORE UPDATE ON public.voucher_slots
  FOR EACH ROW EXECUTE FUNCTION update_voucher_updated_at();

CREATE TRIGGER update_voucher_purchases_updated_at
  BEFORE UPDATE ON public.voucher_purchases
  FOR EACH ROW EXECUTE FUNCTION update_voucher_updated_at();

-- 10. Enable RLS
ALTER TABLE public.voucher_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voucher_purchases ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies for voucher_slots
-- Anyone can view available voucher slots
CREATE POLICY "Allow read voucher slots to all" ON public.voucher_slots
  FOR SELECT USING (true);

-- Admins can manage voucher slots
CREATE POLICY "Admins manage voucher slots" ON public.voucher_slots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 12. Create RLS policies for voucher_purchases
-- Anyone can purchase vouchers
CREATE POLICY "Anyone can purchase vouchers" ON public.voucher_purchases
  FOR INSERT WITH CHECK (true);

-- Users can view their own voucher purchases
CREATE POLICY "Users can view their own voucher purchases" ON public.voucher_purchases
  FOR SELECT USING (
    (user_id = auth.uid())
    OR (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role = 'admin'
      )
    )
  );

-- Admins can manage all voucher purchases
CREATE POLICY "Admins manage all voucher purchases" ON public.voucher_purchases
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 13. Add comments for documentation
COMMENT ON TABLE public.voucher_slots IS 'Available exam slots with discount pricing for voucher purchases';
COMMENT ON TABLE public.voucher_purchases IS 'Purchased vouchers for exam slots';
COMMENT ON COLUMN public.voucher_slots.original_price IS 'Original price of the exam slot';
COMMENT ON COLUMN public.voucher_slots.discount_price IS 'Discounted price for voucher purchase';
COMMENT ON COLUMN public.voucher_slots.discount_percentage IS 'Percentage discount applied';
COMMENT ON COLUMN public.voucher_slots.max_capacity IS 'Maximum number of vouchers that can be sold for this slot';
COMMENT ON COLUMN public.voucher_slots.current_bookings IS 'Current number of vouchers sold for this slot';
COMMENT ON COLUMN public.voucher_purchases.voucher_code IS 'Unique voucher code for the purchase';
COMMENT ON COLUMN public.voucher_purchases.expires_at IS 'When the voucher expires and becomes invalid';
COMMENT ON COLUMN public.payments.voucher_slot_id IS 'Reference to the voucher slot for this payment';
