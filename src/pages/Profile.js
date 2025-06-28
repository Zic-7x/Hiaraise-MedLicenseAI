import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

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
    fetchProfile();
  }, []);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
       {/* Background Elements */}
       <div className="absolute inset-0 bg-grid-pattern opacity-5" />
       <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 via-transparent to-transparent opacity-50" />

      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
        className="max-w-xl w-full space-y-8 relative bg-secondary-800/60 backdrop-blur-md rounded-2xl p-10 md:p-12 shadow-glass border border-secondary-700/60"
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
    </div>
  );
} 