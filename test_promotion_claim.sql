-- Test script to manually insert a promotion claim for testing

-- First, let's see what users exist
SELECT id, email, full_name FROM profiles LIMIT 5;

-- Let's see what coupons exist
SELECT id, code, name, is_active, valid_until FROM coupons WHERE show_in_promotion_modal = true LIMIT 5;

-- Let's see if there are any existing promotion modal views
SELECT * FROM promotion_modal_views LIMIT 5;

-- Insert a test promotion claim (replace USER_ID and COUPON_ID with actual values)
-- This simulates a user claiming a promotion from the modal
INSERT INTO promotion_modal_views (coupon_id, user_id, action, created_at)
VALUES (
    (SELECT id FROM coupons WHERE code = 'FLASH30' LIMIT 1), -- Replace with actual coupon ID
    'YOUR_USER_ID_HERE', -- Replace with actual user ID
    'apply',
    NOW()
);

-- Check if the insertion worked
SELECT 
    pmv.*,
    c.code,
    c.name,
    c.valid_until
FROM promotion_modal_views pmv
JOIN coupons c ON pmv.coupon_id = c.id
WHERE pmv.user_id = 'YOUR_USER_ID_HERE' -- Replace with actual user ID
ORDER BY pmv.created_at DESC; 