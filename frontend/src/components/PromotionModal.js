import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, ArrowRight, CheckCircle, Clock, Users, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { trackModalInteraction, trackButtonClick } from '../utils/analytics';
import { trackMetaPixelModalInteraction } from '../utils/metaPixel';

export default function PromotionModal({ isOpen, onClose, onCouponApplied }) {
  const navigate = useNavigate();
  const [promotionData, setPromotionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [claimedCount, setClaimedCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchActivePromotion();
    }
  }, [isOpen]);

  useEffect(() => {
    if (promotionData && isOpen) {
      // Show modal after delay
      const timer = setTimeout(() => {
        setShowModal(true);
        recordModalView('view');
        trackModalInteraction('promotion_modal', 'open');
        trackMetaPixelModalInteraction('PromotionModal', 'open');
      }, (promotionData.promotion_modal_delay_seconds || 3) * 1000);

      return () => clearTimeout(timer);
    }
  }, [promotionData, isOpen]);

  // Countdown timer effect
  useEffect(() => {
    if (!promotionData?.valid_until) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const validUntil = new Date(promotionData.valid_until).getTime();
      const difference = validUntil - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [promotionData]);

  // Generate random claimed count for social proof
  useEffect(() => {
    if (promotionData) {
      const baseCount = Math.floor(Math.random() * 50) + 20; // 20-70 base
      const usageCount = promotionData.used_count || 0;
      setClaimedCount(baseCount + usageCount);
    }
  }, [promotionData]);

  const fetchActivePromotion = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.rpc('get_active_promotion_modal', {
        user_id: user.id
      });

      if (error) {
        console.error('Error fetching promotion:', error);
        return;
      }

      if (data && data.length > 0) {
        setPromotionData(data[0]);
      }
    } catch (error) {
      console.error('Error fetching promotion:', error);
    }
  };

  const recordModalView = async (action) => {
    if (!promotionData) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.rpc('record_promotion_modal_view', {
        coupon_id: promotionData.coupon_id,
        user_id: user.id,
        action: action
      });
    } catch (error) {
      console.error('Error recording modal view:', error);
    }
  };

  const handleClaimOffer = async () => {
    setLoading(true);
    recordModalView('click');
    trackButtonClick('claim_promotion', 'promotion_modal');
    trackMetaPixelModalInteraction('PromotionModal', 'claim_click');

    try {
      // Apply the coupon automatically
      if (onCouponApplied && promotionData) {
        await onCouponApplied(promotionData.code);
        setApplied(true);
        recordModalView('apply');
        trackModalInteraction('promotion_modal', 'coupon_applied');
        trackMetaPixelModalInteraction('PromotionModal', 'coupon_applied');
        
        // Redirect to checkout with the promotion code
        setTimeout(() => {
          navigate(`/checkout?promotion=${promotionData.code}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error applying promotion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    onClose();
    trackModalInteraction('promotion_modal', 'close');
    trackMetaPixelModalInteraction('PromotionModal', 'close');
  };

  if (!promotionData || !showModal) return null;

  const discountText = promotionData.discount_type === 'percentage' 
    ? `${promotionData.discount_value}% OFF`
    : `PKR ${promotionData.discount_value} OFF`;

  const remainingCoupons = promotionData.usage_limit 
    ? Math.max(0, promotionData.usage_limit - (promotionData.used_count || 0))
    : null;

  const isUrgent = timeLeft.hours < 24 || (remainingCoupons && remainingCoupons < 10);

  // Format time display for better readability
  const formatTime = (time) => {
    if (time.hours > 0) {
      return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
    } else if (time.minutes > 0) {
      return `${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
    } else {
      return `${time.seconds.toString().padStart(2, '0')}s`;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          className="bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-purple-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-pink-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-24 sm:h-24 bg-indigo-500/20 rounded-full blur-xl sm:blur-2xl animate-pulse delay-500"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </button>

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Urgency Badge */}
            {isUrgent && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="inline-flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4 animate-pulse"
              >
                <Flame className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">🔥 LIMITED TIME OFFER!</span>
              </motion.div>
            )}

            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg"
              >
                <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">SPECIAL OFFER</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2"
              >
                {promotionData.promotion_modal_title || `Get ${discountText}!`}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-300 text-xs sm:text-sm leading-relaxed px-2"
              >
                {promotionData.promotion_modal_description || 
                  `Exclusive offer for new visitors! Use code ${promotionData.code} to get ${discountText} on your medical licensing package.`}
              </motion.p>
            </div>

            {/* Urgency Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6"
            >
              {/* Countdown Timer */}
              {promotionData.valid_until && (
                <div className="bg-red-900/30 border border-red-500/30 rounded-lg sm:rounded-xl p-2 sm:p-3">
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                    <span className="text-red-300 text-xs font-semibold">TIME LEFT</span>
                  </div>
                  <div className="text-white font-mono text-sm sm:text-lg font-bold">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              )}

              {/* Remaining Coupons */}
              {remainingCoupons !== null && (
                <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg sm:rounded-xl p-2 sm:p-3">
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                    <span className="text-orange-300 text-xs font-semibold">LEFT</span>
                  </div>
                  <div className="text-white font-bold text-sm sm:text-lg">
                    {remainingCoupons}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-green-900/20 border border-green-500/30 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-4 sm:mb-6"
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="flex -space-x-1 sm:-space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border border-white sm:border-2"></div>
                  ))}
                </div>
                <span className="text-green-300 text-xs sm:text-sm font-semibold">
                  {claimedCount}+ claimed!
                </span>
              </div>
            </motion.div>

            {/* Coupon Code Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6"
            >
              <div className="text-center">
                <p className="text-gray-300 text-xs sm:text-sm mb-2">Your Coupon Code</p>
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-mono text-sm sm:text-lg font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-lg">
                  {promotionData.code}
                </div>
                <p className="text-green-300 text-xs sm:text-sm mt-2 font-semibold">
                  {discountText} will be applied automatically!
                </p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              {applied ? (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Coupon Applied Successfully!</span>
                </div>
              ) : (
                <button
                  onClick={handleClaimOffer}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 animate-pulse text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span>Applying...</span>
                    </>
                  ) : (
                    <>
                      <span>{promotionData.promotion_modal_button_text || 'Claim Offer'}</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </>
                  )}
                </button>
              )}
            </motion.div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-gray-400 text-xs mt-3 sm:mt-4 px-2"
            >
              ⚡ Limited time offer • One use per customer • Don't miss out!
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 
