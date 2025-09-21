import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

export default function UserAppointmentHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('User not logged in.');
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('appointment_bookings')
      .select('*, appointment_slots(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      setError('Failed to fetch appointment bookings.');
      setBookings([]);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-display font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-8 text-center"
      >
        My Appointment Bookings
      </motion.h1>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl max-w-3xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="text-gray-300 ml-4">Loading appointments...</p>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center flex flex-col items-center justify-center h-48">
            <p className="text-lg">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No appointment bookings found.</div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-white text-lg">Physical Appointment</p>
                    <p className="text-md text-gray-300 mt-1">Date: {booking.appointment_slots?.date}</p>
                    <p className="text-md text-gray-300 mt-1">Time: {booking.appointment_slots?.start_time ? new Date(booking.appointment_slots.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} - {booking.appointment_slots?.end_time ? new Date(booking.appointment_slots.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                    <p className="text-md text-gray-300 mt-1">Location: {booking.appointment_slots?.location}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    booking.status === 'confirmed' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                    booking.status === 'pending' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' :
                    'bg-gradient-to-r from-red-400 to-rose-500 text-white'
                  }`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                </div>
                {booking.status === 'confirmed' ? (
                  <div className="text-green-300 mt-2">Your appointment is confirmed. Please arrive on time.</div>
                ) : booking.status === 'pending' && (
                  <div className="text-yellow-500 font-semibold mt-2">
                    Your appointment is awaiting for confirmation
                  </div>
                )}
                {booking.status === 'rejected' ? (
                  <div className="text-red-300 mt-2">Your appointment booking was rejected. Please contact support.</div>
                ) : null}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
