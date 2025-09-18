-- Test coupon for demonstration
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
    applicable_packages
) VALUES (
    'SAVE20',
    '20% Off All Packages',
    'Get 20% off on any medical licensing package',
    'percentage',
    20.00,
    0.00,
    10000.00, -- Maximum discount of 10,000 PKR
    NOW(), -- Valid from now
    NOW() + INTERVAL '30 days', -- Valid for 30 days
    100, -- Can be used 100 times
    true,
    NULL -- Applies to all packages
);

-- Another test coupon for specific package
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
    applicable_packages
) VALUES (
    'SAUDI5000',
    'PKR 5,000 Off Saudi Package',
    'Get PKR 5,000 off on Saudi Arabia licensing package',
    'fixed',
    5000.00,
    30000.00, -- Minimum amount required
    NULL, -- No maximum discount limit
    NOW(),
    NOW() + INTERVAL '60 days',
    50,
    true,
    ARRAY['saudi'] -- Only applies to Saudi package
); 