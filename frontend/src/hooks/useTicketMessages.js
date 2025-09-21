import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export function useTicketMessages(ticketId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages for a ticket
  const fetchMessages = useCallback(async () => {
    if (!ticketId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  // Send a new message
  const sendMessage = useCallback(async (senderId, message, images = []) => {
    setError(null);
    try {
      // Fetch sender's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', senderId)
        .single();
      let sender_name = 'User';
      if (profile) {
        if (profile.role === 'admin') {
          sender_name = 'Hiaraise Support Team';
        } else {
          sender_name = profile.full_name || 'User';
        }
      }
      const { error } = await supabase
        .from('ticket_messages')
        .insert([{ ticket_id: ticketId, sender_id: senderId, message, sender_name, images }]);
      if (error) throw error;
      await fetchMessages();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [ticketId, fetchMessages]);

  // Real-time subscription
  useEffect(() => {
    fetchMessages();
    if (!ticketId) return;
    const sub = supabase
      .channel('ticket-messages-changes-' + ticketId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${ticketId}` }, fetchMessages)
      .subscribe();
    return () => {
      supabase.removeChannel(sub);
    };
  }, [ticketId, fetchMessages]);

  return { messages, loading, error, fetchMessages, sendMessage };
} 