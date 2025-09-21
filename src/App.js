// frontend/src/App.js
import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAnalytics } from './utils/useAnalytics';
import { AuthModalProvider } from './contexts/AuthModalContext';
import AuthModalWrapper from './components/AuthModalWrapper';
import Register from './auth/Register';
import Login from './auth/Login';
import ForgotPassword from './auth/ForgotPassword';
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Profile from "./pages/Profile";
import CaseSubmission from "./pages/CaseSubmission";
import CaseTracking from "./pages/CaseTracking";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import Landing from "./pages/Landing";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import UserPaymentHistory from "./pages/UserPaymentHistory";
import ThankYou from './pages/ThankYou';
import StartLicense from './pages/StartLicense';
import EligibilityCheck from './pages/EligibilityCheck';
import Terms from './pages/Terms';
import RefundPolicy from './pages/RefundPolicy';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import ServicePolicy from './pages/ServicePolicy';
import VoucherTerms from './pages/VoucherTerms';
import SupportTickets from './pages/SupportTickets';
import AdminSupportTickets from './pages/AdminSupportTickets';
import UserAppointmentHistory from "./pages/UserAppointmentHistory";
import Licenses from './pages/Licenses';
import DHALicense from './pages/DHALicense';
import SCFHSLicense from './pages/SCFHSLicense';
import QCHPLicense from './pages/QCHPLicense';
import MOHLicense from './pages/MOHLicense';
import Countries from './pages/Countries';
import Tools from './pages/Tools';
import VoucherSystem from './pages/VoucherSystem';
import PrometricVouchers from './pages/PrometricVouchers';
import MyVouchers from './pages/MyVouchers';
import DHAVoucher from './pages/DHAVoucher';
import MOHAPVoucher from './pages/MOHAPVoucher';
import DOHVoucher from './pages/DOHVoucher';
import QCHPVoucher from './pages/QCHPVoucher';
import SCFHSVoucher from './pages/SCFHSVoucher';
import MyExams from './pages/MyExams';
import GetExamPass from './pages/GetExamPass';
import NotFound from './pages/NotFound';

// Analytics component to track page views
function AnalyticsTracker() {
  useAnalytics();
  return null;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check current user via Supabase
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching user:', error.message);
        } else {
          console.log('Current user:', data.user);
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error in getUser:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  // Show loading spinner while app initializes
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-accent-500/20 border-t-accent-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthModalProvider>
      <Router>
        <AnalyticsTracker />
        <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
          {/* Background Elements */}
          <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />
          
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/pricing" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/service-policy" element={<ServicePolicy />} />
              <Route path="/voucher-terms" element={<VoucherTerms />} />
              <Route path="/start-license" element={<StartLicense />} />
              
              {/* Hybrid Routes - accessible to both logged-in and non-logged-in users */}
              <Route path="/licenses" element={<Licenses />} />
              <Route path="/licenses/dha-license-dubai" element={<DHALicense />} />
              <Route path="/licenses/scfhs-license-saudi" element={<SCFHSLicense />} />
              <Route path="/licenses/qchp-license-qatar" element={<QCHPLicense />} />
              <Route path="/licenses/moh-license-uae" element={<MOHLicense />} />
              <Route path="/vouchers" element={<VoucherSystem />} />
              <Route path="/prometric-vouchers" element={<PrometricVouchers />} />
              <Route path="/countries" element={<Countries />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/eligibility-check" element={<EligibilityCheck />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard/user" element={<UserDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/payments" element={<UserPaymentHistory />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/support-tickets" element={<AdminSupportTickets />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/submit-case" element={<CaseSubmission />} />
              <Route path="/my-cases" element={<CaseTracking />} />
              <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-vouchers" element={<MyVouchers />} />
              <Route path="/my-exams" element={<MyExams />} />
              <Route path="/get-exam-pass" element={<GetExamPass />} />
              <Route path="/support-tickets" element={<SupportTickets />} />
              <Route path="/appointments" element={<UserAppointmentHistory />} />
              
              {/* Protected Voucher Routes */}
            <Route path="/vouchers/dha-license-dubai" element={<DHAVoucher />} />
            <Route path="/vouchers/mohap-license-uae" element={<MOHAPVoucher />} />
            <Route path="/vouchers/doh-license-abu-dhabi" element={<DOHVoucher />} />
            <Route path="/vouchers/qchp-license-qatar" element={<QCHPVoucher />} />
            <Route path="/vouchers/scfhs-license-saudi" element={<SCFHSVoucher />} />
            </Route>

            {/* Default Redirect */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Global loading indicator */}
          <div id="global-loader" className="fixed inset-0 bg-secondary-900/80 backdrop-blur-sm z-50 hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-accent-500/20 border-t-accent-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Toast notifications */}
          <div id="toast-container" className="fixed bottom-4 right-4 z-50 space-y-4" />
        </div>
        
        {/* Auth Modal */}
        <AuthModalWrapper />
      </Router>
    </AuthModalProvider>
  );
}

export default App;
