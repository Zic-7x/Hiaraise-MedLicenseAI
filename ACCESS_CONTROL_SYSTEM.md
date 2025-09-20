# Improved Access Control System

## Overview

This document describes the improved access control system implemented for the med-license-portal application. The new system provides centralized route management, role-based access control, and better maintainability.

## Key Features

### ✅ **Centralized Route Configuration**
- All routes defined in a single configuration file (`utils/routeConfig.js`)
- Clear categorization: Public, Hybrid, Protected
- Role-based permissions for each route

### ✅ **Improved Layouts**
- `PublicLayout.js` - Handles public and hybrid routes
- `ProtectedLayout.js` - Handles protected routes with role checks
- Automatic navbar selection based on authentication status

### ✅ **Route Guard Hook**
- `useRouteGuard.js` - Reusable authentication logic
- Flexible access control methods
- Easy integration in components

## Route Categories

### 🌐 **Public Routes**
Accessible to everyone (logged-in and non-logged-in users):
- `/` - Landing page
- `/pricing` - Services/Pricing page
- `/about` - About page
- `/contact` - Contact page
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset
- `/thank-you` - Thank you page
- `/terms` - Terms of service
- `/privacy` - Privacy policy
- `/refund-policy` - Refund policy
- `/cookies` - Cookie policy
- `/service-policy` - Service policy
- `/voucher-terms` - Voucher terms

### 🔄 **Hybrid Routes**
Accessible to both logged-in and non-logged-in users:
- `/licenses` - Main licenses page
- `/licenses/dha-license-dubai` - DHA License page
- `/licenses/scfhs-license-saudi` - SCFHS License page
- `/licenses/qchp-license-qatar` - QCHP License page
- `/licenses/moh-license-uae` - MOH License page
- `/vouchers` - Voucher system page
- `/prometric-vouchers` - Prometric vouchers page
- `/countries` - Countries page
- `/tools` - Tools page

### 🔒 **Protected Routes**
Require authentication and specific roles:

#### User & Admin Routes:
- `/dashboard/user` - User dashboard
- `/dashboard/payments` - Payment history
- `/profile` - User profile
- `/submit-case` - Case submission
- `/my-cases` - Case tracking
- `/checkout` - Checkout page
- `/start-license` - Start license process
- `/eligibility-check` - Eligibility check
- `/my-vouchers` - User's vouchers
- `/my-exams` - User's exams
- `/get-exam-pass` - Get exam pass
- `/support-tickets` - Support tickets
- `/appointments` - Appointment history

#### Admin Only Routes:
- `/dashboard/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/analytics` - Analytics
- `/admin/support-tickets` - Support management

#### Protected Voucher Routes:
- `/vouchers/dha-license-dubai` - DHA Voucher
- `/vouchers/mohap-license-uae` - MOHAP Voucher
- `/vouchers/doh-license-abu-dhabi` - DOH Voucher
- `/vouchers/qchp-license-qatar` - QCHP Voucher
- `/vouchers/scfhs-license-saudi` - SCFHS Voucher

## Usage Examples

### Using Route Guard Hook in Components

```javascript
import { useRouteGuard } from '../hooks/useRouteGuard';

function MyComponent() {
  const { 
    requireAuth, 
    requireRole, 
    isAdmin, 
    checkAccess 
  } = useRouteGuard();
  
  // Require authentication
  if (!requireAuth()) return null;
  
  // Require admin role
  if (!requireRole(['admin'])) return null;
  
  // Check specific route access
  const canAccessAdmin = checkAccess('/admin/users');
  
  return (
    <div>
      {isAdmin && <AdminPanel />}
      {canAccessAdmin && <AdminLink />}
    </div>
  );
}
```

### Adding New Routes

1. **Add to route configuration** (`utils/routeConfig.js`):
```javascript
// For a new public route
PUBLIC: {
  '/new-page': { component: 'NewPage', title: 'New Page' }
}

// For a new hybrid route
HYBRID: {
  '/new-hybrid': { component: 'NewHybrid', title: 'New Hybrid' }
}

// For a new protected route
PROTECTED: {
  '/new-protected': { 
    component: 'NewProtected', 
    title: 'New Protected',
    roles: ['user', 'admin'] 
  }
}
```

2. **Add route to App.js**:
```javascript
<Route path="/new-page" element={<NewPage />} />
```

3. **Import component** in App.js if needed

## Benefits

### 🎯 **Maintainability**
- Single source of truth for all routes
- Easy to add/modify route permissions
- Clear separation of concerns

### 🔒 **Security**
- Role-based access control
- Consistent authentication checks
- No hardcoded route arrays

### 🚀 **Performance**
- Efficient route checking
- Minimal re-renders
- Optimized authentication flow

### 🛠️ **Developer Experience**
- Type-safe route configuration
- Reusable authentication logic
- Clear documentation and examples

## Migration Notes

The old system with hardcoded `PUBLIC_ACCESSIBLE_ROUTES` arrays has been completely replaced. All routes now use the centralized configuration system.

### Before (Old System):
```javascript
const PUBLIC_ACCESSIBLE_ROUTES = ['/pricing', '/about', '/contact'];
```

### After (New System):
```javascript
// Routes defined in routeConfig.js
// Access controlled via canAccessRoute() function
```

## Testing

Use the `RouteAccessTest` component to verify route access:

```javascript
import RouteAccessTest from '../components/RouteAccessTest';

// Add to any page for testing
<RouteAccessTest />
```

This component shows:
- Current authentication status
- User role
- Access status for all routes
- Permission test buttons

## Troubleshooting

### Common Issues:

1. **Route not accessible**: Check if route is defined in `routeConfig.js`
2. **Wrong navbar showing**: Verify route is in correct category (public/hybrid/protected)
3. **Role-based access failing**: Check user role in database and route configuration

### Debug Steps:

1. Check browser console for authentication errors
2. Verify user role in Supabase profiles table
3. Use `RouteAccessTest` component to debug access issues
4. Check route configuration in `utils/routeConfig.js`
