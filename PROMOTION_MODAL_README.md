# Promotion Modal System

## Overview

The Promotion Modal System allows admins to create promotional offers that automatically appear to new visitors. When a visitor clicks on the promotion modal, the coupon is automatically applied and they are redirected to the checkout page.

## Features

- **Admin Management**: Admins can create coupons with promotion modal settings
- **Automatic Display**: Modals appear to new visitors after a configurable delay
- **One-time Display**: Each user sees each promotion only once
- **Automatic Coupon Application**: Clicking the modal automatically applies the coupon
- **Analytics Tracking**: All interactions are tracked for analytics
- **Customizable Design**: Admins can customize title, description, button text, and image

## Database Schema

### New Columns in `coupons` table:
- `show_in_promotion_modal` (BOOLEAN): Whether to show in promotion modal
- `promotion_modal_title` (TEXT): Custom title for the modal
- `promotion_modal_description` (TEXT): Custom description for the modal
- `promotion_modal_image_url` (TEXT): URL of image to display
- `promotion_modal_button_text` (TEXT): Text for the CTA button
- `promotion_modal_delay_seconds` (INTEGER): Delay before showing modal

### New Table: `promotion_modal_views`
Tracks which users have seen which promotion modals:
- `coupon_id`: Reference to the coupon
- `user_id`: Reference to the user
- `viewed_at`: When the modal was viewed
- `clicked_at`: When the user clicked the CTA button
- `applied_at`: When the coupon was applied

## Database Functions

### `get_active_promotion_modal(user_id)`
Returns the active promotion modal for a user, ensuring:
- Coupon is active and valid
- User hasn't seen this promotion before
- Usage limits haven't been reached

### `record_promotion_modal_view(coupon_id, user_id, action)`
Records user interactions with promotion modals:
- `action`: 'view', 'click', or 'apply'

## Components

### PromotionModal.js
The main modal component that:
- Fetches active promotions for the user
- Displays the promotion with custom styling
- Handles user interactions
- Redirects to checkout with applied coupon

### usePromotionModal.js
Custom hook that manages:
- Checking for active promotions
- Modal state management
- Coupon application logic

## Admin Interface

### Coupon Management
In the Admin Dashboard, when creating/editing coupons, admins can:

1. **Enable Promotion Modal**: Checkbox to show coupon in promotion modal
2. **Customize Modal Content**:
   - Modal title
   - Modal description
   - Button text
   - Image URL
   - Display delay

### Promotion Status
The coupons table shows a "Promotion" column indicating whether each coupon is active in promotion modals.

## User Experience

### For New Visitors
1. User visits the dashboard
2. After 2 seconds, system checks for active promotions
3. If a promotion exists, modal appears after configured delay
4. User sees attractive promotion with coupon code
5. Clicking "Claim Offer" automatically applies the coupon
6. User is redirected to checkout with coupon pre-applied

### For Returning Users
- Users who have already seen a promotion won't see it again
- Each promotion is shown only once per user

## Analytics

The system tracks:
- Modal opens
- Button clicks
- Coupon applications
- Modal closes

All events are sent to:
- Internal analytics system
- Meta Pixel for Facebook tracking

## Setup Instructions

### 1. Run Database Migration
```sql
-- Run the migration file
-- supabase/migrations/20250102000000_add_promotion_modal_to_coupons.sql
```

### 2. Create Test Promotions
```sql
-- Run the test promotion file
-- test_promotion_coupon.sql
```

### 3. Test the System
1. Create a new user account
2. Log in and visit the dashboard
3. Wait for the promotion modal to appear
4. Click "Claim Offer" to test the flow

## Configuration Options

### Modal Timing
- **Delay**: Configurable delay before showing modal (1-10 seconds)
- **User Check**: Only shows to users who haven't purchased packages
- **One-time Display**: Each user sees each promotion only once

### Content Customization
- **Title**: Custom modal title
- **Description**: Detailed promotion description
- **Button Text**: Custom CTA button text
- **Image**: Optional promotional image
- **Styling**: Beautiful gradient design with animations

### Targeting
- **Package Specific**: Can target specific packages (Saudi, UAE, Qatar)
- **User Type**: Only shows to new visitors (no purchase history)
- **Validity**: Respects coupon validity dates and usage limits

## Best Practices

### Creating Effective Promotions
1. **Clear Value Proposition**: Make the discount amount prominent
2. **Urgency**: Use limited-time language
3. **Relevance**: Target specific packages when appropriate
4. **Visual Appeal**: Use high-quality images
5. **Simple CTA**: Clear, action-oriented button text

### Timing Considerations
- Don't show immediately (give users time to explore)
- Consider user behavior patterns
- Test different delay times
- Monitor conversion rates

### Content Guidelines
- Keep titles short and impactful
- Use emojis sparingly but effectively
- Include the discount amount prominently
- Make the benefit clear and immediate

## Troubleshooting

### Common Issues
1. **Modal not appearing**: Check if user has already seen the promotion
2. **Coupon not applying**: Verify coupon is active and valid
3. **Redirect not working**: Check navigation logic in PromotionModal

### Debug Steps
1. Check browser console for errors
2. Verify database functions are working
3. Confirm user authentication state
4. Check promotion modal view records

## Future Enhancements

### Potential Features
- **A/B Testing**: Test different modal designs
- **Segmentation**: Target specific user groups
- **Scheduling**: Schedule promotions for specific times
- **Frequency Capping**: Limit how often users see promotions
- **Personalization**: Customize based on user behavior
- **Exit Intent**: Show modal when user tries to leave
- **Mobile Optimization**: Enhanced mobile experience 