import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { useAnalytics } from '../utils/useAnalytics';
import { trackButtonClick } from '../utils/analytics';
import { useAuthModal } from '../contexts/AuthModalContext';
import { supabase } from '../supabaseClient';

export default function DHALicense() {
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
        <title>How to Apply for a DHA License from Pakistan in 2025 – Costs, Steps & Service Providers | Hiaraise</title>
        <meta name="description" content="Learn how to apply for DHA license from Pakistan, including costs, steps, and helpful tips for Pakistani healthcare professionals." />
        <meta name="keywords" content="DHA license Pakistan, Dubai Health Authority license, Pakistani doctors UAE, DHA exam Pakistan, Primary Source Verification Pakistan" />
        <meta property="og:title" content="How to Apply for a DHA License from Pakistan in 2025" />
        <meta property="og:description" content="Complete guide for Pakistani healthcare professionals to get DHA license for Dubai. Includes costs, steps, and service providers." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Apply for a DHA License from Pakistan",
            "description": "Step-by-step guide for Pakistani healthcare professionals to obtain DHA license for Dubai",
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
                "name": "Sheryan account"
              },
              {
                "@type": "HowToTool",
                "name": "DataFlow verification service"
              }
            ],
            "step": [
              {
                "@type": "HowToStep",
                "name": "Create Sheryan Account",
                "text": "Register and set up your Sheryan account from Pakistan"
              },
              {
                "@type": "HowToStep", 
                "name": "Complete Self-Assessment",
                "text": "Check your eligibility through the self-assessment tool"
              },
              {
                "@type": "HowToStep",
                "name": "Submit Documents for PSV",
                "text": "Submit documents for Primary Source Verification through DataFlow"
              },
              {
                "@type": "HowToStep",
                "name": "Schedule DHA Exam",
                "text": "Schedule your DHA exam remotely from Pakistan"
              },
              {
                "@type": "HowToStep",
                "name": "Pass DHA Exam",
                "text": "Prepare for and pass the DHA examination"
              },
              {
                "@type": "HowToStep",
                "name": "Activate License",
                "text": "Activate your license remotely or with employer assistance"
              },
              {
                "@type": "HowToStep",
                "name": "Receive Eligibility Letter",
                "text": "Obtain your final eligibility letter"
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
                "name": "How to apply for a DHA license from Pakistan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Pakistani healthcare professionals can apply for DHA license by creating a Sheryan account, completing self-assessment, submitting documents for PSV verification, scheduling and passing the DHA exam, then activating their license remotely."
                }
              },
              {
                "@type": "Question",
                "name": "What is the total cost of DHA license in Pakistani Rupees (PKR)?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The total cost you need to pay is PKR 185,250 for all healthcare professionals. This includes self-assessment (free), PSV verification (PKR 87,000), DHA registration (PKR 21,250), and Prometric exam fees (PKR 77,000). License activation fees are typically paid by your employer in Dubai."
                }
              },
              {
                "@type": "Question",
                "name": "How can I pay DHA fees from Pakistan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "DHA fees can be paid from Pakistan using international credit/debit cards, bank transfers, or through service providers like Hiaraise who can facilitate payments in PKR."
                }
              },
              {
                "@type": "Question",
                "name": "Can I schedule the DHA exam while in Pakistan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, you can schedule the DHA exam remotely from Pakistan. The exam can be taken online or at designated centers in Pakistan."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to get a DHA license from Pakistan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The entire process typically takes 4-8 weeks from Pakistan, including account creation (1 week), document verification (2-3 weeks), exam scheduling and preparation (1 week), and license activation (1-3 weeks)."
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
              How to Apply for a DHA License from Pakistan in 2025 – Costs, Steps & Service Providers
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Complete guide for Pakistani healthcare professionals seeking to work in Dubai with DHA (Dubai Health Authority) license
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
              <h2 className="text-3xl font-bold text-white mb-6">What is a DHA License?</h2>
              <p className="text-lg text-gray-300 mb-6">
                The <strong>Dubai Health Authority (DHA) license</strong> is a mandatory requirement for all healthcare professionals 
                (doctors, nurses, pharmacists, and allied health workers) who wish to practice in Dubai, UAE. This license ensures 
                that healthcare providers meet the high standards set by Dubai's healthcare system.
              </p>
              <p className="text-lg text-gray-300 mb-6">
                For <strong>Pakistani healthcare professionals</strong>, obtaining a DHA license opens doors to lucrative career 
                opportunities in one of the world's most advanced healthcare markets. Whether you're currently practicing in Pakistan 
                or already working in the UAE, this comprehensive guide will walk you through the entire process.
              </p>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-200">
                  <strong>Target Audience:</strong> Pakistani doctors, nurses, pharmacists, and allied health professionals 
                  seeking employment opportunities in Dubai's healthcare sector.
                </p>
              </div>
            </div>
          </section>

          {/* Step-by-Step Process */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Step-by-Step Application Process for Pakistani Applicants</h2>
            
            <div className="space-y-8">
              {/* Recommendation Section - Not a Step */}
              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    ⭐
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">RECOMMENDED: Apply through License Services Provider (Hiaraise)</h3>
                    <p className="text-gray-300 mb-4">
                      <strong>Best Option:</strong> Pakistani professionals can streamline the entire process by using 
                      professional services like Hiaraise, which specializes in helping Pakistani healthcare workers obtain DHA licenses.
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
                        obtained their DHA licenses with Hiaraise. Our clients save time, money, and stress while achieving their 
                        career goals in Dubai's healthcare sector.
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
                      <strong>Self-Application Option:</strong> You can choose to handle the entire DHA license application process 
                      independently without professional assistance. However, this comes with significant risks and challenges.
                    </p>
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-red-400 mb-2">⚠️ High Risk Factors for Self-Application</h4>
                      <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                        <li><strong>Application Rejection:</strong> 40-60% rejection rate due to common mistakes</li>
                        <li><strong>Document Errors:</strong> Incorrect formatting, missing attestations, or incomplete submissions</li>
                        <li><strong>Process Delays:</strong> 2-3 months additional time due to errors and resubmissions</li>
                        <li><strong>Financial Loss:</strong> Non-refundable fees for rejected applications (PKR 211,600)</li>
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
                    <h3 className="text-xl font-semibold text-white mb-3">Create a Sheryan Account</h3>
                    <p className="text-gray-300 mb-4">
                      The first step is to register on the <strong>Sheryan platform</strong>, DHA's official licensing system. 
                      Pakistani applicants can create an account from anywhere in the world.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Visit the official Sheryan website</li>
                      <li>Click "Register" and select your profession</li>
                      <li>Provide personal details and contact information</li>
                      <li>Verify your email address</li>
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
                    <h3 className="text-xl font-semibold text-white mb-3">Complete the Self-Assessment</h3>
                    <p className="text-gray-300 mb-4">
                      Before proceeding, you must complete an eligibility self-assessment to determine if you meet DHA's requirements.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Answer questions about your education and experience</li>
                      <li>Verify your qualifications meet DHA standards</li>
                      <li>Check language proficiency requirements</li>
                      <li>Review any additional requirements for your profession</li>
                    </ul>
                    <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-200 text-sm">
                        <strong>⚠️ Risk:</strong> Inaccurate self-assessment can lead to immediate disqualification. 
                        Ensure all qualifications are properly documented and meet DHA requirements.
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
                    <h3 className="text-xl font-semibold text-white mb-3">Submit Documents for Primary Source Verification (PSV)</h3>
                    <p className="text-gray-300 mb-4">
                      DHA requires verification of your Pakistani credentials through <strong>DataFlow</strong>, their official verification partner.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Submit educational certificates from Pakistani institutions</li>
                      <li>Provide professional experience letters</li>
                      <li>Include passport copy and recent photograph</li>
                      <li>Pay PSV verification fees</li>
                      <li>Wait for verification completion (2-4 weeks)</li>
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

              {/* Get License Button after Step 3 */}
              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-3">Ready to Start Your DHA License Journey?</h3>
                <p className="text-gray-300 mb-4">
                  Get professional assistance with your DHA license application and save time and money.
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
                    <h3 className="text-xl font-semibold text-white mb-3">Schedule DHA Exam</h3>
                    <p className="text-gray-300 mb-4">
                      Once PSV is complete, you can schedule your DHA examination. Pakistani applicants can take the exam remotely.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Log into your Sheryan account</li>
                      <li>Select "Schedule Exam" option</li>
                      <li>Choose exam date and time (consider Pakistan time zone)</li>
                      <li>Pay exam fees online (USD $285 for all professions)</li>
                      <li>Receive exam confirmation details</li>
                    </ul>
                    <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-200 text-sm">
                        <strong>⚠️ Risk:</strong> Exam scheduling errors or payment failures can result in losing your exam slot. 
                        Limited availability means rescheduling can delay your application by weeks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Prepare for and Pass the DHA Exam</h3>
                    <p className="text-gray-300 mb-4">
                      The DHA exam tests your knowledge of UAE healthcare laws, regulations, and professional standards.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Study DHA exam preparation materials</li>
                      <li>Take practice tests online</li>
                      <li>Review UAE healthcare regulations</li>
                      <li>Ensure stable internet connection for online exam</li>
                      <li>Pass with minimum required score</li>
                    </ul>
                     <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                       <p className="text-red-200 text-sm">
                         <strong>⚠️ Risk:</strong> Exam failure rates are 30-40% for self-prepared candidates. 
                         Each retake costs the full exam fee again (USD $285 = PKR 88,350) and delays your application by 30+ days.
                       </p>
                     </div>
                     <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                       <h4 className="font-semibold text-green-400 mb-2">💰 Save Money on Exam Fees!</h4>
                       <p className="text-green-200 text-sm mb-3">
                         Get exclusive discount vouchers for DHA Prometric exam fees. Save up to 15% on your exam costs!
                       </p>
                      <button 
                        onClick={() => {
                          trackButtonClick('get_discount_voucher_dha', 'dha_page');
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

              {/* Step 6 */}
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    6
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">License Activation (Paid by Employer)</h3>
                    <p className="text-gray-300 mb-4">
                      After passing the exam, your employer (DHA-licensed healthcare facility) will handle the license activation process. 
                      <strong>You don't need to pay activation fees</strong> - this is typically covered by your employer in Dubai.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Your employer submits activation request through Sheryan</li>
                      <li>Provide employment offer letter to your employer</li>
                      <li><strong>Employer pays license activation fees</strong> (AED 1,020-3,020)</li>
                      <li>Complete any additional requirements with employer support</li>
                      <li>Wait for activation approval (3-6 weeks)</li>
                    </ul>
                    <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-200 text-sm">
                        <strong>Good News:</strong> License activation fees (PKR 88,740-262,740) are paid by your employer, 
                        not by you! This significantly reduces your out-of-pocket costs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get License Button after Step 6 */}
              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-3">Need Help with License Activation?</h3>
                <p className="text-gray-300 mb-4">
                  Our experts can guide you through the final steps of your DHA license process.
                </p>
                <Link
                  to="/pricing"
                  className="inline-block bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Get License Services
                </Link>
              </div>

              {/* Step 7 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    7
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Receive Eligibility Letter</h3>
                    <p className="text-gray-300 mb-4">
                      Once your license is activated, you'll receive an official eligibility letter from DHA.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Download eligibility letter from Sheryan portal</li>
                      <li>Use this letter for job applications in Dubai</li>
                      <li>Keep digital and physical copies</li>
                      <li>This letter is valid for job applications</li>
                    </ul>
                  </div>
                </div>
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
                       <td className="py-4 px-4">Self-Assessment Fee<br/><span className="text-xs text-gray-400">(Paid in 1st week)</span></td>
                       <td className="py-4 px-4">PKR 0</td>
                       <td className="py-4 px-4">PKR 0</td>
                       <td className="py-4 px-4">PKR 0</td>
                       <td className="py-4 px-4">PKR 0</td>
                     </tr>
                     <tr className="border-b border-white/10">
                       <td className="py-4 px-4">PSV Verification<br/><span className="text-xs text-gray-400">(Paid in 2nd week)</span><br/><span className="text-xs text-blue-300">DataFlow verification</span></td>
                       <td className="py-4 px-4">PKR 87,000</td>
                       <td className="py-4 px-4">PKR 87,000</td>
                       <td className="py-4 px-4">PKR 87,000</td>
                       <td className="py-4 px-4">PKR 87,000</td>
                     </tr>
                     <tr className="border-b border-white/10">
                       <td className="py-4 px-4">DHA Registration Charges<br/><span className="text-xs text-gray-400">(Paid during application)</span></td>
                       <td className="py-4 px-4">PKR 21,250</td>
                       <td className="py-4 px-4">PKR 21,250</td>
                       <td className="py-4 px-4">PKR 21,250</td>
                       <td className="py-4 px-4">PKR 21,250</td>
                     </tr>
                     <tr className="border-b border-white/10">
                       <td className="py-4 px-4">Prometric Exam Fee<br/><span className="text-xs text-gray-400">(Paid when securing exam date)</span></td>
                       <td className="py-4 px-4">PKR 77,000</td>
                       <td className="py-4 px-4">PKR 77,000</td>
                       <td className="py-4 px-4">PKR 77,000</td>
                       <td className="py-4 px-4">PKR 77,000</td>
                     </tr>
                     <tr className="bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                       <td className="py-4 px-4 font-semibold">Total Cost (You Pay)</td>
                       <td className="py-4 px-4 font-semibold text-green-400">PKR 185,250</td>
                       <td className="py-4 px-4 font-semibold text-green-400">PKR 185,250</td>
                       <td className="py-4 px-4 font-semibold text-green-400">PKR 185,250</td>
                       <td className="py-4 px-4 font-semibold text-green-400">PKR 185,250</td>
                     </tr>
                   </tbody>
                </table>
              </div>
              
              <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-3">Updated Cost Breakdown (2025 Rates)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <h5 className="font-semibold text-green-400 mb-2">PSV Verification</h5>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• PSV Report verification: PKR 87,000 (SAR 1,200)</li>
                      <li>• Exchange rate: 72.5 PKR per SAR</li>
                      <li><strong>Total PSV Cost: PKR 87,000</strong></li>
                    </ul>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <h5 className="font-semibold text-yellow-400 mb-2">Registration & Exam</h5>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• DHA Registration: PKR 21,250 (AED 250)</li>
                      <li>• Prometric Exam: PKR 77,000 (USD 285)</li>
                      <li><strong>Total Additional: PKR 98,250</strong></li>
                    </ul>
                  </div>
                </div>
                <p className="text-blue-200 text-sm mt-3">
                  <strong>Note:</strong> PSV verification costs SAR 1,200 (PKR 87,000 at 72.5 PKR/SAR), DHA registration costs AED 250 (PKR 21,250 at 85 PKR/AED), and Prometric exam costs USD 285 (PKR 77,000 at 270 PKR/USD).
                </p>
              </div>
              
              <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-200">
                  <strong>Note:</strong> Costs are based on current exchange rates (1 SAR = 72.5 PKR, 1 AED = 85 PKR, 1 USD = 270 PKR). 
                  Service providers like Hiaraise may offer package deals that can reduce overall costs.
                </p>
              </div>
              
              <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-200">
                  <strong>💰 Save Money:</strong> You can save up to 15% on your DHA license application costs by using our exclusive vouchers and package deals. 
                  With exam fees of PKR 77,000, our vouchers can save you significant money. Contact Hiaraise to learn about our special offers for Pakistani healthcare professionals.
                </p>
              </div>
              
              <div className="mt-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200">
                  <strong>Important:</strong> License activation fees are typically paid by your employer 
                  (DHA-licensed healthcare facility) in Dubai. You only need to pay the initial application 
                  fees (self-assessment, PSV verification, DHA registration, and Prometric exam fees) from Pakistan.
                </p>
              </div>

              {/* Get License Button after Price Breakdown */}
              <div className="mt-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-3">Save Money with Our License Services</h3>
                <p className="text-gray-300 mb-4">
                  Get exclusive discounts and professional assistance to reduce your DHA license costs.
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
            <h2 className="text-3xl font-bold text-white mb-8">Timeline for DHA License from Pakistan</h2>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div>
                    <span className="text-white font-semibold">Week 1:</span>
                    <span className="text-gray-300 ml-2">Sheryan account creation and self-assessment completion</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <div>
                    <span className="text-white font-semibold">Week 2-4:</span>
                    <span className="text-gray-300 ml-2">Document submission and PSV verification process (2-3 weeks)</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div>
                    <span className="text-white font-semibold">Week 5:</span>
                    <span className="text-gray-300 ml-2">DHA exam scheduling and preparation</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <div>
                    <span className="text-white font-semibold">Week 6-8:</span>
                    <span className="text-gray-300 ml-2">License activation and eligibility letter issuance (1-3 weeks)</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200">
                  <strong>Total Timeline:</strong> 4-8 weeks for Pakistani applicants, depending on PSV verification speed, 
                  exam scheduling availability, and employer processing time for license activation.
                </p>
              </div>
              
              <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-200">
                  <strong>Fast Track Option:</strong> Using professional services like Hiaraise can reduce the overall 
                  timeline by 1-2 weeks through expedited document processing and exam preparation support.
                </p>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions for Pakistani Applicants</h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">How to apply for a DHA license from Pakistan?</h3>
                <p className="text-gray-300">
                  Pakistani healthcare professionals can apply for DHA license by creating a Sheryan account, completing self-assessment, 
                  submitting documents for PSV verification, scheduling and passing the DHA exam, then activating their license remotely. 
                  The entire process can be completed from Pakistan without visiting Dubai.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">What is the total cost of DHA license in Pakistani Rupees (PKR)?</h3>
                <p className="text-gray-300">
                  The total cost you need to pay is PKR 185,250 for all healthcare professionals. This includes self-assessment (free), 
                  PSV verification (PKR 87,000), DHA registration (PKR 21,250), and Prometric exam fees (PKR 77,000). License activation fees are typically paid by your employer in Dubai.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">How much does the DHA Prometric exam cost in PKR?</h3>
                <p className="text-gray-300">
                  DHA Prometric exam fees are PKR 77,000 (USD $285) for all healthcare professionals. This is a significant cost, but you can save money using our exclusive vouchers.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">How can I complete Primary Source Verification (PSV) from Pakistan?</h3>
                <p className="text-gray-300">
                  PSV is handled by DataFlow, DHA's verification partner. Pakistani applicants submit their educational certificates, 
                  experience letters, and other documents through the DataFlow portal. The verification process takes 2-3 weeks 
                  and can be completed entirely from Pakistan.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">How can I pay DHA fees from Pakistan?</h3>
                <p className="text-gray-300">
                  DHA fees can be paid from Pakistan using international credit/debit cards, bank transfers, or through service providers 
                  like Hiaraise who can facilitate payments in PKR. Most Pakistani banks offer international payment services for this purpose.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Can I schedule the DHA exam while in Pakistan?</h3>
                <p className="text-gray-300">
                  Yes, you can schedule the DHA exam remotely from Pakistan. The exam can be taken online or at designated centers in Pakistan. 
                  Consider Pakistan's time zone when scheduling to ensure optimal exam conditions.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">What are the document requirements for Pakistani applicants?</h3>
                <p className="text-gray-300">
                  Required documents include: Pakistani educational certificates (attested), professional experience letters, 
                  passport copy, recent photograph, and any additional certificates relevant to your profession. 
                  All documents must be in English or officially translated.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">How long does it take to get a DHA license from Pakistan?</h3>
                <p className="text-gray-300">
                  The entire process typically takes 4-8 weeks from Pakistan, including account creation (1 week), document verification (2-3 weeks), 
                  exam scheduling and preparation (1 week), and license activation (1-3 weeks). PSV verification is usually the longest step.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Who pays the license activation fee?</h3>
                <p className="text-gray-300">
                  License activation fees are typically paid by your employer (DHA-licensed healthcare facility) in Dubai. 
                  As a Pakistani applicant, you only need to pay the initial application fees: self-assessment (free), 
                  PSV verification (PKR 87,000), DHA registration (PKR 21,250), and Prometric exam fees (PKR 77,000).
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">What if I fail the DHA exam – how can I retake it from Pakistan?</h3>
                <p className="text-gray-300">
                  If you fail the DHA exam, you can retake it from Pakistan after a waiting period (usually 30 days). 
                  You'll need to pay the exam fee again (PKR 77,000) and schedule a new exam date. There's no limit on retake attempts, 
                  but each attempt requires payment of the full exam fee.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Are there any services that can help with DHA license application from Pakistan?</h3>
                <p className="text-gray-300">
                  Yes, service providers like Hiaraise specialize in helping Pakistani healthcare professionals obtain DHA licenses. 
                  They provide complete application assistance, document preparation, exam preparation support, and payment facilitation, 
                  making the entire process much smoother for Pakistani applicants.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">What is the process for activating a DHA license remotely?</h3>
                <p className="text-gray-300">
                  License activation can be done remotely through the Sheryan portal. You'll need to submit an activation request, 
                  provide employment offer letter (if available), pay activation fees, and complete any additional requirements. 
                  The process typically takes 2-4 weeks for approval.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">What is the renewal process for DHA license from Pakistan?</h3>
                <p className="text-gray-300">
                  DHA licenses need to be renewed every 2 years. The renewal process can be completed from Pakistan through the Sheryan portal. 
                  You'll need to pay renewal fees, provide updated documents if required, and complete any continuing education requirements.
                </p>
              </div>
            </div>
          </section>

          {/* Service Provider Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Why Choose Hiaraise for Your DHA License Application?</h2>
            
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-8">
              <p className="text-lg text-gray-300 mb-6">
                Pakistani healthcare professionals can significantly simplify their DHA license application process by using 
                professional services like <strong>Hiaraise</strong>. Here's how we can help:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Complete Application Support</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Sheryan account setup assistance</li>
                    <li>Document preparation and verification</li>
                    <li>PSV process guidance</li>
                    <li>Exam scheduling and preparation</li>
                    <li>License activation support</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Payment Facilitation</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Pay fees in Pakistani Rupees (PKR)</li>
                    <li>Secure payment processing</li>
                    <li>Transparent pricing</li>
                    <li>Package deals available</li>
                    <li>No hidden charges</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Pros of Using Hiaraise vs. Self-Application</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">With Hiaraise</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                      <li>Expert guidance throughout process</li>
                      <li>Faster document processing</li>
                      <li>Reduced chances of errors</li>
                      <li>Ongoing support and updates</li>
                      <li>Stress-free experience</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">Self-Application</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                      <li>Requires extensive research</li>
                      <li>Higher chance of mistakes</li>
                      <li>Time-consuming process</li>
                      <li>No support if issues arise</li>
                      <li>Potential delays and rejections</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Get License Section */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-xl border border-green-500/30 rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Your DHA License?</h2>
              <p className="text-lg text-gray-300 mb-6">
                Start your DHA licensing journey today with our comprehensive service package. 
                Get expert guidance, document support, and exam preparation assistance.
              </p>
              
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">What's Included in Our DHA License Service:</h3>
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
                      <span className="text-gray-300">Exam preparation materials</span>
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
                      <span className="text-gray-300">License activation support</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => {
                    trackButtonClick('get_license_dha', 'dha_page');
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
                  href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I need tailored services for DHA licensing process. Please provide me with a customized quote.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackButtonClick('get_tailored_services_dha', 'dha_page')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Get Tailored Services
                </a>
              </div>
              
              <p className="text-sm text-gray-400 mt-4">
                Join hundreds of Pakistani healthcare professionals who have successfully obtained their DHA licenses with Hiaraise
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-blue-500/30 rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your DHA License Journey?</h2>
              <p className="text-lg text-gray-300 mb-6">
                Don't navigate the complex DHA licensing process alone. Let Hiaraise guide you through every step 
                and ensure your success as a Pakistani healthcare professional in Dubai.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I need free consultation about DHA licensing process.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackButtonClick('whatsapp_consultation_dha', 'dha_page')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Get Free Consultation
                </a>
                <button 
                  onClick={() => {
                    trackButtonClick('eligibility_checker_dha', 'dha_page');
                    navigate('/eligibility-check');
                  }}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Check Eligibility
                </button>
              </div>
              
              <p className="text-sm text-gray-400 mt-4">
                Join hundreds of Pakistani healthcare professionals who have successfully obtained their DHA licenses with Hiaraise
              </p>
            </div>
          </section>

          {/* Internal Links */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Related Resources</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/licenses" className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-2">All License Types</h3>
                <p className="text-gray-300 text-sm">Explore other licensing options available through Hiaraise</p>
              </a>
              <a href="/countries" className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-2">Country-Specific Guides</h3>
                <p className="text-gray-300 text-sm">Learn about licensing requirements in different countries</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
