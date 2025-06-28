import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { packages } from '../config/packages';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiUpload, FiCheck, FiAlertCircle, FiFile, FiX, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { DOCUMENT_STEPS } from './CaseSubmission';

const BANKS = {
  nayapay: {
    title: 'Muhammed Umar Farooq',
    number: '0340-4530056',
    bank: 'Nayapay',
    instructions: 'Open your Banking App → Select Bank Transfer → Select Nayapay Bank. Please note Transaction Amount should not exceed 25,000 PKR',
  },
  askari: {
    title: 'Mehreen Munawwar',
    number: '03212610000032',
    bank: 'Askari Bank',
    instructions: 'Open your Banking App → Select Bank Transfer → Select Askari Bank',
  },
};

const STEPS = {
  SELECT_PACKAGE: 'select_package',
  PAYMENT_DETAILS: 'payment_details',
  UPLOAD_PROOF: 'upload_proof',
  CONFIRMATION: 'confirmation'
};

const STORAGE_KEY = 'checkout_state';

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="flex justify-center mb-12">
      {Object.values(steps).map((step, index) => (
        <div key={step} className="flex items-center">
          <motion.div
            className={`
              w-12 h-12 rounded-full flex items-center justify-center
              ${currentStep === step 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg' 
                : Object.values(steps).indexOf(currentStep) > index 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                  : 'bg-gray-700 text-gray-300 border border-gray-600'
              }
              transition-all duration-300
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {Object.values(steps).indexOf(currentStep) > index ? (
              <FiCheck className="text-xl" />
            ) : (
              <span className="font-semibold">{index + 1}</span>
            )}
          </motion.div>
          {index < Object.values(steps).length - 1 && (
            <div className="w-32 h-1 mx-2 relative">
              <div className="absolute inset-0 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: Object.values(steps).indexOf(currentStep) > index ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const PackageCard = ({ pkg, onSelect, isSelected }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`
      bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 flex flex-col shadow-xl
      ${isSelected ? 'ring-2 ring-blue-500 shadow-2xl' : ''}
      transition-all duration-300
    `}
  >
    <h2 className="text-2xl font-bold text-white mb-3">{pkg.country}</h2>
    <div className="text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent mb-4">{pkg.displayPrice}</div>
    <p className="mb-6 text-gray-300 flex-grow leading-relaxed">{pkg.description}</p>
    <h3 className="font-semibold text-gray-200 mb-3">Process Timeline</h3>
    <ol className="list-decimal ml-6 mb-6 text-sm text-gray-300 space-y-2">
      {pkg.timeline.map((step, i) => (
        <li key={i} className="leading-relaxed">{step}</li>
      ))}
    </ol>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(pkg)}
      className={`
        mt-auto py-3 px-6 rounded-xl font-semibold shadow-lg
        ${isSelected 
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl' 
          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl'
        }
        transition-all duration-300
      `}
    >
      {isSelected ? 'Selected' : 'Select Package'}
    </motion.button>
  </motion.div>
);

const PaymentDetails = ({ selectedPackage, additionalDocuments, totalAdditionalCost, bank, onBack, onProceed, milestoneStep }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl"
  >
    <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-8">Payment Details</h2>
    
    <div className="space-y-8">
      {/* Display Milestone Step Additional Charge if applicable */}
      {milestoneStep && milestoneStep.additional_charge > 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
          <h3 className="font-semibold text-xl text-gray-200 mb-4">Milestone Step Additional Charge</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-white">{milestoneStep.name || 'Additional Charge'}</div>
              <div className="text-3xl font-semibold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent mt-2">
                PKR {milestoneStep.additional_charge.toLocaleString()}
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <FiCreditCard className="text-blue-400 text-2xl" />
            </div>
          </div>
        </div>
      ) : selectedPackage ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
          <h3 className="font-semibold text-xl text-gray-200 mb-4">Selected Package</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-white">{selectedPackage.country}</div>
              <div className="text-3xl font-semibold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent mt-2">
                {selectedPackage.displayPrice}
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <FiCreditCard className="text-blue-400 text-2xl" />
            </div>
          </div>
        </div>
      ) : additionalDocuments.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
          <h3 className="font-semibold text-xl text-gray-200 mb-4">Additional Documents</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Additional Documents Fee</div>
              <div className="text-3xl font-semibold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent mt-2">
                PKR {totalAdditionalCost.toLocaleString()}
              </div>
              <div className="text-sm text-gray-300 mt-2">
                {additionalDocuments.length} document set(s) to be added
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <FiFile className="text-blue-400 text-2xl" />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
        <h3 className="font-semibold text-xl text-gray-200 mb-6">Bank Account Details</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Account Title</span>
            <span className="font-medium text-white">{bank.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Account Number</span>
            <span className="font-medium text-white font-mono">{bank.number}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Bank Name</span>
            <span className="font-medium text-white">{bank.bank}</span>
          </div>
        </div>
        <div className="mt-6 p-4 bg-white/10 rounded-lg text-gray-300 text-sm border border-white/20">
          {bank.instructions}
        </div>
      </div>
    </div>

    <div className="flex justify-between mt-10 pt-8 border-t border-white/20">
      {!additionalDocuments.length && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="flex items-center px-6 py-3 bg-gray-700 text-gray-200 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 border border-gray-600"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </motion.button>
      )}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onProceed}
        className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        I've Made the Payment
        <FiArrowRight className="ml-2" />
      </motion.button>
    </div>
  </motion.div>
);

const UploadProof = ({ onSubmit, onBack, loading, error, screenshot, onScreenshotChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl"
  >
    <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-8">Upload Payment Proof</h2>
    
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-3">
          Upload Payment Screenshot
        </label>
        
        {screenshot ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <FiFile className="text-green-400 text-xl" />
              <span className="text-green-200 font-medium truncate max-w-xs">
                {screenshot.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onScreenshotChange(null)}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>
        ) : (
          <div
            className={`
              relative border-2 border-dashed border-gray-600 rounded-xl p-8 cursor-pointer
              transition-all duration-300 ease-in-out
              hover:border-blue-400 hover:bg-white/5
            `}
            onClick={() => document.getElementById('screenshot-upload').click()}
          >
            <input
              id="screenshot-upload"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
                  if (!allowedTypes.includes(file.type)) {
                    return;
                  }
                  const maxSize = 5 * 1024 * 1024;
                  if (file.size > maxSize) {
                    return;
                  }
                  onScreenshotChange(file);
                }
              }}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center text-center">
              <FiUpload className="text-4xl text-gray-400 mb-4" />
              <p className="text-lg text-gray-200">
                Drag & drop your file here, or click to select
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Supports JPG, PNG, PDF (max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-900/50 text-red-200 flex items-center border border-red-500/30 shadow-md"
        >
          <FiAlertCircle className="mr-3 text-xl" />
          {error}
        </motion.div>
      )}

      <div className="flex justify-between pt-8 border-t border-white/20">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onBack}
          className="flex items-center px-6 py-3 bg-gray-700 text-gray-200 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 border border-gray-600"
          disabled={loading}
        >
          <FiArrowLeft className="mr-2" />
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className={`
            flex items-center px-6 py-3 rounded-xl font-semibold shadow-lg
            ${loading 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl'
            }
            transition-all duration-300
          `}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              Submit Payment
              <FiArrowRight className="ml-2" />
            </>
          )}
        </motion.button>
      </div>
    </form>
  </motion.div>
);

const Confirmation = ({ onDashboard, additionalDocuments }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center shadow-xl"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      className="w-24 h-24 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30 shadow-md"
    >
      <FiCheck className="text-green-400 text-5xl" />
    </motion.div>
    
    <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-6">Payment Submitted Successfully!</h2>
    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
      Thank you for your payment. Our team will review your payment within 15 minutes.
    </p>
    
    <div className="bg-white/5 p-6 rounded-xl mb-10 border border-white/10 shadow-md">
      <p className="text-gray-300 leading-relaxed">
        You will receive a confirmation email once your payment is verified.
        {additionalDocuments?.length > 0 ? 
          ' After verification, your additional documents will be processed.' :
          ' After verification, you can proceed with submitting your case.'}
      </p>
    </div>
    
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onDashboard}
      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
    >
      Go to Dashboard
      <FiArrowRight className="ml-3" />
    </motion.button>
  </motion.div>
);

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const stepId = queryParams.get('step_id');
  // Assuming case_id is also passed for context if needed

  const [currentStep, setCurrentStep] = useState(() => {
    // Try to restore state from localStorage
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const { step, selectedPackage: savedPackage } = JSON.parse(savedState);
        // Verify the saved package still exists
        if (savedPackage && packages.find(p => p.id === savedPackage.id)) {
          return step;
        }
      } catch (e) {
        console.error('Error restoring checkout state:', e);
      }
    }
    return STEPS.SELECT_PACKAGE;
  });

  const [selectedPackage, setSelectedPackage] = useState(() => {
    // Try to restore package from localStorage
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const { selectedPackage: savedPackage } = JSON.parse(savedState);
        // Verify the saved package still exists
        if (savedPackage && packages.find(p => p.id === savedPackage.id)) {
          return savedPackage;
        }
      } catch (e) {
        console.error('Error restoring checkout state:', e);
      }
    }
    return null;
  });

  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [additionalDocuments, setAdditionalDocuments] = useState([]);
  const [totalAdditionalCost, setTotalAdditionalCost] = useState(0);
  const [caseId, setCaseId] = useState(null);
  const [milestoneStep, setMilestoneStep] = useState(null);
  const [loadingStep, setLoadingStep] = useState(false);
  const [stepError, setStepError] = useState(null);

  // Get additional documents from location state
  useEffect(() => {
    if (location.state) {
      const { additionalDocuments: docs, totalCost, caseId: id } = location.state;
      if (docs && totalCost) {
        setAdditionalDocuments(docs);
        setTotalAdditionalCost(totalCost);
        setCaseId(id);
        // Skip package selection for additional documents
        setCurrentStep(STEPS.PAYMENT_DETAILS);
      }
    }
  }, [location.state]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (currentStep !== STEPS.CONFIRMATION) { // Don't save after confirmation
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        step: currentStep,
        selectedPackage
      }));
    }
  }, [currentStep, selectedPackage]);

  // Clear saved state when component unmounts or after successful submission
  useEffect(() => {
    return () => {
      if (submitted) {
        localStorage.removeItem(STORAGE_KEY);
      }
    };
  }, [submitted]);

  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const packageId = params.get('package');
    if (packageId && !selectedPackage) {
      const pkg = packages.find(p => p.id === packageId);
      if (pkg) {
        setSelectedPackage(pkg);
        setCurrentStep(STEPS.PAYMENT_DETAILS);
      }
    }
  }, [location.search, selectedPackage]);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Restore state when tab becomes visible
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
          try {
            const { step, selectedPackage: savedPackage } = JSON.parse(savedState);
            if (savedPackage && packages.find(p => p.id === savedPackage.id)) {
              setCurrentStep(step);
              setSelectedPackage(savedPackage);
            }
          } catch (e) {
            console.error('Error restoring checkout state:', e);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // New useEffect to fetch milestone step details if stepId is present
  useEffect(() => {
    const fetchMilestoneStep = async () => {
      if (!stepId) return;

      setLoadingStep(true);
      setStepError(null);
      const { data, error } = await supabase
        .from('milestone_steps')
        .select('*, milestones(case_id)') // Fetch milestone and case_id for context
        .eq('id', stepId)
        .single();

      if (error) {
        console.error('Error fetching milestone step:', error);
        setStepError('Failed to load step details.');
        setMilestoneStep(null);
      } else if (data) {
         // Set caseId if not already present from URL, using fetched data
        if (!caseId && data.milestones?.case_id) {
           queryParams.set('case_id', data.milestones.case_id); // Update query params object
        }
        setMilestoneStep(data);
        // Set to payment details step instead of upload proof
        setCurrentStep(STEPS.PAYMENT_DETAILS);
      } else {
         setStepError('Milestone step not found.');
         setMilestoneStep(null);
      }
      setLoadingStep(false);
    };

    fetchMilestoneStep();
  }, [stepId, caseId, location.search]); // Depend on stepId, caseId and location.search

  // Determine the total amount based on whether it's a step payment or not
  const totalAmount = useMemo(() => {
    if (milestoneStep && milestoneStep.additional_charge > 0) {
      return milestoneStep.additional_charge;
    } else if (selectedPackage) {
      return selectedPackage.price;
    } else {
      // Calculate total for additional documents if no package is selected
      return additionalDocuments.reduce((sum, doc) => {
        const docPrice = DOCUMENT_STEPS
          .flatMap(step => step.documents)
          .find(d => d.key === Object.keys(doc.documents)[0])?.price || 0;
        return sum + docPrice; // Assuming each doc in additionalDocuments has one key
      }, 0);
    }
  }, [milestoneStep, selectedPackage, additionalDocuments]);

  // Determine which bank to show based on total amount
  const bank = useMemo(() => {
    const amount = typeof totalAmount === 'string' ? 
      parseInt(totalAmount.replace(/[^0-9]/g, '')) : 
      totalAmount;
    return amount <= 25000 ? BANKS.nayapay : BANKS.askari;
  }, [totalAmount]);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setCurrentStep(STEPS.PAYMENT_DETAILS);
  };

  const handleProceedToUpload = () => {
    setCurrentStep(STEPS.UPLOAD_PROOF);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage('');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in to submit a payment.');
      setLoading(false);
      return;
    }

    if (!screenshot) {
      setError('Please upload a payment screenshot.');
      setLoading(false);
      return;
    }

    try {
      // Upload screenshot to Supabase Storage
      const fileExt = screenshot.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, screenshot);

      if (uploadError) {
        throw new Error('Failed to upload screenshot: ' + uploadError.message);
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      // Create payment record
      const paymentData = {
        user_id: user.id,
        amount: totalAmount,
        screenshot_url: publicUrl,
        status: 'pending',
        bank_name: bank.bank,
        account_number: bank.number,
        account_title: bank.title,
      };

      // Add case_id if available
      if (caseId) {
        paymentData.case_id = caseId;
      }

      // Add milestone_step_id if available
      if (stepId) {
        paymentData.milestone_step_id = stepId;
      }

      // Add package_id if available
      if (selectedPackage) {
        paymentData.package_id = selectedPackage.id;
      }

      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();

      if (paymentError) {
        throw new Error('Failed to create payment record: ' + paymentError.message);
      }

      setSubmitted(true);
      // Redirect to thank you page with state to prevent duplicate conversions
      navigate('/thank-you', { state: { success: true } });
      return;

    } catch (err) {
      console.error('Payment submission error:', err);
      setError(err.message || 'Failed to submit payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  if (loadingStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-white text-lg">Loading step details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (stepError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center shadow-xl">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Step</h2>
          <p className="text-gray-300 mb-6">{stepError}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden py-12">
      {/* Animated Background Elements - adapted from UserDashboard */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles - adapted from UserDashboard */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <StepIndicator currentStep={currentStep} steps={STEPS} />
        
        <AnimatePresence mode="wait">
          {currentStep === STEPS.SELECT_PACKAGE && (
            <motion.div
              key="select-package"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">Select Your Package</h1>
                <p className="text-xl text-gray-300">Choose the licensing package that best fits your needs</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    onSelect={handlePackageSelect}
                    isSelected={selectedPackage?.id === pkg.id}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === STEPS.PAYMENT_DETAILS && (
            <motion.div
              key="payment-details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentDetails
                selectedPackage={selectedPackage}
                additionalDocuments={additionalDocuments}
                totalAdditionalCost={totalAdditionalCost}
                bank={bank}
                onBack={() => setCurrentStep(STEPS.SELECT_PACKAGE)}
                onProceed={handleProceedToUpload}
                milestoneStep={milestoneStep}
              />
            </motion.div>
          )}

          {currentStep === STEPS.UPLOAD_PROOF && (
            <motion.div
              key="upload-proof"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <UploadProof
                onSubmit={handleSubmit}
                onBack={() => setCurrentStep(STEPS.PAYMENT_DETAILS)}
                loading={loading}
                error={error}
                screenshot={screenshot}
                onScreenshotChange={setScreenshot}
              />
            </motion.div>
          )}

          {currentStep === STEPS.CONFIRMATION && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Confirmation
                onDashboard={handleDashboard}
                additionalDocuments={additionalDocuments}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 