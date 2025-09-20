import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white/10 backdrop-blur-xl border-t border-white/20">
      {/* Bottom Bar */}
      <div className="border-t border-white/20 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MedLicense AI. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/refund-policy" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-300">
                Refund Policy
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-300">
                Cookie Policy
              </Link>
              <Link to="/service-policy" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-300">
                Service Policy
              </Link>
              <Link to="/voucher-terms" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-300">
                Voucher Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 