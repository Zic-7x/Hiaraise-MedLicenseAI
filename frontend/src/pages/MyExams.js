import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiDownload, 
  FiUser, 
  FiDollarSign, 
  FiShield, 
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiClock as FiPending,
  FiEye,
  FiExternalLink,
  FiMapPin
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function MyExams() {
  const [examBookings, setExamBookings] = useState([]);
  const [examPasses, setExamPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);

        // Fetch exam bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('exam_bookings')
          .select(`
            *,
            voucher_purchases!exam_bookings_voucher_purchase_id_fkey(
              voucher_code,
              final_price_at_purchase,
              voucher_slots!voucher_purchases_slot_id_fkey(
                exam_authority,
                exam_date,
                start_time,
                end_time,
                final_price
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (bookingsError) {
          console.error('Error fetching exam bookings:', bookingsError);
        } else {
          setExamBookings(bookingsData || []);
        }

        // Fetch exam passes
        const { data: passesData, error: passesError } = await supabase
          .from('exam_passes')
          .select(`
            *,
            exam_bookings!exam_passes_exam_booking_id_fkey(
              exam_authority,
              exam_date,
              exam_start_time,
              exam_end_time,
              voucher_purchases!exam_bookings_voucher_purchase_id_fkey(
                voucher_code
              )
            )
          `)
          .eq('user_id', user.id)
          .order('issued_at', { ascending: false });
        
        if (passesError) {
          console.error('Error fetching exam passes:', passesError);
        } else {
          setExamPasses(passesData || []);
        }
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const downloadExamPass = async (examPass) => {
    try {
      // Mark as downloaded
      await supabase
        .from('exam_passes')
        .update({ 
          status: 'downloaded',
          downloaded_at: new Date().toISOString()
        })
        .eq('id', examPass.id);

      // Update local state
      setExamPasses(prev => prev.map(pass => 
        pass.id === examPass.id 
          ? { ...pass, status: 'downloaded', downloaded_at: new Date().toISOString() }
          : pass
      ));

      // Open download link
      if (examPass.document_url) {
        window.open(examPass.document_url, '_blank');
      }
    } catch (error) {
      console.error('Error downloading exam pass:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'exam_pass_issued':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return <FiPending className="w-4 h-4" />;
      case 'approved':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'exam_pass_issued':
        return <FiFileText className="w-4 h-4" />;
      case 'completed':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  const getPassStatusColor = (status) => {
    switch (status) {
      case 'issued':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'downloaded':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'expired':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6">
              <FiFileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent mb-4">
              My Exams
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
              Track your exam bookings and download your exam passes.
            </p>
            <Link
              to="/get-exam-pass"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <FiFileText className="w-5 h-5" />
              <span>Get Exam Pass</span>
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
              <FiCalendar className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white mb-1">{examBookings.length}</h3>
              <p className="text-gray-300">Total Bookings</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
              <FiCheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white mb-1">
                {examBookings.filter(b => b.status === 'exam_pass_issued' || b.status === 'completed').length}
              </h3>
              <p className="text-gray-300">Passes Issued</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
              <FiDownload className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white mb-1">
                {examPasses.filter(p => p.status === 'downloaded').length}
              </h3>
              <p className="text-gray-300">Downloads</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
              <FiAlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white mb-1">
                {examBookings.filter(b => b.status === 'submitted' || b.status === 'approved').length}
              </h3>
              <p className="text-gray-300">Pending</p>
            </div>
          </motion.div>

          {/* Exam Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FiCalendar className="w-6 h-6 mr-3" />
              Exam Bookings
            </h2>
            
            <div className="space-y-6">
              {examBookings.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center">
                  <FiCalendar className="w-16 h-16 text-gray-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-white mb-4">No Exam Bookings Yet</h3>
                  <p className="text-gray-300 mb-8 max-w-md mx-auto">
                    You haven't submitted any vouchers for exam booking yet. Purchase a voucher and submit it to book your exam.
                  </p>
                  <Link
                    to="/vouchers"
                    className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <FiExternalLink className="w-5 h-5" />
                    <span>Browse Vouchers</span>
                  </Link>
                </div>
              ) : (
                examBookings.map((booking, index) => {
                  const examDate = new Date(booking.exam_date);
                  const dayOfWeek = examDate.toLocaleDateString('en-US', { weekday: 'long' });
                  const formattedDate = examDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                  
                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        {/* Booking Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                              <FiCalendar className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-2">
                                {booking.exam_authority} Exam Booking
                              </h3>
                              <p className="text-gray-300">
                                Submitted on {new Date(booking.submitted_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex items-center space-x-4">
                              <FiCalendar className="w-6 h-6 text-blue-400" />
                              <div>
                                <p className="text-gray-300 text-sm">Exam Date</p>
                                <p className="text-white font-semibold text-lg">{dayOfWeek}, {formattedDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <FiClock className="w-6 h-6 text-cyan-400" />
                              <div>
                                <p className="text-gray-300 text-sm">Exam Time</p>
                                <p className="text-white font-semibold text-lg">
                                  {booking.exam_start_time?.slice(0,5)} - {booking.exam_end_time?.slice(0,5)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <FiDollarSign className="w-6 h-6 text-green-400" />
                              <div>
                                <p className="text-gray-300 text-sm">Exam Fee</p>
                                <p className="text-white font-semibold text-lg">${booking.exam_fee}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <FiMapPin className="w-6 h-6 text-purple-400" />
                              <div>
                                <p className="text-gray-300 text-sm">Country</p>
                                <p className="text-white font-semibold text-lg">
                                  {booking.country}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Additional Info Row */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex items-center space-x-4">
                              <FiUser className="w-6 h-6 text-cyan-400" />
                              <div>
                                <p className="text-gray-300 text-sm">Candidate</p>
                                <p className="text-white font-semibold text-lg">
                                  {booking.first_name} {booking.last_name}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <FiShield className="w-6 h-6 text-yellow-400" />
                              <div>
                                <p className="text-gray-300 text-sm">ID Issuing Country</p>
                                <p className="text-white font-semibold text-lg">
                                  {booking.government_id_issuing_country}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Voucher Code */}
                          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6">
                            <p className="text-blue-300 text-sm mb-3 font-semibold">VOUCHER CODE USED</p>
                            <p className="text-3xl font-bold text-white font-mono tracking-wider">
                              {booking.voucher_purchases?.voucher_code}
                            </p>
                          </div>
                        </div>
                        
                        {/* Status and Actions */}
                        <div className="flex flex-col space-y-4 lg:min-w-[200px]">
                          <div className="text-center">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-2 capitalize">{booking.status.replace('_', ' ')}</span>
                            </span>
                          </div>
                          
                          {booking.status === 'exam_pass_issued' && booking.exam_pass_document_url && (
                            <button
                              onClick={() => window.open(booking.exam_pass_document_url, '_blank')}
                              className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                              <FiDownload className="w-5 h-5" />
                              <span>Download Pass</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Exam Passes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FiFileText className="w-6 h-6 mr-3" />
              Exam Passes
            </h2>
            
            <div className="space-y-6">
              {examPasses.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center">
                  <FiFileText className="w-16 h-16 text-gray-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-white mb-4">No Exam Passes Yet</h3>
                  <p className="text-gray-300 mb-8 max-w-md mx-auto">
                    Your exam passes will appear here once they are issued by our team. This typically happens 3-7 days before your exam date.
                  </p>
                </div>
              ) : (
                examPasses.map((pass, index) => {
                  const examDate = new Date(pass.exam_date);
                  const dayOfWeek = examDate.toLocaleDateString('en-US', { weekday: 'long' });
                  const formattedDate = examDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                  const isExpired = new Date(pass.expires_at) < new Date();
                  
                  return (
                    <motion.div
                      key={pass.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 ${
                        isExpired ? 'opacity-60' : 'hover:bg-white/15'
                      } transition-all duration-300`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        {/* Pass Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                              <FiFileText className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-2">
                                {pass.exam_authority} Exam Pass
                              </h3>
                              <p className="text-gray-300">
                                Issued on {new Date(pass.issued_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex items-center space-x-4">
                              <FiCalendar className="w-6 h-6 text-green-400" />
                              <div>
                                <p className="text-gray-300 text-sm">Exam Date</p>
                                <p className="text-white font-semibold text-lg">{dayOfWeek}, {formattedDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <FiClock className="w-6 h-6 text-cyan-400" />
                              <div>
                                <p className="text-gray-300 text-sm">Exam Time</p>
                                <p className="text-white font-semibold text-lg">
                                  {pass.exam_start_time?.slice(0,5)} - {pass.exam_end_time?.slice(0,5)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <FiUser className="w-6 h-6 text-purple-400" />
                              <div>
                                <p className="text-gray-300 text-sm">Candidate</p>
                                <p className="text-white font-semibold text-lg">{pass.candidate_name}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <FiShield className="w-6 h-6 text-red-400" />
                              <div>
                                <p className="text-gray-300 text-sm">Expires</p>
                                <p className={`font-semibold text-lg ${isExpired ? 'text-red-400' : 'text-red-300'}`}>
                                  {new Date(pass.expires_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Pass Number */}
                          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
                            <p className="text-green-300 text-sm mb-3 font-semibold">EXAM PASS NUMBER</p>
                            <p className="text-3xl font-bold text-white font-mono tracking-wider">
                              {pass.pass_number}
                            </p>
                            <p className="text-green-200 text-sm mt-2">Present this number at the exam center</p>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col space-y-4 lg:min-w-[200px]">
                          <div className="text-center">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getPassStatusColor(pass.status)}`}>
                              {pass.status === 'downloaded' ? <FiEye className="w-4 h-4" /> : <FiFileText className="w-4 h-4" />}
                              <span className="ml-2 capitalize">{pass.status}</span>
                            </span>
                          </div>
                          
                          {!isExpired && (
                            <button
                              onClick={() => downloadExamPass(pass)}
                              className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                              <FiDownload className="w-5 h-5" />
                              <span>Download Pass</span>
                            </button>
                          )}
                          
                          {isExpired && (
                            <div className="text-center">
                              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                                <FiAlertCircle className="w-4 h-4 mr-2" />
                                Expired
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
