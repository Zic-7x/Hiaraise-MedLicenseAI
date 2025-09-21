import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// TypeScript interfaces for type safety
/**
 * @typedef {Object} AppointmentSlot
 * @property {string} id
 * @property {string} date
 * @property {string} start_time
 * @property {string} end_time
 * @property {string} location
 * @property {number} fee
 */
/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string} full_name
 * @property {string} email
 * @property {string} phone
 */
/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} slot_id
 * @property {string} user_id
 * @property {string} guest_name
 * @property {string} guest_email
 * @property {string} guest_phone
 * @property {string} payment_id
 * @property {string} status
 * @property {string} created_at
 * @property {AppointmentSlot} appointment_slots
 * @property {Profile} profiles
 * @property {string} admin_message
 */

const PAGE_SIZE = 10;

export default function AdminAppointmentBookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  // Add a state to store payment proofs
  const [paymentProofs, setPaymentProofs] = useState({});

  useEffect(() => {
    fetchBookings();
    // Real-time subscription
    const subscription = supabase
      .channel('public:appointment_bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointment_bookings' }, () => {
        fetchBookings();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
    // eslint-disable-next-line
  }, [statusFilter, page]);

  // Fetch payment proofs for visible bookings
  useEffect(() => {
    const fetchProofs = async () => {
      const ids = bookings.map(b => b.payment_id).filter(Boolean);
      if (ids.length === 0) return;
      const { data, error } = await supabase
        .from('payments')
        .select('id, screenshot_url')
        .in('id', ids);
      if (!error && data) {
        const proofs = {};
        data.forEach(p => { proofs[p.id] = p.screenshot_url; });
        setPaymentProofs(proofs);
      }
    };
    fetchProofs();
  }, [bookings]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    let query = supabase
      .from('appointment_bookings')
      .select('*, appointment_slots(*), profiles(id, full_name, email, phone)')
      .order('created_at', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    const { data, error, count } = await query;
    if (error) {
      setError('Failed to fetch bookings: ' + error.message);
      setBookings([]);
    } else {
      setBookings(data || []);
      setTotal(count || 0);
    }
    setLoading(false);
  };

  const handleStatus = async (id, newStatus, adminMsg) => {
    setLoading(true);
    setError('');
    if (adminMsg && adminMsg.length > 500) {
      setError('Admin message must be 500 characters or less.');
      setLoading(false);
      return;
    }
    // Fetch the booking to get the slot_id
    let slotId = null;
    const { data: bookingData, error: bookingError } = await supabase
      .from('appointment_bookings')
      .select('slot_id')
      .eq('id', id)
      .single();
    if (!bookingError && bookingData) {
      slotId = bookingData.slot_id;
    }
    // Update booking status
    const { error } = await supabase
      .from('appointment_bookings')
      .update({ status: newStatus, admin_message: adminMsg || null })
      .eq('id', id);
    if (error) setError('Failed to update booking: ' + error.message);
    // If status is confirmed or booked, update slot as well
    if ((newStatus === 'confirmed' || newStatus === 'booked') && slotId) {
      await supabase
        .from('appointment_slots')
        .update({ is_booked: true, is_available: false })
        .eq('id', slotId);
    }
    setEditId(null);
    setMessage('');
    await fetchBookings();
    setLoading(false);
  };

  // Pagination controls
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

  // Helper for time parsing
  const parseTime = t => {
    if (!t) return 'N/A';
    const d = new Date(t);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8 max-w-5xl mx-auto mt-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent mb-6 text-center">Manage Appointment Bookings</h2>
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <label htmlFor="statusFilter" className="text-white font-semibold">Filter by status:</label>
        <select
          id="statusFilter"
          aria-label="Filter by status"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="p-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="all">All</option>
          <option value="booked">Booked</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
          <option value="reschedule_requested">Reschedule Requested</option>
        </select>
      </div>
      {error && <div className="text-red-400 font-semibold mb-4" role="alert">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-white" aria-label="Appointment Bookings">
          <thead>
            <tr className="bg-pink-900/40">
              <th className="p-2" scope="col">User/Guest</th>
              <th className="p-2" scope="col">Email</th>
              <th className="p-2" scope="col">Phone</th>
              <th className="p-2" scope="col">Slot</th>
              <th className="p-2" scope="col">Fee</th>
              <th className="p-2" scope="col">Payment ID</th>
              <th className="p-2" scope="col">Payment Proof</th>
              <th className="p-2" scope="col">Status</th>
              <th className="p-2" scope="col">Admin Message</th>
              <th className="p-2" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => {
              const missingSlot = !booking.appointment_slots;
              if (missingSlot) {
                console.warn('Booking missing appointment_slots:', booking);
              }
              return (
                <tr key={booking.id} className={`border-b border-white/10 ${missingSlot ? 'bg-red-900/40' : ''}`} aria-label={missingSlot ? 'Booking missing slot' : undefined}>
                  <td className="p-2">{booking.user_id ? booking.profiles?.full_name || 'User' : booking.guest_name || 'Guest'}</td>
                  <td className="p-2">{booking.user_id ? booking.profiles?.email || '' : booking.guest_email || ''}</td>
                  <td className="p-2">{booking.user_id ? booking.profiles?.phone || '' : booking.guest_phone || ''}</td>
                  <td className="p-2">
                    {booking.appointment_slots
                      ? `${booking.appointment_slots.date} ${parseTime(booking.appointment_slots.start_time)}-${parseTime(booking.appointment_slots.end_time)} @ ${booking.appointment_slots.location}`
                      : <span className="text-red-300">Missing Slot</span>}
                  </td>
                  <td className="p-2">{booking.appointment_slots?.fee || ''}</td>
                  <td className="p-2">{booking.payment_id || '—'}</td>
                  <td className="p-2">
                    {booking.payment_id && paymentProofs[booking.payment_id] ? (
                      <a href={paymentProofs[booking.payment_id]} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">View Screenshot</a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="p-2 capitalize">{booking.status}</td>
                  <td className="p-2">
                    {editId === booking.id ? (
                      <input
                        type="text"
                        value={message}
                        maxLength={500}
                        aria-label="Admin message"
                        onChange={e => setMessage(e.target.value)}
                        className="p-1 rounded bg-white/20 border border-white/30 text-white w-40"
                        placeholder="Admin message (max 500 chars)"
                      />
                    ) : (
                      booking.admin_message || ''
                    )}
                  </td>
                  <td className="p-2 flex gap-2">
                    {editId === booking.id ? (
                      <>
                        <button onClick={() => handleStatus(booking.id, 'booked', message)} className="bg-blue-500/80 hover:bg-blue-600/90 text-white px-3 py-1 rounded" aria-label="Set Booked">Booked</button>
                        <button onClick={() => handleStatus(booking.id, 'pending', message)} className="bg-yellow-500/80 hover:bg-yellow-600/90 text-white px-3 py-1 rounded" aria-label="Set Pending">Pending</button>
                        <button onClick={() => handleStatus(booking.id, 'confirmed', message)} className="bg-green-500/80 hover:bg-green-600/90 text-white px-3 py-1 rounded" aria-label="Set Confirmed">Confirmed</button>
                        <button onClick={() => handleStatus(booking.id, 'rejected', message)} className="bg-red-500/80 hover:bg-red-600/90 text-white px-3 py-1 rounded" aria-label="Set Rejected">Reject</button>
                        <button onClick={() => handleStatus(booking.id, 'reschedule_requested', message)} className="bg-yellow-700/80 hover:bg-yellow-800/90 text-white px-3 py-1 rounded" aria-label="Request Reschedule">Reschedule</button>
                        <button onClick={() => { setEditId(null); setMessage(''); }} className="bg-gray-500/80 hover:bg-gray-600/90 text-white px-3 py-1 rounded" aria-label="Cancel Edit">Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => { setEditId(booking.id); setMessage(booking.admin_message || ''); }} className="bg-pink-500/80 hover:bg-pink-600/90 text-white px-3 py-1 rounded" aria-label="Manage Booking">Manage</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button onClick={handlePrev} disabled={page === 1} className="px-4 py-2 rounded bg-pink-500/80 hover:bg-pink-600/90 text-white disabled:opacity-50" aria-label="Previous Page">Prev</button>
        <span className="text-white">Page {page} of {totalPages || 1}</span>
        <button onClick={handleNext} disabled={page === totalPages || totalPages === 0} className="px-4 py-2 rounded bg-pink-500/80 hover:bg-pink-600/90 text-white disabled:opacity-50" aria-label="Next Page">Next</button>
      </div>
      {loading && <div className="text-pink-300 text-center mt-4" role="status">Loading...</div>}
    </div>
  );
} 