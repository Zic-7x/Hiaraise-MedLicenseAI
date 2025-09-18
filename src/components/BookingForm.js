import { useState } from 'react';
import { supabase } from '../supabaseClient';
import BookingCalendar from './BookingCalendar';
import CountrySelector from './CountrySelector';
import { FiCopy, FiCalendar, FiCheck, FiDownload, FiShare2, FiClock, FiUser, FiMail, FiPhone, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
// If you use a custom auth hook, replace this import:
// import { useSession } from '@supabase/auth-helpers-react';

export default function BookingForm({ session }) {
  // If you use a global auth context, you can remove the session prop and use your hook instead
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [calendarSuccess, setCalendarSuccess] = useState(false);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStatus('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    // Double-check slot availability before booking
    const { data: slotData, error: slotError } = await supabase
      .from('call_slots')
      .select('is_available')
      .eq('id', selectedSlot.id)
      .single();
    if (slotError || !slotData || !slotData.is_available) {
      setStatus('error');
      setLoading(false);
      alert('This slot has just been booked by another user or is no longer available. Please select another slot.');
      setSelectedSlot(null);
      return;
    }
    let booking = {
      slot_id: selectedSlot.id,
      status: 'pending'
    };
    if (session && session.user) {
      booking.user_id = session.user.id;
    } else {
      booking.guest_name = form.name;
      booking.guest_email = form.email;
      booking.guest_phone = selectedCountry
        ? `${selectedCountry.phoneCode}${form.phone}`
        : form.phone;
    }
    const { error } = await supabase.from('call_bookings').insert([booking]);
    if (error) {
      // Check for unique constraint violation (slot already booked)
      if (error.code === '23505' || (error.message && error.message.toLowerCase().includes('unique'))) {
        setStatus('error');
        alert('This slot has just been booked by another user. Please select another slot.');
        setSelectedSlot(null);
      } else {
        setStatus('error');
      }
    } else {
      setStatus('success');
      setBookingDetails({
        date: selectedSlot.date,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        name: booking.guest_name || (session && session.user?.user_metadata?.full_name),
        email: booking.guest_email || (session && session.user?.email),
        phone: booking.guest_phone || (session && session.user?.user_metadata?.phone),
      });
      setSelectedSlot(null);
      setForm({ name: '', email: '', phone: '' });
    }
    setLoading(false);
  };

  // Enhanced copy details with feedback
  const handleCopyDetails = async () => {
    if (!bookingDetails) return;
    
    const details = `Hiaraise Consultation Call Booking

📅 Date: ${bookingDetails.date}
⏰ Time: ${bookingDetails.start_time?.slice(0,5)} - ${bookingDetails.end_time?.slice(0,5)}
👤 Name: ${bookingDetails.name || 'N/A'}
📧 Email: ${bookingDetails.email || 'N/A'}
📱 Phone: ${bookingDetails.phone || 'N/A'}

We will contact you soon to confirm your appointment.`;

    try {
      await navigator.clipboard.writeText(details);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = details;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Enhanced calendar integration for mobile and desktop
  const handleAddToCalendar = () => {
    if (!bookingDetails) return;
    
    const start = new Date(`${bookingDetails.date}T${bookingDetails.start_time}`);
    const end = new Date(`${bookingDetails.date}T${bookingDetails.end_time}`);
    
    // Format dates for different calendar services
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const startFormatted = formatDate(start);
    const endFormatted = formatDate(end);
    
    // Create calendar event details
    const eventTitle = 'Hiaraise Consultation Call';
    const eventDescription = `Free consultation call with Hiaraise medical licensing specialists.

Your Details:
Name: ${bookingDetails.name || 'N/A'}
Email: ${bookingDetails.email || 'N/A'}
Phone: ${bookingDetails.phone || 'N/A'}

We will contact you to confirm this appointment.`;
    
    const eventLocation = 'Online Call';
    
    // Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startFormatted}/${endFormatted}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`;
    
    // Outlook/Office 365 URL
    const outlookUrl = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventTitle)}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&body=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`;
    
    // Yahoo Calendar URL
    const yahooUrl = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(eventTitle)}&st=${startFormatted}&et=${endFormatted}&desc=${encodeURIComponent(eventDescription)}&in_loc=${encodeURIComponent(eventLocation)}`;
    
    // ICS file for download
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Hiaraise//Consultation Call//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@hiaraise.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${startFormatted}
DTEND:${endFormatted}
SUMMARY:${eventTitle}
DESCRIPTION:${eventDescription.replace(/\n/g, '\\n')}
LOCATION:${eventLocation}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT15M
DESCRIPTION:Hiaraise Consultation Call Reminder
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile, show options for different calendar apps
      const calendarOptions = [
        { name: 'Google Calendar', url: googleCalendarUrl, icon: '📅' },
        { name: 'Outlook', url: outlookUrl, icon: '📧' },
        { name: 'Yahoo Calendar', url: yahooUrl, icon: '📆' },
        { name: 'Download ICS File', action: 'download', icon: '📥' }
      ];
      
      // Create a simple modal or use native sharing if available
      if (navigator.share) {
        navigator.share({
          title: eventTitle,
          text: eventDescription,
          url: googleCalendarUrl
        }).catch(() => {
          // Fallback to download
          downloadICSFile(ics);
        });
      } else {
        // Fallback to download on mobile
        downloadICSFile(ics);
      }
    } else {
      // On desktop, open Google Calendar in new tab and offer download
      window.open(googleCalendarUrl, '_blank');
      downloadICSFile(ics);
    }
    
    setCalendarSuccess(true);
    setTimeout(() => setCalendarSuccess(false), 3000);
  };

  // Helper function to download ICS file
  const downloadICSFile = (icsContent) => {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hiaraise-consultation-${bookingDetails.date}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Success message component
  const SuccessMessage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-br from-green-900/90 to-emerald-900/90 border border-green-400/30 rounded-2xl p-8 mt-6 text-center text-white shadow-2xl"
    >
      {/* Success Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-6">
        <FiCheck className="w-8 h-8 text-white" />
      </div>
      
      {/* Success Title */}
      <h3 className="text-2xl font-bold text-green-400 mb-4">
        Booking Successful! 🎉
      </h3>
      
      {/* Success Message */}
      <p className="text-gray-200 mb-6 text-lg">
        Your consultation call has been scheduled. We will contact you soon to confirm the details.
      </p>
      
      {/* Booking Details Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 mb-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FiCalendar className="w-5 h-5 mr-2 text-blue-400" />
          Booking Details
        </h4>
        <div className="space-y-3 text-left">
          <div className="flex items-center">
            <FiClock className="w-4 h-4 mr-3 text-green-400" />
            <span className="font-semibold">Date & Time:</span>
            <span className="ml-2">{bookingDetails.date} {bookingDetails.start_time?.slice(0,5)} - {bookingDetails.end_time?.slice(0,5)}</span>
          </div>
          {bookingDetails.name && (
            <div className="flex items-center">
              <FiUser className="w-4 h-4 mr-3 text-blue-400" />
              <span className="font-semibold">Name:</span>
              <span className="ml-2">{bookingDetails.name}</span>
            </div>
          )}
          {bookingDetails.email && (
            <div className="flex items-center">
              <FiMail className="w-4 h-4 mr-3 text-purple-400" />
              <span className="font-semibold">Email:</span>
              <span className="ml-2">{bookingDetails.email}</span>
            </div>
          )}
          {bookingDetails.phone && (
            <div className="flex items-center">
              <FiPhone className="w-4 h-4 mr-3 text-green-400" />
              <span className="font-semibold">Phone:</span>
              <span className="ml-2">{bookingDetails.phone}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopyDetails}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg transition-all duration-200"
        >
          <AnimatePresence mode="wait">
            {copySuccess ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center space-x-2"
              >
                <FiCheck className="w-5 h-5" />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center space-x-2"
              >
                <FiCopy className="w-5 h-5" />
                <span>Copy Details</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCalendar}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg transition-all duration-200"
        >
          <AnimatePresence mode="wait">
            {calendarSuccess ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center space-x-2"
              >
                <FiCheck className="w-5 h-5" />
                <span>Added!</span>
              </motion.div>
            ) : (
              <motion.div
                key="calendar"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center space-x-2"
              >
                <FiCalendar className="w-5 h-5" />
                <span>Add to Calendar</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      
      {/* Additional Info */}
      <div className="mt-6 text-sm text-gray-300">
        <p>📧 You will receive a confirmation email shortly</p>
        <p>📱 We'll also send you a reminder before the call</p>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Auto-expiry information banner */}
      <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <FiInfo className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-blue-400 font-semibold mb-1">🔄 Smart Slot Management</h3>
            <p className="text-blue-200 text-sm">
              Our system automatically manages slot availability. Slots close when their time passes or when booked by another user. 
              This ensures fair access and prevents double bookings.
            </p>
          </div>
        </div>
      </div>

      {/* Only show calendar and form if not in success state */}
      {status !== 'success' && (
        <>
      <BookingCalendar onSlotSelect={handleSlotSelect} session={session} />
      {selectedSlot && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8 space-y-6 mt-6"
        >
              {/* Slot expiry warning */}
              <div className="bg-amber-900/20 border border-amber-400/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <FiAlertCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-200 text-sm font-medium">
                    ⏰ This slot will be held for you for 5 minutes while you complete your booking
                  </span>
                </div>
              </div>

          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2">
            {session && session.user ? 'Confirm Your Booking' : 'Enter Your Details'}
          </h2>
          {!(session && session.user) && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
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
                className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
              <div className="flex gap-2">
                <CountrySelector
                  selectedCountry={selectedCountry}
                  onCountrySelect={setSelectedCountry}
                  className="flex-shrink-0"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}
          <div className="text-white">
            <span className="font-semibold">Selected Slot:</span>{' '}
            {selectedSlot.date} {selectedSlot.start_time.slice(0, 5)} - {selectedSlot.end_time.slice(0, 5)}
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-60"
            disabled={loading || status === 'error'}
          >
            {loading ? 'Booking...' : 'Book Now'}
          </button>
          {status === 'error' && (
            <div className="text-red-400 font-semibold mt-2">
              Booking failed. The slot may have already been booked. Please select another slot.
            </div>
          )}
        </form>
      )}
        </>
      )}
      
      {/* Enhanced Success Message */}
      {status === 'success' && bookingDetails && <SuccessMessage />}
    </div>
  );
} 