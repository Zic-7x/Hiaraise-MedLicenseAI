-- Simple migration for promotion usage tracking

-- Function to get claimed but unused promotions for a user
CREATE OR REPLACE FUNCTION get_claimed_promotions(user_id UUID)
RETURNS TABLE (
    id UUID,
    code TEXT,
    name TEXT,
    discount_type TEXT,
    discount_value DECIMAL,
    valid_until TIMESTAMPTZ,
    usage_limit INTEGER,
    used_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.code,
        c.name,
        c.discount_type,
        c.discount_value,
        c.valid_until,
        c.usage_limit,
        c.used_count
    FROM coupons c
    INNER JOIN promotion_modal_views pmv ON c.id = pmv.coupon_id
    WHERE pmv.user_id = get_claimed_promotions.user_id
    AND pmv.action = 'apply'
    AND c.valid_until > NOW()
    AND c.is_active = true
    AND c.id NOT IN (
        SELECT DISTINCT c2.id
        FROM coupons c2
        INNER JOIN payments p ON c2.code = p.coupon_code
        WHERE p.user_id = get_claimed_promotions.user_id
        AND p.status = 'approved'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_claimed_promotions(UUID) TO authenticated; 