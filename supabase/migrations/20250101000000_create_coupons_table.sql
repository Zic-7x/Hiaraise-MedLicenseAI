-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL,
    minimum_amount NUMERIC(10, 2) DEFAULT 0,
    maximum_discount NUMERIC(10, 2),
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    valid_until TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    applicable_packages TEXT[], -- Array of package IDs this coupon applies to
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create coupon_usage table to track which users have used which coupons
CREATE TABLE IF NOT EXISTS coupon_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    discount_amount NUMERIC(10, 2) NOT NULL,
    original_amount NUMERIC(10, 2) NOT NULL,
    final_amount NUMERIC(10, 2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(coupon_id, user_id) -- Prevent multiple uses of same coupon by same user
);

-- Add package_id column to payments table if it doesn't exist
ALTER TABLE payments ADD COLUMN IF NOT EXISTS package_id TEXT;

-- Add coupon_id column to payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL;

-- Add discount_amount column to payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_valid_until ON coupons(valid_until);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON coupon_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_coupon_id ON payments(coupon_id);

-- Add RLS policies
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view active coupons
CREATE POLICY "Users can view active coupons"
    ON coupons
    FOR SELECT
    USING (is_active = true);

-- Allow admins to manage all coupons
CREATE POLICY "Admins can manage all coupons"
    ON coupons
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Allow users to view their own coupon usage
CREATE POLICY "Users can view their own coupon usage"
    ON coupon_usage
    FOR SELECT
    USING (user_id = auth.uid());

-- Allow users to insert their own coupon usage
CREATE POLICY "Users can insert their own coupon usage"
    ON coupon_usage
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Allow admins to view all coupon usage
CREATE POLICY "Admins can view all coupon usage"
    ON coupon_usage
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Add trigger to update updated_at timestamp for coupons
CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to validate coupon
CREATE OR REPLACE FUNCTION validate_coupon(
    coupon_code TEXT,
    user_id UUID,
    package_id TEXT,
    amount NUMERIC(10, 2)
)
RETURNS TABLE(
    is_valid BOOLEAN,
    discount_amount NUMERIC(10, 2),
    error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    coupon_record coupons%ROWTYPE;
    usage_count INTEGER;
    discount_calc NUMERIC(10, 2);
BEGIN
    -- Get coupon details
    SELECT * INTO coupon_record
    FROM coupons
    WHERE code = coupon_code AND is_active = true;
    
    -- Check if coupon exists
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 0::NUMERIC(10, 2), 'Invalid coupon code'::TEXT;
        RETURN;
    END IF;
    
    -- Check if coupon is expired
    IF coupon_record.valid_until IS NOT NULL AND coupon_record.valid_until < NOW() THEN
        RETURN QUERY SELECT false, 0::NUMERIC(10, 2), 'Coupon has expired'::TEXT;
        RETURN;
    END IF;
    
    -- Check if coupon is not yet valid
    IF coupon_record.valid_from > NOW() THEN
        RETURN QUERY SELECT false, 0::NUMERIC(10, 2), 'Coupon is not yet valid'::TEXT;
        RETURN;
    END IF;
    
    -- Check if coupon has reached usage limit
    IF coupon_record.usage_limit IS NOT NULL AND coupon_record.used_count >= coupon_record.usage_limit THEN
        RETURN QUERY SELECT false, 0::NUMERIC(10, 2), 'Coupon usage limit reached'::TEXT;
        RETURN;
    END IF;
    
    -- Check if user has already used this coupon
    SELECT COUNT(*) INTO usage_count
    FROM coupon_usage
    WHERE coupon_id = coupon_record.id AND user_id = $2;
    
    IF usage_count > 0 THEN
        RETURN QUERY SELECT false, 0::NUMERIC(10, 2), 'You have already used this coupon'::TEXT;
        RETURN;
    END IF;
    
    -- Check if coupon applies to this package
    IF coupon_record.applicable_packages IS NOT NULL AND 
       NOT (package_id = ANY(coupon_record.applicable_packages)) THEN
        RETURN QUERY SELECT false, 0::NUMERIC(10, 2), 'Coupon does not apply to this package'::TEXT;
        RETURN;
    END IF;
    
    -- Check minimum amount requirement
    IF amount < coupon_record.minimum_amount THEN
        RETURN QUERY SELECT false, 0::NUMERIC(10, 2), 
            'Minimum amount required: PKR ' || coupon_record.minimum_amount::TEXT;
        RETURN;
    END IF;
    
    -- Calculate discount amount
    IF coupon_record.discount_type = 'percentage' THEN
        discount_calc := amount * (coupon_record.discount_value / 100);
    ELSE
        discount_calc := coupon_record.discount_value;
    END IF;
    
    -- Apply maximum discount limit if set
    IF coupon_record.maximum_discount IS NOT NULL AND discount_calc > coupon_record.maximum_discount THEN
        discount_calc := coupon_record.maximum_discount;
    END IF;
    
    -- Ensure discount doesn't exceed amount
    IF discount_calc > amount THEN
        discount_calc := amount;
    END IF;
    
    RETURN QUERY SELECT true, discount_calc, ''::TEXT;
END;
$$;

-- Add comments
COMMENT ON TABLE coupons IS 'Stores promotion coupons and their rules';
COMMENT ON TABLE coupon_usage IS 'Tracks coupon usage by users';
COMMENT ON COLUMN coupons.applicable_packages IS 'Array of package IDs this coupon applies to. NULL means all packages.';
COMMENT ON COLUMN payments.coupon_id IS 'Reference to the coupon used for this payment';
COMMENT ON COLUMN payments.discount_amount IS 'Amount of discount applied to this payment'; 