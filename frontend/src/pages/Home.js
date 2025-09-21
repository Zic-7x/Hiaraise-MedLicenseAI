import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiShield, FiClock, FiFileText, FiUser } from 'react-icons/fi';
import { Helmet } from 'react-helmet';
import { useAuthModal } from '../contexts/AuthModalContext';
import { supabase } from '../supabaseClient';
import { useState, useEffect } from 'react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-secondary-800/70 backdrop-blur-md p-6 rounded-xl border border-secondary-700/50 hover:border-primary-500/50 transition-colors group shadow-glass"
  >
    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-glow-sm">
      <Icon className="text-2xl text-white" />
    </div>
    <h3 className="text-xl font-display font-semibold text-white mb-2">{title}</h3>
    <p className="text-secondary-200 leading-relaxed">{description}</p>
  </motion.div>
);

const StepCard = ({ number, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="flex items-start space-x-4 bg-secondary-800/70 backdrop-blur-md p-6 rounded-xl border border-secondary-700/50 shadow-inner-glow"
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-glow-sm">
      {number}
    </div>
    <div>
      <h3 className="text-lg font-display font-semibold text-white mb-1">{title}</h3>
      <p className="text-secondary-200 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default function Home() {
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleRegisterClick = () => {
    if (user) {
      // User is logged in, redirect to dashboard
      navigate('/dashboard/user');
    } else {
      // User is not logged in, open auth modal
      openAuthModal('register', () => {
        navigate('/dashboard/user');
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Hiaraise - Home | Medical Licensing Made Easy</title>
        <meta name="description" content="Welcome to Hiaraise. Streamline your medical licensing process, track your application, and get expert support. Trusted by professionals globally." />
      </Helmet>
      <div className="min-h-screen bg-secondary-900 text-secondary-100">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-secondary-900 to-secondary-800">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-accent-300 to-primary-300 mb-6 leading-tight"
              >
                Medical License Portal
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-secondary-300 max-w-3xl mx-auto mb-8 leading-relaxed"
              >
                Streamline your medical license application process with our advanced digital platform.
                Experience a seamless, secure, and efficient way to manage your medical credentials.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  onClick={handleRegisterClick}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold hover:shadow-glow transition-all duration-300 flex items-center space-x-2 group"
                >
                  <span>Get Started</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  to="/about"
                  className="px-8 py-3 rounded-lg border border-secondary-700 text-secondary-300 hover:text-primary-400 hover:border-primary-500/50 transition-colors bg-secondary-800/50 backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-secondary-400 max-w-2xl mx-auto leading-relaxed">
                Experience a modern, efficient, and secure way to manage your medical license applications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={FiShield}
                title="Secure & Compliant"
                description="Your data is protected with state-of-the-art encryption and compliance measures."
                delay={0.1}
              />
              <FeatureCard
                icon={FiClock}
                title="Time-Saving"
                description="Streamlined processes and automated workflows to save you valuable time."
                delay={0.2}
              />
              <FeatureCard
                icon={FiFileText}
                title="Document Management"
                description="Efficiently manage and track all your medical credentials in one place."
                delay={0.3}
              />
              <FeatureCard
                icon={FiUser}
                title="User-Friendly"
                description="Intuitive interface designed for medical professionals of all technical levels."
                delay={0.4}
              />
              <FeatureCard
                icon={FiCheckCircle}
                title="Real-time Updates"
                description="Stay informed with instant notifications and status updates."
                delay={0.5}
              />
              <FeatureCard
                icon={FiShield}
                title="24/7 Support"
                description="Round-the-clock assistance for all your licensing needs."
                delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 mb-4">
                How It Works
              </h2>
              <p className="text-secondary-400 max-w-2xl mx-auto leading-relaxed">
                Follow these simple steps to get started with your medical license application.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              <StepCard
                number={1}
                title="Create Your Account"
                description="Sign up for a secure account and complete your profile with your medical credentials."
                delay={0.1}
              />
              <StepCard
                number={2}
                title="Submit Your Documents"
                description="Upload your required documents through our secure document management system."
                delay={0.2}
              />
              <StepCard
                number={3}
                title="Track Progress"
                description="Monitor your application status in real-time through our intuitive dashboard."
                delay={0.3}
              />
              <StepCard
                number={4}
                title="Receive Your License"
                description="Get notified when your license is approved and download it instantly."
                delay={0.4}
              />
            </div>

            <div className="text-center mt-12">
              <Link
                to="/submit-case"
                className="inline-flex items-center space-x-2 px-8 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-glow transition-all duration-300 group"
              >
                <span>Start Your Application</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-secondary-800/50 to-secondary-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-secondary-800/70 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-secondary-700/50 text-center shadow-glass">
              <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-secondary-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                Join thousands of medical professionals who trust our platform for their licensing needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleRegisterClick}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-glow transition-all duration-300 flex items-center space-x-2 group"
                >
                  <span>Create Account</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  to="/contact"
                  className="px-8 py-3 rounded-lg border border-secondary-700 text-secondary-300 hover:text-primary-400 hover:border-primary-500/50 transition-colors bg-secondary-800/50 backdrop-blur-sm"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 
