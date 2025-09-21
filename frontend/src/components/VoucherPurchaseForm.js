import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import VoucherCalendar from './VoucherCalendar';
import CountrySelector from './CountrySelector';
import { FiCalendar, FiCheck, FiDownload, FiShare2, FiClock, FiUser, FiMail, FiPhone, FiAlertCircle, FiInfo, FiDollarSign, FiPercent, FiMapPin, FiGift, FiShield, FiLogIn, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthModal } from '../contexts/AuthModalContext';
import { Link } from 'react-router-dom';

export default function VoucherPurchaseForm({ session }) {
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [purchaseDetails, setPurchaseDetails] = useState(null);
  const [calendarSuccess, setCalendarSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [slotExpired, setSlotExpired] = useState(false);
  const [examCountdown, setExamCountdown] = useState(null);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStatus('');
    setSlotExpired(false);
    // Start timer for slot booking expiration (only if timer is set)
    if (slot.booking_timer_minutes) {
      setTimeLeft(slot.booking_timer_minutes * 60); // Convert to seconds
    } else {
      setTimeLeft(null); // No timer
    }
    
    // Calculate exam countdown
    const examEndTime = new Date(`${slot.exam_date}T${slot.end_time}`);
    const now = new Date();
    const examTimeLeft = examEndTime.getTime() - now.getTime();
    setExamCountdown(examTimeLeft > 0 ? examTimeLeft : 0);
  };

  // Success callback for auth modal
  const handleAuthSuccess = () => {
    // After successful login/register, the session will be updated automatically
    // The component will re-render with the new session and show the purchase button
    console.log('Authentication successful, user can now complete purchase');
    
    // Show a brief success message
    setStatus('auth_success');
    setTimeout(() => {
      setStatus('');
    }, 3000);
  };

  // Timer effect for slot booking expiration and exam countdown
  useEffect(() => {
    if (timeLeft && timeLeft > 0 && selectedSlot) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedSlot) {
      setSlotExpired(true);
      setSelectedSlot(null);
      setTimeLeft(null);
    }
  }, [timeLeft, selectedSlot]);

  // Exam countdown timer effect
  useEffect(() => {
    if (examCountdown !== null && selectedSlot) {
      const timer = setTimeout(() => {
        const now = new Date();
        const examEndTime = new Date(`${selectedSlot.exam_date}T${selectedSlot.end_time}`);
        const newExamCountdown = examEndTime.getTime() - now.getTime();
        setExamCountdown(newExamCountdown > 0 ? newExamCountdown : 0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [examCountdown, selectedSlot]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Format countdown time
  const formatCountdown = (timeLeft) => {
    if (!timeLeft || timeLeft <= 0) return 'Expired';
    
    const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    
    // Double-check slot availability before proceeding to checkout
    const { data: slotData, error: slotError } = await supabase
      .from('voucher_slots')
      .select('is_available, current_bookings, max_capacity')
      .eq('id', selectedSlot.id)
      .single();
      
    if (slotError || !slotData || !slotData.is_available || slotData.current_bookings >= slotData.max_capacity) {
      setStatus('error');
      setLoading(false);
      alert('This voucher slot has just been sold out or is no longer available. Please select another slot.');
      setSelectedSlot(null);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be logged in to purchase a voucher. Please log in or create an account first.');
      setLoading(false);
      return;
    }

    try {
      // Store selected slot in localStorage for checkout
      const checkoutData = {
        type: 'voucher',
        voucherSlot: selectedSlot,
        userInfo: {
          name: user.user_metadata?.full_name || form.name,
          email: user.email || form.email,
          phone: user.user_metadata?.phone || form.phone,
        }
      };
      
      localStorage.setItem('voucher_checkout_data', JSON.stringify(checkoutData));
      
      // Redirect to checkout with voucher slot ID
      navigate(`/checkout?voucher_slot_id=${selectedSlot.id}`);
    } catch (error) {
      console.error('Checkout redirect error:', error);
      setStatus('error');
      setError('Failed to proceed to checkout. Please try again.');
    }
    setLoading(false);
  };


  // Enhanced calendar integration
  const handleAddToCalendar = () => {
    if (!purchaseDetails) return;
    
    const start = new Date(`${purchaseDetails.exam_date}T${purchaseDetails.start_time}`);
    const end = new Date(`${purchaseDetails.exam_date}T${purchaseDetails.end_time}`);
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const startFormatted = formatDate(start);
    const endFormatted = formatDate(end);
    
    const eventTitle = `${purchaseDetails.exam_authority} Exam - Voucher Purchase`;
    const eventDescription = `${purchaseDetails.exam_authority} exam appointment with voucher code: ${purchaseDetails.voucher_code}

Voucher Code: ${purchaseDetails.voucher_code}
Book Exam Price: PKR ${Math.round(purchaseDetails.final_price * 297).toLocaleString()} ($${purchaseDetails.final_price} USD)
${purchaseDetails.is_lifetime_valid ? 'Lifetime Valid' : 'Expires: ' + new Date(purchaseDetails.expires_at).toLocaleString()}

Please arrive 30 minutes early and bring your voucher code and valid ID.`;
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startFormatted}/${endFormatted}&details=${encodeURIComponent(eventDescription)}`;
    
    window.open(googleCalendarUrl, '_blank');
    setCalendarSuccess(true);
    setTimeout(() => setCalendarSuccess(false), 3000);
  };

  // Enhanced printable voucher component
  const PrintableVoucher = () => {
    const examDate = new Date(purchaseDetails.exam_date);
    const dayOfWeek = examDate.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = examDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return (
      <div id="voucher-print" className="bg-white text-black p-8 max-w-2xl mx-auto">
        {/* Print Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <img src="/Prometric-Logo.png" alt="Prometric Logo" className="h-16 w-auto" />
            <div className="text-4xl font-bold text-gray-400">×</div>
            <img src="/logo.png" alt="Hiaraise Logo" className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Exam Voucher</h1>
          <p className="text-lg text-gray-600">Official Exam Authorization Document</p>
        </div>

        {/* Voucher Code - Prominent */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-400 rounded-lg p-6 mb-6 text-center">
          <div className="text-sm text-green-700 mb-2 font-semibold">VOUCHER CODE</div>
          <div className="text-4xl font-bold text-gray-800 font-mono tracking-wider mb-2">
            {purchaseDetails.voucher_code}
          </div>
          <div className="text-sm text-green-600">Present this code at the exam center</div>
        </div>

        {/* Exam Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Exam Authority</div>
              <div className="text-xl font-semibold text-gray-800">{purchaseDetails.exam_authority}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Exam Date</div>
              <div className="text-lg font-semibold text-gray-800">{dayOfWeek}, {formattedDate}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Exam Time</div>
              <div className="text-lg font-semibold text-gray-800">
                {purchaseDetails.start_time?.slice(0,5)} - {purchaseDetails.end_time?.slice(0,5)}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Purchase Price</div>
              <div className="text-xl font-bold text-green-600">PKR {Math.round(purchaseDetails.final_price * 297).toLocaleString()}</div>
              <div className="text-sm text-gray-500">${purchaseDetails.final_price} USD (Rate: 297)</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Validity</div>
              <div className="text-lg font-semibold text-red-600">
                Valid until: {dayOfWeek}, {formattedDate} at {purchaseDetails.end_time?.slice(0,5)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Purchase Date</div>
              <div className="text-lg font-semibold text-gray-800">
                {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Details */}
        <div className="border-t border-gray-300 pt-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Candidate Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Name</div>
              <div className="text-lg font-semibold text-gray-800">{purchaseDetails.name || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Email</div>
              <div className="text-lg font-semibold text-gray-800">{purchaseDetails.email || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Phone</div>
              <div className="text-lg font-semibold text-gray-800">{purchaseDetails.phone || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Important Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">Important Instructions</h3>
          <ul className="space-y-2 text-yellow-700">
            <li>• <strong>Arrive 30 minutes early</strong> - You must arrive at least 30 minutes before your scheduled exam time</li>
            <li>• <strong>Bring valid ID</strong> - Government-issued photo identification is required</li>
            <li>• <strong>Present this voucher</strong> - Show this document and voucher code at the exam center</li>
            <li>• <strong>No rescheduling</strong> - This voucher is valid only for the selected date and time</li>
            <li>• <strong>Keep safe</strong> - Print this voucher and keep it secure until your exam</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-300">
          <p className="text-sm text-gray-500">
            This voucher is valid only until the selected exam date and time. No extensions or rescheduling allowed.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Generated by Hiaraise • {new Date().toISOString()}
          </p>
        </div>
      </div>
    );
  };

  // Success message component
  const SuccessMessage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-br from-green-900/90 to-emerald-900/90 border border-green-400/30 rounded-2xl p-8 mt-6 text-center text-white shadow-2xl"
    >
      {/* Success Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-6">
        <FiGift className="w-8 h-8 text-white" />
      </div>
      
      {/* Success Title */}
      <h3 className="text-2xl font-bold text-green-400 mb-4">
        {purchaseDetails.exam_authority} Voucher Purchase Successful! 🎉
      </h3>
      
      {/* Success Message */}
      <p className="text-gray-200 mb-6 text-lg">
        Your {purchaseDetails.exam_authority} exam voucher has been purchased successfully. 
        <span className="block mt-2 text-red-300 font-semibold">
          ⚠️ Important: This voucher is valid only until {new Date(purchaseDetails.exam_date).toLocaleDateString('en-US', { weekday: 'long' })} at {purchaseDetails.end_time?.slice(0,5)}
        </span>
      </p>
      
      {/* Printable Voucher */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 mb-6">
        <PrintableVoucher />
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center no-print">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.print()}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all duration-200"
        >
          <FiDownload className="w-5 h-5" />
          <span>Print Voucher</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCalendar}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg transition-all duration-200"
        >
          <AnimatePresence mode="wait">
            {calendarSuccess ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center space-x-2"
              >
                <FiCheck className="w-5 h-5" />
                <span>Added!</span>
              </motion.div>
            ) : (
              <motion.div
                key="calendar"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center space-x-2"
              >
                <FiCalendar className="w-5 h-5" />
                <span>Add to Calendar</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/profile')}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg transition-all duration-200"
        >
          <FiUser className="w-5 h-5" />
          <span>View in Profile</span>
        </motion.button>
      </div>
      
      {/* Important Instructions */}
      <div className="mt-6 bg-amber-900/20 border border-amber-400/30 rounded-lg p-4">
        <h5 className="text-amber-300 font-semibold mb-2">📋 Important Instructions:</h5>
        <ul className="text-sm text-amber-200 space-y-1 text-left">
          <li>• Arrive 30 minutes before your exam time</li>
          <li>• Bring a valid government-issued ID</li>
          <li>• Present your voucher code at the exam center</li>
          <li>• Keep this confirmation email as backup</li>
        </ul>
      </div>
    </motion.div>
  );


  return (
    <div className="max-w-4xl mx-auto">
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #voucher-print, #voucher-print * {
            visibility: visible;
          }
          #voucher-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none;
            border: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      {/* Information banner */}
      <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <FiInfo className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-blue-400 font-semibold mb-1">🎫 Flexible Voucher Purchase System</h3>
            <p className="text-blue-200 text-sm">
              Select your preferred exam date and time slot to purchase a voucher for DHA, MOHAP, DOH, QCHP, or SCFHS exams. 
              Each slot has lifetime validity until slots expire, with flexible pricing based on current market rates. Complete your purchase to secure your voucher code.
            </p>
          </div>
        </div>
      </div>

      {/* Only show calendar and form if not in success state */}
      {status !== 'success' && (
        <>
          <VoucherCalendar onSlotSelect={handleSlotSelect} session={session} />
          
          {/* Buy Vouchers Now Button */}
          <div className="text-center mt-8">
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">🎫 Ready to Buy Your Voucher?</h3>
              <p className="text-gray-300 mb-6">Select a slot above to purchase your Prometric exam voucher and save up to 50%!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    // Scroll to first available slot if any
                    const firstSlot = document.querySelector('[data-slot-button]');
                    if (firstSlot) {
                      firstSlot.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      // Add a subtle highlight effect
                      firstSlot.style.transform = 'scale(1.05)';
                      setTimeout(() => {
                        firstSlot.style.transform = '';
                      }, 1000);
                    }
                  }}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🛒 Buy Vouchers Now - Save Up to 50%
                  <FiArrowRight className="w-5 h-5 ml-2" />
                </button>
                <Link 
                  to="/prometric-vouchers" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Learn More About Vouchers
                  <FiArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
              <p className="text-gray-400 text-sm mt-4">Perfect for yourself, family, friends, or clients. Resell to earn money!</p>
            </div>
          </div>

          {selectedSlot && (
            <form
              onSubmit={handleSubmit}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8 space-y-6 mt-6"
            >
              {/* Slot expiry warning with timer */}
              {selectedSlot.booking_timer_minutes ? (
                <div className="bg-amber-900/20 border border-amber-400/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FiAlertCircle className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-200 text-sm font-medium">
                        ⏰ This voucher slot will be held for you while you complete your purchase
                      </span>
                    </div>
                    {timeLeft && (
                      <div className="flex items-center space-x-2">
                        <FiClock className="w-4 h-4 text-amber-400" />
                        <span className={`text-sm font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-amber-300'}`}>
                          {(() => {
                            const days = Math.floor(timeLeft / (24 * 3600));
                            const hours = Math.floor((timeLeft % (24 * 3600)) / 3600);
                            const minutes = Math.floor((timeLeft % 3600) / 60);
                            const seconds = timeLeft % 60;
                            
                            if (days > 0) {
                              return `${days}d ${hours}h ${minutes}m`;
                            } else if (hours > 0) {
                              return `${hours}h ${minutes}m`;
                            } else {
                              return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                            }
                          })()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <FiShield className="w-4 h-4 text-green-400" />
                    <span className="text-green-200 text-sm font-medium">
                      ✅ No time limit - Take your time to complete the purchase
                    </span>
                  </div>
                </div>
              )}

              {/* Slot expired warning */}
              {slotExpired && (
                <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <FiAlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-200 text-sm font-medium">
                      ⚠️ This voucher slot has expired. Please select another slot.
                    </span>
                  </div>
                </div>
              )}

              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent mb-2">
                Complete Your Voucher Purchase
              </h2>

              {/* Selected Slot Summary */}
              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-400/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <FiGift className="w-5 h-5 mr-2 text-green-400" />
                  Selected Voucher Slot
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="w-4 h-4 text-blue-400" />
                      <span className="text-white">{selectedSlot.exam_date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiClock className="w-4 h-4 text-green-400" />
                      <span className="text-white">{selectedSlot.start_time.slice(0,5)} - {selectedSlot.end_time.slice(0,5)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-300 font-semibold">Exam Authority:</span>
                      <span className="text-purple-300 font-bold">{selectedSlot.exam_authority}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-300 font-semibold">Book Exam Price:</span>
                      <div className="text-right">
                        <div className="text-green-300 font-bold text-lg">PKR {Math.round(selectedSlot.final_price * 297).toLocaleString()}</div>
                        <div className="text-green-400 text-sm">${selectedSlot.final_price} USD (Rate: 297)</div>
                      </div>
                    </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-300 font-semibold">Validity:</span>
                      <div className="text-right">
                        <div className="text-blue-300 font-bold">Valid until exam date</div>
                        {examCountdown !== null && (
                          <div className={`text-xs font-bold ${examCountdown <= 0 ? 'text-red-400' : examCountdown < 24 * 60 * 60 * 1000 ? 'text-orange-400' : 'text-green-400'}`}>
                            {examCountdown <= 0 ? 'EXPIRED' : `Expires in: ${formatCountdown(examCountdown)}`}
                      </div>
                    )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Information */}
              <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
                <h4 className="text-blue-300 font-semibold mb-2">🛒 Checkout Process</h4>
                <p className="text-blue-200 text-sm">
                  After completing this form, you'll be redirected to our secure checkout system where you can 
                  complete your payment via bank transfer. Once payment is confirmed, you'll receive your voucher code immediately.
                </p>
              </div>

              {!session ? (
                <div className="space-y-4">
                  <div className="bg-amber-900/20 border border-amber-400/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <FiLogIn className="w-5 h-5 text-amber-400" />
                      <h4 className="text-amber-300 font-semibold">Login Required to Purchase</h4>
                    </div>
                    <p className="text-amber-200 text-sm mb-4">
                      You need to be logged in to complete your voucher purchase. This ensures secure transactions and proper voucher delivery.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => openAuthModal('login', handleAuthSuccess)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
                      >
                        <FiLogIn className="w-4 h-4 inline mr-2" />
                        Login to Purchase
                      </button>
                      <button
                        type="button"
                        onClick={() => openAuthModal('register', handleAuthSuccess)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                      >
                        <FiUser className="w-4 h-4 inline mr-2" />
                        Create Account
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Voucher Terms Link */}
                  <div className="mb-4 text-center">
                    <p className="text-gray-300 text-sm mb-2">
                      By purchasing this voucher, you agree to our terms and conditions.
                    </p>
                    <Link 
                      to="/voucher-terms" 
                      className="inline-flex items-center text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-300"
                    >
                      View Voucher Terms and Conditions
                      <FiArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-60 text-lg"
                    disabled={loading || status === 'error'}
                  >
                    {loading ? 'Proceeding to Checkout...' : `Proceed to Checkout - ${selectedSlot.exam_authority} Voucher - PKR ${Math.round(selectedSlot.final_price * 297).toLocaleString()}`}
                  </button>
                </>
              )}
              
              {status === 'error' && (
                <div className="text-red-400 font-semibold mt-2">
                  {error || 'Purchase failed. The voucher slot may have been sold out. Please select another slot.'}
                </div>
              )}
              
              {status === 'auth_success' && (
                <div className="text-green-400 font-semibold mt-2 flex items-center">
                  <FiCheck className="w-4 h-4 mr-2" />
                  Authentication successful! You can now complete your purchase.
                </div>
              )}
            </form>
          )}
        </>
      )}
      
      {/* Enhanced Success Message */}
      {status === 'success' && purchaseDetails && <SuccessMessage />}
    </div>
  );
}

