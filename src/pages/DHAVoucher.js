import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FiGift, FiPercent, FiClock, FiUsers, FiShield, FiStar, FiCheck, FiArrowRight, FiCalendar, FiDollarSign, FiMapPin, FiPhone, FiMail, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import BookVoucherButton from '../components/BookVoucherButton';

export default function DHAVoucher() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiInfo },
    { id: 'pricing', label: 'Pricing', icon: FiDollarSign },
    { id: 'benefits', label: 'Benefits', icon: FiStar },
    { id: 'faq', label: 'FAQ', icon: FiCheck }
  ];

  const features = [
    {
      icon: FiPercent,
      title: "Up to 50% Discount",
      description: "Exclusive DHA exam voucher pricing not available through regular channels",
      color: "text-green-400"
    },
    {
      icon: FiClock,
      title: "Flexible Scheduling",
      description: "Choose from multiple DHA exam time slots that fit your schedule",
      color: "text-blue-400"
    },
    {
      icon: FiUsers,
      title: "Limited Availability",
      description: "Each DHA voucher slot has limited capacity ensuring personalized service",
      color: "text-purple-400"
    },
    {
      icon: FiShield,
      title: "Secure & Reliable",
      description: "Your DHA voucher is guaranteed and backed by our service",
      color: "text-red-400"
    },
    {
      icon: FiGift,
      title: "Instant Delivery",
      description: "Receive your DHA voucher code immediately after payment",
      color: "text-orange-400"
    },
    {
      icon: FiCalendar,
      title: "Easy Booking",
      description: "Simple calendar-based DHA exam slot selection process",
      color: "text-cyan-400"
    }
  ];

  const pricing = [
    {
      examType: "DHA License Exam",
      originalPrice: 500,
      discountPrice: 240,
      savings: 260,
      savingsPercent: 52
    }
  ];

  return (
    <>
      <Helmet>
        <title>Buy DHA Prometric Vouchers - Up to 52% Discount | Dubai Health Authority | Hiaraise</title>
        <meta name="description" content="Buy DHA Prometric voucher at lowest price! Save 52% on Dubai Health Authority Prometric exam fees. Perfect for yourself, family, friends, or clients. Resell Prometric vouchers to earn money while helping others save on exam costs. Buy low, sell high!" />
        <meta name="keywords" content="buy DHA Prometric voucher, DHA Prometric exam voucher lowest price, Dubai Health Authority Prometric voucher discount, DHA Prometric license exam cheap, DHA Prometric exam voucher resell, earn money DHA Prometric voucher, DHA Prometric voucher for clients, DHA Prometric exam booking discount, Dubai medical license Prometric voucher cheap, buy DHA voucher, DHA exam voucher" />
        <meta property="og:title" content="DHA License Exam Vouchers - Up to 52% Discount" />
        <meta property="og:description" content="Get exclusive DHA license exam vouchers with up to 52% discount. Secure your Dubai Health Authority exam slot with flexible scheduling." />
        <meta property="og:url" content="https://hiaraise.com/vouchers/dha-license-dubai" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DHA License Exam Vouchers - Up to 52% Discount" />
        <meta name="twitter:description" content="Get exclusive DHA license exam vouchers with up to 52% discount. Secure your Dubai Health Authority exam slot." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "DHA License Exam Vouchers",
          "description": "Exclusive DHA license exam vouchers with up to 52% discount. Available for Dubai Health Authority medical licensing exams.",
          "url": "https://hiaraise.com/vouchers/dha-license-dubai",
          "image": "https://hiaraise.com/Prometric-Logo.png",
          "brand": {
            "@type": "Brand",
            "name": "Dubai Health Authority"
          },
          "offers": {
            "@type": "Offer",
            "price": "240",
            "priceCurrency": "USD",
            "priceRange": "$240-$300",
            "availability": "https://schema.org/InStock",
            "validFrom": "2025-01-08",
            "description": "Discounted DHA exam vouchers with up to 52% savings"
          },
          "category": "Medical Licensing Exam Vouchers",
          "audience": {
            "@type": "Audience",
            "audienceType": "Medical Professionals"
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
                  alt="DHA Logo" 
                  className="w-24 h-24 object-contain mx-auto mb-6"
                />
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-6"
              >
                🏥 DHA License Exam Vouchers
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
              >
                Buy DHA voucher at the lowest price! Save up to 52% on Dubai Health Authority exam fees. 
                Perfect for yourself, family, friends, or clients. Resell vouchers to earn money while helping others save on exam costs.
              </motion.p>

              {/* Money-Making Marketing Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl p-6 mb-8 max-w-4xl mx-auto"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-yellow-300 mb-4">💰 Earn Money by Reselling DHA Vouchers!</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">Buy Low, Sell High</h4>
                      <p className="text-gray-300">Purchase at $240, resell at $400+ and earn $160+ profit per voucher</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">Help Others Save</h4>
                      <p className="text-gray-300">Clients still save 20-30% compared to regular exam fees</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">High Demand</h4>
                      <p className="text-gray-300">DHA exams are in high demand - easy to find buyers</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Feature Highlights */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                {features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                    <feature.icon className={`w-8 h-8 ${feature.color} mx-auto mb-2`} />
                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link 
                  to="/vouchers" 
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
                >
                  Buy DHA Voucher Now - Save 52%
                </Link>
                <Link 
                  to="/vouchers" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  View All Vouchers
                  <FiArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 mx-2 mb-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 text-center">DHA License Exam Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">About DHA License</h3>
                    <p className="text-gray-300 mb-4">
                      The Dubai Health Authority (DHA) license is required for all healthcare professionals 
                      practicing in Dubai. Our exclusive vouchers provide significant savings on the 
                      examination fees.
                    </p>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start">
                        <FiCheck className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Valid for all DHA license examinations
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Lifetime validity until slot expires
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Transferable to third parties
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Eligibility Requirements</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Medical degree from recognized institution</li>
                      <li>• Valid medical license from home country</li>
                      <li>• Primary Source Verification (PSV) completion</li>
                      <li>• English language proficiency</li>
                      <li>• Good standing certificate</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 text-center">DHA Voucher Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-2xl mx-auto">
                  {pricing.map((item, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-400/30 rounded-xl p-6">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-white mb-2">{item.examType}</h3>
                        <div className="flex items-center justify-center space-x-4 mb-4">
                          <span className="text-2xl font-bold text-green-400">${item.discountPrice}</span>
                          <span className="text-lg text-gray-400 line-through">${item.originalPrice}</span>
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Save {item.savingsPercent}%
                          </span>
                        </div>
                        <p className="text-gray-300 mb-4">You save ${item.savings} on this exam voucher</p>
                        <Link 
                          to="/vouchers" 
                          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 inline-flex items-center justify-center"
                        >
                          Buy DHA Voucher - Save ${item.savings}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'benefits' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Why Choose Our DHA Vouchers?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg bg-white/10 ${feature.color.replace('text-', 'bg-').replace('-400', '-500/20')}`}>
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-300">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 text-center">DHA Voucher FAQ</h2>
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">How long is the DHA voucher valid?</h3>
                    <p className="text-gray-300">DHA vouchers remain valid until the associated exam slot expires, providing lifetime validity within the slot period.</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Can I transfer my DHA voucher to someone else?</h3>
                    <p className="text-gray-300">Yes, DHA vouchers are fully transferable. You can sell or gift your voucher to any eligible candidate.</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">What if I can't attend my scheduled DHA exam?</h3>
                    <p className="text-gray-300">DHA vouchers are non-refundable, but you can transfer them to another person or use them for a different exam slot if available.</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">How do I use my DHA voucher?</h3>
                    <p className="text-gray-300">Present your voucher code during DHA exam registration. The voucher will cover the examination fees.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
