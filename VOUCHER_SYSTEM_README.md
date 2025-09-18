# 🎫 Voucher System Documentation

## Overview
The voucher system allows users to purchase discounted Prometric exam vouchers by selecting from available time slots. Each slot has special pricing with significant discounts compared to regular exam registration.

## Features

### For Users
- **Calendar-based slot selection**: Browse available exam dates and times
- **Discount pricing**: Up to 50% savings on exam registration
- **Real-time availability**: See current slot capacity and availability
- **Instant voucher delivery**: Receive voucher code immediately after payment
- **Mobile-friendly interface**: Responsive design for all devices
- **Calendar integration**: Add exam to personal calendar
- **Voucher management**: Track purchased vouchers and expiration dates

### For Administrators
- **Slot management**: Create, edit, and manage voucher slots
- **Pricing control**: Set original and discount prices for each slot
- **Capacity management**: Control maximum vouchers per slot
- **Purchase tracking**: Monitor all voucher purchases and usage
- **Status management**: Mark vouchers as used, expired, or cancelled
- **Analytics**: View purchase statistics and revenue data

## Database Schema

### Tables Created
1. **voucher_slots**: Available exam slots with pricing
2. **voucher_purchases**: Purchased vouchers with codes
3. **payments**: Extended with voucher_slot_id reference

### Key Features
- Automatic voucher code generation
- Real-time capacity tracking
- Expiration date management
- Row-level security (RLS) policies
- Automatic triggers for capacity updates

## Components

### Frontend Components
- `VoucherCalendar.js`: Calendar interface for slot selection
- `VoucherPurchaseForm.js`: Purchase form with payment integration
- `VoucherSystem.js`: Main page combining calendar and purchase flow
- `AdminVoucherSlotManager.js`: Admin interface for slot management
- `AdminVoucherPurchaseDashboard.js`: Admin interface for purchase management

### Backend Integration
- Supabase database with PostgreSQL
- Real-time subscriptions for live updates
- Payment system integration
- Authentication and authorization

## Usage

### For Users
1. Navigate to `/vouchers` page
2. Select exam type filter (if applicable)
3. Choose preferred date from calendar
4. Select time slot with desired discount
5. Complete purchase form
6. Make payment via bank transfer
7. Receive voucher code instantly
8. Use voucher code at exam center

### For Administrators
1. Access admin dashboard
2. Navigate to "Voucher Slots" tab
3. Create new slots with pricing
4. Monitor slot availability and capacity
5. Navigate to "Voucher Purchases" tab
6. Track purchases and update status
7. Manage voucher lifecycle

## Security Features
- Row-level security policies
- User authentication required for purchases
- Admin-only access to management interfaces
- Secure voucher code generation
- Payment verification integration

## Real-time Features
- Live slot availability updates
- Automatic slot expiration
- Real-time capacity tracking
- Instant purchase confirmations

## File Structure
```
frontend/src/
├── components/
│   ├── VoucherCalendar.js
│   ├── VoucherPurchaseForm.js
│   └── admin/
│       ├── AdminVoucherSlotManager.js
│       └── AdminVoucherPurchaseDashboard.js
├── pages/
│   └── VoucherSystem.js
├── hooks/
│   └── useAuth.js
└── supabase/migrations/
    └── 20250104000000_create_voucher_system.sql
```

## Routes Added
- `/vouchers` - Main voucher system page (public)
- Admin tabs in dashboard:
  - "Voucher Slots" - Slot management
  - "Voucher Purchases" - Purchase management

## Dependencies
- React Router for navigation
- Supabase for backend services
- Framer Motion for animations
- React Icons for UI icons
- Date-fns for date manipulation

## Future Enhancements
- Email notifications for voucher delivery
- SMS notifications for exam reminders
- Bulk voucher creation tools
- Advanced analytics and reporting
- Integration with exam center APIs
- Mobile app support
- Multi-language support
