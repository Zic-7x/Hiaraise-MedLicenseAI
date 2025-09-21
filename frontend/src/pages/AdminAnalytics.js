import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCases: 0,
    casesByStatus: {},
    totalPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setMessage('');
    // Total users
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    // Total cases
    const { count: caseCount } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true });
    // Cases by status
    const { data: cases } = await supabase
      .from('cases')
      .select('status');
    const casesByStatus = {};
    if (cases) {
      cases.forEach(c => {
        casesByStatus[c.status] = (casesByStatus[c.status] || 0) + 1;
      });
    }
    // Total payments verified
    const { count: payments } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .eq('payment_verified', true);
    setStats({
      totalUsers: userCount || 0,
      totalCases: caseCount || 0,
      casesByStatus,
      totalPayments: payments || 0,
    });
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Admin Analytics</h2>
      {loading && <div>Loading…</div>}
      {!loading && (
        <div className="space-y-4">
          <div className="text-lg">Total Users: <span className="font-bold">{stats.totalUsers}</span></div>
          <div className="text-lg">Total Cases: <span className="font-bold">{stats.totalCases}</span></div>
          <div className="text-lg">Total Payments Verified: <span className="font-bold">{stats.totalPayments}</span></div>
          <div>
            <h3 className="font-semibold mb-2">Cases by Status:</h3>
            <ul className="list-disc ml-6">
              {Object.entries(stats.casesByStatus).map(([status, count]) => (
                <li key={status}>{status}: <span className="font-bold">{count}</span></li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {message && <div className="mt-4 text-blue-600">{message}</div>}
    </div>
  );
} 
