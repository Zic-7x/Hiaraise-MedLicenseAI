import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  const location = useLocation();

  // Track 404 errors for analytics
  useEffect(() => {
    // Log 404 error for debugging
    console.warn('404 Error - Page not found:', location.pathname);
    
    // Track 404 error in analytics (if you have analytics setup)
    if (window.gtag) {
      window.gtag('event', 'page_not_found', {
        page_path: location.pathname,
        page_title: '404 - Page Not Found'
      });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative">
              {/* Large 404 Text */}
              <motion.h1
                className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                404
              </motion.h1>
              
              {/* Floating Elements around 404 */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-accent-500 rounded-full"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary-500 rounded-full"
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -180, -360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-xl text-gray-300 mb-2">
              The page you're looking for doesn't exist.
            </p>
            <p className="text-gray-400 mb-6">
              You tried to access: <code className="bg-gray-800 px-2 py-1 rounded text-primary-400">{location.pathname}</code>
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/"
              className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25"
            >
              <span className="relative z-10">Go Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="group relative px-8 py-4 border-2 border-primary-500 text-primary-400 font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:bg-primary-500 hover:text-white hover:scale-105"
            >
              <span className="relative z-10">Go Back</span>
            </button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-12"
          >
            <p className="text-gray-400 mb-6">Maybe you were looking for:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <Link
                to="/licenses"
                className="group p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:bg-gray-800/70"
              >
                <h3 className="text-white font-semibold group-hover:text-primary-400 transition-colors">
                  Medical Licenses
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Explore available medical licenses
                </p>
              </Link>
              
              <Link
                to="/vouchers"
                className="group p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:bg-gray-800/70"
              >
                <h3 className="text-white font-semibold group-hover:text-primary-400 transition-colors">
                  Exam Vouchers
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Get exam vouchers for medical tests
                </p>
              </Link>
              
              <Link
                to="/contact"
                className="group p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:bg-gray-800/70"
              >
                <h3 className="text-white font-semibold group-hover:text-primary-400 transition-colors">
                  Contact Support
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Get help from our support team
                </p>
              </Link>
            </div>
          </motion.div>

          {/* Search Suggestion */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12"
          >
            <p className="text-gray-400 mb-4">
              Can't find what you're looking for? Try searching:
            </p>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search our website..."
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    // You can implement search functionality here
                  }
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
