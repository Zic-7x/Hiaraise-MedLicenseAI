import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, ArrowRight, CheckCircle, Clock, Users, Flame, UserPlus, AlertTriangle, Zap, Star, TrendingUp, Shield, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { trackModalInteraction, trackButtonClick } from '../utils/analytics';
import { trackMetaPixelModalInteraction } from '../utils/metaPixel';
import { useAuthModal } from '../contexts/AuthModalContext';

export default function LandingPromotionModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const [user, setUser] = useState(null);
  const [promotionData, setPromotionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [claimedCount, setClaimedCount] = useState(0);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [showExitIntent, setShowExitIntent] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    if (isOpen) {
      fetchLandingPromotion();
    }
  }, [isOpen]);

  useEffect(() => {
    if (promotionData && isOpen) {
      // Show modal after delay
      const timer = setTimeout(() => {
        setShowModal(true);
        recordModalView('view');
        trackModalInteraction('landing_promotion_modal', 'open');
        trackMetaPixelModalInteraction('LandingPromotionModal', 'open');
      }, (promotionData.promotion_modal_delay_seconds || 2) * 1000);

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

  // Generate random claimed count and recent purchases for social proof
  useEffect(() => {
    if (promotionData) {
      const baseCount = Math.floor(Math.random() * 150) + 100; // 100-250 base for landing
      const usageCount = promotionData.used_count || 0;
      setClaimedCount(baseCount + usageCount);

      // Generate fake recent purchases for urgency
      const purchases = [
        { name: 'Dr. Sarah A.', time: '2 minutes ago', country: 'UAE' },
        { name: 'Dr. Ahmed K.', time: '4 minutes ago', country: 'Saudi Arabia' },
        { name: 'Dr. Fatima M.', time: '6 minutes ago', country: 'Qatar' },
        { name: 'Dr. Omar R.', time: '8 minutes ago', country: 'Kuwait' },
        { name: 'Dr. Layla S.', time: '10 minutes ago', country: 'Bahrain' }
      ];
      setRecentPurchases(purchases);
    }
  }, [promotionData]);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && showModal) {
        setShowExitIntent(true);
        setTimeout(() => setShowExitIntent(false), 3000);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showModal]);

  const fetchLandingPromotion = async () => {
    try {
      // For landing page, we don't need user authentication
      // We'll fetch promotions that are specifically for new visitors
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('show_in_promotion_modal', true)
        .eq('is_active', true)
        .eq('discount_type', 'percentage') // Only percentage discounts for landing
        .gte('valid_until', new Date().toISOString())
        .lte('valid_from', new Date().toISOString())
        .order('discount_value', { ascending: false }) // Show highest discount first
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching landing promotion:', error);
        return;
      }

      if (data) {
        setPromotionData(data);
      }
    } catch (error) {
      console.error('Error fetching landing promotion:', error);
    }
  };

  const recordModalView = async (action) => {
    if (!promotionData) return;

    try {
      // For landing page, we might not have a user, so we'll track anonymously
      await supabase.rpc('record_promotion_modal_view', {
        coupon_id: promotionData.id,
        user_id: null, // Anonymous user
        action: action
      });
    } catch (error) {
      console.error('Error recording modal view:', error);
    }
  };

  const handleGetStarted = async () => {
    setLoading(true);
    recordModalView('click');
    trackButtonClick('get_started_landing', 'landing_promotion_modal');
    trackMetaPixelModalInteraction('LandingPromotionModal', 'get_started_click');

    try {
      if (user) {
        // User is logged in, redirect to dashboard
        navigate('/dashboard/user');
      } else {
        // User is not logged in, open auth modal
        openAuthModal('register', () => {
          navigate('/dashboard/user');
        });
      }
    } catch (error) {
      console.error('Error handling registration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    onClose();
    trackModalInteraction('landing_promotion_modal', 'close');
    trackMetaPixelModalInteraction('LandingPromotionModal', 'close');
  };

  if (!promotionData || !showModal) return null;

  const discountText = `${promotionData.discount_value}% OFF`;

  const remainingCoupons = promotionData.usage_limit 
    ? Math.max(0, promotionData.usage_limit - (promotionData.used_count || 0))
    : null;

  const isUrgent = timeLeft.hours < 24 || (remainingCoupons && remainingCoupons < 20);
  const isCritical = timeLeft.hours < 6 || (remainingCoupons && remainingCoupons < 5);

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
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        {/* Exit Intent Warning */}
        {showExitIntent && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 z-20"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-semibold">⚠️ WAIT! Don't miss your exclusive offer!</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          className="bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 border-2 border-red-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-red-500/30 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-purple-500/30 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-24 sm:h-24 bg-indigo-500/30 rounded-full blur-xl sm:blur-2xl animate-pulse delay-500"></div>
          </div>

          {/* Urgency Border Animation */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse opacity-20"></div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </button>

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Critical Urgency Badge */}
            {isCritical && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="inline-flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-red-600 to-red-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4 animate-pulse"
              >
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">🚨 CRITICAL: LAST CHANCE!</span>
              </motion.div>
            )}

            {/* New Visitor Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="inline-flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4 animate-pulse"
            >
              <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">🎉 NEW VISITOR EXCLUSIVE!</span>
            </motion.div>

            {/* Urgency Badge */}
            {isUrgent && !isCritical && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4 animate-pulse"
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
                transition={{ delay: 0.25, type: "spring", stiffness: 200 }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg animate-pulse"
              >
                <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-red-400 to-orange-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4"
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">FLASH SALE - ACT NOW!</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2"
              >
                {promotionData.promotion_modal_title || `🚨 URGENT: Get ${discountText} NOW!`}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-300 text-xs sm:text-sm leading-relaxed px-2"
              >
                {promotionData.promotion_modal_description || 
                  `⚠️ WARNING: This exclusive offer expires soon! Join thousands of medical professionals who've already claimed their ${discountText}. Don't miss out on this once-in-a-lifetime opportunity!`}
              </motion.p>
            </div>

            {/* Critical Urgency Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6"
            >
              {/* Countdown Timer */}
              {promotionData.valid_until && (
                <div className={`${isCritical ? 'bg-red-900/50 border-red-500' : 'bg-red-900/30 border-red-500/30'} border-2 rounded-lg sm:rounded-xl p-2 sm:p-3 animate-pulse`}>
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                    <span className="text-red-300 text-xs font-semibold">EXPIRES IN</span>
                  </div>
                  <div className="text-white font-mono text-sm sm:text-lg font-bold">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              )}

              {/* Remaining Coupons */}
              {remainingCoupons !== null && (
                <div className={`${isCritical ? 'bg-orange-900/50 border-orange-500' : 'bg-orange-900/30 border-orange-500/30'} border-2 rounded-lg sm:rounded-xl p-2 sm:p-3 animate-pulse`}>
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

            {/* Recent Purchases - Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-green-900/20 border border-green-500/30 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-4 sm:mb-6"
            >
              <div className="text-center mb-2">
                <span className="text-green-300 text-xs sm:text-sm font-semibold">🔥 LIVE: People claiming now!</span>
              </div>
              <div className="space-y-1">
                {recentPurchases.slice(0, 3).map((purchase, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-300">{purchase.name}</span>
                    </div>
                    <span className="text-green-200 text-xs">{purchase.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-blue-900/20 border border-blue-500/30 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-4 sm:mb-6"
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="flex -space-x-1 sm:-space-x-2">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border border-white sm:border-2"></div>
                  ))}
                </div>
                <span className="text-blue-300 text-xs sm:text-sm font-semibold">
                  {claimedCount}+ medical professionals joined!
                </span>
              </div>
            </motion.div>

            {/* Discount Highlight with Urgency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm border-2 border-red-500/50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 animate-pulse"
            >
              <div className="text-center">
                <p className="text-red-300 text-xs sm:text-sm mb-2">⚡ YOUR EXCLUSIVE DISCOUNT</p>
                <div className="bg-gradient-to-r from-red-400 to-orange-500 text-white font-mono text-lg sm:text-2xl font-bold px-4 py-3 sm:px-6 sm:py-4 rounded-lg animate-pulse">
                  {discountText}
                </div>
                <p className="text-red-300 text-xs sm:text-sm mt-2 font-semibold">
                  ⚠️ Available ONLY for new users - Claim now!
                </p>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="grid grid-cols-3 gap-2 mb-4 sm:mb-6"
            >
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mx-auto mb-1" />
                <span className="text-green-300 text-xs">100% Secure</span>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mx-auto mb-1" />
                <span className="text-blue-300 text-xs">Trusted Platform</span>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mx-auto mb-1" />
                <span className="text-purple-300 text-xs">Proven Results</span>
              </div>
            </motion.div>

            {/* CTA Button with Maximum Urgency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <button
                onClick={handleGetStarted}
                disabled={loading}
                className={`w-full ${isCritical ? 'bg-gradient-to-r from-red-500 to-red-700 animate-pulse' : 'bg-gradient-to-r from-red-400 to-orange-500'} hover:from-red-500 hover:to-orange-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base border-2 border-red-300/50`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>🚨 CLAIM {discountText} NOW!</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </button>
            </motion.div>

            {/* Final Urgency Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-red-300 text-xs mt-3 sm:mt-4 px-2 font-semibold"
            >
              ⚠️ This offer will disappear in {timeLeft.hours > 0 ? `${timeLeft.hours}h ${timeLeft.minutes}m` : `${timeLeft.minutes}m ${timeLeft.seconds}s`} • Only {remainingCoupons} spots left • Don't miss out!
            </motion.p>

            {/* Scarcity Warning */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mt-2 bg-red-900/30 border border-red-500/50 rounded-lg p-2"
            >
              <p className="text-red-200 text-xs font-semibold">
                🔥 WARNING: This is your ONLY chance to get {discountText}. After this offer expires, you'll pay full price!
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 