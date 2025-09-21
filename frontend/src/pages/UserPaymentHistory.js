import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { CASE_TYPE_LABELS } from "./UserDashboard";
import { getStatusColor } from "./UserDashboard";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function UserPaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const { data: allPayments, error: paymentsError } = await supabase
      .from('payments')
      .select('*, cases!payments_case_id_fkey(case_type)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError);
      setError("Failed to fetch payment history.");
      setPayments([]);
    } else {
      setPayments(allPayments || []);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden py-12">
      {/* Animated Background Elements - adapted from UserDashboard */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles - adapted from UserDashboard */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-display font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-8 text-center"
        >
          Payment History
        </motion.h1>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
              <p className="text-gray-300 ml-4">Loading payments...</p>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center flex flex-col items-center justify-center h-48">
              <AlertCircle className="w-12 h-12 mb-4" />
              <p className="text-lg">{error}</p>
            </div>
          ) : payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map(p => (
                <motion.div 
                  key={p.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white text-lg">Payment for {p.milestone_step_id ? 'Milestone Step' : p.case_id ? `Case (${CASE_TYPE_LABELS[p.cases?.case_type] || 'N/A'})` : 'Package'}</p>
                      <p className="text-md text-gray-300 mt-1">Amount: PKR {p.amount}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${getStatusColor(p.status)} text-white`}>
                      {p.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Date: {new Date(p.created_at).toLocaleDateString()} {new Date(p.created_at).toLocaleTimeString()}
                  </p>
                  {p.screenshot_url && (
                    <div className="mt-4">
                      <a 
                        href={p.screenshot_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                      >
                        <Clock className="w-4 h-4 mr-1" /> View Screenshot
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center flex flex-col items-center justify-center h-48">
              <XCircle className="w-12 h-12 mb-4" />
              <p className="text-lg">No payment history found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 