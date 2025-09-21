import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FiInfo, FiAlertCircle, FiClock } from 'react-icons/fi';
import { isAfter } from 'date-fns';
import { useAuthModal } from '../contexts/AuthModalContext';

export default function BookPhysicalAppointmentModal({ open, onClose }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { openAuthModal } = useAuthModal();

  const LOCATION_OPTIONS = [
    "Headquarters | Downtown Lake City C-31 Bella Vista, Lake City Downtown Lahore.",
    // Add more locations here in the future
  ];
  const [selectedLocation, setSelectedLocation] = useState(LOCATION_OPTIONS[0]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch slots function
  const fetchSlots = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('appointment_slots')
      .select('*')
      .eq('is_available', true)
      .eq('location', selectedLocation)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });
    
    if (error) {
      setError('Failed to load slots.');
    } else if (data) {
      // Filter out expired slots
      const now = new Date();
      const validSlots = data.filter(slot => {
        const slotEndTime = new Date(slot.end_time);
        return isAfter(slotEndTime, now);
      });
      setSlots(validSlots);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchSlots();
    // eslint-disable-next-line
  }, [open, selectedLocation]);

  // Set up real-time subscription for slot changes
  useEffect(() => {
    if (!open) return;

    const subscription = supabase
      .channel('appointment_slots_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'appointment_slots' 
        }, 
        (payload) => {
          // Refresh slots when any slot is updated
          fetchSlots();
        }
      )
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'appointment_bookings' 
        }, 
        (payload) => {
          // Refresh slots when a new booking is made
          fetchSlots();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [open, selectedLocation]);

  // Check if a slot is still valid for booking
  const isSlotValid = (slot) => {
    const now = new Date();
    const slotEndTime = new Date(slot.end_time);
    return isAfter(slotEndTime, now) && slot.is_available;
  };

  // Format time as HH:mm (24-hour)
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleSelect = async (slot) => {
    // Double-check slot validity before proceeding
    const { data: slotData, error: slotError } = await supabase
      .from('appointment_slots')
      .select('is_available')
      .eq('id', slot.id)
      .single();
    if (slotError || !slotData || !slotData.is_available) {
      setError('This slot has just been booked by another user or is no longer available. Please select another slot.');
      return;
    }
    if (!isSlotValid(slot)) {
      setError('This slot is no longer available. Please select another time.');
      return;
    }
    // Pass formatted time to checkout
    navigate(`/checkout?appointment_slot_id=${slot.id}&fee=${slot.fee}&date=${slot.date}&start_time=${formatTime(slot.start_time)}&end_time=${formatTime(slot.end_time)}`);
    if (onClose) onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2 sm:p-6 w-full max-w-2xl mx-2 sm:mx-0 relative max-h-[95vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white bg-red-500/80 hover:bg-red-600/90 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow z-10"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="overflow-y-auto flex-1 px-2 sm:px-0" style={{ maxHeight: '85vh' }}>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent mb-4 text-center">Book a Physical Appointment</h2>
          
          {/* Auto-expiry information banner */}
          <div className="bg-pink-900/20 border border-pink-400/30 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <FiInfo className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-pink-400 font-semibold mb-1">🔄 Smart Slot Management</h3>
                <p className="text-pink-200 text-sm">
                  Our system automatically manages appointment slots. Slots close when their time passes or when booked by another user. 
                  This ensures fair access and prevents double bookings.
                </p>
              </div>
            </div>
          </div>

          {!user ? (
            <div className="flex flex-col items-center justify-center mt-8">
              <div className="text-white text-lg font-semibold mb-4 text-center">Please register or log in to book your appointment.</div>
              <div className="flex gap-4">
                <button
                  onClick={() => openAuthModal('register')}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  Register
                </button>
                <button
                  onClick={() => openAuthModal('login')}
                  className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-pink-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-col items-center">
                <label htmlFor="location" className="text-white font-semibold mb-2">Select Location</label>
                <select
                  id="location"
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="p-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  {LOCATION_OPTIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              {loading ? (
                <div className="text-pink-300 text-center mt-4">Loading slots...</div>
              ) : error ? (
                <div className="text-red-400 text-center mt-4">{error}</div>
              ) : slots.length === 0 ? (
                <div className="text-gray-300 text-center mt-4">No appointment slots for this location.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Slot selection warning */}
                  <div className="bg-amber-900/20 border border-amber-400/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <FiAlertCircle className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-200 text-sm font-medium">
                        ⏰ Slots are automatically managed - they may close if time passes or if booked by another user
                      </span>
                    </div>
                  </div>

                  {slots.map(slot => {
                    const valid = isSlotValid(slot);
                    return (
                      <button
                        key={slot.id}
                        onClick={valid ? () => handleSelect(slot) : undefined}
                        className={`w-full flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-400/30 rounded-xl p-4 shadow transition-all duration-200 group ${valid ? 'hover:from-pink-600/30 hover:to-red-600/30 hover:shadow-lg' : 'opacity-60 cursor-not-allowed'}`}
                        disabled={!valid}
                      >
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
                          <div className="flex items-center space-x-2">
                            <FiClock className="w-4 h-4 text-pink-400" />
                            <span className="font-semibold text-white text-lg">{slot.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiClock className="w-4 h-4 text-pink-400" />
                            <span className="text-white text-base">
                              {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                          <span className="font-bold text-green-300 text-lg">PKR {slot.fee}</span>
                          {!valid && (
                            <span className="ml-4 px-3 py-1 rounded-full bg-red-600/80 text-white text-xs font-bold">Booked</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  {/* Show message if all slots are invalid */}
                  {slots.filter(slot => isSlotValid(slot)).length === 0 && slots.length > 0 && (
                    <div className="text-red-300 text-center text-sm">
                      All slots for this location have expired or are no longer available.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
