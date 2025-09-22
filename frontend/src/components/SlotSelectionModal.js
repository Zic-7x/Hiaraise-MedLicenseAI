import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiX, FiClock, FiCalendar, FiDollarSign, FiMapPin, FiCheck, FiAlertCircle, FiLogIn, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { useAuthModal } from '../contexts/AuthModalContext';

export default function SlotSelectionModal({ 
  open, 
  onClose, 
  selectedSlot, 
  slotType = 'appointment', // 'appointment', 'voucher', 'call'
  session = null 
}) {
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open || !selectedSlot) return null;

  const handleProceedToCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // User is not authenticated, open auth modal with success callback
        const onAuthSuccess = async () => {
          // After successful authentication, proceed with checkout
          await proceedWithCheckout();
        };
        
        openAuthModal('login', onAuthSuccess);
        setLoading(false);
        return;
      }

      // User is authenticated, proceed with checkout
      await proceedWithCheckout();
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
      setError('Failed to proceed to checkout. Please try again.');
      setLoading(false);
    }
  };

  const proceedWithCheckout = async () => {
    try {
      // Verify slot availability before proceeding
      let tableName, idField;
      switch (slotType) {
        case 'appointment':
          tableName = 'appointment_slots';
          idField = 'id';
          break;
        case 'voucher':
          tableName = 'voucher_slots';
          idField = 'id';
          break;
        case 'call':
          tableName = 'call_slots';
          idField = 'id';
          break;
        default:
          throw new Error('Invalid slot type');
      }

      const { data: slotData, error: slotError } = await supabase
        .from(tableName)
        .select('is_available, current_bookings, max_capacity')
        .eq(idField, selectedSlot.id)
        .single();

      if (slotError || !slotData || !slotData.is_available) {
        setError('This slot has just been booked by another user or is no longer available. Please select another slot.');
        return;
      }

      // For voucher slots, check capacity
      if (slotType === 'voucher' && slotData.current_bookings >= slotData.max_capacity) {
        setError('This voucher slot has just been sold out. Please select another slot.');
        return;
      }

      // Track proceed_to_payment event
      if (typeof window !== 'undefined' && window.gtag) {
        let eventCategory = '';
        let eventLabel = '';
        let eventValue = 0;
        
        switch (slotType) {
          case 'appointment':
            eventCategory = 'appointment_booking';
            eventLabel = 'Physical Appointment';
            eventValue = selectedSlot.fee || 0;
            break;
          case 'voucher':
            eventCategory = 'voucher_purchase';
            eventLabel = selectedSlot?.exam_authority || 'Unknown';
            eventValue = selectedSlot?.final_price || 0;
            break;
          case 'call':
            eventCategory = 'call_booking';
            eventLabel = 'Video Call';
            eventValue = selectedSlot.fee || 0;
            break;
        }
        
        window.gtag('event', 'proceed_to_payment', {
          event_category: eventCategory,
          event_label: eventLabel,
          value: eventValue
        });
      }

      // Navigate to checkout based on slot type
      switch (slotType) {
        case 'appointment':
          const formatTime = (isoString) => {
            const date = new Date(isoString);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          };
          navigate(`/checkout?appointment_slot_id=${selectedSlot.id}&fee=${selectedSlot.fee}&date=${selectedSlot.date}&start_time=${formatTime(selectedSlot.start_time)}&end_time=${formatTime(selectedSlot.end_time)}`);
          break;
        case 'voucher':
          // Store voucher data in localStorage for checkout
          const checkoutData = {
            type: 'voucher',
            voucherSlot: selectedSlot,
            userInfo: session ? {
              name: session.user.user_metadata?.full_name,
              email: session.user.email,
              phone: session.user.user_metadata?.phone,
            } : null
          };
          localStorage.setItem('voucher_checkout_data', JSON.stringify(checkoutData));
          navigate(`/checkout?voucher_slot_id=${selectedSlot.id}`);
          break;
        case 'call':
          navigate(`/checkout?call_slot_id=${selectedSlot.id}&fee=${selectedSlot.fee}&date=${selectedSlot.date}&start_time=${selectedSlot.start_time}&end_time=${selectedSlot.end_time}`);
          break;
      }

      onClose();
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
      setError('Failed to proceed to checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSlotTypeInfo = () => {
    switch (slotType) {
      case 'appointment':
        return {
          title: 'Physical Appointment',
          icon: FiCalendar,
          color: 'blue',
          description: 'In-person consultation with our medical licensing experts'
        };
      case 'voucher':
        return {
          title: 'Prometric Exam Voucher',
          icon: FiDollarSign,
          color: 'green',
          description: 'Discounted voucher for your medical licensing exam'
        };
      case 'call':
        return {
          title: 'Consultation Call',
          icon: FiClock,
          color: 'purple',
          description: 'Phone consultation with our licensing specialists'
        };
      default:
        return {
          title: 'Service Slot',
          icon: FiCheck,
          color: 'gray',
          description: 'Selected service slot'
        };
    }
  };

  const slotInfo = getSlotTypeInfo();
  const Icon = slotInfo.icon;

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    try {
      return timeString.slice(0, 5);
    } catch {
      return timeString;
    }
  };

  const getPriceDisplay = () => {
    if (slotType === 'voucher') {
      // For voucher slots, show only the exam booking price (voucher price)
      const voucherPrice = selectedSlot.final_price || selectedSlot.price;
      
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-green-300 font-semibold">Exam Booking Price:</span>
            <span className="text-green-300 font-bold text-xl">${voucherPrice}</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Fee:</span>
          <span className="text-white font-bold text-xl">${selectedSlot.fee || selectedSlot.price}</span>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 w-full max-w-lg mx-4 relative overflow-hidden"
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
        >
          <FiX className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="relative text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-${slotInfo.color}-500/20 to-${slotInfo.color}-600/20 mb-6 border border-${slotInfo.color}-400/30`}>
            <Icon className={`w-10 h-10 text-${slotInfo.color}-400`} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">{slotInfo.title}</h2>
          <p className="text-gray-300 text-base">{slotInfo.description}</p>
        </div>

        {/* Slot Details */}
        <div className="relative space-y-6 mb-8">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <FiCalendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Exam Schedule</span>
            </div>
            <div className="text-gray-300 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FiCalendar className="w-3 h-3 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Exam Date</div>
                  <div className="text-sm font-bold">{formatDate(selectedSlot.date || selectedSlot.exam_date)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <FiClock className="w-3 h-3 text-green-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Exam Time</div>
                  <div className="text-sm font-bold">{formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}</div>
                </div>
              </div>
            </div>
          </div>

          {selectedSlot.location && (
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <FiMapPin className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">Location</span>
              </div>
              <div className="text-gray-300">{selectedSlot.location}</div>
            </div>
          )}

          <div className="bg-white/5 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                <FiDollarSign className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Pricing</span>
            </div>
            {getPriceDisplay()}
          </div>

          {slotType === 'voucher' && selectedSlot.authority && (
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <FiCheck className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">Exam Authority</span>
              </div>
              <div className="text-gray-300">{selectedSlot.authority}</div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-2">
              <FiAlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="relative flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl font-semibold text-gray-300 bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30"
          >
            Cancel
          </button>
          
          {!session ? (
            <div className="flex-1 flex flex-col gap-2">
              <button
                onClick={() => {
                  const onAuthSuccess = async () => {
                    await proceedWithCheckout();
                  };
                  openAuthModal('login', onAuthSuccess);
                }}
                className="w-full px-4 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiLogIn className="w-5 h-5" />
                <span>Login & Continue</span>
              </button>
              <button
                onClick={() => {
                  const onAuthSuccess = async () => {
                    await proceedWithCheckout();
                  };
                  openAuthModal('register', onAuthSuccess);
                }}
                className="w-full px-4 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiUser className="w-5 h-5" />
                <span>Register & Continue</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleProceedToCheckout}
              disabled={loading}
              className={`flex-1 px-6 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-${slotInfo.color}-500 to-${slotInfo.color}-600 hover:from-${slotInfo.color}-600 hover:to-${slotInfo.color}-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <FiCheck className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-xs">
            {!session ? (
              slotType === 'voucher' 
                ? 'Login or register to continue with your voucher purchase'
                : 'Login or register to continue with your booking'
            ) : (
              slotType === 'voucher' 
                ? 'Voucher will be delivered instantly after payment'
                : 'You will receive a confirmation email after booking'
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
