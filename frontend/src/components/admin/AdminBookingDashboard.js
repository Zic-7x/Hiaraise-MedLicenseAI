import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function AdminBookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    let query = supabase
      .from('call_bookings')
      .select('*, call_slots(*)')
      .order('requested_at', { ascending: false });
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    const { data, error } = await query;
    if (!error) setBookings(data);
    setLoading(false);
  };

  const handleStatus = async (id, newStatus, adminMsg) => {
    setLoading(true);
    setError('');
    // Fetch the booking to get the slot_id
    let slotId = null;
    const { data: bookingData, error: bookingError } = await supabase
      .from('call_bookings')
      .select('slot_id')
      .eq('id', id)
      .single();
    if (!bookingError && bookingData) {
      slotId = bookingData.slot_id;
    }
    // Update booking status
    const { error } = await supabase
      .from('call_bookings')
      .update({ status: newStatus, admin_message: adminMsg || null, confirmed_at: newStatus === 'confirmed' ? new Date().toISOString() : null })
      .eq('id', id);
    if (error) setError('Failed to update booking.');
    // If status is confirmed or booked, update slot as well
    if ((newStatus === 'confirmed' || newStatus === 'booked') && slotId) {
      await supabase
        .from('call_slots')
        .update({ is_available: false })
        .eq('id', slotId);
    }
    setEditId(null);
    setMessage('');
    await fetchBookings();
    setLoading(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8 max-w-5xl mx-auto mt-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-6 text-center">Manage Call Bookings</h2>
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <label className="text-white font-semibold">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="p-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
          <option value="reschedule_requested">Reschedule Requested</option>
        </select>
      </div>
      {error && <div className="text-red-400 font-semibold mb-4">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-white">
          <thead>
            <tr className="bg-cyan-900/40">
              <th className="p-2">User/Guest</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Slot</th>
              <th className="p-2">Status</th>
              <th className="p-2">Admin Message</th>
              <th className="p-2">Service/Type</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id} className="border-b border-white/10">
                <td className="p-2">
                  {booking.user_id
                    ? booking.profiles?.full_name || 'User'
                    : booking.guest_name || 'Guest'}
                </td>
                <td className="p-2">
                  {booking.user_id
                    ? booking.profiles?.email || ''
                    : booking.guest_email || ''}
                </td>
                <td className="p-2">
                  {booking.user_id
                    ? booking.profiles?.phone || ''
                    : booking.guest_phone || ''}
                </td>
                <td className="p-2">
                  {booking.call_slots
                    ? `${booking.call_slots.date} ${booking.call_slots.start_time?.slice(0,5)}-${booking.call_slots.end_time?.slice(0,5)}`
                    : 'N/A'}
                </td>
                <td className="p-2 capitalize">{booking.status}</td>
                <td className="p-2">
                  {editId === booking.id ? (
                    <input
                      type="text"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="p-1 rounded bg-white/20 border border-white/30 text-white w-40"
                      placeholder="Admin message"
                    />
                  ) : (
                    booking.admin_message || ''
                  )}
                </td>
                <td className="p-2">
                  {booking.payment?.appointment_slot_id ? (
                    <span>Appointment<br/>{booking.appointment_slot ? `${booking.appointment_slot.date} ${booking.appointment_slot.start_time ? new Date(booking.appointment_slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}-${booking.appointment_slot.end_time ? new Date(booking.appointment_slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} @ ${booking.appointment_slot.location}` : ''}</span>
                  ) : booking.payment?.case_id ? (
                    <span>Case<br/>{booking.case ? `#${booking.case.case_number || booking.case.id}` : ''}</span>
                  ) : booking.payment?.package_id ? (
                    <span>Package<br/>{booking.package ? booking.package.name : ''}</span>
                  ) : '—'}
                </td>
                <td className="p-2 flex gap-2">
                  {editId === booking.id ? (
                    <>
                      <button onClick={() => handleStatus(booking.id, 'confirmed', message)} className="bg-green-500/80 hover:bg-green-600/90 text-white px-3 py-1 rounded">Confirm</button>
                      <button onClick={() => handleStatus(booking.id, 'rejected', message)} className="bg-red-500/80 hover:bg-red-600/90 text-white px-3 py-1 rounded">Reject</button>
                      <button onClick={() => handleStatus(booking.id, 'reschedule_requested', message)} className="bg-yellow-500/80 hover:bg-yellow-600/90 text-white px-3 py-1 rounded">Propose New Time</button>
                      <button onClick={() => { setEditId(null); setMessage(''); }} className="bg-gray-500/80 hover:bg-gray-600/90 text-white px-3 py-1 rounded">Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => setEditId(booking.id)} className="bg-cyan-500/80 hover:bg-cyan-600/90 text-white px-3 py-1 rounded">Manage</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && <div className="text-cyan-300 text-center mt-4">Loading...</div>}
    </div>
  );
} 
