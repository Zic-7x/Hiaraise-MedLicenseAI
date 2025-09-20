import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { isAfter } from 'date-fns';

export default function AdminAppointmentSlotManager() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const LOCATION_OPTIONS = [
    "Headquarters | Downtown Lake City C-31 Bella Vista, Lake City Downtown Lahore.",
    // Add more locations here in the future
  ];
  const [form, setForm] = useState({ date: '', start_time: '', end_time: '', fee: '', location: LOCATION_OPTIONS[0] });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ date: '', start_time: '', end_time: '', fee: '', is_available: true, location: LOCATION_OPTIONS[0] });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSlots();
    // Set up interval to check for expired slots every minute
    const interval = setInterval(checkExpiredSlots, 60000);
    return () => clearInterval(interval);
  }, []);

  // Check for expired slots and close them automatically
  const checkExpiredSlots = async () => {
    const now = new Date();
    const expiredSlots = slots.filter(slot => {
      const slotEndTime = new Date(slot.end_time);
      return slot.is_available && isAfter(now, slotEndTime);
    });

    if (expiredSlots.length > 0) {
      const expiredSlotIds = expiredSlots.map(slot => slot.id);
      const { error } = await supabase
        .from('appointment_slots')
        .update({ is_available: false })
        .in('id', expiredSlotIds);
      
      if (!error) {
        // Update local state
        setSlots(prevSlots => 
          prevSlots.map(slot => 
            expiredSlotIds.includes(slot.id) 
              ? { ...slot, is_available: false }
              : slot
          )
        );
      }
    }
  };

  // Function to close a slot when it's booked
  const closeBookedSlot = async (slotId) => {
    const { error } = await supabase
      .from('appointment_slots')
      .update({ is_available: false })
      .eq('id', slotId);
    
    if (!error) {
      setSlots(prevSlots => 
        prevSlots.map(slot => 
          slot.id === slotId 
            ? { ...slot, is_available: false }
            : slot
        )
      );
    }
  };

  // Set up real-time subscription for appointment booking changes
  useEffect(() => {
    const subscription = supabase
      .channel('appointment_bookings_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'appointment_bookings' 
        }, 
        (payload) => {
          // When a new appointment booking is made, close the corresponding slot
          if (payload.new && payload.new.slot_id) {
            closeBookedSlot(payload.new.slot_id);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointment_slots')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });
    if (!error) setSlots(data);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate that the slot time is in the future
    const slotStartTime = new Date(`${form.date}T${form.start_time}`);
    const now = new Date();
    
    if (isAfter(now, slotStartTime)) {
      setError('Cannot create slots in the past.');
      setLoading(false);
      return;
    }
    
    // Combine date and time into ISO timestamp strings
    const startTimestamp = `${form.date}T${form.start_time}:00+05:00`;
    const endTimestamp = `${form.date}T${form.end_time}:00+05:00`;
    const { error } = await supabase.from('appointment_slots').insert([
      {
        date: form.date,
        start_time: startTimestamp,
        end_time: endTimestamp,
        fee: Number(form.fee),
        location: form.location,
        is_available: true
      }
    ]);
    if (error) setError('Failed to add slot.');
    setForm({ date: '', start_time: '', end_time: '', fee: '', location: LOCATION_OPTIONS[0] });
    await fetchSlots();
    setLoading(false);
  };

  const handleEdit = (slot) => {
    setEditingId(slot.id);
    setEditForm({
      date: slot.date,
      start_time: slot.start_time,
      end_time: slot.end_time,
      fee: slot.fee,
      is_available: slot.is_available,
      location: slot.location
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    setError('');
    
    // Validate that the updated slot time is in the future
    const slotStartTime = new Date(`${editForm.date}T${editForm.start_time}`);
    const now = new Date();
    
    if (isAfter(now, slotStartTime)) {
      setError('Cannot set slots in the past.');
      setLoading(false);
      return;
    }
    
    const { error } = await supabase.from('appointment_slots').update({ ...editForm, fee: Number(editForm.fee) }).eq('id', id);
    if (error) setError('Failed to update slot.');
    setEditingId(null);
    await fetchSlots();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    const { error } = await supabase.from('appointment_slots').delete().eq('id', id);
    if (error) setError('Failed to delete slot.');
    await fetchSlots();
    setLoading(false);
  };

  // Manual close slot
  const handleCloseSlot = async (id) => {
    setLoading(true);
    setError('');
    const { error } = await supabase
      .from('appointment_slots')
      .update({ is_available: false })
      .eq('id', id);
    if (error) setError('Failed to close slot.');
    await fetchSlots();
    setLoading(false);
  };

  // Get slot status
  const getSlotStatus = (slot) => {
    const now = new Date();
    const slotEndTime = new Date(slot.end_time);
    
    if (!slot.is_available) {
      return { status: 'closed', color: 'text-red-400', bgColor: 'bg-red-900/20' };
    }
    
    if (isAfter(now, slotEndTime)) {
      return { status: 'expired', color: 'text-orange-400', bgColor: 'bg-orange-900/20' };
    }
    
    return { status: 'available', color: 'text-green-400', bgColor: 'bg-green-900/20' };
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8 max-w-5xl mx-auto mt-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent mb-6 text-center">Manage Physical Appointment Slots</h2>
      
      {/* Auto-close info */}
      <div className="bg-pink-900/20 border border-pink-400/30 rounded-lg p-4 mb-6">
        <h3 className="text-pink-400 font-semibold mb-2">🔄 Automatic Slot Management</h3>
        <ul className="text-pink-200 text-sm space-y-1">
          <li>• Slots automatically close when their time has passed</li>
          <li>• Slots automatically close when someone books them</li>
          <li>• System checks for expired slots every minute</li>
        </ul>
      </div>
      
      <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end mb-8">
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
          className="p-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
        <input
          type="time"
          name="start_time"
          value={form.start_time}
          onChange={e => setForm({ ...form, start_time: e.target.value })}
          className="p-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
        <input
          type="time"
          name="end_time"
          value={form.end_time}
          onChange={e => setForm({ ...form, end_time: e.target.value })}
          className="p-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
        <input
          type="number"
          name="fee"
          value={form.fee}
          onChange={e => setForm({ ...form, fee: e.target.value })}
          className="p-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Fee (PKR)"
          min="0"
          required
        />
        <select
          name="location"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
          className="p-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        >
          {LOCATION_OPTIONS.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-pink-600 hover:to-red-600 transition-all duration-200"
          disabled={loading}
        >
          Add Slot
        </button>
      </form>
      {error && <div className="text-red-400 font-semibold mb-4">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-white">
          <thead>
            <tr className="bg-pink-900/40">
              <th className="p-2">Date</th>
              <th className="p-2">Start Time</th>
              <th className="p-2">End Time</th>
              <th className="p-2">Fee (PKR)</th>
              <th className="p-2">Status</th>
              <th className="p-2">Available</th>
              <th className="p-2">Location</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map(slot => {
              const slotStatus = getSlotStatus(slot);
              return (
                <tr key={slot.id} className={`border-b border-white/10 ${slotStatus.bgColor}`}>
                  {editingId === slot.id ? (
                    <>
                      <td className="p-2"><input type="date" name="date" value={editForm.date} onChange={handleEditChange} className="p-1 rounded bg-white/20 border border-white/30 text-white" /></td>
                      <td className="p-2"><input type="time" name="start_time" value={editForm.start_time} onChange={handleEditChange} className="p-1 rounded bg-white/20 border border-white/30 text-white" /></td>
                      <td className="p-2"><input type="time" name="end_time" value={editForm.end_time} onChange={handleEditChange} className="p-1 rounded bg-white/20 border border-white/30 text-white" /></td>
                      <td className="p-2"><input type="number" name="fee" value={editForm.fee} onChange={handleEditChange} className="p-1 rounded bg-white/20 border border-white/30 text-white" min="0" /></td>
                      <td className="p-2"><span className={`px-2 py-1 rounded text-xs ${slotStatus.color} ${slotStatus.bgColor}`}>{slotStatus.status}</span></td>
                      <td className="p-2"><input type="checkbox" name="is_available" checked={editForm.is_available} onChange={handleEditChange} /></td>
                      <td className="p-2">
                        <select
                          name="location"
                          value={editForm.location}
                          onChange={handleEditChange}
                          className="p-1 rounded bg-white/20 border border-white/30 text-white"
                          required
                        >
                          {LOCATION_OPTIONS.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 flex gap-2">
                        <button onClick={() => handleUpdate(slot.id)} className="bg-green-500/80 hover:bg-green-600/90 text-white px-3 py-1 rounded text-xs">Save</button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-500/80 hover:bg-gray-600/90 text-white px-3 py-1 rounded text-xs">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2">{slot.date}</td>
                      <td className="p-2">{slot.start_time ? new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</td>
                      <td className="p-2">{slot.end_time ? new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</td>
                      <td className="p-2">{slot.fee}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${slotStatus.color} ${slotStatus.bgColor}`}>
                          {slotStatus.status}
                        </span>
                      </td>
                      <td className="p-2">{slot.is_available ? 'Yes' : 'No'}</td>
                      <td className="p-2">{slot.location}</td>
                      <td className="p-2 flex gap-2">
                        <button onClick={() => handleEdit(slot)} className="bg-yellow-500/80 hover:bg-yellow-600/90 text-white px-3 py-1 rounded text-xs">Edit</button>
                        {slot.is_available && (
                          <button onClick={() => handleCloseSlot(slot.id)} className="bg-orange-500/80 hover:bg-orange-600/90 text-white px-3 py-1 rounded text-xs">Close</button>
                        )}
                        <button onClick={() => handleDelete(slot.id)} className="bg-red-500/80 hover:bg-red-600/90 text-white px-3 py-1 rounded text-xs">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {loading && <div className="text-pink-300 text-center mt-4">Loading...</div>}
    </div>
  );
} 