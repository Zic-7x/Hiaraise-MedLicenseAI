import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheck, 
  FiArrowRight, 
  FiArrowLeft, 
  FiUser, 
  FiMapPin, 
  FiCreditCard, 
  FiFileText,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
  FiSearch,
  FiChevronDown
} from 'react-icons/fi';
import { countries } from '../data/countries';

export default function VoucherSubmissionFlow({ voucherCode, onClose, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Terms and conditions
    termsAccepted: false,
    
    // Step 2: Location and voucher validation
    city: '',
    postalCode: '',
    voucherCode: voucherCode || '',
    
    // Step 3: Profile details
    firstName: '',
    middleName: '',
    lastName: '',
    streetAddressLine1: '',
    streetAddressLine2: '',
    cityAddress: '',
    country: '',
    stateProvince: '',
    postalCodeAddress: '',
    emailAddress: '',
    validateEmail: '',
    workDayPhone: '',
    homeEveningPhone: '',
    dateOfBirth: '',
    governmentId: '',
    governmentIdIssuingCountry: '',
  });
  
  // Voucher details
  const [voucherDetails, setVoucherDetails] = useState(null);
  const [voucherValidationError, setVoucherValidationError] = useState('');
  
  // Country search states
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [showIdCountryDropdown, setShowIdCountryDropdown] = useState(false);
  const [idCountrySearchTerm, setIdCountrySearchTerm] = useState('');
  const [filteredIdCountries, setFilteredIdCountries] = useState(countries);
  
  // Refs for dropdown management
  const countryDropdownRef = useRef(null);
  const idCountryDropdownRef = useRef(null);

  const steps = [
    { number: 1, title: 'Terms & Conditions', icon: FiFileText },
    { number: 2, title: 'Location & Voucher', icon: FiMapPin },
    { number: 3, title: 'Profile Details', icon: FiUser },
    { number: 4, title: 'Review & Submit', icon: FiCheckCircle }
  ];

  useEffect(() => {
    if (voucherCode) {
      validateVoucherCode(voucherCode);
    }
  }, [voucherCode]);

  const validateVoucherCode = async (code) => {
    if (!code) return;
    
    setLoading(true);
    setVoucherValidationError('');
    
    try {
      const { data, error } = await supabase
        .from('voucher_purchases')
        .select(`
          *,
          voucher_slots!voucher_purchases_slot_id_fkey(
            exam_authority,
            exam_date,
            start_time,
            end_time,
            final_price
          )
        `)
        .eq('voucher_code', code.toUpperCase())
        .eq('status', 'purchased')
        .single();

      if (error) {
        setVoucherValidationError('Invalid voucher code. Please check and try again.');
        setVoucherDetails(null);
      } else {
        setVoucherDetails(data);
        setVoucherValidationError('');
      }
    } catch (err) {
      setVoucherValidationError('Error validating voucher code. Please try again.');
      setVoucherDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Auto-validate voucher code when typing
    if (name === 'voucherCode' && value.length >= 8) {
      validateVoucherCode(value);
    }
  };

  // Country search functionality
  const handleCountrySearch = (searchTerm) => {
    setCountrySearchTerm(searchTerm);
    if (searchTerm.trim() === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  };

  const handleIdCountrySearch = (searchTerm) => {
    setIdCountrySearchTerm(searchTerm);
    if (searchTerm.trim() === '') {
      setFilteredIdCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredIdCountries(filtered);
    }
  };

  const selectCountry = (country) => {
    setFormData(prev => ({
      ...prev,
      country: country.name
    }));
    setCountrySearchTerm(country.name);
    setShowCountryDropdown(false);
  };

  const selectIdCountry = (country) => {
    setFormData(prev => ({
      ...prev,
      governmentIdIssuingCountry: country.name
    }));
    setIdCountrySearchTerm(country.name);
    setShowIdCountryDropdown(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
      if (idCountryDropdownRef.current && !idCountryDropdownRef.current.contains(event.target)) {
        setShowIdCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.termsAccepted;
      case 2:
        return formData.city && formData.postalCode && voucherDetails && !voucherValidationError;
      case 3:
        return formData.firstName && formData.lastName && formData.streetAddressLine1 && 
               formData.cityAddress && formData.country && formData.postalCodeAddress &&
               formData.emailAddress && formData.validateEmail && formData.homeEveningPhone &&
               formData.dateOfBirth && formData.governmentId && formData.governmentIdIssuingCountry &&
               formData.emailAddress === formData.validateEmail &&
               countrySearchTerm && idCountrySearchTerm;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to submit a voucher.');
      }

      // Create exam booking
      const { data, error } = await supabase
        .from('exam_bookings')
        .insert([{
          voucher_purchase_id: voucherDetails.id,
          user_id: user.id,
          terms_accepted: formData.termsAccepted,
          terms_accepted_at: new Date().toISOString(),
          city: formData.city,
          postal_code: formData.postalCode,
          first_name: formData.firstName,
          middle_name: formData.middleName,
          last_name: formData.lastName,
          street_address_line_1: formData.streetAddressLine1,
          street_address_line_2: formData.streetAddressLine2,
          city_address: formData.cityAddress,
          country: formData.country,
          state_province: formData.stateProvince,
          postal_code_address: formData.postalCodeAddress,
          email_address: formData.emailAddress,
          validate_email: formData.validateEmail,
          work_day_phone: formData.workDayPhone,
          home_evening_phone: formData.homeEveningPhone,
          date_of_birth: formData.dateOfBirth,
          government_id: formData.governmentId,
          government_id_issuing_country: formData.governmentIdIssuingCountry,
          exam_authority: voucherDetails.voucher_slots.exam_authority,
          exam_date: voucherDetails.voucher_slots.exam_date,
          exam_start_time: voucherDetails.voucher_slots.start_time,
          exam_end_time: voucherDetails.voucher_slots.end_time,
          exam_fee: voucherDetails.voucher_slots.final_price,
          status: 'submitted'
        }])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess && onSuccess(data);
        onClose && onClose();
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FiFileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Terms & Conditions</h2>
              <p className="text-gray-300">Please read and accept our terms and conditions to proceed</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Exam Booking Terms & Conditions</h3>
              
              <div className="space-y-4 text-gray-300 text-sm">
                <div>
                  <h4 className="font-semibold text-white mb-2">1. Voucher Submission</h4>
                  <p>By submitting your voucher, you agree that:</p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Your voucher code is valid and belongs to you</li>
                    <li>You will provide accurate personal information</li>
                    <li>You understand the exam booking process</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">2. Personal Information</h4>
                  <p>You agree to provide accurate information including:</p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Full name matching your government-issued ID</li>
                    <li>Current address and contact information</li>
                    <li>Valid government-issued identification details</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">3. Exam Pass Issuance</h4>
                  <p>Upon successful submission:</p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Your exam will be booked automatically</li>
                    <li>Exam pass will be issued 3-7 days before exam date</li>
                    <li>You will receive notification when ready for download</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">4. Cancellation Policy</h4>
                  <p>Exam bookings are final and cannot be cancelled or rescheduled once submitted.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">5. Data Protection</h4>
                  <p>Your personal information will be processed in accordance with our privacy policy and used solely for exam booking purposes.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="termsAccepted" className="text-gray-300">
                I have read and agree to the terms and conditions above
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FiMapPin className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Location & Voucher</h2>
              <p className="text-gray-300">Provide your location and validate your voucher code</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your city"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Postal Code <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter postal code"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Voucher Code <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="voucherCode"
                    value={formData.voucherCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg"
                    placeholder="Enter voucher code"
                    required
                  />
                  {voucherValidationError && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {voucherValidationError}
                    </p>
                  )}
                </div>

                {voucherDetails && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <FiCheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      <span className="text-green-400 font-semibold">Voucher Validated</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Exam Authority:</span>
                        <span className="text-white font-semibold">{voucherDetails.voucher_slots.exam_authority}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Exam Date:</span>
                        <span className="text-white font-semibold">
                          {new Date(voucherDetails.voucher_slots.exam_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Time:</span>
                        <span className="text-white font-semibold">
                          {voucherDetails.voucher_slots.start_time?.slice(0,5)} - {voucherDetails.voucher_slots.end_time?.slice(0,5)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Fee:</span>
                        <span className="text-white font-semibold">${voucherDetails.voucher_slots.final_price}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FiUser className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Profile Details</h2>
              <p className="text-gray-300">Provide your personal information for exam registration</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
              <p className="text-gray-300 text-sm mb-4">
                The name used to schedule your appointment must exactly match the name shown on your identification. 
                At a minimum, the identification must be a valid, government-issued ID that shows your name in the 
                English alphabet, your signature and your photograph.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First (Given) Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter middle name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last (Family) Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter last name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Street Address Line 1 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="streetAddressLine1"
                    value={formData.streetAddressLine1}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter street address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Street Address Line 2
                  </label>
                  <input
                    type="text"
                    name="streetAddressLine2"
                    value={formData.streetAddressLine2}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter apartment, suite, etc. (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="cityAddress"
                    value={formData.cityAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div className="relative" ref={countryDropdownRef}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={countrySearchTerm}
                      onChange={(e) => handleCountrySearch(e.target.value)}
                      onFocus={() => setShowCountryDropdown(true)}
                      placeholder="Search and select your country"
                      className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      required
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <FiSearch className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {showCountryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto"
                      >
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => selectCountry(country)}
                              className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-3 border-b border-white/10 last:border-b-0"
                            >
                              <span className="text-lg">{country.flag}</span>
                              <div>
                                <div className="font-medium">{country.name}</div>
                                <div className="text-sm text-gray-400">{country.code}</div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-400">
                            <FiSearch className="w-8 h-8 mx-auto mb-2" />
                            <p>No countries found</p>
                            <p className="text-sm">Try a different search term</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="stateProvince"
                    value={formData.stateProvince}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter state or province"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Postal Code <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCodeAddress"
                    value={formData.postalCodeAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter postal code"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Validate Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="validateEmail"
                    value={formData.validateEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Re-enter email address"
                    required
                  />
                  {formData.emailAddress && formData.validateEmail && formData.emailAddress !== formData.validateEmail && (
                    <p className="text-red-400 text-sm mt-2">Email addresses do not match</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Work/Day Phone
                  </label>
                  <input
                    type="tel"
                    name="workDayPhone"
                    value={formData.workDayPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter work phone (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Home (Evening) Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="homeEveningPhone"
                    value={formData.homeEveningPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter home phone"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date of Birth <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Government ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="governmentId"
                    value={formData.governmentId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter government ID number"
                    required
                  />
                </div>

                <div className="relative" ref={idCountryDropdownRef}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Government ID Issuing Country <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={idCountrySearchTerm}
                      onChange={(e) => handleIdCountrySearch(e.target.value)}
                      onFocus={() => setShowIdCountryDropdown(true)}
                      placeholder="Search and select issuing country"
                      className="w-full px-4 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      required
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <FiSearch className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {showIdCountryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto"
                      >
                        {filteredIdCountries.length > 0 ? (
                          filteredIdCountries.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => selectIdCountry(country)}
                              className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-3 border-b border-white/10 last:border-b-0"
                            >
                              <span className="text-lg">{country.flag}</span>
                              <div>
                                <div className="font-medium">{country.name}</div>
                                <div className="text-sm text-gray-400">{country.code}</div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-400">
                            <FiSearch className="w-8 h-8 mx-auto mb-2" />
                            <p>No countries found</p>
                            <p className="text-sm">Try a different search term</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Application Review</h2>
              <p className="text-gray-300">Review your details before submitting</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Exam Details */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FiCalendar className="w-5 h-5 mr-2" />
                  Exam Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Authority:</span>
                    <span className="text-white font-semibold">{voucherDetails?.voucher_slots.exam_authority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Date:</span>
                    <span className="text-white font-semibold">
                      {voucherDetails?.voucher_slots.exam_date && new Date(voucherDetails.voucher_slots.exam_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Time:</span>
                    <span className="text-white font-semibold">
                      {voucherDetails?.voucher_slots.start_time?.slice(0,5)} - {voucherDetails?.voucher_slots.end_time?.slice(0,5)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Fee:</span>
                    <span className="text-white font-semibold">${voucherDetails?.voucher_slots.final_price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Voucher Code:</span>
                    <span className="text-white font-semibold font-mono">{voucherDetails?.voucher_code}</span>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FiUser className="w-5 h-5 mr-2" />
                  Personal Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Name:</span>
                    <span className="text-white font-semibold">
                      {formData.firstName} {formData.middleName} {formData.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Email:</span>
                    <span className="text-white font-semibold">{formData.emailAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Phone:</span>
                    <span className="text-white font-semibold">{formData.homeEveningPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Address:</span>
                    <span className="text-white font-semibold">
                      {formData.streetAddressLine1}, {formData.cityAddress}, {formData.country}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">DOB:</span>
                    <span className="text-white font-semibold">
                      {formData.dateOfBirth && new Date(formData.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">ID:</span>
                    <span className="text-white font-semibold">{formData.governmentId}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FiShield className="w-5 h-5 mr-2" />
                Important Notice
              </h3>
              <p className="text-gray-300 text-sm">
                Your exam has been booked and exam document will be issued 3 to 7 days before exam. 
                You can download it from "My Exams" section once it's ready.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 max-w-md w-full text-center"
        >
          <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Submission Successful!</h2>
          <p className="text-gray-300 mb-6">
            Your exam has been booked successfully. You will receive your exam pass 3-7 days before the exam date.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300"
          >
            Close
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Submit Voucher for Exam Booking</h1>
            <p className="text-gray-300">Complete the steps below to book your exam</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const isValid = isStepValid(step.number);

            return (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  isCompleted ? 'bg-green-500 border-green-500 text-white' :
                  isActive ? 'bg-blue-500 border-blue-500 text-white' :
                  isValid ? 'bg-green-500/20 border-green-500 text-green-400' :
                  'bg-gray-500/20 border-gray-500 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <FiCheck className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <p className="text-red-400 flex items-center">
              <FiAlertCircle className="w-5 h-5 mr-2" />
              {error}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              currentStep === 1
                ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FiArrowLeft className="w-5 h-5 inline mr-2" />
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                !isStepValid(currentStep)
                  ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
              }`}
            >
              Next
              <FiArrowRight className="w-5 h-5 inline ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !isStepValid(currentStep)}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                loading || !isStepValid(currentStep)
                  ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Submitting...
                </div>
              ) : (
                <>
                  <FiCheck className="w-5 h-5 inline mr-2" />
                  Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
