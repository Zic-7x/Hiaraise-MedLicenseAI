import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { packages } from '../config/packages';
import ChatWidget from '../components/ChatWidget';
import { trackMetaPixelViewContent, trackMetaPixelAddToCart, trackMetaPixelButtonClick } from '../utils/metaPixel';
import { trackEvent, trackButtonClick, trackPageView, trackCountrySelection } from '../utils/analytics';
import { useAnalytics } from '../utils/useAnalytics';

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
    trackPageView('/services');
    trackEvent('page_viewed', 'engagement', 'services_page');
    trackMetaPixelViewContent('Services Page');

    return () => subscription.unsubscribe();
  }, []);

  const handleStartNow = (packageId) => {
    const packageData = packages.find(p => p.id === packageId);
    
    if (user) {
      // User is logged in, redirect to checkout
      trackEvent('service_selected', 'business', packageData?.country || 'Unknown', packageData?.price || 0);
      trackButtonClick('start_now', 'services_page');
      trackMetaPixelAddToCart(packageData?.country || 'Unknown Package', packageData?.price || 0);
      navigate(`/checkout?package=${packageId}`);
    } else {
      // User is not logged in, redirect to register
      trackEvent('service_selected_no_user', 'business', packageData?.country || 'Unknown');
      trackButtonClick('start_now_redirect_register', 'services_page');
      trackMetaPixelButtonClick('Start Now', 'Redirect to Register');
      navigate('/register');
    }
  };

  const handleProceedToPayment = (packageId) => {
    const packageData = packages.find(p => p.id === packageId);
    trackEvent('proceed_to_payment', 'business', packageData?.country || 'Unknown', packageData?.price || 0);
    trackButtonClick('proceed_to_payment', 'services_page');
    trackMetaPixelAddToCart(packageData?.country || 'Unknown Package', packageData?.price || 0);
    navigate(`/checkout?package=${packageId}`);
  };

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
          {packages.map((pkg) => (
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
              </div>
            </div>
          ))}
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
      <ChatWidget />
    </div>
  );
} 