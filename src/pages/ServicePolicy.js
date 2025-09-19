import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiFileText, FiClock, FiShield, FiCheckCircle, FiAlertTriangle, FiTruck } from 'react-icons/fi';

export default function ServicePolicy() {
  return (
    <>
      <Helmet>
        <title>Service & Shipping Policy | Hiaraise MedLicense</title>
        <meta name="description" content="Service and shipping policy for Hiaraise MedLicense: scope of services, delivery timelines, fulfillment, cancellations, and customer responsibilities." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Service & Shipping Policy | Hiaraise MedLicense",
          "description": "Service and shipping policy for Hiaraise MedLicense.",
          "url": "https://hiaraise.com/service-policy",
          "publisher": {
            "@type": "Organization",
            "name": "Hiaraise AI",
            "url": "https://hiaraise.com/"
          }
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />

        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link to="/" className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors duration-300 mb-8">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6">
              <FiTruck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Service & Shipping Policy</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">How our digital services are delivered and fulfilled</p>
            <div className="flex items-center justify-center space-x-4 mt-6 text-sm text-gray-400">
              <span>Last updated: {new Date().toLocaleDateString()}</span>
              <span>•</span>
              <span>Version 1.0</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12">
            <div className="prose prose-invert prose-lg max-w-none">
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiFileText className="w-6 h-6 mr-3 text-cyan-400" />
                  1. Scope of Services
                </h2>
                <p className="text-gray-300">
                  Hiaraise MedLicense provides digital, professional services for medical licensing support including document review, guidance,
                  case submission and tracking. No physical goods are shipped; all deliverables are provided digitally through our platform and email.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiClock className="w-6 h-6 mr-3 text-cyan-400" />
                  2. Delivery Timelines
                </h2>
                <ul className="space-y-2 ml-6 text-gray-300">
                  <li className="flex items-start"><FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                    Account access and onboarding: within minutes after successful payment and registration.</li>
                  <li className="flex items-start"><FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                    Document review: typically 2–3 business days.</li>
                  <li className="flex items-start"><FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                    Case submission: 1–2 business days after complete documents are received.</li>
                  <li className="flex items-start"><FiCheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                    Ongoing updates: provided via dashboard notifications and email.</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiShield className="w-6 h-6 mr-3 text-cyan-400" />
                  3. Fulfillment & Communication
                </h2>
                <p className="text-gray-300">
                  Service fulfillment occurs within your user dashboard. We also communicate progress and requirements through email and in-app
                  notifications. For in-person services (by appointment), confirmation is issued after payment.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiAlertTriangle className="w-6 h-6 mr-3 text-yellow-400" />
                  4. Delays & Dependencies
                </h2>
                <p className="text-gray-300">
                  Timelines may be impacted by regulatory authorities, third-party verifications, or incomplete/incorrect documentation. We notify you
                  promptly of any required actions to avoid delays.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiCheckCircle className="w-6 h-6 mr-3 text-green-400" />
                  5. Customer Responsibilities
                </h2>
                <ul className="space-y-2 ml-6 text-gray-300">
                  <li>Provide accurate and complete documents.</li>
                  <li>Respond to requests for information within stated timelines.</li>
                  <li>Maintain access to your registered email and dashboard.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiFileText className="w-6 h-6 mr-3 text-cyan-400" />
                  6. Cancellations & Refunds
                </h2>
                <p className="text-gray-300">
                  Please review our <Link to="/refund-policy" className="text-cyan-400 underline">Refund Policy</Link> for detailed terms. Requests can be initiated via
                  <Link to="/contact" className="text-cyan-400 underline"> Contact</Link>.
                </p>
              </section>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/terms" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 mr-4">
              View Terms and Conditions
              <FiArrowLeft className="w-4 h-4 ml-2 transform rotate-180" />
            </Link>
            <Link to="/privacy" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105">
              View Privacy Policy
              <FiArrowLeft className="w-4 h-4 ml-2 transform rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}


