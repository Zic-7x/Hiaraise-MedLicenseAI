import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion for animations
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiFileText, FiCreditCard, FiSettings, FiChevronDown, FiDollarSign, FiInfo, FiMail, FiLogIn } from 'react-icons/fi'; // Import necessary icons
import { Brain, Sparkles, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react'; // Import useState and useRef
import { useAuthModal } from '../contexts/AuthModalContext';

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
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showLicensesDropdown, setShowLicensesDropdown] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const { openAuthModal } = useAuthModal();
  const servicesDropdownRef = useRef(null);
  const licensesDropdownRef = useRef(null);
  const toolsDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileLicensesOpen, setMobileLicensesOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Handle outside click for dropdowns and mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setShowServicesDropdown(false);
      }
      if (licensesDropdownRef.current && !licensesDropdownRef.current.contains(event.target)) {
        setShowLicensesDropdown(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target)) {
        setShowToolsDropdown(false);
      }
      // Close mobile menu when clicking outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50 shadow-glass-sm transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src="/logo.png" 
              alt="Hiaraise MedLicense AI Portal" 
              className="w-20 h-20 rounded-lg object-contain shadow-glow-sm group-hover:shadow-glow transition-all duration-300"
            />
            <span className="font-display text-2xl font-semibold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              Hiaraise AI
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-4">
            {/* Licenses Dropdown */}
            <div className="relative" ref={licensesDropdownRef}>
              <button
                onClick={() => setShowLicensesDropdown(v => !v)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-white/5 focus:outline-none focus:text-cyan-400 focus:bg-white/5 transition-colors"
                onBlur={() => setTimeout(() => setShowLicensesDropdown(false), 200)}
              >
                <span>Licenses</span>
                <FiChevronDown className={`ml-1 transition-transform ${showLicensesDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showLicensesDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <Link
                      to="/licenses"
                      className="block px-6 py-3 text-gray-200 hover:text-white hover:bg-gray-800/80 transition-colors duration-200"
                      onClick={() => setShowLicensesDropdown(false)}
                    >
                      All Licenses
                    </Link>
                    <Link
                      to="/licenses/dha-license-dubai"
                      className="block px-6 py-3 text-gray-200 hover:text-white hover:bg-gray-800/80 transition-colors duration-200"
                      onClick={() => setShowLicensesDropdown(false)}
                    >
                      DHA License (Dubai)
                    </Link>
                    <Link
                      to="/licenses/scfhs-license-saudi"
                      className="block px-6 py-3 text-gray-200 hover:text-white hover:bg-gray-800/80 transition-colors duration-200"
                      onClick={() => setShowLicensesDropdown(false)}
                    >
                      SCFHS License (Saudi Arabia)
                    </Link>
                    <Link
                      to="/licenses/qchp-license-qatar"
                      className="block px-6 py-3 text-gray-200 hover:text-white hover:bg-gray-800/80 transition-colors duration-200"
                      onClick={() => setShowLicensesDropdown(false)}
                    >
                      QCHP License (Qatar)
                    </Link>
                    <Link
                      to="/licenses/moh-license-uae"
                      className="block px-6 py-3 text-gray-200 hover:text-white hover:bg-gray-800/80 transition-colors duration-200"
                      onClick={() => setShowLicensesDropdown(false)}
                    >
                      MOHAP License (UAE)
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Services Dropdown */}
            <div className="relative" ref={servicesDropdownRef}>
              <button
                onClick={() => setShowServicesDropdown(v => !v)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-white/5 focus:outline-none focus:text-cyan-400 focus:bg-white/5 transition-colors"
                onBlur={() => setTimeout(() => setShowServicesDropdown(false), 200)}
              >
                <span>Services</span>
                <FiChevronDown className={`ml-1 transition-transform ${showServicesDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showServicesDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden"
                          >
                              <Link
                      to="/eligibility-check"
                                className="block px-6 py-3 text-gray-200 hover:text-white hover:bg-gray-800/80 transition-colors duration-200"
                      onClick={() => setShowServicesDropdown(false)}
                    >
                      Eligibility Checker
                              </Link>
                    <Link
                      to="/start-license"
                      className="block px-6 py-3 text-gray-200 hover:text-white hover:bg-gray-800/80 transition-colors duration-200"
                      onClick={() => setShowServicesDropdown(false)}
                    >
                      Why to Get License
                    </Link>
                    
                    {/* Vouchers Section */}
                    <div className="border-t border-white/10 my-2"></div>
                    <div className="px-6 py-2">
                      <div className="text-xs uppercase tracking-wider text-cyan-300 font-bold mb-2">Vouchers</div>
                      <div className="space-y-2">
                        <Link
                          to="/prometric-vouchers"
                          className="block w-full px-4 py-2 text-sm text-center bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center space-x-2"
                          onClick={() => setShowServicesDropdown(false)}
                        >
                          <img 
                            src="/Prometric-Logo.png" 
                            alt="Prometric Logo" 
                            className="w-4 h-4 object-contain"
                          />
                          <span>Get Prometric Vouchers</span>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Get License Buttons */}
                    <div className="border-t border-white/10 my-2"></div>
                    <div className="px-6 py-2">
                      <div className="text-xs uppercase tracking-wider text-cyan-300 font-bold mb-2">Get License</div>
                      <div className="space-y-2">
                        <Link
                          to="/case-submit"
                          className="block w-full px-4 py-2 text-sm text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300"
                          onClick={() => setShowServicesDropdown(false)}
                        >
                          Get Dubai License
                        </Link>
                        <Link
                          to="/case-submit"
                          className="block w-full px-4 py-2 text-sm text-center bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:to-emerald-800 transition-all duration-300"
                          onClick={() => setShowServicesDropdown(false)}
                        >
                          Get Saudi Arabia License
                        </Link>
                        <Link
                          to="/case-submit"
                          className="block w-full px-4 py-2 text-sm text-center bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-lg hover:from-purple-700 hover:to-violet-800 transition-all duration-300"
                          onClick={() => setShowServicesDropdown(false)}
                        >
                          Get Qatar License
                        </Link>
                        <Link
                          to="/case-submit"
                          className="block w-full px-4 py-2 text-sm text-center bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-lg hover:from-orange-700 hover:to-red-800 transition-all duration-300"
                          onClick={() => setShowServicesDropdown(false)}
                        >
                          Get UAE License
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/about">About Us</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <button
              onClick={() => openAuthModal('login')}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-white/5 focus:outline-none focus:text-cyan-400 focus:bg-white/5 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-semibold hover:shadow-glow transition-all duration-300"
            >
              Register
            </button>
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
              <div ref={mobileMenuRef} className="relative px-4 pt-4 pb-6 space-y-2 sm:px-6">
                {/* Main Navigation */}
                <div className="mb-2">
                  <div className="text-xs uppercase tracking-wider text-cyan-300 font-bold mb-1 pl-2">Navigation</div>
                  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
                    <NavLink to="/" icon={FiHome} onClick={toggleMenu}>Home</NavLink>
                  </motion.div>
                  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                    <NavLink to="/pricing" icon={FiDollarSign} onClick={toggleMenu}>Pricing</NavLink>
                  </motion.div>
                </div>
                
                {/* Licenses Section (mobile dropdown) */}
                <div className="mb-2">
                    <button
                    onClick={() => setMobileLicensesOpen(v => !v)}
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-white/5 focus:outline-none focus:text-cyan-400 focus:bg-white/5 transition-colors"
                    >
                      <span className="inline-flex items-center space-x-2">
                      <FiFileText className="w-4 h-4" />
                      <span>Licenses</span>
                      </span>
                    <FiChevronDown className={`inline-block ml-2 transition-transform ${mobileLicensesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                    {mobileLicensesOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                          <div className="pl-3">
                          <NavLink to="/licenses" icon={FiFileText} onClick={toggleMenu}>All Licenses</NavLink>
                          <NavLink to="/licenses/dha-license-dubai" icon={FiFileText} onClick={toggleMenu}>DHA License (Dubai)</NavLink>
                          <NavLink to="/licenses/scfhs-license-saudi" icon={FiFileText} onClick={toggleMenu}>SCFHS License (Saudi Arabia)</NavLink>
                          <NavLink to="/licenses/qchp-license-qatar" icon={FiFileText} onClick={toggleMenu}>QCHP License (Qatar)</NavLink>
                          <NavLink to="/licenses/moh-license-uae" icon={FiFileText} onClick={toggleMenu}>MOHAP License (UAE)</NavLink>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>
                
                {/* Services Section (mobile dropdown) */}
                <div className="mb-2">
                  <button
                    onClick={() => setMobileServicesOpen(v => !v)}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-white/5 focus:outline-none focus:text-cyan-400 focus:bg-white/5 transition-colors"
                  >
                    <span className="inline-flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span>Services</span>
                    </span>
                    <FiChevronDown className={`inline-block ml-2 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mobileServicesOpen && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <div className="pl-3">
                          <NavLink to="/eligibility-check" icon={Brain} onClick={toggleMenu}>Eligibility Checker</NavLink>
                          <NavLink to="/start-license" icon={Sparkles} onClick={toggleMenu}>Why to Get License</NavLink>
                          
                          {/* Vouchers Section */}
                          <div className="pt-3 space-y-2">
                            <div className="text-xs uppercase tracking-wider text-cyan-300 font-bold px-3">Vouchers</div>
                            <Link
                              to="/prometric-vouchers"
                              onClick={toggleMenu}
                              className="block w-full px-3 py-2 text-sm text-center bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                              <img 
                                src="/Prometric-Logo.png" 
                                alt="Prometric Logo" 
                                className="w-4 h-4 object-contain"
                              />
                              <span>Get Prometric Vouchers</span>
                            </Link>
                          </div>
                          
                          {/* Get License Buttons */}
                          <div className="pt-3 space-y-2">
                            <div className="text-xs uppercase tracking-wider text-cyan-300 font-bold px-3">Get License</div>
                            <Link
                              to="/case-submit"
                              onClick={toggleMenu}
                              className="block w-full px-3 py-2 text-sm text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300"
                            >
                              Get Dubai License
                            </Link>
                            <Link
                              to="/case-submit"
                              onClick={toggleMenu}
                              className="block w-full px-3 py-2 text-sm text-center bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:to-emerald-800 transition-all duration-300"
                            >
                              Get Saudi Arabia License
                            </Link>
                            <Link
                              to="/case-submit"
                              onClick={toggleMenu}
                              className="block w-full px-3 py-2 text-sm text-center bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-lg hover:from-purple-700 hover:to-violet-800 transition-all duration-300"
                            >
                              Get Qatar License
                            </Link>
                            <Link
                              to="/case-submit"
                              onClick={toggleMenu}
                              className="block w-full px-3 py-2 text-sm text-center bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-lg hover:from-orange-700 hover:to-red-800 transition-all duration-300"
                            >
                              Get UAE License
                            </Link>
                            </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <NavLink to="/about" icon={FiInfo} onClick={toggleMenu} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                    About Us
                  </NavLink>
                </motion.div>
                
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  <NavLink to="/contact" icon={FiMail} onClick={toggleMenu} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                    Contact
                  </NavLink>
                </motion.div>
                
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    onClick={() => {
                      openAuthModal('login');
                      toggleMenu();
                    }}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 w-full text-left"
                  >
                    <FiLogIn className="text-lg inline-block mr-1" />
                    Login
                  </button>
                </motion.div>
                
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="pt-2"
                >
                  <button
                    onClick={() => {
                      openAuthModal('register');
                      toggleMenu();
                    }}
                    className="block w-full text-center px-4 py-3 rounded-xl text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 backdrop-blur-sm border border-blue-500/30 hover:border-blue-400/50 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Register</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 