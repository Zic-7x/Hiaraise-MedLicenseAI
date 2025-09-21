import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiZap, FiUser, FiFileText, FiShield, FiClock, FiArrowRight } from 'react-icons/fi';
import { FaHospitalAlt, FaGlobe, FaUserMd, FaStethoscope, FaHeartbeat, FaWhatsapp } from 'react-icons/fa';
import { trackButtonClick, trackEvent } from '../utils/analytics';
import { trackMetaPixelButtonClick } from '../utils/metaPixel';
import { useAuthModal } from '../contexts/AuthModalContext';

const benefits = [
  { icon: FiCheckCircle, text: '99% Success Ratio on initial submissions with our expert-supervised AI system.' },
  { icon: FiZap, text: 'All-in-One Convenience: Register once, and we handle all portal interactions and paperwork.' },
  { icon: FiClock, text: 'Real-Time Tracking: Automated SMS/email alerts at every stage.' },
  { icon: FiShield, text: 'Transparent Pricing: No hidden costs or surprise add-ons.' },
  { icon: FiUser, text: 'Expert Support: Personalized guidance from licensing specialists.' },
  { icon: FiFileText, text: 'AI-Powered Accuracy: Prevents common errors and delays.' },
  { icon: FiArrowRight, text: 'Maximize Exam Exemptions: Our process and documentation review increases your chance of direct licensing or exam waivers where possible.' },
];

const processSteps = [
  { icon: FiUser, title: 'Register & Upload', desc: 'Create your account, select your profession and country, and upload your documents.' },
  { icon: FiFileText, title: 'AI-Driven Pre-Check', desc: 'Our AI reviews your documents for completeness and compliance within minutes.' },
  { icon: FiCheckCircle, title: 'Expert Review & Submission', desc: 'Our specialists conduct a final check and submit your application on your behalf.' },
  { icon: FiShield, title: 'Track & Communicate', desc: 'We handle all third-party interactions and keep you updated in real time.' },
  { icon: FiZap, title: 'License Delivery', desc: 'Receive your license electronically through your dashboard.' },
];

const licenseCountries = [
  {
    country: 'UAE',
    licenses: [
      { name: 'Dubai Health Authority (DHA)', icon: FaHospitalAlt },
      { name: 'Department of Health Abu Dhabi (DOH/HAAD)', icon: FaHospitalAlt },
      { name: 'Ministry of Health and Prevention (MOHAP)', icon: FaHospitalAlt },
    ],
  },
  {
    country: 'Qatar',
    licenses: [
      { name: 'Ministry of Public Health (MOPH/DHP)', icon: FaHospitalAlt },
      { name: 'Qatar Council for Healthcare Practitioners (QCHP)', icon: FaHospitalAlt },
    ],
  },
  {
    country: 'Saudi Arabia',
    licenses: [
      { name: 'Saudi Commission for Health Specialties (SCFHS)', icon: FaHospitalAlt },
      { name: 'Mumaris Plus', icon: FaHospitalAlt },
    ],
  },
];

const licenseBenefits = [
  'Work legally and securely in top Gulf countries.',
  'Access higher salaries and better job opportunities.',
  'Enjoy professional recognition and career growth.',
  'Eligibility for government and private sector jobs.',
  'Easier relocation and family sponsorship.',
  'Access to advanced healthcare systems and training.',
  'Potential for exam exemption or fast-track licensing.',
  'Internationally recognized credentials.',
];

const healthAuthorities = [
  { name: 'Dubai Health Authority (DHA)', icon: FaHospitalAlt },
  { name: 'Department of Health Abu Dhabi (DOH/HAAD)', icon: FaHospitalAlt },
  { name: 'Ministry of Health and Prevention (MOHAP)', icon: FaHospitalAlt },
  { name: 'Ministry of Public Health Qatar (MOPH/DHP)', icon: FaHospitalAlt },
  { name: 'Qatar Council for Healthcare Practitioners (QCHP)', icon: FaHospitalAlt },
  { name: 'Saudi Commission for Health Specialties (SCFHS)', icon: FaHospitalAlt },
  { name: 'Mumaris Plus', icon: FaHospitalAlt },
  { name: 'DataFlow Group (Primary Source Verification)', icon: FaGlobe },
];

export default function StartLicense() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleStart = () => {
    if (user) {
      navigate('/submit-case');
    } else {
      openAuthModal('login', () => {
        navigate('/submit-case');
      });
    }
  };

  const handleGetLicenseClick = (country) => {
    trackButtonClick('get_license', 'startlicense_page', country);
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
  };

  const handleSeeMoreClick = (country) => {
    trackButtonClick('see_more', 'startlicense_page', country);
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
  };

  return (
    <>
      <Helmet>
        <title>Start License Process | Hiaraise</title>
        <meta name="description" content="Begin your medical licensing journey with Hiaraise. Enjoy expert support, AI-powered accuracy, and maximize your chances for exam exemption and direct licensing in UAE, Qatar, and Saudi Arabia." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Start License Process | Hiaraise",
          "description": "Begin your medical licensing journey with Hiaraise. Enjoy expert support, AI-powered accuracy, and maximize your chances for exam exemption and direct licensing in UAE, Qatar, and Saudi Arabia.",
          "url": "https://hiaraise.com/start-license",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hiaraise.com/" },
              { "@type": "ListItem", "position": 2, "name": "Start License", "item": "https://hiaraise.com/start-license" }
            ]
          },
          "publisher": {
            "@type": "Organization",
            "name": "Hiaraise AI",
            "url": "https://hiaraise.com/",
            "logo": {
              "@type": "ImageObject",
              "url": "https://hiaraise.com/logo.png"
            }
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Start Your Medical License Process with Hiaraise",
          "description": "Step-by-step guide to starting your medical license process in the Gulf region using Hiaraise.",
          "step": [
            { "@type": "HowToStep", "name": "Register & Upload", "text": "Create your account, select your profession and country, and upload your documents." },
            { "@type": "HowToStep", "name": "AI-Driven Pre-Check", "text": "Our AI reviews your documents for completeness and compliance within minutes." },
            { "@type": "HowToStep", "name": "Expert Review & Submission", "text": "Our specialists conduct a final check and submit your application on your behalf." },
            { "@type": "HowToStep", "name": "Track & Communicate", "text": "We handle all third-party interactions and keep you updated in real time." },
            { "@type": "HowToStep", "name": "License Delivery", "text": "Receive your license electronically through your dashboard." }
          ]
        })}</script>
      </Helmet>
      <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
          {[...Array(18)].map((_, i) => (
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
        <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-8">
          {/* Hero Section */}
          <motion.section
            className="text-center mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Start Your Medical License Process
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Simplify your journey to a medical license in the UAE, Qatar, or Saudi Arabia. Hiaraise handles every step, maximizes your chance for exam exemption, and delivers your license faster.
            </motion.p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
              <motion.button
                onClick={handleStart}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full font-bold text-lg sm:text-xl shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
              >
                Start License Process
              </motion.button>
              <motion.button
                onClick={() => navigate('/eligibility-check')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-bold text-lg sm:text-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
              >
                Check Eligibility
              </motion.button>
            </div>
          </motion.section>

          {/* What Licenses We Offer Section */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">What Licenses We Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {licenseCountries.map((country, idx) => (
                <motion.div
                  key={country.country}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col h-full"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <div className="text-cyan-300 font-bold text-lg mb-2 flex items-center">
                    <FaGlobe className="mr-2" /> {country.country}
                  </div>
                  <ul className="list-disc list-inside text-gray-200 ml-4 mb-4 flex-grow">
                    {country.licenses.map((lic, i) => (
                      <li key={lic.name} className="flex items-center mb-1">
                        <lic.icon className="w-4 h-4 mr-2 text-cyan-400" /> {lic.name}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-2 mt-auto">
                    <button
                      onClick={() => handleGetLicenseClick(country.country)}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center text-sm"
                    >
                      Get License
                    </button>
                    <button
                      onClick={() => handleSeeMoreClick(country.country)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center text-sm"
                    >
                      See More
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Benefits of Getting Licensed Section */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">Benefits of Getting Licensed in These Countries</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-200">
              {licenseBenefits.map((b, i) => (
                <motion.li
                  key={b}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 flex items-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                >
                  <FiCheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /> {b}
                </motion.li>
              ))}
            </ul>
          </motion.section>

          {/* Health Authorities Section */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">Health Authorities & Partners</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {healthAuthorities.map((auth, i) => (
                <motion.div
                  key={auth.name}
                  className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                >
                  <auth.icon className="w-6 h-6 text-cyan-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-200 text-base md:text-lg">{auth.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Benefits Section */}
          <motion.section
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">Why Get Licensed with Hiaraise?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  className="flex items-start space-x-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-blue-500/60 hover:shadow-glow-md transition-all duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <b.icon className="w-6 h-6" />
                  </div>
                  <span className="text-gray-200 text-base md:text-lg leading-relaxed">{b.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* How It Works */}
          <motion.section
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">How the Hiaraise Process Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {processSteps.map((step, i) => (
                <motion.div
                  key={i}
                  className="flex items-start space-x-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-cyan-500/60 hover:shadow-glow-md transition-all duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-base md:text-lg mb-1">{step.title}</div>
                    <div className="text-gray-200 text-sm md:text-base leading-relaxed">{step.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Country-Specific Licensing */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">Country-Specific Licensing & Exams</h2>
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-cyan-300 mb-2">UAE (DHA, DOH, MOHAP)</h3>
                <ul className="list-disc list-inside ml-4 text-gray-200">
                  <li><strong>DHA (Dubai):</strong> DataFlow verification, Prometric exam (may be exempted for some), eligibility assessment, and license issuance. <em>Timeline: 6-12 weeks.</em></li>
                  <li><strong>DOH (Abu Dhabi):</strong> DataFlow, Pearson VUE exam, eligibility assessment. <em>Timeline: 1-3 months.</em></li>
                  <li><strong>MOHAP:</strong> DataFlow, facility-based application, possible MOH exam. <em>Timeline: a few months.</em></li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-cyan-300 mb-2">Qatar (MOPH/DHP)</h3>
                <ul className="list-disc list-inside ml-4 text-gray-200">
                  <li>DataFlow verification, DHP application, QCHP exam (may be exempted for some), and license issuance. <em>Timeline: 2-3 months.</em></li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-cyan-300 mb-2">Saudi Arabia (SCFHS)</h3>
                <ul className="list-disc list-inside ml-4 text-gray-200">
                  <li>DataFlow, MumarisPlus registration, Prometric exam (may be exempted for some), professional classification, and final registration. <em>Timeline: several months.</em></li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Exam Exemption & Direct Licensing */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">How We Maximize Exam Exemptions & Direct Licensing</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-2">
              <li>Our AI and experts ensure your documents and experience are presented in the best possible way to meet exemption criteria.</li>
              <li>We stay updated on the latest exemption policies for each country and authority.</li>
              <li>We highlight your credentials and experience to maximize your chance for direct licensing or exam waivers.</li>
              <li>If an exam is required, we guide you through the process and help you prepare.</li>
            </ul>
          </motion.section>

          {/* Call to Action */}
          <motion.section
            className="text-center mb-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <motion.button
              onClick={handleStart}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full font-bold text-lg sm:text-xl shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
            >
              Start License Process
            </motion.button>
            <p className="mt-4 text-gray-400 text-sm">
              Already have an account? You'll be redirected to submit your case.
            </p>
          </motion.section>
        </div>
      </div>
      
      {/* WhatsApp Floating Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <a
          href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I need help with starting my medical licensing process.')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackButtonClick('whatsapp_contact_startlicense_floating', 'startlicense_page')}
          className="group relative w-14 h-14 rounded-full flex items-center justify-center text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
          aria-label="Contact us on WhatsApp"
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
    </>
  );
} 
