import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

// Helper: get current user (assumes Supabase Auth)
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Generate ticket number
function generateTicketNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `TKT-${timestamp}-${random}`;
}

export function useTickets({ isAdmin = false } = {}) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tickets (all for admin, own for user)
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('tickets').select('*').order('updated_at', { ascending: false });
      if (!isAdmin) {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not logged in');
        query = query.eq('user_id', user.id);
      }
      const { data, error } = await query;
      if (error) throw error;
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Create a new ticket
  // createTicket(ticketType, subject, message, images)
  const createTicket = useCallback(async (ticketType, subject, message, images = []) => {
    setError(null);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not logged in');
      const ticketNumber = generateTicketNumber();
      // Insert ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert([{ 
          user_id: user.id, 
          subject,
          type: ticketType,
          ticket_number: ticketNumber
        }])
        .select()
        .single();
      if (ticketError) throw ticketError;
      // Insert first message
      const { error: msgError } = await supabase
        .from('ticket_messages')
        .insert([{ ticket_id: ticket.id, sender_id: user.id, message, images }]);
      if (msgError) throw msgError;
      await fetchTickets();
      return ticket;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchTickets]);

  // Real-time subscription
  useEffect(() => {
    fetchTickets();
    const sub = supabase
      .channel('tickets-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, fetchTickets)
      .subscribe();
    return () => {
      supabase.removeChannel(sub);
    };
  }, [fetchTickets]);

  return { tickets, loading, error, fetchTickets, createTicket };
} 
