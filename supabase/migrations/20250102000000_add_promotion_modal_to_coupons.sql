-- Add promotion modal fields to coupons table
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS show_in_promotion_modal BOOLEAN DEFAULT false;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS promotion_modal_title TEXT;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS promotion_modal_description TEXT;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS promotion_modal_image_url TEXT;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS promotion_modal_button_text TEXT DEFAULT 'Claim Offer';
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS promotion_modal_delay_seconds INTEGER DEFAULT 3;

-- Create promotion_modal_views table to track which users have seen which promotion modals
CREATE TABLE IF NOT EXISTS promotion_modal_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    clicked_at TIMESTAMP WITH TIME ZONE,
    applied_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(coupon_id, user_id) -- Prevent multiple views of same promotion by same user
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_coupons_promotion_modal ON coupons(show_in_promotion_modal);
CREATE INDEX IF NOT EXISTS idx_promotion_modal_views_coupon_id ON promotion_modal_views(coupon_id);
CREATE INDEX IF NOT EXISTS idx_promotion_modal_views_user_id ON promotion_modal_views(user_id);

-- Enable RLS on promotion_modal_views table
ALTER TABLE promotion_modal_views ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own promotion modal views
CREATE POLICY "Users can view their own promotion modal views"
    ON promotion_modal_views
    FOR SELECT
    USING (user_id = auth.uid());

-- Allow users to insert their own promotion modal views
CREATE POLICY "Users can insert their own promotion modal views"
    ON promotion_modal_views
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Allow users to update their own promotion modal views
CREATE POLICY "Users can update their own promotion modal views"
    ON promotion_modal_views
    FOR UPDATE
    USING (user_id = auth.uid());

-- Allow admins to view all promotion modal views
CREATE POLICY "Admins can view all promotion modal views"
    ON promotion_modal_views
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Function to get active promotion modal for a user
CREATE OR REPLACE FUNCTION get_active_promotion_modal(user_id UUID)
RETURNS TABLE(
    coupon_id UUID,
    code TEXT,
    name TEXT,
    description TEXT,
    discount_type TEXT,
    discount_value NUMERIC(10, 2),
    promotion_modal_title TEXT,
    promotion_modal_description TEXT,
    promotion_modal_image_url TEXT,
    promotion_modal_button_text TEXT,
    promotion_modal_delay_seconds INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.code,
        c.name,
        c.description,
        c.discount_type,
        c.discount_value,
        c.promotion_modal_title,
        c.promotion_modal_description,
        c.promotion_modal_image_url,
        c.promotion_modal_button_text,
        c.promotion_modal_delay_seconds
    FROM coupons c
    WHERE c.show_in_promotion_modal = true
    AND c.is_active = true
    AND (c.valid_until IS NULL OR c.valid_until > NOW())
    AND (c.valid_from IS NULL OR c.valid_from <= NOW())
    AND (c.usage_limit IS NULL OR c.used_count < c.usage_limit)
    AND NOT EXISTS (
        SELECT 1 FROM promotion_modal_views pmv
        WHERE pmv.coupon_id = c.id
        AND pmv.user_id = $1
    )
    ORDER BY c.created_at DESC
    LIMIT 1;
END;
$$;

-- Function to record promotion modal view
CREATE OR REPLACE FUNCTION record_promotion_modal_view(
    coupon_id UUID,
    user_id UUID,
    action TEXT -- 'view', 'click', 'apply'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO promotion_modal_views (coupon_id, user_id, viewed_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (coupon_id, user_id) DO UPDATE SET
        viewed_at = CASE WHEN $3 = 'view' THEN NOW() ELSE promotion_modal_views.viewed_at END,
        clicked_at = CASE WHEN $3 = 'click' THEN NOW() ELSE promotion_modal_views.clicked_at END,
        applied_at = CASE WHEN $3 = 'apply' THEN NOW() ELSE promotion_modal_views.applied_at END;
END;
$$;

-- Add comments
COMMENT ON COLUMN coupons.show_in_promotion_modal IS 'Whether this coupon should be shown in promotion modal to new visitors';
COMMENT ON COLUMN coupons.promotion_modal_title IS 'Custom title for the promotion modal';
COMMENT ON COLUMN coupons.promotion_modal_description IS 'Custom description for the promotion modal';
COMMENT ON COLUMN coupons.promotion_modal_image_url IS 'URL of image to show in promotion modal';
COMMENT ON COLUMN coupons.promotion_modal_button_text IS 'Text for the CTA button in promotion modal';
COMMENT ON COLUMN coupons.promotion_modal_delay_seconds IS 'Delay in seconds before showing the promotion modal';
COMMENT ON TABLE promotion_modal_views IS 'Tracks promotion modal interactions by users'; 