import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { trackLogin, trackFormSubmission, trackButtonClick } from '../utils/analytics';
import { useFormAnalytics } from '../utils/useAnalytics';
import { trackMetaPixelLogin, trackMetaPixelFormSubmission, trackMetaPixelButtonClick } from '../utils/metaPixel';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formInteracted, setFormInteracted] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Analytics hooks
  const { trackFormStart, trackFormFieldInteraction } = useFormAnalytics('login_form');

  useEffect(() => {
    // Track form start when component mounts
    trackFormStart();
    
    // Check for verification success message in URL parameters
    // Handle both query parameters (?param=value) and hash fragments (#param=value)
    const urlParams = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.substring(1)); // Remove # from hash
    
    const type = urlParams.get('type') || hashParams.get('type');
    const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
    const message = urlParams.get('message') || hashParams.get('message');


    // Handle email verification redirect with access tokens
    const handleEmailVerification = async () => {
      if (accessToken && refreshToken) {
        try {
          // Set the session using the tokens from URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Error setting session:', error);
            setMessage('Email verification failed. Please try again.');
            setMessageType('error');
            return;
          }

          if (data.session && data.session.user.email_confirmed_at) {
            // Clear URL parameters and redirect to dashboard
            navigate('/dashboard/user', { replace: true });
          } else {
            setMessage('Email verification in progress. Please wait...');
            setMessageType('success');
          }
        } catch (error) {
          console.error('Error during email verification:', error);
          setMessage('Email verification failed. Please try again.');
          setMessageType('error');
        }
      } else {
        // Check for existing session (fallback)
        const checkSessionForVerification = async () => {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (session && session.user.email_confirmed_at) {
            navigate('/dashboard/user', { replace: true });
          } else if (error) {
            console.error('Error checking session:', error);
          }
        };
        checkSessionForVerification();
      }
    };

    // Handle email verification immediately on mount
    handleEmailVerification();

  }, [location.search, location.hash, navigate, trackFormStart]);

  const handleChange = (e) => {
    if (!formInteracted) {
      setFormInteracted(true);
      trackMetaPixelFormSubmission('Login Form Start');
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFieldFocus = (fieldName) => {
    trackFormFieldInteraction(fieldName, 'focus');
  };

  const handleFieldBlur = (fieldName) => {
    trackFormFieldInteraction(fieldName, 'blur');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setShowResendVerification(false);

    // Track form submission
    trackFormSubmission('login_form');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Check if error is due to unverified email
        if (error.message.includes('Email not confirmed') || error.message.includes('not verified')) {
          setShowResendVerification(true);
          setError('Please verify your email address before logging in.');
        } else {
          throw error;
        }
        return;
      }

      // Track successful login
      trackLogin('email');
      trackMetaPixelLogin('email');

      // Show success message
      const toast = document.createElement('div');
      toast.className = 'bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-up';
      toast.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Successfully logged in!</span>
      `;
      document.getElementById('toast-container').appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
      // Track login error
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'login_error', {
          event_category: 'engagement',
          event_label: error.message,
        });
      }
      trackMetaPixelButtonClick('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    
    setResendLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
      });

      if (error) throw error;

      // Show success message
      setMessage('Verification email sent successfully! Please check your inbox.');
      setMessageType('success');
      
      // Start cooldown timer (60 seconds)
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Track resend verification
      trackButtonClick('resend_verification', 'login_page');
      
    } catch (error) {
      setError('Failed to send verification email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    trackButtonClick('forgot_password', 'login_page');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Elements (removed as MainLayout provides) */}
      {/* <div className="absolute inset-0 bg-grid-pattern opacity-5" /> */}
      {/* <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 via-transparent to-transparent opacity-50" /> */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/20"
      >
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold">
            <span className="bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h2>
          <p className="mt-2 text-gray-300">
            Sign in to your account to continue
          </p>
        </div>

        <div className="space-y-6">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-2xl flex items-center space-x-2"
              >
                <FiAlertCircle className="flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${
                  messageType === 'success' 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                    : 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                } px-4 py-3 rounded-2xl flex items-center space-x-2`}
              >
                <FiAlertCircle className="flex-shrink-0" />
                <span>{message}</span>
              </motion.div>
            )}

            {showResendVerification && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-purple-500/10 border border-blue-400/30 rounded-2xl p-6 shadow-2xl mb-2 relative overflow-hidden"
                style={{ boxShadow: '0 4px 32px 0 rgba(67,56,202,0.15)' }}
              >
                {/* Animated floating gradient ring */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-8 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 blur-2xl rounded-full opacity-60 animate-pulse pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-blue-200 text-base font-semibold mb-1 flex items-center justify-center sm:justify-start gap-2">
                      <FiMail className="inline-block text-cyan-300 animate-pulse" />
                      Didn't receive the verification email?
                    </p>
                    <p className="text-blue-100 text-xs sm:text-sm">Check your spam folder or resend below.</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: resendLoading || resendCooldown > 0 ? 1 : 1.04 }}
                    whileTap={{ scale: resendLoading || resendCooldown > 0 ? 1 : 0.97 }}
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading || resendCooldown > 0}
                    className={`
                      px-6 py-2 rounded-xl font-semibold shadow-lg text-base flex items-center gap-2 transition-all duration-300
                      border border-cyan-400/30 backdrop-blur-md
                      bg-gradient-to-r from-white/20 via-cyan-400/10 to-blue-700/20
                      text-cyan-100
                      ${resendLoading || resendCooldown > 0
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:bg-white/30 hover:shadow-xl hover:border-cyan-300/60 active:scale-95'}
                    `}
                    style={{ boxShadow: '0 2px 16px 0 rgba(34,211,238,0.10)' }}
                  >
                    {resendLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-cyan-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : resendCooldown > 0 ? (
                      <>
                        <FiRefreshCw className="h-5 w-5 text-cyan-200 animate-spin-slow" />
                        <span>Resend in {resendCooldown}s</span>
                      </>
                    ) : (
                      <>
                        <FiRefreshCw className="h-5 w-5 text-cyan-200" />
                        <span>Resend Verification Email</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus('email')}
                  onBlur={() => handleFieldBlur('email')}
                  className="block w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus('password')}
                  onBlur={() => handleFieldBlur('password')}
                  className="block w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 bg-white/5 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-transparent"
                />
                <label htmlFor="remember-me" className="ml-2 block text-gray-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  onClick={handleForgotPasswordClick}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full flex justify-center py-3 px-4 rounded-2xl text-white font-semibold
                  ${loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg transition-all duration-300 transform hover:scale-105'
                  }
                `}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Don't have an account? {' '}
            <Link to="/register" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
