import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheck, FiGift, FiCalendar, FiDownload, FiClock } from 'react-icons/fi';
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
    // Debug logging for ThankYou page
    
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

  const handleGoToVouchers = () => {
    trackButtonClick('go_to_vouchers', 'thank_you_page');
    trackMetaPixelButtonClick('Go to Vouchers', 'Thank You Page');
  };

  const handlePrintVoucher = () => {
    trackButtonClick('print_voucher', 'thank_you_page');
    window.print();
  };

  const handleAddToCalendar = () => {
    if (!location.state?.examDate || !location.state?.examTime) return;
    
    const start = new Date(`${location.state.examDate}T${location.state.examTime.split(' - ')[0]}`);
    const end = new Date(`${location.state.examDate}T${location.state.examTime.split(' - ')[1]}`);
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const startFormatted = formatDate(start);
    const endFormatted = formatDate(end);
    
    const eventTitle = `${location.state.examAuthority} Exam - Voucher Purchase`;
    const eventDescription = `${location.state.examAuthority} exam appointment with voucher code: ${location.state.voucherCode}

Voucher Code: ${location.state.voucherCode}
Exam Price: PKR ${Math.round(location.state.finalPrice * 297).toLocaleString()} ($${location.state.finalPrice} USD)

Please arrive 30 minutes early and bring your voucher code and valid ID.`;
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startFormatted}/${endFormatted}&details=${encodeURIComponent(eventDescription)}`;
    
    window.open(googleCalendarUrl, '_blank');
    trackButtonClick('add_to_calendar', 'thank_you_page');
  };

  // Check if this is a voucher purchase
  const isVoucherPurchase = location.state?.voucherPurchase;
  const isPendingApproval = location.state?.status === 'pending';
  const voucherData = isVoucherPurchase ? {
    voucherCode: location.state.voucherCode,
    examAuthority: location.state.examAuthority,
    examDate: location.state.examDate,
    examTime: location.state.examTime,
    finalPrice: location.state.finalPrice,
    status: location.state.status,
    paymentId: location.state.paymentId
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden py-8 px-2">
      {/* Animated Background Elements - adapted from Checkout.js */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>
      <div className="relative z-10 w-full flex items-center justify-center">
        {isVoucherPurchase ? (
          // Voucher Purchase Status
          <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl p-4 sm:p-6 shadow-2xl text-center w-full max-w-2xl mx-auto">
            {isPendingApproval ? (
              // Pending Approval
              <>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/30 shadow">
                  <FiClock className="text-white text-3xl" />
                </div>
                <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-yellow-400 via-white to-orange-400 bg-clip-text text-transparent mb-2">
                  ⏳ Payment Verification in Progress
                </h2>
                <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                  Your {voucherData.examAuthority} voucher request has been submitted successfully! 
                  <span className="block mt-2 text-yellow-300 font-semibold">
                    🔍 Our admin team is verifying your payment. Your voucher code will be issued once approved (usually takes a few seconds to a few minutes).
                  </span>
                  <span className="block mt-2 text-blue-300 font-semibold">
                    📋 Important: Voucher codes are only issued after admin approval of your payment.
                  </span>
                </p>
              </>
            ) : (
              // Approved Voucher
              <>
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-400/30 shadow">
                  <FiGift className="text-white text-3xl" />
                </div>
                <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-green-400 via-white to-emerald-400 bg-clip-text text-transparent mb-2">
                  🎉 Voucher Purchase Successful!
                </h2>
                <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                  Your {voucherData.examAuthority} exam voucher has been purchased successfully. 
                  <span className="block mt-2 text-red-300 font-semibold">
                    ⚠️ Important: This voucher is valid only until {voucherData.examDate} at {voucherData.examTime.split(' - ')[1]}
                  </span>
                </p>
              </>
            )}
            
            {/* Voucher Details */}
            <div className={`rounded-xl p-4 mb-6 ${
              isPendingApproval 
                ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-400/30' 
                : 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-400/30'
            }`}>
              {isPendingApproval ? (
                // Pending Approval Details
                <div className="text-center mb-4">
                  <div className="text-sm text-yellow-300 mb-2 font-semibold">PAYMENT STATUS</div>
                  <div className="text-2xl font-bold text-white mb-2">
                    ⏳ Pending Verification
                  </div>
                  <div className="text-sm text-yellow-400">Your payment is being reviewed by our admin team</div>
                </div>
              ) : (
                // Approved Voucher Details
                <div className="text-center mb-4">
                  <div className="text-sm text-green-300 mb-2 font-semibold">VOUCHER CODE</div>
                  <div className="text-3xl font-bold text-white font-mono tracking-wider mb-2">
                    {voucherData.voucherCode}
                  </div>
                  <div className="text-sm text-green-400">Present this code at the exam center</div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Exam Authority</div>
                  <div className="text-white font-semibold">{voucherData.examAuthority}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Exam Date</div>
                  <div className="text-white font-semibold">{voucherData.examDate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Exam Time</div>
                  <div className="text-white font-semibold">{voucherData.examTime}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Purchase Price</div>
                  <div className="text-green-400 font-bold">PKR {Math.round(voucherData.finalPrice * 297).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">${voucherData.finalPrice} USD (Rate: 297)</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isPendingApproval ? (
              // Pending Approval Actions
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all duration-300 text-sm"
                >
                  <FiClock className="w-4 h-4" />
                  <span>Refresh Status</span>
                </button>
                
                <button
                  onClick={handleAddToCalendar}
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all duration-300 text-sm"
                >
                  <FiCalendar className="w-4 h-4" />
                  <span>Add to Calendar</span>
                </button>
              </div>
            ) : (
              // Approved Voucher Actions
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                <button
                  onClick={handlePrintVoucher}
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all duration-300 text-sm"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Print Voucher</span>
                </button>
                
                <button
                  onClick={handleAddToCalendar}
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all duration-300 text-sm"
                >
                  <FiCalendar className="w-4 h-4" />
                  <span>Add to Calendar</span>
                </button>
              </div>
            )}

            {/* Important Instructions */}
            <div className={`rounded-lg p-4 mb-4 ${
              isPendingApproval 
                ? 'bg-yellow-900/20 border border-yellow-400/30' 
                : 'bg-amber-900/20 border border-amber-400/30'
            }`}>
              <h5 className={`font-semibold mb-3 text-sm ${
                isPendingApproval ? 'text-yellow-300' : 'text-amber-300'
              }`}>
                {isPendingApproval ? '⏳ Payment Verification Status:' : '📋 How to Use Your Voucher:'}
              </h5>
              <ul className={`text-xs space-y-2 text-left ${
                isPendingApproval ? 'text-yellow-200' : 'text-amber-200'
              }`}>
                {isPendingApproval ? (
                  <>
                    <li>• Your payment is being verified by our admin team</li>
                    <li>• Voucher code will be issued only after admin approval</li>
                    <li>• You will receive an email notification when approved</li>
                    <li>• Usually takes a few seconds to a few minutes</li>
                    <li>• Check your dashboard for status updates</li>
                    <li>• Voucher codes are not generated until payment is verified</li>
                  </>
                ) : (
                  <>
                    <li>• <strong>Step 1:</strong> Go to your dashboard and click "My Vouchers"</li>
                    <li>• <strong>Step 2:</strong> Find your approved voucher and click "Submit for Exam"</li>
                    <li>• <strong>Step 3:</strong> Follow the Hiaraise submission process to get your exam pass</li>
                    <li>• <strong>Step 4:</strong> Upload required documents and complete submission</li>
                    <li>• <strong>Step 5:</strong> Track your progress in the dashboard</li>
                    <li>• <strong>Important:</strong> Voucher is valid until {voucherData.examDate} at {voucherData.examTime.split(' - ')[1]}</li>
                  </>
                )}
              </ul>
            </div>

            {/* Additional Instructions for Pending Vouchers */}
            {isPendingApproval && (
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-400/30 rounded-lg p-4 mb-4">
                <h5 className="text-blue-300 font-semibold mb-3 text-sm">📋 What to Expect After Approval:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <h6 className="text-blue-200 font-semibold mb-2">🎯 Step 1: After Approval</h6>
                    <ul className="text-blue-100 space-y-1">
                      <li>• You'll receive an email notification</li>
                      <li>• Voucher code will be generated</li>
                      <li>• Voucher appears in "My Vouchers"</li>
                      <li>• You can start the submission process</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-purple-200 font-semibold mb-2">📱 Step 2: Using Your Voucher</h6>
                    <ul className="text-purple-100 space-y-1">
                      <li>• Go to "My Vouchers" in your dashboard</li>
                      <li>• Click "Submit for Exam" on your voucher</li>
                      <li>• Follow Hiaraise submission process</li>
                      <li>• Upload documents and pay fees</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-400/30 rounded-lg">
                  <h6 className="text-yellow-300 font-semibold mb-1 text-xs">⏰ Important:</h6>
                  <ul className="text-yellow-200 text-xs space-y-1">
                    <li>• Voucher is valid until {voucherData.examDate} at {voucherData.examTime.split(' - ')[1]}</li>
                    <li>• Submit through Hiaraise before expiration</li>
                    <li>• Check your dashboard regularly for updates</li>
                    <li>• Contact support if you have any questions</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Additional Instructions for Approved Vouchers */}
            {!isPendingApproval && (
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-400/30 rounded-lg p-4 mb-4">
                <h5 className="text-blue-300 font-semibold mb-3 text-sm">🎯 Complete Voucher Usage Process:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <h6 className="text-blue-200 font-semibold mb-2">📋 Step 1: Prepare Your Voucher</h6>
                    <ul className="text-blue-100 space-y-1">
                      <li>• Print your voucher from "My Vouchers"</li>
                      <li>• Save voucher code: {voucherData.voucherCode}</li>
                      <li>• Verify exam details and date</li>
                      <li>• Prepare valid government-issued ID</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-purple-200 font-semibold mb-2">🎯 Step 2: Submit Through Hiaraise</h6>
                    <ul className="text-purple-100 space-y-1">
                      <li>• Click "Submit for Exam" on your voucher</li>
                      <li>• Complete Hiaraise submission process</li>
                      <li>• Upload all required documents</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-green-900/20 border border-green-400/30 rounded-lg">
                  <h6 className="text-green-300 font-semibold mb-1 text-xs">✅ What Happens Next:</h6>
                  <ul className="text-green-200 text-xs space-y-1">
                    <li>• Hiaraise handles all exam registration and scheduling</li>
                    <li>• We coordinate with exam centers on your behalf</li>
                    <li>• You receive exam pass confirmation via email</li>
                    <li>• Track your application status in real-time</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/dashboard/user" className="inline-block px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all duration-300 text-sm" onClick={handleGoToDashboard}>
                Go to Dashboard
              </a>
              {!isPendingApproval ? (
                <a href="/my-vouchers" className="inline-block px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all duration-300 text-sm">
                  View My Vouchers
                </a>
              ) : (
                <a href="/voucher-system" className="inline-block px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all duration-300 text-sm" onClick={handleGoToVouchers}>
                  Buy Another Voucher
                </a>
              )}
            </div>
          </div>
        ) : (
          // Regular Payment Success
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
            <a href="/dashboard/user" className="inline-block mt-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all duration-300 text-sm" onClick={handleGoToDashboard}>
              Go to Dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 