// frontend/src/App.js
import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAnalytics } from './utils/useAnalytics';
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

// Analytics component to track page views
function AnalyticsTracker() {
  useAnalytics();
  return null;
}

function App() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch backend message
    // fetch('http://localhost:5000/')
    //   .then(res => res.text())
    //   .then(setMessage);

    // Check current user via Supabase
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
      } else {
        console.log('Current user:', data.user);
        setUser(data.user);
      }
    };

    getUser();
  }, []);

  return (
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
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/thank-you" element={<ThankYou />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/payments" element={<UserPaymentHistory />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/submit-case" element={<CaseSubmission />} />
            <Route path="/my-cases" element={<CaseTracking />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
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
    </Router>
  );
}

export default App;
