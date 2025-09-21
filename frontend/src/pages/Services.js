import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { packages } from '../config/packages';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { trackMetaPixelViewContent, trackMetaPixelAddToCart, trackMetaPixelButtonClick } from '../utils/metaPixel';
import { trackEvent, trackButtonClick, trackPageView, trackCountrySelection } from '../utils/analytics';
import { useAnalytics } from '../utils/useAnalytics';
import { useAuthModal } from '../contexts/AuthModalContext';
import { Helmet } from 'react-helmet';

const faqs = [
  {
    q: 'What documents are required?',
    a: 'Passport, medical degree, professional credentials, and recent photo.',
  },
  {
    q: 'How long does the process take?',
    a: 'Typically 2-6 weeks, depending on the country and case complexity.',
  },
  {
    q: 'Can I track my application?',
    a: 'Yes, you can track your case status in your dashboard at any time.',
  },
];

export default function Services() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { openAuthModal } = useAuthModal();
  
  // Enable automatic page tracking
  useAnalytics();

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // Track page view
    trackPageView('/pricing');
    trackEvent('page_viewed', 'engagement', 'services_page');
    trackMetaPixelViewContent('Services Page');

    return () => subscription.unsubscribe();
  }, []);

  const handleStartNow = (packageId) => {
    try {
      const packageData = packages.find(p => p.id === packageId);
      if (!packageData) {
        console.error('Package not found:', packageId);
        return;
      }
      
      if (user) {
        // User is logged in, redirect to checkout
        trackEvent('service_selected', 'business', packageData.country || 'Unknown', packageData.price || 0);
        trackButtonClick('start_now', 'services_page');
        trackMetaPixelAddToCart(packageData.country || 'Unknown Package', packageData.price || 0);
        navigate(`/checkout?package=${packageId}`);
      } else {
        // User is not logged in, open auth modal
        trackEvent('service_selected_no_user', 'business', packageData.country || 'Unknown');
        trackButtonClick('start_now_redirect_login', 'services_page');
        trackMetaPixelButtonClick('Start Now', 'Redirect to Login');
        openAuthModal('login', () => {
          // After successful login, navigate to checkout
          navigate(`/checkout?package=${packageId}`);
        });
      }
    } catch (error) {
      console.error('Error in handleStartNow:', error);
    }
  };

  const handleProceedToPayment = (packageId) => {
    try {
      const packageData = packages.find(p => p.id === packageId);
      if (!packageData) {
        console.error('Package not found:', packageId);
        return;
      }
      
      if (user) {
        // User is logged in, redirect to checkout
        trackEvent('proceed_to_payment', 'business', packageData.country || 'Unknown', packageData.price || 0);
        trackButtonClick('proceed_to_payment', 'services_page');
        trackMetaPixelAddToCart(packageData.country || 'Unknown Package', packageData.price || 0);
        navigate(`/checkout?package=${packageId}`);
      } else {
        // User is not logged in, open auth modal
        trackEvent('proceed_to_payment_no_user', 'business', packageData.country || 'Unknown');
        trackButtonClick('proceed_to_payment_redirect_login', 'services_page');
        trackMetaPixelButtonClick('Proceed to Payment', 'Redirect to Login');
        openAuthModal('login', () => {
          // After successful login, navigate to checkout
          navigate(`/checkout?package=${packageId}`);
        });
      }
    } catch (error) {
      console.error('Error in handleProceedToPayment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden py-12">
      <Helmet>
        <title>Medical Licensing Services & Pricing - DHA, SCFHS, QCHP, MOHAP | Hiaraise</title>
        <meta name="description" content="Professional medical licensing services for UAE, Qatar, and Saudi Arabia. Transparent pricing: DHA License (PKR 185,250), SCFHS License (PKR 270,250), QCHP License (PKR 197,500), MOHAP License (PKR 189,500). Fast processing with expert guidance." />
        <meta name="keywords" content="medical licensing services, DHA license cost, SCFHS license price, QCHP license fee, MOHAP license pricing, medical license Pakistan, healthcare licensing services, Gulf medical license" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Medical Licensing Services & Pricing - DHA, SCFHS, QCHP, MOHAP" />
        <meta property="og:description" content="Professional medical licensing services with transparent pricing for UAE, Qatar, and Saudi Arabia. Fast processing with expert guidance for Pakistani healthcare professionals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hiaraise.com/pricing" />
        <meta property="og:image" content="https://hiaraise.com/logo.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Medical Licensing Services & Pricing" />
        <meta name="twitter:description" content="Professional medical licensing services with transparent pricing for UAE, Qatar, and Saudi Arabia." />
        <meta name="twitter:image" content="https://hiaraise.com/logo.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hiaraise" />
        <link rel="canonical" href="https://hiaraise.com/pricing" />
        
        {/* Enhanced Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Medical Licensing Services & Pricing | Hiaraise",
          "description": "Comprehensive medical licensing services for UAE, Qatar, and Saudi Arabia. Fast, expert-guided, and AI-powered. See pricing, process, and FAQs.",
          "url": "https://hiaraise.com/pricing",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hiaraise.com/" },
              { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://hiaraise.com/pricing" }
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
          "@type": "Service",
          "serviceType": "Medical Licensing Assistance",
          "provider": {
            "@type": "Organization",
            "name": "Hiaraise AI",
            "url": "https://hiaraise.com/"
          },
          "areaServed": ["UAE", "Qatar", "Saudi Arabia"],
          "description": "Expert-guided, AI-powered medical licensing services for healthcare professionals seeking licenses in the Gulf region."
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What documents are required?",
              "acceptedAnswer": { "@type": "Answer", "text": "Passport, medical degree, professional credentials, and recent photo." }
            },
            {
              "@type": "Question",
              "name": "How long does the process take?",
              "acceptedAnswer": { "@type": "Answer", "text": "Typically 2-6 weeks, depending on the country and case complexity." }
            },
            {
              "@type": "Question",
              "name": "Can I track my application?",
              "acceptedAnswer": { "@type": "Answer", "text": "Yes, you can track your case status in your dashboard at any time." }
            }
          ]
        })}</script>
      </Helmet>
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

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <section className="text-center py-16 mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-6">
            Our Licensing Services
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Choose your target country and let us handle the rest with our comprehensive licensing solutions.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {packages && packages.length > 0 ? packages.map((pkg) => (
            <div key={pkg.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 flex flex-col items-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <h2 className="text-2xl font-bold text-white mb-3">{pkg.country}</h2>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent mb-4">{pkg.displayPrice}</div>
              <p className="mb-6 text-center text-gray-300 leading-relaxed">{pkg.description}</p>
              <h3 className="font-semibold text-gray-200 mb-3">Process Timeline</h3>
              <ol className="list-decimal ml-6 mb-6 text-left text-gray-300 space-y-2">
                {pkg.timeline.map((step, i) => (
                  <li key={i} className="leading-relaxed">{step}</li>
                ))}
              </ol>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => handleStartNow(pkg.id)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                >
                  {user ? 'Start Now' : 'Start Now'}
                </button>
                <button
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => handleProceedToPayment(pkg.id)}
                >
                  Proceed to Payment
                </button>
                <a
                  href={`https://wa.me/923097273740?text=${encodeURIComponent(`Hi Hiaraise team, I have questions about ${pkg.country} medical licensing.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackButtonClick('whatsapp_contact_services_package', 'services_page')}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  aria-label={`Chat with us on WhatsApp about ${pkg.country} licensing`}
                >
                  <FaWhatsapp className="w-5 h-5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-8">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
                <p className="text-gray-300 text-lg">Loading packages...</p>
              </div>
            </div>
          )}
        </section>

        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((f, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300">
                <h3 className="font-semibold text-white mb-3 text-lg">{f.q}</h3>
                <p className="text-gray-300 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      
      {/* WhatsApp Floating Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <a
          href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I have questions about medical licensing services.')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackButtonClick('whatsapp_contact_services_floating', 'services_page')}
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

    </div>
  );
} 