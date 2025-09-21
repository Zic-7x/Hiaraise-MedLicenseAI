import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { format, parseISO, isAfter, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isSameMonth } from 'date-fns';
import { FiClock, FiAlertCircle, FiCalendar, FiMapPin, FiPercent, FiDollarSign, FiUsers, FiChevronLeft, FiChevronRight, FiShield } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import SlotSelectionModal from './SlotSelectionModal';

export default function VoucherCalendar({ onSlotSelect, session = null }) {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examAuthorityFilter, setExamAuthorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [slotsPerPage] = useState(6);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotCountdowns, setSlotCountdowns] = useState({});

  // Fetch all available voucher slots
  const fetchSlots = async () => {
    setLoading(true);
    
    let query = supabase
      .from('voucher_slots')
      .select('*')
      .eq('is_available', true)
      .order('exam_date', { ascending: true })
      .order('start_time', { ascending: true });
    
    if (examAuthorityFilter !== 'all') {
      query = query.eq('exam_authority', examAuthorityFilter);
    }
    
    const { data, error } = await query;
    
    if (!error && data) {
      // Filter out expired slots (check both exam date and slot expiration)
      const now = new Date();
      const validSlots = data.filter(slot => {
        const slotEndTime = new Date(`${slot.exam_date}T${slot.end_time}`);
        const isExamDateValid = isAfter(slotEndTime, now);
        
        // For lifetime valid vouchers, also check slot expiration
        if (slot.is_lifetime_valid && slot.slot_expires_at) {
          const slotExpiry = new Date(slot.slot_expires_at);
          return isExamDateValid && isAfter(slotExpiry, now);
        }
        
        return isExamDateValid;
      });
      
      // Filter by date if specified
      let filteredSlots = validSlots;
      if (dateFilter !== 'all') {
        const today = new Date();
        const tomorrow = addDays(today, 1);
        const nextWeek = addDays(today, 7);
        const nextMonth = addDays(today, 30);
        
        filteredSlots = validSlots.filter(slot => {
          const slotDate = parseISO(slot.exam_date);
          switch (dateFilter) {
            case 'today':
              return isSameDay(slotDate, today);
            case 'tomorrow':
              return isSameDay(slotDate, tomorrow);
            case 'this_week':
              return slotDate >= today && slotDate <= nextWeek;
            case 'this_month':
              return slotDate >= today && slotDate <= nextMonth;
            default:
              return true;
          }
        });
      }
      
      setAvailableSlots(filteredSlots);
    }
    setLoading(false);
  };

  // Fetch slots when filters change
  useEffect(() => {
    fetchSlots();
  }, [examAuthorityFilter, dateFilter]);

  // Countdown timer effect
  useEffect(() => {
    const updateCountdowns = () => {
      const now = new Date();
      const newCountdowns = {};
      
      availableSlots.forEach(slot => {
        const slotEndTime = new Date(`${slot.exam_date}T${slot.end_time}`);
        const timeUntilExpiry = slotEndTime.getTime() - now.getTime();
        
        if (timeUntilExpiry > 0) {
          newCountdowns[slot.id] = {
            timeLeft: timeUntilExpiry,
            isExpired: false
          };
        } else {
          newCountdowns[slot.id] = {
            timeLeft: 0,
            isExpired: true
          };
        }
      });
      
      setSlotCountdowns(newCountdowns);
    };

    // Update countdowns immediately
    updateCountdowns();
    
    // Update countdowns every second
    const interval = setInterval(updateCountdowns, 1000);
    
    return () => clearInterval(interval);
  }, [availableSlots]);

  // Set up real-time subscription for slot changes
  useEffect(() => {
    const subscription = supabase
      .channel('voucher_slots_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'voucher_slots' 
        }, 
        (payload) => {
          fetchSlots();
        }
      )
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'voucher_purchases' 
        }, 
        (payload) => {
          fetchSlots();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [examAuthorityFilter, dateFilter]);

  // Format countdown time
  const formatCountdown = (timeLeft) => {
    if (!timeLeft || timeLeft <= 0) return 'Expired';
    
    const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Get slot status and pricing info
  const getSlotInfo = (slot) => {
    const countdown = slotCountdowns[slot.id];
    const timeUntilExpiry = countdown ? countdown.timeLeft : 0;
    const hoursUntilExpiry = timeUntilExpiry / (1000 * 60 * 60);
    
    let statusColor = 'text-green-400';
    let bgColor = 'bg-green-500/20';
    let statusText = 'Available';
    
    if (hoursUntilExpiry < 24) {
      statusColor = 'text-yellow-400';
      bgColor = 'bg-yellow-500/20';
      statusText = 'Soon';
    }
    
    if (hoursUntilExpiry < 2) {
      statusColor = 'text-orange-400';
      bgColor = 'bg-orange-500/20';
      statusText = 'Urgent';
    }

    if (countdown && countdown.isExpired) {
      statusColor = 'text-red-400';
      bgColor = 'bg-red-500/20';
      statusText = 'Expired';
    }

    return {
      statusColor,
      bgColor,
      statusText,
      isUrgent: hoursUntilExpiry < 2,
      isSoon: hoursUntilExpiry < 24,
      isExpired: countdown && countdown.isExpired,
      countdownText: formatCountdown(timeUntilExpiry)
    };
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

  // Check if a slot is still valid for purchase
  const isSlotValid = (slot) => {
    const now = new Date();
    const slotEndTime = new Date(`${slot.exam_date}T${slot.end_time}`);
    const countdown = slotCountdowns[slot.id];
    
    // Check if slot is expired based on countdown
    if (countdown && countdown.isExpired) {
      return false;
    }
    
    // Check basic availability
    return isAfter(slotEndTime, now) && 
           slot.is_available && 
           slot.current_bookings < slot.max_capacity;
  };

  // Pagination
  const totalPages = Math.ceil(availableSlots.length / slotsPerPage);
  const startIndex = (currentPage - 1) * slotsPerPage;
  const endIndex = startIndex + slotsPerPage;
  const currentSlots = availableSlots.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 max-w-6xl mx-auto mb-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4 text-center flex items-center justify-center space-x-3">
        <img 
          src="/Prometric-Logo.png" 
          alt="Prometric Logo" 
          className="w-12 h-12 object-contain"
        />
        <span>Available Medical License Exam Vouchers</span>
      </h2>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-cyan-300 mb-2">Filter by Exam Authority:</label>
          <select
            value={examAuthorityFilter}
            onChange={(e) => setExamAuthorityFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Exam Authorities</option>
            <option value="DHA">DHA (Dubai Health Authority)</option>
            <option value="MOHAP">MOHAP (Ministry of Health UAE)</option>
            <option value="DOH">DOH (Department of Health Abu Dhabi)</option>
            <option value="QCHP">QCHP (Qatar Council for Healthcare)</option>
            <option value="SCFHS">SCFHS (Saudi Commission)</option>
            <option value="prometric">Prometric (General)</option>
          </select>
        </div>
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-cyan-300 mb-2">Filter by Date:</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
          </select>
        </div>
      </div>

      {/* Pricing Information */}
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-400/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <FiPercent className="w-4 h-4 text-green-400" />
            <span className="text-green-200">Up to 50% Discount</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiDollarSign className="w-4 h-4 text-blue-400" />
            <span className="text-blue-200">Limited Time Offers</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiUsers className="w-4 h-4 text-purple-400" />
            <span className="text-purple-200">{availableSlots.length} Slots Available</span>
          </div>
        </div>
      </div>

      {/* Available Slots List */}
      {loading ? (
        <div className="text-center text-cyan-300 py-8">Loading available slots...</div>
      ) : availableSlots.length === 0 ? (
        <div className="text-center text-gray-300 py-8">
          <FiCalendar className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl font-semibold mb-2">No Available Slots</h3>
          <p>No voucher slots are currently available. Please check back later or try different filters.</p>
        </div>
      ) : (
        <>
          {/* Urgency warning */}
          <div className="bg-amber-900/20 border border-amber-400/30 rounded-lg p-3 mb-6">
            <div className="flex items-center space-x-2">
              <FiAlertCircle className="w-4 h-4 text-amber-400" />
              <span className="text-amber-200 text-sm font-medium">
                Limited slots available - Select your preferred slot quickly to secure your discount
              </span>
            </div>
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {currentSlots
              .filter(slot => isSlotValid(slot))
              .map(slot => {
                const slotInfo = getSlotInfo(slot);
                return (
                  <motion.button
                    key={slot.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-2xl text-white font-semibold shadow-lg transition-all duration-300 ${slotInfo.bgColor} hover:scale-105 hover:shadow-2xl border border-white/30 text-left group relative overflow-hidden`}
                    onClick={() => handleSlotSelect(slot)}
                    type="button"
                    data-slot-button="true"
                  >
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative space-y-4">
                      {/* Header with status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                            <FiCalendar className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs text-gray-300 uppercase tracking-wide">Voucher Slot</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${slotInfo.statusColor} ${slotInfo.bgColor} border border-white/20`}>
                          {slotInfo.statusText}
                        </span>
                      </div>

                      {/* Date and Time */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <FiCalendar className="w-3 h-3 text-blue-400" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide">Exam Date</div>
                            <div className="text-sm font-bold">{format(parseISO(slot.exam_date), 'MMM d, yyyy')}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                            <FiClock className="w-3 h-3 text-green-400" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide">Exam Time</div>
                            <div className="text-sm font-bold">{slot.start_time.slice(0,5)} - {slot.end_time.slice(0,5)}</div>
                          </div>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="pt-3 border-t border-white/20">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-300 mb-1">
                            ${slot.final_price}
                          </div>
                          <div className="text-xs text-green-200 uppercase tracking-wide">
                            Exam Booking Price
                          </div>
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">
                          {slot.current_bookings}/{slot.max_capacity} sold
                        </span>
                        <span className="text-xs text-gray-400">
                          {slot.exam_authority}
                        </span>
                      </div>

                      {/* Exam date validity and countdown timer */}
                      <div className="text-xs text-blue-200 font-bold flex items-center mb-2">
                        <FiCalendar className="w-3 h-3 mr-1" />
                        Valid until exam date
                      </div>
                      
                      {/* Countdown timer */}
                      <div className={`text-xs font-bold flex items-center ${slotInfo.isExpired ? 'text-red-200' : slotInfo.isUrgent ? 'text-orange-200' : 'text-green-200'}`}>
                        <FiClock className="w-3 h-3 mr-1" />
                        {slotInfo.isExpired ? 'EXPIRED' : `Expires in: ${slotInfo.countdownText}`}
                        </div>
                      
                      {/* Booking timer indicator */}
                      {slot.booking_timer_minutes && (
                        <div className="text-xs text-amber-200 font-bold flex items-center mt-1">
                          <FiClock className="w-3 h-3 mr-1" />
                          {(() => {
                            const minutes = slot.booking_timer_minutes;
                            if (minutes < 60) return `${minutes}m booking timer`;
                            if (minutes < 1440) return `${Math.floor(minutes / 60)}h booking timer`;
                            if (minutes < 10080) return `${Math.floor(minutes / 1440)}d booking timer`;
                            return `${Math.floor(minutes / 10080)}w booking timer`;
                          })()}
                        </div>
                      )}

                      {/* Urgency indicators */}
                      {slotInfo.isExpired && (
                        <div className="text-xs text-red-200 font-bold">
                          ❌ EXPIRED - No longer available
                        </div>
                      )}
                      {slotInfo.isUrgent && !slotInfo.isExpired && (
                        <div className="text-xs text-orange-200 font-bold">
                          ⚡ URGENT - Expires Soon!
                        </div>
                      )}
                      {slotInfo.isSoon && !slotInfo.isUrgent && !slotInfo.isExpired && (
                        <div className="text-xs text-yellow-200">
                          ⏰ Limited Time
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <span className="text-gray-300 text-sm">
                  ({availableSlots.length} total slots)
                </span>
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Slot Selection Modal */}
      <SlotSelectionModal
        open={showSlotModal}
        onClose={handleModalClose}
        selectedSlot={selectedSlot}
        slotType="voucher"
        session={session}
      />
    </div>
  );
}
