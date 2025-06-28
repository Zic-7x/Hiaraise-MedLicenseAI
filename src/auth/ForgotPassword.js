import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the password reset link.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        {message && <p className="text-sm mb-2 text-blue-600">{message}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border mb-4 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
