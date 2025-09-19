import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiFileText, FiUsers, FiCreditCard, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions | Hiaraise MedLicense AI Portal</title>
        <meta name="description" content="Comprehensive terms and conditions for Hiaraise MedLicense platform. Learn about our services, user responsibilities, data protection, and legal terms for medical licensing services." />
        <meta name="keywords" content="terms and conditions, medical licensing terms, Hiaraise terms, medical license agreement, healthcare licensing terms, DHA license terms, SCFHS license terms, QCHP license terms" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Terms and Conditions | Hiaraise MedLicense AI Portal" />
        <meta property="og:description" content="Comprehensive terms and conditions for Hiaraise MedLicense platform. Learn about our services, user responsibilities, and legal terms." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hiaraise.com/terms" />
        <meta property="og:image" content="https://hiaraise.com/logo.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms and Conditions | Hiaraise MedLicense" />
        <meta name="twitter:description" content="Comprehensive terms and conditions for Hiaraise MedLicense platform." />
        <meta name="twitter:image" content="https://hiaraise.com/logo.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hiaraise" />
        <link rel="canonical" href="https://hiaraise.com/terms" />
        
        {/* Enhanced Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Terms and Conditions | Hiaraise MedLicense AI Portal",
          "description": "Comprehensive terms and conditions for Hiaraise MedLicense platform. Learn about our services, user responsibilities, data protection, and legal terms.",
          "url": "https://hiaraise.com/terms",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hiaraise.com/" },
              { "@type": "ListItem", "position": 2, "name": "Terms and Conditions", "item": "https://hiaraise.com/terms" }
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-6">
              <FiFileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms and Conditions
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive legal terms for Hiaraise MedLicense platform
            </p>
            <div className="flex items-center justify-center space-x-4 mt-6 text-sm text-gray-400">
              <span>Last updated: {new Date().toLocaleDateString()}</span>
              <span>•</span>
              <span>Version 1.0</span>
            </div>
          </div>

          {/* Terms Content */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12">
            <div className="prose prose-invert prose-lg max-w-none">
              
              {/* Introduction */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiShield className="w-6 h-6 mr-3 text-cyan-400" />
                  1. Introduction and Acceptance
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">1.1 Platform Overview</h3>
                    <p>
                      Hiaraise MedLicense is an online platform that assists international medical professionals in navigating the process of obtaining medical licenses in new countries. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">1.2 Acceptance of Terms</h3>
                    <p>
                      Your use of this platform constitutes acceptance of these terms. If you do not agree with any part of these terms, you must not use our services.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">1.3 Eligibility</h3>
                    <p>
                      Users must be licensed medical professionals or students pursuing medical licensure. You warrant that all information provided is accurate and complete.
                    </p>
                  </div>
                </div>
              </section>

              {/* Service Description */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiUsers className="w-6 h-6 mr-3 text-cyan-400" />
                  2. Service Description
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.1 Platform Services</h3>
                    <p className="mb-4">Hiaraise MedLicense provides:</p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Information and guidance on medical licensing processes
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Document submission and tracking services
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Case management tools
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Payment processing for licensing-related fees
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Verification and authentication support
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.2 Third-Party Services</h3>
                    <p>
                      We may facilitate connections with third-party credentialing services, verification agencies, and regulatory bodies. We are not responsible for the quality or outcome of these third-party services.
                    </p>
                  </div>
                </div>
              </section>

              {/* User Responsibilities */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiUsers className="w-6 h-6 mr-3 text-cyan-400" />
                  3. User Responsibilities
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">3.1 Account Management</h3>
                    <p>
                      Users must maintain the confidentiality of their account credentials and notify us immediately of any unauthorized access. Users are responsible for all activities under their account.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">3.2 Information Accuracy</h3>
                    <p>
                      You warrant that all medical credentials, professional information, and documentation provided is accurate, complete, and legally obtained. False information may result in immediate account termination.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">3.3 Compliance Requirements</h3>
                    <p>
                      Users must comply with all applicable laws and regulations in both their home country and destination country regarding medical practice and licensing.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Protection */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiShield className="w-6 h-6 mr-3 text-cyan-400" />
                  4. Data Protection and Privacy
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.1 Data Security</h3>
                    <p>
                      We implement robust security measures to protect your personal and professional data in accordance with international data protection standards, including GDPR compliance where applicable.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.2 Data Processing</h3>
                    <p>
                      Your health-related and professional data is processed solely for the purpose of facilitating medical licensing procedures. We maintain strict confidentiality and limit access to authorized personnel only.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.3 Data Retention</h3>
                    <p>
                      Personal data is retained only as long as necessary to fulfill the stated purposes or as required by applicable regulations.
                    </p>
                  </div>
                </div>
              </section>

              {/* Medical Disclaimers */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiAlertTriangle className="w-6 h-6 mr-3 text-yellow-400" />
                  5. Medical and Professional Disclaimers
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">5.1 Professional Advice Limitation</h3>
                    <p>
                      Hiaraise MedLicense provides information and administrative support only. We do not provide medical advice, legal counsel, or guarantee licensing outcomes. All professional decisions remain the responsibility of the user.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">5.2 No Guarantee of Approval</h3>
                    <p>
                      We cannot guarantee that any medical license application will be approved. Licensing decisions rest solely with the relevant regulatory authorities.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">5.3 Information Accuracy</h3>
                    <p>
                      While we strive to provide accurate information about licensing requirements, regulations may change without notice. Users should verify all information with official sources.
                    </p>
                  </div>
                </div>
              </section>

              {/* Payment Terms */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiCreditCard className="w-6 h-6 mr-3 text-cyan-400" />
                  7. Payment Terms
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">7.1 Service Fees</h3>
                    <p>
                      Fees for services are clearly displayed and must be paid in advance. All payments are processed securely through approved payment processors.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">7.2 Third-Party Costs</h3>
                    <p>
                      Users are responsible for all third-party fees, including but not limited to government licensing fees, verification costs, and examination fees.
                    </p>
                  </div>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiAlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                  8. Limitation of Liability
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">8.1 Service Limitations</h3>
                    <p className="mb-4">To the maximum extent permitted by law, Hiaraise MedLicense shall not be liable for:</p>
                    <ul className="space-y-2 ml-6">
                      <li>• Delays in licensing processes caused by third parties</li>
                      <li>• Rejection of license applications</li>
                      <li>• Indirect, consequential, or punitive damages</li>
                      <li>• Loss of professional opportunities or income</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">8.2 Maximum Liability</h3>
                    <p>
                      Our total liability shall not exceed the amount paid by the user for the specific service giving rise to the claim.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiUsers className="w-6 h-6 mr-3 text-cyan-400" />
                  Contact Information
                </h2>
                
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
                  <p className="text-gray-300 mb-4">
                    For questions about these Terms and Conditions, please contact us:
                  </p>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>Email:</strong> legal@hiaraise.com</p>
                    <p><strong>Support:</strong> support@hiaraise.com</p>
                    <p><strong>Response Time:</strong> Within 48 hours</p>
                  </div>
                </div>
              </section>

              {/* Policy Updates */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiFileText className="w-6 h-6 mr-3 text-cyan-400" />
                  Updates and Modifications
                </h2>
                
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
                  <p className="text-gray-300">
                    We reserve the right to modify these terms at any time. Users will be notified of significant changes, and continued use constitutes acceptance of updated terms. The date of the last update is shown at the top of this page.
                  </p>
                </div>
              </section>

            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link 
              to="/refund-policy" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
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