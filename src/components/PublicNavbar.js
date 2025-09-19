import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion for animations
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiFileText, FiCreditCard, FiSettings } from 'react-icons/fi'; // Import necessary icons
import { Brain, Sparkles } from 'lucide-react';
import { useState } from 'react'; // Import useState

const NavLink = ({ to, children, icon: Icon, onClick }) => {
  // NavLink component for consistent styling and potential future animations
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-white/5 focus:outline-none focus:text-cyan-400 focus:bg-white/5 transition-colors"
    >
      {Icon && <Icon className="text-lg inline-block mr-1" />}
      {children}
    </Link>
  );
};

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50 shadow-glass-sm transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-glow-sm group-hover:shadow-glow transition-all duration-300">
              H
            </div>
            <span className="font-display text-xl font-semibold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              Hiaraise AI
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/about">About Us</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/login">Login</NavLink>
            <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-semibold hover:shadow-glow transition-all duration-300">
              Register
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu Panel with Liquid Glass Effect */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
            id="mobile-menu"
          >
            {/* Liquid Glass Background */}
            <div className="relative">
              {/* Animated background elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-xl border-t border-white/20">
                {/* Floating orbs */}
                <div className="absolute top-4 left-4 w-16 h-16 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-8 right-8 w-12 h-12 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-4 left-1/2 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
                
                {/* Liquid wave effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
              </div>
              
              {/* Content */}
              <div className="relative px-4 pt-4 pb-6 space-y-2 sm:px-6">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <NavLink to="/services" onClick={toggleMenu} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                    Services
                  </NavLink>
                </motion.div>
                
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <NavLink to="/about" onClick={toggleMenu} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                    About Us
                  </NavLink>
                </motion.div>
                
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <NavLink to="/contact" onClick={toggleMenu} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                    Contact
                  </NavLink>
                </motion.div>
                
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <NavLink to="/login" onClick={toggleMenu} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                    Login
                  </NavLink>
                </motion.div>
                
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2"
                >
                  <Link
                    to="/register"
                    onClick={toggleMenu}
                    className="block w-full text-center px-4 py-3 rounded-xl text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 backdrop-blur-sm border border-blue-500/30 hover:border-blue-400/50 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 