import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiFileText, FiSettings, FiUsers, FiLock, FiCheckCircle, FiXCircle, FiInfo, FiMail, FiGlobe, FiClock } from 'react-icons/fi';

export default function Cookies() {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | Hiaraise MedLicense</title>
        <meta name="description" content="Comprehensive cookie policy for Hiaraise MedLicense platform. Learn about how we use cookies and your choices." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Cookie Policy | Hiaraise MedLicense",
          "description": "Comprehensive cookie policy for Hiaraise MedLicense platform.",
          "url": "https://app.hiaraise.com/cookies",
          "publisher": {
            "@type": "Organization",
            "name": "Hiaraise AI",
            "url": "https://app.hiaraise.com/"
          }
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        {/* Navigation */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors duration-300 mb-8"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6">
              <FiSettings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              How we use cookies and similar technologies
            </p>
            <div className="flex items-center justify-center space-x-4 mt-6 text-sm text-gray-400">
              <span>Last updated: {new Date().toLocaleDateString()}</span>
              <span>•</span>
              <span>Version 1.0</span>
            </div>
          </div>

          {/* Policy Content */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12">
            <div className="prose prose-invert prose-lg max-w-none">
              
              {/* Introduction */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiSettings className="w-6 h-6 mr-3 text-orange-400" />
                  1. What Are Cookies?
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <p>
                    Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, and personalizing content.
                  </p>
                  <p>
                    This Cookie Policy explains how Hiaraise MedLicense uses cookies and similar technologies, and your choices regarding their use.
                  </p>
                </div>
              </section>

              {/* Types of Cookies */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiSettings className="w-6 h-6 mr-3 text-cyan-400" />
                  2. Types of Cookies We Use
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.1 Essential Cookies</h3>
                    <p className="mb-4">These cookies are necessary for the website to function properly:</p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Authentication and security cookies
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Session management cookies
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Load balancing cookies
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Form submission cookies
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.2 Performance Cookies</h3>
                    <p className="mb-4">These cookies help us understand how visitors interact with our website:</p>
                    <ul className="space-y-2 ml-6">
                      <li>• Analytics cookies (Google Analytics, etc.)</li>
                      <li>• Error tracking cookies</li>
                      <li>• Performance monitoring cookies</li>
                      <li>• User behavior analysis cookies</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.3 Functional Cookies</h3>
                    <p className="mb-4">These cookies enable enhanced functionality and personalization:</p>
                    <ul className="space-y-2 ml-6">
                      <li>• Language preference cookies</li>
                      <li>• User interface customization cookies</li>
                      <li>• Remember-me functionality cookies</li>
                      <li>• Chat widget cookies</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.4 Marketing Cookies</h3>
                    <p className="mb-4">These cookies are used for advertising and marketing purposes:</p>
                    <ul className="space-y-2 ml-6">
                      <li>• Social media integration cookies</li>
                      <li>• Advertising platform cookies</li>
                      <li>• Retargeting cookies</li>
                      <li>• Conversion tracking cookies</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Third-Party Cookies */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiGlobe className="w-6 h-6 mr-3 text-blue-400" />
                  3. Third-Party Cookies
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <p>
                    We may use third-party services that place cookies on your device. These services include:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li>• Google Analytics for website analytics</li>
                    <li>• Facebook Pixel for advertising tracking</li>
                    <li>• Stripe for payment processing</li>
                    <li>• Intercom for customer support</li>
                    <li>• Social media platforms for sharing features</li>
                  </ul>
                  <p>
                    These third-party services have their own privacy policies and cookie practices. We encourage you to review their policies.
                  </p>
                </div>
              </section>

              {/* Cookie Management */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiSettings className="w-6 h-6 mr-3 text-green-400" />
                  4. Managing Your Cookie Preferences
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.1 Browser Settings</h3>
                    <p>
                      You can control and manage cookies through your browser settings. Most browsers allow you to:
                    </p>
                    <ul className="space-y-2 ml-6 mt-4">
                      <li>• View and delete existing cookies</li>
                      <li>• Block cookies from specific websites</li>
                      <li>• Block all cookies</li>
                      <li>• Set preferences for different types of cookies</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.2 Cookie Consent</h3>
                    <p>
                      When you first visit our website, you'll see a cookie consent banner that allows you to:
                    </p>
                    <ul className="space-y-2 ml-6 mt-4">
                      <li>• Accept all cookies</li>
                      <li>• Reject non-essential cookies</li>
                      <li>• Customize your cookie preferences</li>
                      <li>• Learn more about our cookie practices</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.3 Opt-Out Options</h3>
                    <p>
                      You can opt out of certain types of cookies:
                    </p>
                    <ul className="space-y-2 ml-6 mt-4">
                      <li>• Analytics cookies through browser settings</li>
                      <li>• Marketing cookies through our consent manager</li>
                      <li>• Third-party cookies through their respective opt-out mechanisms</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Impact of Disabling Cookies */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiInfo className="w-6 h-6 mr-3 text-yellow-400" />
                  5. Impact of Disabling Cookies
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-3">5.1 Essential Cookies</h3>
                    <p className="mb-4">If you disable essential cookies, you may experience:</p>
                    <ul className="space-y-2 ml-6">
                      <li>• Inability to log in to your account</li>
                      <li>• Loss of session data and preferences</li>
                      <li>• Security vulnerabilities</li>
                      <li>• Reduced functionality of core features</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">5.2 Non-Essential Cookies</h3>
                    <p className="mb-4">Disabling non-essential cookies may result in:</p>
                    <ul className="space-y-2 ml-6">
                      <li>• Less personalized experience</li>
                      <li>• Repeated requests for the same information</li>
                      <li>• Inability to use certain features</li>
                      <li>• Less relevant content and advertisements</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Cookie Retention */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiClock className="w-6 h-6 mr-3 text-cyan-400" />
                  6. Cookie Retention Periods
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">6.1 Session Cookies</h3>
                    <p>
                      Session cookies are temporary and are deleted when you close your browser or end your session.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">6.2 Persistent Cookies</h3>
                    <p>
                      Persistent cookies remain on your device for a set period, typically:
                    </p>
                    <ul className="space-y-2 ml-6 mt-4">
                      <li>• Authentication cookies: 30 days</li>
                      <li>• Preference cookies: 1 year</li>
                      <li>• Analytics cookies: 2 years</li>
                      <li>• Marketing cookies: 90 days</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Updates to Policy */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiFileText className="w-6 h-6 mr-3 text-cyan-400" />
                  7. Updates to This Policy
                </h2>
                
                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-lg p-6">
                  <p className="text-gray-300">
                    We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiMail className="w-6 h-6 mr-3 text-cyan-400" />
                  8. Contact Us
                </h2>
                
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
                  <p className="text-gray-300 mb-4">
                    If you have questions about our use of cookies or this Cookie Policy, please contact us:
                  </p>
                  <div className="space-y-3 text-gray-300">
                    <p><strong>Email:</strong> privacy@hiaraise.com</p>
                    <p><strong>Support:</strong> support@hiaraise.com</p>
                    <p><strong>Response Time:</strong> Within 48 hours</p>
                  </div>
                </div>
              </section>

            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link 
              to="/privacy" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 mr-4"
            >
              View Privacy Policy
              <FiArrowLeft className="w-4 h-4 ml-2 transform rotate-180" />
            </Link>
            <Link 
              to="/terms" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
            >
              View Terms and Conditions
              <FiArrowLeft className="w-4 h-4 ml-2 transform rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 