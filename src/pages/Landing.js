import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiShield, FiClock, FiCheckCircle, FiUser, FiFileText, FiCreditCard, FiArrowRight, FiPhone, FiCalendar, FiStar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { Brain, Sparkles, Globe, Award } from 'lucide-react';
import LandingPromotionModal from '../components/LandingPromotionModal';
import BookingForm from '../components/BookingForm';
import { useEffect, useState, useCallback, memo } from 'react';
import { trackMetaPixelViewContent, trackMetaPixelButtonClick } from '../utils/metaPixel';
import { trackEvent, trackButtonClick, trackPageView } from '../utils/analytics';
import { useAnalytics } from '../utils/useAnalytics';
import { Helmet } from 'react-helmet';
import { supabase } from '../supabaseClient';
import { useAuthModal } from '../contexts/AuthModalContext';

// Testimonial data (keeping for potential future use, not currently displayed)
const testimonials = [
  {
    name: 'Dr. Ayesha Khan',
    text: 'The portal made my Gulf licensing process so easy and stress-free! Highly recommended for all medical professionals.',
  },
  {
    name: 'Dr. Omar Al-Farsi',
    text: 'Fast, secure, and professional. I got my Saudi license with no hassle.',
  },
];

// Process steps data (keeping for potential future use, not currently displayed)
const processSteps = [
  'Register & create your profile',
  'Upload credentials & documents',
  'Select your target country & submit application',
  'Make payment via secure bank transfer',
  'Track your case status online',
  'Receive your license & confirmation',
];

const THEME = {
  primary: 'bg-gradient-to-r from-blue-600 to-indigo-700',
  secondary: 'bg-gradient-to-r from-purple-600 to-pink-600',
  card: 'bg-white/10 backdrop-blur-xl border border-white/20',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20',
  darkSection: 'bg-white/10 backdrop-blur-xl border border-white/20',
};

// Memoized FeatureCard component for better performance
const FeatureCard = memo(({ icon: Icon, title, description, onView }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-7 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group relative overflow-hidden"
    onMouseEnter={() => onView && onView(title)}
    role="article"
    aria-labelledby={`feature-${title.toLowerCase().replace(/\s+/g, '-')}`}
  >
    {/* Subtle background effect per card */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
    
    <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
      <Icon className="w-7 h-7" aria-hidden="true" />
    </div>
    <h3 id={`feature-${title.toLowerCase().replace(/\s+/g, '-')}`} className="text-xl font-display font-semibold text-white mb-3">{title}</h3>
    <p className="text-gray-200 leading-relaxed">{description}</p>
  </motion.div>
));

// Memoized StepCard component for better performance
const StepCard = memo(({ number, title, description, icon: Icon, onView }) => (
  <motion.div
    initial={{ opacity: 0, x: -50, scale: 0.9 }}
    whileInView={{ opacity: 1, x: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className="flex items-start space-x-5 bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-7 relative overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
    onMouseEnter={() => onView && onView(number)}
    role="article"
    aria-labelledby={`step-${number}`}
  >
     {/* Subtle background effect per card */}
     <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-20" />

    <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
      {number}
    </div>
    <div className="flex-1">
      <h3 id={`step-${number}`} className="text-lg font-display font-semibold text-white mb-2 flex items-center">
        <Icon className="w-5 h-5 mr-2 text-blue-400" aria-hidden="true" />
        {title}
      </h3>
      <p className="text-gray-200 leading-relaxed">{description}</p>
    </div>
  </motion.div>
));

// Floating Consultation Widget Component
const ConsultationWidget = ({ onOpenConsultation, onView }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 1 }}
    className="fixed bottom-24 right-6 z-40"
    onMouseEnter={() => onView && onView('consultation_widget')}
  >
    <a
      href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I would like to chat on WhatsApp about medical licensing.')}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackButtonClick('whatsapp_contact_landing_widget', 'landing_page')}
      className="group relative w-14 h-14 rounded-full flex items-center justify-center text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
      aria-label="Chat with us on WhatsApp"
    >
      <FaWhatsapp className="w-7 h-7" aria-hidden="true" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2 text-sm text-white whitespace-nowrap shadow-lg animate-pulse">
          Contact us on WhatsApp
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-white/10 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      </div>
    </a>
  </motion.div>
);

// Consultation Modal Component
const ConsultationModal = ({ isOpen, onClose, onScheduleCall }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-red-500/80 hover:bg-red-600/90 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow z-10 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          aria-label="Close consultation modal"
        >
          &times;
        </button>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-600 mb-6">
            <FiPhone className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Expert Guidance on Your Medical Licensing Journey
          </h2>
          
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 mb-6">
            <p className="text-gray-200 leading-relaxed mb-4">
              Schedule a <strong>free 15-minute consultation call</strong> with our licensing specialists. Get personalized advice on DHA, HAAD, MOH, SCFHS, and other Gulf medical licensing requirements.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div className="flex items-center justify-center space-x-2">
                <FiCalendar className="w-4 h-4 text-green-400" aria-hidden="true" />
                <span>15-Minute Call</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <FiStar className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                <span>Expert Advice</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Globe className="w-4 h-4 text-blue-400" aria-hidden="true" />
                <span>Global Support</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <a
              href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I would like to chat on WhatsApp about medical licensing.')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackButtonClick('whatsapp_contact_landing_modal', 'landing_page')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 text-sm sm:text-base"
              aria-label="Chat with us on WhatsApp"
            >
              <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
            <span className="text-white/70 text-sm">or</span>
            <button
              onClick={onScheduleCall}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50 text-sm sm:text-base"
              aria-label="Schedule consultation call"
            >
              <FiPhone className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              <span>Schedule Call</span>
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 rounded-full font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 text-sm sm:text-base"
              aria-label="Close consultation modal"
            >
              <span>Maybe Later</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  
  // Enable automatic page tracking
  useAnalytics();
  
  // State for modals
  const [showLandingPromotion, setShowLandingPromotion] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // State for user authentication
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    // Listen for auth changes with more detailed logging
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setUser(session?.user || null);
      
      // If user just signed in and we're on the landing page, redirect to dashboard
      if (event === 'SIGNED_IN' && session?.user && window.location.pathname === '/') {
        console.log('User signed in on landing page, redirecting to dashboard');
        navigate('/dashboard/user');
      }
    });

    // Track landing page view
    trackPageView('/');
    trackEvent('page_viewed', 'engagement', 'landing_page');
    
    // Meta Pixel tracking
    trackMetaPixelViewContent();
    
    // Show landing promotion modal after 3 seconds
    const timer = setTimeout(() => {
      setShowLandingPromotion(true);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  // Memoized event handlers for better performance
  const handleGetStartedClick = useCallback(() => {
    trackButtonClick('get_started', 'landing_page');
    trackMetaPixelButtonClick('Get Started');
  }, []);

  const handleLearnMoreClick = useCallback(() => {
    trackButtonClick('learn_more', 'landing_page');
    trackMetaPixelButtonClick('Learn More');
  }, []);

  const handleCheckEligibilityClick = useCallback(() => {
    trackButtonClick('check_eligibility', 'landing_page');
    trackMetaPixelButtonClick('Check Eligibility');
  }, []);

  const handleOpenConsultation = useCallback(() => {
    trackButtonClick('open_consultation', 'landing_page');
    trackMetaPixelButtonClick('Open Consultation');
    setShowConsultationModal(true);
  }, []);

  const handleScheduleCall = useCallback(() => {
    trackButtonClick('schedule_call', 'landing_page');
    trackMetaPixelButtonClick('Schedule Call');
    setShowConsultationModal(false);
    setShowBookingModal(true);
  }, []);

  const handleFeatureCardView = useCallback((featureName) => {
    trackEvent('feature_viewed', 'engagement', featureName);
  }, []);

  const handleStepCardView = useCallback((stepNumber) => {
    trackEvent('process_step_viewed', 'engagement', `step_${stepNumber}`);
  }, []);

  const handleSectionView = useCallback((sectionName) => {
    trackEvent('section_viewed', 'engagement', sectionName);
  }, []);

  const handleCloseLandingPromotion = useCallback(() => {
    setShowLandingPromotion(false);
  }, []);

  const handleCloseConsultationModal = useCallback(() => {
    setShowConsultationModal(false);
  }, []);

  const handleCloseBookingModal = useCallback(() => {
    setShowBookingModal(false);
  }, []);

  const handleGetLicenseClick = useCallback((country) => {
    trackButtonClick('get_license', 'landing_page', country);
    trackMetaPixelButtonClick('Get License', country);
    
    if (user) {
      // User is logged in, redirect to submit page
      trackEvent('get_license_logged_in', 'business', country);
      navigate('/submit-case');
    } else {
      // User is not logged in, open auth modal
      trackEvent('get_license_not_logged_in', 'business', country);
      openAuthModal('login', () => {
        navigate('/submit-case');
      });
    }
  }, [user, navigate]);

  const handleSeeMoreClick = useCallback((country) => {
    trackButtonClick('see_more', 'landing_page', country);
    trackMetaPixelButtonClick('See More', country);
    trackEvent('see_more_clicked', 'engagement', country);
    
    // Route to specific license page based on country
    switch(country) {
      case 'UAE':
        navigate('/licenses/dha-license-dubai');
        break;
      case 'Qatar':
        navigate('/licenses/qchp-license-qatar');
        break;
      case 'Saudi Arabia':
        navigate('/licenses/scfhs-license-saudi');
        break;
      default:
        navigate('/pricing');
    }
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Hiaraise MedLicense AI Portal | DHA, HAAD, MOH, SCFHS Medical Licensing Platform</title>
        <meta name="description" content="Professional medical licensing platform for Gulf & Middle East authorities. Streamline DHA, HAAD, MOH, SCFHS, MOPH, QCHP applications with AI-powered processing, secure document management, and expert guidance. Process 10,000+ medical professionals annually." />
        <meta name="keywords" content="DHA licensing Dubai, HAAD medical license Abu Dhabi, MOH UAE licensing, SCFHS Saudi Arabia, MOPH Qatar, QCHP healthcare practitioners, Gulf medical licensing, Middle East medical license, medical license application, healthcare professional license, medical credentialing, international medical licensing, SLE exam, SMLE exam, medical licensing requirements, Dubai Health Authority, Department of Health Abu Dhabi, Saudi Commission for Health Specialties" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="subject" content="Medical Licensing Services for Gulf Countries" />
        <meta name="classification" content="Healthcare Services" />
        <meta name="category" content="Medical Licensing" />
        <meta name="coverage" content="Gulf Countries, Middle East" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        <meta name="target" content="medical professionals, healthcare workers, doctors, nurses" />
        <meta name="audience" content="medical professionals seeking Gulf licensing" />
        <meta name="language" content="en" />
        <meta name="geo.region" content="AE, SA, QA, KW, BH, OM" />
        <meta name="geo.placename" content="Dubai, Abu Dhabi, Riyadh, Doha, Kuwait City, Manama, Muscat" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Hiaraise MedLicense AI Portal | DHA, HAAD, MOH, SCFHS Medical Licensing" />
        <meta property="og:description" content="Professional medical licensing platform for Gulf & Middle East authorities. AI-powered processing for DHA, HAAD, MOH, SCFHS, MOPH, QCHP applications." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hiaraise.com/" />
        <meta property="og:image" content="https://hiaraise.com/logo.png" />
        <meta property="og:site_name" content="Hiaraise MedLicense AI Portal" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hiaraise MedLicense AI Portal | DHA, HAAD, MOH, SCFHS Medical Licensing" />
        <meta name="twitter:description" content="Professional medical licensing platform for Gulf & Middle East authorities with AI-powered processing." />
        <meta name="twitter:image" content="https://hiaraise.com/logo.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hiaraise" />
        <link rel="canonical" href="https://hiaraise.com/" />
        
        {/* Enhanced Structured Data for AI Understanding */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Hiaraise MedLicense AI Portal",
            "url": "https://hiaraise.com",
            "description": "Streamline your medical licensing for DHA, HAAD, MOH, SCFHS, and more Gulf authorities",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://hiaraise.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": "Medical Licensing Services",
              "description": "Complete medical licensing solutions for Gulf countries",
              "numberOfItems": 5,
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "item": {
                    "@type": "WebPage",
                    "name": "Medical Licenses",
                    "description": "DHA License (PKR 185,250), SCFHS License (PKR 270,250), QCHP License (PKR 197,500), MOHAP License (PKR 189,500)",
                    "url": "https://hiaraise.com/licenses"
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "item": {
                    "@type": "WebPage",
                    "name": "Prometric Vouchers",
                    "description": "Buy Prometric vouchers at lowest price! Save up to 50% on exam fees with flexible scheduling",
                    "url": "https://hiaraise.com/prometric-vouchers"
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "item": {
                    "@type": "WebPage",
                    "name": "Eligibility Checker",
                    "description": "Check your eligibility for medical licenses in Saudi Arabia, Qatar, or UAE. Instant results based on your qualifications",
                    "url": "https://hiaraise.com/eligibility-check"
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "item": {
                    "@type": "WebPage",
                    "name": "Pricing & Services",
                    "description": "Transparent pricing for medical licensing services. Fast processing with expert guidance for Pakistani healthcare professionals",
                    "url": "https://hiaraise.com/pricing"
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 5,
                  "item": {
                    "@type": "WebPage",
                    "name": "Contact Support",
                    "description": "Get expert medical licensing support, free consultation calls, and professional guidance for DHA, SCFHS, QCHP licensing",
                    "url": "https://hiaraise.com/contact"
                  }
                }
              ]
            }
          }
        `}</script>
        
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How much does a DHA license cost?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "DHA License costs PKR 185,250 with complete processing from Pakistan. This includes all fees, document verification, and expert guidance."
                }
              },
              {
                "@type": "Question",
                "name": "How long does medical licensing take?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "DHA License: 8-13 weeks, SCFHS License: 12-16 weeks, QCHP License: 10-12 weeks, MOHAP License: 10-12 weeks. All processing can be done from Pakistan."
                }
              },
              {
                "@type": "Question",
                "name": "Can I get Prometric vouchers at discount?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! We offer Prometric vouchers with up to 50% discount. Buy vouchers at lowest price with flexible scheduling and instant delivery."
                }
              },
              {
                "@type": "Question",
                "name": "What is your success rate?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We have a 98% success rate with over 1,200+ licenses processed. Our AI-powered platform and expert team ensure high success rates."
                }
              }
            ]
          }
        `}</script>
        
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Hiaraise MedLicense AI",
            "url": "https://hiaraise.com",
            "logo": "https://hiaraise.com/logo.png",
            "description": "Medical licensing platform for Gulf and Middle East authorities",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "support@hiaraise.com",
              "telephone": "+92-309-727-3740",
              "availableLanguage": ["English", "Arabic", "Urdu"]
            },
            "sameAs": [
              "https://wa.me/923097273740"
            ]
          }
        `}</script>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Medical Licensing Services",
            "provider": {
              "@type": "Organization",
              "name": "Hiaraise MedLicense AI"
            },
            "description": "Comprehensive medical licensing services for DHA, HAAD, MOH, SCFHS, MOPH, QCHP, and other Gulf authorities",
            "areaServed": [
              {
                "@type": "Country",
                "name": "United Arab Emirates"
              },
              {
                "@type": "Country", 
                "name": "Qatar"
              },
              {
                "@type": "Country",
                "name": "Saudi Arabia"
              },
              {
                "@type": "Country",
                "name": "Kuwait"
              },
              {
                "@type": "Country",
                "name": "Bahrain"
              },
              {
                "@type": "Country",
                "name": "Oman"
              }
            ],
            "serviceType": "Medical Licensing",
            "offers": {
              "@type": "Offer",
              "description": "AI-powered medical licensing platform with expert support",
              "price": "Contact for pricing",
              "priceCurrency": "USD"
            }
          }
        `}</script>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Get Medical License in Gulf Countries",
            "description": "Complete guide to obtaining medical license in Gulf and Middle East countries",
            "totalTime": "P30D",
            "supply": [
              {
                "@type": "HowToSupply",
                "name": "Medical degree certificate"
              },
              {
                "@type": "HowToSupply", 
                "name": "Professional experience certificates"
              },
              {
                "@type": "HowToSupply",
                "name": "Passport and identification documents"
              }
            ],
            "tool": [
              {
                "@type": "HowToTool",
                "name": "Hiaraise MedLicense AI Portal"
              }
            ],
            "step": [
              {
                "@type": "HowToStep",
                "name": "Register and Create Profile",
                "text": "Begin by creating your secure account and completing your professional profile with essential information and qualifications.",
                "url": "https://hiaraise.com/register"
              },
              {
                "@type": "HowToStep",
                "name": "Document Submission",
                "text": "Securely upload all necessary credentials and documents through our intuitive platform. Our AI assists in verification.",
                "url": "https://hiaraise.com/start-license"
              },
              {
                "@type": "HowToStep",
                "name": "Application & Tracking",
                "text": "Submit your complete application to the chosen country. Track its real-time status and receive AI-powered insights on progress.",
                "url": "https://hiaraise.com/eligibility-check"
              },
              {
                "@type": "HowToStep",
                "name": "License Issuance",
                "text": "Upon successful verification and approval, receive your medical license promptly, ready to kickstart your global career."
              }
            ]
          }
        `}</script>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is DHA medical licensing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "DHA (Dubai Health Authority) medical licensing is the process of obtaining authorization to practice medicine in Dubai, UAE. It requires verification of medical qualifications, experience, and passing required examinations."
                }
              },
              {
                "@type": "Question",
                "name": "What is HAAD medical licensing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "HAAD (Health Authority Abu Dhabi) medical licensing, now known as DOH (Department of Health), is the regulatory process for healthcare professionals to practice in Abu Dhabi, UAE. It includes credential verification and competency assessment."
                }
              },
              {
                "@type": "Question",
                "name": "What is MOH UAE medical licensing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "MOHAP UAE (Ministry of Health and Prevention UAE) medical licensing is the national-level authorization required for healthcare professionals to practice in the United Arab Emirates outside of Dubai and Abu Dhabi."
                }
              },
              {
                "@type": "Question",
                "name": "What is SCFHS medical licensing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SCFHS (Saudi Commission for Health Specialties) medical licensing is the regulatory process for healthcare professionals to practice in Saudi Arabia. It requires verification of qualifications and passing the Saudi Medical Licensing Examination (SMLE)."
                }
              },
              {
                "@type": "Question",
                "name": "What is QCHP medical licensing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "QCHP (Qatar Council for Healthcare Practitioners) medical licensing is the regulatory process for healthcare professionals to practice in Qatar. It includes credential verification and competency assessment through examinations."
                }
              },
              {
                "@type": "Question",
                "name": "How long does medical licensing take in Gulf countries?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Medical licensing in Gulf countries typically takes 30-90 days depending on the authority and completeness of documentation. DHA licensing usually takes 30-45 days, while SCFHS can take 60-90 days."
                }
              },
              {
                "@type": "Question",
                "name": "What documents are required for Gulf medical licensing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Required documents include medical degree certificate, internship certificate, experience certificates, passport copy, passport-size photographs, and any additional qualifications or specializations."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need to take exams for Gulf medical licensing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, most Gulf countries require passing licensing examinations. SCFHS requires SMLE (Saudi Medical Licensing Examination), while UAE authorities may require SLE (Specialty Licensing Examination) depending on your specialty."
                }
              }
            ]
          }
        `}</script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background elements - reduced for mobile performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>

        {/* Floating Particles - reduced count for performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
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

        {/* Hero Section with Key Information */}
        <main className="flex-1 flex flex-col items-center justify-center z-10 relative py-20">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Hero Content */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8"
              >
                <img 
                  src="/logo.png" 
                  alt="Hiaraise MedLicense AI Portal" 
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain"
                  aria-hidden="true"
                />
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent text-center sm:text-left leading-tight">
                  Hiaraise MedLicense AI Portal
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-4xl mx-auto mb-8 px-4"
              >
                The next generation platform for medical licensing, powered by AI. Streamline your application, track your progress, and get instant insights for Gulf and Middle East medical authorities including DHA, HAAD, MOH, SCFHS, MOPH, and QCHP.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
              >
                <button 
                  onClick={() => {
                    handleGetStartedClick();
                    if (user) {
                      // User is logged in, redirect to dashboard
                      navigate('/dashboard/user');
                    } else {
                      // User is not logged in, open auth modal
                      openAuthModal('login', () => {
                        navigate('/dashboard/user');
                      });
                    }
                  }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-sm sm:text-base" 
                  aria-label="Get started with Hiaraise MedLicense"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  <span>Get Started</span>
                </button>
                <Link 
                  to="/start-license" 
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 focus:outline-none focus:ring-4 focus:ring-purple-500/50 text-sm sm:text-base" 
                  onClick={handleLearnMoreClick}
                  aria-label="Learn more about our licensing process"
                >
                  <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  <span>Learn More</span>
                </Link>
                <Link 
                  to="/eligibility-check" 
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 focus:outline-none focus:ring-4 focus:ring-green-500/50 text-sm sm:text-base"
                  onClick={handleCheckEligibilityClick}
                  aria-label="Check your eligibility for medical licensing"
                >
                  <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  <span>Check Eligibility</span>
                </Link>
              </motion.div>
            </div>

            {/* Supported Authorities - Prominently Featured */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-20"
              onMouseEnter={() => handleSectionView('supported_authorities')}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Supported Medical Licensing Authorities
                  </span>
                </h2>
                <div className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">
                  <p className="text-gray-200 leading-relaxed text-lg">
                    We support comprehensive medical licensing for major Gulf and Middle East authorities, ensuring your credentials are processed efficiently and professionally. Our platform handles over 10,000+ medical professionals annually across 6 countries.
                  </p>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-400">10,000+</div>
                      <div className="text-sm text-gray-300">Medical Professionals</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400">6</div>
                      <div className="text-sm text-gray-300">Gulf Countries</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-400">50%</div>
                      <div className="text-sm text-gray-300">Faster Processing</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold text-yellow-400">24/7</div>
                      <div className="text-sm text-gray-300">AI Support</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-7 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-20 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
                  <h3 className="font-semibold text-xl mb-4 flex items-center text-white">
                    <Award className="w-6 h-6 mr-3 text-blue-400" aria-hidden="true" />
                    UAE Authorities
                  </h3>
                  <ul className="list-disc list-inside text-gray-200 space-y-2">
                    <li><span className="font-bold text-blue-300">DHA</span> – Dubai Health Authority (30-45 days processing)</li>
                    <li><span className="font-bold text-blue-300">HAAD/DOH</span> – Department of Health Abu Dhabi (45-60 days processing)</li>
                    <li><span className="font-bold text-blue-300">MOHAP</span> – Ministry of Health and Prevention UAE (60-90 days processing)</li>
                  </ul>
                  <div className="mt-4 text-sm text-gray-300">
                    <strong>Requirements:</strong> Medical degree, SLE exam, 2+ years experience
                  </div>
                  <div className="mt-6 flex flex-col gap-3 relative z-10">
                    <button
                      onClick={() => handleGetLicenseClick('UAE')}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                    >
                      Get License
                    </button>
                    <button
                      onClick={() => handleSeeMoreClick('UAE')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                    >
                      See More
                    </button>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-7 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-20 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
                  <h3 className="font-semibold text-xl mb-4 flex items-center text-white">
                    <Award className="w-6 h-6 mr-3 text-blue-400" aria-hidden="true" />
                    Qatar Authorities
                  </h3>
                  <ul className="list-disc list-inside text-gray-200 space-y-2">
                    <li><span className="font-bold text-blue-300">MOPH</span> – Ministry of Public Health Qatar (60-90 days processing)</li>
                    <li><span className="font-bold text-blue-300">QCHP</span> – Qatar Council for Healthcare Practitioners (45-75 days processing)</li>
                    <li><span className="font-bold text-blue-300">DHP</span> – Department of Healthcare Professions (30-60 days processing)</li>
                  </ul>
                  <div className="mt-4 text-sm text-gray-300">
                    <strong>Requirements:</strong> Medical degree, QCHP exam, 3+ years experience
                  </div>
                  <div className="mt-6 flex flex-col gap-3 relative z-10">
                    <button
                      onClick={() => handleGetLicenseClick('Qatar')}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                    >
                      Get License
                    </button>
                    <button
                      onClick={() => handleSeeMoreClick('Qatar')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                    >
                      See More
                    </button>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-7 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group relative overflow-hidden md:col-span-2 lg:col-span-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-20 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
                  <h3 className="font-semibold text-xl mb-4 flex items-center text-white">
                    <Award className="w-6 h-6 mr-3 text-blue-400" aria-hidden="true" />
                    Saudi Arabia & More
                  </h3>
                  <ul className="list-disc list-inside text-gray-200 space-y-2">
                    <li><span className="font-bold text-blue-300">SCFHS</span> – Saudi Commission for Health Specialties (60-90 days processing)</li>
                    <li><span className="font-bold text-blue-300">Mumaris</span> – Medical Licensing Platform Saudi Arabia (45-75 days processing)</li>
                    <li>Additional regional authorities (Kuwait, Bahrain, Oman)</li>
                  </ul>
                  <div className="mt-4 text-sm text-gray-300">
                    <strong>Requirements:</strong> Medical degree, SMLE exam, 2+ years experience
                  </div>
                  <div className="mt-6 flex flex-col gap-3 relative z-10">
                    <button
                      onClick={() => handleGetLicenseClick('Saudi Arabia')}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                    >
                      Get License
                    </button>
                    <button
                      onClick={() => handleSeeMoreClick('Saudi Arabia')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                    >
                      See More
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Features Section - Integrated */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
            onMouseEnter={() => handleSectionView('features_section')}
          >
            <h2 id="features-heading" className="text-3xl md:text-4xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Why Choose Hiaraise MedLicense AI Portal?
              </span>
            </h2>
            <div className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">
              <p className="text-gray-200 leading-relaxed text-lg">
                Our AI-powered platform streamlines the entire medical licensing process with advanced features designed specifically for Gulf and Middle East authorities. Experience faster processing, enhanced security, and expert guidance every step of the way.
              </p>
            </div>
          </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={FiShield}
                title="Bank-Grade Security"
                description="We utilize advanced encryption and comply with international data protection standards to ensure your sensitive documents and personal information are always secure."
                onView={handleFeatureCardView}
              />
              <FeatureCard
                icon={FiClock}
                title="Accelerated Processing"
                description="Our streamlined workflows and direct integrations help significantly reduce the time traditionally required for document verification and application submission."
                onView={handleFeatureCardView}
              />
              <FeatureCard
                icon={FiCheckCircle}
                title="Transparent Tracking"
                description="Gain full visibility into your application status with real-time updates and notifications accessible via your personal dashboard, keeping you informed every step of the way."
                onView={handleFeatureCardView}
              />
               <FeatureCard
                icon={FiUser}
                title="Expert Support"
                description="Access dedicated support from our team of licensing specialists who can provide guidance and assistance throughout your application journey."
                onView={handleFeatureCardView}
              />
               <FeatureCard
                icon={FiFileText}
                title="Simplified Document Uploads"
                description="Our intuitive drag-and-drop interface makes uploading and managing your credentials straightforward and error-free."
                onView={handleFeatureCardView}
              />
               <FeatureCard
                icon={FiCreditCard}
                title="Secure Payment Gateway"
                description="Process payments for your applications and services through a trusted and secure payment system."
                onView={handleFeatureCardView}
              />
            </div>
          </div>

        {/* How It Works Section - Integrated */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
            onMouseEnter={() => handleSectionView('how_it_works_section')}
          >
            <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Your Medical Licensing Journey in 4 Simple Steps
              </span>
            </h2>
            <div className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">
              <p className="text-gray-200 leading-relaxed text-lg">
                From registration to license issuance, our streamlined process ensures a smooth experience for medical professionals seeking to practice in Gulf and Middle East countries.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <StepCard
                number="1"
                icon={FiUser}
                title="Register and Profile Creation"
                description="Begin by creating your secure account and completing your professional profile with essential information and qualifications."
                onView={handleStepCardView}
              />
              <StepCard
                number="2"
                icon={FiFileText}
                title="Document Submission"
                description="Securely upload all necessary credentials and documents through our intuitive platform. Our AI assists in verification."
                onView={handleStepCardView}
              />
              <StepCard
                number="3"
                icon={FiCheckCircle}
                title="Application & Tracking"
                description="Submit your complete application to the chosen country. Track its real-time status and receive AI-powered insights on progress."
                onView={handleStepCardView}
              />
              <StepCard
                number="4"
                icon={FiClock}
                title="License Issuance"
                description="Upon successful verification and approval, receive your medical license promptly, ready to kickstart your global career."
                onView={handleStepCardView}
              />
          </div>
        </div>

        {/* FAQ Section - Optimized for AI Answers */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
            onMouseEnter={() => handleSectionView('faq_section')}
          >
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Frequently Asked Questions About Medical Licensing
              </span>
            </h2>
            <div className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">
              <p className="text-gray-200 leading-relaxed text-lg">
                Get answers to the most common questions about medical licensing in Gulf and Middle East countries. Our AI-powered platform provides comprehensive guidance for healthcare professionals.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left Column FAQs */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-6 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3 flex items-start">
                  <span className="text-blue-400 mr-3 mt-1">Q:</span>
                  What is DHA medical licensing?
                </h3>
                <p className="text-gray-200 leading-relaxed ml-8">
                  <span className="text-green-400 font-semibold">A:</span> DHA (Dubai Health Authority) medical licensing is the process of obtaining authorization to practice medicine in Dubai, UAE. It requires verification of medical qualifications, experience, and passing required examinations like SLE (Specialty Licensing Examination).
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-6 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3 flex items-start">
                  <span className="text-blue-400 mr-3 mt-1">Q:</span>
                  What is HAAD medical licensing?
                </h3>
                <p className="text-gray-200 leading-relaxed ml-8">
                  <span className="text-green-400 font-semibold">A:</span> HAAD (Health Authority Abu Dhabi) medical licensing, now known as DOH (Department of Health), is the regulatory process for healthcare professionals to practice in Abu Dhabi, UAE. It includes credential verification and competency assessment.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-6 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3 flex items-start">
                  <span className="text-blue-400 mr-3 mt-1">Q:</span>
                  What is SCFHS medical licensing?
                </h3>
                <p className="text-gray-200 leading-relaxed ml-8">
                  <span className="text-green-400 font-semibold">A:</span> SCFHS (Saudi Commission for Health Specialties) medical licensing is the regulatory process for healthcare professionals to practice in Saudi Arabia. It requires verification of qualifications and passing the Saudi Medical Licensing Examination (SMLE).
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-6 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3 flex items-start">
                  <span className="text-blue-400 mr-3 mt-1">Q:</span>
                  How long does medical licensing take?
                </h3>
                <p className="text-gray-200 leading-relaxed ml-8">
                  <span className="text-green-400 font-semibold">A:</span> Medical licensing in Gulf countries typically takes 30-90 days depending on the authority and completeness of documentation. DHA licensing usually takes 30-45 days, while SCFHS can take 60-90 days.
                </p>
              </motion.div>
            </div>

            {/* Right Column FAQs */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-6 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3 flex items-start">
                  <span className="text-blue-400 mr-3 mt-1">Q:</span>
                  What documents are required?
                </h3>
                <p className="text-gray-200 leading-relaxed ml-8">
                  <span className="text-green-400 font-semibold">A:</span> Required documents include medical degree certificate, internship certificate, experience certificates, passport copy, passport-size photographs, and any additional qualifications or specializations.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-6 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3 flex items-start">
                  <span className="text-blue-400 mr-3 mt-1">Q:</span>
                  Do I need to take exams?
                </h3>
                <p className="text-gray-200 leading-relaxed ml-8">
                  <span className="text-green-400 font-semibold">A:</span> Yes, most Gulf countries require passing licensing examinations. SCFHS requires SMLE (Saudi Medical Licensing Examination), while UAE authorities may require SLE (Specialty Licensing Examination) depending on your specialty.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-6 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3 flex items-start">
                  <span className="text-blue-400 mr-3 mt-1">Q:</span>
                  What is QCHP medical licensing?
                </h3>
                <p className="text-gray-200 leading-relaxed ml-8">
                  <span className="text-green-400 font-semibold">A:</span> QCHP (Qatar Council for Healthcare Practitioners) medical licensing is the regulatory process for healthcare professionals to practice in Qatar. It includes credential verification and competency assessment through examinations.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-6 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3 flex items-start">
                  <span className="text-blue-400 mr-3 mt-1">Q:</span>
                  How does AI help with licensing?
                </h3>
                <p className="text-gray-200 leading-relaxed ml-8">
                  <span className="text-green-400 font-semibold">A:</span> Our AI-powered platform streamlines document verification, provides real-time application tracking, offers personalized guidance, and reduces processing time by up to 50% compared to traditional methods.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Call to Action Section - Integrated */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
            onMouseEnter={() => handleSectionView('cta_section')}
          >
            <h2 id="cta-heading" className="text-4xl md:text-5xl font-extrabold mb-8 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent leading-tight">
              Ready to Elevate Your Medical Career?
            </h2>
            <div className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl mb-12">
              <p className="text-gray-200 leading-relaxed text-lg">
                Join thousands of medical professionals who trust Hiaraise MedLicense AI Portal for seamless licensing. Get started today and unlock global opportunities across Gulf and Middle East countries.
              </p>
            </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button 
                  onClick={() => {
                    handleGetStartedClick();
                    if (user) {
                      // User is logged in, redirect to dashboard
                      navigate('/dashboard/user');
                    } else {
                      // User is not logged in, open auth modal
                      openAuthModal('login', () => {
                        navigate('/dashboard/user');
                      });
                    }
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-sm sm:text-base" 
                  aria-label="Start your medical licensing journey"
                >
                  <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" aria-hidden="true" />
                  <span>Start Your Journey Now</span>
                </button>
                <button
                  onClick={handleOpenConsultation}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50 text-sm sm:text-base"
                  aria-label="Get free consultation call"
                >
                  <FiPhone className="w-4 h-4 sm:w-6 sm:h-6" aria-hidden="true" />
                  <span>Free Consultation</span>
                </button>
                <a
                  href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I would like to chat on WhatsApp about medical licensing.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackButtonClick('whatsapp_contact_landing_cta', 'landing_page')}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 text-sm sm:text-base"
                  aria-label="Chat with us on WhatsApp"
                >
                  <FiPhone className="w-4 h-4 sm:w-6 sm:h-6" aria-hidden="true" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </div>

        {/* Floating Consultation Widget */}
        <ConsultationWidget 
          onOpenConsultation={handleOpenConsultation}
          onView={handleSectionView}
        />

        {/* Consultation Modal */}
        <ConsultationModal 
          isOpen={showConsultationModal}
          onClose={handleCloseConsultationModal}
          onScheduleCall={handleScheduleCall}
        />

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2 sm:p-6 w-full max-w-2xl mx-2 sm:mx-0 relative max-h-[95vh] flex flex-col">
              <button
                onClick={handleCloseBookingModal}
                className="absolute top-3 right-3 text-white bg-red-500/80 hover:bg-red-600/90 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow z-10 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                aria-label="Close consultation booking modal"
              >
                &times;
              </button>
              <div className="overflow-y-auto flex-1 px-2 sm:px-0" style={{ maxHeight: '85vh' }}>
                <BookingForm />
              </div>
            </div>
          </div>
        )}

        <LandingPromotionModal isOpen={showLandingPromotion} onClose={handleCloseLandingPromotion} />
      </div>
    </>
  );
} 