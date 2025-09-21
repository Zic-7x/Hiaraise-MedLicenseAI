import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../hooks/useAuth';
import VoucherPurchaseForm from '../components/VoucherPurchaseForm';
import AuthModalWrapper from '../components/AuthModalWrapper';
import { FiGift, FiPercent, FiClock, FiUsers, FiShield, FiStar, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function VoucherSystem() {
  const { session } = useAuth();

  return (
    <>
      <Helmet>
        <title>Book Prometric Exam for Only $150 - Healthcare Licensing Required | Hiaraise MedLicense</title>
        <meta name="description" content="Book your Prometric exam for only $150-200! Official cost is $240-300. Required for QCHP, SCFHS, DHA, HAAD, MOHAP licensing. Save money or resell to colleagues at official cost and earn profit." />
        <meta name="keywords" content="Prometric exam booking $150, healthcare licensing exam discount, QCHP SCFHS DHA HAAD MOHAP exam booking, medical license exam cheap, Prometric voucher resell profit, healthcare professional exam savings" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Prometric Exam Vouchers - Up to 50% Discount | Hiaraise MedLicense" />
        <meta property="og:description" content="Get exclusive Prometric exam vouchers with up to 50% discount. Secure your exam slot with flexible scheduling and instant delivery." />
        <meta property="og:url" content="https://hiaraise.com/vouchers" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hiaraise.com/logo.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prometric Exam Vouchers - Up to 50% Discount" />
        <meta name="twitter:description" content="Get exclusive Prometric exam vouchers with up to 50% discount. Secure your exam slot with flexible scheduling and instant delivery." />
        <meta name="twitter:image" content="https://hiaraise.com/logo.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hiaraise" />
        <link rel="canonical" href="https://hiaraise.com/vouchers" />
        
        {/* Enhanced Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Buy Prometric Exam Vouchers - Lowest Price Guaranteed | Hiaraise",
          "description": "Buy Prometric vouchers at lowest price! Save up to 50% on exam fees. Perfect for yourself, family, friends, or clients.",
          "url": "https://hiaraise.com/vouchers",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hiaraise.com/" },
              { "@type": "ListItem", "position": 2, "name": "Vouchers", "item": "https://hiaraise.com/vouchers" }
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
          "@type": "Product",
          "name": "Prometric Exam Vouchers",
          "description": "Exclusive Prometric exam vouchers with up to 50% discount. Flexible scheduling and instant delivery.",
          "brand": {
            "@type": "Brand",
            "name": "Hiaraise AI"
          },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "PKR",
            "lowPrice": "5000",
            "highPrice": "15000",
            "offerCount": "Multiple",
            "description": "Up to 50% discount on Prometric exam vouchers"
          },
          "category": "Medical Exam Vouchers",
          "availability": "InStock"
        })}</script>
        
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Prometric Voucher Service",
          "description": "Professional Prometric voucher purchasing service with exclusive discounts and flexible scheduling",
          "provider": {
            "@type": "Organization",
            "name": "Hiaraise AI"
          },
          "serviceType": "Exam Voucher Service",
          "areaServed": {
            "@type": "Country",
            "name": "Pakistan"
          },
          "offers": {
            "@type": "Offer",
            "description": "Up to 50% discount on Prometric exam vouchers",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "Variable",
              "priceCurrency": "PKR"
            }
          }
        })}</script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Auth Modal */}
        <AuthModalWrapper />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="mb-6">
              <img 
                src="/Prometric-Logo.png" 
                alt="Prometric Logo" 
                className="w-28 h-28 object-contain mx-auto"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">
              Book Your Prometric Exam for Only $150
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Required for licensing with QCHP (Qatar), SCFHS (Saudi Arabia), DHA (Dubai), HAAD (Abu Dhabi), and MOHAP (UAE). 
              Official Prometric exam cost is $240–$300, while Hiaraise provides bookings for only $150–$200. 
              Save money on your exam or resell to colleagues at official cost and earn profit!
            </p>

            {/* Price Comparison Section */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl p-6 mb-8 max-w-5xl mx-auto">
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
            </div>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <FiPercent className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1">Up to 50% Off</h3>
                <p className="text-gray-300 text-sm">Exclusive discount pricing</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <FiClock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1">Flexible Timing</h3>
                <p className="text-gray-300 text-sm">Choose your preferred slot</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <FiUsers className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1">Limited Slots</h3>
                <p className="text-gray-300 text-sm">Exclusive availability</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <FiShield className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1">Secure Purchase</h3>
                <p className="text-gray-300 text-sm">Instant voucher delivery</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* How It Works Section */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-lg mb-4">1</div>
              <h3 className="text-lg font-semibold text-white mb-2">Select Your Slot</h3>
              <p className="text-gray-300 text-sm">Choose from available exam dates and times with special discount pricing.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white font-bold text-lg mb-4">2</div>
              <h3 className="text-lg font-semibold text-white mb-2">Complete Purchase</h3>
              <p className="text-gray-300 text-sm">Secure your voucher with a simple payment process.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 text-white font-bold text-lg mb-4">3</div>
              <h3 className="text-lg font-semibold text-white mb-2">Get Your Voucher</h3>
              <p className="text-gray-300 text-sm">Receive your unique voucher code instantly via email.</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-400/30 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Why Choose Our Vouchers?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FiStar className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Exclusive Discounts</h3>
                  <p className="text-gray-300 text-sm">Access to special pricing not available through regular booking channels.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiClock className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Flexible Scheduling</h3>
                  <p className="text-gray-300 text-sm">Choose from multiple time slots that fit your schedule.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiShield className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Secure & Reliable</h3>
                  <p className="text-gray-300 text-sm">Your voucher is guaranteed and backed by our service.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FiUsers className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Limited Availability</h3>
                  <p className="text-gray-300 text-sm">Each slot has limited capacity ensuring personalized service.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiGift className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Instant Delivery</h3>
                  <p className="text-gray-300 text-sm">Receive your voucher code immediately after payment.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiPercent className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Significant Savings</h3>
                  <p className="text-gray-300 text-sm">Save hundreds of dollars on your exam registration.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-amber-900/20 border border-amber-400/30 rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-amber-300 mb-3">📋 Important Terms & Conditions</h3>
          <ul className="text-amber-200 text-sm space-y-2 mb-4">
            <li>• Vouchers are valid only for the specific date and time slot selected</li>
            <li>• Voucher codes must be presented at the exam center along with valid ID</li>
            <li>• No refunds or exchanges once voucher is purchased</li>
            <li>• Arrive 30 minutes before your scheduled exam time</li>
            <li>• Vouchers expire if not used by the scheduled exam time</li>
            <li>• All exam center rules and regulations apply</li>
          </ul>
          <div className="text-center">
            <Link 
              to="/voucher-terms" 
              className="inline-flex items-center text-amber-300 hover:text-amber-200 text-sm font-medium transition-colors duration-300"
            >
              View Complete Voucher Terms and Conditions
              <FiArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Voucher Purchase Form */}
        <VoucherPurchaseForm session={session} />
      </div>
    </div>
    </>
  );
}
