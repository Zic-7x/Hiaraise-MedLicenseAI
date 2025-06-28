import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiFileText, FiCreditCard, FiSettings } from 'react-icons/fi';
import { 
  User, 
  FileText, 
  Settings, 
  Bell, 
  LogOut,
  Brain,
  Sparkles,
  Shield,
  Globe
} from 'lucide-react';

const NavLink = ({ to, children, icon: Icon, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300
        ${isActive 
          ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' 
          : 'text-gray-300 hover:text-white hover:bg-white/10'
        }
      `}
    >
      {Icon && <Icon className="text-lg" />}
      <span>{children}</span>
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
};

const MobileMenu = ({ isOpen, onClose, user, handleSignOut, userProfile }) => {
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
              {user ? (
                <>
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <NavLink to="/dashboard/user" icon={User} onClick={onClose} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                      Dashboard
                    </NavLink>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <NavLink to="/my-cases" icon={FileText} onClick={onClose} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                      My Cases
                    </NavLink>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <NavLink to="/submit-case" icon={Sparkles} onClick={onClose} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                      Submit Case
                    </NavLink>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    <NavLink to="/services" icon={Globe} onClick={onClose} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                      Services
                    </NavLink>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <NavLink to="/dashboard/payments" icon={FiCreditCard} onClick={onClose} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                      Payment History
                    </NavLink>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    <NavLink to="/checkout" icon={FiCreditCard} onClick={onClose} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                      Checkout
                    </NavLink>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <NavLink to="/profile" icon={Settings} onClick={onClose} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-white/10 focus:outline-none focus:text-cyan-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30">
                      Profile
                    </NavLink>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="pt-2"
                  >
                    <button
                      onClick={() => {
                        handleSignOut();
                        onClose();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 backdrop-blur-sm border border-red-500/20 hover:border-red-400/30 text-left"
                    >
                      <LogOut className="text-lg" />
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
              {user ? (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
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
                  transition={{ delay: 0.5 }}
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
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  const notificationsRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Fetch user and profile
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
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
      }
    };

    fetchUserAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        setUserProfile(null);
      }
    });

    // Handle scroll for sticky header effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Handle outside clicks for dropdowns
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      subscription.unsubscribe();
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
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                <Brain className="w-5 h-5" />
              </div>
              <span className="font-display text-xl font-semibold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                Hiaraise AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            {user && (
            <nav className="hidden lg:flex items-center space-x-1">
              <NavLink to="/dashboard/user" icon={User}>Dashboard</NavLink>
              <NavLink to="/my-cases" icon={FileText}>My Cases</NavLink>
              <NavLink to="/submit-case" icon={Sparkles}>Submit Case</NavLink>
              {/* Services, Payment History, and Checkout moved to profile dropdown */}
              {/* You might want a separate settings page */}
              {/* <NavLink to="/settings" icon={Settings}>Settings</NavLink> */}
               <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications) {
                      markAllNotificationsAsRead();
                    }
                  }}
                  className="p-2 text-gray-300 hover:text-white rounded-lg transition-colors duration-200 hover:bg-white/10 relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-rose-500 rounded-full text-xs text-white flex items-center justify-center">
                      {unreadNotifications}
                    </span>
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
               {/* Profile Menu */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 hover:bg-white/10 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                    {userProfile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-gray-300 group-hover:text-white text-sm">
                     {userProfile?.full_name || user?.email}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/my-cases"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <FileText className="w-4 h-4" />
                        <span>My Cases</span>
                      </Link>
                      <Link
                        to="/services"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Globe className="w-4 h-4" />
                        <span>Services</span>
                      </Link>
                      <Link
                        to="/dashboard/payments"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <FiCreditCard className="w-4 h-4" />
                        <span>Payment History</span>
                      </Link>
                      <Link
                        to="/checkout"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <FiCreditCard className="w-4 h-4" />
                        <span>Checkout</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors duration-200 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </nav>
             )}
             {!user && (
               <div className="hidden lg:flex items-center space-x-4">
                 <Link
                   to="/login"
                   className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
                 >
                   Sign In
                 </Link>
                 <Link
                   to="/register"
                   className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
                 >
                   Get Started
                 </Link>
               </div>
             )}

            {/* Mobile menu button */}
            <div className="-mr-2 flex lg:hidden items-center">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
      />

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16" />
    </>
  );
}
