import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select option',
  className = '',
  searchable = false,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (searchTerm && searchable) {
      setFilteredOptions(
        options.filter(opt =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(options);
    }
    setFocusedIndex(-1);
  }, [searchTerm, options, searchable]);

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
    if (showDropdown && searchInputRef.current && searchable) {
      searchInputRef.current.focus();
    }
  }, [showDropdown, searchable]);

  const handleOptionSelect = (option) => {
    onChange(option.value);
    setShowDropdown(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleOptionSelect(filteredOptions[focusedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
    }
  };

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && dropdownRef.current) {
      const list = dropdownRef.current.querySelector('.custom-select-list');
      if (list && list.children[focusedIndex]) {
        list.children[focusedIndex].scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [focusedIndex]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <motion.button
        type="button"
        onClick={() => setShowDropdown(v => !v)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-white transition-all duration-200 bg-white/10 backdrop-blur-md border border-white/20 w-full min-w-[120px]`}
      >
        <span className="truncate text-left flex-1">
          {selectedOption ? selectedOption.label : <span className="text-gray-400">{placeholder}</span>}
        </span>
        <motion.div animate={{ rotate: showDropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronDown className="w-4 h-4 text-gray-400 ml-2" />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full mt-2 bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 max-h-72 overflow-hidden w-full"
          >
            {searchable && (
              <div className="p-3 border-b border-white/20 bg-white/10">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
              </div>
            )}
            <div className="max-h-60 overflow-y-auto custom-select-list">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center rounded-lg ${focusedIndex === index ? 'bg-blue-500/20 border-l-4 border-blue-500' : 'hover:bg-white/10'} focus:outline-none`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="truncate text-white text-base">{option.label}</span>
                  </motion.button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-400 text-sm">No options found.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 