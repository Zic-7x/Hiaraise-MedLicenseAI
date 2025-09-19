// Route configuration with access control
export const ROUTE_CONFIG = {
  // Public routes - accessible to everyone
  PUBLIC: {
    '/': { component: 'Landing', title: 'Home' },
    '/pricing': { component: 'Services', title: 'Pricing' },
    '/about': { component: 'About', title: 'About' },
    '/contact': { component: 'Contact', title: 'Contact' },
    '/login': { component: 'Login', title: 'Login' },
    '/register': { component: 'Register', title: 'Register' },
    '/forgot-password': { component: 'ForgotPassword', title: 'Reset Password' },
    '/thank-you': { component: 'ThankYou', title: 'Thank You' },
    '/terms': { component: 'Terms', title: 'Terms' },
    '/privacy': { component: 'Privacy', title: 'Privacy' },
    '/refund-policy': { component: 'RefundPolicy', title: 'Refund Policy' },
    '/cookies': { component: 'Cookies', title: 'Cookies' },
    '/service-policy': { component: 'ServicePolicy', title: 'Service Policy' },
    '/voucher-terms': { component: 'VoucherTerms', title: 'Voucher Terms' },
  },

  // Hybrid routes - accessible to both logged-in and non-logged-in users
  HYBRID: {
    '/licenses': { component: 'Licenses', title: 'Licenses' },
    '/licenses/dha-license-dubai': { component: 'DHALicense', title: 'DHA License' },
    '/licenses/scfhs-license-saudi': { component: 'SCFHSLicense', title: 'SCFHS License' },
    '/licenses/qchp-license-qatar': { component: 'QCHPLicense', title: 'QCHP License' },
    '/licenses/moh-license-uae': { component: 'MOHLicense', title: 'MOH License' },
    '/vouchers': { component: 'VoucherSystem', title: 'Vouchers' },
    '/prometric-vouchers': { component: 'PrometricVouchers', title: 'Prometric Vouchers' },
    '/countries': { component: 'Countries', title: 'Countries' },
    '/tools': { component: 'Tools', title: 'Tools' },
    '/eligibility-check': { component: 'EligibilityCheck', title: 'Eligibility Check' },
  },

  // Protected routes - require authentication
  PROTECTED: {
    '/dashboard/user': { component: 'UserDashboard', title: 'Dashboard', roles: ['user', 'admin'] },
    '/dashboard/admin': { component: 'AdminDashboard', title: 'Admin Dashboard', roles: ['admin'] },
    '/dashboard/payments': { component: 'UserPaymentHistory', title: 'Payment History', roles: ['user', 'admin'] },
    '/admin/users': { component: 'AdminUsers', title: 'User Management', roles: ['admin'] },
    '/admin/analytics': { component: 'AdminAnalytics', title: 'Analytics', roles: ['admin'] },
    '/profile': { component: 'Profile', title: 'Profile', roles: ['user', 'admin'] },
    '/submit-case': { component: 'CaseSubmission', title: 'Submit Case', roles: ['user', 'admin'] },
    '/my-cases': { component: 'CaseTracking', title: 'My Cases', roles: ['user', 'admin'] },
    '/checkout': { component: 'Checkout', title: 'Checkout', roles: ['user', 'admin'] },
    '/start-license': { component: 'StartLicense', title: 'Start License', roles: ['user', 'admin'] },
    '/my-vouchers': { component: 'MyVouchers', title: 'My Vouchers', roles: ['user', 'admin'] },
    '/my-exams': { component: 'MyExams', title: 'My Exams', roles: ['user', 'admin'] },
    '/get-exam-pass': { component: 'GetExamPass', title: 'Get Exam Pass', roles: ['user', 'admin'] },
    '/support-tickets': { component: 'SupportTickets', title: 'Support Tickets', roles: ['user', 'admin'] },
    '/admin/support-tickets': { component: 'AdminSupportTickets', title: 'Support Management', roles: ['admin'] },
    '/appointments': { component: 'UserAppointmentHistory', title: 'Appointment History', roles: ['user', 'admin'] },
  },

  // Voucher sub-routes (protected)
  VOUCHER_PROTECTED: {
    '/vouchers/dha-license-dubai': { component: 'DHAVoucher', title: 'DHA Voucher', roles: ['user', 'admin'] },
    '/vouchers/mohap-license-uae': { component: 'MOHAPVoucher', title: 'MOHAP Voucher', roles: ['user', 'admin'] },
    '/vouchers/doh-license-abu-dhabi': { component: 'DOHVoucher', title: 'DOH Voucher', roles: ['user', 'admin'] },
    '/vouchers/qchp-license-qatar': { component: 'QCHPVoucher', title: 'QCHP Voucher', roles: ['user', 'admin'] },
    '/vouchers/scfhs-license-saudi': { component: 'SCFHSVoucher', title: 'SCFHS Voucher', roles: ['user', 'admin'] },
  }
};

// Helper functions
export const getRouteConfig = (path) => {
  return ROUTE_CONFIG.PUBLIC[path] || 
         ROUTE_CONFIG.HYBRID[path] || 
         ROUTE_CONFIG.PROTECTED[path] || 
         ROUTE_CONFIG.VOUCHER_PROTECTED[path] || 
         null;
};

export const isPublicRoute = (path) => {
  return ROUTE_CONFIG.PUBLIC.hasOwnProperty(path);
};

export const isHybridRoute = (path) => {
  return ROUTE_CONFIG.HYBRID.hasOwnProperty(path);
};

export const isProtectedRoute = (path) => {
  return ROUTE_CONFIG.PROTECTED.hasOwnProperty(path) || 
         ROUTE_CONFIG.VOUCHER_PROTECTED.hasOwnProperty(path);
};

export const canAccessRoute = (path, userRole = null) => {
  const config = getRouteConfig(path);
  if (!config) return false;
  
  // Public routes are always accessible
  if (isPublicRoute(path)) return true;
  
  // Hybrid routes are always accessible
  if (isHybridRoute(path)) return true;
  
  // Protected routes require authentication and role check
  if (isProtectedRoute(path)) {
    if (!userRole) return false; // Not logged in
    return config.roles ? config.roles.includes(userRole) : true;
  }
  
  return false;
};

export const getAllPublicRoutes = () => Object.keys(ROUTE_CONFIG.PUBLIC);
export const getAllHybridRoutes = () => Object.keys(ROUTE_CONFIG.HYBRID);
export const getAllProtectedRoutes = () => [
  ...Object.keys(ROUTE_CONFIG.PROTECTED),
  ...Object.keys(ROUTE_CONFIG.VOUCHER_PROTECTED)
];
