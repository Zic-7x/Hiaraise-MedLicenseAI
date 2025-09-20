import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiFileText, FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiAlertTriangle, FiMail } from 'react-icons/fi';

export default function RefundPolicy() {
  return (
    <>
      <Helmet>
        <title>Refund Policy | Hiaraise MedLicense</title>
        <meta name="description" content="Comprehensive refund policy for Hiaraise MedLicense platform. Learn about eligible refunds, processing times, and refund procedures." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Refund Policy | Hiaraise MedLicense",
          "description": "Comprehensive refund policy for Hiaraise MedLicense platform.",
          "url": "https://hiaraise.com/refund-policy",
          "publisher": {
            "@type": "Organization",
            "name": "Hiaraise AI",
            "url": "https://hiaraise.com/"
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6">
              <FiDollarSign className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Refund Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Clear and fair refund terms for Hiaraise MedLicense services
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
              
              {/* General Principles */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiShield className="w-6 h-6 mr-3 text-cyan-400" />
                  1. General Refund Principles
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">1.1 Service-Based Refunds</h3>
                    <p>
                      As a service-based platform facilitating medical licensing processes, refunds are subject to specific conditions based on the nature and stage of service delivery.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">1.2 No Guarantee Acknowledgment</h3>
                    <p>
                      Users acknowledge that medical licensing outcomes depend on regulatory authorities and that service fees are for professional assistance, not outcome guarantees.
                    </p>
                  </div>
                </div>
              </section>

              {/* Eligible Refunds */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiCheckCircle className="w-6 h-6 mr-3 text-green-400" />
                  2. Eligible Refund Circumstances
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.1 Service Non-Delivery</h3>
                    <p className="mb-4">Full refunds are available if:</p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        We fail to provide contracted services within specified timeframes
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Platform technical issues prevent access for more than 72 consecutive hours
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        We cancel services due to our inability to fulfill obligations
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.2 Documentation Errors</h3>
                    <p>
                      Partial refunds may be available if we provide incorrect guidance that directly results in application rejection due to our error.
                    </p>
                  </div>
                </div>
              </section>

              {/* Non-Refundable Services */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiXCircle className="w-6 h-6 mr-3 text-red-400" />
                  3. Non-Refundable Services
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">3.1 Completed Services</h3>
                    <p className="mb-4">No refunds for:</p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <FiXCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        Document review and verification services already completed
                      </li>
                      <li className="flex items-start">
                        <FiXCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        Information and guidance provided and accessed
                      </li>
                      <li className="flex items-start">
                        <FiXCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        Third-party fees paid on behalf of users
                      </li>
                      <li className="flex items-start">
                        <FiXCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        Processing fees after application submission
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">3.2 Application Rejections</h3>
                    <p className="mb-4">Refunds are not available when applications are rejected due to:</p>
                    <ul className="space-y-2 ml-6">
                      <li>• Incomplete or inaccurate user-provided information</li>
                      <li>• Failure to meet regulatory requirements</li>
                      <li>• Changes in licensing regulations</li>
                      <li>• User's failure to complete required steps</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Refund Process */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiClock className="w-6 h-6 mr-3 text-cyan-400" />
                  4. Refund Request Process
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.1 Request Timeline</h3>
                    <p>
                      Refund requests must be submitted within 7 days of the service issue or within 3 days of application outcome notification.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.2 Required Documentation</h3>
                    <p className="mb-4">Requests must include:</p>
                    <ul className="space-y-2 ml-6">
                      <li>• Account information and service details</li>
                      <li>• Detailed explanation of the refund basis</li>
                      <li>• Supporting documentation where applicable</li>
                      <li>• Proof of any claimed service failures</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.3 Review Process</h3>
                    <ul className="space-y-2 ml-6">
                      <li>• Initial review within 10 business days</li>
                      <li>• Full investigation within 24 business days</li>
                      <li>• Written response with decision and reasoning</li>
                      <li>• Processing of approved refunds within 7-14 business days</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Partial Refunds */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiDollarSign className="w-6 h-6 mr-3 text-yellow-400" />
                  5. Partial Refunds
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">5.1 Proportional Refunds</h3>
                    <p>
                      For multi-stage services, refunds may be calculated proportionally based on completed vs. remaining services.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">5.2 Administrative Fees</h3>
                    <p>
                      Administrative and processing fees (typically 5-10% of service cost) may be retained even for approved refunds.
                    </p>
                  </div>
                </div>
              </section>

              {/* Refund Methods */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiDollarSign className="w-6 h-6 mr-3 text-green-400" />
                  6. Refund Methods
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">6.1 Original Payment Method</h3>
                    <p>
                      Refunds are processed to the original payment method when possible.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">6.2 Processing Time</h3>
                    <ul className="space-y-2 ml-6">
                      <li>• Credit card refunds: 4-10 business days</li>
                      <li>• Bank transfers: 4-10 business days</li>
                      <li>• International transfers: 4-10 business days</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Dispute Resolution */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiAlertTriangle className="w-6 h-6 mr-3 text-orange-400" />
                  7. Dispute Resolution
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">7.1 Internal Review</h3>
                    <p>
                      Disputes regarding refund decisions can be escalated for management review within 30 days of the initial decision.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">7.2 External Mediation</h3>
                    <p>
                      Unresolved disputes may be subject to third-party mediation as specified in our Terms and Conditions.
                    </p>
                  </div>
                </div>
              </section>

              {/* Special Circumstances */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiAlertTriangle className="w-6 h-6 mr-3 text-blue-400" />
                  8. Special Circumstances
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">8.1 Emergency Situations</h3>
                    <p>
                      In cases of documented medical emergencies or force majeure events, special consideration may be given for refund requests outside normal parameters.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">8.2 Regulatory Changes</h3>
                    <p>
                      If significant regulatory changes make service completion impossible, prorated refunds may be considered.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiMail className="w-6 h-6 mr-3 text-cyan-400" />
                  9. Contact Information
                </h2>
                
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">For Refund Requests:</h3>
                  <div className="space-y-3 text-gray-300">
                    <p><strong>Email:</strong> refunds@hiaraise.com</p>
                    <p><strong>Online Portal:</strong> Refund Request Form</p>
                    <p><strong>Response Time:</strong> Within 14 business days</p>
                    <p><strong>Support:</strong> support@hiaraise.com</p>
                  </div>
                </div>
              </section>

              {/* Policy Updates */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiFileText className="w-6 h-6 mr-3 text-cyan-400" />
                  10. Policy Updates
                </h2>
                
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
                  <p className="text-gray-300">
                    This refund policy may be updated to reflect changes in service offerings or regulatory requirements. Users will be notified of significant changes affecting their rights.
                  </p>
                </div>
              </section>

            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link 
              to="/terms" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
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