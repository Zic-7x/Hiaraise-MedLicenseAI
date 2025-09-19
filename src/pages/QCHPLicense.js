import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { useAnalytics } from '../utils/useAnalytics';
import { trackButtonClick } from '../utils/analytics';
import { useAuthModal } from '../contexts/AuthModalContext';
import { supabase } from '../supabaseClient';

export default function QCHPLicense() {
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const [user, setUser] = useState(null);
  useAnalytics();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  return (
    <>
      <Helmet>
        <title>How to Apply for QCHP License from Pakistan in 2025 – Costs, Steps & Service Providers | Hiaraise</title>
        <meta name="description" content="Learn how to apply for QCHP license from Pakistan, including costs, steps, and helpful tips for Pakistani healthcare professionals." />
        <meta name="keywords" content="QCHP license Pakistan, Qatar Council for Healthcare Practitioners, Pakistani doctors Qatar, QCHP exam Pakistan, Primary Source Verification Pakistan" />
        <meta property="og:title" content="How to Apply for QCHP License from Pakistan in 2025" />
        <meta property="og:description" content="Complete guide for Pakistani healthcare professionals to get QCHP license for Qatar. Includes costs, steps, and service providers." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Apply for QCHP License from Pakistan",
            "description": "Step-by-step guide for Pakistani healthcare professionals to obtain QCHP license for Qatar",
            "totalTime": "P3M",
            "supply": [
              {
                "@type": "HowToSupply",
                "name": "Educational certificates"
              },
              {
                "@type": "HowToSupply", 
                "name": "Professional experience documents"
              },
              {
                "@type": "HowToSupply",
                "name": "Passport copy"
              }
            ],
            "tool": [
              {
                "@type": "HowToTool",
                "name": "QCHP portal"
              },
              {
                "@type": "HowToTool",
                "name": "DataFlow verification service"
              }
            ],
            "step": [
              {
                "@type": "HowToStep",
                "name": "Register on QCHP Portal",
                "text": "Create account and submit qualifications for evaluation"
              },
              {
                "@type": "HowToStep", 
                "name": "Complete Primary Source Verification",
                "text": "Submit documents for verification through DataFlow"
              },
              {
                "@type": "HowToStep",
                "name": "Pass QCHP Prometric Exam",
                "text": "Take Qatar healthcare Prometric exam"
              },
              {
                "@type": "HowToStep",
                "name": "Get Professional License",
                "text": "Receive QCHP professional license"
              }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How to apply for QCHP license from Pakistan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Pakistani healthcare professionals can apply for QCHP license by registering on QCHP portal, completing PSV verification, passing QCHP Prometric exam, and getting professional license."
                }
              },
              {
                "@type": "Question",
                "name": "What is the total cost of QCHP license in Pakistani Rupees (PKR)?",
                "acceptedAnswer": {
                  "@type": "Answer",                  "text": "The total cost ranges from PKR 197,500 to PKR 199,500 depending on profession. This includes PSV verification (PKR 87,000), Prometric exam fees (PKR 77,000), and registration fees (PKR 33,500-35,500)."
                }
              }
            ]
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <section className="text-center py-12 mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-6">
              How to Apply for QCHP License from Pakistan in 2025 – Costs, Steps & Service Providers
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Complete guide for Pakistani healthcare professionals seeking to work in Qatar with QCHP (Qatar Council for Healthcare Practitioners) license
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span>📅 Updated: January 2025</span>
              <span>⏱️ Read time: 8 minutes</span>
              <span>🎯 For: Pakistani Healthcare Professionals</span>
            </div>
          </section>

          {/* Introduction */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">What is a QCHP License?</h2>
              <p className="text-lg text-gray-300 mb-6">
                The <strong>Qatar Council for Healthcare Practitioners (QCHP) license</strong> is a mandatory requirement for all healthcare professionals 
                (doctors, nurses, pharmacists, and allied health workers) who wish to practice in Qatar. This license ensures 
                that healthcare providers meet the high standards set by Qatar's healthcare system.
              </p>
              <p className="text-lg text-gray-300 mb-6">
                For <strong>Pakistani healthcare professionals</strong>, obtaining a QCHP license opens doors to lucrative career 
                opportunities in one of the world's most advanced healthcare markets. Whether you're currently practicing in Pakistan 
                or already working in Qatar, this comprehensive guide will walk you through the entire process.
              </p>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-200">
                  <strong>Target Audience:</strong> Pakistani doctors, nurses, pharmacists, and allied health professionals 
                  seeking employment opportunities in Qatar's healthcare sector.
                </p>
              </div>
            </div>
          </section>

          {/* Step-by-Step Process */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Step-by-Step Application Process for Pakistani Applicants</h2>
            
            <div className="space-y-8">
              {/* Recommendation Section */}
              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    ⭐
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">RECOMMENDED: Apply through License Services Provider (Hiaraise)</h3>
                    <p className="text-gray-300 mb-4">
                      <strong>Best Option:</strong> Pakistani professionals can streamline the entire process by using 
                      professional services like Hiaraise, which specializes in helping Pakistani healthcare workers obtain QCHP licenses.
                    </p>
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-green-400 mb-2">Why Choose Hiaraise?</h4>
                      <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                        <li><strong>Save 15%:</strong> Exclusive vouchers and package deals</li>
                        <li><strong>Faster Processing:</strong> Reduce timeline by 2-3 weeks</li>
                        <li><strong>Expert Guidance:</strong> Complete application assistance</li>
                        <li><strong>Document Support:</strong> Preparation and verification help</li>
                        <li><strong>Exam Preparation:</strong> Study materials and practice tests</li>
                        <li><strong>Payment Facilitation:</strong> Pay in PKR with secure processing</li>
                        <li><strong>Ongoing Support:</strong> 24/7 assistance throughout the process</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4">
                      <p className="text-blue-200 text-sm">
                        <strong>Customer Success:</strong> Join hundreds of Pakistani healthcare professionals who have successfully 
                        obtained their QCHP licenses with Hiaraise. Our clients save time, money, and stress while achieving their 
                        career goals in Qatar's healthcare sector.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alternative: Proceed Directly */}
              <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 backdrop-blur-xl border border-orange-500/30 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    ⚠️
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">ALTERNATIVE: Proceed Directly by Yourself</h3>
                    <p className="text-gray-300 mb-4">
                      <strong>Self-Application Option:</strong> You can choose to handle the entire QCHP license application process 
                      independently without professional assistance. However, this comes with significant risks and challenges.
                    </p>
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-red-400 mb-2">⚠️ High Risk Factors for Self-Application</h4>
                      <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                        <li><strong>Application Rejection:</strong> 40-60% rejection rate due to common mistakes</li>
                        <li><strong>Document Errors:</strong> Incorrect formatting, missing attestations, or incomplete submissions</li>
                        <li><strong>Process Delays:</strong> 2-3 months additional time due to errors and resubmissions</li>
                        <li><strong>Financial Loss:</strong> Non-refundable fees for rejected applications (PKR 180,000-195,000)</li>
                        <li><strong>No Support:</strong> No guidance when complex issues arise</li>
                        <li><strong>Assessment Failure Risk:</strong> Higher failure rates without proper preparation</li>
                        <li><strong>Stress & Anxiety:</strong> Managing complex requirements alone</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                      <p className="text-yellow-200 text-sm">
                        <strong>Consider Carefully:</strong> While self-application is possible, the risks are substantial. 
                        Most Pakistani healthcare professionals who attempt self-application face significant challenges 
                        and often end up seeking professional help after encountering problems.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 1 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Register on QCHP Portal</h3>
                    <p className="text-gray-300 mb-4">
                      The first step is to register on the <strong>QCHP portal</strong>, Qatar's official licensing system. 
                      Pakistani applicants can create an account from anywhere in the world.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Visit the official QCHP website</li>
                      <li>Click "Register" and select your profession</li>
                      <li>Provide personal details and contact information</li>
                      <li>Upload educational certificates and experience letters</li>
                      <li>Complete profile setup with Pakistani address</li>
                    </ul>
                    <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-200 text-sm">
                        <strong>⚠️ Risk:</strong> Incorrect profession selection or incomplete profile setup can lead to application rejection. 
                        Double-check all information before submitting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Complete Primary Source Verification (PSV)</h3>
                    <p className="text-gray-300 mb-4">
                      QCHP requires verification of your Pakistani credentials through <strong>DataFlow</strong>, their official verification partner.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Submit educational certificates from Pakistani institutions</li>
                      <li>Provide professional experience letters</li>
                      <li>Include passport copy and recent photograph</li>
                      <li>Pay PSV verification fees</li>
                      <li>Wait for verification completion (4-6 weeks)</li>
                    </ul>
                    <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-200 text-sm">
                        <strong>⚠️ Risk:</strong> Document verification failures are the #1 cause of application rejection. 
                        Missing attestations, incorrect translations, or incomplete documents can delay the process by months.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Pass QCHP Prometric Exam</h3>
                    <p className="text-gray-300 mb-4">
                      After successful PSV, you'll need to pass the QCHP Prometric exam. Pakistani applicants can take the exam at designated centers.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Register for QCHP Prometric exam through portal</li>
                      <li>Schedule exam at designated center</li>
                      <li>Pay exam fees (USD $280)</li>
                      <li>Study QCHP exam materials</li>
                      <li>Pass with minimum required score</li>
                    </ul>
                    <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-200 text-sm">
                        <strong>⚠️ Risk:</strong> Exam failure rates are 25-35% for self-prepared candidates. 
                        Each retake costs the full exam fee again (USD $280 = PKR 23,800) and delays your application by 30+ days.
                      </p>
                    </div>
                    <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                      <h4 className="font-semibold text-green-400 mb-2">💰 Save Money on Exam Fees!</h4>
                      <p className="text-green-200 text-sm mb-3">
                        Get exclusive discount vouchers for QCHP Prometric exam fees. Save up to 15% on your exam costs!
                      </p>
                      <button 
                        onClick={() => {
                          trackButtonClick('get_discount_voucher_qchp', 'qchp_page');
                          navigate('/prometric-vouchers');
                        }}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm"
                      >
                        Get Discount Voucher
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get License Button after Step 3 */}
              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-3">Ready to Start Your QCHP License Journey?</h3>
                <p className="text-gray-300 mb-4">
                  Get professional assistance with your QCHP license application and save time and money.
                </p>
                <Link
                  to="/pricing"
                  className="inline-block bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Get License Services
                </Link>
              </div>

              {/* Step 4 */}
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Get Professional License</h3>
                    <p className="text-gray-300 mb-4">
                      After passing the assessment, QCHP will issue your professional license to practice in Qatar.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Submit final application with Prometric exam results</li>
                      <li>Pay registration fees</li>
                      <li>Wait for license issuance (2-3 weeks)</li>
                      <li>Download license from portal</li>
                      <li>Use license for job applications in Qatar</li>
                    </ul>
                    <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-200 text-sm">
                        <strong>Good News:</strong> License activation fees are typically paid by your employer in Qatar, 
                        not by you! This significantly reduces your out-of-pocket costs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get License Button after Step 4 */}
              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-3">Need Help with License Issuance?</h3>
                <p className="text-gray-300 mb-4">
                  Our experts can guide you through the final steps of your QCHP license process.
                </p>
                <Link
                  to="/pricing"
                  className="inline-block bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Get License Services
                </Link>
              </div>
            </div>
          </section>

          {/* Costs Breakdown */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Costs Breakdown for Pakistani Applicants (PKR)</h2>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-8">
              <div className="overflow-x-auto">
                <table className="w-full text-gray-300">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-4 px-4 font-semibold">Service</th>
                      <th className="text-left py-4 px-4 font-semibold">Doctors</th>
                      <th className="text-left py-4 px-4 font-semibold">Nurses</th>
                      <th className="text-left py-4 px-4 font-semibold">Pharmacists</th>
                      <th className="text-left py-4 px-4 font-semibold">Allied Health</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-4">
                    <tr className="border-b border-white/10">
                      <td className="py-4 px-4">PSV Verification<br/><span className="text-xs text-gray-400">(Paid in 2nd week)</span><br/><span className="text-xs text-blue-300">DataFlow verification</span></td>
                      <td className="py-4 px-4">PKR 87,000</td>
                      <td className="py-4 px-4">PKR 87,000</td>
                      <td className="py-4 px-4">PKR 87,000</td>
                      <td className="py-4 px-4">PKR 87,000</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-4 px-4">QCHP Prometric Exam<br/><span className="text-xs text-gray-400">(Paid when securing exam date)</span></td>
                      <td className="py-4 px-4">PKR 77,000</td>
                      <td className="py-4 px-4">PKR 77,000</td>
                      <td className="py-4 px-4">PKR 77,000</td>
                      <td className="py-4 px-4">PKR 77,000</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-4 px-4">Registration Fee<br/><span className="text-xs text-gray-400">(Paid after passing assessment)</span></td>
                      <td className="py-4 px-4">PKR 35,500</td>
                      <td className="py-4 px-4">PKR 33,500</td>
                      <td className="py-4 px-4">PKR 33,500</td>
                      <td className="py-4 px-4">PKR 33,500</td>
                    </tr>
                    <tr className="bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                      <td className="py-4 px-4 font-semibold">Total Cost (You Pay)</td>
                      <td className="py-4 px-4 font-semibold text-green-400">PKR 199,500</td>
                      <td className="py-4 px-4 font-semibold text-green-400">PKR 197,500</td>
                      <td className="py-4 px-4 font-semibold text-green-400">PKR 197,500</td>
                      <td className="py-4 px-4 font-semibold text-green-400">PKR 197,500</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-200">
                  <strong>💰 Save Money:</strong> You can save up to 15% on your QCHP license application costs by using our exclusive vouchers and package deals. 
                  With Prometric exam fees of PKR 77,000, our vouchers can save you significant money. Contact Hiaraise to learn about our special offers for Pakistani healthcare professionals.
                </p>
              </div>
              
              <div className="mt-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200">
                  <strong>Important:</strong> License activation fees in Qatar are typically paid by your employer 
                  (Qatari healthcare facility). You only need to pay the initial application fees from Pakistan.
                </p>
              </div>

              {/* Get License Button after Price Breakdown */}
              <div className="mt-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-3">Save Money with Our License Services</h3>
                <p className="text-gray-300 mb-4">
                  Get exclusive discounts and professional assistance to reduce your QCHP license costs.
                </p>
                <Link
                  to="/pricing"
                  className="inline-block bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Get License Services
                </Link>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Timeline for QCHP License from Pakistan</h2>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div>
                    <span className="text-white font-semibold">Week 1:</span>
                    <span className="text-gray-300 ml-2">QCHP registration and document submission</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <div>
                    <span className="text-white font-semibold">Week 2-7:</span>
                    <span className="text-gray-300 ml-2">PSV verification process (4-6 weeks)</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div>
                    <span className="text-white font-semibold">Week 8-9:</span>
                    <span className="text-gray-300 ml-2">QCHP Prometric exam scheduling and preparation</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <div>
                    <span className="text-white font-semibold">Week 10-12:</span>
                    <span className="text-gray-300 ml-2">License issuance and final registration (2-3 weeks)</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200">
                  <strong>Total Timeline:</strong> 10-12 weeks for Pakistani applicants, depending on PSV verification speed, 
                  Prometric exam scheduling availability, and QCHP processing time.
                </p>
              </div>
              
              <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-200">
                  <strong>Fast Track Option:</strong> Using professional services like Hiaraise can reduce the overall 
                  timeline by 2-3 weeks through expedited document processing and Prometric exam preparation support.
                </p>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions for Pakistani Applicants</h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">How to apply for QCHP license from Pakistan?</h3>
                <p className="text-gray-300">
                  Pakistani healthcare professionals can apply for QCHP license by registering on QCHP portal, completing PSV verification, 
                  passing QCHP Prometric exam, and getting professional license. The entire process can be completed from Pakistan without visiting Qatar initially.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">What is the total cost of QCHP license in Pakistani Rupees (PKR)?</h3>
                <p className="text-gray-300">
                  The total cost ranges from PKR 197,500 to PKR 199,500 depending on profession. Doctors pay PKR 199,500, 
                  nurses PKR 197,500, pharmacists PKR 197,500, and allied health professionals PKR 197,500. This includes PSV verification (PKR 87,000), 
                  Prometric exam fees (PKR 77,000), and registration fees (PKR 33,500-35,500).
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">How much does the QCHP Prometric exam cost in PKR?</h3>
                <p className="text-gray-300">
                  QCHP Prometric exam fees are PKR 77,000 (USD $280) for all professions. This is a significant cost, but you can save money using our exclusive vouchers.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">How long does it take to get a QCHP license from Pakistan?</h3>
                <p className="text-gray-300">
                  The entire process typically takes 10-12 weeks from Pakistan, including registration (1 week), PSV verification (4-6 weeks), 
                  Prometric exam scheduling and preparation (1-2 weeks), and license issuance (2-3 weeks). PSV verification is usually the longest step.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Can I take the QCHP Prometric exam in Pakistan?</h3>
                <p className="text-gray-300">
                  Yes, you can take the QCHP Prometric exam at designated centers in Pakistan. The exam is computer-based and can be scheduled 
                  through the QCHP portal after successful PSV verification.
                </p>
              </div>
            </div>
          </section>

          {/* Get License Section */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-xl border border-green-500/30 rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Your QCHP License?</h2>
              <p className="text-lg text-gray-300 mb-6">
                Start your QCHP licensing journey today with our comprehensive service package. 
                Get expert guidance, document support, and exam preparation assistance.
              </p>
              
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">What's Included in Our QCHP License Service:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">Complete application guidance</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">Document preparation & verification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">PSV process assistance</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">QCHP Prometric exam preparation</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">Payment facilitation in PKR</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">24/7 support throughout process</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">Exclusive discount vouchers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">Professional license support</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => {
                    trackButtonClick('get_license_qchp', 'qchp_page');
                    if (user) {
                      navigate('/submit-case');
                    } else {
                      openAuthModal('login', () => {
                        navigate('/submit-case');
                      });
                    }
                  }}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  {user ? 'Start License Application' : 'Get Started Now'}
                </button>
                <a
                  href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I need tailored services for QCHP licensing process. Please provide me with a customized quote.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackButtonClick('get_tailored_services_qchp', 'qchp_page')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Get Tailored Services
                </a>
              </div>
              
              <p className="text-sm text-gray-400 mt-4">
                Join hundreds of Pakistani healthcare professionals who have successfully obtained their QCHP licenses with Hiaraise
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-blue-500/30 rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your QCHP License Journey?</h2>
              <p className="text-lg text-gray-300 mb-6">
                Don't navigate the complex QCHP licensing process alone. Let Hiaraise guide you through every step 
                and ensure your success as a Pakistani healthcare professional in Qatar.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I need free consultation about QCHP licensing process.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackButtonClick('whatsapp_consultation_qchp', 'qchp_page')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Get Free Consultation
                </a>
                <button 
                  onClick={() => {
                    trackButtonClick('eligibility_checker_qchp', 'qchp_page');
                    navigate('/eligibility-check');
                  }}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Check Eligibility
                </button>
              </div>
              
              <p className="text-sm text-gray-400 mt-4">
                Join hundreds of Pakistani healthcare professionals who have successfully obtained their QCHP licenses with Hiaraise
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
