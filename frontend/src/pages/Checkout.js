import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { packages } from '../config/packages';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiUpload, FiCheck, FiAlertCircle, FiFile, FiX, FiArrowRight, FiArrowLeft, FiCopy, FiChevronDown, FiChevronUp, FiShield, FiInfo, FiGift, FiHome, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { DOCUMENT_STEPS } from './CaseSubmission';

// Helper function to format time
function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

const BANKS = {
  meezan: {
    title: 'Muhammad Umar Farooq',
    number: '00300112596927',
    bank: 'Meezan Bank',
    instructions: 'Open your banking app → Select Bank Transfer → Choose Meezan Bank → Use Account Number 00300112596927 and Account Title Muhammad Umar Farooq. Add your registered email in transfer remarks for faster verification.',
  },
};

const STEPS = {
  SELECT_PACKAGE: 'select_package',
  PAYMENT_DETAILS: 'payment_details',
  UPLOAD_PROOF: 'upload_proof',
  CONFIRMATION: 'confirmation'
};

const STORAGE_KEY = 'checkout_state';

const StepIndicator = ({ currentStep, steps, isVoucherPurchase, isAppointmentBooking }) => {
  const stepLabels = {
    [STEPS.SELECT_PACKAGE]: 'Select Package',
    [STEPS.PAYMENT_DETAILS]: isVoucherPurchase ? 'Voucher Details' : isAppointmentBooking ? 'Appointment Details' : 'Payment Details',
    [STEPS.UPLOAD_PROOF]: 'Upload Proof',
    [STEPS.CONFIRMATION]: 'Confirmation'
  };

  const stepCount = Object.values(steps).length;
  const currentIndex = Object.values(steps).indexOf(currentStep);

  return (
    <div className="mb-6 md:mb-12 px-4">
      {/* Mobile Progress Bar Stepper */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 font-medium">
            Step {currentIndex + 1} of {stepCount}
          </span>
          <span className="text-xs text-blue-300 font-semibold">
            {stepLabels[currentStep]}
          </span>
        </div>
        <div className="relative w-full flex items-center" style={{ height: 32 }}>
          {/* Progress bar background */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-700 rounded-full w-full z-0" />
          {/* Progress bar fill */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full z-10 transition-all duration-300"
            style={{ width: `${(currentIndex) / (stepCount - 1) * 100}%` }}
          />
          {/* Step circles */}
          {Object.values(steps).map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isActive = idx === currentIndex;
            return (
              <div
                key={step}
                className={`
                  z-20 flex flex-col items-center
                  ${idx === 0 ? 'justify-start' : idx === stepCount - 1 ? 'justify-end' : 'justify-center'}
                  flex-1
                `}
              >
                <div
                  className={`
                    w-6 h-6 flex items-center justify-center rounded-full border-2
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500 text-white shadow-lg'
                      : isCompleted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-500 text-white'
                        : 'bg-gray-800 border-gray-600 text-gray-400'}
                    transition-all duration-300
                  `}
                >
                  {isCompleted ? <FiCheck className="text-xs" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Step Indicator */}
      <div className="hidden sm:flex justify-center">
        <div className="flex items-center space-x-2 md:space-x-4">
          {Object.values(steps).map((step, index) => (
            <div key={step} className="flex items-center">
              <motion.div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold
                  ${currentStep === step 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg' 
                    : Object.values(steps).indexOf(currentStep) > index 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                      : 'bg-gray-700 text-gray-300 border border-gray-600'
                  }
                  transition-all duration-300
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {Object.values(steps).indexOf(currentStep) > index ? (
                  <FiCheck className="text-xl" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
              {index < Object.values(steps).length - 1 && (
                <div className="w-16 md:w-32 h-1 mx-2 relative">
                  <div className="absolute inset-0 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: Object.values(steps).indexOf(currentStep) > index ? '100%' : '0%',
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PackageCard = ({ pkg, onSelect, isSelected }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`
      bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-8 flex flex-col shadow-xl
      ${isSelected ? 'ring-2 ring-blue-500 shadow-2xl' : ''}
      transition-all duration-300
    `}
  >
    <h2 className="text-xl md:text-2xl font-bold text-white mb-3">{pkg.country}</h2>
    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent mb-4">{pkg.displayPrice}</div>
    <p className="mb-4 md:mb-6 text-gray-300 flex-grow leading-relaxed text-sm md:text-base">{pkg.description}</p>
    <h3 className="font-semibold text-gray-200 mb-3 text-sm md:text-base">Process Timeline</h3>
    <ol className="list-decimal ml-4 md:ml-6 mb-4 md:mb-6 text-xs md:text-sm text-gray-300 space-y-1 md:space-y-2">
      {pkg.timeline.map((step, i) => (
        <li key={i} className="leading-relaxed">{step}</li>
      ))}
    </ol>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(pkg)}
      className={`
        mt-auto py-2 md:py-3 px-4 md:px-6 rounded-xl font-semibold shadow-lg text-sm md:text-base
        ${isSelected 
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl' 
          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl'
        }
        transition-all duration-300
      `}
    >
      {isSelected ? 'Selected' : 'Select Package'}
    </motion.button>
  </motion.div>
);

// Modern decent spinner
const DecentSpinner = () => (
  <div className="flex items-center justify-center">
    <span className="relative flex h-16 w-16">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 opacity-40"></span>
      <svg className="relative z-10 animate-spin h-16 w-16 text-blue-400" viewBox="0 0 50 50">
        <circle
          className="opacity-20"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M25 5
            a 20 20 0 0 1 0 40
            a 20 20 0 0 1 0 -40"
        />
      </svg>
    </span>
  </div>
);

const PaymentVerificationLoading = ({ isVisible, state, onTryAgain, tryAgainDisabled, tryAgainSeconds, onBack }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ 
        background: 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.90) 25%, rgba(67,56,202,0.88) 75%, rgba(99,102,241,0.85) 100%)', 
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      {/* Enhanced glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none" />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 text-center shadow-2xl max-w-md mx-4 overflow-hidden"
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.08) 100%)'
        }}
      >
        {/* Enhanced animated floating gradient rings */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-12 bg-gradient-to-r from-cyan-400/20 via-purple-400/30 to-pink-400/20 blur-3xl rounded-full opacity-70 animate-pulse" />
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-8 bg-gradient-to-r from-blue-400/25 via-indigo-400/25 to-purple-400/25 blur-2xl rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }} />
        
        {/* Glass effect inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 rounded-3xl pointer-events-none" />
        {state === 'loading' && (
          <>
            <div className="mb-6 relative z-10">
              <DecentSpinner />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 mt-6 drop-shadow-lg">Verifying Payment</h2>
              <p className="text-blue-100 text-sm md:text-base drop-shadow-md">Please wait while we verify your payment...</p>
            </div>
          </>
        )}
        {state === 'fail' && (
          <>
            <div className="mb-6 flex flex-col items-center relative z-10">
              <span className="relative flex items-center justify-center w-24 h-24 md:w-28 md:h-28 mx-auto mb-4">
                <span className="absolute inline-flex h-full w-full rounded-full bg-gradient-to-tr from-yellow-400/40 via-yellow-500/30 to-yellow-600/20 animate-pulse opacity-90"></span>
                <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-900/50 border-4 border-yellow-400/30 shadow-xl backdrop-blur-sm"></span>
                <FiAlertCircle className="relative z-10 text-yellow-200 drop-shadow-lg" style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 0 12px #fde047aa)' }} />
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-yellow-100 mb-2 drop-shadow-lg">Unable to verify payment. </h2>
              <p className="text-gray-100 text-sm md:text-base mb-6 drop-shadow-md">Please try again or go back to payment details and make payment if you haven't made yet.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  whileHover={!tryAgainDisabled ? { scale: 1.05 } : {}}
                  whileTap={!tryAgainDisabled ? { scale: 0.97 } : {}}
                  onClick={onTryAgain}
                  className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500/90 to-indigo-600/90 shadow-xl backdrop-blur-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base tracking-wide border border-white/20 hover:shadow-2xl`}
                  disabled={tryAgainDisabled}
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.9) 0%, rgba(99,102,241,0.9) 100%)',
                    boxShadow: '0 8px 32px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                  }}
                >
                  {tryAgainDisabled ? `Verify Again (${tryAgainSeconds}s)` : 'Verify Again'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { if (onBack) { onBack(); } }}
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500/90 to-pink-600/90 shadow-xl backdrop-blur-sm transition-all duration-300 text-base tracking-wide border border-white/20 hover:shadow-2xl"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.9) 0%, rgba(236,72,153,0.9) 100%)',
                    boxShadow: '0 8px 32px rgba(168,85,247,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                  }}
                >
                  Go Back & Make Payment
                </motion.button>
              </div>
            </div>
          </>
        )}
        {state === 'final_fail' && (
          <>
            <div className="mb-6 flex flex-col items-center relative z-10">
              <span className="relative flex items-center justify-center w-24 h-24 md:w-28 md:h-28 mx-auto mb-4">
                <span className="absolute inline-flex h-full w-full rounded-full bg-gradient-to-tr from-red-400/40 via-red-500/30 to-red-600/20 animate-pulse opacity-90"></span>
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-900/50 border-4 border-red-400/30 shadow-xl backdrop-blur-sm"></span>
                <FiAlertCircle className="relative z-10 text-red-200 drop-shadow-lg" style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 0 12px #f87171aa)' }} />
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-red-100 mb-2 drop-shadow-lg">Payment not Detected</h2>
              <p className="text-gray-100 text-sm md:text-base drop-shadow-md">Please upload payment proof.</p>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

const PaymentDetails = ({ selectedPackage, additionalDocuments, totalAdditionalCost, bank, onBack, onProceed, milestoneStep, couponCode, setCouponCode, couponError, onApplyCoupon, discountAmount, totalAmount, couponApplied, onRemoveCoupon, loadingCoupon, originalAmount, voucherSlot, appointmentSlot }) => {
  const [copiedField, setCopiedField] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    bankDetails: true,
    coupon: false
  });
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [verificationState, setVerificationState] = useState(null); // null | 'loading' | 'fail' | 'final_fail'
  const [tryAgainDisabled, setTryAgainDisabled] = useState(false);
  const [tryAgainSeconds, setTryAgainSeconds] = useState(15);
  const [tryCount, setTryCount] = useState(0);
  const tryAgainTimerRef = useRef();

  useEffect(() => {
    if (tryAgainDisabled) {
      setTryAgainSeconds(15);
      tryAgainTimerRef.current = setInterval(() => {
        setTryAgainSeconds(prev => {
          if (prev <= 1) {
            clearInterval(tryAgainTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(tryAgainTimerRef.current);
    } else {
      setTryAgainSeconds(15);
      clearInterval(tryAgainTimerRef.current);
    }
  }, [tryAgainDisabled]);

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleProceedWithVerification = async () => {
    setVerificationState('loading');
    setIsVerifyingPayment(true);
    setVerificationMessage('');
    setVerificationProgress(0);
    setTryAgainDisabled(false);
    setTryCount(0);

    setTimeout(() => {
      setVerificationState('fail');
      setIsVerifyingPayment(true);
      setTryAgainDisabled(true);
      setTryCount(1);
      setTryAgainSeconds(15);
      // Enable Try Again after 15s
      setTimeout(() => setTryAgainDisabled(false), 15000);
    }, 7000);
  };

  const handleTryAgain = () => {
    setVerificationState('loading');
    setIsVerifyingPayment(true);
    setTryAgainDisabled(true);
    setTryCount(2);
    setTryAgainSeconds(15);
    setTimeout(() => {
      setVerificationState('final_fail');
      setIsVerifyingPayment(true);
      // After 2s, proceed to upload proof
      setTimeout(() => {
        setIsVerifyingPayment(false);
        setVerificationState(null);
        onProceed();
      }, 2000);
    }, 7000);
  };

  return (
    <>
      <PaymentVerificationLoading
        isVisible={isVerifyingPayment}
        state={verificationState}
        onTryAgain={handleTryAgain}
        tryAgainDisabled={tryAgainDisabled}
        tryAgainSeconds={tryAgainSeconds}
        onBack={onBack}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-8 shadow-xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
          <h2 className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Payment Details
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <FiShield className="text-green-400" />
            <span>Secure Payment</span>
          </div>
        </div>
        
        <div className="space-y-4 md:space-y-6">
          {/* Payment Summary Section */}
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-md">
            <button
              onClick={() => toggleSection('summary')}
              className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                  <FiDollarSign className="text-white text-lg md:text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg md:text-xl text-gray-200">Payment Summary</h3>
                  <p className="text-xs md:text-sm text-gray-400">Review your payment details</p>
                </div>
              </div>
              {expandedSections.summary ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
            </button>
            
            <AnimatePresence>
              {expandedSections.summary && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 md:px-6 pb-4 md:pb-6"
                >
                  <div className="space-y-4">
                    {/* Display Milestone Step Additional Charge if applicable */}
                    {milestoneStep && milestoneStep.additional_charge > 0 ? (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3 md:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white text-sm md:text-base">{milestoneStep.name || 'Additional Charge'}</div>
                            <div className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                              PKR {milestoneStep.additional_charge.toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-white/10 p-2 md:p-3 rounded-full">
                            <FiCreditCard className="text-blue-400 text-lg md:text-xl" />
                          </div>
                        </div>
                      </div>
                    ) : voucherSlot ? (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3 md:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white text-sm md:text-base">{voucherSlot.exam_authority} Exam Voucher</div>
                            <div className="text-xs md:text-sm text-gray-300 mb-1">
                              {voucherSlot.exam_date} • {voucherSlot.start_time.slice(0,5)} - {voucherSlot.end_time.slice(0,5)}
                            </div>
                            <div className="text-xs md:text-sm text-gray-400 mb-1">
                              ${voucherSlot.final_price} USD (Rate: 297 PKR)
                            </div>
                            <div className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                              PKR {Math.round(voucherSlot.final_price * 297).toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-white/10 p-2 md:p-3 rounded-full">
                            <FiGift className="text-green-400 text-lg md:text-xl" />
                          </div>
                        </div>
                      </div>
                    ) : appointmentSlot ? (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3 md:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white text-sm md:text-base">Appointment Booking</div>
                            <div className="text-xs md:text-sm text-gray-300 mb-1">
                              {appointmentSlot.date} • {appointmentSlot.start_time} - {appointmentSlot.end_time}
                            </div>
                            <div className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                              PKR {appointmentSlot.fee.toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-white/10 p-2 md:p-3 rounded-full">
                            <FiCalendar className="text-blue-400 text-lg md:text-xl" />
                          </div>
                        </div>
                      </div>
                    ) : selectedPackage ? (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3 md:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white text-sm md:text-base">{selectedPackage.country}</div>
                            <div className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                              {selectedPackage.displayPrice}
                            </div>
                          </div>
                          <div className="bg-white/10 p-2 md:p-3 rounded-full">
                            <FiCreditCard className="text-blue-400 text-lg md:text-xl" />
                          </div>
                        </div>
                      </div>
                    ) : additionalDocuments.length > 0 && (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3 md:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white text-sm md:text-base">Additional Documents Fee</div>
                            <div className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                              PKR {totalAdditionalCost.toLocaleString()}
                            </div>
                            <div className="text-xs md:text-sm text-gray-300">
                              {additionalDocuments.length} document set(s) to be added
                            </div>
                          </div>
                          <div className="bg-white/10 p-2 md:p-3 rounded-full">
                            <FiFile className="text-blue-400 text-lg md:text-xl" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Coupon Section */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 md:p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <FiGift className="text-purple-400" />
                          <span className="font-semibold text-gray-200 text-sm md:text-base">Promotion / Coupon</span>
                        </div>
                        <button
                          onClick={() => toggleSection('coupon')}
                          className="text-blue-400 hover:text-blue-300 text-xs md:text-sm"
                        >
                          {expandedSections.coupon ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      
                      <AnimatePresence>
                        {expandedSections.coupon && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-3"
                          >
                            {couponApplied ? (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-green-900/20 border border-green-500/30 rounded-lg space-y-2 sm:space-y-0">
                                <div>
                                  <div className="text-green-300 font-bold text-sm md:text-base flex items-center space-x-2">
                                    <span>✓ Coupon Applied: {couponCode}</span>
                                    {couponCode && new URLSearchParams(window.location.search).get('promotion') === couponCode && (
                                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
                                        🎉 AUTO-APPLIED
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-gray-300 text-xs md:text-sm">Discount: PKR {discountAmount?.toLocaleString()}</div>
                                  {couponCode && new URLSearchParams(window.location.search).get('promotion') === couponCode && (
                                    <div className="text-blue-300 text-xs mt-1">Claim successful</div>
                                  )}
                                </div>
                                <button 
                                  onClick={onRemoveCoupon} 
                                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs md:text-sm hover:bg-red-600 transition-colors self-start sm:self-auto"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <form className="flex flex-col sm:flex-row gap-3" onSubmit={e => { e.preventDefault(); onApplyCoupon(); }}>
                                <input
                                  type="text"
                                  className="px-3 md:px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1 text-sm md:text-base"
                                  placeholder="Enter coupon code"
                                  value={couponCode}
                                  onChange={e => setCouponCode(e.target.value)}
                                  disabled={loadingCoupon}
                                />
                                <button
                                  type="submit"
                                  className="px-3 md:px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold shadow hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                  disabled={loadingCoupon || !couponCode}
                                >
                                  {loadingCoupon ? (
                                    <div className="flex items-center space-x-2">
                                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      <span>Applying...</span>
                                    </div>
                                  ) : 'Apply'}
                                </button>
                              </form>
                            )}
                            {couponError && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-xs md:text-sm flex items-center space-x-2"
                              >
                                <FiAlertCircle />
                                <span>{couponError}</span>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Final Amount Breakdown */}
                    <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-lg p-3 md:p-4">
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-gray-300 text-sm md:text-base">Original Amount:</span>
                          <span className="text-gray-300 text-sm md:text-base font-medium">PKR {originalAmount?.toLocaleString()}</span>
                        </div>
                        {couponApplied && (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-green-300 text-sm md:text-base">Discount Applied:</span>
                            <span className="text-green-300 text-sm md:text-base font-medium">- PKR {discountAmount?.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-600 pt-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                            <span className="font-bold text-white text-base md:text-lg">Final Amount:</span>
                            <span className="text-xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                              PKR {totalAmount?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bank Account Details Section */}
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-md">
            <button
              onClick={() => toggleSection('bankDetails')}
              className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
                  <FiHome className="text-white text-lg md:text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg md:text-xl text-gray-200">Bank Account Details</h3>
                  <p className="text-xs md:text-sm text-gray-400">Transfer to our secure account</p>
                </div>
              </div>
              {expandedSections.bankDetails ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
            </button>
            
            <AnimatePresence>
              {expandedSections.bankDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 md:px-6 pb-4 md:pb-6"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3 md:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-xs md:text-sm">Account Title</span>
                          <button
                            onClick={() => copyToClipboard(bank.title, 'title')}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {copiedField === 'title' ? <FiCheck className="text-green-400" /> : <FiCopy />}
                          </button>
                        </div>
                        <span className="font-medium text-white break-all text-sm md:text-base">{bank.title}</span>
                      </div>
                      
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3 md:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-xs md:text-sm">Account Number</span>
                          <button
                            onClick={() => copyToClipboard(bank.number, 'number')}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {copiedField === 'number' ? <FiCheck className="text-green-400" /> : <FiCopy />}
                          </button>
                        </div>
                        <span className="font-medium text-white font-mono break-all text-sm md:text-base">{bank.number}</span>
                      </div>
                      
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3 md:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-xs md:text-sm">Bank Name</span>
                          <button
                            onClick={() => copyToClipboard(bank.bank, 'bank')}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {copiedField === 'bank' ? <FiCheck className="text-green-400" /> : <FiCopy />}
                          </button>
                        </div>
                        <span className="font-medium text-white text-sm md:text-base">{bank.bank}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-lg p-3 md:p-4">
                      <div className="flex items-start space-x-3">
                        <FiInfo className="text-blue-400 mt-1 flex-shrink-0" />
                        <div className="text-gray-300 text-xs md:text-sm leading-relaxed">
                          <div className="font-semibold text-blue-300 mb-1">Transfer Instructions:</div>
                          {bank.instructions}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 md:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm text-gray-400">Payment Progress</span>
              <span className="text-xs md:text-sm text-blue-400">Step 2 of 3</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "66%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Verification Message */}
          {verificationMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm md:text-base flex items-center space-x-3"
            >
              <FiAlertCircle className="text-yellow-400 flex-shrink-0" />
              <span>{verificationMessage}</span>
            </motion.div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/20 space-y-3 sm:space-y-0">
          {!additionalDocuments.length && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="flex items-center justify-center px-4 md:px-6 py-3 bg-gray-700 text-gray-200 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 border border-gray-600 text-sm md:text-base"
              disabled={isVerifyingPayment}
            >
              <FiArrowLeft className="mr-2" />
              Back
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProceedWithVerification}
            disabled={isVerifyingPayment}
            className={`
              flex items-center justify-center px-6 md:px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 text-sm md:text-base
              ${isVerifyingPayment 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl'
              }
            `}
          >
            {isVerifyingPayment ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying Payment...
              </>
            ) : (
              <>
                I've Made the Payment
                <FiArrowRight className="ml-2" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

const UploadProof = ({ onSubmit, onBack, loading, error, screenshot, onScreenshotChange }) => {
  const [fileError, setFileError] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const handleFileSelect = (e) => {
    // Debug logging for mobile file upload issues
    console.log('File input change event triggered:', e.target.files);
    
    const file = e.target.files[0];
    if (!file) {
      setFileError('No file selected. Please try again or check camera permissions.');
      // Reset file input to allow re-selection
      e.target.value = '';
      return;
    }

    console.log('Selected file:', file.name, file.type, file.size);

    setIsProcessingFile(true);
    setFileError('');

    // Enhanced file type validation with iOS compatibility
    const allowedTypes = [
      'image/jpeg', 
      'image/png', 
      'image/jpg', 
      'application/pdf',
      'image/heic',  // iOS HEIC format
      'image/heif'   // iOS HEIF format
    ];
    
    // Check if file type is explicitly allowed or is any image type
    const isValidType = allowedTypes.includes(file.type) || file.type.startsWith('image/');
    
    if (!isValidType) {
      setFileError('Please select a valid file type (JPG, PNG, HEIC, or PDF)');
      setIsProcessingFile(false);
      e.target.value = ''; // Reset file input
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('File size must be less than 5MB');
      setIsProcessingFile(false);
      e.target.value = ''; // Reset file input
      return;
    }

    // Process the file immediately without setTimeout delay
    onScreenshotChange(file);
    setIsProcessingFile(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!screenshot) {
      setFileError('Please select a file to upload');
      return;
    }
    onSubmit(e);
  };

  const handleRemoveFile = () => {
    onScreenshotChange(null);
    setFileError('');
    // Reset file input when removing file
    const fileInput = document.getElementById('screenshot-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-8 shadow-xl"
    >
      <h2 className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-6 md:mb-8">Upload Payment Proof</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        <div>
          <label className="block text-sm md:text-base font-medium text-gray-200 mb-3">
            Upload Payment Screenshot
          </label>
          
          {screenshot ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <FiFile className="text-green-400 text-lg md:text-xl flex-shrink-0" />
                <span className="text-green-200 font-medium truncate text-sm md:text-base">
                  {screenshot.name}
                </span>
                <span className="text-xs text-gray-400">
                  ({(screenshot.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0 ml-2 p-1"
              >
                <FiX className="text-lg md:text-xl" />
              </button>
            </div>
          ) : (
            // Replace div with label for better mobile compatibility
            <label
              htmlFor="screenshot-upload"
              className={`
                relative border-2 border-dashed border-gray-600 rounded-xl p-6 md:p-8 cursor-pointer
                transition-all duration-300 ease-in-out
                hover:border-blue-400 hover:bg-white/5
                ${isProcessingFile ? 'opacity-50 cursor-not-allowed' : ''}
                block
              `}
            >
              <input
                id="screenshot-upload"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,image/heic,image/heif,image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isProcessingFile}
                capture="environment"
              />
              <div className="flex flex-col items-center justify-center text-center">
                {isProcessingFile ? (
                  <>
                    <svg className="animate-spin text-3xl md:text-4xl text-blue-400 mb-3 md:mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-base md:text-lg text-blue-300">Processing file...</p>
                  </>
                ) : (
                  <>
                    <FiUpload className="text-3xl md:text-4xl text-gray-400 mb-3 md:mb-4" />
                    <p className="text-base md:text-lg text-gray-200">
                      Tap to select a file
                    </p>
                    <p className="text-xs md:text-sm text-gray-400 mt-2">
                      Supports JPG, PNG, HEIC, PDF (max 5MB)
                    </p>
                  </>
                )}
              </div>
            </label>
          )}

          {/* File-specific error */}
          {fileError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-900/50 text-red-200 flex items-center border border-red-500/30 shadow-md"
            >
              <FiAlertCircle className="mr-3 text-lg flex-shrink-0" />
              <span className="text-sm">{fileError}</span>
            </motion.div>
          )}
        </div>

        {/* General error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 md:p-4 rounded-xl bg-red-900/50 text-red-200 flex items-center border border-red-500/30 shadow-md"
          >
            <FiAlertCircle className="mr-3 text-lg md:text-xl flex-shrink-0" />
            <span className="text-sm md:text-base">{error}</span>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row justify-between pt-6 md:pt-8 border-t border-white/20 space-y-3 sm:space-y-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="flex items-center justify-center px-4 md:px-6 py-3 bg-gray-700 text-gray-200 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 border border-gray-600 text-sm md:text-base"
            disabled={loading || isProcessingFile}
          >
            <FiArrowLeft className="mr-2" />
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`
              flex items-center justify-center px-6 md:px-8 py-3 rounded-xl font-semibold shadow-lg text-sm md:text-base
              ${loading || isProcessingFile
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl'
              }
              transition-all duration-300
            `}
            disabled={loading || isProcessingFile}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                Submit Payment
                <FiArrowRight className="ml-2" />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

const Confirmation = ({ onDashboard, additionalDocuments }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-8 text-center shadow-xl"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      className="w-20 h-20 md:w-24 md:h-24 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 border border-green-500/30 shadow-md"
    >
      <FiCheck className="text-green-400 text-4xl md:text-5xl" />
    </motion.div>
    
    <h2 className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4 md:mb-6">Payment Submitted Successfully!</h2>
    <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed">
      Thank you for your payment. Our team will review your payment within 15 minutes.
    </p>
    
    <div className="bg-white/5 p-4 md:p-6 rounded-xl mb-8 md:mb-10 border border-white/10 shadow-md">
      <p className="text-gray-300 leading-relaxed text-sm md:text-base">
        You will receive a confirmation email once your payment is verified.
        {additionalDocuments?.length > 0 ? 
          ' After verification, your additional documents will be processed.' :
          ' After verification, you can proceed with submitting your case.'}
      </p>
    </div>
    
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onDashboard}
      className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-base md:text-lg"
    >
      Go to Dashboard
      <FiArrowRight className="ml-2 md:ml-3" />
    </motion.button>
  </motion.div>
);

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const stepId = queryParams.get('step_id');
  const appointmentSlotId = queryParams.get('appointment_slot_id');
  const voucherSlotId = queryParams.get('voucher_slot_id');
  // Assuming case_id is also passed for context if needed

  const isAppointmentBooking = !!appointmentSlotId;
  const isVoucherPurchase = !!voucherSlotId;

  const [currentStep, setCurrentStep] = useState(() => {
    if (isAppointmentBooking || isVoucherPurchase) return STEPS.PAYMENT_DETAILS; // Always start at payment for appointments and vouchers
    // Try to restore state from localStorage
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const { step, selectedPackage: savedPackage } = JSON.parse(savedState);
        // Verify the saved package still exists
        if (savedPackage && packages.find(p => p.id === savedPackage.id)) {
          return step;
        }
      } catch (e) {
        console.error('Error restoring checkout state:', e);
      }
    }
    return STEPS.SELECT_PACKAGE;
  });

  const [selectedPackage, setSelectedPackage] = useState(() => {
    // Try to restore package from localStorage
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const { selectedPackage: savedPackage } = JSON.parse(savedState);
        // Verify the saved package still exists
        if (savedPackage && packages.find(p => p.id === savedPackage.id)) {
          return savedPackage;
        }
      } catch (e) {
        console.error('Error restoring checkout state:', e);
      }
    }
    return null;
  });

  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [additionalDocuments, setAdditionalDocuments] = useState([]);
  const [totalAdditionalCost, setTotalAdditionalCost] = useState(0);
  const [caseId, setCaseId] = useState(null);
  const [milestoneStep, setMilestoneStep] = useState(null);
  const [loadingStep, setLoadingStep] = useState(false);
  const [stepError, setStepError] = useState(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponId, setCouponId] = useState(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const [appointmentSlot, setAppointmentSlot] = useState(null);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentError, setAppointmentError] = useState('');

  // Voucher slot state
  const [voucherSlot, setVoucherSlot] = useState(null);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError, setVoucherError] = useState('');

  // Get additional documents from location state
  useEffect(() => {
    if (location.state) {
      const { additionalDocuments: docs, totalCost, caseId: id } = location.state;
      if (docs && totalCost) {
        setAdditionalDocuments(docs);
        setTotalAdditionalCost(totalCost);
        setCaseId(id);
        // Skip package selection for additional documents
        setCurrentStep(STEPS.PAYMENT_DETAILS);
      }
    }
  }, [location.state]);

  // Load voucher slot data when voucher slot ID is provided
  useEffect(() => {
    if (voucherSlotId) {
      const loadVoucherSlot = async () => {
        setVoucherLoading(true);
        setVoucherError('');
        
        try {
          // First try to get from localStorage (from VoucherPurchaseForm)
          const checkoutData = localStorage.getItem('voucher_checkout_data');
          if (checkoutData) {
            const { voucherSlot: storedSlot } = JSON.parse(checkoutData);
            if (storedSlot && storedSlot.id === voucherSlotId) {
              setVoucherSlot(storedSlot);
              setVoucherLoading(false);
              return;
            }
          }
          
          // If not in localStorage, fetch from database
          const { data, error } = await supabase
            .from('voucher_slots')
            .select('*')
            .eq('id', voucherSlotId)
            .eq('is_available', true)
            .single();

          if (error) {
            throw new Error('Voucher slot not found or no longer available');
          }

          setVoucherSlot(data);
        } catch (err) {
          console.error('Error loading voucher slot:', err);
          setVoucherError(err.message || 'Failed to load voucher slot');
        } finally {
          setVoucherLoading(false);
        }
      };

      loadVoucherSlot();
    }
  }, [voucherSlotId]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (currentStep !== STEPS.CONFIRMATION) { // Don't save after confirmation
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        step: currentStep,
        selectedPackage
      }));
    }
  }, [currentStep, selectedPackage]);

  // Clear saved state when component unmounts or after successful submission
  useEffect(() => {
    return () => {
      if (submitted) {
        localStorage.removeItem(STORAGE_KEY);
      }
    };
  }, [submitted]);

  // Determine the base total amount (original amount before discount) - Define this before onApplyCoupon
  const originalAmount = useMemo(() => {
    if (milestoneStep && milestoneStep.additional_charge > 0) {
      return milestoneStep.additional_charge;
    } else if (voucherSlot) {
      return Math.round(voucherSlot.final_price * 297); // Convert USD to PKR at 297 rate
    } else if (appointmentSlot) {
      return appointmentSlot.fee;
    } else if (selectedPackage) {
      return selectedPackage.price;
    } else {
      // Calculate total for additional documents if no package is selected
      return additionalDocuments.reduce((sum, doc) => {
        const docPrice = DOCUMENT_STEPS
          .flatMap(step => step.documents)
          .find(d => d.key === Object.keys(doc.documents)[0])?.price || 0;
        return sum + docPrice;
      }, 0);
    }
  }, [milestoneStep, voucherSlot, appointmentSlot, selectedPackage, additionalDocuments]);

  // Calculate final amount after discount
  const finalAmount = useMemo(() => {
    if (appointmentSlot) return appointmentSlot.fee;
    if (voucherSlot) return Math.round(voucherSlot.final_price * 297); // Convert USD to PKR at 297 rate
    return Math.max(0, originalAmount - (discountAmount || 0));
  }, [appointmentSlot, voucherSlot, originalAmount, discountAmount]);

  // Always use Meezan Bank for transfers
  const bank = useMemo(() => BANKS.meezan, []);

  // Coupon validation handler - Define this after originalAmount is defined
  const onApplyCoupon = useCallback(async () => {
    setCouponError('');
    setLoadingCoupon(true);
    setDiscountAmount(0);
    setCouponId(null);
    setCouponApplied(false);
    
    try {
      if (!couponCode) {
        setCouponError('Please enter a coupon code.');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCouponError('You must be logged in to apply a coupon.');
        return;
      }

      // Call Supabase RPC to validate coupon
      const { data, error } = await supabase.rpc('validate_coupon', {
        coupon_code: couponCode,
        user_id_param: user.id,
        package_id: selectedPackage?.id || null,
        amount: originalAmount
      });

      if (error) {
        console.error('Coupon validation error:', error);
        setCouponError('Failed to validate coupon. Please try again.');
        return;
      }

      if (!data || !data[0]) {
        setCouponError('Invalid coupon code.');
        return;
      }

      const { is_valid, discount_amount, error_message } = data[0];
      
      if (!is_valid) {
        setCouponError(error_message || 'Invalid coupon code.');
        return;
      }

      // Get coupon id
      const { data: couponRow, error: couponRowError } = await supabase
        .from('coupons')
        .select('id')
        .eq('code', couponCode)
        .single();

      if (couponRowError || !couponRow) {
        setCouponError('Coupon not found.');
        return;
      }

      setDiscountAmount(discount_amount);
      setCouponId(couponRow.id);
      setCouponApplied(true);
      setCouponError('');
      
      // Show success message for promotion coupons
      const promotionCode = new URLSearchParams(location.search).get('promotion');
      if (promotionCode === couponCode) {
        setMessage(`🎉 Promotion coupon "${couponCode}" applied successfully! You saved PKR ${discount_amount.toLocaleString()}.`);
        // Clear the message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      }
      
    } catch (err) {
      console.error('Error applying coupon:', err);
      setCouponError('Error applying coupon. Please try again.');
    } finally {
      setLoadingCoupon(false);
    }
  }, [couponCode, selectedPackage, originalAmount, location.search]);

  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const packageId = params.get('package');
    const promotionCode = params.get('promotion');
    
    if (packageId && !selectedPackage) {
      const pkg = packages.find(p => p.id === packageId);
      if (pkg) {
        setSelectedPackage(pkg);
        setCurrentStep(STEPS.PAYMENT_DETAILS);
      }
    }
    
    // Apply promotion coupon if provided in URL
    if (promotionCode && !couponApplied) {
      setCouponCode(promotionCode);
      // Auto-apply the coupon after a short delay to ensure state is updated
      setTimeout(async () => {
        try {
          await onApplyCoupon();
          console.log('Promotion coupon applied successfully:', promotionCode);
        } catch (error) {
          console.error('Failed to apply promotion coupon:', error);
        }
      }, 1500);
    }
  }, [location.search, selectedPackage, couponApplied, onApplyCoupon]);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Restore state when tab becomes visible
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
          try {
            const { step, selectedPackage: savedPackage } = JSON.parse(savedState);
            if (savedPackage && packages.find(p => p.id === savedPackage.id)) {
              setCurrentStep(step);
              setSelectedPackage(savedPackage);
            }
          } catch (e) {
            console.error('Error restoring checkout state:', e);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // New useEffect to fetch milestone step details if stepId is present
  useEffect(() => {
    const fetchMilestoneStep = async () => {
      if (!stepId) return;

      setLoadingStep(true);
      setStepError(null);
      const { data, error } = await supabase
        .from('milestone_steps')
        .select('*, milestones(case_id)') // Fetch milestone and case_id for context
        .eq('id', stepId)
        .single();

      if (error) {
        console.error('Error fetching milestone step:', error);
        setStepError('Failed to load step details.');
        setMilestoneStep(null);
      } else if (data) {
         // Set caseId if not already present from URL, using fetched data
        if (!caseId && data.milestones?.case_id) {
           queryParams.set('case_id', data.milestones.case_id); // Update query params object
        }
        setMilestoneStep(data);
        // Set to payment details step instead of upload proof
        setCurrentStep(STEPS.PAYMENT_DETAILS);
      } else {
         setStepError('Milestone step not found.');
         setMilestoneStep(null);
      }
      setLoadingStep(false);
    };

    fetchMilestoneStep();
  }, [stepId, caseId, location.search]); // Depend on stepId, caseId and location.search

  const onRemoveCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
    setCouponId(null);
    setCouponApplied(false);
    setCouponError('');
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setCurrentStep(STEPS.PAYMENT_DETAILS);
  };

  const handleProceedToUpload = () => {
    setCurrentStep(STEPS.UPLOAD_PROOF);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage('');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in to submit a payment.');
      setLoading(false);
      return;
    }

    if (appointmentSlot) {
      // Require screenshot for appointment payments
      if (!screenshot) {
        setError('Please upload a payment screenshot.');
        setLoading(false);
        return;
      }
      try {
        // Upload screenshot to Supabase Storage
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(fileName, screenshot);
        if (uploadError) {
          throw new Error('Failed to upload screenshot: ' + uploadError.message);
        }
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(fileName);
        // Create payment record for appointment
        const paymentData = {
          user_id: user.id,
          amount: appointmentSlot.fee,
          status: 'pending',
          appointment_slot_id: appointmentSlot.id,
          screenshot_url: publicUrl,
        };
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .insert([paymentData])
          .select()
          .single();
        if (paymentError) throw new Error('Failed to create payment record: ' + paymentError.message);
        // Create appointment booking
        const { error: bookingError } = await supabase
          .from('appointment_bookings')
          .insert([{
            user_id: user.id,
            slot_id: appointmentSlot.id,
            payment_id: payment.id,
            status: 'pending',
          }]);
        if (bookingError) throw new Error('Failed to create appointment booking: ' + bookingError.message);
        // Mark slot as unavailable
        await supabase
          .from('appointment_slots')
          .update({ is_available: false })
          .eq('id', appointmentSlot.id);
        setSubmitted(true);
        navigate('/thank-you', { state: { success: true } });
        return;
      } catch (err) {
        setError(err.message || 'Failed to submit appointment payment. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (voucherSlot) {
      // Require screenshot for voucher payments
      if (!screenshot) {
        setError('Please upload a payment screenshot.');
        setLoading(false);
        return;
      }
      try {
        // Upload screenshot to Supabase Storage
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(fileName, screenshot);
        if (uploadError) {
          throw new Error('Failed to upload screenshot: ' + uploadError.message);
        }
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(fileName);
        
        // Create payment record for voucher
        const paymentData = {
          user_id: user.id,
          amount: Math.round(voucherSlot.final_price * 297), // Convert USD to PKR
          status: 'pending',
          voucher_slot_id: voucherSlot.id,
          screenshot_url: publicUrl,
          payment_method: 'bank_transfer',
        };
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .insert([paymentData])
          .select()
          .single();
        if (paymentError) throw new Error('Failed to create payment record: ' + paymentError.message);
        
        // Create voucher purchase
        const voucherData = {
          slot_id: voucherSlot.id,
          user_id: user.id,
          payment_id: payment.id,
          // Don't set voucher_code - it will be generated by admin after approval
          exam_authority: voucherSlot.exam_authority,
          final_price_at_purchase: voucherSlot.final_price,
          expires_at: voucherSlot.slot_expires_at || new Date(voucherSlot.exam_date + 'T' + voucherSlot.end_time).toISOString(),
          status: 'pending' // Mark as pending until admin approval
        };
        const { data: voucher, error: voucherError } = await supabase
          .from('voucher_purchases')
          .insert([voucherData])
          .select()
          .single();
        if (voucherError) throw new Error('Failed to create voucher: ' + voucherError.message);
        
        // Clear voucher checkout data from localStorage
        localStorage.removeItem('voucher_checkout_data');
        
        // Debug logging for voucher purchase completion
        console.log('Voucher purchase completed successfully:', {
          voucherId: voucher.id,
          examAuthority: voucherSlot.exam_authority,
          examDate: voucherSlot.exam_date,
          examTime: `${voucherSlot.start_time.slice(0,5)} - ${voucherSlot.end_time.slice(0,5)}`,
          finalPrice: voucherSlot.final_price,
          status: 'purchased'
        });
        
        setSubmitted(true);
        setMessage(`✅ Voucher Purchase Successful! Your ${voucherSlot.exam_authority} voucher has been purchased and the slot is now reserved for you. Your voucher code will be generated after admin approval. Redirecting to confirmation page...`);
        
        // Add a small delay to ensure the success message is visible before redirect
        setTimeout(() => {
          navigate('/thank-you', { 
            state: { 
              success: true, 
              voucherPurchase: true,
              voucherCode: null, // No voucher code yet - pending approval
              examAuthority: voucherSlot.exam_authority,
              examDate: voucherSlot.exam_date,
              examTime: `${voucherSlot.start_time.slice(0,5)} - ${voucherSlot.end_time.slice(0,5)}`,
              finalPrice: voucherSlot.final_price,
              status: 'pending', // Changed from 'purchased' to 'pending' to indicate awaiting approval
              paymentId: payment.id
            } 
          });
        }, 3000); // 3 second delay to show success message
        return;
      } catch (err) {
        setError(err.message || 'Failed to submit voucher payment. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!screenshot) {
      setError('Please upload a payment screenshot.');
      setLoading(false);
      return;
    }

    try {
      // Upload screenshot to Supabase Storage
      const fileExt = screenshot.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, screenshot);

      if (uploadError) {
        throw new Error('Failed to upload screenshot: ' + uploadError.message);
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      // Create payment record
      const paymentData = {
        user_id: user.id,
        amount: finalAmount,
        screenshot_url: publicUrl,
        status: 'pending',
        bank_name: bank.bank,
        account_number: bank.number,
        account_title: bank.title,
        discount_amount: discountAmount,
      };

      // Add case_id if available
      if (caseId) {
        paymentData.case_id = caseId;
      }

      // Add milestone_step_id if available
      if (stepId) {
        paymentData.milestone_step_id = stepId;
      }

      // Add package_id if available
      if (selectedPackage) {
        paymentData.package_id = selectedPackage.id;
      }

      // Add coupon_id if available
      if (couponId) {
        paymentData.coupon_id = couponId;
      }

      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();

      if (paymentError) {
        throw new Error('Failed to create payment record: ' + paymentError.message);
      }

      // If coupon was used, update coupon usage and create usage record
      if (couponId) {
        try {
          // Update coupon usage count
          const { error: updateError } = await supabase
            .from('coupons')
            .update({ used_count: supabase.sql`used_count + 1` })
            .eq('id', couponId);

          if (updateError) {
            console.error('Error updating coupon usage count:', updateError);
          }

          // Create coupon usage record
          const { error: usageError } = await supabase
            .from('coupon_usage')
            .insert({
              coupon_id: couponId,
              user_id: user.id,
              payment_id: payment.id,
              discount_amount: discountAmount,
              original_amount: originalAmount,
              final_amount: finalAmount
            });

          if (usageError) {
            console.error('Error creating coupon usage record:', usageError);
          }
        } catch (couponError) {
          console.error('Error handling coupon usage:', couponError);
          // Don't fail the payment if coupon usage tracking fails
        }
      }

      setSubmitted(true);
      // Redirect to thank you page with state to prevent duplicate conversions
      navigate('/thank-you', { state: { success: true } });
      return;

    } catch (err) {
      console.error('Payment submission error:', err);
      setError(err.message || 'Failed to submit payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  // Fetch appointment slot if appointmentSlotId is present
  useEffect(() => {
    if (appointmentSlotId) {
      setAppointmentLoading(true);
      supabase
        .from('appointment_slots')
        .select('*')
        .eq('id', appointmentSlotId)
        .single()
        .then(({ data, error }) => {
          if (error) setAppointmentError('Failed to load appointment slot.');
          else setAppointmentSlot(data);
          setAppointmentLoading(false);
        });
    }
  }, [appointmentSlotId]);

  if (loadingStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-white text-lg">Loading step details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (stepError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center shadow-xl">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Step</h2>
          <p className="text-gray-300 mb-6">{stepError}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (appointmentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-white text-lg">Loading appointment slot...</span>
          </div>
        </div>
      </div>
    );
  }

  if (voucherLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-8 w-8 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-white text-lg">Loading voucher details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (voucherError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center shadow-xl">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Voucher Slot</h2>
          <p className="text-gray-300 mb-6">{voucherError}</p>
          <button
            onClick={() => navigate('/voucher-system')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
          >
            Back to Voucher System
          </button>
        </div>
      </div>
    );
  }

  if (appointmentError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center shadow-xl">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Appointment Slot</h2>
          <p className="text-gray-300 mb-6">{appointmentError}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden py-6 md:py-12">
      {/* Animated Background Elements - adapted from UserDashboard */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles - adapted from UserDashboard */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6">
        {/* If appointmentSlot, show its details and fee */}
        {appointmentSlot && (
          <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-6 text-center">
            <h2 className="text-xl font-bold text-pink-300 mb-2">Physical Appointment Details</h2>
            <div className="text-white mb-1"><span className="font-semibold">Date:</span> {appointmentSlot.date}</div>
            <div className="text-white mb-1"><span className="font-semibold">Time:</span> {formatTime(appointmentSlot.start_time)} - {formatTime(appointmentSlot.end_time)}</div>
            <div className="text-green-300 font-bold text-lg"><span className="font-semibold">Fee:</span> PKR {appointmentSlot.fee}</div>
          </div>
        )}
        <StepIndicator currentStep={currentStep} steps={STEPS} isVoucherPurchase={isVoucherPurchase} isAppointmentBooking={isAppointmentBooking} />
        
        {/* Success Message Display */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 text-white p-6 rounded-xl shadow-lg border ${
                message.includes('Voucher Purchase Successful') 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400/30' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <FiCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-lg">{message}</span>
                    {message.includes('Payment Submitted Successfully') && (
                      <div className="text-sm text-green-100 mt-1">
                        Please wait while we redirect you to your payment verification status...
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setMessage('')}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          {currentStep === STEPS.SELECT_PACKAGE && (
            <motion.div
              key="select-package"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8 md:mb-12">
                <h1 className="text-2xl md:text-4xl font-display font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-3 md:mb-4">Select Your Package</h1>
                <p className="text-base md:text-xl text-gray-300">Choose the licensing package that best fits your needs</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    onSelect={handlePackageSelect}
                    isSelected={selectedPackage?.id === pkg.id}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === STEPS.PAYMENT_DETAILS && (
            <motion.div
              key="payment-details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentDetails
                selectedPackage={selectedPackage}
                additionalDocuments={additionalDocuments}
                totalAdditionalCost={totalAdditionalCost}
                bank={bank}
                onBack={() => {
                  if (isVoucherPurchase) {
                    navigate('/voucher-system');
                  } else if (isAppointmentBooking) {
                    navigate('/appointments');
                  } else {
                    setCurrentStep(STEPS.SELECT_PACKAGE);
                  }
                }}
                onProceed={handleProceedToUpload}
                milestoneStep={milestoneStep}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                couponError={couponError}
                onApplyCoupon={onApplyCoupon}
                discountAmount={discountAmount}
                totalAmount={finalAmount}
                couponApplied={couponApplied}
                onRemoveCoupon={onRemoveCoupon}
                loadingCoupon={loadingCoupon}
                originalAmount={originalAmount}
                voucherSlot={voucherSlot}
                appointmentSlot={appointmentSlot}
              />
            </motion.div>
          )}

          {currentStep === STEPS.UPLOAD_PROOF && (
            <motion.div
              key="upload-proof"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <UploadProof
                onSubmit={handleSubmit}
                onBack={() => setCurrentStep(STEPS.PAYMENT_DETAILS)}
                loading={loading}
                error={error}
                screenshot={screenshot}
                onScreenshotChange={setScreenshot}
              />
            </motion.div>
          )}

          {currentStep === STEPS.CONFIRMATION && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Confirmation
                onDashboard={handleDashboard}
                additionalDocuments={additionalDocuments}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 
