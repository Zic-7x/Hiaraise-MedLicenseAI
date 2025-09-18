-- Test landing page promotion coupon for new visitors with MAXIMUM URGENCY
INSERT INTO coupons (
    code,
    name,
    description,
    discount_type,
    discount_value,
    minimum_amount,
    maximum_discount,
    valid_from,
    valid_until,
    usage_limit,
    is_active,
    applicable_packages,
    show_in_promotion_modal,
    promotion_modal_title,
    promotion_modal_description,
    promotion_modal_image_url,
    promotion_modal_button_text,
    promotion_modal_delay_seconds
) VALUES (
    'FLASH30',
    'Flash Sale 30% Off',
    '🚨 URGENT: Flash sale - Get 30% off on your first medical licensing package. Limited time only!',
    'percentage',
    30.00,
    0.00,
    25000.00, -- Maximum discount of 25,000 PKR
    NOW(), -- Valid from now
    NOW() + INTERVAL '2 hours', -- Valid for ONLY 2 hours - MAXIMUM URGENCY
    25, -- Only 25 uses - HIGH SCARCITY
    true,
    NULL, -- Applies to all packages
    true, -- Show in promotion modal
    '🚨 FLASH SALE: Get 30% OFF - EXPIRES IN 2 HOURS!',
    '⚠️ WARNING: This exclusive flash sale expires in 2 hours! Only 25 spots available. Join thousands of medical professionals who have already claimed their discount. Don\'t miss this once-in-a-lifetime opportunity!',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    '🚨 CLAIM 30% OFF NOW!',
    1 -- Show after 1 second - IMMEDIATE
);

-- Another landing page promotion with CRITICAL urgency
INSERT INTO coupons (
    code,
    name,
    description,
    discount_type,
    discount_value,
    minimum_amount,
    maximum_discount,
    valid_from,
    valid_until,
    usage_limit,
    is_active,
    applicable_packages,
    show_in_promotion_modal,
    promotion_modal_title,
    promotion_modal_description,
    promotion_modal_image_url,
    promotion_modal_button_text,
    promotion_modal_delay_seconds
) VALUES (
    'CRITICAL25',
    'Critical 25% Off',
    '🔥 CRITICAL: Last chance to get 25% off - Only 15 spots left!',
    'percentage',
    25.00,
    0.00,
    20000.00, -- Maximum discount of 20,000 PKR
    NOW(),
    NOW() + INTERVAL '1 hour', -- Valid for ONLY 1 hour - CRITICAL URGENCY
    15, -- Only 15 uses - EXTREME SCARCITY
    true,
    NULL, -- Applies to all packages
    true, -- Show in promotion modal
    '🔥 CRITICAL: 25% OFF - ONLY 15 SPOTS LEFT!',
    '🚨 CRITICAL WARNING: This offer expires in 1 hour with only 15 spots remaining! Medical professionals are claiming this discount every minute. This is your LAST chance to save 25% on your medical licensing package!',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
    '🔥 CLAIM 25% OFF NOW!',
    1 -- Show after 1 second - IMMEDIATE
);

-- Emergency backup promotion with extreme urgency
INSERT INTO coupons (
    code,
    name,
    description,
    discount_type,
    discount_value,
    minimum_amount,
    maximum_discount,
    valid_from,
    valid_until,
    usage_limit,
    is_active,
    applicable_packages,
    show_in_promotion_modal,
    promotion_modal_title,
    promotion_modal_description,
    promotion_modal_image_url,
    promotion_modal_button_text,
    promotion_modal_delay_seconds
) VALUES (
    'EMERGENCY20',
    'Emergency 20% Off',
    '⚡ EMERGENCY: Last-minute 20% discount - Expires in 30 minutes!',
    'percentage',
    20.00,
    0.00,
    15000.00, -- Maximum discount of 15,000 PKR
    NOW(),
    NOW() + INTERVAL '30 minutes', -- Valid for ONLY 30 minutes - EMERGENCY URGENCY
    10, -- Only 10 uses - EMERGENCY SCARCITY
    true,
    NULL, -- Applies to all packages
    true, -- Show in promotion modal
    '⚡ EMERGENCY: 20% OFF - EXPIRES IN 30 MINUTES!',
    '🚨 EMERGENCY ALERT: This emergency discount expires in 30 minutes with only 10 spots available! Medical professionals are claiming this offer every second. This is your FINAL opportunity to save 20%!',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    '⚡ CLAIM 20% OFF NOW!',
    1 -- Show after 1 second - IMMEDIATE
); 