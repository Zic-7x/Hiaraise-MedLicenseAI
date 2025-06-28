import { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiSearch, FiGlobe } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { countries, getDefaultCountry } from '../data/countries';
import { searchCountries } from '../utils/countryDetection';

export default function CountrySelector({ 
  selectedCountry, 
  onCountrySelect, 
  className = "",
  placeholder = "Select country"
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (searchTerm) {
      setFilteredCountries(searchCountries(searchTerm));
    } else {
      setFilteredCountries(countries);
    }
    setFocusedIndex(-1);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showDropdown && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showDropdown]);

  const handleCountrySelect = (country) => {
    onCountrySelect(country);
    setShowDropdown(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredCountries.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCountries.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && filteredCountries[focusedIndex]) {
          handleCountrySelect(filteredCountries[focusedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
    }
  };

  const handleButtonClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  };

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex];
      if (focusedElement) {
        focusedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [focusedIndex]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Country Selector Button */}
      <motion.button
        type="button"
        onClick={handleButtonClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          flex items-center justify-between px-3 py-2.5 rounded-xl text-white transition-all duration-200
          ${showDropdown 
            ? 'bg-primary-500/20 border-primary-500/50 shadow-lg shadow-primary-500/20' 
            : 'bg-secondary-900/50 border-secondary-700/50 hover:bg-secondary-800/50'
          }
          border backdrop-blur-sm pr-2 w-fit min-w-[105px] max-w-[125px] sm:max-w-[145px]
        `}
        ref={buttonRef}
      >
        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-lg leading-none"
            style={{ fontFamily: 'Twemoji Mozilla, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji, EmojiSymbols, sans-serif' }}
          >
            {selectedCountry?.flag || '🌍'}
          </span>
          <div className="flex flex-col items-start leading-tight min-w-[40px] sm:min-w-[45px]">
            <span className="text-sm font-medium leading-none">
              {selectedCountry?.phoneCode || '+1'}
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: showDropdown ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown className="w-4 h-4 text-secondary-400" />
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full mt-2 bg-secondary-900/95 backdrop-blur-xl border border-secondary-700/50 rounded-xl shadow-2xl shadow-black/50 z-50 max-h-80 overflow-hidden w-full sm:w-[300px]"
            style={{ left: buttonRef.current ? buttonRef.current.offsetLeft : 'auto', right: buttonRef.current ? (window.innerWidth - (buttonRef.current.offsetLeft + buttonRef.current.offsetWidth)) : 'auto' }}
          >
            {/* Search Input */}
            <div className="p-3 border-b border-secondary-700/50 bg-secondary-800/30">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-3 py-2.5 bg-secondary-800/50 border border-secondary-600/50 rounded-lg text-white placeholder-secondary-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Countries List */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar" ref={listRef}>
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => (
                  <motion.button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`
                      w-full px-4 py-4 text-left transition-all duration-200 flex items-center space-x-4 rounded-lg
                      ${focusedIndex === index 
                        ? 'bg-primary-500/20 border-l-4 border-primary-500' 
                        : 'hover:bg-secondary-700/50'
                      }
                      focus:outline-none focus:ring-2 focus:ring-primary-500/50
                    `}
                    style={{ minHeight: '48px' }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <span className="text-2xl filter drop-shadow-sm leading-none"
                        style={{ fontFamily: 'Twemoji Mozilla, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji, EmojiSymbols, sans-serif' }}
                      >
                        {country.flag}
                      </span>
                      <div className="flex-1 text-left">
                        <div className="text-white text-base font-medium leading-tight">
                          {country.name}
                        </div>
                        <div className="text-secondary-400 text-sm leading-tight">
                          {country.phoneCode} • {country.code}
                        </div>
                      </div>
                    </div>
                    {focusedIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-2 h-2 bg-primary-500 rounded-full"
                      />
                    )}
                  </motion.button>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 py-8 text-center"
                >
                  <FiGlobe className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
                  <div className="text-secondary-400 text-sm">
                    No countries found
                  </div>
                  <div className="text-secondary-500 text-xs mt-1">
                    Try a different search term
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-secondary-700/50 bg-secondary-800/30">
              <div className="text-xs text-secondary-500 text-center">
                {filteredCountries.length} countries available
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
} 