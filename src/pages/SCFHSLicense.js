import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { useAnalytics } from '../utils/useAnalytics';
import { trackButtonClick } from '../utils/analytics';
import { useAuthModal } from '../contexts/AuthModalContext';
import { supabase } from '../supabaseClient';

export default function SCFHSLicense() {
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
        <title>How to Apply for SCFHS License from Pakistan in 2025 – Costs, Steps & Service Providers | Hiaraise</title>
        <meta name="description" content="Learn how to apply for SCFHS license from Pakistan, including costs, steps, and helpful tips for Pakistani healthcare professionals." />
        <meta name="keywords" content="SCFHS license Pakistan, Saudi Commission for Health Specialties, Pakistani doctors Saudi Arabia, SCFHS exam Pakistan, Primary Source Verification Pakistan" />
        <meta property="og:title" content="How to Apply for SCFHS License from Pakistan in 2025" />
        <meta property="og:description" content="Complete guide for Pakistani healthcare professionals to get SCFHS license for Saudi Arabia. Includes costs, steps, and service providers." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Apply for SCFHS License from Pakistan",
            "description": "Step-by-step guide for Pakistani healthcare professionals to obtain SCFHS license for Saudi Arabia",
            "totalTime": "P4M",
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
                "name": "Mumaris Plus portal"
              },
              {
                "@type": "HowToTool",
                "name": "DataFlow verification service"
              }
            ],
            "step": [
              {
                "@type": "HowToStep",
                "name": "Register on Mumaris Plus Portal",
                "text": "Create account and submit qualifications for evaluation"
              },
              {
                "@type": "HowToStep", 
                "name": "Complete Primary Source Verification",
                "text": "Submit documents for verification through DataFlow"
              },
              {
                "@type": "HowToStep",
                "name": "Pass SMLE Exam",
                "text": "Take Saudi Medical Licensing Examination"
              },
              {
                "@type": "HowToStep",
                "name": "Get Professional Classification",
                "text": "Receive Professional Classification Certificate"
              },
              {
                "@type": "HowToStep",
                "name": "Complete Registration",
                "text": "Final registration and license issuance"
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
                "name": "How to apply for SCFHS license from Pakistan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Pakistani healthcare professionals can apply for SCFHS license by registering on Mumaris Plus portal, completing PSV verification, passing SMLE exam, and getting professional classification."
                }
              },
              {
                "@type": "Question",
                "name": "What is the total cost of SCFHS license in Pakistani Rupees (PKR)?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The total cost is PKR 270,250 for all professions. This includes PSV verification (PKR 87,000), Prometric exam fees (PKR 77,000), and registration & Mumaris fees (PKR 106,250)."
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
              How to Apply for SCFHS License from Pakistan in 2025 – Costs, Steps & Service Providers
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Complete guide for Pakistani healthcare professionals seeking to work in Saudi Arabia with SCFHS (Saudi Commission for Health Specialties) license
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
              <h2 className="text-3xl font-bold text-white mb-6">What is an SCFHS License?</h2>
              <p className="text-lg text-gray-300 mb-6">
                The <strong>Saudi Commission for Health Specialties (SCFHS) license</strong> is a mandatory requirement for all healthcare professionals 
                (doctors, nurses, pharmacists, and allied health workers) who wish to practice in Saudi Arabia. This license ensures 
                that healthcare providers meet the high standards set by Saudi Arabia's healthcare system.
              </p>
              <p className="text-lg text-gray-300 mb-6">
                For <strong>Pakistani healthcare professionals</strong>, obtaining an SCFHS license opens doors to lucrative career 
                opportunities in one of the world's largest healthcare markets. Whether you're currently practicing in Pakistan 
                or already working in Saudi Arabia, this comprehensive guide will walk you through the entire process.
              </p>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-200">
                  <strong>Target Audience:</strong> Pakistani doctors, nurses, pharmacists, and allied health professionals 
                  seeking employment opportunities in Saudi Arabia's healthcare sector.
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
                      professional services like Hiaraise, which specializes in helping Pakistani healthcare workers obtain SCFHS licenses.
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
                        obtained their SCFHS licenses with Hiaraise. Our clients save time, money, and stress while achieving their 
                        career goals in Saudi Arabia's healthcare sector.
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
                      <strong>Self-Application Option:</strong> You can choose to handle the entire SCFHS license application process 
                      independently without professional assistance. However, this comes with significant risks and challenges.
                    </p>
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-red-400 mb-2">⚠️ High Risk Factors for Self-Application</h4>
                      <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                        <li><strong>Application Rejection:</strong> 40-60% rejection rate due to common mistakes</li>
                        <li><strong>Document Errors:</strong> Incorrect formatting, missing attestations, or incomplete submissions</li>
                        <li><strong>Process Delays:</strong> 2-3 months additional time due to errors and resubmissions</li>
                        <li><strong>Financial Loss:</strong> Non-refundable fees for rejected applications (PKR 299,700)</li>
                        <li><strong>No Support:</strong> No guidance when complex issues arise</li>
                        <li><strong>Exam Failure Risk:</strong> Higher failure rates without proper preparation</li>
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
                    <h3 className="text-xl font-semibold text-white mb-3">Complete Primary Source Verification (PSV)</h3>
                    <p className="text-gray-300 mb-4">
                      The first step is PSV verification of your Pakistani credentials through <strong>DataFlow</strong>, SCFHS's official verification partner.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Submit educational certificates from Pakistani institutions</li>
                      <li>Provide professional experience letters</li>
                      <li>Include passport copy and recent photograph</li>
                      <li>Pay PSV verification fees (PKR 102,000)</li>
                      <li>Wait for verification completion (3-4 weeks)</li>
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

              {/* Step 2 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Mumaris Registration</h3>
                    <p className="text-gray-300 mb-4">
                      After successful PSV verification, complete your registration on the <strong>Mumaris Plus portal</strong>, SCFHS's official licensing system.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Visit the official Mumaris Plus website</li>
                      <li>Create account and select your profession</li>
                      <li>Provide personal details and contact information</li>
                      <li>Pay Mumaris registration fees (PKR 106,250)</li>
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

              {/* Step 3 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Prometric Exam</h3>
                    <p className="text-gray-300 mb-4">
                      After successful Mumaris registration, you'll need to pass the Prometric exam. Pakistani applicants can take the exam at designated centers.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Register for Prometric exam through SCFHS portal</li>
                      <li>Schedule exam at Prometric center</li>
                      <li>Pay exam fees (USD $295 = PKR 91,450)</li>
                      <li>Study SCFHS exam blueprint</li>
                      <li>Pass with minimum required score</li>
                    </ul>
                    <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-200 text-sm">
                        <strong>⚠️ Risk:</strong> Exam failure rates are 30-40% for self-prepared candidates. 
                        Each retake costs the full exam fee again (USD $295 = PKR 91,450) and delays your application by 30+ days.
                      </p>
                    </div>
                    <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                      <h4 className="font-semibold text-green-400 mb-2">💰 Save Money on Exam Fees!</h4>
                      <p className="text-green-200 text-sm mb-3">
                        Get exclusive discount vouchers for SCFHS Prometric exam fees. Save up to 15% on your exam costs!
                      </p>
                      <button 
                        onClick={() => {
                          trackButtonClick('get_discount_voucher_scfhs', 'scfhs_page');
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
                <h3 className="text-xl font-semibold text-white mb-3">Ready to Start Your SCFHS License Journey?</h3>
                <p className="text-gray-300 mb-4">
                  Get professional assistance with your SCFHS license application and save time and money.
                </p>
                <Link
                  to="/pricing"
                  className="inline-block bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Get License Services
                </Link>
              </div>

              {/* Step 4 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Get Professional Classification Certificate</h3>
                    <p className="text-gray-300 mb-4">
                      After passing the SMLE, SCFHS will issue your Professional Classification Certificate.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Submit final application with exam results</li>
                      <li>Pay registration fees</li>
                      <li>Wait for certificate issuance (2-4 weeks)</li>
                      <li>Download certificate from portal</li>
                      <li>Use certificate for job applications</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Complete Final Registration</h3>
                    <p className="text-gray-300 mb-4">
                      Upon arrival in Saudi Arabia, complete the final registration process to obtain your license to practice.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Submit additional documents in Saudi Arabia</li>
                      <li>Complete medical fitness examination</li>
                      <li>Obtain residency permit (Iqama)</li>
                      <li>Receive final license card</li>
                      <li>Begin practicing in Saudi Arabia</li>
                    </ul>
                    <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-200 text-sm">
                        <strong>Good News:</strong> Final registration fees are typically paid by your employer in Saudi Arabia, 
                        not by you! This significantly reduces your out-of-pocket costs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get License Button after Step 5 */}
              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-3">Need Help with Final Registration?</h3>
                <p className="text-gray-300 mb-4">
                  Our experts can guide you through the final steps of your SCFHS license process.
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
                      <td className="py-4 px-4">PSV Report Verification<br/><span className="text-xs text-gray-400">(1st Step)</span><br/><span className="text-xs text-blue-300">DataFlow verification</span></td>
                      <td className="py-4 px-4">PKR 87,000</td>
                      <td className="py-4 px-4">PKR 87,000</td>
                      <td className="py-4 px-4">PKR 87,000</td>
                      <td className="py-4 px-4">PKR 87,000</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-4 px-4">Mumaris Registration<br/><span className="text-xs text-gray-400">(2nd Step)</span></td>
                      <td className="py-4 px-4">PKR 106,250</td>
                      <td className="py-4 px-4">PKR 106,250</td>
                      <td className="py-4 px-4">PKR 106,250</td>
                      <td className="py-4 px-4">PKR 106,250</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-4 px-4">Prometric Exam Fee<br/><span className="text-xs text-gray-400">(3rd Step)</span></td>
                      <td className="py-4 px-4">PKR 77,000</td>
                      <td className="py-4 px-4">PKR 77,000</td>
                      <td className="py-4 px-4">PKR 77,000</td>
                      <td className="py-4 px-4">PKR 77,000</td>
                    </tr>
                    <tr className="bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                      <td className="py-4 px-4 font-semibold">Total Cost (You Pay)</td>
                      <td className="py-4 px-4 font-semibold text-green-400">PKR 270,250</td>
                      <td className="py-4 px-4 font-semibold text-green-400">PKR 270,250</td>
                      <td className="py-4 px-4 font-semibold text-green-400">PKR 270,250</td>
                      <td className="py-4 px-4 font-semibold text-green-400">PKR 270,250</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-200">
                  <strong>💰 Save Money:</strong> You can save up to 15% on your SCFHS license application costs by using our exclusive vouchers and package deals. 
                  With exam fees of PKR 77,000, our vouchers can save you significant money. Contact Hiaraise to learn about our special offers for Pakistani healthcare professionals.
                </p>
              </div>
              
              <div className="mt-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200">
                  <strong>Important:</strong> Final registration fees in Saudi Arabia are typically paid by your employer 
                  (Saudi healthcare facility). You only need to pay the initial application fees from Pakistan.
                </p>
              </div>

              {/* Get License Button after Price Breakdown */}
              <div className="mt-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-3">Save Money with Our License Services</h3>
                <p className="text-gray-300 mb-4">
                  Get exclusive discounts and professional assistance to reduce your SCFHS license costs.
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
            <h2 className="text-3xl font-bold text-white mb-8">Timeline for SCFHS License from Pakistan</h2>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div>
                    <span className="text-white font-semibold">Week 1-4:</span>
                    <span className="text-gray-300 ml-2">PSV verification process (3-4 weeks)</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <div>
                    <span className="text-white font-semibold">Week 5:</span>
                    <span className="text-gray-300 ml-2">Mumaris Plus registration and document submission</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div>
                    <span className="text-white font-semibold">Week 6-7:</span>
                    <span className="text-gray-300 ml-2">Prometric exam scheduling and preparation</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <div>
                    <span className="text-white font-semibold">Week 8-12:</span>
                    <span className="text-gray-300 ml-2">Professional classification and certificate issuance (2-4 weeks)</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200">
                  <strong>Total Timeline:</strong> 6-12 weeks for Pakistani applicants, depending on PSV verification speed, 
                  exam scheduling availability, and SCFHS processing time.
                </p>
              </div>
              
              <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-200">
                  <strong>Fast Track Option:</strong> Using professional services like Hiaraise can reduce the overall 
                  timeline by 2-3 weeks through expedited document processing and exam preparation support.
                </p>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions for Pakistani Applicants</h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">How to apply for SCFHS license from Pakistan?</h3>
                <p className="text-gray-300">
                  Pakistani healthcare professionals can apply for SCFHS license by registering on Mumaris Plus portal, completing PSV verification, 
                  passing SMLE exam, and getting professional classification. The entire process can be completed from Pakistan without visiting Saudi Arabia initially.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">What is the total cost of SCFHS license in Pakistani Rupees (PKR)?</h3>
                <p className="text-gray-300">
                  The total cost is PKR 270,250 for all professions. This includes PSV verification (PKR 87,000), 
                  Prometric exam fees (PKR 77,000), and registration & Mumaris fees (PKR 106,250).
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">How much does the Prometric exam cost in PKR?</h3>
                <p className="text-gray-300">
                  The Prometric exam fee is PKR 77,000 (USD $295) for all professions. This is a significant cost, but you can save money using our exclusive vouchers.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">How long does it take to get an SCFHS license from Pakistan?</h3>
                <p className="text-gray-300">
                  The entire process typically takes 6-12 weeks from Pakistan, including registration (1 week), PSV verification (3-4 weeks), 
                  exam scheduling and preparation (1-2 weeks), and professional classification (2-4 weeks). PSV verification is usually the longest step.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Can I take the Prometric exam in Pakistan?</h3>
                <p className="text-gray-300">
                  Yes, you can take the Prometric exam at designated centers in Pakistan. The exam is computer-based and can be scheduled 
                  through the SCFHS portal after successful PSV verification.
                </p>
              </div>
            </div>
          </section>

          {/* Get License Section */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-xl border border-green-500/30 rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Your SCFHS License?</h2>
              <p className="text-lg text-gray-300 mb-6">
                Start your SCFHS licensing journey today with our comprehensive service package. 
                Get expert guidance, document support, and exam preparation assistance.
              </p>
              
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">What's Included in Our SCFHS License Service:</h3>
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
                      <span className="text-gray-300">SMLE exam preparation materials</span>
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
                      <span className="text-gray-300">Professional classification support</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => {
                    trackButtonClick('get_license_scfhs', 'scfhs_page');
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
                  href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I need tailored services for SCFHS licensing process. Please provide me with a customized quote.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackButtonClick('get_tailored_services_scfhs', 'scfhs_page')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Get Tailored Services
                </a>
              </div>
              
              <p className="text-sm text-gray-400 mt-4">
                Join hundreds of Pakistani healthcare professionals who have successfully obtained their SCFHS licenses with Hiaraise
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-blue-500/30 rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your SCFHS License Journey?</h2>
              <p className="text-lg text-gray-300 mb-6">
                Don't navigate the complex SCFHS licensing process alone. Let Hiaraise guide you through every step 
                and ensure your success as a Pakistani healthcare professional in Saudi Arabia.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I need free consultation about SCFHS licensing process.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackButtonClick('whatsapp_consultation_scfhs', 'scfhs_page')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Get Free Consultation
                </a>
                <button 
                  onClick={() => {
                    trackButtonClick('eligibility_checker_scfhs', 'scfhs_page');
                    navigate('/eligibility-check');
                  }}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Check Eligibility
                </button>
              </div>
              
              <p className="text-sm text-gray-400 mt-4">
                Join hundreds of Pakistani healthcare professionals who have successfully obtained their SCFHS licenses with Hiaraise
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
