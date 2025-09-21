import { supabase } from '../supabaseClient';

// Notify user or admin of a new ticket reply
export async function notifyTicketReply({ ticket, senderId, message, isAdminReply }) {
  // If admin replies, notify the ticket owner. If user replies, notify admin(s) (for now, just owner for demo)
  const recipientId = isAdminReply ? ticket.user_id : null; // null: you can extend to notify all admins
  if (!recipientId) return;
  const notification = {
    user_id: recipientId,
    message: `New reply on your support ticket: ${ticket.subject}`,
    read: false,
    created_at: new Date().toISOString(),
  };
  await supabase.from('notifications').insert([notification]);
} 
