import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FiGift, FiPercent, FiClock, FiUsers, FiShield, FiStar, FiCheck, FiArrowRight, FiCalendar, FiDollarSign, FiMapPin, FiPhone, FiMail, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import BookVoucherButton from '../components/BookVoucherButton';

export default function PrometricVouchers() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiInfo },
    { id: 'how-it-works', label: 'How It Works', icon: FiClock },
    { id: 'benefits', label: 'Benefits', icon: FiStar },
    { id: 'pricing', label: 'Pricing', icon: FiDollarSign },
    { id: 'faq', label: 'FAQ', icon: FiCheck }
  ];

  const features = [
    {
      icon: FiPercent,
      title: "Up to 50% Discount",
      description: "Exclusive pricing not available through regular channels",
      color: "text-green-400"
    },
    {
      icon: FiClock,
      title: "Flexible Scheduling",
      description: "Choose from multiple time slots that fit your schedule",
      color: "text-blue-400"
    },
    {
      icon: FiUsers,
      title: "Limited Availability",
      description: "Each slot has limited capacity ensuring personalized service",
      color: "text-purple-400"
    },
    {
      icon: FiShield,
      title: "Secure & Reliable",
      description: "Your voucher is guaranteed and backed by our service",
      color: "text-red-400"
    },
    {
      icon: FiGift,
      title: "Instant Delivery",
      description: "Receive your voucher code immediately after payment",
      color: "text-orange-400"
    },
    {
      icon: FiCalendar,
      title: "Easy Booking",
      description: "Simple calendar-based slot selection process",
      color: "text-cyan-400"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Browse Available Slots",
      description: "View our calendar of available Prometric exam slots with special discount pricing",
      icon: FiCalendar
    },
    {
      number: 2,
      title: "Select Your Preferred Slot",
      description: "Choose the date and time that works best for your schedule",
      icon: FiClock
    },
    {
      number: 3,
      title: "Complete Purchase",
      description: "Secure your voucher with our simple payment process",
      icon: FiDollarSign
    },
    {
      number: 4,
      title: "Receive Voucher Code",
      description: "Get your unique voucher code instantly via email and dashboard",
      icon: FiGift
    },
    {
      number: 5,
      title: "Book Your Exam",
      description: "Use your voucher code at the Prometric center to schedule your exam",
      icon: FiCheck
    }
  ];

  const benefits = [
    {
      title: "Significant Cost Savings",
      description: "Save hundreds of dollars on your Prometric exam registration with our exclusive discount pricing.",
      icon: FiDollarSign,
      color: "text-green-400"
    },
    {
      title: "Convenient Scheduling",
      description: "Choose from multiple available time slots that fit your busy schedule and preferences.",
      icon: FiCalendar,
      color: "text-blue-400"
    },
    {
      title: "Instant Access",
      description: "Receive your voucher code immediately after payment - no waiting periods or delays.",
      icon: FiGift,
      color: "text-purple-400"
    },
    {
      title: "Secure Process",
      description: "All transactions are secure and your voucher is guaranteed by our service.",
      icon: FiShield,
      color: "text-red-400"
    },
    {
      title: "Expert Support",
      description: "Get assistance from our medical licensing experts throughout the process.",
      icon: FiUsers,
      color: "text-orange-400"
    },
    {
      title: "Flexible Options",
      description: "Multiple exam centers and time slots available across different locations.",
      icon: FiMapPin,
      color: "text-cyan-400"
    }
  ];

  const faqs = [
    {
      question: "What is a Prometric voucher?",
      answer: "A Prometric voucher is a prepaid code that allows you to schedule and take your medical licensing exam at any Prometric testing center. Our vouchers come with significant discounts compared to regular exam registration fees."
    },
    {
      question: "How much can I save with your vouchers?",
      answer: "You can save up to 50% on your Prometric exam registration. The exact savings depend on the specific slot you choose, with some slots offering higher discounts than others."
    },
    {
      question: "When will I receive my voucher code?",
      answer: "You'll receive your unique voucher code immediately after completing your payment. The code will be sent to your email and also available in your dashboard."
    },
    {
      question: "How long is my voucher valid?",
      answer: "Vouchers are valid until the specific exam date and time you selected. You must use the voucher on or before the scheduled exam time."
    },
    {
      question: "Can I reschedule my exam?",
      answer: "Rescheduling policies depend on Prometric's terms and conditions. We recommend contacting Prometric directly for rescheduling options using your voucher code."
    },
    {
      question: "What if I need to cancel my voucher?",
      answer: "Voucher cancellations are subject to our terms and conditions. Please contact our support team for assistance with cancellation requests."
    },
    {
      question: "Are there any restrictions on voucher usage?",
      answer: "Vouchers are valid only for the specific exam type, date, and time slot you selected. They cannot be transferred to other candidates or used for different exam types."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept bank transfers and other secure payment methods. All transactions are processed securely and your payment information is protected."
    }
  ];

  const pricingExamples = [
    {
      examType: "DHA License Exam",
      originalPrice: 300,
      discountPrice: 150,
      savings: 150,
      savingsPercent: 50
    },
    {
      examType: "MOHAP License Exam",
      originalPrice: 280,
      discountPrice: 150,
      savings: 130,
      savingsPercent: 46
    },
    {
      examType: "QCHP License Exam",
      originalPrice: 300,
      discountPrice: 180,
      savings: 120,
      savingsPercent: 40
    },
    {
      examType: "SCFHS License Exam",
      originalPrice: 240,
      discountPrice: 150,
      savings: 90,
      savingsPercent: 38
    }
  ];

  return (
    <>
      <Helmet>
        <title>Book Prometric Exam for Only $150 - Save Up to $150 | Healthcare Licensing | Hiaraise</title>
        <meta name="description" content="Book your Prometric exam for only $150-200! Official cost is $240-300. Required for QCHP, SCFHS, DHA, HAAD, MOHAP licensing. Save money or resell to colleagues at official cost and earn profit." />
        <meta name="keywords" content="Prometric exam booking $150, healthcare licensing exam discount, QCHP SCFHS DHA HAAD MOHAP exam booking, medical license exam cheap, Prometric voucher resell profit, healthcare professional exam savings" />
        <meta property="og:title" content="Book Prometric Exam for Only $150 - Healthcare Licensing" />
        <meta property="og:description" content="Official Prometric exam cost is $240-300, Hiaraise provides bookings for only $150-200. Required for QCHP, SCFHS, DHA, HAAD, MOHAP licensing." />
        <meta property="og:url" content="https://hiaraise.com/prometric-vouchers" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Book Prometric Exam for Only $150" />
        <meta name="twitter:description" content="Official cost $240-300, Hiaraise cost $150-200. Required for healthcare licensing with QCHP, SCFHS, DHA, HAAD, MOHAP." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Prometric Exam Booking Service",
          "description": "Book Prometric exams for only $150-200. Official cost is $240-300. Required for healthcare licensing with QCHP, SCFHS, DHA, HAAD, MOHAP.",
          "url": "https://hiaraise.com/prometric-vouchers",
          "provider": {
            "@type": "Organization",
            "name": "Hiaraise MedLicense",
            "url": "https://hiaraise.com"
          },
          "serviceType": "Healthcare Exam Booking Service",
          "areaServed": ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"],
          "offers": {
            "@type": "Offer",
            "price": "150",
            "priceCurrency": "USD",
            "priceRange": "$150-$200",
            "availability": "https://schema.org/InStock"
          },
          "audience": {
            "@type": "Audience",
            "audienceType": "Healthcare Professionals"
          }
        })}</script>
      </Helmet>
      
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <img 
                src="/Prometric-Logo.png" 
                alt="Prometric Logo" 
                className="w-32 h-32 object-contain mx-auto"
              />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-6"
            >
              Book Your Prometric Exam for Only $150
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto"
            >
              Required for licensing with QCHP (Qatar), SCFHS (Saudi Arabia), DHA (Dubai), HAAD (Abu Dhabi), and MOHAP (UAE). 
              Official Prometric exam cost is $240–$300, while Hiaraise provides bookings for only $150–$200. 
              Save money on your exam or resell to colleagues at official cost and earn profit!
            </motion.p>

            {/* Price Comparison Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl p-6 mb-8 max-w-5xl mx-auto"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-300 mb-4">💡 Official vs Hiaraise Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Official Prometric Cost</h4>
                    <p className="text-gray-300 text-lg font-bold">$240 - $300</p>
                    <p className="text-gray-300">Direct booking through Prometric centers</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Hiaraise Booking Cost</h4>
                    <p className="text-green-300 text-lg font-bold">$150 - $200</p>
                    <p className="text-gray-300">Same exam, significant savings</p>
                  </div>
                  </div>
                <div className="mt-4 bg-yellow-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-300 mb-2">💰 Reselling Opportunity</h4>
                  <p className="text-gray-300">Buy at $150-200, resell to colleagues at $240-300 official cost. Earn $90-150 profit per voucher while still offering value!</p>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <BookVoucherButton 
                size="lg" 
                showLogo={true}
                linkTo="/vouchers"
              />
              <button
                onClick={() => setActiveTab('pricing')}
                className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
              >
                <FiDollarSign className="w-6 h-6" />
                <span>View Pricing</span>
              </button>
            </motion.div>

            {/* Authority-Specific Voucher Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold text-white text-center mb-6">🎯 Choose Your Exam Authority</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <Link 
                  to="/vouchers/dha-license-dubai" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                >
                  <div className="text-lg font-bold mb-1">🏥 DHA</div>
                  <div className="text-sm opacity-90">Dubai Health Authority</div>
                  <div className="text-xs mt-1">Save up to 52%</div>
                </Link>
                
                <Link 
                  to="/vouchers/mohap-license-uae" 
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                >
                  <div className="text-lg font-bold mb-1">🏛️ MOHAP</div>
                  <div className="text-sm opacity-90">Ministry of Health UAE</div>
                  <div className="text-xs mt-1">Save up to 50%</div>
                </Link>
                
                <Link 
                  to="/vouchers/doh-license-abu-dhabi" 
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                >
                  <div className="text-lg font-bold mb-1">🏥 DOH</div>
                  <div className="text-sm opacity-90">Department of Health Abu Dhabi</div>
                  <div className="text-xs mt-1">Save up to 50%</div>
                </Link>
                
                <Link 
                  to="/vouchers/qchp-license-qatar" 
                  className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold px-6 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                >
                  <div className="text-lg font-bold mb-1">🇶🇦 QCHP</div>
                  <div className="text-sm opacity-90">Qatar Council for Healthcare</div>
                  <div className="text-xs mt-1">Save up to 50%</div>
                </Link>
                
                <Link 
                  to="/vouchers/scfhs-license-saudi" 
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                >
                  <div className="text-lg font-bold mb-1">🇸🇦 SCFHS</div>
                  <div className="text-sm opacity-90">Saudi Commission for Health Specialties</div>
                  <div className="text-xs mt-1">Save up to 50%</div>
                </Link>
                
                <Link 
                  to="/vouchers" 
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold px-6 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                >
                  <div className="text-lg font-bold mb-1">🎫 All Vouchers</div>
                  <div className="text-sm opacity-90">View All Available Slots</div>
                  <div className="text-xs mt-1">Browse & Compare</div>
                </Link>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <FiPercent className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-bold text-xl">Up to 50%</h3>
                <p className="text-gray-300 text-sm">Discount</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <FiClock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-white font-bold text-xl">Instant</h3>
                <p className="text-gray-300 text-sm">Delivery</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <FiUsers className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-bold text-xl">Limited</h3>
                <p className="text-gray-300 text-sm">Slots</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <FiShield className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <h3 className="text-white font-bold text-xl">100%</h3>
                <p className="text-gray-300 text-sm">Secure</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : 'text-cyan-400 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Book Your Prometric Exam for Only $150 - Save Up to $150!</h2>
              
              {/* Healthcare Professional Focus */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/30 rounded-xl p-6 mb-8">
                <h3 className="text-2xl font-bold text-green-300 mb-4">🏥 Required for Healthcare Licensing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">📋 Licensing Requirements</h4>
                    <ul className="space-y-2">
                      <li>• QCHP (Qatar Council for Healthcare)</li>
                      <li>• SCFHS (Saudi Commission for Health Specialties)</li>
                      <li>• DHA (Dubai Health Authority)</li>
                      <li>• HAAD (Health Authority Abu Dhabi)</li>
                      <li>• MOHAP (Ministry of Health UAE)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">💰 Cost Benefits</h4>
                    <ul className="space-y-2">
                      <li>• Official cost: $240-300 per exam</li>
                      <li>• Hiaraise cost: $150-200 per exam</li>
                      <li>• Save $90-150 per exam</li>
                      <li>• Resell at official cost and earn profit</li>
                      <li>• Help colleagues save while earning</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-xl p-6 mb-8">
                <h3 className="text-2xl font-bold text-yellow-300 mb-4">🚀 How to Earn Money with Prometric Vouchers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
                  <div className="text-center">
                    <div className="bg-yellow-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-yellow-300">1</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Book Your Exam</h4>
                    <p>Purchase Prometric vouchers at our discounted prices ($150-200)</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-yellow-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-yellow-300">2</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Resell to Colleagues</h4>
                    <p>Offer exam bookings to colleagues at official cost ($240-300)</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-yellow-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-yellow-300">3</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Earn Profit</h4>
                    <p>Earn $90-150 profit per voucher while helping colleagues save</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 text-center"
                    >
                      <Icon className={`w-12 h-12 ${feature.color} mx-auto mb-4`} />
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-400/30 rounded-xl p-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Save $90-150 on Your Exam?</h3>
                <p className="text-gray-300 mb-6">Limited seats available! Book your Prometric exam now and save significantly on licensing costs.</p>
                <BookVoucherButton 
                  size="lg" 
                  showLogo={true}
                  linkTo="/vouchers"
                >
                  Book Your Exam for $150
                </BookVoucherButton>
              </div>
            </motion.div>
          )}

          {/* How It Works Tab */}
          {activeTab === 'how-it-works' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8 text-center">How Our Voucher System Works</h2>
              
              <div className="space-y-8">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start space-x-6"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-white font-bold text-xl">{step.number}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className="w-6 h-6 text-blue-400" />
                          <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                        </div>
                        <p className="text-gray-300 text-lg">{step.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Important Notes */}
              <div className="mt-12 bg-amber-900/20 border border-amber-400/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-amber-300 mb-4 flex items-center">
                  <FiAlertCircle className="w-6 h-6 mr-2" />
                  Important Notes
                </h3>
                <ul className="space-y-2 text-amber-200">
                  <li>• Arrive 30 minutes before your scheduled exam time</li>
                  <li>• Bring a valid government-issued ID</li>
                  <li>• Present your voucher code at the exam center</li>
                  <li>• Keep your confirmation email as backup</li>
                  <li>• Vouchers are non-transferable and non-refundable</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Benefits Tab */}
          {activeTab === 'benefits' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Benefits of Our Voucher System</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6"
                    >
                      <div className="flex items-start space-x-4">
                        <Icon className={`w-8 h-8 ${benefit.color} mt-1 flex-shrink-0`} />
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                          <p className="text-gray-300">{benefit.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Pricing Examples</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {pricingExamples.map((exam, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6"
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">{exam.examType}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Original Price:</span>
                        <span className="text-gray-300 line-through">${exam.originalPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-300 font-semibold">Your Price:</span>
                        <span className="text-green-300 font-bold text-xl">${exam.discountPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-red-300 font-semibold">You Save:</span>
                        <span className="text-red-300 font-bold">${exam.savings} ({exam.savingsPercent}%)</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-400/30 rounded-xl p-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Save?</h3>
                <p className="text-gray-300 mb-6">View all available slots with current pricing and discounts.</p>
                <BookVoucherButton 
                  size="lg" 
                  showLogo={true}
                  linkTo="/vouchers"
                >
                  View Available Slots
                </BookVoucherButton>
              </div>
            </motion.div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6"
                  >
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                      <FiCheck className="w-5 h-5 text-green-400 mr-2" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>

              {/* Contact Support */}
              <div className="mt-12 bg-blue-900/20 border border-blue-400/30 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-4">Still Have Questions?</h3>
                <p className="text-gray-300 mb-6">Our support team is here to help you with any questions about our voucher system.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:support@hiaraise.com"
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all duration-300"
                  >
                    <FiMail className="w-5 h-5" />
                    <span>Email Support</span>
                  </a>
                  <a
                    href="tel:+1234567890"
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg transition-all duration-300"
                  >
                    <FiPhone className="w-5 h-5" />
                    <span>Call Support</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
