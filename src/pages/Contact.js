import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { trackEvent, trackFormSubmission, trackButtonClick } from '../utils/analytics';
import { useAnalytics, useFormAnalytics } from '../utils/useAnalytics';
import { trackMetaPixelViewContent, trackMetaPixelContact, trackMetaPixelFormSubmission } from '../utils/metaPixel';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
    <div className="min-h-screen py-12">
      <section className="text-center py-12 mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">Contact Us</h1>
        <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">Have questions or need help? Reach out to our team and we'll get back to you promptly.</p>
      </section>

      <section className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2">Send a Message</h2>
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

      <section className="max-w-2xl mx-auto mb-12">
        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">Office & Contact Info</h2>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 mb-4 text-gray-300">
          <div className="mb-2"><span className="font-semibold text-white">Email:</span> support@hiaraise.com</div>
          <div className="mb-2"><span className="font-semibold text-white">Office Hours:</span> Mon-Fri, 9am - 6pm PKT</div>
          <div><span className="font-semibold text-white">Location:</span> Lahore, Pakistan</div>
        </div>
      </section>
    </div>
  );
} 