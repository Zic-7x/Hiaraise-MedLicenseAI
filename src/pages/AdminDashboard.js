// src/pages/AdminDashboard.js
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const CASE_TYPE_LABELS = {
  saudi: 'Saudi Arabia',
  uae: 'UAE',
  qatar: 'Qatar',
};
const STATUS_OPTIONS = [
  'pending',
  'under_review',
  'approved',
  'rejected',
  'completed',
];

const MILESTONE_STATUS_OPTIONS = [
  'pending',
  'in_progress',
  'completed',
  'rejected'
];

const THEME = {
  primary: 'bg-gradient-to-r from-blue-600 to-indigo-700',
  secondary: 'bg-gradient-to-r from-purple-600 to-pink-600',
  success: 'bg-gradient-to-r from-green-500 to-emerald-600',
  danger: 'bg-gradient-to-r from-red-500 to-rose-600',
  warning: 'bg-gradient-to-r from-yellow-400 to-amber-500',
  info: 'bg-gradient-to-r from-cyan-500 to-blue-500',
  dark: 'bg-gradient-to-r from-gray-800 to-gray-900',
  light: 'bg-gradient-to-r from-gray-100 to-gray-200',
  card: 'bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-lg',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20',
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    light: 'text-gray-400',
    white: 'text-white',
  }
};

const STATUS_COLORS = {
  pending: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white',
  under_review: 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
  approved: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
  rejected: 'bg-gradient-to-r from-red-400 to-rose-500 text-white',
  completed: 'bg-gradient-to-r from-purple-400 to-violet-500 text-white'
};

const MILESTONE_STATUS_COLORS = {
  pending: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white',
  in_progress: 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
  completed: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
  rejected: 'bg-gradient-to-r from-red-400 to-rose-500 text-white'
};

const TABS = ['cases', 'payments'];

function getStatusColor(status) {
  const colors = {
    pending: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white',
    in_progress: 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
    completed: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
    rejected: 'bg-gradient-to-r from-red-400 to-rose-500 text-white'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export default function AdminDashboard() {
  const [cases, setCases] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [adminId, setAdminId] = useState(null);
  const [tab, setTab] = useState('cases');
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    name: '',
    description: '',
    due_date: '',
    status: 'pending'
  });
  const [assignedAdmin, setAssignedAdmin] = useState({});

  useEffect(() => {
    fetchCases();
    fetchAdminId();
    fetchPayments();
    // eslint-disable-next-line
  }, [filter]);

  const fetchAdminId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setAdminId(user.id);
  };

  const fetchCases = async () => {
    setLoading(true);
    setMessage('');
    console.log('[AdminDashboard] Fetching cases with filter:', filter);
    let query = supabase
      .from('cases')
      .select(`
        *,
        profiles:profiles!cases_user_id_fkey(id, full_name, email, phone),
        admin:profiles!assigned_admin(id, full_name, email),
        payments!payments_case_id_fkey(id, amount, screenshot_url, status, milestone_step_id),
        milestones:milestones(*,
          milestone_steps(*, id, name, status, due_date, notes, additional_charge, step_order)
        )
      `)
      .order('submitted_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    } else {
      // Fetch all cases for 'all' filter, including those without assigned_admin
      query = query.select(`
        *,
        profiles:profiles!cases_user_id_fkey(id, full_name, email, phone),
        admin:profiles!assigned_admin(id, full_name, email),
        payments!payments_case_id_fkey(id, amount, screenshot_url, status, milestone_step_id),
        milestones:milestones(*,
          milestone_steps(*, id, name, status, due_date, notes, additional_charge, step_order)
        )
      `);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[AdminDashboard] Error fetching cases:', error);
      setMessage('Failed to load cases.');
      setCases([]);
    } else {
      console.log('[AdminDashboard] Successfully fetched cases:', data);
      const sortedCases = data.map(caseItem => ({
        ...caseItem,
        milestones: caseItem.milestones.map(milestone => ({
          ...milestone,
          milestone_steps: milestone.milestone_steps.sort((a, b) => (a.step_order || 0) - (b.step_order || 0))
        }))
      }));
      setCases(sortedCases);
      // Initialize assigned admin state based on fetched data
      const initialAssignedAdmin = {};
      sortedCases.forEach(caseItem => {
        initialAssignedAdmin[caseItem.id] = caseItem.assigned_admin;
      });
      setAssignedAdmin(initialAssignedAdmin);
    }

    setLoading(false);
  };

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select('*, profiles:profiles(id, full_name, email, phone)')
      .order('created_at', { ascending: false });
    if (!error && data) setPayments(data);
  };

  const handleStatusChange = async (caseId, newStatus, oldHistory = [], adminId) => {
    setLoading(true);
    try {
      // First verify the admin has access
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        throw new Error('Unauthorized');
      }

    // Append to status_history
    const newEntry = {
      status: newStatus,
      changed_by: adminId,
      changed_at: new Date().toISOString(),
    };
    const updatedHistory = [...(oldHistory || []), newEntry];

      const { error } = await supabase
        .from('cases')
        .update({ 
          status: newStatus, 
          status_history: updatedHistory,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId);

      if (error) throw error;

    // Get user_id for notification
      const { data: caseData } = await supabase
        .from('cases')
        .select('user_id')
        .eq('id', caseId)
        .single();

    if (caseData && caseData.user_id) {
      await supabase.from('notifications').insert({
        user_id: caseData.user_id,
          message: `Your case status has been changed to '${newStatus}'.`
        });
      }

      // Refresh the cases data
      await fetchCases();
    } catch (error) {
      console.error('Error updating case status:', error);
      setMessage(error.message || 'Failed to update case status. Please try again.');
    }
    setLoading(false);
  };

  const handleAssignToMe = async (caseId) => {
    setLoading(true);
    await supabase.from('cases').update({ assigned_admin: adminId }).eq('id', caseId);
    fetchCases();
  };

  const handlePaymentVerify = async (caseItem) => {
    setLoading(true);
    try {
      // First verify the admin has access
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      // Update the case payment verification status
      const { error: caseUpdateError } = await supabase
        .from('cases')
        .update({ 
          payment_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseItem.id);

      if (caseUpdateError) throw caseUpdateError;

      // Check if user_access record exists
      const { data: userAccessData, error: userAccessError } = await supabase
        .from('user_access')
        .select('id')
        .eq('user_id', caseItem.user_id)
        .single();

      if (userAccessError && userAccessError.code !== 'PGRST116') { // PGRST116 means no rows found
         throw userAccessError;
      }

      if (userAccessData) {
        // If record exists, update it
        const { error: updateError } = await supabase
          .from('user_access')
          .update({
            payment_verified: true,
            can_submit_case: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', caseItem.user_id);

        if (updateError) throw updateError;

      } else {
        // If record doesn't exist, insert a new one
        const { error: insertError } = await supabase
          .from('user_access')
          .insert({
            user_id: caseItem.user_id,
            payment_verified: true,
            can_submit_case: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

    // Insert notification
      const { error: notificationError } = await supabase.from('notifications').insert({
      user_id: caseItem.user_id,
      message: 'Your payment has been verified. You can now submit your case.',
    });

      if (notificationError) throw notificationError;

      // Refresh cases
      await fetchCases();

    } catch (error) {
      console.error('Error verifying payment:', error);
      setMessage(error.message || 'Failed to verify payment. Please try again.');
    }
    setLoading(false);
  };

  const handleUpdateNotes = async (caseId, notes, caseNumber) => {
    setLoading(true);
    await supabase.from('cases').update({ notes, case_number: caseNumber }).eq('id', caseId);
    fetchCases();
  };

  const handleApprovePayment = async (payment) => {
    setLoading(true);
    await supabase.from('payments').update({ status: 'approved' }).eq('id', payment.id);
    // Notify user
    await supabase.from('notifications').insert({
      user_id: payment.user_id,
      message: 'Your payment has been approved. You can now submit your case.',
    });
    fetchPayments();
    setLoading(false);
  };

  const handleRejectPayment = async (payment) => {
    setLoading(true);
    await supabase.from('payments').update({ status: 'rejected' }).eq('id', payment.id);
    // Notify user
    await supabase.from('notifications').insert({
      user_id: payment.user_id,
      message: 'Your payment was rejected. Please contact support.',
    });
    fetchPayments();
    setLoading(false);
  };

  const handleAddMilestone = async (caseId) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('milestones')
        .insert({
          case_id: caseId,
          ...newMilestone,
          due_date: newMilestone.due_date ? new Date(newMilestone.due_date).toISOString() : null
        });

      if (error) throw error;

      // Reset form
      setNewMilestone({
        name: '',
        description: '',
        due_date: '',
        status: 'pending'
      });
      setShowAddMilestone(false);

      // Refresh cases
      await fetchCases();

      // Notify user
      const { data: caseData } = await supabase
        .from('cases')
        .select('user_id')
        .eq('id', caseId)
        .single();

      if (caseData) {
        await supabase.from('notifications').insert({
          user_id: caseData.user_id,
          message: `A new milestone "${newMilestone.name}" has been added to your case.`
        });
      }
    } catch (error) {
      console.error('Error adding milestone:', error);
      setMessage('Failed to add milestone. Please try again.');
    }
    setLoading(false);
  };

  const handleDeleteMilestone = async (caseId, milestoneId) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', milestoneId);

      if (error) throw error;

      await fetchCases();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      setMessage('Failed to delete milestone. Please try again.');
    }
    setLoading(false);
  };

  const handleMilestoneUpdate = async (caseId, milestoneId, updates) => {
    setLoading(true);
    try {
      // First verify the admin has access
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      // Destructure out the milestone_steps array to prevent sending it in the update payload
      const { milestone_steps, ...updateData } = updates;

      const { error } = await supabase
        .from('milestones')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', milestoneId);

      if (error) throw error;

      // If milestone is completed, check if all milestones are completed
      if (updates.status === 'completed') {
        const { data: milestones } = await supabase
          .from('milestones')
          .select('status')
          .eq('case_id', caseId);

        const allCompleted = milestones.every(m => m.status === 'completed');
        if (allCompleted) {
          await supabase
            .from('cases')
            .update({ 
              status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', caseId);
        }
      }

      // Insert notification for milestone update
      const { data: caseData } = await supabase
        .from('cases')
        .select('user_id')
        .eq('id', caseId)
        .single();

      if (caseData) {
        await supabase.from('notifications').insert({
          user_id: caseData.user_id,
          message: `Milestone "${updates.name || 'status'}" has been updated to ${updates.status}.`
        });
      }

      // Refresh the cases data
      await fetchCases();
    } catch (error) {
      console.error('Error updating milestone:', error);
      setMessage(error.message || JSON.stringify(error) || 'Failed to update milestone. Please try again.');
    }
    setLoading(false);
  };

  const handleAddMilestoneStep = async (milestoneId, newStepData) => {
    setLoading(true);
    try {
       // Verify admin access (optional, but good practice to double-check)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (!profile || profile.role !== 'admin') throw new Error('Unauthorized');

      const { error } = await supabase
        .from('milestone_steps')
        .insert({
          milestone_id: milestoneId,
          ...newStepData,
          due_date: newStepData.due_date ? new Date(newStepData.due_date).toISOString() : null
        });

      if (error) throw error;

      // Refresh cases to show the new step
      await fetchCases();

       // Notify user about the new step (optional)
      // This would require getting the case_id from the milestone_id first

    } catch (error) {
      console.error('Error adding milestone step:', error);
      setMessage(error.message || 'Failed to add milestone step. Please try again.');
    }
    setLoading(false);
  };

  const handleUpdateMilestoneStep = async (stepId, updates) => {
    setLoading(true);
    try {
       // Verify admin access
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (!profile || profile.role !== 'admin') throw new Error('Unauthorized');

      const { error } = await supabase
        .from('milestone_steps')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', stepId);

      if (error) throw error;

      // Refresh cases to show the updated step
      await fetchCases();

       // Notify user about the step update (optional)
      // This would require getting case_id via milestone_id from the step

    } catch (error) {
      console.error('Error updating milestone step:', error);
      setMessage(error.message || 'Failed to update milestone step. Please try again.');
    }
    setLoading(false);
  };

  const handleDeleteMilestoneStep = async (stepId) => {
    if (!window.confirm('Are you sure you want to delete this milestone step?')) return;

    setLoading(true);
    try {
       // Verify admin access
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (!profile || profile.role !== 'admin') throw new Error('Unauthorized');

      const { error } = await supabase
        .from('milestone_steps')
        .delete()
        .eq('id', stepId);

      if (error) throw error;

      // Refresh cases to show the step removed
      await fetchCases();

    } catch (error) {
      console.error('Error deleting milestone step:', error);
      setMessage(error.message || 'Failed to delete milestone step. Please try again.');
    }
    setLoading(false);
  };

  // Function to handle drag end
  const onDragEnd = async (result, caseId, milestoneId) => {
    if (!result.destination) return; // Dropped outside the list

    const sourceMilestoneIndex = cases.findIndex(c => c.id === caseId).milestones.findIndex(m => m.id === milestoneId);
    const sourceMilestoneSteps = Array.from(cases.find(c => c.id === caseId).milestones.find(m => m.id === milestoneId).milestone_steps);

    // Reorder the steps on the frontend
    const [removed] = sourceMilestoneSteps.splice(result.source.index, 1);
    sourceMilestoneSteps.splice(result.destination.index, 0, removed);

    // Update the step_order for the reordered steps
    const reorderedSteps = sourceMilestoneSteps.map((step, index) => ({
      ...step,
      step_order: index // Use the new index as the step_order
    }));

    // Update the state with the new order
    const newCases = cases.map(caseItem => {
      if (caseItem.id === caseId) {
        return {
          ...caseItem,
          milestones: caseItem.milestones.map((milestone, mIndex) => {
            if (mIndex === sourceMilestoneIndex) {
              return {
                ...milestone,
                milestone_steps: reorderedSteps
              };
            }
            return milestone;
          })
        };
      }
      return caseItem;
    });
    setCases(newCases);

    // Save the new order to the database
    await saveStepOrder(reorderedSteps);
  };

  // Function to save the new step order to the database
  const saveStepOrder = async (steps) => {
    const updates = steps
      .map((step, index) => {
        if (step.step_order !== index) {
          return { id: step.id, step_order: index };
        }
        return null;
      })
      .filter(Boolean); // Removes nulls
  
    if (updates.length === 0) return; // No changes
  
    const { error } = await supabase
      .from('milestone_steps')
      .upsert(updates, { onConflict: 'id' });
  
    if (error) {
      console.error('Error saving step order:', error);
      setMessage('Failed to save step order.');
      fetchCases();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-4 md:mb-0">
              AI-Powered Admin Dashboard
            </h2>
            <div className="flex gap-4">
        {TABS.map(t => (
          <button
            key={t}
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    tab === t 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 hover:text-white'
                  }`}
            onClick={() => setTab(t)}
          >
                  {t === 'cases' ? 'Case Management' : 'Payment Center'}
          </button>
        ))}
      </div>
          </div>

      {tab === 'cases' ? (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center space-x-4">
                <label className="text-gray-300 font-medium">Status Filter:</label>
                <select 
                  value={filter} 
                  onChange={e => setFilter(e.target.value)} 
                  className="bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Cases</option>
              {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt} className="capitalize">{opt.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}

              {message && !loading && (
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl p-4 shadow-lg">
                  {message}
                </div>
              )}

          {!loading && cases.length > 0 && (
                <div className="overflow-x-auto rounded-xl">
                  <table className="w-full">
              <thead>
                      <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300">
                        <th className="p-4 text-left rounded-tl-xl">User</th>
                        <th className="p-4 text-left">Email</th>
                        <th className="p-4 text-left">Phone</th>
                        <th className="p-4 text-left">Case Type</th>
                        <th className="p-4 text-left">Service Path</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Submitted At</th>
                        <th className="p-4 text-left">Documents</th>
                        <th className="p-4 text-left">Case Number</th>
                        <th className="p-4 text-left">Notes</th>
                        <th className="p-4 text-left">Payment Proof</th>
                        <th className="p-4 text-left">Payment Info</th>
                        <th className="p-4 text-left">Assigned Admin</th>
                        <th className="p-4 text-left">Status History</th>
                        <th className="p-4 text-left">Milestones</th>
                        <th className="p-4 text-left rounded-tr-xl">Actions</th>
                </tr>
              </thead>
                    <tbody className="divide-y divide-gray-800">
                {cases.map(c => (
                  <AdminCaseRow 
                    key={c.id} 
                    caseItem={c} 
                    onStatusChange={handleStatusChange} 
                    onPaymentVerify={handlePaymentVerify} 
                    onUpdateNotes={handleUpdateNotes} 
                    onAssignToMe={handleAssignToMe}
                    onMilestoneUpdate={handleMilestoneUpdate}
                    onAddMilestone={handleAddMilestone}
                    onDeleteMilestone={handleDeleteMilestone}
                    onAddMilestoneStep={handleAddMilestoneStep}
                    onUpdateMilestoneStep={handleUpdateMilestoneStep}
                    onDeleteMilestoneStep={handleDeleteMilestoneStep}
                    adminId={adminId}
                    onDragEnd={onDragEnd}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </tbody>
            </table>
                </div>
          )}
        </div>
      ) : (
        <PaymentsTable
          payments={payments}
          loading={loading}
          onApprove={handleApprovePayment}
          onReject={handleRejectPayment}
        />
      )}
        </div>
      </div>
    </div>
  );
}

function AdminCaseRow({
  caseItem,
  onStatusChange,
  onPaymentVerify,
  onUpdateNotes,
  onAssignToMe,
  onMilestoneUpdate,
  onAddMilestone,
  onDeleteMilestone,
  onAddMilestoneStep,
  onUpdateMilestoneStep,
  onDeleteMilestoneStep,
  adminId,
  onDragEnd,
  getStatusColor,
}) {
  const [notes, setNotes] = useState(caseItem.notes || '');
  const [caseNumber, setCaseNumber] = useState(caseItem.case_number || '');
  const [editing, setEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    name: '',
    description: '',
    due_date: '',
    status: 'pending'
  });

  // State for managing milestone steps UI
  const [showAddStep, setShowAddStep] = useState(null);
  const [newStepData, setNewStepData] = useState({
    name: '',
    due_date: '',
    status: 'pending',
    additional_charge: ''
  });
  const [editingStep, setEditingStep] = useState(null);

  useEffect(() => {
    setNotes(caseItem.notes || '');
    setCaseNumber(caseItem.case_number || '');
    setEditing(false);
    setShowAddMilestone(false);
    setEditingMilestone(null);
    setShowAddStep(null);
    setEditingStep(null);
    setNewStepData({
      name: '',
      due_date: '',
      status: 'pending',
      additional_charge: ''
    });
  }, [caseItem]);

  return (
    <>
      <tr className="hover:bg-gray-800/50 transition-colors duration-200">
        <td className="p-4 text-gray-300">{caseItem.profiles?.full_name || '—'}</td>
        <td className="p-4 text-gray-300">{caseItem.profiles?.email || '—'}</td>
        <td className="p-4 text-gray-300">{caseItem.profiles?.phone || '—'}</td>
        <td className="p-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300">
            {CASE_TYPE_LABELS[caseItem.case_type] || caseItem.case_type}
          </span>
        </td>
        <td className="p-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300">
            {caseItem.path}
          </span>
        </td>
        <td className="p-4">
          <select 
            value={caseItem.status} 
            onChange={e => onStatusChange(caseItem.id, e.target.value, caseItem.status_history, adminId)} 
            className={`${STATUS_COLORS[caseItem.status]} rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500`}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt} value={opt} className="capitalize">{opt.replace('_', ' ')}</option>
            ))}
          </select>
        </td>
        <td className="p-4 text-gray-300">
          {caseItem.submitted_at ? new Date(caseItem.submitted_at).toLocaleString() : ''}
        </td>
        <td className="p-4">
          <button
            onClick={() => setShowDocuments(!showDocuments)}
            className={`${THEME.glass} text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20`}
          >
            {showDocuments ? 'Hide Documents' : 'View Documents'}
          </button>
        </td>
        <td className="p-4">
          {editing ? (
            <input 
              value={caseNumber} 
              onChange={e => setCaseNumber(e.target.value)} 
              className="bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-3 py-1.5 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            />
          ) : (
            <span className="text-gray-300">{caseItem.case_number || '—'}</span>
          )}
        </td>
        <td className="p-4">
          {editing ? (
            <input 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              className="bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-3 py-1.5 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            />
          ) : (
            <span className="text-gray-300">{caseItem.notes || '—'}</span>
          )}
        </td>
        <td className="p-4">
          {caseItem.payment_proof_url ? (
            <a 
              href={caseItem.payment_proof_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              View Proof
            </a>
          ) : '—'}
        </td>
        <td className="p-4">
          {caseItem.payments && caseItem.payments.length > 0 ? (
            <div className="space-y-2">
              {caseItem.payments.map(p => (
                <div key={p.id} className={`${THEME.glass} p-3 rounded-lg`}>
                  <div className="text-gray-300"><span className="font-medium">Amount:</span> {p.amount}</div>
                  <div className="text-gray-300"><span className="font-medium">Status:</span> {p.status}</div>
                  {p.milestone_step_id && (
                    <div className="text-gray-300">
                      <span className="font-medium">Step ID:</span> {p.milestone_step_id.substring(0, 8)}...
                    </div>
                  )}
                  {p.screenshot_url && (
                    <a 
                      href={p.screenshot_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200 block mt-1"
                    >
                      View Screenshot
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : '—'}
        </td>
        <td className="p-4">
          {caseItem.admin?.full_name ? (
            <span className="text-gray-300">{caseItem.admin.full_name}</span>
          ) : (
            <button 
              onClick={() => onAssignToMe(caseItem.id)} 
              className={`${THEME.primary} text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20`}
            >
              Assign to Me
            </button>
          )}
        </td>
        <td className="p-4">
          <button 
            onClick={() => setShowHistory(h => !h)} 
            className={`${THEME.glass} text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20`}
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </td>
        <td className="p-4">
          <button
            onClick={() => setShowMilestones(!showMilestones)}
            className={`${THEME.primary} text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20`}
          >
            {showMilestones ? 'Hide Milestones' : 'View Milestones'}
          </button>
        </td>
        <td className="p-4">
          <div className="flex space-x-2">
            <button 
              onClick={() => setEditing(!editing)} 
              className={`${THEME.warning} text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/20`}
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
          {editing && (
              <button 
                onClick={() => { onUpdateNotes(caseItem.id, notes, caseNumber); setEditing(false); }} 
                className={`${THEME.success} text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20`}
              >
                Save
              </button>
          )}
          {!caseItem.payment_verified && (caseItem.payment?.status === 'approved') && (
              <button 
                onClick={() => onPaymentVerify(caseItem)} 
                className={`${THEME.primary} text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20`}
              >
                Verify Payment
              </button>
          )}
          </div>
        </td>
      </tr>

      {/* Documents Section */}
      {showDocuments && (
        <tr>
          <td colSpan={15} className="p-4">
            <div className={`${THEME.glass} rounded-xl p-6`}>
              <h4 className="text-xl font-semibold text-gray-300 mb-4">Case Documents</h4>
              {caseItem.documents ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(caseItem.documents).map(([key, url]) => (
                    <div key={key} className={`${THEME.card} p-4 rounded-lg`}>
                      <h5 className="text-sm font-medium text-gray-400 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h5>
                      {url ? (
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm"
                        >
                          View Document
                        </a>
                      ) : (
                        <span className="text-gray-500 text-sm">Not uploaded</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No documents uploaded yet.</p>
              )}
            </div>
          </td>
        </tr>
      )}

      {/* History Section */}
      {showHistory && (
        <tr>
          <td colSpan={15} className="p-4">
            <div className={`${THEME.glass} rounded-xl p-6`}>
              <StatusHistory history={caseItem.status_history} theme={THEME} />
            </div>
          </td>
        </tr>
      )}

      {/* Milestones Section */}
      {showMilestones && caseItem.milestones && (
        <tr>
          <td colSpan={15} className="p-4">
            <div className={`${THEME.glass} rounded-xl p-6`}>
              <div className="space-y-6">
              <div className="flex justify-between items-center">
                  <h4 className="text-xl font-semibold text-gray-300">Case Milestones</h4>
                <button
                  onClick={() => setShowAddMilestone(!showAddMilestone)}
                    className={`${THEME.success} text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20`}
                >
                  {showAddMilestone ? 'Cancel Add Milestone' : 'Add Milestone'}
                </button>
              </div>

                {/* Add Milestone Form */}
              {showAddMilestone && (
                  <div className={`${THEME.card} p-6 rounded-xl mb-6`}>
                    <h5 className="text-lg font-semibold text-gray-300 mb-4">Add New Milestone</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                      <input
                        type="text"
                        value={newMilestone.name}
                        onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                          className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Milestone name"
                      />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                      <textarea
                        value={newMilestone.description}
                        onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                          className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                        placeholder="Milestone description"
                      />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={newMilestone.due_date}
                        onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                          className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                       <select
                        value={newMilestone.status}
                        onChange={(e) => setNewMilestone({ ...newMilestone, status: e.target.value })}
                          className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {MILESTONE_STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt} className="capitalize">{opt.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-4">
                      <button
                        onClick={() => setShowAddMilestone(false)}
                        className={`${THEME.glass} text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onAddMilestone(caseItem.id, newMilestone);
                           setNewMilestone({
                              name: '',
                              description: '',
                              due_date: '',
                              status: 'pending'
                            });
                          setShowAddMilestone(false);
                        }}
                        className={`${THEME.primary} text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20`}
                      >
                        Add Milestone
                      </button>
                  </div>
                </div>
              )}

                {/* Milestones Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {caseItem.milestones.map((milestone) => (
                    <div key={milestone.id} className={`${THEME.card} p-6 rounded-xl`}>
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-lg font-semibold text-gray-300">{milestone.name}</h5>
                        <div className="flex items-center space-x-3">
                        {editingMilestone?.id === milestone.id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={editingMilestone.status}
                              onChange={(e) => setEditingMilestone({
                                ...editingMilestone,
                                status: e.target.value
                              })}
                                className="bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {MILESTONE_STATUS_OPTIONS.map(opt => (
                                  <option key={opt} value={opt} className="capitalize">{opt.replace('_', ' ')}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => {
                                onMilestoneUpdate(caseItem.id, milestone.id, editingMilestone);
                                setEditingMilestone(null);
                              }}
                                className={`${THEME.success} text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200`}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingMilestone(null)}
                                className={`${THEME.glass} text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200`}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${MILESTONE_STATUS_COLORS[milestone.status]}`}>
                              {milestone.status.replace('_', ' ')}
                            </span>
                            <button
                              onClick={() => setEditingMilestone(milestone)}
                                className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDeleteMilestone(caseItem.id, milestone.id)}
                                className="text-red-400 hover:text-red-300 transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                      <p className="text-gray-400 mb-3">{milestone.description}</p>
                      
                    {milestone.due_date && (
                        <p className="text-sm text-gray-500 mb-3">
                        Due: {new Date(milestone.due_date).toLocaleDateString()}
                      </p>
                    )}

                    {milestone.notes && (
                        <p className="text-sm text-gray-400 italic mb-4">"{milestone.notes}"</p>
                    )}

                    {editingMilestone?.id === milestone.id && (
                        <div className="mb-4">
                        <textarea
                          value={editingMilestone.notes || ''}
                          onChange={(e) => setEditingMilestone({
                            ...editingMilestone,
                            notes: e.target.value
                          })}
                          placeholder="Add notes..."
                            className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows="2"
                        />
                      </div>
                    )}

                      {/* Milestone Steps Section */}
                      <div className="mt-6 pt-6 border-t border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                          <h6 className="text-sm font-semibold text-gray-300">Steps</h6>
                          <button
                             onClick={() => setShowAddStep(showAddStep === milestone.id ? null : milestone.id)}
                            className={`${THEME.primary} text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20`}
                           >
                             {showAddStep === milestone.id ? 'Cancel Add Step' : 'Add Step'}
                          </button>
                       </div>

                        {/* Add Step Form */}
                    {showAddStep === milestone.id && (
                          <div className={`${THEME.glass} p-4 rounded-lg mb-4`}>
                            <h6 className="text-sm font-medium text-gray-300 mb-3">Add New Step</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                   <input
                                       type="text"
                                       value={newStepData.name}
                                       onChange={(e) => setNewStepData({ ...newStepData, name: e.target.value })}
                                  className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Step name"
                                   />
                               </div>
                               <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Due Date (Optional)</label>
                                   <input
                                       type="date"
                                       value={newStepData.due_date}
                                       onChange={(e) => setNewStepData({ ...newStepData, due_date: e.target.value })}
                                  className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   />
                               </div>
                               <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                                   <select
                                       value={newStepData.status}
                                       onChange={(e) => setNewStepData({ ...newStepData, status: e.target.value })}
                                  className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   >
                                       {MILESTONE_STATUS_OPTIONS.map(opt => (
                                    <option key={opt} value={opt} className="capitalize">{opt.replace('_', ' ')}</option>
                                       ))}
                                   </select>
                               </div>
                               <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Additional Charge (PKR)</label>
                                   <input
                                       type="number"
                                       step="0.01"
                                       value={newStepData.additional_charge}
                                       onChange={(e) => setNewStepData({ ...newStepData, additional_charge: e.target.value })}
                                  className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 35000"
                                   />
                               </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-4">
                                   <button
                                       onClick={() => setShowAddStep(null)}
                                className={`${THEME.glass} text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200`}
                                   >
                                       Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                           onAddMilestoneStep(milestone.id, newStepData);
                                            setNewStepData({
                                               name: '',
                                               due_date: '',
                                                status: 'pending',
                                                additional_charge: ''
                                            });
                                            setShowAddStep(null);
                                        }}
                                className={`${THEME.primary} text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20`}
                                    >
                                        Add Step
                                   </button>
                            </div>
                       </div>
                    )}

                        {/* Steps List */}
{milestone.milestone_steps && milestone.milestone_steps.length > 0 ? (
  <DragDropContext onDragEnd={(result) => onDragEnd(result, caseItem.id, milestone.id)}>
    <Droppable droppableId={`milestone-${milestone.id}`}>
      {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
          {milestone.milestone_steps.map((step, index) => (
            <Draggable key={step.id} draggableId={step.id.toString()} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                                          className={`${THEME.card} p-4 rounded-lg flex items-center justify-between group hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200`}
                >
                                          <div className="flex items-center space-x-3">
                                            <div className={`w-2 h-2 rounded-full ${
                        step.status === 'completed'
                          ? 'bg-green-500'
                          : step.status === 'in_progress'
                          ? 'bg-blue-500'
                                                : 'bg-gray-500'
                                            }`}></div>
                                            <span className="text-gray-300">{step.name}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${MILESTONE_STATUS_COLORS[step.status]}`}>
                          {step.status.replace('_', ' ')}
                        </span>
                      </div>
                                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => setEditingStep(step)}
                                              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteMilestoneStep(step.id)}
                                              className="text-red-400 hover:text-red-300 transition-colors duration-200"
                          >
                            Delete
                          </button>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
) : (
                          <p className="text-sm text-gray-500 text-center py-4">No steps defined for this milestone.</p>
)}

                        {/* Edit Step Form */}
                        {editingStep && (
                          <div className={`${THEME.glass} p-4 rounded-lg mt-4 border border-blue-500/30`}>
                            <h5 className="text-lg font-semibold text-gray-300 mb-4">Edit Step: {editingStep.name}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Step Name</label>
                                <input
                                  type="text"
                                  value={editingStep.name}
                                  onChange={(e) => setEditingStep({
                                    ...editingStep,
                                    name: e.target.value
                                  })}
                                  className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                                <select
                                  value={editingStep.status}
                                  onChange={(e) => setEditingStep({
                                    ...editingStep,
                                    status: e.target.value
                                  })}
                                  className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  {MILESTONE_STATUS_OPTIONS.map(opt => (
                                    <option key={opt} value={opt} className="capitalize">{opt.replace('_', ' ')}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Due Date</label>
                                <input
                                  type="date"
                                  value={editingStep.due_date ? editingStep.due_date.split('T')[0] : ''}
                                  onChange={(e) => setEditingStep({
                                    ...editingStep,
                                    due_date: e.target.value
                                  })}
                                  className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Additional Charge (PKR)</label>
                                <input
                                  type="number"
                                  value={editingStep.additional_charge || ''}
                                  onChange={(e) => setEditingStep({
                                    ...editingStep,
                                    additional_charge: e.target.value
                                  })}
                                  className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-400 mb-2">Notes</label>
                              <textarea
                                value={editingStep.notes || ''}
                                onChange={(e) => setEditingStep({
                                  ...editingStep,
                                  notes: e.target.value
                                })}
                                rows="3"
                                className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Add any notes for this step..."
                              />
                            </div>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => {
                                  onUpdateMilestoneStep(editingStep.id, editingStep);
                                  setEditingStep(null);
                                }}
                                className={`${THEME.success} text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20`}
                              >
                                Save Changes
                              </button>
                              <button
                                onClick={() => setEditingStep(null)}
                                className={`${THEME.glass} text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200`}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function StatusHistory({ history, theme }) {
  if (!history || history.length === 0) {
    return <div className="text-gray-400">No status history available.</div>;
  }
  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-300 mb-4">Status History</h4>
      <div className="space-y-3">
        {history.map((h, idx) => (
          <div key={idx} className={`${theme.card} p-4 rounded-lg`}>
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[h.status]}`}>
                {h.status.replace('_', ' ')}
              </span>
              <span className="text-sm text-gray-400">
                {new Date(h.changed_at).toLocaleString()}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Changed by: {h.changed_by}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsTable({ payments, loading, onApprove, onReject }) {
  return (
    <div>
      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-6">
        Payment Management Center
      </h3>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full">
          <thead>
              <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300">
                <th className="p-4 text-left rounded-tl-xl">User</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Screenshot</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left rounded-tr-xl">Actions</th>
            </tr>
          </thead>
            <tbody className="divide-y divide-gray-800">
            {payments.map(p => (
                <tr key={p.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                  <td className="p-4 text-gray-300">{p.profiles?.full_name || '—'}</td>
                  <td className="p-4 text-gray-300">{p.profiles?.email || '—'}</td>
                  <td className="p-4 text-gray-300">{p.profiles?.phone || '—'}</td>
                  <td className="p-4 text-gray-300">{p.amount}</td>
                  <td className="p-4">
                  {p.screenshot_url ? (
                      <a 
                        href={p.screenshot_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      >
                        View Screenshot
                      </a>
                  ) : '—'}
                </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      p.status === 'pending' ? STATUS_COLORS.pending :
                      p.status === 'approved' ? STATUS_COLORS.approved :
                      STATUS_COLORS.rejected
                    }`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                </td>
                  <td className="p-4">
                  {p.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => onApprove(p)} 
                          className={`${THEME.success} text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20`}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => onReject(p)} 
                          className={`${THEME.danger} text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20`}
                        >
                          Reject
                        </button>
                      </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}

