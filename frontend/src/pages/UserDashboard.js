// src/pages/UserDashboard.js
import React, { useOutletContext, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import WelcomeModal from '../components/WelcomeModal';
import PromotionModal from '../components/PromotionModal';
import UserPromotionSection from '../components/UserPromotionSection';
import { usePromotionModal } from '../hooks/usePromotionModal';
import BookPhysicalAppointmentModal from '../components/BookPhysicalAppointmentModal';
import UserAppointmentHistory from './UserAppointmentHistory';
import BookingForm from '../components/BookingForm';
import ChatWidget from '../components/ChatWidget';
import { 
  User, 
  FileText, 
  Settings, 
  Bell, 
  Plus, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Zap,
  Brain,
  Sparkles,
  ArrowRight,
  Activity,
  Shield,
  Globe,
  Heart,
  Gift,
  ChevronDown,
  ChevronUp,
  Filter,
  Eye,
  EyeOff,
  Calendar,
  Phone,
  MessageCircle,
  MapPin,
  Info,
  X
} from 'lucide-react';
import { trackEvent, trackButtonClick, trackPageView } from '../utils/analytics';
import { useAnalytics } from '../utils/useAnalytics';
import { trackMetaPixelViewContent, trackMetaPixelButtonClick } from '../utils/metaPixel';

export const CASE_TYPE_LABELS = {
  saudi: 'Saudi Arabia',
  uae: 'UAE',
  qatar: 'Qatar',
};

// Add theme constants at the top after imports
const THEME = {
  primary: 'bg-gradient-to-r from-blue-600 to-indigo-700',
  secondary: 'bg-gradient-to-r from-purple-600 to-pink-600',
  success: 'bg-gradient-to-r from-green-500 to-emerald-600',
  danger: 'bg-gradient-to-r from-red-500 to-rose-600',
  warning: 'bg-gradient-to-r from-yellow-400 to-amber-500',
  info: 'bg-gradient-to-r from-cyan-500 to-blue-500',
  dark: 'bg-gradient-to-r from-gray-800 to-gray-900',
  light: 'bg-gradient-to-r from-gray-100 to-gray-200',
  card: 'bg-white/10 backdrop-blur-xl border border-white/20',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20'
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'from-amber-400 to-orange-500',
    approved: 'from-emerald-400 to-green-500',
    rejected: 'from-red-400 to-rose-500',
    under_review: 'from-blue-400 to-indigo-500',
    completed: 'from-purple-400 to-violet-500'
  };
  return colors[status] || 'from-gray-400 to-gray-500';
};

// Stats configuration with icons and tooltips
const STATS_CONFIG = {
  totalCases: {
    icon: FileText,
    tooltip: "Total number of cases submitted",
    color: "from-blue-500 to-cyan-500"
  },
  pendingCases: {
    icon: Clock,
    tooltip: "Cases awaiting review or approval",
    color: "from-amber-400 to-orange-500"
  },
  underReviewCases: {
    icon: Activity,
    tooltip: "Cases currently under review",
    color: "from-blue-400 to-indigo-500"
  },
  approvedCases: {
    icon: CheckCircle,
    tooltip: "Successfully approved cases",
    color: "from-emerald-400 to-green-500"
  },
  rejectedCases: {
    icon: XCircle,
    tooltip: "Cases that were rejected",
    color: "from-red-400 to-rose-500"
  }
};

export default function UserDashboard() {
  const { role } = useOutletContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCases: 0,
    pendingCases: 0,
    approvedCases: 0,
    rejectedCases: 0,
    underReviewCases: 0
  });
  const [recentCases, setRecentCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [caseFilter, setCaseFilter] = useState('all');
  const [userProfile, setUserProfile] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [hasPurchasedPackage, setHasPurchasedPackage] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [callAppointments, setCallAppointments] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState({
    promotions: false,
    appointments: false
  });
  
  // Animation states
  const [sectionsLoaded, setSectionsLoaded] = useState(false);
  
  // Promotion modal hook
  const {
    showPromotionModal,
    promotionData,
    hasCheckedPromotion,
    checkForPromotion,
    closePromotionModal,
    applyPromotionCoupon
  } = usePromotionModal();
  
  // Enable automatic page tracking
  useAnalytics();

  useEffect(() => {
    fetchDashboardData();
    fetchAppointments();
    
    // Track page view
    trackPageView('/dashboard/user');
    trackEvent('page_viewed', 'engagement', 'user_dashboard');
    trackMetaPixelViewContent('User Dashboard');
    
    // Trigger section animations after a short delay
    const timer = setTimeout(() => setSectionsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Filter cases when caseFilter or recentCases change
  useEffect(() => {
    if (caseFilter === 'all') {
      setFilteredCases(recentCases);
    } else {
      setFilteredCases(recentCases.filter(case_item => case_item.status === caseFilter));
    }
  }, [caseFilter, recentCases]);

  // Check for promotion modal after dashboard data is loaded
  useEffect(() => {
    if (!loading && !hasPurchasedPackage && !hasCheckedPromotion) {
      // Small delay to ensure user sees the dashboard first
      const timer = setTimeout(() => {
        checkForPromotion();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, hasPurchasedPackage, hasCheckedPromotion, checkForPromotion]);

  const fetchDashboardData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    setUserProfile(profile);

    // Fetch notifications
    const { data: notifs } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    setNotifications(notifs || []);

    // Fetch case statistics
    const { data: cases } = await supabase
      .from('cases')
      .select('status')
      .eq('user_id', user.id);

    if (cases) {
      const stats = {
        totalCases: cases.length,
        pendingCases: cases.filter(c => c.status === 'pending').length,
        approvedCases: cases.filter(c => c.status === 'approved').length,
        rejectedCases: cases.filter(c => c.status === 'rejected').length,
        underReviewCases: cases.filter(c => c.status === 'under_review').length
      };
      setStats(stats);
    }

    // Fetch recent cases with more details
    const { data: recent, error: recentCasesError } = await supabase
      .from('cases')
      .select(`
        *,
        payments!payments_case_id_fkey(id, amount, status, screenshot_url)
      `)
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false })
      .limit(3);

    if (recentCasesError) {
      console.error('Error fetching recent cases:', recentCasesError);
      setRecentCases([]);
    } else {
      setRecentCases(recent || []);
    }

    // Fetch payment status (most recent for banner)
    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    setPaymentStatus(payment);

    // Check if user has purchased a package (has approved payments)
    const { data: approvedPayments, error: paymentError } = await supabase
      .from('payments')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'approved');

    const hasPackage = !paymentError && approvedPayments && approvedPayments.length > 0;
    setHasPurchasedPackage(hasPackage);

    // Show welcome modal if user hasn't purchased a package
    if (!hasPackage) {
      setShowWelcomeModal(true);
    }

    setLoading(false);
  };

  const fetchAppointments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    // Fetch physical appointments
    const { data: physical, error: physicalError } = await supabase
      .from('appointment_bookings')
      .select('*, appointment_slots(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!physicalError) setAppointments(physical || []);
    // Fetch call appointments
    const { data: calls, error: callError } = await supabase
      .from('call_bookings')
      .select('*, call_slots(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!callError) setCallAppointments(calls || []);
  };

  const markAsRead = async (id) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
  
    if (error) {
      console.error('Error marking notification as read:', error.message);
      return;
    }
  
    // Update local state to avoid re-fetch
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    trackEvent('welcome_modal_closed', 'engagement', 'user_dashboard');
  };

  const handleGetStartedClick = () => {
    trackButtonClick('get_started', 'user_dashboard');
    trackMetaPixelButtonClick('Get Started', 'User Dashboard');
    setShowWelcomeModal(true);
  };

  const handleAIAssistantClick = () => {
    trackButtonClick('ai_assistant', 'user_dashboard');
    trackMetaPixelButtonClick('AI Assistant', 'User Dashboard');
    
    console.log('AI Assistant button clicked');
    
    // Try multiple methods to open the chat widget
    if (window.openAgentiveChat) {
      console.log('Opening chat via openAgentiveChat');
      window.openAgentiveChat();
    } else if (window.myChatWidget && typeof window.myChatWidget.open === 'function') {
      console.log('Opening chat via myChatWidget.open');
      window.myChatWidget.open();
    } else {
      console.log('Chat widget not available, trying to find and click floating button...');
      
      // Try to find the floating chat button with multiple selectors
      const selectors = [
        '[data-chat-widget-button]',
        '.chat-widget-button',
        '[class*="chat"]',
        '[class*="Chat"]',
        'button[aria-label*="chat" i]',
        'button[aria-label*="Chat" i]',
        '[id*="chat"]',
        '[id*="Chat"]',
        'div[style*="position: fixed"] button',
        'div[style*="position:fixed"] button'
      ];
      
      let floatingButton = null;
      for (const selector of selectors) {
        floatingButton = document.querySelector(selector);
        if (floatingButton) {
          console.log(`Found chat button with selector: ${selector}`);
          break;
        }
      }
      
      if (floatingButton) {
        console.log('Clicking floating chat button');
        floatingButton.click();
      } else {
        console.warn('Chat widget floating button not found. Trying to initialize...');
        
        // If the widget isn't loaded yet, try to trigger it
        if (window.myChatWidget && typeof window.myChatWidget.load === 'function') {
          window.myChatWidget.load({
            id: '94a0718b-11e6-4a56-bf6e-1a732b611836',
            autoOpen: false,
            showFloatingButton: true,
          });
          
          // Try to open after a short delay
          setTimeout(() => {
            if (window.myChatWidget && typeof window.myChatWidget.open === 'function') {
              console.log('Opening chat after initialization');
              window.myChatWidget.open();
            } else {
              // Try to find and click the button again
              setTimeout(() => {
                for (const selector of selectors) {
                  const button = document.querySelector(selector);
                  if (button) {
                    console.log(`Found and clicking chat button after delay with selector: ${selector}`);
                    button.click();
                    return;
                  }
                }
              }, 2000);
            }
          }, 1000);
        } else {
          console.error('Chat widget not found. Please ensure ChatWidget component is loaded.');
        }
      }
    }
  };

  const handleCaseClick = (caseId) => {
    trackEvent('case_clicked', 'engagement', 'user_dashboard', caseId);
  };

  const handleNotificationClick = (notificationId) => {
    trackEvent('notification_clicked', 'engagement', 'user_dashboard', notificationId);
  };

  // Get unread notifications count
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // If admin tries to access user page, send them to admin
  if (role === "admin") {
    return <Navigate to="/dashboard/admin" replace />;
  }

  // Remove the loading check here since ProtectedLayout handles it

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
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

      <div className="relative z-10 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
          {/* Welcome Section */}
          <div className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 lg:p-8 shadow-2xl relative overflow-hidden transition-all duration-700 ${sectionsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-gradient-x"></div>
            <div className="relative z-10">
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-3 lg:mb-4">
                Welcome back, {userProfile?.full_name || 'User'}!
              </h1>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
                Track your medical licensing applications with AI-powered insights
              </p>
            </div>
          </div>

          {/* Primary Action Buttons - Improved Sizing */}
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 transition-all duration-700 ${sectionsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Get License Button */}
            <Link 
              to="/submit-case" 
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden block"
              aria-label="Get your medical license"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 animate-pulse"></div>
              <div className="relative z-10 flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg sm:text-xl text-white group-hover:text-blue-200 transition-colors">
                    Get Your Medical License
                  </h3>
                  <p className="text-blue-100 text-sm sm:text-base mt-1">Start your licensing journey</p>
                </div>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </div>
            </Link>

            {/* My Cases Button */}
            <Link 
              to="/my-cases" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden block"
              aria-label="View all my cases"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"></div>
              <div className="relative z-10 flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg sm:text-xl text-white group-hover:text-purple-200 transition-colors">
                    My Cases
                  </h3>
                  <p className="text-purple-100 text-sm sm:text-base mt-1">Track your applications</p>
                </div>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </div>
            </Link>

            {/* My Vouchers Button */}
            <Link 
              to="/my-vouchers" 
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden block"
              aria-label="View my vouchers"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-600/20 animate-pulse"></div>
              <div className="relative z-10 flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center flex-shrink-0">
                  <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg sm:text-xl text-white group-hover:text-green-200 transition-colors">
                    My Vouchers
                  </h3>
                  <p className="text-green-100 text-sm sm:text-base mt-1">Manage exam vouchers</p>
                </div>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </div>
            </Link>
          </div>

          {/* Support Button */}
          <div className={`transition-all duration-700 ${sectionsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link 
              to="/support-tickets" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden block"
              aria-label="Get support help"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 animate-pulse"></div>
              <div className="relative z-10 flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg sm:text-xl text-white group-hover:text-orange-200 transition-colors">
                    Get Support
                  </h3>
                  <p className="text-orange-100 text-sm sm:text-base mt-1">Need help? Contact our support team</p>
                </div>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </div>
            </Link>
          </div>

          {/* AI Assistant - Enhanced Mobile Design */}
          <div className={`transition-all duration-700 ${sectionsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-indigo-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col space-y-4">
                {/* Header Section */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-base sm:text-lg">AI Assistant Ready</h3>
                    <p className="text-indigo-200 text-sm sm:text-base">Click the chat button to start chatting with our AI assistant</p>
                  </div>
                </div>
                
                {/* Features List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center space-x-2 text-indigo-200">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>24/7 Available</span>
                  </div>
                  <div className="flex items-center space-x-2 text-indigo-200">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>Instant Answers</span>
                  </div>
                  <div className="flex items-center space-x-2 text-indigo-200">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>Licensing Expertise</span>
                  </div>
                  <div className="flex items-center space-x-2 text-indigo-200">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>Document Help</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status Banner */}
          {paymentStatus && paymentStatus.status === 'pending' && (
            <div className={`bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 shadow-xl transition-all duration-700 ${sectionsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Payment Verification Pending</h3>
                    <p className="text-amber-100 text-sm">
                      Your payment is being verified. You can submit a case once the payment is approved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Cases Section */}
          <div className={`transition-all duration-700 ${sectionsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Stats Grid - Mobile Optimized */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6">
              {Object.entries(stats).map(([key, value]) => {
                const config = STATS_CONFIG[key];
                const IconComponent = config.icon;
                return (
                  <div 
                    key={key}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group cursor-help"
                    title={config.tooltip}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-400 text-xs sm:text-sm font-medium truncate">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{value}</p>
                  </div>
                );
              })}
            </div>

            {/* Recent Cases with Filter - Mobile Optimized */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                    Recent Cases
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                    <span className="text-xs sm:text-sm text-gray-300">AI Enhanced</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <select
                    value={caseFilter}
                    onChange={(e) => setCaseFilter(e.target.value)}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 flex-1 sm:flex-none"
                    aria-label="Filter cases by status"
                  >
                    <option value="all">All Cases</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-4">
                {filteredCases.length === 0 ? (
                  <div className="text-center py-8">
                    <Globe className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No cases found with the selected filter.</p>
                  </div>
                ) : (
                  filteredCases.map((case_item) => (
                    <Link 
                      to={`/my-cases/${case_item.id}`}
                      key={case_item.id}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 sm:p-4 hover:bg-white/15 transition-all duration-300 group cursor-pointer block transform hover:scale-[1.02]"
                      onClick={() => handleCaseClick(case_item.id)}
                      aria-label={`View ${CASE_TYPE_LABELS[case_item.case_type] || case_item.case_type} case details`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors text-sm sm:text-base truncate">
                              {CASE_TYPE_LABELS[case_item.case_type] || case_item.case_type}
                            </h3>
                            <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-400">
                              <span>{new Date(case_item.submitted_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(case_item.status)} text-white`}>
                            {case_item.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>


          {/* Notifications Section */}
          <div className={`transition-all duration-700 ${sectionsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                    AI Notifications
                  </h2>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                  {unreadNotifications > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 font-bold">
                      {unreadNotifications}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No notifications yet.</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 sm:p-4 transition-all duration-300 group ${!notification.read ? 'ring-2 ring-blue-500/50' : ''}`}
                    >
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div className="mt-0.5 sm:mt-1 flex-shrink-0">
                          <Bell className={`w-4 h-4 sm:w-5 sm:h-5 ${notification.read ? 'text-gray-500' : 'text-blue-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs sm:text-sm transition-colors ${notification.read ? 'text-gray-400' : 'text-white'} break-words`}>
                            {notification.message}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                              aria-label="Mark as read"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => dismissNotification(notification.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                            aria-label="Dismiss notification"
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Appointments Section - Collapsible on Mobile */}
          <div className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl shadow-xl transition-all duration-700 ${sectionsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div 
              className="flex items-center justify-between p-4 sm:p-6 cursor-pointer"
              onClick={() => toggleSection('appointments')}
              onKeyDown={(e) => e.key === 'Enter' && toggleSection('appointments')}
              tabIndex={0}
              role="button"
              aria-expanded={!collapsedSections.appointments}
              aria-label="Toggle appointments section"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                  My Appointments
                </h2>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-pink-300 hover:text-pink-200 text-xs sm:text-sm font-semibold hidden sm:inline">View All</span>
                {collapsedSections.appointments ? (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-pink-300 sm:hidden" />
                ) : (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-pink-300 sm:hidden" />
                )}
              </div>
            </div>
            
            <div className={`transition-all duration-300 ${collapsedSections.appointments ? 'max-h-0 overflow-hidden' : 'max-h-[800px] overflow-visible'}`}>
              <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                {appointments.length === 0 && callAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No appointments yet.</p>
                    <div className="flex flex-col gap-3 sm:gap-4 justify-center">
                      <button
                        onClick={() => setShowAppointmentModal(true)}
                        className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl p-3 sm:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                        aria-label="Book physical appointment"
                      >
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Book Physical Appointment</span>
                      </button>
                      <button
                        onClick={() => setShowBookingModal(true)}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-3 sm:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                        aria-label="Schedule consultation call"
                      >
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Schedule Consultation Call</span>
                      </button>
                      <a
                        href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I have a question about medical licensing.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl p-3 sm:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                        aria-label="Chat with us on WhatsApp"
                        onClick={() => trackButtonClick('whatsapp_contact_dashboard_empty', 'user_dashboard')}
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {/* Show up to 2 physical appointments */}
                      {appointments.slice(0, 2).map(booking => (
                        <div key={booking.id} className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 space-y-2 sm:space-y-0">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-white text-sm sm:text-lg">Physical Appointment</p>
                                <p className="text-xs sm:text-md text-gray-300 mt-1">Date: {booking.appointment_slots?.date}</p>
                                <p className="text-xs sm:text-md text-gray-300 mt-1">Time: {booking.appointment_slots?.start_time ? new Date(booking.appointment_slots.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} - {booking.appointment_slots?.end_time ? new Date(booking.appointment_slots.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                                <p className="text-xs sm:text-md text-gray-300 mt-1">Location: {booking.appointment_slots?.location}</p>
                              </div>
                            </div>
                            <span className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold self-start sm:self-auto ${
                              booking.status === 'confirmed' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                              booking.status === 'pending' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' :
                              'bg-gradient-to-r from-red-400 to-rose-500 text-white'
                            }`}>
                              {booking.status.replace('_', ' ')}
                            </span>
                          </div>
                          {booking.status === 'confirmed' ? (
                            <div className="text-green-300 mt-2 text-xs sm:text-sm">Your appointment is confirmed. Please arrive on time.</div>
                          ) : booking.status === 'pending' ? (
                            <div className="text-yellow-200 mt-2 text-xs sm:text-sm">Your appointment is awaiting admin approval.</div>
                          ) : booking.status === 'rejected' ? (
                            <div className="text-red-300 mt-2 text-xs sm:text-sm">Your appointment booking was rejected. Please contact support.</div>
                          ) : null}
                        </div>
                      ))}
                      {/* Show up to 2 call appointments */}
                      {callAppointments.slice(0, 2).map(booking => (
                        <div key={booking.id} className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 space-y-2 sm:space-y-0">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-white text-sm sm:text-lg">Consultation Call</p>
                                <p className="text-xs sm:text-md text-gray-300 mt-1">Date: {booking.call_slots?.date}</p>
                                <p className="text-xs sm:text-md text-gray-300 mt-1">Time: {booking.call_slots?.start_time ? booking.call_slots.start_time.slice(0,5) : ''} - {booking.call_slots?.end_time ? booking.call_slots.end_time.slice(0,5) : ''}</p>
                              </div>
                            </div>
                            <span className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold self-start sm:self-auto ${
                              booking.status === 'confirmed' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                              booking.status === 'pending' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' :
                              'bg-gradient-to-r from-red-400 to-rose-500 text-white'
                            }`}>
                              {booking.status.replace('_', ' ')}
                            </span>
                          </div>
                          {booking.status === 'confirmed' ? (
                            <div className="text-green-300 mt-2 text-xs sm:text-sm">Your call is confirmed. Please be available at the scheduled time.</div>
                          ) : booking.status === 'pending' ? (
                            <div className="text-yellow-200 mt-2 text-xs sm:text-sm">Your call is awaiting admin approval.</div>
                          ) : booking.status === 'rejected' ? (
                            <div className="text-red-300 mt-2 text-xs sm:text-sm">Your call booking was rejected. Please contact support.</div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                    
                    {/* Booking Buttons */}
                    <div className="flex flex-col gap-3 sm:gap-4 pt-4 border-t border-white/10">
                      <button
                        onClick={() => setShowAppointmentModal(true)}
                        className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl p-3 sm:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                        aria-label="Book physical appointment"
                      >
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Book Physical Appointment</span>
                      </button>
                      <button
                        onClick={() => setShowBookingModal(true)}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-3 sm:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                        aria-label="Schedule consultation call"
                      >
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Schedule Consultation Call</span>
                      </button>
                      <a
                        href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I have a question about medical licensing.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl p-3 sm:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                        aria-label="Chat with us on WhatsApp"
                        onClick={() => trackButtonClick('whatsapp_contact_dashboard', 'user_dashboard')}
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      

      <WelcomeModal 
        isOpen={showWelcomeModal}
        onClose={handleCloseWelcomeModal}
        hasPurchasedPackage={hasPurchasedPackage}
      />
      <PromotionModal 
        isOpen={showPromotionModal}
        onClose={closePromotionModal}
        onCouponApplied={applyPromotionCoupon}
      />
      <BookPhysicalAppointmentModal open={showAppointmentModal} onClose={() => setShowAppointmentModal(false)} />
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2 sm:p-6 w-full max-w-2xl mx-2 sm:mx-0 relative max-h-[95vh] flex flex-col">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-3 right-3 text-white bg-red-500/80 hover:bg-red-600/90 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow z-10"
              aria-label="Close booking modal"
            >
              &times;
            </button>
            <div className="overflow-y-auto flex-1 px-2 sm:px-0" style={{ maxHeight: '85vh' }}>
              <BookingForm />
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
