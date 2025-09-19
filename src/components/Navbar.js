import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiFileText, FiCreditCard, FiSettings, FiChevronDown, FiCalendar } from 'react-icons/fi';
import { 
  User, 
  FileText, 
  Settings, 
  Bell, 
  LogOut,
  Brain,
  Sparkles,
  Shield,
  Globe,
  LifeBuoy,
  Headphones
} from 'lucide-react';
import BookPhysicalAppointmentModal from './BookPhysicalAppointmentModal';
import { useAuthModal } from '../contexts/AuthModalContext';
import { useAuth } from '../hooks/useAuth';

const NavLink = ({ to, children, icon: Icon, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        relative flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all duration-300 group whitespace-nowrap
        ${isActive 
          ? 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20 text-cyan-300 border border-cyan-500/30 shadow-lg' 
          : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
        }
      `}
    >
      {Icon && <Icon className={`text-base transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-300'}`} />}
      <span className="font-medium text-sm">{children}</span>
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
};

const MobileMenu = ({ isOpen, onClose, user, handleSignOut, userProfile, mobileMenuRef, loading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop with Liquid Glass Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gradient-to-br from-gray-900/90 via-purple-900/80 to-blue-900/90 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Enhanced Menu with Liquid Glass Effect */}
          <motion.div
            ref={mobileMenuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 bottom-0 w-72 sm:w-80 bg-gradient-to-br from-gray-800/95 via-purple-800/90 to-blue-800/95 backdrop-blur-xl border-l border-white/20 shadow-2xl z-50 lg:hidden flex flex-col overflow-hidden"
          >
            {/* Liquid Glass Background Elements */}
            <div className="absolute inset-0">
              {/* Floating orbs */}
              <div className="absolute top-8 left-8 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute top-16 right-12 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
              <div className="absolute bottom-16 left-12 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
              
              {/* Liquid wave effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900/40"></div>
            </div>

            {/* Header */}
            <div className="relative flex items-center justify-between p-6 border-b border-white/20 backdrop-blur-sm">
              <h2 className="text-xl font-display font-semibold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                Menu
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-lg"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="relative flex-1 p-6 space-y-3 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse"></div>
                  <div className="w-32 h-4 bg-gray-700/50 rounded animate-pulse"></div>
                  <div className="text-gray-400 text-sm">Loading...</div>
                </div>
              ) : user ? (
                <>
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 }}
                  >
                    <NavLink to="/" icon={FiHome} onClick={onClose} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                      Home
                    </NavLink>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <NavLink to="/dashboard/user" icon={User} onClick={onClose} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                      Dashboard
                    </NavLink>
                  </motion.div>
                  
                  {/* Get License Section (mobile dropdown) */}
                  <div className="pt-2">
                    <details className="group">
                      <summary className="list-none cursor-pointer block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 transition-all duration-300 border border-white/10 group-open:border-cyan-400/30">
                        <span className="inline-flex items-center space-x-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Get License</span>
                        </span>
                      </summary>
                      <div className="pl-4 pt-2 space-y-2">
                        <NavLink to="/submit-case" icon={Sparkles} onClick={onClose} className="block px-3 py-2 rounded-lg text-gray-200 hover:text-cyan-400 hover:bg-white/10 border border-white/10">
                          Submit Case
                        </NavLink>
                        <NavLink to="/my-cases" icon={FileText} onClick={onClose} className="block px-3 py-2 rounded-lg text-gray-200 hover:text-cyan-400 hover:bg-white/10 border border-white/10">
                          My Cases
                        </NavLink>
                      </div>
                    </details>
                  </div>
                  
                  {/* Licenses Section (mobile dropdown) */}
                  <div className="pt-2">
                    <details className="group">
                      <summary className="list-none cursor-pointer block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 transition-all duration-300 border border-white/10 group-open:border-cyan-400/30">
                            <span className="inline-flex items-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <span>Licenses</span>
                            </span>
                          </summary>
                          <div className="pl-4 pt-2 space-y-2">
                            <NavLink to="/licenses" icon={FileText} onClick={onClose} className="block px-3 py-2 rounded-lg text-gray-200 hover:text-cyan-400 hover:bg-white/10 border border-white/10">
                              All Licenses
                            </NavLink>
                            <NavLink to="/start-license" icon={Sparkles} onClick={onClose} className="block px-3 py-2 rounded-lg text-gray-200 hover:text-cyan-400 hover:bg-white/10 border border-white/10">
                              Why to Get License
                            </NavLink>
                            <NavLink to="/licenses/dha-license-dubai" icon={FileText} onClick={onClose} className="block px-3 py-2 rounded-lg text-gray-200 hover:text-cyan-400 hover:bg-white/10 border border-white/10">
                              DHA License (Dubai)
                            </NavLink>
                            <NavLink to="/licenses/scfhs-license-saudi" icon={FileText} onClick={onClose} className="block px-3 py-2 rounded-lg text-gray-200 hover:text-cyan-400 hover:bg-white/10 border border-white/10">
                              SCFHS License (Saudi Arabia)
                            </NavLink>
                            <NavLink to="/licenses/qchp-license-qatar" icon={FileText} onClick={onClose} className="block px-3 py-2 rounded-lg text-gray-200 hover:text-cyan-400 hover:bg-white/10 border border-white/10">
                              QCHP License (Qatar)
                            </NavLink>
                            <NavLink to="/licenses/moh-license-uae" icon={FileText} onClick={onClose} className="block px-3 py-2 rounded-lg text-gray-200 hover:text-cyan-400 hover:bg-white/10 border border-white/10">
                              MOHAP License (UAE)
                            </NavLink>
                      </div>
                    </details>
                  </div>
                  
                  {/* Services Section (mobile dropdown) */}
                  <div className="pt-2">
                    <details className="group">
                      <summary className="list-none cursor-pointer block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 transition-all duration-300 border border-white/10 group-open:border-cyan-400/30">
                        <span className="inline-flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>Services</span>
                        </span>
                      </summary>
                      <div className="pl-4 pt-2 space-y-2">
                        {/* Tools Section */}
                        <div className="space-y-2">
                          <div className="text-xs uppercase tracking-wider text-cyan-300 font-bold px-3">Tools</div>
                          <Link
                            to="/eligibility-check"
                            onClick={onClose}
                            className="block w-full px-3 py-3 text-sm text-center bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <Brain className="w-4 h-4" />
                            <span>Eligibility Checker</span>
                          </Link>
                        </div>
                        
                        {/* Vouchers Section */}
                        <div className="pt-3 space-y-2">
                          <div className="text-xs uppercase tracking-wider text-cyan-300 font-bold px-3">Vouchers</div>
                          <Link
                            to="/prometric-vouchers"
                            onClick={onClose}
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
                        
                        {/* Exams Section */}
                        <div className="pt-3 space-y-2">
                          <div className="text-xs uppercase tracking-wider text-cyan-300 font-bold px-3">Exams</div>
                          <Link
                            to="/get-exam-pass"
                            onClick={onClose}
                            className="block w-full px-3 py-2 text-sm text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2"
                          >
                            <FiFileText className="w-4 h-4" />
                            <span>Get Exam Pass</span>
                          </Link>
                          <Link
                            to="/my-exams"
                            onClick={onClose}
                            className="block w-full px-3 py-2 text-sm text-center bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-lg hover:from-purple-700 hover:to-violet-800 transition-all duration-300 flex items-center justify-center space-x-2"
                          >
                            <FiCalendar className="w-4 h-4" />
                            <span>My Exams</span>
                          </Link>
                          <Link
                            to="/my-vouchers"
                            onClick={onClose}
                            className="block w-full px-3 py-2 text-sm text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center space-x-2"
                          >
                            <FiFileText className="w-4 h-4" />
                            <span>My Vouchers</span>
                          </Link>
                        </div>
                        
                        {/* Get License Buttons */}
                        <div className="pt-3 space-y-2">
                          <div className="text-xs uppercase tracking-wider text-cyan-300 font-bold px-3">Get License</div>
                          <Link
                            to="/case-submit"
                            onClick={onClose}
                            className="block w-full px-3 py-2 text-sm text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300"
                          >
                            Get Dubai License
                          </Link>
                          <Link
                            to="/case-submit"
                            onClick={onClose}
                            className="block w-full px-3 py-2 text-sm text-center bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:to-emerald-800 transition-all duration-300"
                          >
                            Get Saudi Arabia License
                          </Link>
                          <Link
                            to="/case-submit"
                            onClick={onClose}
                            className="block w-full px-3 py-2 text-sm text-center bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-lg hover:from-purple-700 hover:to-violet-800 transition-all duration-300"
                          >
                            Get Qatar License
                          </Link>
                          <Link
                            to="/case-submit"
                            onClick={onClose}
                            className="block w-full px-3 py-2 text-sm text-center bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-lg hover:from-orange-700 hover:to-red-800 transition-all duration-300"
                          >
                            Get UAE License
                          </Link>
                        </div>
                      </div>
                    </details>
                  </div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.45 }}
                  >
                    <NavLink to="/pricing" icon={FiCreditCard} onClick={onClose} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                      Pricing
                    </NavLink>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <NavLink to="/dashboard/payments" icon={FiCreditCard} onClick={onClose} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                      Payment History
                    </NavLink>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.55 }}
                  >
                    <NavLink to="/checkout" icon={FiCreditCard} onClick={onClose} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                      Checkout
                    </NavLink>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <NavLink to="/profile" icon={Settings} onClick={onClose} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                      Profile
                    </NavLink>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.62 }}
                  >
                    <NavLink to="/my-vouchers" icon={FileText} onClick={onClose} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                      My Vouchers
                    </NavLink>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.65 }}
                    className="pt-2"
                  >
                    <Link
                      to="/support-tickets"
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/80 rounded-xl transition-all duration-300 backdrop-blur-sm border border-gray-800/80 hover:border-gray-700/80 text-left"
                    >
                      <Headphones className="w-4 h-4" />
                      <span>Support</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="pt-2"
                  >
                    <button
                      onClick={() => {
                        handleSignOut();
                        onClose();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 backdrop-blur-sm border border-red-500/20 hover:border-red-400/30 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-center text-gray-400 p-4"
                >
                  Please log in
                </motion.div>
              )}
            </nav>

            {/* User Profile Section */}
            <div className="relative p-6 border-t border-white/20 backdrop-blur-sm">
              {loading ? (
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse"></div>
                  <div className="flex-1 min-w-0">
                    <div className="w-24 h-4 bg-gray-700/50 rounded animate-pulse mb-2"></div>
                    <div className="w-16 h-3 bg-gray-700/30 rounded animate-pulse"></div>
                  </div>
                </div>
              ) : user ? (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.75 }}
                  className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium shadow-lg">
                    {userProfile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-200 truncate">{userProfile?.full_name || user.email}</div>
                    <div className="text-xs text-gray-400">Logged in</div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center text-gray-400 p-4"
                >
                  Please log in
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Add theme constants
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

export default function Navbar() {
  const { session, loading } = useAuth();
  const user = session?.user || null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showLicensesDropdown, setShowLicensesDropdown] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showExamsDropdown, setShowExamsDropdown] = useState(false);
  const [showGetLicenseDropdown, setShowGetLicenseDropdown] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const notificationsRef = useRef(null);
  const profileMenuRef = useRef(null);
  const servicesDropdownRef = useRef(null);
  const licensesDropdownRef = useRef(null);
  const toolsDropdownRef = useRef(null);
  const examsDropdownRef = useRef(null);
  const getLicenseDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Fetch user profile when user changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
          if (error) {
            console.error('Error fetching profile:', error);
          } else {
            setUserProfile(profile);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      } else {
        setUserProfile(null);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Handle scroll and outside clicks
  useEffect(() => {
    // Handle scroll for sticky header effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Handle outside clicks for dropdowns and mobile menu
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setShowServicesDropdown(false);
      }
      if (licensesDropdownRef.current && !licensesDropdownRef.current.contains(event.target)) {
        setShowLicensesDropdown(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target)) {
        setShowToolsDropdown(false);
      }
      if (getLicenseDropdownRef.current && !getLicenseDropdownRef.current.contains(event.target)) {
        setShowGetLicenseDropdown(false);
      }
      // Close mobile menu when clicking outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

   // Fetch notifications (basic example)
   useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching notifications:', error);
        } else {
          setNotifications(data);
          setUnreadNotifications(data.filter(n => !n.read).length);
        }
      };
      fetchNotifications();

      // Realtime notifications (basic example)
      const notificationChannel = supabase
        .channel('public:notifications')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          (payload) => {
            console.log('New notification:', payload.new);
            setNotifications((prev) => [payload.new, ...prev].slice(0, 10));
            setUnreadNotifications((prev) => prev + 1);
          }
        )
        .subscribe();

      return () => {
        notificationChannel.unsubscribe();
      };
    }
  }, [user]); // Re-run when user changes

  const markNotificationAsRead = async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
    } else {
      // Update local state to reflect the change
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadNotifications((prevCount) => Math.max(0, prevCount - 1));
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (user && unreadNotifications > 0) {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadIds);

      if (error) {
        console.error('Error marking all notifications as read:', error);
      } else {
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) => ({ ...n, read: true }))
        );
        setUnreadNotifications(0);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSignOut = async () => {
    await handleLogout();
    setShowNotifications(false);
    setShowProfileMenu(false);
    setShowServicesDropdown(false);
  };

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-30 transition-all duration-300
          ${isScrolled 
            ? 'bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl rounded-b-3xl' 
            : 'bg-transparent rounded-b-3xl'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="Hiaraise MedLicense AI Portal" 
                className="w-16 h-16 rounded-lg object-contain"
              />
              <span className="font-display text-2xl font-semibold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                Hiaraise AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 ml-8 flex-1 justify-center">
              {/* Loading state */}
              {loading && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse"></div>
                  <div className="w-20 h-4 bg-gray-700/50 rounded animate-pulse"></div>
                </div>
              )}
              
              {/* User-specific navigation */}
              {!loading && user && (
                <>
                  <NavLink to="/dashboard/user" icon={User}>Dashboard</NavLink>
                  
                  {/* Get License Dropdown */}
                  <div className="relative" ref={getLicenseDropdownRef}>
                    <button
                      onClick={() => setShowGetLicenseDropdown(v => !v)}
                      className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/20 group whitespace-nowrap"
                      onBlur={() => setTimeout(() => setShowGetLicenseDropdown(false), 200)}
                    >
                      <Sparkles className="text-base transition-colors duration-300 group-hover:text-cyan-300" />
                      <span className="font-medium text-sm">Get License</span>
                      <FiChevronDown className={`transition-transform duration-300 ${showGetLicenseDropdown ? 'rotate-180' : ''} group-hover:text-cyan-300 text-sm`} />
                    </button>
                    <AnimatePresence>
                      {showGetLicenseDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden"
                        >
                          <Link
                            to="/submit-case"
                            className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:text-white hover:bg-gray-800/80 transition-colors duration-200"
                            onClick={() => setShowGetLicenseDropdown(false)}
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Submit Case</span>
                          </Link>
                          <Link
                            to="/my-cases"
                            className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:text-white hover:bg-gray-800/80 transition-colors duration-200"
                            onClick={() => setShowGetLicenseDropdown(false)}
                          >
                            <FileText className="w-4 h-4" />
                            <span>My Cases</span>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
              {/* Exams Dropdown */}
              <div className="relative" ref={examsDropdownRef}>
                <button
                  onClick={() => setShowExamsDropdown(v => !v)}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/20 group whitespace-nowrap"
                  onBlur={() => setTimeout(() => setShowExamsDropdown(false), 200)}
                >
                  <span className="font-medium text-sm">Exams</span>
                  <FiChevronDown className={`transition-transform duration-300 ${showExamsDropdown ? 'rotate-180' : ''} group-hover:text-cyan-300 text-sm`} />
                </button>
                <AnimatePresence>
                  {showExamsDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="px-6 py-2">
                        <div className="text-xs uppercase tracking-wider text-cyan-300 font-bold mb-2">Exam Management</div>
                        <div className="space-y-2">
                          <Link
                            to="/get-exam-pass"
                            className="block w-full px-4 py-2 text-sm text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2"
                            onClick={() => setShowExamsDropdown(false)}
                          >
                            <FiFileText className="w-4 h-4" />
                            <span>Get Exam Pass</span>
                          </Link>
                          <Link
                            to="/my-exams"
                            className="block w-full px-4 py-2 text-sm text-center bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-lg hover:from-purple-700 hover:to-violet-800 transition-all duration-300 flex items-center justify-center space-x-2"
                            onClick={() => setShowExamsDropdown(false)}
                          >
                            <FiCalendar className="w-4 h-4" />
                            <span>My Exams</span>
                          </Link>
                          <Link
                            to="/my-vouchers"
                            className="block w-full px-4 py-2 text-sm text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center space-x-2"
                            onClick={() => setShowExamsDropdown(false)}
                          >
                            <FiFileText className="w-4 h-4" />
                            <span>My Vouchers</span>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Services Dropdown */}
              <div className="relative" ref={servicesDropdownRef}>
                <button
                  onClick={() => setShowServicesDropdown(v => !v)}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/20 group whitespace-nowrap"
                  onBlur={() => setTimeout(() => setShowServicesDropdown(false), 200)}
                >
                  <span className="font-medium text-sm">Services</span>
                  <FiChevronDown className={`transition-transform duration-300 ${showServicesDropdown ? 'rotate-180' : ''} group-hover:text-cyan-300 text-sm`} />
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
                      {/* Eligibility Checker Section */}
                      <div className="px-6 py-2">
                        <div className="text-xs uppercase tracking-wider text-cyan-300 font-bold mb-2">Tools</div>
                        <Link
                          to="/eligibility-check"
                          className="block w-full px-4 py-3 text-sm text-center bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                          onClick={() => setShowServicesDropdown(false)}
                        >
                          <Brain className="w-4 h-4" />
                          <span>Eligibility Checker</span>
                        </Link>
                      </div>
                      
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
              {/* Licenses Dropdown */}
              <div className="relative" ref={licensesDropdownRef}>
                <button
                  onClick={() => setShowLicensesDropdown(v => !v)}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/20 group whitespace-nowrap"
                  onBlur={() => setTimeout(() => setShowLicensesDropdown(false), 200)}
                >
                  <span className="font-medium text-sm">Licenses</span>
                  <FiChevronDown className={`transition-transform duration-300 ${showLicensesDropdown ? 'rotate-180' : ''} group-hover:text-cyan-300 text-sm`} />
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
                        to="/start-license"
                        className="block px-6 py-3 text-gray-200 hover:text-white hover:bg-gray-800/80 transition-colors duration-200"
                        onClick={() => setShowLicensesDropdown(false)}
                      >
                        Why to Get License
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
              
              {/* Visual Separator */}
              <div className="w-px h-8 bg-white/20 mx-2"></div>
              
              <div className="relative flex-shrink-0" ref={notificationsRef}>
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications) {
                      markAllNotificationsAsRead();
                    }
                  }}
                  className="p-3 text-gray-300 hover:text-white rounded-xl transition-all duration-300 hover:bg-white/10 relative border border-transparent hover:border-white/20 group"
                >
                  <Bell className="w-5 h-5 group-hover:text-cyan-300 transition-colors duration-300" />
                  {unreadNotifications > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg"
                    >
                      {unreadNotifications}
                    </motion.span>
                  )}
                </button>
                 {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="p-4 border-b border-white/10">
                      <h3 className="text-white font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-white/10 transition-colors duration-200 border-b border-white/10 last:border-0 ${notification.read ? 'opacity-60' : ''}`}
                            onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                          >
                            <p className="text-gray-300 text-sm">{notification.message}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-gray-400 text-sm text-center">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enhanced Profile Menu */}
              <div className="relative ml-1 flex-shrink-0" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-white/20"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium shadow-lg text-sm">
                      {userProfile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-gray-200 group-hover:text-white text-xs font-medium truncate max-w-20">
                      {userProfile?.full_name || 'User'}
                    </span>
                    <span className="text-gray-400 text-xs truncate max-w-20">
                      {user?.email}
                    </span>
                  </div>
                  <FiChevronDown className={`transition-transform ${showProfileMenu ? 'rotate-180' : ''} text-gray-400 text-sm`} />
                </button>

                <AnimatePresence>
                {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                            {userProfile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">{userProfile?.full_name || 'User'}</div>
                            <div className="text-xs text-gray-400 truncate">{user?.email}</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {/* Account Section */}
                        <div className="px-3 py-2">
                          <div className="text-xs uppercase tracking-wider text-cyan-300 font-bold mb-2">Account</div>
                      <Link
                        to="/profile"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                            to="/dashboard/payments"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                        onClick={() => setShowProfileMenu(false)}
                      >
                            <FiCreditCard className="w-4 h-4" />
                            <span>Payment History</span>
                      </Link>
                      <Link
                            to="/settings"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                        onClick={() => setShowProfileMenu(false)}
                      >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                      </Link>
                        </div>

                        {/* Services Section */}
                        <div className="px-3 py-2">
                          <div className="text-xs uppercase tracking-wider text-cyan-300 font-bold mb-2">Services</div>
                      <Link
                        to="/my-cases"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <FileText className="w-4 h-4" />
                        <span>My Cases</span>
                      </Link>
                      <Link
                            to="/my-vouchers"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                        onClick={() => setShowProfileMenu(false)}
                      >
                            <FiFileText className="w-4 h-4" />
                            <span>My Vouchers</span>
                      </Link>
                      <Link
                            to="/my-exams"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                        onClick={() => setShowProfileMenu(false)}
                      >
                            <FiCalendar className="w-4 h-4" />
                            <span>My Exams</span>
                      </Link>
                        </div>

                        {/* Support Section */}
                        <div className="px-3 py-2 border-t border-white/10">
                      <Link
                            to="/support-tickets"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                        onClick={() => setShowProfileMenu(false)}
                      >
                            <Headphones className="w-4 h-4" />
                            <span>Support</span>
                      </Link>
                          <button
                        onClick={() => { setShowProfileMenu(false); setShowAppointmentModal(true); }}
                            className="flex items-center space-x-3 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg mx-2 text-left"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Book Appointment</span>
                          </button>
                        </div>

                        {/* Sign Out */}
                        <div className="px-3 py-2 border-t border-white/10">
                      <button
                        onClick={handleSignOut}
                            className="flex items-center space-x-3 w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 rounded-lg mx-2 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                    </motion.div>
                )}
                </AnimatePresence>
              </div>
                </>
             )}
            </nav>
            
            {/* Non-authenticated user buttons */}
            {!loading && !user && (
               <div className="hidden lg:flex items-center space-x-3 ml-8">
                 <button
                   onClick={() => openAuthModal('login')}
                   className="text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10 border border-transparent hover:border-white/20"
                 >
                   Sign In
                 </button>
                 <button
                   onClick={() => openAuthModal('register')}
                   className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                 >
                   Get Started
                 </button>
               </div>
            )}

            {/* Mobile menu button */}
            <div className="flex lg:hidden items-center ml-4">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300 border border-transparent hover:border-white/20"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <FiMenu className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <FiX className="block h-6 w-6" aria-hidden="true" />
                )}
            </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        handleSignOut={handleSignOut}
        userProfile={userProfile}
        mobileMenuRef={mobileMenuRef}
        loading={loading}
      />

      <BookPhysicalAppointmentModal open={showAppointmentModal} onClose={() => setShowAppointmentModal(false)} />

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16" />
    </>
  );
}
