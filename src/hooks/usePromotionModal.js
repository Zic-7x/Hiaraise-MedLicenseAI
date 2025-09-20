import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const usePromotionModal = () => {
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [promotionData, setPromotionData] = useState(null);
  const [hasCheckedPromotion, setHasCheckedPromotion] = useState(false);

  const checkForPromotion = async () => {
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
        setShowPromotionModal(true);
      }
    } catch (error) {
      console.error('Error checking for promotion:', error);
    } finally {
      setHasCheckedPromotion(true);
    }
  };

  const closePromotionModal = () => {
    setShowPromotionModal(false);
    setPromotionData(null);
  };

  const applyPromotionCoupon = async (couponCode) => {
    try {
      // This function will be called by the PromotionModal component
      // The actual coupon application logic is handled in the Checkout component
      return { success: true, code: couponCode };
    } catch (error) {
      console.error('Error applying promotion coupon:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    showPromotionModal,
    promotionData,
    hasCheckedPromotion,
    checkForPromotion,
    closePromotionModal,
    applyPromotionCoupon
  };
}; 