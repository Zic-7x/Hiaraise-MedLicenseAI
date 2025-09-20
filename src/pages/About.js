import { useEffect } from 'react';
import { trackMetaPixelViewContent } from '../utils/metaPixel';
import { trackEvent, trackPageView, trackButtonClick } from '../utils/analytics';
import { useAnalytics } from '../utils/useAnalytics';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

const team = [
  { name: 'Dr. Mehreen Munawwar', role: 'Founder & CEO', img: '', bio: 'Medical licensing expert with 10+ years experience.' },
  { name: 'Muhammed Ibrahim', role: 'Co-Founder & CTO', img: '', bio: 'Tech lead and secure systems specialist.' },
  { name: 'Dr. Ayesha Khan', role: 'Advisor', img: '', bio: 'Practicing physician and Gulf licensing mentor.' },
];

const partners = [
  'Saudi Commission for Health Specialties',
  'Dubai Health Authority',
  'Ministry of Health and Prevention',
  'Ministry of Health and Prevention (UAE)',
  'Department of Health Abu Dhabi',
  'Qatar Council for Healthcare Practitioners',
  'Ministry of Public Health',
  'Department of Healthcare Professions',
  'PakMed Consultants',
  'Gulf Health Board',
  'Meezan Bank',
  'VISA',
];

const stats = [
  { label: 'Licenses Processed', value: '1,200+' },
  { label: 'Countries Served', value: '3' },
  { label: 'Success Rate', value: '98%' },
  { label: 'Years Experience', value: '10+' },
];

export default function About() {
  // Enable automatic page tracking
  useAnalytics();
  
  useEffect(() => {
    // Track page view
    trackPageView('/about');
    trackEvent('page_viewed', 'engagement', 'about_page');
    trackMetaPixelViewContent('About Page');
  }, []);

  return (
    <>
      <Helmet>
        <title>About Hiaraise | Medical Licensing Platform</title>
        <meta name="description" content="Learn about Hiaraise, our mission, and how we help medical professionals achieve licensing success globally with AI-powered tools and expert support." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "About Hiaraise | Medical Licensing Platform",
          "description": "Learn about Hiaraise, our mission, and how we help medical professionals achieve licensing success globally with AI-powered tools and expert support.",
          "url": "https://hiaraise.com/about",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hiaraise.com/" },
              { "@type": "ListItem", "position": 2, "name": "About", "item": "https://hiaraise.com/about" }
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
          "@type": "Organization",
          "name": "Hiaraise AI",
          "url": "https://hiaraise.com/",
          "description": "AI-powered medical licensing platform for healthcare professionals",
          "foundingDate": "2024",
          "numberOfEmployees": "10-50",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "Pakistan"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "support@hiaraise.com"
          }
        })}</script>
      </Helmet>
      <div className="min-h-screen py-12">
        <section className="text-center py-12 mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">About Us</h1>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">We are dedicated to helping medical professionals achieve their dreams of working in the Gulf. Our mission is to make licensing simple, secure, and stress-free.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-6 text-center">Our Team</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 max-w-xs mx-auto flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-3 flex items-center justify-center text-2xl font-bold text-white">
                  {member.img ? <img src={member.img} alt={member.name} className="rounded-full w-20 h-20 object-cover" /> : member.name[0]}
                </div>
                <div className="font-semibold text-white">{member.name}</div>
                <div className="text-gray-300 text-sm mb-2">{member.role}</div>
                <div className="text-gray-400 text-sm text-center">{member.bio}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-6 text-center">Our Success</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((s, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 text-center">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">{s.value}</div>
                <div className="text-white font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-6 text-center">Our Partners</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {partners.map((p, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 text-gray-200 rounded-xl px-4 py-2 font-semibold shadow-md">{p}</div>
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
          href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I would like to learn more about your company.')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackButtonClick('whatsapp_contact_about_floating', 'about_page')}
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