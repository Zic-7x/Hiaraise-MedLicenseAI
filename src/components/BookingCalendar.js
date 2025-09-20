import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, parseISO, isAfter } from 'date-fns';
import { FiClock, FiAlertCircle } from 'react-icons/fi';
import SlotSelectionModal from './SlotSelectionModal';

export default function BookingCalendar({ onSlotSelect, session = null }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsForDay, setSlotsForDay] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch all available slots for the current month
  const fetchSlots = async () => {
    setLoading(true);
    const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
    const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('call_slots')
      .select('*')
      .eq('is_available', true)
      .gte('date', start)
      .lte('date', end);
    
    if (!error && data) {
      // Filter out expired slots
      const now = new Date();
      const validSlots = data.filter(slot => {
        const slotEndTime = new Date(`${slot.date}T${slot.end_time}`);
        return isAfter(slotEndTime, now);
      });
      setAvailableSlots(validSlots);
    }
    setLoading(false);
  };

  // Fetch slots when month changes
  useEffect(() => {
    fetchSlots();
  }, [currentMonth]);

  // Set up real-time subscription for slot changes
  useEffect(() => {
    const subscription = supabase
      .channel('call_slots_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'call_slots' 
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
          table: 'call_bookings' 
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
  }, [currentMonth]);

  // When a date is selected, filter slots for that day
  useEffect(() => {
    if (!selectedDate) {
      setSlotsForDay([]);
      return;
    }
    const slots = availableSlots.filter(
      slot => isSameDay(parseISO(slot.date), selectedDate)
    );
    setSlotsForDay(slots);
  }, [selectedDate, availableSlots]);

  // Helpers for calendar grid
  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    let day = startDate;
    while (day <= endDate) {
      days.push(new Date(day));
      day = addDays(day, 1);
    }
    return days;
  };

  const isDateAvailable = date => {
    const now = new Date();
    return availableSlots.some(slot => {
      const slotEndTime = new Date(`${slot.date}T${slot.end_time}`);
      return isSameDay(parseISO(slot.date), date) && isAfter(slotEndTime, now);
    });
  };

  // Get slot status (expiring soon, etc.)
  const getSlotStatus = (slot) => {
    const now = new Date();
    const slotEndTime = new Date(`${slot.date}T${slot.end_time}`);
    const timeUntilExpiry = slotEndTime.getTime() - now.getTime();
    const hoursUntilExpiry = timeUntilExpiry / (1000 * 60 * 60);
    
    if (hoursUntilExpiry < 1) {
      return { status: 'expiring-soon', color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
    } else if (hoursUntilExpiry < 24) {
      return { status: 'today', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    }
    return { status: 'available', color: 'text-green-400', bgColor: 'bg-green-500/20' };
  };

  // Check if a slot is still valid for booking
  const isSlotValid = (slot) => {
    const now = new Date();
    const slotEndTime = new Date(`${slot.date}T${slot.end_time}`);
    return isAfter(slotEndTime, now) && slot.is_available;
  };

  // Handle slot selection - show modal instead of direct navigation
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowSlotModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowSlotModal(false);
    setSelectedSlot(null);
  };

  // UI
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 max-w-xl mx-auto mb-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4 text-center">
        Book a Call – Select a Date & Time
      </h2>
      
      {/* Auto-expiry information */}
      <div className="bg-cyan-900/20 border border-cyan-400/30 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2">
          <FiClock className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-200 text-sm font-medium">
            ⏰ Slots automatically close when time passes or when booked
          </span>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          className="text-cyan-400 hover:text-cyan-300 font-bold text-lg"
          onClick={() => setCurrentMonth(addDays(startOfMonth(currentMonth), -1))}
        >
          &lt;
        </button>
        <span className="text-white text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button
          className="text-cyan-400 hover:text-cyan-300 font-bold text-lg"
          onClick={() => setCurrentMonth(addDays(endOfMonth(currentMonth), 1))}
        >
          &gt;
        </button>
      </div>
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="text-xs text-cyan-300 text-center">{d}</div>
        ))}
        {renderDays().map((day, idx) => {
          const available = isDateAvailable(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          return (
            <button
              key={idx}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${!isSameMonth(day, currentMonth) ? 'text-gray-500 opacity-40' : ''}
                ${available ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/20 text-white font-bold' : 'text-gray-400'}
                ${isSelected ? 'ring-2 ring-cyan-400 scale-105' : ''}
                hover:bg-cyan-500/40 transition-all
              `}
              disabled={!available || !isSameMonth(day, currentMonth)}
              onClick={() => setSelectedDate(day)}
              type="button"
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
      {/* Time slots for selected day */}
      {selectedDate && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white mb-2 text-center">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h3>
          {slotsForDay.length === 0 ? (
            <div className="text-gray-300 text-center">No available slots for this day.</div>
          ) : (
            <div className="space-y-3">
              {/* Slot expiry warning */}
              <div className="bg-amber-900/20 border border-amber-400/30 rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  <FiAlertCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-200 text-xs">
                    Slots may close automatically - book quickly to secure your time
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                {slotsForDay
                  .filter(slot => isSlotValid(slot)) // Only show valid slots
                  .map(slot => {
                    const slotStatus = getSlotStatus(slot);
                    return (
                      <button
                        key={slot.id}
                        className={`px-4 py-2 rounded-xl text-white font-semibold shadow transition-all duration-200 ${slotStatus.bgColor} hover:scale-105`}
                        onClick={() => handleSlotSelect(slot)}
                        type="button"
                      >
                        <div className="flex items-center space-x-1">
                          <FiClock className="w-3 h-3" />
                          <span>{slot.start_time.slice(0,5)} - {slot.end_time.slice(0,5)}</span>
                        </div>
                        {slotStatus.status === 'expiring-soon' && (
                          <div className="text-xs mt-1 text-orange-200">⚠️ Expiring soon</div>
                        )}
                      </button>
                    );
                  })}
              </div>
              
              {/* Show message if all slots are invalid */}
              {slotsForDay.filter(slot => isSlotValid(slot)).length === 0 && slotsForDay.length > 0 && (
                <div className="text-red-300 text-center text-sm">
                  All slots for this day have expired or are no longer available.
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {loading && (
        <div className="text-cyan-300 text-center mt-4">Loading slots...</div>
      )}

      {/* Slot Selection Modal */}
      <SlotSelectionModal
        open={showSlotModal}
        onClose={handleModalClose}
        selectedSlot={selectedSlot}
        slotType="call"
        session={session}
      />
    </div>
  );
} 