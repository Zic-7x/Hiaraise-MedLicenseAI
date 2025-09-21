import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiCheck, FiAlertCircle, FiFile, FiX, FiLock } from 'react-icons/fi';
import CustomSelect from '../components/CustomSelect';

// Add theme constants to match UserDashboard
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

const CASE_TYPES = [
  { 
    value: 'saudi_scfhs', 
    label: 'SCFHS License - Saudi Arabia', 
    description: 'Saudi Commission for Health Specialties license',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    cost: 'PKR 270,250',
    timeline: '12-16 weeks'
  },
  { 
    value: 'uae_dha', 
    label: 'DHA License - Dubai, UAE', 
    description: 'Dubai Health Authority license',
    country: 'UAE',
    flag: '🇦🇪',
    cost: 'PKR 185,250',
    timeline: '8-13 weeks'
  },
  { 
    value: 'uae_mohap', 
    label: 'MOHAP License - UAE', 
    description: 'UAE Ministry of Health and Prevention license',
    country: 'UAE',
    flag: '🇦🇪',
    cost: 'PKR 189,500',
    timeline: '10-12 weeks'
  },
  { 
    value: 'qatar_qchp', 
    label: 'QCHP License - Qatar', 
    description: 'Qatar Council for Healthcare Practitioners license',
    country: 'Qatar',
    flag: '🇶🇦',
    cost: 'PKR 197,500 - 199,500',
    timeline: '10-12 weeks'
  },
];

const PATH_OPTIONS = [
  { value: 'document_verification', label: 'Document Verification ', description: 'We will verify and authenticate all your documents for licensing purposes through dataflow.' },
  { value: 'exam_booking', label: 'Exam Booking ', description: 'We will handle the exam booking process and provide study materials.' },
  { value: 'health_authority_registration', label: 'Health Authority Registration ', description: 'We will complete the registration process with the health authority.' },
  { value: 'complete_license_process', label: 'Complete License Process', description: 'End-to-end support for the entire licensing process.' },
  { value: 'choose_best_for_me', label: 'Choose Best For Me!', description: 'Let our experts analyze your profile and recommend the optimal path.' },
];

export const DOCUMENT_STEPS = [
  {
    id: 'identity',
    title: 'Identity Documents',
    documents: [
      { key: 'cnicFront', label: 'CNIC Front', required: true },
      { key: 'cnicBack', label: 'CNIC Back', required: true },
      { key: 'passport', label: 'Passport', required: true },
    ]
  },
  {
    id: 'education',
    title: 'Education Documents',
    documents: [
      { key: 'universityDegree', label: 'University Degree', required: true },
      { key: 'universityTranscript', label: 'University Transcript', required: true },
      { key: 'additionalDegree', label: 'Additional Degree (Optional - PKR 35,000)', required: false, price: 35000 },
    ]
  },
  {
    id: 'professional',
    title: 'Professional Documents',
    documents: [
      { key: 'alliedHealthLicense', label: 'Allied Health License', required: true },
      { key: 'experienceLetter', label: 'Experience Letter', required: true },
      { key: 'additionalExperience', label: 'Additional Experience (Optional - PKR 35,000)', required: false, price: 35000 },
    ]
  },
  {
    id: 'path',
    title: 'Select Your Path',
    documents: []
  }
];

const packages = [
  {
    country: 'Saudi Arabia',
    price: 'PKR 30,000',
    description: 'Comprehensive support for Saudi medical licensing, including document review, application submission, and case tracking.',
  },
  {
    country: 'UAE',
    price: 'PKR 25,000',
    description: 'End-to-end assistance for UAE licensing, with expert guidance and secure document handling.',
  },
  {
    country: 'Qatar',
    price: 'PKR 23,000',
    description: 'Streamlined process for Qatar licensing, including all paperwork and case management.',
  },
];

const UploadBox = ({ onUpload, label, required, acceptedFile, onRemove }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsUploading(true);
    setError('');
    setUploadSuccess(false);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const url = await onUpload(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (err) {
      setError(err.message);
      setIsUploading(false);
      clearInterval(progressInterval);
      setUploadProgress(0);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    noClick: false, // Ensure click events work properly
    noKeyboard: false, // Ensure keyboard events work properly
    preventDropOnDocument: true, // Prevent page refresh on mobile
    useFsAccessApi: false // Disable File System Access API for better mobile compatibility
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <label className="block mb-2 font-semibold text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      
      {acceptedFile ? (
        <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FiFile className="text-green-400 text-xl" />
            <span className="text-green-200 font-medium truncate max-w-xs">
              {acceptedFile.name}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-2xl p-6 cursor-pointer
            transition-all duration-200 ease-in-out
            ${isDragActive 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-gray-600 hover:border-blue-400 hover:bg-white/5'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-center">
            <FiUpload className={`text-3xl mb-2 ${isDragActive ? 'text-blue-400' : 'text-gray-400'}`} />
            <p className="text-sm text-gray-300">
              {isDragActive 
                ? 'Drop your file here' 
                : 'Drag & drop your file here, or click to select'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports JPG, PNG, PDF (max 5MB)
            </p>
          </div>

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="w-full max-w-xs">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <p className="text-sm text-gray-300 mt-2 text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            </div>
          )}

          {!isUploading && uploadSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-green-500/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-lg font-semibold"
            >
              <FiCheck className="mr-2 text-2xl" /> Uploaded!
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center"
            >
              <FiAlertCircle className="mr-1" />
              {error}
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <motion.div
            className={`
              w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg
              ${currentStep === index 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' 
                : currentStep > index 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                  : 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-400'
              }
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentStep > index ? (
              <FiCheck className="text-sm sm:text-xl" />
            ) : (
              <span className="font-semibold text-sm sm:text-base">{index + 1}</span>
            )}
          </motion.div>
          {index < totalSteps - 1 && (
            <div className="w-12 sm:w-24 h-1 mx-1 sm:mx-2 relative">
              <div className="absolute inset-0 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-700"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: currentStep > index ? '100%' : '0%',
                    backgroundColor: currentStep > index ? '#10b981' : '#2563eb'
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

export default function CaseSubmission() {
  const navigate = useNavigate();
  const [caseType, setCaseType] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPath, setSelectedPath] = useState([]);
  const [documents, setDocuments] = useState({
    cnicFront: null,
    cnicBack: null,
    passport: null,
    universityDegree: null,
    universityTranscript: null,
    additionalDegree: null,
    alliedHealthLicense: null,
    experienceLetter: null,
    additionalExperience: null
  });
  const [documentUrls, setDocumentUrls] = useState({});
  const [paymentProof, setPaymentProof] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [accessCheckLoading, setAccessCheckLoading] = useState(true);
  const [hasPackageAccess, setHasPackageAccess] = useState(false);
  const [checking, setChecking] = useState(true);
  const [existingCase, setExistingCase] = useState(null);
  const [additionalDocuments, setAdditionalDocuments] = useState([]);
  const [totalAdditionalCost, setTotalAdditionalCost] = useState(0);

  useEffect(() => {
    const checkUserStatus = async () => {
      setLoading(true);
      setChecking(true);
      setAccessCheckLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      // Explicitly check if user is null or undefined
      if (!user) {
        setMessage('Not logged in or session expired.');
        setCanSubmit(false);
        setLoading(false);
        setChecking(false);
        setAccessCheckLoading(false);
        return;
      }

      // Check if user has package access (not just vouchers)
      const { data: packagePayments, error: packageError } = await supabase
        .from('payments')
        .select('id, package_id, voucher_slot_id, status')
        .eq('user_id', user.id)
        .eq('status', 'approved');

      if (packageError) {
        console.error('Error checking package access:', packageError);
        setAccessCheckLoading(false);
        return;
      }

      // Check if user has any package payments (not just voucher payments)
      const hasPackagePayments = packagePayments?.some(payment => 
        payment.package_id && !payment.voucher_slot_id
      );

      if (!hasPackagePayments) {
        // User only has voucher purchases, redirect to voucher system
        setMessage('Case submission is only available for users who have purchased our licensing packages. You can access your vouchers in the voucher system.');
        setHasPackageAccess(false);
        setAccessCheckLoading(false);
        setLoading(false);
        setChecking(false);
        return;
      }

      setHasPackageAccess(true);

      // Check for existing case
      const { data: cases, error: caseError } = await supabase
        .from('cases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!caseError && cases && cases.length > 0) {
        setExistingCase(cases[0]);
      }

      // Check for approved payment
      const { data: payments, error } = await supabase
        .from('payments')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'approved');
      
      setCanSubmit(!error && payments && payments.length > 0);
      setLoading(false);
      setChecking(false);
      setAccessCheckLoading(false);
    };
    checkUserStatus();
  }, []);

  const handleDocumentUpload = async (file, key) => {
    if (!file) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Not logged in or session expired.');
    }

    const filePath = `${user.id}/${Date.now()}_${key}_${file.name}`;

    const { data, error } = await supabase.storage
      .from('case-documents')
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error(`Supabase upload error for ${key}:`, error);
      throw new Error(`Failed to upload ${key} document.`);
    }

    const { data: publicUrlData } = supabase.storage.from('case-documents').getPublicUrl(data.path);
    
    setDocuments(prev => {
      const newState = { ...prev, [key]: file };
      return newState;
    });

    // Store the URL for later use
    setDocumentUrls(prev => ({
      ...prev,
      [key]: publicUrlData.publicUrl
    }));

    return publicUrlData.publicUrl;
  };

  const handleStepSubmit = async () => {
    const currentStepData = DOCUMENT_STEPS[currentStep];
    const stepDocuments = {};
    let hasRequiredDocs = true;

    // Handle path step
    if (currentStepData.id === 'path') {
      if (selectedPath.length === 0) {
        setMessage('Please select at least one licensing service path.');
        return;
      }
      // Move to next step or submit case
      if (currentStep < DOCUMENT_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
        setMessage('');
      } else {
        await handleFinalSubmit(stepDocuments);
      }
      return;
    }

    // Check required documents for document steps
    for (const doc of currentStepData.documents) {
      if (doc.required && !documents[doc.key]) {
        hasRequiredDocs = false;
        break;
      }
    }

    if (!hasRequiredDocs) {
      setMessage(`Please upload all required documents for ${currentStepData.title}`);
      return;
    }

    // Documents are already uploaded when selected, no need to upload again
    // Just collect the URLs for this step
    for (const doc of currentStepData.documents) {
      if (documents[doc.key] && documentUrls[doc.key]) {
        stepDocuments[doc.key] = documentUrls[doc.key];
      }
    }

    // If this is an additional document submission
    if (existingCase) {
      const additionalDoc = {
        step: currentStepData.id,
        documents: stepDocuments,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      setAdditionalDocuments([...additionalDocuments, additionalDoc]);
      setTotalAdditionalCost(totalAdditionalCost + 35000);
      setMessage('Additional documents added. Please proceed to checkout.');
      navigate('/checkout', { 
        state: { 
          additionalDocuments: [...additionalDocuments, additionalDoc], 
          totalCost: totalAdditionalCost + 35000,
          caseId: existingCase.id
        } 
      });
      return;
    }

    // Move to next step or submit case
    if (currentStep < DOCUMENT_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setMessage('');
    } else {
      await handleFinalSubmit(stepDocuments);
    }
  };

  const handleFinalSubmit = async (finalDocuments) => {
    setLoading(true);
    setMessage('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage('Not logged in.');
      setLoading(false);
      return;
    }

    // Find most recent approved payment
    const { data: payments, error: payError } = await supabase
      .from('payments')
      .select('id, created_at')
      .eq('user_id', user.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(1);

    if (payError || !payments || payments.length === 0) {
      setMessage('No approved payment found.');
      setLoading(false);
      return;
    }

    const payment_id = payments[0].id;

    // Upload payment proof
    let payment_proof_url = '';
    if (paymentProof) {
      const { data, error } = await supabase.storage
        .from('payment-proofs')
        .upload(`${user.id}/${Date.now()}_payment_proof_${paymentProof.name}`, paymentProof, { upsert: true });
      if (error) {
        setMessage('Failed to upload payment proof.');
        setLoading(false);
        return;
      }
      payment_proof_url = supabase.storage.from('payment-proofs').getPublicUrl(data.path).data.publicUrl;
    }

    // Use the stored document URLs instead of trying to generate new ones
    const finalDocumentUrls = { ...documentUrls };

    // Verify all required documents have URLs
    for (const step of DOCUMENT_STEPS) {
      for (const doc of step.documents) {
        if (doc.required && documents[doc.key] && !finalDocumentUrls[doc.key]) {
          console.error(`Missing URL for required document: ${doc.key}`);
          setMessage(`Could not finalize case submission: missing URL for ${doc.label}.`);
          setLoading(false);
          return;
        }
      }
    }

    const { error: insertError } = await supabase
      .from('cases')
      .insert({
        user_id: user.id,
        case_type: caseType,
        path: selectedPath,
        documents: finalDocumentUrls,
        payment_proof_url,
        payment_id,
        status: 'pending',
      });

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      setMessage('Failed to submit case.');
    } else {
      setMessage('Case submitted successfully! You can track its status in your dashboard.');
      navigate('/my-cases');
    }
    setLoading(false);
  };

  if (checking || accessCheckLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center relative z-10"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Checking status...</p>
        </motion.div>
      </div>
    );
  }

  // Show access denied message for voucher-only users
  if (!hasPackageAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl text-center max-w-md mx-4 relative z-10"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiLock className="text-white text-2xl" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Access Restricted</h2>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            {message}
          </p>
          
          <div className="space-y-3">
            <Link
              to="/vouchers"
              className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-center"
            >
              Get Prometric Exam Vouchers
            </Link>
            
            <Link
              to="/pricing"
              className="block w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-center"
            >
              View Services Fee
            </Link>
            
            <Link
              to="/licenses"
              className="block w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-center"
            >
              Learn about Licenses
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden py-12">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-4 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2">
              {existingCase ? 'Add Additional Documents' : 'Submit New Licensing Case'}
            </h2>
            <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base">
              {existingCase 
                ? 'Upload additional documents to support your case'
                : 'Complete the following steps to submit your licensing case'}
            </p>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-blue-200 flex items-center"
              >
                <FiAlertCircle className="mr-2 text-xl" />
                {message}
              </motion.div>
            )}

            <StepIndicator currentStep={currentStep} totalSteps={DOCUMENT_STEPS.length} />

            <div className="relative">
              {!canSubmit && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 rounded-3xl">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-8 bg-white/10 border border-white/20 rounded-3xl shadow-2xl"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiLock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-xl mb-2">Package Required</h3>
                    <p className="text-gray-300 text-sm mb-4 max-w-md">
                      Please select a package from our services page before submitting a case.
                    </p>
                    <Link 
                      to="/pricing" 
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl"
                    >
                      Select Package
                    </Link>
                  </motion.div>
                </div>
              )}

              <div className={canSubmit ? '' : 'filter blur-sm pointer-events-none select-none'}>
                {!existingCase && currentStep === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Applying For 
                    </label>
                    <CustomSelect
                      options={CASE_TYPES}
                      value={caseType}
                      onChange={setCaseType}
                      placeholder="-- Select License & Country --"
                      className="w-full"
                    />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">
                      {DOCUMENT_STEPS[currentStep].title}
                    </h3>
                    <span className="text-sm text-gray-400">
                      Step {currentStep + 1} of {DOCUMENT_STEPS.length}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {DOCUMENT_STEPS[currentStep].id === 'path' ? (
                      <div className="space-y-4">
                        <p className="text-gray-300 text-sm mb-4">
                          Choose the licensing path that best suits your needs:
                        </p>
                        {PATH_OPTIONS.map((option) => (
                          <motion.div
                            key={option.value}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300
                              ${selectedPath.includes(option.value)
                                ? 'border-blue-500 bg-blue-500/20 backdrop-blur-md'
                                : 'border-gray-600 hover:border-blue-400 hover:bg-white/5'
                              }
                            `}
                            onClick={() => {
                              const singleSelectOptions = ['complete_license_process', 'choose_best_for_me'];
                              const isSingleSelect = singleSelectOptions.includes(option.value);

                              if (isSingleSelect) {
                                setSelectedPath([option.value]);
                              } else {
                                setSelectedPath(prev =>
                                  prev.includes(option.value)
                                    ? prev.filter(p => p !== option.value)
                                    : [...prev.filter(p => !singleSelectOptions.includes(p)), option.value]
                                );
                              }
                            }}
                          >
                            <div className={`
                              w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1
                              ${selectedPath.includes(option.value)
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-400'
                              }
                            `}>
                              {selectedPath.includes(option.value) && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold mb-2">{option.label}</h4>
                              <p className="text-gray-300 text-sm">{option.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      DOCUMENT_STEPS[currentStep].documents.map(doc => {
                        return (
                        <UploadBox
                          key={doc.key}
                          label={doc.label}
                          required={doc.required}
                          onUpload={(file) => handleDocumentUpload(file, doc.key)}
                          acceptedFile={documents[doc.key]}
                          onRemove={() => setDocuments(prev => ({ ...prev, [doc.key]: null }))}
                        />
                      )}
                    )
                    )}
                  </div>
                </motion.div>

                {currentStep === DOCUMENT_STEPS.length - 1 && !existingCase && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <UploadBox
                      label="Upload Payment Screenshot"
                      required={true}
                      onUpload={(file) => {
                        setPaymentProof(file);
                        return Promise.resolve();
                      }}
                      acceptedFile={paymentProof}
                      onRemove={() => setPaymentProof(null)}
                    />
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-white/20">
                  {currentStep > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="w-full sm:w-auto px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-gray-300 hover:bg-white/20 transition-all duration-300 shadow-xl"
                    >
                      Previous Step
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStepSubmit}
                    disabled={loading}
                    className={`
                      w-full sm:w-auto px-6 py-3 rounded-2xl text-white font-medium shadow-xl transition-all duration-300
                      ${loading 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
                      }
                    `}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      currentStep === DOCUMENT_STEPS.length - 1 ? 'Submit Case' : 'Next Step'
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 