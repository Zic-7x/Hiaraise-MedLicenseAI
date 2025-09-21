import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CASE_TYPE_LABELS, getStatusColor } from "./UserDashboard"; // Import from UserDashboard
import { AlertCircle, FileText, Globe, CheckCircle, Clock, TrendingUp, Award } from 'lucide-react'; // Importing additional icons

export default function CaseTracking() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      setMessage('');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage('Not logged in.');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          milestones:milestones(*,
            milestone_steps(*,
              step_order,
              payments!payments_milestone_step_id_fkey(status)
            )
          )
        `)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });
      if (error) {
        console.error('Error fetching cases:', error);
        setMessage('Failed to load cases.');
      } else if (!data || data.length === 0) {
        setMessage('No cases found.');
      } else {
        const sortedCases = data.map(caseItem => ({
          ...caseItem,
          milestones: caseItem.milestones.map(milestone => ({
            ...milestone,
            milestone_steps: milestone.milestone_steps.sort((a, b) => a.step_order - b.step_order)
          }))
        }));
        setCases(sortedCases);
      }
      setLoading(false);
    };
    fetchCases();
  }, []);

  const getMilestoneProgress = (milestones) => {
    if (!milestones || milestones.length === 0) return 0;
    
    let totalSteps = 0;
    let completedSteps = 0;

    milestones.forEach(milestone => {
      if (milestone.milestone_steps && milestone.milestone_steps.length > 0) {
        totalSteps += milestone.milestone_steps.length;
        completedSteps += milestone.milestone_steps.filter(step => step.status === 'completed').length;
      }
    });

    if (totalSteps === 0) return 0; // Avoid division by zero if no steps are defined

    return Math.round((completedSteps / totalSteps) * 100);
  };

  const getMilestoneStepProgress = (milestone) => {
    if (!milestone.milestone_steps || milestone.milestone_steps.length === 0) return 0;
    const completedSteps = milestone.milestone_steps.filter(step => step.status === 'completed').length;
    return Math.round((completedSteps / milestone.milestone_steps.length) * 100);
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getMilestoneIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Award className="w-6 h-6 text-green-400" />;
      case 'in_progress':
        return <TrendingUp className="w-6 h-6 text-blue-400" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden py-6 sm:py-12">
      {/* Animated Background Elements - adapted from UserDashboard */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-40 sm:w-60 h-40 sm:h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-6 sm:mb-8 text-center">
          My Cases
        </h1>

        {loading && 
          <div className="flex justify-center items-center h-32 sm:h-48">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-400"></div>
            <p className="text-gray-300 ml-3 sm:ml-4 text-sm sm:text-base">Loading cases...</p>
          </div>
        }
        {message && !loading && 
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 shadow-xl text-center text-gray-300">
            <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4 mx-auto text-yellow-400" />
            <p className="text-base sm:text-lg">{message}</p>
          </div>
        }
        {!loading && cases.length > 0 && (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {cases.map(c => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0 lg:space-x-6 mb-4 sm:mb-6">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">{CASE_TYPE_LABELS[c.case_type] || c.case_type}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-400 truncate">Submitted: {c.submitted_at ? new Date(c.submitted_at).toLocaleString() : ''}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-400 truncate">Case Number: {c.case_number || '—'}</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:col-span-2 lg:col-span-1">
                        <span className={`font-medium px-2 sm:px-3 py-1 rounded-full text-white bg-gradient-to-r ${getStatusColor(c.status)} shadow-lg text-xs sm:text-sm`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCase(selectedCase?.id === c.id ? null : c)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm w-full sm:w-auto"
                  >
                    {selectedCase?.id === c.id ? 'Hide Details' : 'View Details'}
                  </motion.button>
                </div>

                {/* Enhanced Progress Bar */}
                {c.milestones && c.milestones.length > 0 && (
                  <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 mb-3">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                        <span className="text-base sm:text-lg font-semibold text-gray-200">Overall Progress</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl sm:text-2xl font-bold text-blue-400">{getMilestoneProgress(c.milestones)}%</span>
                        <span className="text-xs sm:text-sm text-gray-400">Complete</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 sm:h-3 shadow-inner">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 h-2 sm:h-3 rounded-full shadow-lg"
                        initial={{ width: 0 }}
                        animate={{ width: `${getMilestoneProgress(c.milestones)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}

                {/* Enhanced Milestones */}
                <AnimatePresence>
                  {selectedCase?.id === c.id && c.milestones && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                        <Award className="w-5 h-5 sm:w-7 sm:h-7 text-purple-400" />
                        <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Case Milestones</h4>
                      </div>
                      <div className="space-y-4 sm:space-y-6">
                        {c.milestones.map((milestone, index) => (
                          <motion.div
                            key={milestone.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                          >
                            {/* Milestone Header */}
                            <div className="p-4 sm:p-6 bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                                <div className="flex items-start space-x-3 sm:space-x-4">
                                  <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                                    milestone.status === 'completed' 
                                      ? 'bg-green-500/20 border-2 border-green-400' 
                                      : milestone.status === 'in_progress'
                                      ? 'bg-blue-500/20 border-2 border-blue-400 animate-pulse'
                                      : 'bg-gray-500/20 border-2 border-gray-400'
                                  }`}>
                                    {milestone.status === 'completed' ? (
                                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                                    ) : (
                                      <span className="text-sm sm:text-lg font-bold text-white">{index + 1}</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-2">
                                      <h5 className="text-lg sm:text-xl font-bold text-white truncate">{milestone.name}</h5>
                                      <span className={`px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-full text-white font-semibold bg-gradient-to-r ${getStatusColor(milestone.status)} shadow-lg`}>
                                        {milestone.status.replace('_', ' ')}
                                      </span>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-300 mb-3">{milestone.description}</p>
                                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm">
                                      {milestone.due_date && (
                                        <div className="flex items-center space-x-1">
                                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                                          <span className="text-gray-400">Due: {new Date(milestone.due_date).toLocaleDateString()}</span>
                                        </div>
                                      )}
                                      {milestone.milestone_steps && milestone.milestone_steps.length > 0 && (
                                        <div className="flex items-center space-x-1">
                                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                                          <span className="text-blue-400 font-semibold">{getMilestoneStepProgress(milestone)}% Complete</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {milestone.notes && (
                                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                  <p className="text-xs sm:text-sm text-yellow-300 italic">"{milestone.notes}"</p>
                                </div>
                              )}
                            </div>

                            {/* Enhanced Milestone Steps Timeline */}
                            {milestone.milestone_steps && milestone.milestone_steps.length > 0 && (
                              <div className="p-4 sm:p-6">
                                <h6 className="font-bold text-gray-200 text-base sm:text-lg mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                  <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                                    <span>Milestone Steps</span>
                                  </div>
                                  <span className="text-xs sm:text-sm text-gray-400 font-normal">({milestone.milestone_steps.filter(s => s.status === 'completed').length}/{milestone.milestone_steps.length} completed)</span>
                                </h6>
                                <div className="relative pl-6 sm:pl-8">
                                  {/* Timeline Line */}
                                  <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-gray-600"></div>
                                  
                                  {milestone.milestone_steps.map((step, stepIndex) => {
                                    const isPaid = step.payments && step.payments.some(payment => payment.status === 'approved');
                                    const isPaymentPending = step.payments && step.payments.some(payment => payment.status === 'pending');
                                    const isActive = step.status === 'in_progress';
                                    const isCompleted = step.status === 'completed';
                                    const isPending = step.status === 'pending';

                                    return (
                                      <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: stepIndex * 0.1 }}
                                        className="mb-4 sm:mb-6 last:mb-0 relative"
                                      >
                                        {/* Enhanced Timeline Indicator */}
                                        <div className="absolute left-0 transform -translate-x-1/2 flex items-center justify-center">
                                          <div className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-3 sm:ring-4 ring-slate-900 shadow-lg flex items-center justify-center ${
                                            isCompleted 
                                              ? 'bg-green-500' 
                                              : isActive 
                                              ? 'bg-blue-500' 
                                              : isPending
                                              ? 'bg-yellow-500'
                                              : 'bg-gray-400'
                                          }`}>
                                            {/* Pulse animation ONLY for in-progress steps */}
                                            {isActive && (
                                              <>
                                                <div className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-400 animate-ping opacity-75"></div>
                                                <div className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-300 animate-pulse opacity-50"></div>
                                              </>
                                            )}
                                            {/* Icon for each step */}
                                            {isCompleted ? (
                                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                            ) : isActive ? (
                                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                            ) : isPending ? (
                                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                            ) : (
                                              <span className="text-xs font-bold text-white">{stepIndex + 1}</span>
                                            )}
                                          </div>
                                        </div>

                                        {/* Enhanced Step Content */}
                                        <div className="ml-6 sm:ml-8">
                                          <motion.div 
                                            className={`backdrop-blur-sm rounded-xl border p-3 sm:p-5 hover:shadow-lg transition-all duration-300 ${
                                              isCompleted 
                                                ? 'bg-green-500/10 border-green-500/30 shadow-green-500/10' 
                                                : isActive 
                                                ? 'bg-blue-500/10 border-blue-500/30 shadow-blue-500/10' 
                                                : isPending
                                                ? 'bg-yellow-500/10 border-yellow-500/30 shadow-yellow-500/10'
                                                : 'bg-white/5 border-white/10'
                                            }`}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                          >
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                                              <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2 sm:mb-3">
                                                  {getStepIcon(step.status)}
                                                  <h6 className="font-bold text-white text-base sm:text-lg truncate">{step.name}</h6>
                                                  {/* Step number badge */}
                                                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs font-semibold text-gray-300 w-fit">
                                                    Step {stepIndex + 1}
                                                  </span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2 sm:mb-3">
                                                  <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full text-white font-semibold bg-gradient-to-r ${getStatusColor(step.status)} shadow-lg w-fit`}>
                                                    {step.status.replace('_', ' ')}
                                                  </span>
                                                  {step.due_date && (
                                                    <div className="flex items-center space-x-1">
                                                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                                                      <span className="text-xs sm:text-sm text-gray-400">Due: {new Date(step.due_date).toLocaleDateString()}</span>
                                                    </div>
                                                  )}
                                                </div>
                                                {step.notes && (
                                                  <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                                                    <p className="text-xs sm:text-sm text-gray-300 italic">"{step.notes}"</p>
                                                  </div>
                                                )}
                                                {step.additional_charge > 0 && (
                                                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                                    <span className="text-xs sm:text-sm text-yellow-400 font-bold">Additional Charge:</span>
                                                    <span className="text-sm sm:text-lg font-bold text-yellow-300">PKR {step.additional_charge.toLocaleString()}</span>
                                                  </div>
                                                )}
                                              </div>
                                              
                                              {/* Enhanced Payment Button */}
                                              {step.additional_charge > 0 && step.status !== 'completed' && step.status !== 'rejected' && (
                                                <div className="sm:ml-4 mt-3 sm:mt-0">
                                                  {isPaid ? (
                                                    <motion.span
                                                      whileHover={{ scale: 1.05 }}
                                                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-lg w-full sm:w-auto justify-center"
                                                    >
                                                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                      <span>Paid</span>
                                                    </motion.span>
                                                  ) : isPaymentPending ? (
                                                    <motion.span
                                                      whileHover={{ scale: 1.05 }}
                                                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-lg w-full sm:w-auto justify-center cursor-not-allowed"
                                                    >
                                                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                                      <span>Payment Waiting for Admin Verification</span>
                                                    </motion.span>
                                                  ) : (
                                                    <motion.button
                                                      whileHover={{ scale: 1.05 }}
                                                      whileTap={{ scale: 0.95 }}
                                                      onClick={() => navigate(`/checkout?step_id=${step.id}`)}
                                                      className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:shadow-lg transition-all duration-300 shadow-lg relative overflow-hidden w-full sm:w-auto"
                                                    >
                                                      <motion.div
                                                        className="absolute inset-0 bg-white/20"
                                                        initial={{ x: '-100%' }}
                                                        whileHover={{ x: '100%' }}
                                                        transition={{ duration: 0.5 }}
                                                      />
                                                      <span className="relative z-10">Pay Now</span>
                                                    </motion.button>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </motion.div>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Documents Section */}
                {selectedCase?.id === c.id && c.documents && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 sm:mt-8 border-t border-white/10 pt-6 sm:pt-8"
                  >
                    <h4 className="font-bold text-white mb-4 sm:mb-6 text-lg sm:text-xl flex items-center space-x-2">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                      <span>Uploaded Documents</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {Object.entries(c.documents).map(([key, url]) => (
                        <motion.div
                          key={key}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                        >
                          <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-300 capitalize flex-1 truncate">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-semibold transition-colors hover:underline flex-shrink-0"
                          >
                            View Document
                          </a>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
