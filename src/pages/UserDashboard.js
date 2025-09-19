// src/pages/UserDashboard.js
import React, { useOutletContext, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ChatWidget from '../components/ChatWidget';
import WelcomeModal from '../components/WelcomeModal';
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
  Heart
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
  const [userProfile, setUserProfile] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [hasPurchasedPackage, setHasPurchasedPackage] = useState(false);
  
  // Enable automatic page tracking
  useAnalytics();

  useEffect(() => {
    fetchDashboardData();
    
    // Track page view
    trackPageView('/dashboard/user');
    trackEvent('page_viewed', 'engagement', 'user_dashboard');
    trackMetaPixelViewContent('User Dashboard');
  }, []);

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
  };

  const handleCaseClick = (caseId) => {
    trackEvent('case_clicked', 'engagement', 'user_dashboard', caseId);
  };

  const handleNotificationClick = (notificationId) => {
    trackEvent('notification_clicked', 'engagement', 'user_dashboard', notificationId);
  };

  // If admin tries to access user page, send them to admin
  if (role === "admin") {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

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
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-gradient-x"></div>
        <div className="relative z-10">
              <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">
            Welcome back, {userProfile?.full_name || 'User'}!
          </h1>
              <p className="text-gray-300 text-lg">
                Track your medical licensing applications with AI-powered insights
          </p>
        </div>
      </div>

      {/* Payment Status Banner */}
      {paymentStatus && paymentStatus.status === 'pending' && (
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 shadow-xl">
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

          {/* Welcome Banner for New Users */}
          {!hasPurchasedPackage && (
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Welcome to Hiaraise!</h3>
                    <p className="text-blue-100 text-sm">
                      New here? Let us guide you through the process of submitting your first case.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleGetStartedClick}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Cases</h3>
              <p className="text-3xl font-bold text-white">{stats.totalCases}</p>
              </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Pending</h3>
              <p className="text-3xl font-bold text-white">{stats.pendingCases}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Under Review</h3>
              <p className="text-3xl font-bold text-white">{stats.underReviewCases}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Approved</h3>
              <p className="text-3xl font-bold text-white">{stats.approvedCases}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Rejected</h3>
              <p className="text-3xl font-bold text-white">{stats.rejectedCases}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/submit-case" className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white group-hover:text-cyan-400 transition-colors">
                    Submit New Case
                  </h3>
                  <p className="text-gray-400 text-sm">Start a new application</p>
            </div>
          </div>
            </Link>
            <Link to="/my-cases" className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white group-hover:text-cyan-400 transition-colors">
                    My Cases
                  </h3>
                  <p className="text-gray-400 text-sm">View all your applications</p>
            </div>
          </div>
            </Link>
            <Link to="/profile" className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white group-hover:text-cyan-400 transition-colors">
                    Profile Settings
                  </h3>
                  <p className="text-gray-400 text-sm">Manage your account</p>
                </div>
            </div>
            </Link>
        </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Recent Cases */}
            <div className="xl:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                  Recent Cases
                </h2>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">AI Enhanced</span>
                </div>
              </div>
              <div className="space-y-4">
                {recentCases.map((case_item) => (
                  <Link 
                    to={`/my-cases/${case_item.id}`}
                    key={case_item.id}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 group cursor-pointer block"
                    onClick={() => handleCaseClick(case_item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <Globe className="w-6 h-6 text-white" />
            </div>
                        <div>
                          <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                            {CASE_TYPE_LABELS[case_item.case_type] || case_item.case_type}
                          </h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-400">
                            <span>{new Date(case_item.submitted_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(case_item.status)} text-white`}>
                          {case_item.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    </Link>
                  ))}
                </div>
            </div>

            {/* Notifications Sidebar */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                  AI Notifications
                </h2>
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
          </div>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 group cursor-pointer"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        <Bell className="w-5 h-5 text-blue-400" />
            </div>
                      <div className="flex-1">
                        <p className="text-white text-sm group-hover:text-cyan-400 transition-colors">
                          {notification.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>

          {/* AI Assistant Bar */}
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Assistant Ready</h3>
                  <p className="text-indigo-200 text-sm">Get instant help with your medical licensing process</p>
          </div>
        </div>
              <button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2" onClick={handleAIAssistantClick}>
                <span>Get Help</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            </div>
        </div>
      </div>
      <ChatWidget />
      <WelcomeModal 
        isOpen={showWelcomeModal}
        onClose={handleCloseWelcomeModal}
        hasPurchasedPackage={hasPurchasedPackage}
      />
    </div>
  );
}
