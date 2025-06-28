import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShield, FiClock, FiCheckCircle, FiUser, FiFileText, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import { Brain, Sparkles } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';
import { useEffect } from 'react';
import { trackMetaPixelViewContent, trackMetaPixelButtonClick } from '../utils/metaPixel';
import { trackEvent, trackButtonClick, trackPageView } from '../utils/analytics';
import { useAnalytics } from '../utils/useAnalytics';

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

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-7 hover:border-blue-500/60 hover:shadow-glow-md transition-all duration-300 group relative overflow-hidden"
  >
    {/* Optional: subtle background effect per card */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-transparent opacity-15 group-hover:opacity-25 transition-opacity duration-300" />
    
    <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-xl font-display font-semibold text-white mb-3">{title}</h3>
    <p className="text-gray-300 leading-relaxed">{description}</p>
  </motion.div>
);

const StepCard = ({ number, title, description, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, x: -50, scale: 0.9 }}
    whileInView={{ opacity: 1, x: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className="flex items-start space-x-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-7 relative overflow-hidden"
  >
     {/* Optional: subtle background effect per card */}
     <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-transparent opacity-15" />

    <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
      {number}
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-display font-semibold text-white mb-2 flex items-center">
        <Icon className="w-5 h-5 mr-2 text-blue-400" />
        {title}
      </h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default function Landing() {
  // Enable automatic page tracking
  useAnalytics();

  useEffect(() => {
    // Track landing page view
    trackPageView('/');
    trackEvent('page_viewed', 'engagement', 'landing_page');
    
    // Meta Pixel tracking
    trackMetaPixelViewContent();
  }, []);

  const handleGetStartedClick = () => {
    trackButtonClick('get_started', 'landing_page');
    trackMetaPixelButtonClick('Get Started');
  };

  const handleLearnMoreClick = () => {
    trackButtonClick('learn_more', 'landing_page');
    trackMetaPixelButtonClick('Learn More');
  };

  const handleFeatureCardView = (featureName) => {
    trackEvent('feature_viewed', 'engagement', featureName);
  };

  const handleStepCardView = (stepNumber) => {
    trackEvent('process_step_viewed', 'engagement', `step_${stepNumber}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements from UserDashboard.js */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      <main className="flex-1 flex flex-col items-center justify-center z-10 relative">
        <div className="max-w-3xl w-full mx-auto text-center py-20 px-6">
          <div className="inline-flex items-center space-x-3 mb-6">
            <span className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              Hiaraise MedLicense AI Portal
            </h1>
          </div>
          <p className="mt-4 text-lg text-gray-300">
            The next generation platform for medical licensing, powered by AI. Streamline your application, track your progress, and get instant insights. Supports licensing for DHA, HAAD, MOH, MOPH, QCHP, DHP, SLE, SMLE SCFHS, Mumaris, and more across the Gulf.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register" className="px-8 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2" onClick={handleGetStartedClick}>
              <Sparkles className="w-5 h-5" />
              <span>Get Started</span>
            </a>
            <a href="/about" className="px-8 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2" onClick={handleLearnMoreClick}>
              <FiArrowRight className="w-5 h-5" />
              <span>Learn More</span>
            </a>
          </div>
        </div>
      </main>
      {/* Features Section */}
      <section className={`py-24`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Designed for Your Success
              </span>
            </h2>
            {/* Container with solid background for readability */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-2xl mx-auto shadow-2xl"> {/* Use a more solid background */}
              <p className="text-gray-300 leading-relaxed"> {/* Set text color to white */}
                Our platform is built to provide medical professionals with the tools and support they need to successfully navigate the licensing process in various countries and authorities, including DHA (Dubai Health Authority), HAAD (Health Authority Abu Dhabi), MOH (Ministry of Health UAE), MOPH (Ministry of Public Health Qatar), QCHP (Qatar Council for Healthcare Practitioners), DHP (Department of Healthcare Professions), SCFHS (Saudi Commission for Health Specialties) and more. Key features include:
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={FiShield}
              title="Bank-Grade Security"
              description="We utilize advanced encryption and comply with international data protection standards to ensure your sensitive documents and personal information are always secure."
            />
            <FeatureCard
              icon={FiClock}
              title="Accelerated Processing"
              description="Our streamlined workflows and direct integrations help significantly reduce the time traditionally required for document verification and application submission."
            />
            <FeatureCard
              icon={FiCheckCircle}
              title="Transparent Tracking"
              description="Gain full visibility into your application status with real-time updates and notifications accessible via your personal dashboard, keeping you informed every step of the way."
            />
             <FeatureCard
              icon={FiUser}
              title="Expert Support"
              description="Access dedicated support from our team of licensing specialists who can provide guidance and assistance throughout your application journey."
            />
             <FeatureCard
              icon={FiFileText}
              title="Simplified Document Uploads"
              description="Our intuitive drag-and-drop interface makes uploading and managing your credentials straightforward and error-free."
            />
             <FeatureCard
              icon={FiCreditCard}
              title="Secure Payment Gateway"
              description="Process payments for your applications and services through a trusted and secure payment system."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`py-24`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Your Path to a Global Career in 4 Steps
              </span>
            </h2>
             {/* Container with solid background for readability */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-2xl mx-auto shadow-2xl"> {/* Use a more solid background */}
               <p className="text-gray-300 leading-relaxed"> {/* Set text color to white */}
                Our process is designed to be simple and efficient, guiding you from initial registration to receiving your medical license.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <StepCard
              number="1"
              icon={FiUser}
              title="Register and Profile Creation"
              description="Begin by creating your secure account and completing your professional profile with essential information and qualifications."
            />
            <StepCard
              number="2"
              icon={FiFileText}
              title="Document Submission"
              description="Securely upload all necessary credentials and documents through our intuitive platform. Our AI assists in verification."
            />
            <StepCard
              number="3"
              icon={FiCheckCircle}
              title="Application & Tracking"
              description="Submit your complete application to the chosen country. Track its real-time status and receive AI-powered insights on progress."
            />
            <StepCard
              number="4"
              icon={FiClock}
              title="License Issuance"
              description="Upon successful verification and approval, receive your medical license promptly, ready to kickstart your global career."
            />
          </div>
        </div>
      </section>

      {/* Supported Jurisdictions Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-900 to-blue-900 text-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Supported Licensing Authorities & Jurisdictions
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Hiaraise MedLicense AI Portal supports end-to-end licensing for major Gulf and Middle East authorities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="font-semibold text-xl mb-2">UAE</h3>
              <ul className="list-disc list-inside text-blue-100">
                <li><span className="font-bold">DHA</span> – Dubai Health Authority</li>
                <li><span className="font-bold">HAAD/DOH</span> – Department of Health Abu Dhabi</li>
                <li><span className="font-bold">MOH</span> – Ministry of Health (UAE)</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="font-semibold text-xl mb-2">Qatar</h3>
              <ul className="list-disc list-inside text-blue-100">
                <li><span className="font-bold">MOPH</span> – Ministry of Public Health</li>
                <li><span className="font-bold">QCHP</span> – Qatar Council for Healthcare Practitioners</li>
                <li><span className="font-bold">DHP</span> – Department of Healthcare Professions</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="font-semibold text-xl mb-2">Saudi Arabia</h3>
              <ul className="list-disc list-inside text-blue-100">
                <li><span className="font-bold">SCFHS</span> – Saudi Commission for Health Specialties</li>
                <li><span className="font-bold">Mumaris</span> </li>
                <li>And more regional authorities</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 text-blue-200">
            Whether you are applying for DHA, HAAD, MOH, MOPH, QCHP, DHP, or SCFHS, Mumaris Plus our platform guides you through every step for a successful outcome.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-800 to-indigo-900 text-white text-center relative overflow-hidden shadow-2xl rounded-t-3xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent leading-tight">
            Ready to Elevate Your Medical Career?
          </h2>
          <p className="text-lg text-blue-100 mb-10">
            Join thousands of medical professionals who trust MedLicense AI Portal for seamless licensing. Get started today and unlock global opportunities.
          </p>
          <Link to="/register" className="inline-flex items-center space-x-3 px-10 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all duration-300 transform hover:scale-105" onClick={handleGetStartedClick}>
            <Sparkles className="w-6 h-6" />
            <span>Start Your Journey Now</span>
          </Link>
        </div>
      </section>
      <ChatWidget />
    </div>
    
  );
} 