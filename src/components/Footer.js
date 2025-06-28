import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Twitter, 
  Linkedin, 
  Facebook,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const THEME = {
  primary: 'bg-gradient-to-r from-blue-600 to-indigo-700',
  secondary: 'bg-gradient-to-r from-purple-600 to-pink-600',
  success: 'bg-gradient-to-r from-green-500 to-emerald-600',
  danger: 'bg-gradient-to-r from-red-500 to-rose-600',
  warning: 'bg-gradient-to-r from-yellow-400 to-amber-500',
  info: 'bg-gradient-to-r from-cyan-500 to-blue-500',
  dark: 'bg-gradient-to-r from-gray-800 to-gray-900',
  light: 'bg-gradient-to-r from-gray-100 to-gray-200',
  card: 'bg-white/10 backdrop-blur-xl border border-white/20',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20'
};

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
  >
    {children}
  </Link>
);

const SocialLink = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 rounded-xl text-gray-400 hover:text-cyan-400 hover:bg-white/10 transition-all duration-300"
    aria-label={label}
  >
    <Icon className="text-xl" />
  </a>
);

const ContactItem = ({ icon: Icon, children }) => (
  <div className="flex items-center space-x-3 text-gray-400">
    <Icon className="text-cyan-400" />
    <span>{children}</span>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-white/10 backdrop-blur-xl border-t border-white/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                MedLicense AI
              </span>
            </Link>
            <p className="text-gray-300 text-sm">
              Empowering healthcare professionals with AI-driven medical licensing solutions.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={Twitter} label="Twitter" />
              <SocialLink href="#" icon={Linkedin} label="LinkedIn" />
              <SocialLink href="#" icon={Facebook} label="Facebook" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center space-x-2 group">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center space-x-2 group">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  <span>Services</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center space-x-2 group">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  <span>Contact</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center space-x-2 group">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/submit-case" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center space-x-2 group">
                  <Sparkles className="w-4 h-4" />
                  <span>License Application</span>
                </Link>
              </li>
              <li>
                <Link to="/case-tracking" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center space-x-2 group">
                  <Shield className="w-4 h-4" />
                  <span>Case Tracking</span>
                </Link>
              </li>
              <li>
                <Link to="/payment-history" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center space-x-2 group">
                  <Globe className="w-4 h-4" />
                  <span>Payment History</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span>support@medlicense.ai</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-cyan-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>123 Medical Plaza, Suite 100<br />Healthcare City, HC 12345</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

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
              <Link to="/cookies" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 