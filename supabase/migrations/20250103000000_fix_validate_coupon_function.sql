-- Drop the existing validate_coupon function first
DROP FUNCTION IF EXISTS validate_coupon(TEXT, UUID, TEXT, NUMERIC(10, 2));

-- Create the fixed validate_coupon function
CREATE OR REPLACE FUNCTION validate_coupon(
    coupon_code TEXT,
    user_id_param UUID,
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
    WHERE coupon_id = coupon_record.id AND user_id = user_id_param;
    
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