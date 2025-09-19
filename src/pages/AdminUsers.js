import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setMessage('');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setMessage('Failed to load users.');
      setUsers([]);
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId, newRole) => {
    setLoading(true);
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    fetchUsers();
  };

  const handleDeactivate = async (userId) => {
    setLoading(true);
    await supabase.from('profiles').update({ role: 'deactivated' }).eq('id', userId);
    fetchUsers();
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    setLoading(true);
    await supabase.from('profiles').delete().eq('id', userId);
    fetchUsers();
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {loading && <div>Loading…</div>}
      {message && !loading && <div className="mb-4 text-blue-600">{message}</div>}
      {!loading && users.length > 0 && (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Registered</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="p-2 border">{u.full_name || '—'}</td>
                <td className="p-2 border">{u.email || '—'}</td>
                <td className="p-2 border">
                  <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)} className="p-1 border rounded">
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                    <option value="deactivated">deactivated</option>
                  </select>
                </td>
                <td className="p-2 border">{u.created_at ? new Date(u.created_at).toLocaleString() : '—'}</td>
                <td className="p-2 border space-x-1">
                  <button onClick={() => handleDeactivate(u.id)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">Deactivate</button>
                  <button onClick={() => handleDelete(u.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 