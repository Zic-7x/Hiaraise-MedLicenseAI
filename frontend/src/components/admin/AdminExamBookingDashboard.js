import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiMapPin, 
  FiMail, 
  FiPhone, 
  FiShield, 
  FiCheckCircle, 
  FiXCircle, 
  FiEye, 
  FiDownload,
  FiAlertCircle,
  FiFileText,
  FiDollarSign,
  FiUpload,
  FiX
} from 'react-icons/fi';

const PAGE_SIZE = 10;

export default function AdminExamBookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, page]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    
    let query = supabase
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
        ),
        profiles!exam_bookings_user_id_fkey(
          id,
          full_name,
          email,
          phone
        )
      `)
      .order('submitted_at', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error, count } = await query;
    
    if (error) {
      setError('Failed to fetch exam bookings: ' + error.message);
      setBookings([]);
    } else {
      setBookings(data || []);
      setTotal(count || 0);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setProcessingId(bookingId);
    setError('');

    try {
      const updateData = {
        status: newStatus,
        admin_message: adminMessage || null
      };

      // Set appropriate timestamp based on status
      switch (newStatus) {
        case 'approved':
          updateData.approved_at = new Date().toISOString();
          break;
        case 'exam_pass_issued':
          updateData.exam_pass_issued_at = new Date().toISOString();
          break;
        case 'completed':
          updateData.completed_at = new Date().toISOString();
          break;
      }

      const { error } = await supabase
        .from('exam_bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (error) {
        setError('Failed to update booking status: ' + error.message);
      } else {
      // If approving, create exam pass record
      if (newStatus === 'approved') {
        let fileData = null;
        if (uploadedFile) {
          fileData = await uploadFile(uploadedFile, bookingId);
        }
        await createExamPass(bookingId, fileData);
      }
        await fetchBookings();
        setShowDetails(false);
        setSelectedBooking(null);
        setAdminMessage('');
        setUploadedFile(null);
      }
    } catch (err) {
      setError('An error occurred: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const uploadFile = async (file, bookingId) => {
    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `exam-pass-${bookingId}-${Date.now()}.${fileExt}`;
      const filePath = `exam-passes/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('exam-documents')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('exam-documents')
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        name: file.name,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const createExamPass = async (bookingId, fileData = null) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const examPassData = {
      exam_booking_id: bookingId,
      user_id: booking.user_id,
      exam_authority: booking.exam_authority,
      exam_date: booking.exam_date,
      exam_start_time: booking.exam_start_time,
      exam_end_time: booking.exam_end_time,
      candidate_name: `${booking.first_name} ${booking.last_name}`,
      candidate_email: booking.email_address,
      candidate_phone: booking.home_evening_phone,
      status: 'issued',
      issued_at: new Date().toISOString(),
      expires_at: new Date(booking.exam_date).toISOString()
    };

    // Add file data if provided
    if (fileData) {
      examPassData.document_url = fileData.url;
      examPassData.document_name = fileData.name;
      examPassData.document_size = fileData.size;
      examPassData.document_type = fileData.type;
    }

    const { error } = await supabase
      .from('exam_passes')
      .insert(examPassData);

    if (error) {
      console.error('Failed to create exam pass:', error);
      throw error;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'exam_pass_issued': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return <FiAlertCircle className="w-4 h-4" />;
      case 'approved': return <FiCheckCircle className="w-4 h-4" />;
      case 'exam_pass_issued': return <FiFileText className="w-4 h-4" />;
      case 'completed': return <FiCheckCircle className="w-4 h-4" />;
      case 'cancelled': return <FiXCircle className="w-4 h-4" />;
      default: return <FiAlertCircle className="w-4 h-4" />;
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF or image file (JPG, PNG)');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setUploadedFile(file);
      setError('');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent mb-4">
            Exam Booking Management
          </h1>
          <p className="text-xl text-gray-300">
            Review and approve exam bookings submitted by users
          </p>
        </motion.div>

        {/* Filters and Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="exam_pass_issued">Exam Pass Issued</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="text-white">
              <span className="text-gray-300">Total: </span>
              <span className="font-semibold">{total}</span>
            </div>
          </div>
        </motion.div>

        {/* Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">Candidate</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Exam Details</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Voucher</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Submitted</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-semibold">
                          {booking.first_name} {booking.last_name}
                        </div>
                        <div className="text-gray-400 text-sm">{booking.email_address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-semibold">{booking.exam_authority}</div>
                        <div className="text-gray-400 text-sm">
                          {new Date(booking.exam_date).toLocaleDateString()} at {booking.exam_start_time?.slice(0,5)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-mono text-sm">
                        {booking.voucher_purchases?.voucher_code}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-2 capitalize">{booking.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(booking.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDetails(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 transition-all duration-200"
                      >
                        <FiEye className="w-4 h-4 mr-2" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </button>
              <span className="text-white">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
              </button>
            </div>
          )}
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="text-center mt-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            <p className="text-gray-300 mt-2">Loading exam bookings...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Booking Details Modal */}
        {showDetails && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Exam Booking Details</h2>
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedBooking(null);
                    setAdminMessage('');
                    setUploadedFile(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiXCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Exam Details */}
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FiCalendar className="w-5 h-5 mr-2" />
                      Exam Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Authority:</span>
                        <span className="text-white font-semibold">{selectedBooking.exam_authority}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Date:</span>
                        <span className="text-white font-semibold">
                          {new Date(selectedBooking.exam_date).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Time:</span>
                        <span className="text-white font-semibold">
                          {selectedBooking.exam_start_time?.slice(0,5)} - {selectedBooking.exam_end_time?.slice(0,5)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Fee:</span>
                        <span className="text-white font-semibold">${selectedBooking.exam_fee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FiUser className="w-5 h-5 mr-2" />
                      Candidate Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Name:</span>
                        <span className="text-white font-semibold">
                          {selectedBooking.first_name} {selectedBooking.middle_name} {selectedBooking.last_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Email:</span>
                        <span className="text-white font-semibold">{selectedBooking.email_address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Phone:</span>
                        <span className="text-white font-semibold">{selectedBooking.home_evening_phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">DOB:</span>
                        <span className="text-white font-semibold">
                          {new Date(selectedBooking.date_of_birth).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address & ID Information */}
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FiMapPin className="w-5 h-5 mr-2" />
                      Address Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Address:</span>
                        <span className="text-white font-semibold text-right">
                          {selectedBooking.street_address_line_1}
                          {selectedBooking.street_address_line_2 && <br />}
                          {selectedBooking.street_address_line_2}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">City:</span>
                        <span className="text-white font-semibold">{selectedBooking.city_address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Country:</span>
                        <span className="text-white font-semibold">{selectedBooking.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Postal Code:</span>
                        <span className="text-white font-semibold">{selectedBooking.postal_code_address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FiShield className="w-5 h-5 mr-2" />
                      Government ID
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">ID Number:</span>
                        <span className="text-white font-semibold">{selectedBooking.government_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Issuing Country:</span>
                        <span className="text-white font-semibold">{selectedBooking.government_id_issuing_country}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Message */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Message (Optional)
                </label>
                <textarea
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Add a message for the candidate..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* File Upload */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Exam Pass Document (Optional)
                </label>
                <div className="space-y-4">
                  {!uploadedFile ? (
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center space-y-4"
                      >
                        <FiUpload className="w-12 h-12 text-gray-400" />
                        <div>
                          <p className="text-white font-medium">Upload Exam Pass Document</p>
                          <p className="text-gray-400 text-sm">PDF, JPG, PNG (max 10MB)</p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FiFileText className="w-8 h-8 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">{uploadedFile.name}</p>
                          <p className="text-gray-400 text-sm">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeFile}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                {selectedBooking.status === 'submitted' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'approved')}
                    disabled={processingId === selectedBooking.id || uploading}
                    className="flex-1 px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="w-5 h-5 mr-2" />
                        Approve Booking
                      </>
                    )}
                  </button>
                )}
                
                {selectedBooking.status === 'approved' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'exam_pass_issued')}
                    disabled={processingId === selectedBooking.id}
                    className="flex-1 px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <FiFileText className="w-5 h-5 mr-2" />
                    Issue Exam Pass
                  </button>
                )}

                <button
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                  disabled={processingId === selectedBooking.id}
                  className="flex-1 px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <FiXCircle className="w-5 h-5 mr-2" />
                  Cancel Booking
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
