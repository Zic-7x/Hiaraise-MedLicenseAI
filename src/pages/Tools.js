import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAnalytics } from '../utils/useAnalytics';
import { Link } from 'react-router-dom';

export default function Tools() {
  useAnalytics();

  useEffect(() => {
    // No-op
  }, []);

  return (
    <>
      <Helmet>
        <title>Tools | Hiaraise</title>
        <meta name="description" content="Useful tools to help you navigate medical licensing with Hiaraise." />
      </Helmet>
      <div className="min-h-screen py-12">
        <section className="text-center py-12 mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">Tools</h1>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">Quick access to our most helpful tools.</p>
        </section>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/eligibility-check" className="block bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 hover:bg-white/15 transition">
            <div className="text-xl font-semibold text-white mb-2">Eligibility Checker</div>
            <div className="text-gray-300">See if you qualify for your target license.</div>
          </Link>
          <Link to="/start-license" className="block bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 hover:bg-white/15 transition">
            <div className="text-xl font-semibold text-white mb-2">Why to Get License</div>
            <div className="text-gray-300">Understand benefits and steps to begin.</div>
          </Link>
          <Link to="/pricing" className="block bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 hover:bg-white/15 transition">
            <div className="text-xl font-semibold text-white mb-2">Pricing</div>
            <div className="text-gray-300">Transparent plans for every stage.</div>
          </Link>
          <Link to="/support-tickets" className="block bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 hover:bg-white/15 transition">
            <div className="text-xl font-semibold text-white mb-2">Support</div>
            <div className="text-gray-300">Get help from our team.</div>
          </Link>
        </div>
      </div>
    </>
  );
}


