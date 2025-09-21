import React, { useState } from 'react';
import { useTickets } from '../hooks/useTickets';
import { useTicketMessages } from '../hooks/useTicketMessages';
import { supabase } from '../supabaseClient';
import { Sparkles, Send, MessageCircle, PlusCircle, ArrowLeft, Loader2, Lock, Image as ImageIcon } from 'lucide-react';

const TICKET_TYPES = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'billing', label: 'Billing & Payment' },
  { value: 'account', label: 'Account Issues' },
  { value: 'case', label: 'Case Status' },
  { value: 'other', label: 'Other' }
];

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

function TicketDetail({ ticket, onBack }) {
  const { messages, loading, error, sendMessage } = useTicketMessages(ticket.id);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [replyImages, setReplyImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Check if user can send a message (not closed and it's their turn)
  const canUserSendMessage = () => {
    if (ticket.status === 'closed') return false;
    if (messages.length === 0) return true;
    const lastMessage = messages[messages.length - 1];
    return lastMessage.sender_id !== ticket.user_id;
  };

  const handleSend = async () => {
    if (!canUserSendMessage()) return;
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

  const isTicketClosed = ticket.status === 'closed';
  const canSend = canUserSendMessage();

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl max-w-2xl mx-auto mt-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center text-blue-400 hover:text-blue-600 mb-4 font-semibold">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to tickets
      </button>
      <h3 className="text-2xl font-bold text-blue-300 mb-2">{ticket.subject}</h3>
      <div className="mb-2 text-sm text-gray-400">
        Ticket #{ticket.ticket_number || ticket.id.substring(0, 8)}
      </div>
      <div className="mb-2 text-sm text-gray-400">
        Status: <span className={`capitalize font-semibold px-2 py-1 rounded-full text-xs ${STATUS_COLORS[ticket.status]}`}>{ticket.status}</span>
        {isTicketClosed && <span className="ml-2 text-red-400 flex items-center gap-1"><Lock className="w-3 h-3" />Ticket Closed</span>}
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
            <div key={msg.id} className={`flex flex-col ${msg.sender_id === ticket.user_id ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-2 rounded-lg shadow-md ${msg.sender_id === ticket.user_id ? 'bg-blue-500/80 text-white' : 'bg-white/20 text-gray-200 border border-blue-400/20'}`}>
                <div className="text-xs text-blue-200 font-semibold mb-1">{msg.sender_name}</div>
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
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setModalOpen(false)}>
          <img src={modalImage} alt="full attachment" className="max-h-[80vh] max-w-[90vw] rounded shadow-lg" onClick={e => e.stopPropagation()} />
          <button className="absolute top-8 right-8 text-white text-3xl font-bold" onClick={() => setModalOpen(false)}>&times;</button>
        </div>
      )}
      {!isTicketClosed && (
        <div className="flex flex-col gap-2 mt-4">
          <textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            rows={2}
            disabled={!canSend}
            className={`flex-1 rounded-lg border border-blue-400/30 bg-white/10 text-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${!canSend ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={!canSend ? "Waiting for admin response..." : "Type your reply..."}
          />
          {canSend && (
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
          )}
          {replyImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {replyImages.map((img, idx) => (
                <img key={idx} src={URL.createObjectURL(img)} alt="preview" className="w-16 h-16 object-cover rounded border border-white/20" />
              ))}
            </div>
          )}
          <button
            onClick={handleSend}
            disabled={sending || !reply.trim() || !canSend}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      )}
      {!canSend && !isTicketClosed && (
        <div className="mt-3 text-sm text-yellow-400 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Waiting for admin response before you can send another message
        </div>
      )}
    </div>
  );
}

export default function SupportTickets() {
  const { tickets, loading, error, createTicket } = useTickets();
  const [showNew, setShowNew] = useState(false);
  const [ticketType, setTicketType] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formError, setFormError] = useState(null);
  const [newImages, setNewImages] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    let imageUrls = [];
    if (newImages.length > 0) {
      imageUrls = await uploadImages(newImages);
    }
    try {
      const ticketSubject = subject;
      const ticketTypeLabel = TICKET_TYPES.find(t => t.value === ticketType)?.label || ticketType;
      await createTicket(ticketTypeLabel, ticketSubject, message, imageUrls);
      setTicketType('');
      setSubject('');
      setMessage('');
      setNewImages([]);
      setShowNew(false);
    } catch (err) {
      setFormError(err.message);
    }
    setSubmitting(false);
  };

  if (selected) {
    return <TicketDetail ticket={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center py-12 animate-fade-in">
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-blue-400" /> Support Tickets
          </h2>
          <button
            onClick={() => setShowNew(!showNew)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
          >
            <PlusCircle className="w-5 h-5" /> {showNew ? 'Cancel' : 'New Ticket'}
          </button>
        </div>
        {showNew && (
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8 shadow-xl animate-fade-in">
            <div className="mb-4">
              <label className="block text-gray-300 font-medium mb-2">Ticket Type</label>
              <select
                value={ticketType}
                onChange={e => setTicketType(e.target.value)}
                required
                className="w-full rounded-lg border border-blue-400/30 bg-white/10 text-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="">Select ticket type...</option>
                {TICKET_TYPES.map(type => (
                  <option key={type.value} value={type.value} className="bg-gray-800">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 font-medium mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Enter subject..."
                required
                className="w-full rounded-lg border border-blue-400/30 bg-white/10 text-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 font-medium mb-2">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Describe your issue..."
                required
                rows={4}
                className="w-full rounded-lg border border-blue-400/30 bg-white/10 text-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-blue-300 hover:text-blue-400 mb-4">
              <ImageIcon className="w-5 h-5" /> Attach Images
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => setNewImages(Array.from(e.target.files))}
              />
            </label>
            {newImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {newImages.map((img, idx) => (
                  <img key={idx} src={URL.createObjectURL(img)} alt="preview" className="w-16 h-16 object-cover rounded border border-white/20" />
                ))}
              </div>
            )}
            {formError && <div className="text-red-400 mb-2">{formError}</div>}
            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null} {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        )}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-400" /> Your Tickets
          </h3>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <span className="ml-3 text-gray-400">Loading tickets...</span>
            </div>
          )}
          {error && <div className="text-red-400">{error}</div>}
          {!loading && tickets.length === 0 && (
            <div className="text-gray-400 text-lg text-center py-8">No tickets yet.</div>
          )}
          {!loading && tickets.length > 0 && (
            <div className="grid grid-cols-1 gap-6">
              {tickets.map(ticket => (
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
                  <div className="text-sm text-gray-400">Last updated: {new Date(ticket.updated_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 