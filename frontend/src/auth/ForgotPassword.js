import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiAlertCircle, FiCheckCircle, FiArrowLeft, FiShield, FiLock } from 'react-icons/fi';
import { Brain, Sparkles } from 'lucide-react';
import { trackEvent, trackFormSubmission, trackButtonClick } from '../utils/analytics';
import { useFormAnalytics } from '../utils/useAnalytics';
import { trackMetaPixelFormSubmission, trackMetaPixelButtonClick } from '../utils/metaPixel';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);
  const [formInteracted, setFormInteracted] = useState(false);
  
  // Analytics hooks
  const { trackFormStart, trackFormFieldInteraction } = useFormAnalytics('forgot_password_form');

  const handleChange = (e) => {
    if (!formInteracted) {
      setFormInteracted(true);
      trackMetaPixelFormSubmission('Forgot Password Form Start');
    }
    setEmail(e.target.value);
  };

  const handleFieldFocus = (fieldName) => {
    trackFormFieldInteraction(fieldName, 'focus');
  };

  const handleFieldBlur = (fieldName) => {
    trackFormFieldInteraction(fieldName, 'blur');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    // Track form submission
    trackFormSubmission('forgot_password_form');
    trackMetaPixelFormSubmission('Forgot Password Form');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        setMessage(error.message);
        setMessageType('error');
        trackEvent('password_reset_error', 'engagement', error.message);
        trackMetaPixelButtonClick('Password Reset Error', error.message);
      } else {
        setMessage('Password reset link sent! Check your email for instructions.');
        setMessageType('success');
        trackEvent('password_reset_sent', 'engagement', 'email_sent');
        trackMetaPixelButtonClick('Password Reset Sent', 'email_sent');
      }
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again.');
      setMessageType('error');
      trackEvent('password_reset_error', 'engagement', 'unexpected_error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLoginClick = () => {
    trackButtonClick('back_to_login', 'forgot_password_page');
    trackMetaPixelButtonClick('Back to Login', 'forgot_password_page');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/20"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <FiLock className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-display font-bold mb-2">
            <span className="bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              Reset Your Password
            </span>
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Enter your email address and we'll send you a secure link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`px-4 py-3 rounded-2xl flex items-center space-x-3 ${
                messageType === 'success'
                  ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                  : 'bg-red-500/20 border border-red-500/30 text-red-300'
              }`}
            >
              {messageType === 'success' ? (
                <FiCheckCircle className="flex-shrink-0" />
              ) : (
                <FiAlertCircle className="flex-shrink-0" />
              )}
              <span className="text-sm">{message}</span>
            </motion.div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
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
                value={email}
                onChange={handleChange}
                onFocus={() => handleFieldFocus('email')}
                onBlur={() => handleFieldBlur('email')}
                className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                placeholder="Enter your email address"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full flex justify-center items-center py-3 px-4 rounded-xl text-white font-semibold transition-all duration-300
                ${loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg transform hover:scale-105'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Reset Link...
                </span>
              ) : (
                <span className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Send Reset Link
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4"
        >
          <div className="flex items-start space-x-3">
            <FiShield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-300 mb-1">Security Notice</h4>
              <p className="text-xs text-blue-200 leading-relaxed">
                The reset link will expire in 1 hour for your security. If you don't receive the email, 
                check your spam folder or contact our support team.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            to="/login"
            onClick={handleBackToLoginClick}
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </div>

        {/* Brand Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center pt-4 border-t border-white/10"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <img 
              src="/logo.png" 
              alt="Hiaraise MedLicense AI Portal" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-sm font-medium text-gray-300">Hiaraise MedLicense AI</span>
          </div>
          <p className="text-xs text-gray-400">
            Empowering healthcare professionals with AI-driven medical licensing solutions
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
