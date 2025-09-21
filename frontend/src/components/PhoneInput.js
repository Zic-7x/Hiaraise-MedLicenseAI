import { useState, useEffect } from 'react';
import { FiPhone } from 'react-icons/fi';
import { motion } from 'framer-motion';
import CountrySelector from './CountrySelector';

export default function PhoneInput({ 
  value, 
  onChange, 
  selectedCountry, 
  onCountrySelect, 
  placeholder = "Enter your phone number",
  className = "",
  required = false,
  disabled = false
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const formatPhoneNumber = (inputValue, country) => {
    if (!country) return inputValue;
    
    // Remove all non-digit characters
    const phoneNumber = inputValue.replace(/\D/g, '');
    
    // If the number starts with the country code, format it
    const countryCodeDigits = country.phoneCode.replace('+', '');
    if (phoneNumber.startsWith(countryCodeDigits)) {
      const numberWithoutCode = phoneNumber.substring(countryCodeDigits.length);
      return country.phoneCode + ' ' + numberWithoutCode;
    }
    
    return phoneNumber;
  };

  const handlePhoneChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const formattedPhone = formatPhoneNumber(newValue, selectedCountry);
    onChange(formattedPhone);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <motion.div 
      className={`relative w-full ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* Combined Input Area */}
      <div 
        className={`flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full rounded-xl shadow-glass transition-all duration-200 
          ${disabled 
            ? 'bg-secondary-800/30 border-secondary-600/30 cursor-not-allowed opacity-50' 
            : isFocused
              ? 'bg-secondary-800/70 border-primary-500/50 shadow-lg shadow-primary-500/20' 
              : 'bg-secondary-900/50 border-secondary-700/50 hover:bg-secondary-800/50'
          }
          border backdrop-blur-sm
        `}
      >
        {/* Icon and Country Selector Row */}
        <div className="flex flex-row items-center space-x-2 space-y-1 w-full sm:w-auto">
          <div className="pl-3 flex items-center pointer-events-none z-10">
            <motion.div
              animate={{
                color: isFocused ? '#3B82F6' : '#6B7280',
                scale: isFocused ? 1.1 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              <FiPhone className="h-5 w-5" />
            </motion.div>
          </div>
          <CountrySelector
            selectedCountry={selectedCountry}
            onCountrySelect={onCountrySelect}
            className="bg-transparent hover:bg-transparent"
          />
        </div>
        
        {/* Phone Input */}
        <motion.input
          type="tel"
          value={inputValue}
          onChange={handlePhoneChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          disabled={disabled}
          className={`
            block flex-1 min-w-0 pr-4 py-3 bg-transparent text-white placeholder-secondary-500 
            focus:outline-none
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          `}
          placeholder={placeholder}
          whileFocus={{ scale: disabled ? 1 : 1.02 }}
        />
      </div>

      {/* Helper Text */}
      {selectedCountry && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-xs text-secondary-400"
        >
          Format: {selectedCountry.phoneCode} XXX XXX XXXX
        </motion.div>
      )}
    </motion.div>
  );
} 
