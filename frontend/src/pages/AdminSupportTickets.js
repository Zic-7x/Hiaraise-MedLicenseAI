import React, { useState, useEffect } from 'react';
import { useTickets } from '../hooks/useTickets';
import { useTicketMessages } from '../hooks/useTicketMessages';
import { supabase } from '../supabaseClient';
import { Sparkles, Send, MessageCircle, Filter, ArrowLeft, Loader2, Users, Clock, Image as ImageIcon } from 'lucide-react';

const STATUS_COLORS = {
  open: 'bg-blue-500/80 text-white',
  pending: 'bg-yellow-500/80 text-white',
  closed: 'bg-green-500/80 text-white'
};

async function uploadImages(files) {
  const urls = [];
  for (const file of files) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { data, error } = await supabase.storage.from('ticket-attachments').upload(filePath, file);
    if (error) {
      console.error('Upload error:', error, 'File:', file, 'Path:', filePath);
    }
    if (!error) {
      const { publicUrl } = supabase.storage.from('ticket-attachments').getPublicUrl(filePath).data;
      urls.push(publicUrl);
    }
  }
  return urls;
}

function AdminTicketDetail({ ticket, onBack, onStatusChange }) {
  const { messages, loading, error, sendMessage } = useTicketMessages(ticket.id);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(ticket.status);
  const [statusLoading, setStatusLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [adminNames, setAdminNames] = useState({});
  const [replyImages, setReplyImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Fetch ticket creator's name
  useEffect(() => {
    async function fetchUserName() {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', ticket.user_id)
        .single();
      setUserName(profile?.full_name || ticket.user_id);
    }
    fetchUserName();
  }, [ticket.user_id]);

  // Fetch admin names for admin replies
  useEffect(() => {
    async function fetchAdminNames() {
      const adminIds = Array.from(new Set(messages.filter(m => m.sender_name === 'Hiaraise Support Team').map(m => m.sender_id)));
      if (adminIds.length === 0) return;
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', adminIds);
      const nameMap = {};
      profiles?.forEach(p => { nameMap[p.id] = p.full_name; });
      setAdminNames(nameMap);
    }
    fetchAdminNames();
  }, [messages]);

  const handleSend = async () => {
    setSending(true);
    const user = (await supabase.auth.getUser()).data.user;
    let imageUrls = [];
    if (replyImages.length > 0) {
      imageUrls = await uploadImages(replyImages);
    }
    try {
      await sendMessage(user.id, reply, imageUrls);
      setReply('');
      setReplyImages([]);
    } catch {}
    setSending(false);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusLoading(true);
    try {
      await supabase.from('tickets').update({ status: newStatus }).eq('id', ticket.id);
      setStatus(newStatus);
      onStatusChange(newStatus);
    } catch {}
    setStatusLoading(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl max-w-3xl mx-auto mt-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center text-blue-400 hover:text-blue-600 mb-4 font-semibold">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to tickets
      </button>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-blue-300 mb-2">{ticket.subject}</h3>
          <div className="text-sm text-gray-400">Ticket #{ticket.ticket_number || ticket.id.substring(0, 8)}</div>
          <div className="text-sm text-blue-200 font-semibold">Created by: {userName}</div>
          <div className="text-sm text-gray-400">User ID: {ticket.user_id}</div>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-300">Status:</label>
          <select 
            value={status} 
            onChange={handleStatusChange} 
            disabled={statusLoading}
            className="bg-gray-800/50 text-gray-200 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold text-gray-300 mb-2">Conversation</div>
        <div className="space-y-4 max-h-64 overflow-y-auto bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-4 rounded-xl border border-white/10">
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              <span className="ml-2 text-gray-400">Loading messages...</span>
            </div>
          )}
          {error && <div className="text-red-400">{error}</div>}
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.sender_id === ticket.user_id ? 'items-start' : 'items-end'}`}>
              <div className={`px-4 py-2 rounded-lg shadow-md ${msg.sender_id === ticket.user_id ? 'bg-white/20 text-gray-200 border border-blue-400/20' : 'bg-blue-500/80 text-white'}`}>
                <div className="text-xs text-blue-200 font-semibold mb-1">
                  {msg.sender_name}
                  {msg.sender_name === 'Hiaraise Support Team' && adminNames[msg.sender_id] ? (
                    <span className="ml-2 text-xs text-blue-100">({adminNames[msg.sender_id]})</span>
                  ) : null}
                </div>
                {msg.message}
                {msg.images && msg.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="attachment"
                        className="w-24 h-24 object-cover rounded border border-white/20 cursor-pointer"
                        onClick={() => { setModalImage(img); setModalOpen(true); }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-1">{new Date(msg.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <textarea
          value={reply}
          onChange={e => setReply(e.target.value)}
          rows={2}
          className="flex-1 rounded-lg border border-blue-400/30 bg-white/10 text-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Type your reply..."
        />
        <label className="flex items-center gap-2 cursor-pointer text-blue-300 hover:text-blue-400">
          <ImageIcon className="w-5 h-5" /> Attach Images
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => setReplyImages(Array.from(e.target.files))}
          />
        </label>
        {replyImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {replyImages.map((img, idx) => (
              <img key={idx} src={URL.createObjectURL(img)} alt="preview" className="w-16 h-16 object-cover rounded border border-white/20" />
            ))}
          </div>
        )}
        <button
          onClick={handleSend}
          disabled={sending || !reply.trim()}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setModalOpen(false)}>
          <img src={modalImage} alt="full attachment" className="max-h-[80vh] max-w-[90vw] rounded shadow-lg" onClick={e => e.stopPropagation()} />
          <button className="absolute top-8 right-8 text-white text-3xl font-bold" onClick={() => setModalOpen(false)}>&times;</button>
        </div>
      )}
    </div>
  );
}

export default function AdminSupportTickets() {
  const { tickets, loading, error, fetchTickets } = useTickets({ isAdmin: true });
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [userNames, setUserNames] = useState({});

  // Fetch all user names for ticket list
  useEffect(() => {
    async function fetchUserNames() {
      const userIds = Array.from(new Set(tickets.map(t => t.user_id)));
      if (userIds.length === 0) return;
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);
      const nameMap = {};
      profiles?.forEach(p => { nameMap[p.id] = p.full_name; });
      setUserNames(nameMap);
    }
    fetchUserNames();
  }, [tickets]);

  const filteredTickets = tickets.filter(ticket =>
    statusFilter === 'all' ? true : ticket.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center py-12 animate-fade-in">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-blue-400" /> Admin: Support Tickets
          </h2>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-gray-800/50 text-gray-200 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Tickets</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        {selected ? (
          <AdminTicketDetail
            ticket={selected}
            onBack={() => setSelected(null)}
            onStatusChange={() => fetchTickets()}
          />
        ) : (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" /> All Tickets
            </h3>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <span className="ml-3 text-gray-400">Loading tickets...</span>
              </div>
            )}
            {error && <div className="text-red-400">{error}</div>}
            {!loading && filteredTickets.length === 0 && (
              <div className="text-gray-400 text-lg text-center py-8">No tickets found.</div>
            )}
            {!loading && filteredTickets.length > 0 && (
              <div className="grid grid-cols-1 gap-6">
                {filteredTickets.map(ticket => (
                  <div
                    key={ticket.id}
                    className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-white/10 rounded-xl p-5 shadow-lg hover:shadow-blue-500/20 transition-all duration-200 cursor-pointer group animate-fade-in"
                    onClick={() => setSelected(ticket)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-lg font-semibold text-blue-300 group-hover:text-white transition">{ticket.subject}</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[ticket.status]}`}>{ticket.status}</span>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">Ticket #{ticket.ticket_number || ticket.id.substring(0, 8)}</div>
                    <div className="text-sm text-blue-200 font-semibold">Created by: {userNames[ticket.user_id] || ticket.user_id}</div>
                    <div className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      Last updated: {new Date(ticket.updated_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
