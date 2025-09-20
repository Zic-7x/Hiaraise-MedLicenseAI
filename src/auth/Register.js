// src/pages/Register.js
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { FiMail, FiLock, FiUser, FiAlertCircle, FiCheckCircle, FiGift } from 'react-icons/fi';
import { detectUserCountry } from '../utils/countryDetection';
import PhoneInput from '../components/PhoneInput';
import { trackEvent, trackFormSubmission, trackButtonClick, trackRegistration, trackPageView } from '../utils/analytics';
import { useAnalytics, useFormAnalytics } from '../utils/useAnalytics';
import { trackMetaPixelViewContent, trackMetaPixelRegistration, trackMetaPixelFormSubmission, trackMetaPixelButtonClick } from '../utils/metaPixel';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [detectingCountry, setDetectingCountry] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [formInteracted, setFormInteracted] = useState(false);
  const [promotionCode, setPromotionCode] = useState(null);
  const navigate = useNavigate();
  const searchParams = useSearchParams()[0];
  
  // Enable automatic page tracking
  useAnalytics();
  const { trackFormStart, trackFormFieldInteraction } = useFormAnalytics('register_form');

  // Detect promotion code from URL
  useEffect(() => {
    const promotion = searchParams.get('promotion');
    if (promotion) {
      setPromotionCode(promotion);
      trackEvent('promotion_code_detected', 'engagement', promotion);
    }
  }, [searchParams]);

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

  // Track page view and form start
  useEffect(() => {
    trackPageView('/register');
    trackEvent('page_viewed', 'engagement', 'register_page');
    trackMetaPixelViewContent('Register Page');
    trackFormStart();
  }, [trackFormStart]);

  const handleChange = (e) => {
    if (!formInteracted) {
      setFormInteracted(true);
      trackMetaPixelFormSubmission('Register Form Start');
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
    trackEvent('country_selected', 'engagement', country.name);
  };

  const handlePhoneChange = (phoneNumber) => {
    setFormData(prev => ({
      ...prev,
      phone: phoneNumber
    }));
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
      trackEvent('registration_error', 'engagement', 'password_mismatch');
      setLoading(false);
      return;
    }

    // Validate required fields
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      trackEvent('registration_error', 'engagement', 'missing_full_name');
      setLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required');
      trackEvent('registration_error', 'engagement', 'missing_phone');
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
      trackEvent('registration_success', 'engagement', 'register_form');
      trackMetaPixelRegistration('email');

      // Check if email confirmation is required
      if (data.user && !data.user.email_confirmed_at) {
        // Show success message for email confirmation
        setSuccess(true);
        const toast = document.createElement('div');
        toast.className = 'bg-success-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-up';
        toast.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Registration successful! Please check your email to verify your account.</span>
        `;
        document.getElementById('toast-container').appendChild(toast);
        setTimeout(() => toast.remove(), 10000); // Extended from 5s to 10s

        // Redirect to login after a longer delay
        setTimeout(() => navigate('/login'), 8000); // Extended from 3s to 8s
        return;
      }

      // If email is already confirmed, create profile immediately
      if (data.user && data.user.email_confirmed_at) {
        // Insert into profiles table with the correct user ID
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              email: data.user.email,
              full_name: formData.full_name,
              phone: formData.phone,
              country: selectedCountry?.name || '',
              role: 'user' // Set default role
            }
          ])
          .select();

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error('Failed to create user profile. Please try again.');
        }
      }

      // Show success message
      setSuccess(true);
      const toast = document.createElement('div');
      toast.className = 'bg-success-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-up';
      toast.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Registration successful! Please check your email to verify your account.</span>
      `;
      document.getElementById('toast-container').appendChild(toast);
      setTimeout(() => toast.remove(), 10000); // Extended from 5s to 10s

      // Redirect to login after a longer delay
      setTimeout(() => navigate('/login'), 8000); // Extended from 3s to 8s
    } catch (error) {
      setError(error.message);
      // Track registration error
      trackEvent('registration_error', 'engagement', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInClick = () => {
    trackButtonClick('sign_in_link', 'register_page');
    trackMetaPixelButtonClick('Sign In Link', 'Register Page');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 via-transparent to-transparent opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 relative p-4 sm:p-0"
      >
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold">
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Create Account
            </span>
          </h2>
          <p className="mt-2 text-secondary-400">
            Join our platform to streamline your medical license application
          </p>
          
          {/* Promotion Code Display */}
          {promotionCode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-3"
            >
              <div className="flex items-center justify-center space-x-2">
                <FiGift className="w-4 h-4 text-green-400" />
                <span className="text-green-300 text-sm font-medium">
                  Welcome Discount Applied: <span className="font-mono font-bold text-green-400">{promotionCode}</span>
                </span>
              </div>
              <p className="text-green-200 text-xs mt-1">
                Your discount will be available after registration!
              </p>
            </motion.div>
          )}
        </div>

        <div className="bg-secondary-800/50 backdrop-blur-sm border border-secondary-700/50 rounded-xl p-8 shadow-glass">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-success-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-8 h-8 text-success-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-2">
                Registration Successful!
              </h3>
              <p className="text-secondary-400">
                Please check your email to verify your account. You will be redirected to the login page in 8 seconds.
              </p>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleRegister}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-error-500/10 border border-error-500/20 text-error-400 px-4 py-3 rounded-lg flex items-center space-x-2"
                >
                  <FiAlertCircle className="flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-secondary-300">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-secondary-500" />
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
                    className="block w-full pl-10 pr-3 py-2 bg-secondary-900/50 border border-secondary-700/50 rounded-lg text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-300">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-secondary-500" />
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
                    className="block w-full pl-10 pr-3 py-2 bg-secondary-900/50 border border-secondary-700/50 rounded-lg text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-secondary-300">
                  Phone Number
                </label>
                <div className="mt-1">
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
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-secondary-300">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-secondary-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => handleFieldFocus('password')}
                    onBlur={() => handleFieldBlur('password')}
                    className="block w-full pl-10 pr-3 py-2 bg-secondary-900/50 border border-secondary-700/50 rounded-lg text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-300">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-secondary-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => handleFieldFocus('confirmPassword')}
                    onBlur={() => handleFieldBlur('confirmPassword')}
                    className="block w-full pl-10 pr-3 py-2 bg-secondary-900/50 border border-secondary-700/50 rounded-lg text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || detectingCountry}
                  className={`
                    w-full flex justify-center py-3 px-4 rounded-lg text-white font-semibold
                    ${loading || detectingCountry
                      ? 'bg-secondary-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-glow transition-all duration-300'
                    }
                  `}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-400">
              Already have an account?{' '}
              <Link
                to="/login"
                onClick={handleSignInClick}
                className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
