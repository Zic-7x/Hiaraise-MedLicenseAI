import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { format, parseISO, isAfter, addDays } from 'date-fns';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiCalendar, FiClock, FiMapPin, FiDollarSign, FiPercent, FiUsers, FiShield } from 'react-icons/fi';

export default function AdminVoucherSlotManager() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    exam_date: '', 
    start_time: '', 
    end_time: '', 
    final_price: '', 
    max_capacity: 1,
    exam_authority: 'prometric',
    description: '',
    is_lifetime_valid: true,
    slot_expires_at: '',
    booking_timer_minutes: null
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState({ exam_authority: 'all', status: 'all' });

  useEffect(() => {
    fetchSlots();
  }, [filter]);

  const fetchSlots = async () => {
    setLoading(true);
    let query = supabase
      .from('voucher_slots')
      .select('*')
      .order('exam_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (filter.exam_authority !== 'all') {
      query = query.eq('exam_authority', filter.exam_authority);
    }

    const { data, error } = await query;
    if (!error) {
      let filteredSlots = data || [];
      
      if (filter.status !== 'all') {
        const now = new Date();
        filteredSlots = filteredSlots.filter(slot => {
          const slotEndTime = new Date(`${slot.exam_date}T${slot.end_time}`);
          if (filter.status === 'available') {
            return slot.is_available && isAfter(slotEndTime, now) && slot.current_bookings < slot.max_capacity;
          } else if (filter.status === 'sold_out') {
            return slot.current_bookings >= slot.max_capacity;
          } else if (filter.status === 'expired') {
            return !isAfter(slotEndTime, now);
          }
          return true;
        });
      }
      
      setSlots(filteredSlots);
    }
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Set final price
    const finalPrice = parseFloat(form.final_price);

    const slotData = {
      ...form,
      final_price: finalPrice,
      max_capacity: parseInt(form.max_capacity),
      current_bookings: 0,
      is_available: true
    };

    const { error } = await supabase
      .from('voucher_slots')
      .insert([slotData]);

    if (error) {
      setError('Failed to create voucher slot: ' + error.message);
    } else {
      setSuccess('Voucher slot created successfully!');
      setForm({ 
        exam_date: '', 
        start_time: '', 
        end_time: '', 
        final_price: '', 
        max_capacity: 1,
        exam_authority: 'prometric',
        description: '',
        is_lifetime_valid: true,
        slot_expires_at: '',
        booking_timer_minutes: null
      });
      fetchSlots();
    }
    setLoading(false);
  };

  const handleEdit = async (id) => {
    setLoading(true);
    setError('');
    setSuccess('');

    const finalPrice = parseFloat(editForm.final_price);

    const updateData = {
      ...editForm,
      final_price: finalPrice,
      max_capacity: parseInt(editForm.max_capacity)
    };

    const { error } = await supabase
      .from('voucher_slots')
      .update(updateData)
      .eq('id', id);

    if (error) {
      setError('Failed to update voucher slot: ' + error.message);
    } else {
      setSuccess('Voucher slot updated successfully!');
      setEditingId(null);
      setEditForm({});
      fetchSlots();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this voucher slot? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const { error } = await supabase
      .from('voucher_slots')
      .delete()
      .eq('id', id);

    if (error) {
      setError('Failed to delete voucher slot: ' + error.message);
    } else {
      setSuccess('Voucher slot deleted successfully!');
      fetchSlots();
    }
    setLoading(false);
  };

  const toggleAvailability = async (id, currentStatus) => {
    setLoading(true);
    setError('');
    setSuccess('');

    const { error } = await supabase
      .from('voucher_slots')
      .update({ is_available: !currentStatus })
      .eq('id', id);

    if (error) {
      setError('Failed to update availability: ' + error.message);
    } else {
      setSuccess('Availability updated successfully!');
      fetchSlots();
    }
    setLoading(false);
  };

  const getSlotStatus = (slot) => {
    const now = new Date();
    const slotEndTime = new Date(`${slot.exam_date}T${slot.end_time}`);
    
    if (!isAfter(slotEndTime, now)) {
      return { status: 'expired', color: 'text-red-400', bgColor: 'bg-red-500/20' };
    } else if (slot.current_bookings >= slot.max_capacity) {
      return { status: 'sold_out', color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
    } else if (!slot.is_available) {
      return { status: 'unavailable', color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
    } else {
      return { status: 'available', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8 max-w-7xl mx-auto mt-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-8 text-center flex items-center justify-center space-x-3">
        <img 
          src="/Prometric-Logo.png" 
          alt="Prometric Logo" 
          className="w-16 h-16 object-contain"
        />
        <span>Voucher Slot Management</span>
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filter.exam_authority}
          onChange={(e) => setFilter({...filter, exam_authority: e.target.value})}
          className="bg-white/5 border border-white/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">All Exam Authorities</option>
          <option value="DHA">DHA (Dubai Health Authority)</option>
          <option value="MOHAP">MOHAP (Ministry of Health UAE)</option>
          <option value="DOH">DOH (Department of Health Abu Dhabi)</option>
          <option value="QCHP">QCHP (Qatar Council for Healthcare)</option>
          <option value="SCFHS">SCFHS (Saudi Commission)</option>
          <option value="prometric">Prometric (General)</option>
        </select>
        <select
          value={filter.status}
          onChange={(e) => setFilter({...filter, status: e.target.value})}
          className="bg-white/5 border border-white/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="sold_out">Sold Out</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Add New Slot Form */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Add New Voucher Slot</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Exam Date</label>
            <input
              type="date"
              value={form.exam_date}
              onChange={(e) => setForm({...form, exam_date: e.target.value})}
              className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
            <input
              type="time"
              value={form.start_time}
              onChange={(e) => setForm({...form, start_time: e.target.value})}
              className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
            <input
              type="time"
              value={form.end_time}
              onChange={(e) => setForm({...form, end_time: e.target.value})}
              className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Exam Authority</label>
            <select
              value={form.exam_authority}
              onChange={(e) => setForm({...form, exam_authority: e.target.value})}
              className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="DHA">DHA (Dubai Health Authority)</option>
              <option value="MOHAP">MOHAP (Ministry of Health UAE)</option>
              <option value="DOH">DOH (Department of Health Abu Dhabi)</option>
              <option value="QCHP">QCHP (Qatar Council for Healthcare)</option>
              <option value="SCFHS">SCFHS (Saudi Commission)</option>
              <option value="prometric">Prometric (General)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Final Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={form.final_price}
              onChange={(e) => setForm({...form, final_price: e.target.value})}
              className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Booking Timer (Optional)</label>
            <select
              value={form.booking_timer_minutes || ''}
              onChange={(e) => setForm({...form, booking_timer_minutes: e.target.value ? parseInt(e.target.value) : null})}
              className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">No Timer (Unlimited Time)</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="240">4 hours</option>
              <option value="480">8 hours</option>
              <option value="720">12 hours</option>
              <option value="1440">1 day</option>
              <option value="2880">2 days</option>
              <option value="4320">3 days</option>
              <option value="7200">5 days</option>
              <option value="10080">1 week</option>
              <option value="20160">2 weeks</option>
              <option value="43200">1 month</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Max Capacity</label>
            <input
              type="number"
              min="1"
              value={form.max_capacity}
              onChange={(e) => setForm({...form, max_capacity: e.target.value})}
              className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Lifetime Valid</label>
            <select
              value={form.is_lifetime_valid}
              onChange={(e) => setForm({...form, is_lifetime_valid: e.target.value === 'true'})}
              className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="true">Yes (Lifetime until slots expire)</option>
              <option value="false">No (Standard expiration)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Slot Expires At (Optional)</label>
            <input
              type="datetime-local"
              value={form.slot_expires_at}
              onChange={(e) => setForm({...form, slot_expires_at: e.target.value})}
              className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows="2"
              placeholder="Optional description for this voucher slot"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create Voucher Slot'}
            </button>
          </div>
        </form>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4 mb-6">
          <p className="text-red-300">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4 mb-6">
          <p className="text-green-300">{success}</p>
        </div>
      )}

      {/* Voucher Slots List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4">Voucher Slots ({slots.length})</h2>
        {loading ? (
          <div className="text-center text-cyan-300">Loading voucher slots...</div>
        ) : slots.length === 0 ? (
          <div className="text-center text-gray-300">No voucher slots found.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {slots.map(slot => {
              const slotStatus = getSlotStatus(slot);
              // Simplified pricing model - no service fee calculation needed
              
              return (
                <div key={slot.id} className={`bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4 ${slotStatus.bgColor}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${slotStatus.color} ${slotStatus.bgColor}`}>
                        {slotStatus.status.toUpperCase()}
                      </span>
                      {slot.is_available ? (
                        <FiEye className="w-4 h-4 text-green-400" />
                      ) : (
                        <FiEyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(slot.id);
                          setEditForm({...slot});
                        }}
                        className="text-blue-400 hover:text-blue-300"
                        disabled={loading}
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleAvailability(slot.id, slot.is_available)}
                        className="text-yellow-400 hover:text-yellow-300"
                        disabled={loading}
                      >
                        {slot.is_available ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(slot.id)}
                        className="text-red-400 hover:text-red-300"
                        disabled={loading}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-semibold">{slot.exam_date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiClock className="w-4 h-4 text-green-400" />
                      <span className="text-white">{slot.start_time} - {slot.end_time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FiDollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-white font-bold">${slot.final_price}</span>
                        <span className="text-gray-400 text-sm">Final Price</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FiUsers className="w-4 h-4 text-orange-400" />
                        <span className="text-white text-sm">{slot.current_bookings}/{slot.max_capacity}</span>
                      </div>
                      <span className="text-xs text-gray-400">{slot.exam_authority}</span>
                    </div>
                    {slot.is_lifetime_valid && (
                      <div className="flex items-center space-x-1 text-green-300 text-xs">
                        <FiShield className="w-3 h-3" />
                        <span>Lifetime Valid</span>
                      </div>
                    )}
                    {slot.booking_timer_minutes ? (
                      <div className="text-xs text-gray-400">
                        Booking timer: {(() => {
                          const minutes = slot.booking_timer_minutes;
                          if (minutes < 60) return `${minutes} minutes`;
                          if (minutes < 1440) return `${Math.floor(minutes / 60)} hours`;
                          if (minutes < 10080) return `${Math.floor(minutes / 1440)} days`;
                          if (minutes < 43200) return `${Math.floor(minutes / 10080)} weeks`;
                          return `${Math.floor(minutes / 43200)} months`;
                        })()}
                      </div>
                    ) : (
                      <div className="text-xs text-green-400">
                        No booking timer (unlimited time)
                      </div>
                    )}
                    {slot.slot_expires_at && (
                      <div className="text-xs text-gray-400">
                        Slot expires: {new Date(slot.slot_expires_at).toLocaleString()}
                      </div>
                    )}
                    {slot.description && (
                      <p className="text-gray-300 text-sm mt-2">{slot.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Edit Voucher Slot</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(editingId); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={editForm.exam_date}
                    onChange={(e) => setEditForm({...editForm, exam_date: e.target.value})}
                    className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={editForm.start_time}
                    onChange={(e) => setEditForm({...editForm, start_time: e.target.value})}
                    className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={editForm.end_time}
                    onChange={(e) => setEditForm({...editForm, end_time: e.target.value})}
                    className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Exam Authority</label>
                  <select
                    value={editForm.exam_authority}
                    onChange={(e) => setEditForm({...editForm, exam_authority: e.target.value})}
                    className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    <option value="DHA">DHA (Dubai Health Authority)</option>
                    <option value="MOHAP">MOHAP (Ministry of Health UAE)</option>
                    <option value="DOH">DOH (Department of Health Abu Dhabi)</option>
                    <option value="QCHP">QCHP (Qatar Council for Healthcare)</option>
                    <option value="SCFHS">SCFHS (Saudi Commission)</option>
                    <option value="prometric">Prometric (General)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Final Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.final_price}
                    onChange={(e) => setEditForm({...editForm, final_price: e.target.value})}
                    className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.max_capacity}
                    onChange={(e) => setEditForm({...editForm, max_capacity: e.target.value})}
                    className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Lifetime Valid</label>
                  <select
                    value={editForm.is_lifetime_valid}
                    onChange={(e) => setEditForm({...editForm, is_lifetime_valid: e.target.value === 'true'})}
                    className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="true">Yes (Lifetime until slots expire)</option>
                    <option value="false">No (Standard expiration)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setEditForm({});
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Updating...' : 'Update Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
