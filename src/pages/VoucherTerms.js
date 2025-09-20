import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiFileText, FiGift, FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiAlertTriangle, FiMail, FiUsers, FiCreditCard, FiCalendar } from 'react-icons/fi';

export default function VoucherTerms() {
  return (
    <>
      <Helmet>
        <title>Voucher Terms and Conditions | Hiaraise MedLicense</title>
        <meta name="description" content="Comprehensive terms and conditions for exam vouchers. Learn about voucher policies, non-refundable terms, transferability, and usage guidelines." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Voucher Terms and Conditions | Hiaraise MedLicense",
          "description": "Comprehensive terms and conditions for exam vouchers.",
          "url": "https://hiaraise.com/voucher-terms",
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
              <FiGift className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Voucher Terms and Conditions
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive terms for exam voucher purchases and usage
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
                    <h3 className="text-xl font-semibold text-white mb-3">1.1 Voucher Service Overview</h3>
                    <p>
                      Hiaraise MedLicense provides exam vouchers for various medical licensing authorities including DHA (Dubai Health Authority), MOHAP (Ministry of Health UAE), DOH (Department of Health Abu Dhabi), QCHP (Qatar Council for Healthcare), SCFHS (Saudi Commission), and Prometric examinations. By purchasing a voucher, you acknowledge and agree to these terms.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">1.2 Binding Agreement</h3>
                    <p>
                      These terms constitute a legally binding agreement between you and Hiaraise MedLicense. Purchase of any voucher constitutes acceptance of these terms and conditions.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">1.3 Eligibility</h3>
                    <p>
                      Vouchers are available to licensed medical professionals and students pursuing medical licensure. You must meet the specific requirements of the exam authority for which you are purchasing a voucher.
                    </p>
                  </div>
                </div>
              </section>

              {/* Voucher Nature and Validity */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiGift className="w-6 h-6 mr-3 text-purple-400" />
                  2. Voucher Nature and Validity
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.1 Lifetime Validity</h3>
                    <p>
                      Vouchers remain valid until the associated exam slot expires. This lifetime validity allows flexibility in scheduling your examination within the slot's availability period.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.2 Slot-Based Expiration</h3>
                    <p>
                      Voucher validity is tied to the specific exam slot purchased. Once the slot expires, the voucher becomes invalid and cannot be used for examination registration.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.3 Single Use</h3>
                    <p>
                      Each voucher code is valid for a single examination attempt only. Once used for exam registration, the voucher cannot be reused or transferred.
                    </p>
                  </div>
                </div>
              </section>

              {/* Non-Refundable Policy */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiXCircle className="w-6 h-6 mr-3 text-red-400" />
                  3. Non-Refundable Policy
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-red-300 mb-3">3.1 Absolute Non-Refundable</h3>
                    <p className="text-red-200">
                      <strong>ALL VOUCHERS ARE STRICTLY NON-REFUNDABLE ONCE ISSUED.</strong> This policy applies regardless of circumstances including but not limited to:
                    </p>
                    <ul className="space-y-2 ml-6 mt-4">
                      <li className="flex items-start">
                        <FiXCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        Change of mind or personal circumstances
                      </li>
                      <li className="flex items-start">
                        <FiXCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        Inability to attend the scheduled exam
                      </li>
                      <li className="flex items-start">
                        <FiXCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        Medical emergencies or personal issues
                      </li>
                      <li className="flex items-start">
                        <FiXCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        Failure to meet exam authority requirements
                      </li>
                      <li className="flex items-start">
                        <FiXCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        Technical issues with exam registration
                      </li>
                      <li className="flex items-start">
                        <FiXCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        Changes in regulatory requirements
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">3.2 No Exceptions</h3>
                    <p>
                      This non-refundable policy has no exceptions. By purchasing a voucher, you acknowledge and accept this absolute limitation on refunds.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">3.3 Purchase Finality</h3>
                    <p>
                      All voucher purchases are final transactions. Once payment is processed and the voucher code is generated, the transaction cannot be reversed under any circumstances.
                    </p>
                  </div>
                </div>
              </section>

              {/* Transferability and Resale */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiUsers className="w-6 h-6 mr-3 text-green-400" />
                  4. Transferability and Resale Rights
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-green-300 mb-3">4.1 Third-Party Transfer</h3>
                    <p className="text-green-200 mb-4">
                      <strong>YOU HAVE THE RIGHT TO SELL OR TRANSFER YOUR VOUCHER TO A THIRD PARTY.</strong> This includes:
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Selling the voucher to another individual
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Gifting the voucher to family or friends
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Transferring ownership to colleagues
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Reselling through online platforms
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.2 Transfer Responsibilities</h3>
                    <p className="mb-4">When transferring a voucher, you must:</p>
                    <ul className="space-y-2 ml-6">
                      <li>• Provide the complete voucher code to the new owner</li>
                      <li>• Ensure the new owner understands these terms and conditions</li>
                      <li>• Verify the new owner meets exam authority requirements</li>
                      <li>• Complete the transfer before the slot expiration date</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.3 New Owner Obligations</h3>
                    <p>
                      The new voucher owner assumes all responsibilities and obligations under these terms and conditions. They must meet all exam authority requirements and use the voucher in accordance with these terms.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.4 No Platform Liability</h3>
                    <p>
                      Hiaraise MedLicense is not responsible for disputes between voucher buyers and sellers. All transfer transactions are between private parties.
                    </p>
                  </div>
                </div>
              </section>

              {/* Usage Guidelines */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiCalendar className="w-6 h-6 mr-3 text-blue-400" />
                  5. Usage Guidelines and Requirements
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">5.1 Exam Registration</h3>
                    <p className="mb-4">To use your voucher:</p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Present the voucher code during exam registration
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Meet all exam authority eligibility requirements
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Provide required identification and documentation
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Register within the slot's validity period
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">5.2 Exam Authority Compliance</h3>
                    <p>
                      You are solely responsible for meeting all requirements set by the specific exam authority (DHA, MOHAP, DOH, QCHP, SCFHS, or Prometric). Failure to meet these requirements may result in exam rejection.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">5.3 Documentation Requirements</h3>
                    <p>
                      You must provide all required documentation as specified by the exam authority. This may include medical credentials, identification documents, and other professional qualifications.
                    </p>
                  </div>
                </div>
              </section>

              {/* Payment and Pricing */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiDollarSign className="w-6 h-6 mr-3 text-yellow-400" />
                  6. Payment and Pricing
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">6.1 Dynamic Pricing</h3>
                    <p>
                      Voucher prices are based on current market rates and may vary depending on exam authority, location, and market conditions. Prices are displayed at the time of purchase and are subject to change.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">6.2 Payment Processing</h3>
                    <p>
                      All payments are processed securely through approved payment processors. Payment must be completed in full before voucher codes are generated and delivered.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">6.3 Currency and Taxes</h3>
                    <p>
                      Prices are displayed in USD unless otherwise specified. You are responsible for any applicable taxes, fees, or currency conversion charges imposed by your payment method or financial institution.
                    </p>
                  </div>
                </div>
              </section>

              {/* Limitations and Disclaimers */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiAlertTriangle className="w-6 h-6 mr-3 text-orange-400" />
                  7. Limitations and Disclaimers
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">7.1 No Guarantee of Exam Success</h3>
                    <p>
                      Purchase of a voucher does not guarantee exam success or passing. Exam outcomes depend entirely on your preparation, knowledge, and performance during the examination.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">7.2 Third-Party Services</h3>
                    <p>
                      We facilitate voucher purchases but are not responsible for exam administration, scoring, or results. These services are provided by third-party exam authorities.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">7.3 Regulatory Changes</h3>
                    <p>
                      Exam requirements and procedures may change without notice. We are not responsible for changes in exam authority policies or requirements that may affect your ability to use the voucher.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">7.4 Technical Issues</h3>
                    <p>
                      While we strive to provide reliable service, we are not responsible for technical issues with exam registration systems or third-party platforms that may affect voucher usage.
                    </p>
                  </div>
                </div>
              </section>

              {/* Liability Limitations */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiShield className="w-6 h-6 mr-3 text-red-400" />
                  8. Liability Limitations
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">8.1 Maximum Liability</h3>
                    <p>
                      Our total liability for any claims related to voucher purchases shall not exceed the amount paid for the specific voucher giving rise to the claim.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">8.2 Excluded Damages</h3>
                    <p className="mb-4">We shall not be liable for:</p>
                    <ul className="space-y-2 ml-6">
                      <li>• Indirect, consequential, or punitive damages</li>
                      <li>• Loss of professional opportunities or income</li>
                      <li>• Exam failure or poor performance</li>
                      <li>• Delays in exam scheduling or administration</li>
                      <li>• Third-party actions or omissions</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">8.3 Force Majeure</h3>
                    <p>
                      We are not liable for any failure to perform due to circumstances beyond our reasonable control, including natural disasters, government actions, or other force majeure events.
                    </p>
                  </div>
                </div>
              </section>

              {/* Prohibited Uses */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiXCircle className="w-6 h-6 mr-3 text-red-400" />
                  9. Prohibited Uses
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">9.1 Fraudulent Activities</h3>
                    <p className="mb-4">Prohibited activities include:</p>
                    <ul className="space-y-2 ml-6">
                      <li>• Using false information to purchase vouchers</li>
                      <li>• Attempting to duplicate or counterfeit voucher codes</li>
                      <li>• Using stolen payment methods</li>
                      <li>• Misrepresenting eligibility for examinations</li>
                      <li>• Attempting to circumvent exam authority requirements</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">9.2 Consequences of Violations</h3>
                    <p>
                      Violation of these terms may result in immediate voucher cancellation, account termination, and legal action. We reserve the right to refuse service to any individual who violates these terms.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiMail className="w-6 h-6 mr-3 text-cyan-400" />
                  10. Contact Information
                </h2>
                
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">For Voucher-Related Inquiries:</h3>
                  <div className="space-y-3 text-gray-300">
                    <p><strong>Email:</strong> vouchers@hiaraise.com</p>
                    <p><strong>Support:</strong> support@hiaraise.com</p>
                    <p><strong>Response Time:</strong> Within 24 hours</p>
                    <p><strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM (GMT)</p>
                  </div>
                </div>
              </section>

              {/* Policy Updates */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiFileText className="w-6 h-6 mr-3 text-cyan-400" />
                  11. Updates and Modifications
                </h2>
                
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
                  <p className="text-gray-300">
                    We reserve the right to modify these voucher terms at any time. Users will be notified of significant changes, and continued use of vouchers constitutes acceptance of updated terms. The date of the last update is shown at the top of this page.
                  </p>
                </div>
              </section>

            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 space-x-4">
            <Link 
              to="/terms" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              View General Terms
              <FiArrowLeft className="w-4 h-4 ml-2 transform rotate-180" />
            </Link>
            <Link 
              to="/refund-policy" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
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
