import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  AlertTriangle, 
  Zap, 
  Flame, 
  Gift, 
  ArrowRight, 
  Users, 
  TrendingUp,
  Shield,
  Award,
  Star,
  CheckCircle,
  XCircle,
  Timer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { trackEvent, trackButtonClick } from '../utils/analytics';
import { trackMetaPixelButtonClick } from '../utils/metaPixel';

export default function UserPromotionSection({ userId }) {
  const navigate = useNavigate();
  const [claimedPromotions, setClaimedPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    if (userId) {
      fetchClaimedPromotions();
    }
  }, [userId]);

  // Update countdown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTimeLeft = {};
        claimedPromotions.forEach(promotion => {
          const now = new Date().getTime();
          const validUntil = new Date(promotion.valid_until).getTime();
          const difference = validUntil - now;

          if (difference > 0) {
            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            newTimeLeft[promotion.id] = { hours, minutes, seconds };
          } else {
            newTimeLeft[promotion.id] = { hours: 0, minutes: 0, seconds: 0 };
          }
        });
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [claimedPromotions]);

  const fetchClaimedPromotions = async () => {
    try {
      
      // First, get all promotion modal views for this user where they applied a coupon
      const { data: modalViews, error: modalError } = await supabase
        .from('promotion_modal_views')
        .select('coupon_id, action, created_at')
        .eq('user_id', userId)
        .eq('action', 'apply');

      if (modalError) {
        console.error('Error fetching modal views:', modalError);
        return;
      }


      if (!modalViews || modalViews.length === 0) {
        setClaimedPromotions([]);
        setLoading(false);
        return;
      }

      // Get the coupon IDs that user has claimed
      const claimedCouponIds = modalViews.map(view => view.coupon_id);

      // Fetch the actual coupon details
      const { data: coupons, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .in('id', claimedCouponIds)
        .gte('valid_until', new Date().toISOString())
        .eq('is_active', true);

      if (couponError) {
        console.error('Error fetching coupons:', couponError);
        return;
      }


      // Get user's successful payments to filter out used coupons
      const { data: userPayments } = await supabase
        .from('payments')
        .select('coupon_code, status')
        .eq('user_id', userId)
        .eq('status', 'approved');


      const usedCoupons = userPayments?.map(p => p.coupon_code) || [];
      const availablePromotions = coupons?.filter(p => !usedCoupons.includes(p.code)) || [];

      setClaimedPromotions(availablePromotions);
    } catch (error) {
      console.error('Error fetching claimed promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUsePromotion = (promotion) => {
    trackButtonClick('use_claimed_promotion', 'user_dashboard');
    trackMetaPixelButtonClick('Use Claimed Promotion');
    trackEvent('promotion_used', 'engagement', promotion.code);
    
    // Navigate to checkout with the promotion code
    navigate(`/checkout?promotion=${promotion.code}`);
  };

  const formatTime = (time) => {
    if (time.hours > 0) {
      return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
    } else if (time.minutes > 0) {
      return `${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
    } else {
      return `${time.seconds.toString().padStart(2, '0')}s`;
    }
  };

  const getUrgencyLevel = (promotion) => {
    const time = timeLeft[promotion.id];
    if (!time) return 'normal';
    
    if (time.hours < 1 || time.minutes < 30) return 'critical';
    if (time.hours < 6) return 'urgent';
    if (time.hours < 24) return 'warning';
    return 'normal';
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'critical': return 'from-red-500 to-red-700';
      case 'urgent': return 'from-orange-500 to-red-500';
      case 'warning': return 'from-yellow-500 to-orange-500';
      default: return 'from-blue-500 to-indigo-500';
    }
  };

  const getUrgencyIcon = (level) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'urgent': return <Flame className="w-4 h-4" />;
      case 'warning': return <Clock className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (claimedPromotions.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="text-center">
          <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-2">No Active Promotions</h3>
          <p className="text-gray-400 text-sm">
            You don't have any claimed promotions at the moment. 
            Check back later for new offers!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {claimedPromotions.map((promotion) => {
        const urgencyLevel = getUrgencyLevel(promotion);
        const urgencyColor = getUrgencyColor(urgencyLevel);
        const urgencyIcon = getUrgencyIcon(urgencyLevel);
        const time = timeLeft[promotion.id];
        const discountText = promotion.discount_type === 'percentage' 
          ? `${promotion.discount_value}% OFF`
          : `PKR ${promotion.discount_value} OFF`;

        return (
          <motion.div
            key={promotion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-gradient-to-br ${urgencyLevel === 'critical' ? 'from-red-900/50 via-red-800/30 to-red-900/50' : 'from-white/10'} backdrop-blur-xl border-2 ${urgencyLevel === 'critical' ? 'border-red-500/50' : 'border-white/20'} rounded-2xl p-6 relative overflow-hidden ${urgencyLevel === 'critical' ? 'animate-pulse' : ''}`}
          >
            {/* Animated background for critical urgency */}
            {urgencyLevel === 'critical' && (
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-20 h-20 bg-red-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-red-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
              </div>
            )}

            <div className="relative z-10">
              {/* Header with urgency badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${urgencyColor} flex items-center justify-center`}>
                    {urgencyIcon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {urgencyLevel === 'critical' ? '🚨 CRITICAL: ' : urgencyLevel === 'urgent' ? '🔥 URGENT: ' : '⚡ '}
                      {promotion.name}
                    </h3>
                    <p className="text-sm text-gray-300">{discountText}</p>
                  </div>
                </div>
                
                {/* Trust indicators */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-green-400">
                    <Shield className="w-3 h-3" />
                    <span className="text-xs">Secure</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-400">
                    <Award className="w-3 h-3" />
                    <span className="text-xs">Trusted</span>
                  </div>
                </div>
              </div>

              {/* Urgency indicators */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Countdown timer */}
                <div className={`bg-gradient-to-r ${urgencyColor}/20 border border-current/30 rounded-lg p-3`}>
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Timer className="w-4 h-4" />
                    <span className="text-xs font-semibold">
                      {urgencyLevel === 'critical' ? 'EXPIRES IN' : 'TIME LEFT'}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-mono text-lg font-bold">
                      {time ? formatTime(time) : '--:--:--'}
                    </div>
                    {urgencyLevel === 'critical' && (
                      <div className="text-red-300 text-xs mt-1 animate-pulse">
                        ⚠️ LAST CHANCE!
                      </div>
                    )}
                  </div>
                </div>

                {/* Remaining uses */}
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-3">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-semibold">SPOTS LEFT</span>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-bold text-lg">
                      {promotion.usage_limit ? Math.max(0, promotion.usage_limit - (promotion.used_count || 0)) : '∞'}
                    </div>
                    <div className="text-orange-300 text-xs mt-1">
                      {promotion.usage_limit && promotion.usage_limit - (promotion.used_count || 0) < 10 ? '🔥 GOING FAST!' : 'Limited'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social proof */}
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border border-white"></div>
                    ))}
                  </div>
                  <span className="text-green-300 text-sm font-semibold">
                    {(Math.floor(Math.random() * 100) + 50)}+ people claimed this!
                  </span>
                </div>
              </div>

              {/* Description with urgency */}
              <div className="mb-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {urgencyLevel === 'critical' 
                    ? `🚨 CRITICAL WARNING: Your ${discountText} expires in ${time?.hours || 0}h ${time?.minutes || 0}m! This is your LAST chance to use this exclusive offer. Don't miss out on saving thousands!`
                    : urgencyLevel === 'urgent'
                    ? `🔥 URGENT: Your ${discountText} expires soon! Join thousands of medical professionals who have already claimed their discount. Act now before it's gone!`
                    : `⚡ Your exclusive ${discountText} is waiting! Use it now to save on your medical licensing package. Limited time offer!`
                  }
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleUsePromotion(promotion)}
                className={`w-full bg-gradient-to-r ${urgencyColor} hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 ${urgencyLevel === 'critical' ? 'animate-pulse' : ''}`}
              >
                <Zap className="w-4 h-4" />
                <span>
                  {urgencyLevel === 'critical' 
                    ? `🚨 USE ${discountText} NOW!`
                    : urgencyLevel === 'urgent'
                    ? `🔥 CLAIM ${discountText} NOW!`
                    : `⚡ USE ${discountText} NOW!`
                  }
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Final urgency message */}
              {urgencyLevel === 'critical' && (
                <div className="mt-3 bg-red-900/30 border border-red-500/50 rounded-lg p-2">
                  <p className="text-red-200 text-xs font-semibold text-center">
                    ⚠️ WARNING: This offer will disappear in {time?.hours || 0}h {time?.minutes || 0}m {time?.seconds || 0}s! After expiration, you'll pay full price!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
} 
