-- Migration: Create exam bookings system for voucher submission and exam pass management
-- This creates the complete system for users to submit vouchers and receive exam passes

-- 1. Create exam_bookings table for submitted vouchers
CREATE TABLE IF NOT EXISTS public.exam_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_purchase_id UUID REFERENCES public.voucher_purchases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  
  -- Terms and conditions acceptance
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  terms_accepted_at TIMESTAMPTZ,
  
  -- Location information
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  
  -- Profile information (as required for exam)
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  street_address_line_1 TEXT NOT NULL,
  street_address_line_2 TEXT,
  city_address TEXT NOT NULL,
  country TEXT NOT NULL,
  state_province TEXT,
  postal_code_address TEXT NOT NULL,
  email_address TEXT NOT NULL,
  validate_email TEXT NOT NULL,
  work_day_phone TEXT,
  home_evening_phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  government_id TEXT NOT NULL,
  government_id_issuing_country TEXT NOT NULL,
  
  -- Exam details from voucher
  exam_authority TEXT NOT NULL,
  exam_date DATE NOT NULL,
  exam_start_time TIME NOT NULL,
  exam_end_time TIME NOT NULL,
  exam_fee NUMERIC(10, 2) NOT NULL,
  
  -- Booking status
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'exam_pass_issued', 'completed', 'cancelled')),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ,
  exam_pass_issued_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Exam pass document
  exam_pass_document_url TEXT,
  exam_pass_document_name TEXT,
  
  -- Additional information
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create exam_passes table for issued exam passes
CREATE TABLE IF NOT EXISTS public.exam_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_booking_id UUID REFERENCES public.exam_bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  
  -- Exam pass details
  pass_number TEXT UNIQUE NOT NULL,
  exam_authority TEXT NOT NULL,
  exam_date DATE NOT NULL,
  exam_start_time TIME NOT NULL,
  exam_end_time TIME NOT NULL,
  
  -- Candidate information
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  candidate_phone TEXT NOT NULL,
  
  -- Document information
  document_url TEXT NOT NULL,
  document_name TEXT NOT NULL,
  document_size INTEGER,
  document_type TEXT NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'issued' CHECK (status IN ('issued', 'downloaded', 'expired')),
  issued_at TIMESTAMPTZ DEFAULT now(),
  downloaded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Additional information
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_exam_bookings_user_id ON public.exam_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_bookings_voucher_purchase_id ON public.exam_bookings(voucher_purchase_id);
CREATE INDEX IF NOT EXISTS idx_exam_bookings_status ON public.exam_bookings(status);
CREATE INDEX IF NOT EXISTS idx_exam_bookings_exam_date ON public.exam_bookings(exam_date);
CREATE INDEX IF NOT EXISTS idx_exam_bookings_exam_authority ON public.exam_bookings(exam_authority);

CREATE INDEX IF NOT EXISTS idx_exam_passes_user_id ON public.exam_passes(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_passes_exam_booking_id ON public.exam_passes(exam_booking_id);
CREATE INDEX IF NOT EXISTS idx_exam_passes_status ON public.exam_passes(status);
CREATE INDEX IF NOT EXISTS idx_exam_passes_exam_date ON public.exam_passes(exam_date);
CREATE INDEX IF NOT EXISTS idx_exam_passes_pass_number ON public.exam_passes(pass_number);

-- 4. Create function to generate unique exam pass numbers
CREATE OR REPLACE FUNCTION generate_exam_pass_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  pass_number TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 12-character alphanumeric code
    pass_number := upper(substring(md5(random()::text) from 1 for 12));
    
    -- Check if pass number already exists
    SELECT EXISTS(SELECT 1 FROM public.exam_passes WHERE pass_number = pass_number) INTO exists;
    
    -- If pass number doesn't exist, return it
    IF NOT exists THEN
      RETURN pass_number;
    END IF;
  END LOOP;
END;
$$;

-- 5. Create function to update exam booking status
CREATE OR REPLACE FUNCTION update_exam_booking_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update updated_at timestamp
  NEW.updated_at = now();
  
  -- Set timestamps based on status changes
  IF OLD.status != NEW.status THEN
    CASE NEW.status
      WHEN 'approved' THEN
        NEW.approved_at = now();
      WHEN 'exam_pass_issued' THEN
        NEW.exam_pass_issued_at = now();
      WHEN 'completed' THEN
        NEW.completed_at = now();
    END CASE;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 6. Create function to update exam pass status
CREATE OR REPLACE FUNCTION update_exam_pass_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update updated_at timestamp
  NEW.updated_at = now();
  
  -- Set timestamps based on status changes
  IF OLD.status != NEW.status THEN
    CASE NEW.status
      WHEN 'downloaded' THEN
        NEW.downloaded_at = now();
    END CASE;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 7. Create triggers
CREATE TRIGGER update_exam_booking_status_trigger
  BEFORE UPDATE ON public.exam_bookings
  FOR EACH ROW EXECUTE FUNCTION update_exam_booking_status();

CREATE TRIGGER update_exam_pass_status_trigger
  BEFORE UPDATE ON public.exam_passes
  FOR EACH ROW EXECUTE FUNCTION update_exam_pass_status();

-- 8. Enable RLS
ALTER TABLE public.exam_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_passes ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies for exam_bookings
-- Users can view their own exam bookings
CREATE POLICY "Users can view their own exam bookings" ON public.exam_bookings
  FOR SELECT USING (user_id = auth.uid());

-- Users can create exam bookings
CREATE POLICY "Users can create exam bookings" ON public.exam_bookings
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own exam bookings
CREATE POLICY "Users can update their own exam bookings" ON public.exam_bookings
  FOR UPDATE USING (user_id = auth.uid());

-- Admins can manage all exam bookings
CREATE POLICY "Admins can manage all exam bookings" ON public.exam_bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 10. Create RLS policies for exam_passes
-- Users can view their own exam passes
CREATE POLICY "Users can view their own exam passes" ON public.exam_passes
  FOR SELECT USING (user_id = auth.uid());

-- Users can update their own exam passes (for download tracking)
CREATE POLICY "Users can update their own exam passes" ON public.exam_passes
  FOR UPDATE USING (user_id = auth.uid());

-- Admins can manage all exam passes
CREATE POLICY "Admins can manage all exam passes" ON public.exam_passes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 11. Create view for exam booking summary
CREATE OR REPLACE VIEW exam_booking_summary AS
SELECT 
  eb.id,
  eb.user_id,
  eb.status,
  eb.exam_authority,
  eb.exam_date,
  eb.exam_start_time,
  eb.exam_end_time,
  eb.exam_fee,
  eb.submitted_at,
  eb.approved_at,
  eb.exam_pass_issued_at,
  eb.completed_at,
  eb.exam_pass_document_url,
  eb.exam_pass_document_name,
  vp.voucher_code,
  vp.final_price_at_purchase,
  p.full_name,
  p.email
FROM public.exam_bookings eb
LEFT JOIN public.voucher_purchases vp ON eb.voucher_purchase_id = vp.id
LEFT JOIN public.profiles p ON eb.user_id = p.id;

-- 12. Create view for exam pass summary
CREATE OR REPLACE VIEW exam_pass_summary AS
SELECT 
  ep.id,
  ep.user_id,
  ep.pass_number,
  ep.exam_authority,
  ep.exam_date,
  ep.exam_start_time,
  ep.exam_end_time,
  ep.candidate_name,
  ep.candidate_email,
  ep.candidate_phone,
  ep.document_url,
  ep.document_name,
  ep.status,
  ep.issued_at,
  ep.downloaded_at,
  ep.expires_at,
  eb.id as exam_booking_id,
  vp.voucher_code
FROM public.exam_passes ep
LEFT JOIN public.exam_bookings eb ON ep.exam_booking_id = eb.id
LEFT JOIN public.voucher_purchases vp ON eb.voucher_purchase_id = vp.id;

-- 13. Grant permissions
GRANT SELECT ON exam_booking_summary TO authenticated;
GRANT SELECT ON exam_pass_summary TO authenticated;

-- 14. Add comments for documentation
COMMENT ON TABLE public.exam_bookings IS 'Exam bookings created from voucher submissions';
COMMENT ON TABLE public.exam_passes IS 'Issued exam passes for approved bookings';
COMMENT ON COLUMN public.exam_bookings.terms_accepted IS 'Whether user accepted terms and conditions';
COMMENT ON COLUMN public.exam_bookings.city IS 'City for exam location';
COMMENT ON COLUMN public.exam_bookings.postal_code IS 'Postal code for exam location';
COMMENT ON COLUMN public.exam_bookings.exam_pass_document_url IS 'URL to the generated exam pass document';
COMMENT ON COLUMN public.exam_passes.pass_number IS 'Unique exam pass number';
COMMENT ON COLUMN public.exam_passes.document_url IS 'URL to the exam pass document';
COMMENT ON COLUMN public.exam_passes.expires_at IS 'When the exam pass expires';
