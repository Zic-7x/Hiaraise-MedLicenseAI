import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiGift, FiCalendar, FiClock, FiDownload, FiUser, FiDollarSign, FiShield, FiPlus, FiAlertCircle, FiCheckCircle, FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import VoucherSubmissionFlow from '../components/VoucherSubmissionFlow';
import { useAnalytics } from '../utils/useAnalytics';
import { trackPageView, trackEvent } from '../utils/analytics';

export default function MyVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [pendingVouchers, setPendingVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showSubmissionFlow, setShowSubmissionFlow] = useState(false);
  
  // Enable automatic page tracking
  useAnalytics();

  // Track page view when component mounts
  useEffect(() => {
    trackPageView('/my-vouchers');
    trackEvent('page_viewed', 'engagement', 'my_vouchers_page');
  }, []);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

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

      // Fetch approved vouchers (only those with voucher codes)
      const { data: approvedData, error: approvedError } = await supabase
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
        .eq('user_id', user.id)
        .not('voucher_code', 'is', null) // Only show vouchers that have voucher codes (admin approved)
        .in('status', ['approved', 'purchased']) // Show approved and purchased vouchers
        .order('created_at', { ascending: false });
      
      if (approvedError) {
        console.error('Error fetching approved vouchers:', approvedError);
      } else {
        setVouchers(approvedData || []);
      }

      // Fetch pending vouchers (those with pending status)
      const { data: pendingData, error: pendingError } = await supabase
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
        .eq('user_id', user.id)
        .eq('status', 'pending') // Only show vouchers with pending status (awaiting admin approval)
        .order('created_at', { ascending: false });
      
      if (pendingError) {
        console.error('Error fetching pending vouchers:', pendingError);
      } else {
        setPendingVouchers(pendingData || []);
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const printVoucher = (voucher) => {
    // Create a new window with the voucher content for printing
    const printWindow = window.open('', '_blank');
    const examDate = new Date(voucher.voucher_slots.exam_date);
    const dayOfWeek = examDate.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = examDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Voucher - ${voucher.voucher_code}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; }
          .logos { display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 20px; }
          .logos img { height: 60px; }
          .hiaraise-branding { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 10px; margin-bottom: 20px; }
          .hiaraise-branding h2 { margin: 0; font-size: 24px; font-weight: bold; }
          .hiaraise-branding p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
          .hiaraise-branding a { color: white; text-decoration: none; font-weight: bold; }
          .voucher-code { background: linear-gradient(to right, #dcfce7, #dbeafe); border: 2px solid #22c55e; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px; }
          .voucher-code .label { font-size: 14px; color: #15803d; font-weight: 600; margin-bottom: 10px; }
          .voucher-code .code { font-size: 32px; font-weight: bold; font-family: monospace; margin-bottom: 10px; }
          .voucher-code .instruction { font-size: 14px; color: #16a34a; }
          .details { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
          .detail-group h3 { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
          .detail-group .value { font-size: 18px; font-weight: 600; margin-bottom: 15px; }
          .candidate-info { border-top: 1px solid #ddd; padding-top: 20px; margin-bottom: 20px; }
          .candidate-info h3 { font-size: 18px; font-weight: 600; margin-bottom: 15px; }
          .candidate-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
          .instructions { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
          .instructions h3 { color: #92400e; margin-bottom: 15px; }
          .instructions ul { color: #b45309; }
          .instructions li { margin-bottom: 8px; }
          .exam-day-instructions { background: #dbeafe; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
          .exam-day-instructions h3 { color: #1e40af; margin-bottom: 15px; }
          .exam-day-instructions ul { color: #1e3a8a; }
          .exam-day-instructions li { margin-bottom: 8px; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
          .footer p { font-size: 14px; color: #666; margin: 5px 0; }
          .footer a { color: #667eea; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logos">
            <img src="/Prometric-Logo.png" alt="Prometric Logo" />
            <div style="font-size: 24px; font-weight: bold; color: #999;">×</div>
            <img src="/logo.png" alt="Hiaraise Logo" />
          </div>
          <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 10px;">Exam Voucher</h1>
          <p style="font-size: 16px; color: #666;">Official Exam Authorization Document</p>
          
          <div class="hiaraise-branding">
            <h2>🎫 Hiaraise MedLicense</h2>
            <p>Your trusted partner for medical licensing exams | <a href="https://hiaraise.com" target="_blank">hiaraise.com</a></p>
          </div>
        </div>

        <div class="voucher-code">
          <div class="label">VOUCHER CODE</div>
          <div class="code">${voucher.voucher_code}</div>
          <div class="instruction">Present this code at the exam center</div>
        </div>

        <div class="details">
          <div>
            <div class="detail-group">
              <h3>Exam Authority</h3>
              <div class="value">${voucher.voucher_slots.exam_authority}</div>
            </div>
            <div class="detail-group">
              <h3>Exam Date</h3>
              <div class="value">${dayOfWeek}, ${formattedDate}</div>
            </div>
            <div class="detail-group">
              <h3>Exam Time</h3>
              <div class="value">${voucher.voucher_slots.start_time?.slice(0,5)} - ${voucher.voucher_slots.end_time?.slice(0,5)}</div>
            </div>
          </div>
          
          <div>
            <div class="detail-group">
              <h3>Purchase Price</h3>
              <div class="value" style="color: #16a34a;">$${voucher.voucher_slots.final_price}</div>
            </div>
            <div class="detail-group">
              <h3>Validity</h3>
              <div class="value" style="color: #dc2626;">Valid until: ${dayOfWeek}, ${formattedDate} at ${voucher.voucher_slots.end_time?.slice(0,5)}</div>
            </div>
            <div class="detail-group">
              <h3>Purchase Date</h3>
              <div class="value">${new Date(voucher.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
          </div>
        </div>

        <div class="candidate-info">
          <h3>Candidate Information</h3>
          <div class="candidate-grid">
            <div>
              <h3>Name</h3>
              <div class="value">${profile?.full_name || 'N/A'}</div>
            </div>
            <div>
              <h3>Email</h3>
              <div class="value">${user?.email || 'N/A'}</div>
            </div>
            <div>
              <h3>Phone</h3>
              <div class="value">${profile?.phone || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div class="instructions">
          <h3>📋 Step 1: Prepare Your Voucher</h3>
          <ul>
            <li><strong>Print this voucher</strong> - Keep a physical copy as backup</li>
            <li><strong>Save voucher code</strong> - Take a screenshot or write it down</li>
            <li><strong>Verify exam details</strong> - Check date, time, and authority</li>
            <li><strong>Prepare valid ID</strong> - Government-issued photo identification</li>
            <li><strong>Review Hiaraise process</strong> - Understand our exam pass workflow</li>
            <li><strong>Plan your submission</strong> - Allow time for Hiaraise processing</li>
          </ul>
        </div>

        <div class="exam-day-instructions">
          <h3>🎯 Step 2: Submit Through Hiaraise</h3>
          <ul>
            <li><strong>Visit hiaraise.com</strong> - Go to your dashboard</li>
            <li><strong>Click "Submit for Exam"</strong> - Use the button on your voucher</li>
            <li><strong>Follow Hiaraise workflow</strong> - Complete our submission process</li>
            <li><strong>Upload required documents</strong> - Submit all necessary paperwork</li>
            <li><strong>Complete submission</strong> - Finish Hiaraise service process</li>
            <li><strong>Track your progress</strong> - Monitor status in your dashboard</li>
          </ul>
        </div>

        <div style="background: #dcfce7; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #15803d; margin-bottom: 15px;">✅ Hiaraise Exam Pass Process</h3>
          <ul style="color: #166534;">
            <li><strong>Hiaraise handles everything</strong> - We manage all exam registration and scheduling</li>
            <li><strong>We coordinate with exam centers</strong> - Working on your behalf</li>
            <li><strong>You receive exam pass confirmation</strong> - Via email when ready</li>
            <li><strong>Track your application status</strong> - Real-time updates in dashboard</li>
            <li><strong>Get support throughout</strong> - Our team is here to help</li>
          </ul>
        </div>

        <div class="footer">
          <p>This voucher is valid only until the selected exam date and time. Submit through Hiaraise before expiration to get your exam pass.</p>
          <p style="font-size: 12px; color: #999;">Generated by <a href="https://hiaraise.com" target="_blank">Hiaraise MedLicense</a> • ${new Date().toISOString()}</p>
          <p style="font-size: 12px; color: #999;">Visit us at <a href="https://hiaraise.com" target="_blank">hiaraise.com</a> to submit your voucher and get your exam pass</p>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const handleSubmitVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setShowSubmissionFlow(true);
  };

  const handleSubmissionSuccess = () => {
    setShowSubmissionFlow(false);
    setSelectedVoucher(null);
    // Refresh vouchers data
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your vouchers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Vouchers - Manage Your Exam Vouchers | Hiaraise MedLicense</title>
        <meta name="description" content="View and manage your purchased exam vouchers. Track voucher status, download vouchers, and access your exam booking history. Secure voucher management for medical professionals." />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="My Vouchers - Manage Your Exam Vouchers" />
        <meta property="og:description" content="View and manage your purchased exam vouchers. Track voucher status and access your exam booking history." />
        <meta property="og:url" content="https://hiaraise.com/my-vouchers" />
        <meta property="og:type" content="website" />
      </Helmet>
      
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
              <FiGift className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">
              My Vouchers
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage and print your exam vouchers. Keep them safe until your exam day.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
              <FiGift className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white mb-1">{vouchers.length}</h3>
              <p className="text-gray-300">Approved Vouchers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
              <FiClock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white mb-1">{pendingVouchers.length}</h3>
              <p className="text-gray-300">Pending Approval</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
              <FiCheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white mb-1">
                {vouchers.filter(v => new Date() <= new Date(`${v.voucher_slots.exam_date}T${v.voucher_slots.end_time}`)).length}
              </h3>
              <p className="text-gray-300">Active Vouchers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
              <FiAlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white mb-1">
                {vouchers.filter(v => new Date() > new Date(`${v.voucher_slots.exam_date}T${v.voucher_slots.end_time}`)).length}
              </h3>
              <p className="text-gray-300">Expired Vouchers</p>
            </div>
          </motion.div>

          {/* Pending Vouchers Section */}
          {pendingVouchers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FiClock className="w-6 h-6 text-yellow-400 mr-3" />
                Pending Approval ({pendingVouchers.length})
              </h2>
              
              {/* Pending Vouchers Info Banner */}
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-400/30 rounded-2xl p-6 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiAlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">Vouchers Awaiting Admin Approval</h3>
                    <p className="text-yellow-200 text-sm mb-3">
                      Your voucher purchases are currently being reviewed by our admin team. Once approved, your voucher codes will be generated and these vouchers will appear in your "Approved Vouchers" section below.
                    </p>
                    <div className="text-yellow-300 text-sm">
                      <p className="font-semibold mb-1">What happens next:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Admin reviews your payment verification</li>
                        <li>Voucher code is generated upon approval</li>
                        <li>You'll receive an email notification</li>
                        <li>Voucher appears in "Approved Vouchers" section</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {pendingVouchers.map((voucher, index) => {
                  const examDate = new Date(voucher.voucher_slots.exam_date);
                  const dayOfWeek = examDate.toLocaleDateString('en-US', { weekday: 'long' });
                  const formattedDate = examDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                  
                  return (
                  <motion.div
                    key={voucher.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-400/30 rounded-2xl p-6"
                  >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                          <FiClock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {voucher.voucher_slots.exam_authority} Exam Voucher
                          </h3>
                          <p className="text-yellow-300 text-sm">
                              Purchased on {new Date(voucher.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                            <p className="text-yellow-200 text-sm">
                              Exam Date: {dayOfWeek}, {formattedDate}
                            </p>
                            <p className="text-yellow-200 text-sm">
                              Price: ${voucher.voucher_slots.final_price}
                            </p>
                        </div>
                      </div>
                      <div className="text-right">
                          <div className="text-yellow-300 font-semibold mb-1">Status: Pending Approval</div>
                          <div className="text-yellow-400 text-sm mb-2">Admin reviewing your payment</div>
                          <div className="text-yellow-200 text-xs">
                            Voucher code will be generated after approval
                          </div>
                      </div>
                    </div>
                  </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Voucher Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-400/30 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <FiFileText className="w-6 h-6 text-blue-400 mr-3" />
              How to Get Your Exam Pass Using This Voucher
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-300 mb-3">📋 Step 1: Prepare Your Voucher</h3>
                <ul className="text-blue-200 text-sm space-y-2">
                  <li>• <strong>Print your voucher</strong> - Keep a physical copy as backup</li>
                  <li>• <strong>Save voucher code</strong> - Take a screenshot or write it down</li>
                  <li>• <strong>Verify exam details</strong> - Check date, time, and authority</li>
                  <li>• <strong>Prepare valid ID</strong> - Government-issued photo identification</li>
                  <li>• <strong>Review Hiaraise process</strong> - Understand our exam pass workflow</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-3">🎯 Step 2: Submit Through Hiaraise</h3>
                <ul className="text-purple-200 text-sm space-y-2">
                  <li>• <strong>Click "Submit for Exam"</strong> - Use the button on this voucher</li>
                  <li>• <strong>Follow Hiaraise workflow</strong> - Complete our submission process</li>
                  <li>• <strong>Upload required documents</strong> - Submit all necessary paperwork</li>
                  <li>• <strong>Complete submission</strong> - Finish Hiaraise service process</li>
                  <li>• <strong>Track your progress</strong> - Monitor status in your dashboard</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-green-900/20 border border-green-400/30 rounded-lg">
              <h4 className="text-green-300 font-semibold mb-2">✅ Hiaraise Exam Pass Process</h4>
              <ul className="text-green-200 text-sm space-y-1">
                <li>• Hiaraise handles all exam registration and scheduling</li>
                <li>• We coordinate with exam centers on your behalf</li>
                <li>• You receive exam pass confirmation via email</li>
                <li>• Track your application status in real-time</li>
                <li>• Get support throughout the entire process</li>
              </ul>
            </div>
            <div className="mt-4 p-4 bg-amber-900/20 border border-amber-400/30 rounded-lg">
              <h4 className="text-amber-300 font-semibold mb-2">⚠️ Important Reminders</h4>
              <ul className="text-amber-200 text-sm space-y-1">
                <li>• Voucher codes are issued only after admin approval of your payment</li>
                <li>• Vouchers are valid only for the specific date and time selected</li>
                <li>• Submit through Hiaraise before voucher expiration</li>
                <li>• Voucher codes are unique and cannot be transferred after use</li>
                <li>• Contact Hiaraise support for any questions or issues</li>
                <li>• Keep this page bookmarked for easy access to your vouchers</li>
              </ul>
            </div>
          </motion.div>

          {/* Approved Vouchers List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {vouchers.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center">
                <FiGift className="w-16 h-16 text-gray-500 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {pendingVouchers.length > 0 ? 'No Approved Vouchers Yet' : 'No Vouchers Yet'}
                </h3>
                <p className="text-gray-300 mb-8 max-w-md mx-auto">
                  {pendingVouchers.length > 0 
                    ? 'You have pending voucher requests awaiting admin approval. Once approved, they will appear here with voucher codes.'
                    : 'You haven\'t purchased any exam vouchers yet. Browse our available slots and start saving on your exam fees.'
                  }
                </p>
                {pendingVouchers.length === 0 && (
                  <Link
                    to="/vouchers"
                    className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <FiPlus className="w-5 h-5" />
                    <span>Browse Vouchers</span>
                  </Link>
                )}
              </div>
            ) : (
              vouchers.map((voucher, index) => {
                const examDate = new Date(voucher.voucher_slots.exam_date);
                const dayOfWeek = examDate.toLocaleDateString('en-US', { weekday: 'long' });
                const formattedDate = examDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                });
                const isExpired = new Date() > new Date(`${voucher.voucher_slots.exam_date}T${voucher.voucher_slots.end_time}`);
                
                return (
                  <motion.div
                    key={voucher.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 ${
                      isExpired ? 'opacity-60' : 'hover:bg-white/15'
                    } transition-all duration-300`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      {/* Voucher Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                            <FiGift className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {voucher.voucher_slots.exam_authority} Exam Voucher
                            </h3>
                            <p className="text-gray-300">
                              Purchased on {new Date(voucher.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="flex items-center space-x-4">
                            <FiCalendar className="w-6 h-6 text-purple-400" />
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
                                {voucher.voucher_slots.start_time?.slice(0,5)} - {voucher.voucher_slots.end_time?.slice(0,5)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <FiDollarSign className="w-6 h-6 text-green-400" />
                            <div>
                              <p className="text-gray-300 text-sm">Price Paid</p>
                              <p className="text-white font-semibold text-lg">${voucher.voucher_slots.final_price}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <FiShield className="w-6 h-6 text-red-400" />
                            <div>
                              <p className="text-gray-300 text-sm">Valid Until</p>
                              <p className={`font-semibold text-lg ${isExpired ? 'text-red-400' : 'text-red-300'}`}>
                                {dayOfWeek} at {voucher.voucher_slots.end_time?.slice(0,5)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Voucher Code */}
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
                          <p className="text-purple-300 text-sm mb-3 font-semibold">VOUCHER CODE</p>
                          <p className="text-3xl font-bold text-white font-mono tracking-wider">
                            {voucher.voucher_code}
                          </p>
                          <p className="text-purple-200 text-sm mt-2">Present this code at the exam center</p>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col space-y-4 lg:min-w-[200px]">
                        {!isExpired && (
                          <button
                            onClick={() => handleSubmitVoucher(voucher)}
                            className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg transition-all duration-300 transform hover:scale-105"
                          >
                            <FiFileText className="w-5 h-5" />
                            <span>Submit for Exam</span>
                          </button>
                        )}
                        
                        <button
                          onClick={() => printVoucher(voucher)}
                          className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <FiDownload className="w-5 h-5" />
                          <span>Print Voucher</span>
                        </button>
                        
                        {isExpired ? (
                          <div className="text-center">
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                              <FiAlertCircle className="w-4 h-4 mr-2" />
                              Expired
                            </span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                              <FiCheckCircle className="w-4 h-4 mr-2" />
                              Active
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>
      </div>

      {/* Voucher Submission Flow Modal */}
      {showSubmissionFlow && (
        <VoucherSubmissionFlow
          voucherCode={selectedVoucher?.voucher_code}
          onClose={() => {
            setShowSubmissionFlow(false);
            setSelectedVoucher(null);
          }}
          onSuccess={handleSubmissionSuccess}
        />
      )}
    </div>
    </>
  );
}
