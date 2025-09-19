import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../utils/useAnalytics';

export default function Licenses() {
  useAnalytics();

  useEffect(() => {
    // No-op: analytics handled via useAnalytics
  }, []);

  const licenses = [
    {
      id: 'dha-license-dubai',
      name: 'DHA License',
      country: 'Dubai, UAE',
      flag: '🇦🇪',
      description: 'Dubai Health Authority license for healthcare professionals',
      cost: 'PKR 185,250',
      timeline: '8-13 weeks',
      link: '/licenses/dha-license-dubai',
      features: ['Remote application from Pakistan', 'Online exam', 'Employer pays activation fees']
    },
    {
      id: 'moh-license-uae',
      name: 'MOHAP License',
      country: 'UAE',
      flag: '🇦🇪',
      description: 'UAE Ministry of Health and Prevention license for healthcare professionals',
      cost: 'PKR 189,500',
      timeline: '10-12 weeks',
      link: '/licenses/moh-license-uae',
      features: ['Complete process from Pakistan', 'Assessment at designated centers', 'Professional license issuance']
    },
    {
      id: 'qchp-license-qatar',
      name: 'QCHP License',
      country: 'Qatar',
      flag: '🇶🇦',
      description: 'Qatar Council for Healthcare Practitioners license',
      cost: 'PKR 197,500 - 199,500',
      timeline: '10-12 weeks',
      link: '/licenses/qchp-license-qatar',
      features: ['QCHP portal registration', 'Assessment at centers', 'Professional license']
    },
    {
      id: 'scfhs-license-saudi',
      name: 'SCFHS License',
      country: 'Saudi Arabia',
      flag: '🇸🇦',
      description: 'Saudi Commission for Health Specialties license',
      cost: 'PKR 270,250',
      timeline: '12-16 weeks',
      link: '/licenses/scfhs-license-saudi',
      features: ['Mumaris Plus portal', 'SMLE exam', 'Professional classification']
    }
  ];

  return (
    <>
      <Helmet>
        <title>Medical Licenses - DHA, SCFHS, QCHP, MOHAP | Hiaraise MedLicense AI Portal</title>
        <meta name="description" content="Get medical licenses for UAE, Qatar, and Saudi Arabia. DHA License (PKR 185,250), SCFHS License (PKR 270,250), QCHP License (PKR 197,500), MOHAP License (PKR 189,500). Expert guidance for Pakistani healthcare professionals." />
        <meta name="keywords" content="medical license Pakistan, DHA license Dubai, SCFHS license Saudi Arabia, QCHP license Qatar, MOHAP license UAE, healthcare license cost, medical licensing services, Pakistani doctors Gulf, medical credentialing" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Medical Licenses - DHA, SCFHS, QCHP, MOHAP | Hiaraise" />
        <meta property="og:description" content="Professional medical licensing services for UAE, Qatar, and Saudi Arabia. Competitive pricing and expert guidance for Pakistani healthcare professionals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hiaraise.com/licenses" />
        <meta property="og:image" content="https://hiaraise.com/logo.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Medical Licenses - DHA, SCFHS, QCHP, MOHAP" />
        <meta name="twitter:description" content="Professional medical licensing services for UAE, Qatar, and Saudi Arabia with competitive pricing." />
        <meta name="twitter:image" content="https://hiaraise.com/logo.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hiaraise" />
        <link rel="canonical" href="https://hiaraise.com/licenses" />
        
        {/* Enhanced Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Medical Licenses - DHA, SCFHS, QCHP, MOHAP | Hiaraise",
          "description": "Comprehensive medical licensing services for UAE, Qatar, and Saudi Arabia with competitive pricing and expert guidance.",
          "url": "https://hiaraise.com/licenses",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hiaraise.com/" },
              { "@type": "ListItem", "position": 2, "name": "Medical Licenses", "item": "https://hiaraise.com/licenses" }
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
          "name": "Medical License Options",
          "description": "Available medical licensing services for Pakistani healthcare professionals",
          "numberOfItems": 4,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "item": {
                "@type": "Service",
                "name": "DHA License",
                "description": "Dubai Health Authority license for healthcare professionals",
                "provider": {
                  "@type": "Organization",
                  "name": "Hiaraise AI"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "185250",
                  "priceCurrency": "PKR",
                  "description": "Complete DHA licensing service"
                },
                "areaServed": {
                  "@type": "Country",
                  "name": "United Arab Emirates"
                }
              }
            },
            {
              "@type": "ListItem",
              "position": 2,
              "item": {
                "@type": "Service",
                "name": "SCFHS License",
                "description": "Saudi Commission for Health Specialties license",
                "provider": {
                  "@type": "Organization",
                  "name": "Hiaraise AI"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "270250",
                  "priceCurrency": "PKR",
                  "description": "Complete SCFHS licensing service"
                },
                "areaServed": {
                  "@type": "Country",
                  "name": "Saudi Arabia"
                }
              }
            },
            {
              "@type": "ListItem",
              "position": 3,
              "item": {
                "@type": "Service",
                "name": "QCHP License",
                "description": "Qatar Council for Healthcare Practitioners license",
                "provider": {
                  "@type": "Organization",
                  "name": "Hiaraise AI"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "197500",
                  "priceCurrency": "PKR",
                  "description": "Complete QCHP licensing service"
                },
                "areaServed": {
                  "@type": "Country",
                  "name": "Qatar"
                }
              }
            },
            {
              "@type": "ListItem",
              "position": 4,
              "item": {
                "@type": "Service",
                "name": "MOHAP License",
                "description": "UAE Ministry of Health and Prevention license",
                "provider": {
                  "@type": "Organization",
                  "name": "Hiaraise AI"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "189500",
                  "priceCurrency": "PKR",
                  "description": "Complete MOHAP licensing service"
                },
                "areaServed": {
                  "@type": "Country",
                  "name": "United Arab Emirates"
                }
              }
            }
          ]
        })}</script>
      </Helmet>
      <div className="min-h-screen py-12">
        <section className="text-center py-12 mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-6">
            Medical Licenses
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Choose from our comprehensive range of medical licensing services for Pakistani healthcare professionals
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span>🏥 4 License Types</span>
            <span>🌍 3 Countries</span>
            <span>💰 Competitive Pricing</span>
            <span>⚡ Fast Processing</span>
          </div>
        </section>

        {/* License Categories by Country */}
        <div className="max-w-6xl mx-auto px-4">
          {/* UAE Licenses */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">🇦🇪</span>
              <h2 className="text-2xl font-bold text-white">United Arab Emirates</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {licenses.filter(license => license.country.includes('UAE')).map((license) => (
                <div key={license.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{license.name}</h3>
                      <p className="text-gray-300 text-sm">{license.description}</p>
                    </div>
                    <span className="text-2xl">{license.flag}</span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm">
                      <span className="text-green-400 font-semibold w-20">Cost:</span>
                      <span className="text-gray-300">{license.cost}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-blue-400 font-semibold w-20">Timeline:</span>
                      <span className="text-gray-300">{license.timeline}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {license.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-400 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Link
                      to={license.link}
                      className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                    >
                      Learn More
                    </Link>
                    <Link
                      to="/pricing"
                      className="block w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                    >
                      Get License
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Qatar Licenses */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">🇶🇦</span>
              <h2 className="text-2xl font-bold text-white">Qatar</h2>
            </div>
            <div className="grid md:grid-cols-1 gap-6 max-w-2xl">
              {licenses.filter(license => license.country === 'Qatar').map((license) => (
                <div key={license.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{license.name}</h3>
                      <p className="text-gray-300 text-sm">{license.description}</p>
                    </div>
                    <span className="text-2xl">{license.flag}</span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm">
                      <span className="text-green-400 font-semibold w-20">Cost:</span>
                      <span className="text-gray-300">{license.cost}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-blue-400 font-semibold w-20">Timeline:</span>
                      <span className="text-gray-300">{license.timeline}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {license.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-400 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Link
                      to={license.link}
                      className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                    >
                      Learn More
                    </Link>
                    <Link
                      to="/pricing"
                      className="block w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                    >
                      Get License
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Saudi Arabia Licenses */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">🇸🇦</span>
              <h2 className="text-2xl font-bold text-white">Saudi Arabia</h2>
            </div>
            <div className="grid md:grid-cols-1 gap-6 max-w-2xl">
              {licenses.filter(license => license.country === 'Saudi Arabia').map((license) => (
                <div key={license.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{license.name}</h3>
                      <p className="text-gray-300 text-sm">{license.description}</p>
                    </div>
                    <span className="text-2xl">{license.flag}</span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm">
                      <span className="text-green-400 font-semibold w-20">Cost:</span>
                      <span className="text-gray-300">{license.cost}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-blue-400 font-semibold w-20">Timeline:</span>
                      <span className="text-gray-300">{license.timeline}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {license.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-400 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Link
                      to={license.link}
                      className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                    >
                      Learn More
                    </Link>
                    <Link
                      to="/pricing"
                      className="block w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                    >
                      Get License
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your License Journey?</h2>
              <p className="text-lg text-gray-300 mb-6">
                Get expert guidance and support throughout your licensing process. Our team helps Pakistani healthcare professionals achieve their career goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/start-license"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Link>
                <Link
                  to="/contact"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Contact Us
                </Link>
              </div>
            </div>
        </section>
        </div>
      </div>
    </>
  );
}


