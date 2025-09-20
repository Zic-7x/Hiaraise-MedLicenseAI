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
  FiSearch,
  FiCreditCard
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import VoucherSubmissionFlow from '../components/VoucherSubmissionFlow';

export default function GetExamPass() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDetails, setVoucherDetails] = useState(null);
  const [showSubmissionFlow, setShowSubmissionFlow] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const validateVoucherCode = async (code) => {
    if (!code || code.length < 8) {
      setVoucherDetails(null);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('voucher_purchases')
        .select(`
          *,
          voucher_slots!voucher_purchases_slot_id_fkey(
            exam_authority,
            exam_date,
            start_time,
            end_time,
            final_price
          )
        `)
        .eq('voucher_code', code.toUpperCase())
        .eq('status', 'approved') // Check for approved vouchers (after admin approval)
        .single();

      if (error) {
        setError('Invalid voucher code. Please check and try again.');
        setVoucherDetails(null);
      } else {
        // Check if voucher has already been submitted
        const { data: existingBooking } = await supabase
          .from('exam_bookings')
          .select('id')
          .eq('voucher_purchase_id', data.id)
          .single();

        if (existingBooking) {
          setError('This voucher has already been submitted for exam booking.');
          setVoucherDetails(null);
        } else {
          setVoucherDetails(data);
          setError('');
        }
      }
    } catch (err) {
      setError('Error validating voucher code. Please try again.');
      setVoucherDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVoucherCodeChange = (e) => {
    const code = e.target.value;
    setVoucherCode(code);
    validateVoucherCode(code);
  };

  const handleSubmitVoucher = () => {
    if (voucherDetails) {
      setShowSubmissionFlow(true);
    }
  };

  const handleSubmissionSuccess = () => {
    setShowSubmissionFlow(false);
    setVoucherCode('');
    setVoucherDetails(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6">
              <FiFileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent mb-4">
              Get Exam Pass
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Submit your voucher to get your exam pass and book your exam.
            </p>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
          >
            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <FiShield className="w-6 h-6 mr-3 text-green-400" />
                How to Get Your Exam Pass
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Enter Voucher Code</h3>
                  <p className="text-gray-300 text-sm">Enter your purchased voucher code below</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Submit Details</h3>
                  <p className="text-gray-300 text-sm">Fill in your personal information and accept terms</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Get Exam Pass</h3>
                  <p className="text-gray-300 text-sm">Receive your exam pass 3-7 days before exam</p>
                </div>
              </div>
            </div>

            {/* Voucher Code Input */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FiSearch className="w-5 h-5 mr-2 text-blue-400" />
                Enter Your Voucher Code
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={handleVoucherCodeChange}
                  placeholder="Enter your voucher code (e.g., ABC12345)"
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-mono"
                  disabled={loading}
                />
                {loading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 flex items-center">
                    <FiAlertCircle className="w-5 h-5 mr-2" />
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* Voucher Details */}
            {voucherDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FiCheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  Voucher Details
                </h3>
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <FiCalendar className="w-6 h-6 text-green-400" />
                        <div>
                          <p className="text-gray-300 text-sm">Exam Authority</p>
                          <p className="text-white font-semibold text-lg">{voucherDetails.voucher_slots.exam_authority}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <FiClock className="w-6 h-6 text-green-400" />
                        <div>
                          <p className="text-gray-300 text-sm">Exam Date</p>
                          <p className="text-white font-semibold text-lg">
                            {new Date(voucherDetails.voucher_slots.exam_date).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <FiDollarSign className="w-6 h-6 text-green-400" />
                        <div>
                          <p className="text-gray-300 text-sm">Exam Fee</p>
                          <p className="text-white font-semibold text-lg">${voucherDetails.voucher_slots.final_price}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <FiUser className="w-6 h-6 text-green-400" />
                        <div>
                          <p className="text-gray-300 text-sm">Time</p>
                          <p className="text-white font-semibold text-lg">
                            {voucherDetails.voucher_slots.start_time?.slice(0,5)} - {voucherDetails.voucher_slots.end_time?.slice(0,5)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-green-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-300 text-sm font-semibold">VOUCHER CODE</p>
                        <p className="text-2xl font-bold text-white font-mono">{voucherDetails.voucher_code}</p>
                      </div>
                      <button
                        onClick={handleSubmitVoucher}
                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                      >
                        <FiFileText className="w-5 h-5" />
                        <span>Submit for Exam Pass</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Additional Information */}
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FiShield className="w-5 h-5 mr-2" />
                Important Information
              </h3>
              <div className="space-y-3 text-gray-300 text-sm">
                <div className="flex items-start space-x-3">
                  <FiCheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p>Your exam will be automatically booked once you submit your voucher</p>
                </div>
                <div className="flex items-start space-x-3">
                  <FiCheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p>Exam pass will be issued 3-7 days before your exam date</p>
                </div>
                <div className="flex items-start space-x-3">
                  <FiCheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p>You will receive notification when your exam pass is ready for download</p>
                </div>
                <div className="flex items-start space-x-3">
                  <FiCheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p>You can track your exam status in the "My Exams" section</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/my-exams"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <FiCalendar className="w-5 h-5" />
                <span>View My Exams</span>
              </Link>
              <Link
                to="/my-vouchers"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <FiFileText className="w-5 h-5" />
                <span>My Vouchers</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Voucher Submission Flow Modal */}
      {showSubmissionFlow && (
        <VoucherSubmissionFlow
          voucherCode={voucherDetails?.voucher_code}
          onClose={() => {
            setShowSubmissionFlow(false);
          }}
          onSuccess={handleSubmissionSuccess}
        />
      )}
    </div>
  );
}
