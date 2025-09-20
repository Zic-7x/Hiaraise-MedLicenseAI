import { Link } from 'react-router-dom';
import { FiGift, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function BookVoucherButton({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  showIcon = true,
  showLogo = false,
  children = 'Book Voucher Now',
  linkTo = '/prometric-vouchers'
}) {
  const baseClasses = "inline-flex items-center space-x-2 font-semibold shadow-lg transition-all duration-300 transform hover:scale-105";
  
  const variants = {
    primary: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white",
    secondary: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white",
    outline: "bg-transparent border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white",
    ghost: "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20"
  };
  
  const sizes = {
    sm: "px-4 py-2 rounded-lg text-sm",
    md: "px-6 py-3 rounded-xl text-base",
    lg: "px-8 py-4 rounded-xl text-lg"
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={linkTo} className={classes}>
        {showLogo ? (
          <img 
            src="/Prometric-Logo.png" 
            alt="Prometric Logo" 
            className="w-6 h-6 object-contain"
          />
        ) : showIcon ? (
          <FiGift className="w-5 h-5" />
        ) : null}
        <span>{children}</span>
        <FiArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
