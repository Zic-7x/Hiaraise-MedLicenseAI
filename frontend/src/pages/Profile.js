import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiGift, FiCalendar, FiClock, FiDownload, FiUser, FiDollarSign, FiShield } from 'react-icons/fi';

export default function Profile() {
  const [profile, setProfile] = useState({
    full_name: '',
    passport_no: '',
    phone: '',
    education: '',
    qualification: '',
    profile_image_url: '',
    credentials_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [credentialsFile, setCredentialsFile] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [vouchersLoading, setVouchersLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage('Not logged in.');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) {
        setMessage('Could not fetch profile.');
      } else {
        setProfile(data);
      }
      setLoading(false);
    };
    
    const fetchVouchers = async () => {
      setVouchersLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
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
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching vouchers:', error);
        } else {
          setVouchers(data || []);
        }
      }
      setVouchersLoading(false);
    };
    
    fetchProfile();
    fetchVouchers();
  }, []);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

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
          .instructions { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; }
          .instructions h3 { color: #92400e; margin-bottom: 15px; }
          .instructions ul { color: #b45309; }
          .instructions li { margin-bottom: 8px; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
          .footer p { font-size: 14px; color: #666; margin: 5px 0; }
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
              <div class="value">${profile.full_name || 'N/A'}</div>
            </div>
            <div>
              <h3>Email</h3>
              <div class="value">${profile.email || 'N/A'}</div>
            </div>
            <div>
              <h3>Phone</h3>
              <div class="value">${profile.phone || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div class="instructions">
          <h3>Important Instructions</h3>
          <ul>
            <li><strong>Arrive 30 minutes early</strong> - You must arrive at least 30 minutes before your scheduled exam time</li>
            <li><strong>Bring valid ID</strong> - Government-issued photo identification is required</li>
            <li><strong>Present this voucher</strong> - Show this document and voucher code at the exam center</li>
            <li><strong>No rescheduling</strong> - This voucher is valid only for the selected date and time</li>
            <li><strong>Keep safe</strong> - Print this voucher and keep it secure until your exam</li>
          </ul>
        </div>

        <div class="footer">
          <p>This voucher is valid only until the selected exam date and time. No extensions or rescheduling allowed.</p>
          <p style="font-size: 12px; color: #999;">Generated by Hiaraise • ${new Date().toISOString()}</p>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage('Not logged in.');
      setLoading(false);
      return;
    }
    // Handle profile image upload
    let profile_image_url = profile.profile_image_url;
    if (profileImage) {
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(`${user.id}/profile.${profileImage.name.split('.').pop()}`, profileImage, { upsert: true });
      if (error) {
        setMessage('Failed to upload profile image.');
        setLoading(false);
        return;
      }
      profile_image_url = supabase.storage.from('profile-images').getPublicUrl(data.path).data.publicUrl;
    }
    // Handle credentials upload
    let credentials_url = profile.credentials_url;
    if (credentialsFile) {
      const { data, error } = await supabase.storage
        .from('credentials')
        .upload(`${user.id}/credentials.${credentialsFile.name.split('.').pop()}`, credentialsFile, { upsert: true });
      if (error) {
        setMessage('Failed to upload credentials.');
        setLoading(false);
        return;
      }
      credentials_url = supabase.storage.from('credentials').getPublicUrl(data.path).data.publicUrl;
    }
    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update({
        ...profile,
        profile_image_url,
        credentials_url,
      })
      .eq('id', user.id);
    if (error) {
      setMessage('Failed to update profile.');
    } else {
      setMessage('Profile updated successfully!');
    }
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-secondary-200">Loading…</div>;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
       {/* Background Elements */}
       <div className="absolute inset-0 bg-grid-pattern opacity-5" />
       <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 via-transparent to-transparent opacity-50" />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Form */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
          className="w-full space-y-8 relative bg-secondary-800/60 backdrop-blur-md rounded-2xl p-10 md:p-12 shadow-glass border border-secondary-700/60"
        >
      <h2 className="text-3xl font-display font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            My Profile
          </span>
        </h2>
      {message && <div className="mb-4 text-blue-600 text-sm text-center">{message}</div>}
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-secondary-300">Full Name</label>
          <input
            id="full_name"
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={profile.full_name || ''}
            onChange={handleChange}
            className="block w-full mt-1 px-3 py-2 bg-secondary-900/50 border border-secondary-700/50 rounded-lg text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="passport_no" className="block text-sm font-medium text-secondary-300">Passport Number</label>
          <input
            id="passport_no"
            type="text"
            name="passport_no"
            placeholder="Passport Number"
            value={profile.passport_no || ''}
            onChange={handleChange}
            className="block w-full mt-1 px-3 py-2 bg-secondary-900/50 border border-secondary-700/50 rounded-lg text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-colors"
          />
        </div>
        <div>
           <label htmlFor="phone" className="block text-sm font-medium text-secondary-300">Phone Number</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={profile.phone || ''}
            onChange={handleChange}
             className="block w-full mt-1 px-3 py-2 bg-secondary-900/50 border border-secondary-700/50 rounded-lg text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-colors"
          />
        </div>
        <div>
           <label htmlFor="education" className="block text-sm font-medium text-secondary-300">Education</label>
          <input
            id="education"
            type="text"
            name="education"
            placeholder="Education"
            value={profile.education || ''}
            onChange={handleChange}
             className="block w-full mt-1 px-3 py-2 bg-secondary-900/50 border border-secondary-700/50 rounded-lg text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="qualification" className="block text-sm font-medium text-secondary-300">Qualification</label>
          <input
            id="qualification"
            type="text"
            name="qualification"
            placeholder="Qualification"
            value={profile.qualification || ''}
            onChange={handleChange}
            className="block w-full mt-1 px-3 py-2 bg-secondary-900/50 border border-secondary-700/50 rounded-lg text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-colors"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-secondary-300">Profile Image</label>
          <input type="file" accept="image/*" onChange={e => setProfileImage(e.target.files[0])} className="block w-full text-sm text-secondary-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500/10 file:text-primary-400 hover:file:bg-primary-500/20"/>
          {profile.profile_image_url && (
            <img src={profile.profile_image_url} alt="Profile" className="mt-4 w-24 h-24 object-cover rounded-full border-2 border-primary-500/50 shadow-glow-sm" />
          )}
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-secondary-300">Credentials (PDF/JPG/PNG)</label>
          <input type="file" accept=".pdf,image/*" onChange={e => setCredentialsFile(e.target.files[0])} className="block w-full text-sm text-secondary-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500/10 file:text-primary-400 hover:file:bg-primary-500/20"/>
          {profile.credentials_url && (
            <a href={profile.credentials_url} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 underline block mt-2 text-sm">View Uploaded Credentials</a>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full flex justify-center py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300
            ${loading
              ? 'bg-secondary-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-glow'
            }
          `}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            'Update Profile'
          )}
        </button>
      </form>
      </motion.div>

      {/* Vouchers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full space-y-8 relative bg-secondary-800/60 backdrop-blur-md rounded-2xl p-10 md:p-12 shadow-glass border border-secondary-700/60"
      >
        <h2 className="text-3xl font-display font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            My Vouchers
          </span>
        </h2>
        
        {vouchersLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-secondary-300">Loading vouchers...</p>
          </div>
        ) : vouchers.length === 0 ? (
          <div className="text-center py-12">
            <FiGift className="w-16 h-16 text-secondary-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-300 mb-2">No Vouchers Yet</h3>
            <p className="text-secondary-400 mb-6">You haven't purchased any exam vouchers yet.</p>
            <a
              href="/vouchers"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <FiGift className="w-5 h-5" />
              <span>Browse Vouchers</span>
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {vouchers.map((voucher, index) => {
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
                  className={`bg-secondary-900/50 border border-secondary-700/50 rounded-xl p-6 ${
                    isExpired ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Voucher Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                          <FiGift className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {voucher.voucher_slots.exam_authority} Exam Voucher
                          </h3>
                          <p className="text-secondary-400 text-sm">
                            Purchased on {new Date(voucher.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-3">
                          <FiCalendar className="w-5 h-5 text-primary-400" />
                          <div>
                            <p className="text-secondary-300 text-sm">Exam Date</p>
                            <p className="text-white font-semibold">{dayOfWeek}, {formattedDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FiClock className="w-5 h-5 text-accent-400" />
                          <div>
                            <p className="text-secondary-300 text-sm">Exam Time</p>
                            <p className="text-white font-semibold">
                              {voucher.voucher_slots.start_time?.slice(0,5)} - {voucher.voucher_slots.end_time?.slice(0,5)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FiDollarSign className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-secondary-300 text-sm">Price Paid</p>
                            <p className="text-white font-semibold">${voucher.voucher_slots.final_price}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FiShield className="w-5 h-5 text-red-400" />
                          <div>
                            <p className="text-secondary-300 text-sm">Valid Until</p>
                            <p className={`font-semibold ${isExpired ? 'text-red-400' : 'text-red-300'}`}>
                              {dayOfWeek} at {voucher.voucher_slots.end_time?.slice(0,5)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Voucher Code */}
                      <div className="bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-lg p-4">
                        <p className="text-primary-300 text-sm mb-2">Voucher Code</p>
                        <p className="text-2xl font-bold text-white font-mono tracking-wider">
                          {voucher.voucher_code}
                        </p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col space-y-3 lg:min-w-[200px]">
                      <button
                        onClick={() => printVoucher(voucher)}
                        className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <FiDownload className="w-4 h-4" />
                        <span>Print Voucher</span>
                      </button>
                      
                      {isExpired && (
                        <div className="text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                            Expired
                          </span>
                        </div>
                      )}
                      
                      {!isExpired && (
                        <div className="text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                            Active
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
      </div>
    </div>
  );
} 