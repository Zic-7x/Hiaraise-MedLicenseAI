import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiAlertCircle, FiRefreshCw, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { supabase } from '../supabaseClient';
import { trackLogin, trackFormSubmission, trackButtonClick, trackRegistration } from '../utils/analytics';
import { useFormAnalytics } from '../utils/useAnalytics';
import { trackMetaPixelLogin, trackMetaPixelFormSubmission, trackMetaPixelButtonClick, trackMetaPixelRegistration } from '../utils/metaPixel';
import { detectUserCountry } from '../utils/countryDetection';
import PhoneInput from './PhoneInput';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formInteracted, setFormInteracted] = useState(false);
  const [detectingCountry, setDetectingCountry] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Analytics hooks
  const { trackFormStart, trackFormFieldInteraction } = useFormAnalytics(`${mode}_form`);

  // Detect user's country based on IP address
  useEffect(() => {
    const initializeCountry = async () => {
      try {
        const detectedCountry = await detectUserCountry();
        setSelectedCountry(detectedCountry);
      } catch (error) {
        console.error('Error detecting country:', error);
      } finally {
        setDetectingCountry(false);
      }
    };

    initializeCountry();
  }, []);

  // Reset form when modal opens (but not when switching modes)
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        full_name: '',
        phone: '',
      });
      setError(null);
      setMessage('');
      setMessageType('');
      setShowResendVerification(false);
      setFormInteracted(false);
      trackFormStart();
    }
  }, [isOpen]);

  // Reset form when mode changes (but keep email if switching between login/register)
  useEffect(() => {
    if (isOpen && mode) {
      const currentEmail = formData.email;
      setFormData(prev => ({
        email: currentEmail, // Keep email when switching modes
        password: '',
        confirmPassword: '',
        full_name: prev.full_name, // Keep name if switching from register to login
        phone: prev.phone, // Keep phone if switching from register to login
      }));
      setError(null);
      setMessage('');
      setMessageType('');
      setShowResendVerification(false);
    }
  }, [mode]);

  const handleChange = (e) => {
    if (!formInteracted) {
      setFormInteracted(true);
      trackMetaPixelFormSubmission(`${mode} Form Start`);
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

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  const handlePhoneChange = (phoneNumber) => {
    setFormData(prev => ({
      ...prev,
      phone: phoneNumber
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setShowResendVerification(false);

    // Track form submission
    trackFormSubmission('login_form');
    trackMetaPixelFormSubmission('Login Form');

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
      setMessage('Successfully logged in!');
      setMessageType('success');

      // Close modal and call success callback
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1000);

    } catch (error) {
      setError(error.message);
      trackMetaPixelButtonClick('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Track form submission
    trackFormSubmission('register_form');
    trackMetaPixelFormSubmission('Register Form');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate required fields
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            phone: formData.phone,
            country: selectedCountry?.name || '',
          }
        }
      });

      if (error) throw error;

      // Track successful registration
      trackRegistration('email');
      trackMetaPixelRegistration('email');

      // Check if email confirmation is required
      if (data.user && !data.user.email_confirmed_at) {
        setMessage('Registration successful! Please check your email to verify your account.');
        setMessageType('success');
        
        // Switch to login mode after successful registration
        setTimeout(() => {
          setMode('login');
          setMessage('');
          setMessageType('');
        }, 3000);
        return;
      }

      // If email is already confirmed, create profile immediately
      if (data.user && data.user.email_confirmed_at) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              email: data.user.email,
              full_name: formData.full_name,
              phone: formData.phone,
              country: selectedCountry?.name || '',
              role: 'user'
            }
          ])
          .select();

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error('Failed to create user profile. Please try again.');
        }
      }

      setMessage('Registration successful! Please check your email to verify your account.');
      setMessageType('success');

      // Switch to login mode after successful registration
      setTimeout(() => {
        setMode('login');
        setMessage('');
        setMessageType('');
      }, 3000);

    } catch (error) {
      setError(error.message);
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

      trackButtonClick('resend_verification', 'login_modal');
      
    } catch (error) {
      setError('Failed to send verification email. Please try again.');
      console.error('Resend verification error:', error);
    } finally {
      setResendLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError(null);
    setMessage('');
    setMessageType('');
    setShowResendVerification(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md max-h-[90vh] min-h-[400px] bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 flex flex-col my-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
          >
            <FiX className="w-5 h-5 text-gray-300" />
          </button>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 pt-12 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold">
              <span className="bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </span>
            </h2>
            <p className="mt-2 text-gray-300">
              {mode === 'login' 
                ? 'Sign in to your account to continue' 
                : 'Join our platform to streamline your medical license application'
              }
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex mb-6 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-2xl flex items-center space-x-2 mb-4"
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
              } px-4 py-3 rounded-2xl flex items-center space-x-2 mb-4`}
            >
              <FiAlertCircle className="flex-shrink-0" />
              <span>{message}</span>
            </motion.div>
          )}

          {/* Resend Verification */}
          {showResendVerification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4 mb-4"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-blue-200 text-sm font-semibold mb-1 flex items-center justify-center sm:justify-start gap-2">
                    <FiMail className="inline-block text-cyan-300" />
                    Didn't receive the verification email?
                  </p>
                  <p className="text-blue-100 text-xs">Check your spam folder or resend below.</p>
                </div>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading || resendCooldown > 0}
                  className={`
                    px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-300
                    border border-cyan-400/30 backdrop-blur-md
                    bg-gradient-to-r from-white/20 via-cyan-400/10 to-blue-700/20
                    text-cyan-100
                    ${resendLoading || resendCooldown > 0
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:bg-white/30 hover:shadow-xl hover:border-cyan-300/60'
                    }
                  `}
                >
                  {resendLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-cyan-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : resendCooldown > 0 ? (
                    <>
                      <FiRefreshCw className="h-4 w-4 text-cyan-200 animate-spin-slow" />
                      <span>Resend in {resendCooldown}s</span>
                    </>
                  ) : (
                    <>
                      <FiRefreshCw className="h-4 w-4 text-cyan-200" />
                      <span>Resend</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4 mb-6">
            {/* Full Name (Register only) */}
            {mode === 'register' && (
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    onFocus={() => handleFieldFocus('full_name')}
                    onBlur={() => handleFieldBlur('full_name')}
                    className="block w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <div className="relative">
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

            {/* Phone (Register only) */}
            {mode === 'register' && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                  Phone Number
                </label>
                <PhoneInput
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  selectedCountry={selectedCountry}
                  onCountrySelect={handleCountrySelect}
                  placeholder="Enter your phone number"
                  required
                  disabled={detectingCountry}
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === 'login' ? "current-password" : "new-password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus('password')}
                  onBlur={() => handleFieldBlur('password')}
                  className="block w-full pl-10 pr-10 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
                  placeholder={mode === 'login' ? "Enter your password" : "Create a password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password (Register only) */}
            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => handleFieldFocus('confirmPassword')}
                    onBlur={() => handleFieldBlur('confirmPassword')}
                    className="block w-full pl-10 pr-10 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me (Login only) */}
            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-600 bg-white/5 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-transparent"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-gray-400 text-sm">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (mode === 'register' && detectingCountry)}
              className={`
                w-full flex justify-center py-3 px-4 rounded-2xl text-white font-semibold
                ${loading || (mode === 'register' && detectingCountry)
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
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 p-6 pt-0 text-center border-t border-white/10">
            <p className="text-sm text-gray-400">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
