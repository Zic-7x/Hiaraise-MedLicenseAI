import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAnalytics } from '../utils/useAnalytics';
import { Link } from 'react-router-dom';

export default function Tools() {
  useAnalytics();

  useEffect(() => {
    // No-op
  }, []);

  return (
    <>
      <Helmet>
        <title>Medical Licensing Tools - Eligibility Checker, Pricing Calculator | Hiaraise</title>
        <meta name="description" content="Essential tools for medical licensing: Eligibility Checker, Pricing Calculator, License Guide, and Support. Get instant eligibility results and transparent pricing for DHA, SCFHS, QCHP licenses." />
        <meta name="keywords" content="medical licensing tools, eligibility checker, pricing calculator, DHA license tool, SCFHS eligibility, QCHP calculator, medical license support, healthcare licensing assistance" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Medical Licensing Tools - Eligibility Checker & Pricing | Hiaraise" />
        <meta property="og:description" content="Essential tools for medical licensing: Eligibility Checker, Pricing Calculator, License Guide, and Support for Pakistani healthcare professionals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hiaraise.com/tools" />
        <meta property="og:image" content="https://hiaraise.com/logo.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Medical Licensing Tools - Eligibility Checker & Pricing" />
        <meta name="twitter:description" content="Essential tools for medical licensing: Eligibility Checker, Pricing Calculator, License Guide, and Support." />
        <meta name="twitter:image" content="https://hiaraise.com/logo.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hiaraise" />
        <link rel="canonical" href="https://hiaraise.com/tools" />
        
        {/* Enhanced Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Medical Licensing Tools - Eligibility Checker & Pricing | Hiaraise",
          "description": "Essential tools for medical licensing: Eligibility Checker, Pricing Calculator, License Guide, and Support for Pakistani healthcare professionals.",
          "url": "https://hiaraise.com/tools",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hiaraise.com/" },
              { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://hiaraise.com/tools" }
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
          "@type": "ItemList",
          "name": "Medical Licensing Tools",
          "description": "Essential tools for medical licensing process",
          "numberOfItems": 4,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "item": {
                "@type": "WebApplication",
                "name": "Eligibility Checker",
                "description": "Check if you qualify for your target medical license",
                "url": "https://hiaraise.com/eligibility-check",
                "applicationCategory": "Medical Licensing Tool",
                "operatingSystem": "Web Browser"
              }
            },
            {
              "@type": "ListItem",
              "position": 2,
              "item": {
                "@type": "WebApplication",
                "name": "Why to Get License",
                "description": "Understand benefits and steps to begin your licensing journey",
                "url": "https://hiaraise.com/start-license",
                "applicationCategory": "Educational Tool",
                "operatingSystem": "Web Browser"
              }
            },
            {
              "@type": "ListItem",
              "position": 3,
              "item": {
                "@type": "WebApplication",
                "name": "Pricing Calculator",
                "description": "Transparent pricing plans for every licensing stage",
                "url": "https://hiaraise.com/pricing",
                "applicationCategory": "Pricing Tool",
                "operatingSystem": "Web Browser"
              }
            },
            {
              "@type": "ListItem",
              "position": 4,
              "item": {
                "@type": "WebApplication",
                "name": "Support Center",
                "description": "Get help from our expert team",
                "url": "https://hiaraise.com/support-tickets",
                "applicationCategory": "Support Tool",
                "operatingSystem": "Web Browser"
              }
            }
          ]
        })}</script>
      </Helmet>
      <div className="min-h-screen py-12">
        <section className="text-center py-12 mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">Tools</h1>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">Quick access to our most helpful tools.</p>
        </section>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/eligibility-check" className="block bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 hover:bg-white/15 transition">
            <div className="text-xl font-semibold text-white mb-2">Eligibility Checker</div>
            <div className="text-gray-300">See if you qualify for your target license.</div>
          </Link>
          <Link to="/start-license" className="block bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 hover:bg-white/15 transition">
            <div className="text-xl font-semibold text-white mb-2">Why to Get License</div>
            <div className="text-gray-300">Understand benefits and steps to begin.</div>
          </Link>
          <Link to="/pricing" className="block bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 hover:bg-white/15 transition">
            <div className="text-xl font-semibold text-white mb-2">Pricing</div>
            <div className="text-gray-300">Transparent plans for every stage.</div>
          </Link>
          <Link to="/support-tickets" className="block bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 hover:bg-white/15 transition">
            <div className="text-xl font-semibold text-white mb-2">Support</div>
            <div className="text-gray-300">Get help from our team.</div>
          </Link>
        </div>
      </div>
    </>
  );
}


