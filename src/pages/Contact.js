import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { trackEvent, trackFormSubmission, trackButtonClick } from '../utils/analytics';
import { useAnalytics, useFormAnalytics } from '../utils/useAnalytics';
import { trackMetaPixelViewContent, trackMetaPixelContact, trackMetaPixelFormSubmission } from '../utils/metaPixel';
import { Helmet } from 'react-helmet';
import BookingForm from '../components/BookingForm';
import BookPhysicalAppointmentModal from '../components/BookPhysicalAppointmentModal';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  
  // Enable automatic page tracking
  useAnalytics();
  const { trackFormStart, trackFormFieldInteraction } = useFormAnalytics('contact_form');

  useEffect(() => {
    // Track page view
    trackEvent('page_viewed', 'engagement', 'contact_page');
    trackMetaPixelViewContent('Contact Page');
    trackFormStart();
  }, [trackFormStart]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFieldFocus = (fieldName) => {
    trackFormFieldInteraction(fieldName, 'focus');
  };

  const handleFieldBlur = (fieldName) => {
    trackFormFieldInteraction(fieldName, 'blur');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Track form submission
    trackFormSubmission('contact_form');
    trackMetaPixelContact();
    trackMetaPixelFormSubmission('Contact Form');
    
    try {
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: form.name,
          email: form.email,
          message: form.message,
        },
      ]);
      if (error) throw error;
      
      // Track successful submission
      trackEvent('contact_submitted', 'engagement', 'contact_form');
      
      setSubmitted(true);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      // Track error
      trackEvent('contact_error', 'engagement', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessageClick = () => {
    trackButtonClick('send_message', 'contact_page');
  };

  return (
    <>
      <Helmet>
        <title>Contact Hiaraise | Get in Touch</title>
        <meta name="description" content="Contact Hiaraise for support, questions, or partnership opportunities. Our team is here to help you with your medical licensing journey." />
      </Helmet>
      <div className="min-h-screen py-12">
        <section className="text-center py-12 mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">Contact Us</h1>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">Have questions or need help? Reach out to our team and we'll get back to you promptly.</p>
        </section>

        {/* Move Booking Section to Top */}
        <section className="max-w-2xl mx-auto mb-12">
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">Book a Consultation or Appointment</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Consultation Call */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-white mb-2">Free Consultation Call</h3>
              <p className="text-gray-300 mb-4 text-center">Schedule a free 15-minute call with our team to discuss your needs and get expert advice.</p>
              <button
                onClick={() => setShowBookingModal(true)}
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Book Free Call
              </button>
              <a
                href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I would like to chat on WhatsApp about your services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackButtonClick('whatsapp_contact_contact_page', 'contact_page')}
                className="mt-3 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
                aria-label="Chat with us on WhatsApp"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
            {/* Modal for BookingForm */}
            {showBookingModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2 sm:p-6 w-full max-w-2xl mx-2 sm:mx-0 relative max-h-[95vh] flex flex-col">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="absolute top-3 right-3 text-white bg-red-500/80 hover:bg-red-600/90 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow z-10"
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <div className="overflow-y-auto flex-1 px-2 sm:px-0" style={{ maxHeight: '85vh' }}>
                    <BookingForm />
                  </div>
                </div>
              </div>
            )}
            {/* Paid Physical Appointment */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-white mb-2">Book a Physical Appointment</h3>
              <p className="text-gray-300 mb-4 text-center">Meet our experts in person at our Lahore office. This is a paid service. Payment is required to confirm your booking.</p>
              <button
                onClick={() => { setShowAppointmentModal(true); setShowBookingModal(false); }}
                className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-pink-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
              >
                Book Physical Appointment
              </button>
              <span className="text-xs text-red-300 mt-2">* Payment required</span>
            </div>
            {/* Modal for BookPhysicalAppointmentModal */}
            {showAppointmentModal && (
              <BookPhysicalAppointmentModal open={showAppointmentModal} onClose={() => setShowAppointmentModal(false)} />
            )}
          </div>
        </section>

        {/* Office Info Section (unchanged) */}
        <section className="max-w-2xl mx-auto mb-12">
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">Office & Contact Info</h2>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 mb-4 text-gray-300">
            <div className="mb-2"><span className="font-semibold text-white">Email:</span> support@hiaraise.com</div>
            <div className="mb-2"><span className="font-semibold text-white">Office Hours:</span> Mon-Fri, 9am - 6pm PKT</div>
            <div><span className="font-semibold text-white">Location:</span> Headquarters | Downtown Lake City C-31 Bella Vista Lake City Downtown Lahore.(Appointment Only)</div>
          </div>
        </section>

        {/* Move Contact Form to End */}
        <section className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8 space-y-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2">Contact Hiaraise | Get in Touch</h2>
            {submitted ? (
              <div className="text-green-400 font-semibold">Thank you! We have received your message.</div>
            ) : (
              <>
                {error && <div className="text-red-400 font-semibold">{error}</div>}
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus('name')}
                  onBlur={() => handleFieldBlur('name')}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus('email')}
                  onBlur={() => handleFieldBlur('email')}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={form.message}
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus('message')}
                  onBlur={() => handleFieldBlur('message')}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  required
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  onClick={handleSendMessageClick}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-60" 
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </>
            )}
          </form>
        </section>
      </div>
      
      {/* WhatsApp Floating Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <a
          href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I have questions about your services.')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackButtonClick('whatsapp_contact_contact_floating', 'contact_page')}
          className="group relative w-14 h-14 rounded-full flex items-center justify-center text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
          aria-label="Contact us on WhatsApp"
        >
          <FaWhatsapp className="w-7 h-7" aria-hidden="true" />
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2 text-sm text-white whitespace-nowrap shadow-lg animate-pulse">
              Contact us on WhatsApp
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-white/10 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          </div>
        </a>
      </motion.div>
    </>
  );
} 