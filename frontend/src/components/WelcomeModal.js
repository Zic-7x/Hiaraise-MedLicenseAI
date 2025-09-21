import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  FileText, 
  CreditCard, 
  Upload, 
  Coffee,
  MessageCircle,
  Globe,
  Smile,
  Heart
} from 'lucide-react';
import { trackModalInteraction, trackButtonClick } from '../utils/analytics';

const steps = [
  {
    id: 1,
    title: "Welcome to Hiaraise! 👋",
    subtitle: "Your medical licensing journey starts here",
    icon: Heart,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Smile className="w-10 h-10 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold text-white mb-3">
            We're here to make your medical licensing process smooth and stress-free!
          </h3>
          <p className="text-gray-300 leading-relaxed">
            Whether you're applying for Saudi Arabia, UAE, or Qatar, we've got your back every step of the way.
          </p>
        </div>
        
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="font-semibold text-white mb-3 text-center">What makes us special:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-gray-300">Expert guidance & support</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-gray-300">24/7 live chat assistance</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-gray-300">Live Case Tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-gray-300">Secure document handling</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "How to Submit Your Case",
    subtitle: "It's super simple! Just follow these steps:",
    icon: FileText,
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">1</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Click "Submit Case"</h4>
                <p className="text-gray-300 text-sm">Find it on your dashboard or in the navbar - it's easy to spot!</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">2</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Select Your Country</h4>
                <p className="text-gray-300 text-sm">Choose where you want to Work: Saudi Arabia, UAE, or Qatar</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">3</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Submit the Fee</h4>
                <p className="text-gray-300 text-sm">Secure payment through our trusted banking partners</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">4</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Upload Your Documents</h4>
                <p className="text-gray-300 text-sm">Just upload your documents and we'll handle the rest!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Take a Sip of Coffee ☕",
    subtitle: "Relax, it's our headache now!",
    icon: Coffee,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <img
            src="/images/relax.png"
            alt="Relaxing coffee guy"
            style={{ width: '180px', maxWidth: '100%', borderRadius: '1rem', display: 'block', margin: '0 auto 1rem' }}
          />
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Smile className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-4">
            That's it! 🎉
          </h3>
          <p className="text-gray-300 leading-relaxed text-lg">
            Once you've submitted everything, just sit back and relax. 
            We'll take care of all the paperwork, follow-ups, and updates.
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
          <h4 className="font-semibold text-green-300 mb-3 text-center">What happens next?</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">We review and verify your documents</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">Submit application to the authorities</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">Track progress and keep you updated</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">Celebrate when you get approved! 🎊</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

export default function WelcomeModal({ isOpen, onClose, hasPurchasedPackage }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen && !hasPurchasedPackage) {
      setShowModal(true);
      setCurrentStep(0);
      // Track modal open
      trackModalInteraction('welcome_modal', 'open');
    } else {
      setShowModal(false);
    }
  }, [isOpen, hasPurchasedPackage]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Track step navigation
      trackModalInteraction('welcome_modal', `next_to_step_${currentStep + 2}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Track step navigation
      trackModalInteraction('welcome_modal', `back_to_step_${currentStep}`);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    onClose();
    // Track modal close
    trackModalInteraction('welcome_modal', 'close');
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
    // Track direct step navigation
    trackModalInteraction('welcome_modal', `direct_to_step_${stepIndex + 1}`);
  };

  const handleGetStartedClick = () => {
    // Track get started button click
    trackButtonClick('get_started', 'welcome_modal');
    handleClose();
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-white/20 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                    {currentStepData.title}
                  </h2>
                  <p className="text-gray-400">{currentStepData.subtitle}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
                <span className="text-sm text-gray-400">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="mb-8">
              {currentStepData.content}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentStep === 0
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-4">
                {currentStep === steps.length - 1 ? (
                  <Link
                    to="/submit-case"
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                    onClick={handleGetStartedClick}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-center space-x-2 mt-8">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
