import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiFileText, FiUsers, FiLock, FiCheckCircle, FiAlertTriangle, FiMail, FiGlobe, FiClock } from 'react-icons/fi';

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Hiaraise MedLicense AI Portal</title>
        <meta name="description" content="Comprehensive privacy policy for Hiaraise MedLicense platform. Learn about data protection, GDPR compliance, and how we handle your information for medical licensing services." />
        <meta name="keywords" content="privacy policy, data protection, GDPR compliance, medical licensing privacy, healthcare data privacy, Hiaraise privacy, medical license data security, personal information protection" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Privacy Policy | Hiaraise MedLicense AI Portal" />
        <meta property="og:description" content="Comprehensive privacy policy for Hiaraise MedLicense platform. Learn about data protection, GDPR compliance, and how we handle your information." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hiaraise.com/privacy" />
        <meta property="og:image" content="https://hiaraise.com/logo.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | Hiaraise MedLicense" />
        <meta name="twitter:description" content="Comprehensive privacy policy for Hiaraise MedLicense platform." />
        <meta name="twitter:image" content="https://hiaraise.com/logo.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hiaraise" />
        <link rel="canonical" href="https://hiaraise.com/privacy" />
        
        {/* Enhanced Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy | Hiaraise MedLicense AI Portal",
          "description": "Comprehensive privacy policy for Hiaraise MedLicense platform. Learn about data protection, GDPR compliance, and how we handle your information.",
          "url": "https://hiaraise.com/privacy",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hiaraise.com/" },
              { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": "https://hiaraise.com/privacy" }
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6">
              <FiLock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              How we protect and handle your personal information
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
                  <FiShield className="w-6 h-6 mr-3 text-cyan-400" />
                  1. Introduction
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <p>
                    Hiaraise MedLicense ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our medical licensing platform.
                  </p>
                  <p>
                    By using our services, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use our services.
                  </p>
                </div>
              </section>

              {/* Information We Collect */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiUsers className="w-6 h-6 mr-3 text-cyan-400" />
                  2. Information We Collect
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.1 Personal Information</h3>
                    <p className="mb-4">We collect the following types of personal information:</p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Name, email address, phone number, and contact details
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Professional credentials and medical qualifications
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Identity documents (passport, national ID, etc.)
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Educational certificates and transcripts
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Professional experience and employment history
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.2 Technical Information</h3>
                    <p className="mb-4">We automatically collect certain technical information:</p>
                    <ul className="space-y-2 ml-6">
                      <li>• IP address and device information</li>
                      <li>• Browser type and version</li>
                      <li>• Operating system</li>
                      <li>• Usage patterns and analytics data</li>
                      <li>• Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Information */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiFileText className="w-6 h-6 mr-3 text-cyan-400" />
                  3. How We Use Your Information
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">3.1 Primary Purposes</h3>
                    <p className="mb-4">We use your information for the following purposes:</p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Processing and managing your medical license applications
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Verifying your credentials and qualifications
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Communicating with regulatory authorities on your behalf
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Providing customer support and service updates
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Processing payments and managing billing
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">3.2 Secondary Purposes</h3>
                    <p className="mb-4">We may also use your information for:</p>
                    <ul className="space-y-2 ml-6">
                      <li>• Improving our services and platform functionality</li>
                      <li>• Conducting research and analytics</li>
                      <li>• Complying with legal obligations</li>
                      <li>• Preventing fraud and ensuring security</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Information Sharing */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiGlobe className="w-6 h-6 mr-3 text-cyan-400" />
                  4. Information Sharing and Disclosure
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.1 Third-Party Services</h3>
                    <p>
                      We may share your information with trusted third-party service providers who assist us in operating our platform, including:
                    </p>
                    <ul className="space-y-2 ml-6 mt-4">
                      <li>• Payment processors for secure transactions</li>
                      <li>• Cloud storage providers for data hosting</li>
                      <li>• Regulatory authorities for license applications</li>
                      <li>• Verification agencies for credential validation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.2 Legal Requirements</h3>
                    <p>
                      We may disclose your information when required by law, court order, or government request, or to protect our rights, property, or safety.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.3 Business Transfers</h3>
                    <p>
                      In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Security */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiLock className="w-6 h-6 mr-3 text-green-400" />
                  5. Data Security
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <p>
                    We implement comprehensive security measures to protect your personal information, including:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Encryption of data in transit and at rest
                    </li>
                    <li className="flex items-start">
                      <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Secure access controls and authentication
                    </li>
                    <li className="flex items-start">
                      <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Regular security audits and monitoring
                    </li>
                    <li className="flex items-start">
                      <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Employee training on data protection
                    </li>
                    <li className="flex items-start">
                      <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Compliance with industry security standards
                    </li>
                  </ul>
                </div>
              </section>

              {/* Your Rights */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiUsers className="w-6 h-6 mr-3 text-cyan-400" />
                  6. Your Rights and Choices
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">6.1 Access and Control</h3>
                    <p className="mb-4">You have the right to:</p>
                    <ul className="space-y-2 ml-6">
                      <li>• Access and review your personal information</li>
                      <li>• Request correction of inaccurate data</li>
                      <li>• Request deletion of your data (subject to legal requirements)</li>
                      <li>• Object to certain processing activities</li>
                      <li>• Request data portability</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">6.2 Communication Preferences</h3>
                    <p>
                      You can control your communication preferences and opt out of marketing communications at any time through your account settings or by contacting us.
                    </p>
                  </div>
                </div>
              </section>

              {/* GDPR Compliance */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiShield className="w-6 h-6 mr-3 text-blue-400" />
                  7. GDPR Compliance
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <p>
                    For users in the European Union, we comply with the General Data Protection Regulation (GDPR). This includes:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li>• Lawful basis for data processing</li>
                    <li>• Data minimization and purpose limitation</li>
                    <li>• Right to be forgotten</li>
                    <li>• Data protection impact assessments</li>
                    <li>• Breach notification requirements</li>
                  </ul>
                </div>
              </section>

              {/* Data Retention */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiClock className="w-6 h-6 mr-3 text-cyan-400" />
                  8. Data Retention
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <p>
                    We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. The retention period varies based on the type of data and legal requirements.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiMail className="w-6 h-6 mr-3 text-cyan-400" />
                  9. Contact Us
                </h2>
                
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
                  <p className="text-gray-300 mb-4">
                    If you have questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="space-y-3 text-gray-300">
                    <p><strong>Email:</strong> privacy@hiaraise.com</p>
                    <p><strong>Data Protection Officer:</strong> dpo@hiaraise.com</p>
                    <p><strong>Support:</strong> support@hiaraise.com</p>
                    <p><strong>Response Time:</strong> Within 48 hours</p>
                  </div>
                </div>
              </section>

              {/* Policy Updates */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiFileText className="w-6 h-6 mr-3 text-cyan-400" />
                  10. Updates to This Policy
                </h2>
                
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
                  <p className="text-gray-300">
                    We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.
                  </p>
                </div>
              </section>

            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link 
              to="/terms" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 mr-4"
            >
              View Terms and Conditions
              <FiArrowLeft className="w-4 h-4 ml-2 transform rotate-180" />
            </Link>
            <Link 
              to="/refund-policy" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
            >
              View Refund Policy
              <FiArrowLeft className="w-4 h-4 ml-2 transform rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 
