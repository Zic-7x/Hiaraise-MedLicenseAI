-- Migration to add promotion usage tracking for UserPromotionSection

-- Function to get claimed but unused promotions for a user
CREATE OR REPLACE FUNCTION get_claimed_promotions(user_id UUID)
RETURNS TABLE (
    id UUID,
    code TEXT,
    name TEXT,
    description TEXT,
    discount_type TEXT,
    discount_value DECIMAL,
    minimum_amount DECIMAL,
    maximum_discount DECIMAL,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    usage_limit INTEGER,
    used_count INTEGER,
    is_active BOOLEAN,
    applicable_packages TEXT[],
    show_in_promotion_modal BOOLEAN,
    promotion_modal_title TEXT,
    promotion_modal_description TEXT,
    promotion_modal_image_url TEXT,
    promotion_modal_button_text TEXT,
    promotion_modal_delay_seconds INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.code,
        c.name,
        c.description,
        c.discount_type,
        c.discount_value,
        c.minimum_amount,
        c.maximum_discount,
        c.valid_from,
        c.valid_until,
        c.usage_limit,
        c.used_count,
        c.is_active,
        c.applicable_packages,
        c.show_in_promotion_modal,
        c.promotion_modal_title,
        c.promotion_modal_description,
        c.promotion_modal_image_url,
        c.promotion_modal_button_text,
        c.promotion_modal_delay_seconds
    FROM coupons c
    INNER JOIN promotion_modal_views pmv ON c.id = pmv.coupon_id
    WHERE pmv.user_id = get_claimed_promotions.user_id
    AND pmv.action = 'apply'
    AND c.valid_until > NOW()
    AND c.is_active = true
    AND c.id NOT IN (
        SELECT DISTINCT c2.id
        FROM coupons c2
        INNER JOIN payments p ON c2.id = p.coupon_id
        WHERE p.user_id = get_claimed_promotions.user_id
        AND p.status = 'approved'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_claimed_promotions(UUID) TO authenticated;

-- Function to mark promotion as used when payment is made
CREATE OR REPLACE FUNCTION mark_promotion_used(coupon_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    coupon_exists BOOLEAN;
BEGIN
    -- Check if coupon exists and is valid
    SELECT EXISTS(
        SELECT 1 FROM coupons 
        WHERE id = mark_promotion_used.coupon_id 
        AND is_active = true 
        AND valid_until > NOW()
    ) INTO coupon_exists;
    
    IF NOT coupon_exists THEN
        RETURN FALSE;
    END IF;
    
    -- Update used count
    UPDATE coupons 
    SET used_count = COALESCE(used_count, 0) + 1
    WHERE id = mark_promotion_used.coupon_id;
    
    -- Record usage in promotion_modal_views
    INSERT INTO promotion_modal_views (coupon_id, user_id, action, created_at)
    VALUES (mark_promotion_used.coupon_id, mark_promotion_used.user_id, 'use', NOW());
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION mark_promotion_used(UUID, UUID) TO authenticated;

-- Function to get promotion expiration warning
CREATE OR REPLACE FUNCTION get_promotion_expiration_warning(coupon_id UUID)
RETURNS TEXT AS $$
DECLARE
    hours_left INTEGER;
    warning_text TEXT;
BEGIN
    SELECT EXTRACT(EPOCH FROM (valid_until - NOW())) / 3600
    INTO hours_left
    FROM coupons
    WHERE id = get_promotion_expiration_warning.coupon_id;
    
    IF hours_left IS NULL OR hours_left <= 0 THEN
        warning_text := 'EXPIRED';
    ELSIF hours_left < 1 THEN
        warning_text := 'CRITICAL: Less than 1 hour left!';
    ELSIF hours_left < 6 THEN
        warning_text := 'URGENT: Less than 6 hours left!';
    ELSIF hours_left < 24 THEN
        warning_text := 'WARNING: Less than 24 hours left!';
    ELSE
        warning_text := 'Active';
    END IF;
    
    RETURN warning_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_promotion_expiration_warning(UUID) TO authenticated;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_promotion_modal_views_user_action 
ON promotion_modal_views(user_id, action);

CREATE INDEX IF NOT EXISTS idx_payments_user_coupon_status 
ON payments(user_id, coupon_id, status);

-- Add RLS policies for promotion_modal_views
ALTER TABLE promotion_modal_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own promotion views" ON promotion_modal_views
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own promotion views" ON promotion_modal_views
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id); 