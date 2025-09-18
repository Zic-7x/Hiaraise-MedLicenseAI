import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { format, parseISO, isAfter } from 'date-fns';
import { FiEye, FiCalendar, FiClock, FiMapPin, FiDollarSign, FiGift, FiUser, FiMail, FiPhone, FiCheck, FiX } from 'react-icons/fi';

export default function AdminVoucherPurchaseDashboard() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchPurchases();
  }, [statusFilter, page]);

  const fetchPurchases = async () => {
    setLoading(true);
    setError('');
    
    let query = supabase
      .from('voucher_purchases')
      .select(`
        *,
        voucher_slots(*),
        profiles(id, full_name, email, phone),
        payments(*)
      `)
      .order('created_at', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error, count } = await query;
    if (error) {
      setError('Failed to fetch purchases: ' + error.message);
      setPurchases([]);
    } else {
      setPurchases(data || []);
      setTotal(count || 0);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setLoading(true);
    setError('');

    const { error } = await supabase
      .from('voucher_purchases')
      .update({ 
        status: newStatus,
        used_at: newStatus === 'used' ? new Date().toISOString() : null
      })
      .eq('id', id);

    if (error) {
      setError('Failed to update status: ' + error.message);
    } else {
      await fetchPurchases();
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'purchased': return 'text-blue-400 bg-blue-500/20';
      case 'used': return 'text-green-400 bg-green-500/20';
      case 'expired': return 'text-red-400 bg-red-500/20';
      case 'cancelled': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getPurchaseStatus = (purchase) => {
    const now = new Date();
    const expiresAt = new Date(purchase.expires_at);
    
    if (purchase.status === 'used') {
      return { status: 'used', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    } else if (purchase.status === 'cancelled') {
      return { status: 'cancelled', color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
    } else if (!isAfter(expiresAt, now)) {
      return { status: 'expired', color: 'text-red-400', bgColor: 'bg-red-500/20' };
    } else {
      return { status: 'active', color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8 max-w-7xl mx-auto mt-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-8 text-center flex items-center justify-center space-x-3">
        <img 
          src="/Prometric-Logo.png" 
          alt="Prometric Logo" 
          className="w-16 h-16 object-contain"
        />
        <span>Voucher Purchase Management</span>
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">All Status</option>
          <option value="purchased">Purchased</option>
          <option value="used">Used</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
          <div className="text-blue-300 text-sm font-medium">Total Purchases</div>
          <div className="text-2xl font-bold text-white">{total}</div>
        </div>
        <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4">
          <div className="text-green-300 text-sm font-medium">Active Vouchers</div>
          <div className="text-2xl font-bold text-white">
            {purchases.filter(p => getPurchaseStatus(p).status === 'active').length}
          </div>
        </div>
        <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-4">
          <div className="text-purple-300 text-sm font-medium">Used Vouchers</div>
          <div className="text-2xl font-bold text-white">
            {purchases.filter(p => p.status === 'used').length}
          </div>
        </div>
        <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4">
          <div className="text-red-300 text-sm font-medium">Expired Vouchers</div>
          <div className="text-2xl font-bold text-white">
            {purchases.filter(p => getPurchaseStatus(p).status === 'expired').length}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4 mb-6">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Purchases Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-white font-semibold">Voucher Code</th>
                <th className="px-4 py-3 text-left text-white font-semibold">Customer</th>
                <th className="px-4 py-3 text-left text-white font-semibold">Exam Details</th>
                <th className="px-4 py-3 text-left text-white font-semibold">Pricing</th>
                <th className="px-4 py-3 text-left text-white font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-cyan-300">
                    Loading purchases...
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-300">
                    No purchases found.
                  </td>
                </tr>
              ) : (
                purchases.map(purchase => {
                  const purchaseStatus = getPurchaseStatus(purchase);
                  const slot = purchase.voucher_slots;
                  const user = purchase.profiles;
                  const payment = purchase.payments;
                  
                  return (
                    <tr key={purchase.id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div className="font-mono text-sm font-bold text-green-300">
                          {purchase.voucher_code}
                        </div>
                        <div className="text-xs text-gray-400">
                          {format(new Date(purchase.created_at), 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <FiUser className="w-4 h-4 text-blue-400" />
                            <span className="text-white font-medium">
                              {user?.full_name || purchase.guest_name || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiMail className="w-4 h-4 text-purple-400" />
                            <span className="text-gray-300 text-sm">
                              {user?.email || purchase.guest_email || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiPhone className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300 text-sm">
                              {user?.phone || purchase.guest_phone || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {slot ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <FiCalendar className="w-4 h-4 text-blue-400" />
                              <span className="text-white">{slot.exam_date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FiClock className="w-4 h-4 text-green-400" />
                              <span className="text-gray-300 text-sm">
                                {slot.start_time} - {slot.end_time}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FiMapPin className="w-4 h-4 text-purple-400" />
                              <span className="text-gray-300 text-sm">{slot.location}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-red-400 text-sm">Slot deleted</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <FiDollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-white font-semibold">${purchase.final_price}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Saved: ${purchase.discount_amount}
                          </div>
                          <div className="text-xs text-red-300">
                            Original: ${purchase.original_price}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${purchaseStatus.color} ${purchaseStatus.bgColor}`}>
                          {purchaseStatus.status.toUpperCase()}
                        </span>
                        {purchaseStatus.status === 'expired' && (
                          <div className="text-xs text-red-300 mt-1">
                            Expired: {format(new Date(purchase.expires_at), 'MMM d, yyyy')}
                          </div>
                        )}
                        {purchase.used_at && (
                          <div className="text-xs text-green-300 mt-1">
                            Used: {format(new Date(purchase.used_at), 'MMM d, yyyy')}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedPurchase(purchase)}
                            className="text-blue-400 hover:text-blue-300"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          {purchaseStatus.status === 'active' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(purchase.id, 'used')}
                                className="text-green-400 hover:text-green-300"
                                title="Mark as Used"
                                disabled={loading}
                              >
                                <FiCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(purchase.id, 'cancelled')}
                                className="text-red-400 hover:text-red-300"
                                title="Cancel Voucher"
                                disabled={loading}
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-white/5 flex justify-between items-center">
            <div className="text-gray-300 text-sm">
              Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, total)} of {total} purchases
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-white">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Purchase Details Modal */}
      {selectedPurchase && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Voucher Purchase Details</h3>
              <button
                onClick={() => setSelectedPurchase(null)}
                className="text-gray-400 hover:text-white"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Voucher Code */}
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-sm text-green-300 mb-1">Voucher Code</div>
                  <div className="text-2xl font-bold text-white font-mono tracking-wider">
                    {selectedPurchase.voucher_code}
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Customer Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FiUser className="w-4 h-4 text-blue-400" />
                    <span className="text-white">
                      {selectedPurchase.profiles?.full_name || selectedPurchase.guest_name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiMail className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">
                      {selectedPurchase.profiles?.email || selectedPurchase.guest_email || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiPhone className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">
                      {selectedPurchase.profiles?.phone || selectedPurchase.guest_phone || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Exam Details */}
              {selectedPurchase.voucher_slots && (
                <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Exam Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="w-4 h-4 text-blue-400" />
                      <span className="text-white">{selectedPurchase.voucher_slots.exam_date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiClock className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">
                        {selectedPurchase.voucher_slots.start_time} - {selectedPurchase.voucher_slots.end_time}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiMapPin className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">{selectedPurchase.voucher_slots.location}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Information */}
              <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Pricing Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Original Price:</span>
                    <span className="text-gray-300 line-through">${selectedPurchase.original_price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-300">Discount Amount:</span>
                    <span className="text-green-300">-${selectedPurchase.discount_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Final Price:</span>
                    <span className="text-white font-bold">${selectedPurchase.final_price}</span>
                  </div>
                </div>
              </div>

              {/* Status and Dates */}
              <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Status & Dates</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedPurchase.status)}`}>
                      {selectedPurchase.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Purchased:</span>
                    <span className="text-gray-300">
                      {format(new Date(selectedPurchase.created_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Expires:</span>
                    <span className="text-gray-300">
                      {format(new Date(selectedPurchase.expires_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  {selectedPurchase.used_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Used:</span>
                      <span className="text-gray-300">
                        {format(new Date(selectedPurchase.used_at), 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
