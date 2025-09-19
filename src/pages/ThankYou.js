import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import { trackMetaPixelPayment, trackMetaPixelButtonClick } from '../utils/metaPixel';
import { trackEvent, trackButtonClick, trackPageView, trackPayment } from '../utils/analytics';
import { useAnalytics } from '../utils/useAnalytics';

export default function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Enable automatic page tracking
  useAnalytics();

  // Only show if navigated with state.success === true
  useEffect(() => {
    if (!location.state || !location.state.success) {
      // If not coming from a successful purchase, redirect to home
      navigate('/', { replace: true });
    } else {
      // Track successful purchase conversion
      const amount = location.state.amount || 0;
      trackPageView('/thank-you');
      trackEvent('page_viewed', 'engagement', 'thank_you_page');
      trackEvent('purchase_completed', 'business', 'thank_you_page', amount);
      trackPayment(amount, 'PKR');
      trackMetaPixelPayment(amount, 'PKR');
    }
  }, [location, navigate]);

  const handleGoToDashboard = () => {
    trackButtonClick('go_to_dashboard', 'thank_you_page');
    trackMetaPixelButtonClick('Go to Dashboard', 'Thank You Page');
  };

//   // Optionally, you can pass additionalDocuments in state if you want to show the conditional message
//   const additionalDocuments = location.state?.additionalDocuments;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden py-8 px-2">
      {/* Animated Background Elements - adapted from Checkout.js */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>
      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl p-4 sm:p-6 shadow-2xl text-center w-full max-w-sm mx-auto">
          <div className="w-14 h-14 bg-gradient-to-br from-white/40 to-gray-200/40 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/40 shadow">
            <FiCheck className="text-green-400 text-3xl" />
          </div>
          <h2 className="text-xl font-display font-bold bg-gradient-to-r from-pink-400 via-white to-cyan-400 bg-clip-text text-transparent mb-2">Payment Submitted Successfully!</h2>
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            Thank you for your payment. Our team will review your payment within 15 minutes.
          </p>
          <div className="bg-white/10 p-3 rounded-xl mb-4 border border-white/20 shadow-sm">
            <p className="text-gray-400 text-xs leading-relaxed">
              You will receive a confirmation email once your payment is verified. After verification, you can proceed with submitting your case.
            </p>
          </div>
          <a href="/dashboard" className="inline-block mt-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all duration-300 text-sm" onClick={handleGoToDashboard}>
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
} 