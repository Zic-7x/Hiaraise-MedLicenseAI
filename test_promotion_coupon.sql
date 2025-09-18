-- Test promotion coupon for demonstration with urgency
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
    'WELCOME25',
    'Welcome 25% Off',
    'Get 25% off on your first medical licensing package',
    'percentage',
    25.00,
    0.00,
    15000.00, -- Maximum discount of 15,000 PKR
    NOW(), -- Valid from now
    NOW() + INTERVAL '2 hours', -- Valid for only 2 hours to create urgency
    15, -- Only 15 uses to create scarcity
    true,
    NULL, -- Applies to all packages
    true, -- Show in promotion modal
    '🔥 FLASH SALE: 25% OFF!',
    '⚡ Limited time offer! Only 2 hours left to claim your 25% discount. Don\'t miss this exclusive deal!',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    'Claim Now - 2 Hours Left!',
    3 -- Show after 3 seconds
);

-- Another test promotion coupon for specific package with high urgency
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
    'SAUDI5000',
    'Saudi Arabia Special',
    'Get PKR 5,000 off on Saudi Arabia licensing package',
    'fixed',
    5000.00,
    30000.00, -- Minimum amount required
    NULL, -- No maximum discount limit
    NOW(),
    NOW() + INTERVAL '1 hour', -- Valid for only 1 hour - high urgency
    8, -- Only 8 uses - high scarcity
    true,
    ARRAY['saudi'], -- Only applies to Saudi package
    true, -- Show in promotion modal
    '⚡ URGENT: Saudi Special!',
    '🔥 Only 1 hour left! Just 8 coupons remaining for Saudi Arabia licensing. Claim yours before it\'s gone!',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
    'Claim Before Expires!',
    5 -- Show after 5 seconds
);

-- Third test coupon with medium urgency
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
    'UAE3000',
    'UAE Quick Deal',
    'Get PKR 3,000 off on UAE licensing package',
    'fixed',
    3000.00,
    25000.00,
    NULL,
    NOW(),
    NOW() + INTERVAL '6 hours', -- Valid for 6 hours
    25, -- 25 uses
    true,
    ARRAY['uae'], -- Only applies to UAE package
    true,
    '🎯 UAE Special Deal!',
    '⏰ 6 hours left! Get PKR 3,000 off on UAE licensing. Limited to 25 users only!',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
    'Get UAE Discount!',
    4
); 