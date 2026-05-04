import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [reviewModal, setReviewModal] = useState({ isOpen: false, task: null, feedbackMessage: '' });

  const fetchTasksAndUsers = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const [tasksRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${import.meta.env.VITE_API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksAndUsers();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, {
        title, description, assignedTo, dueDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Task created successfully');
      setTitle(''); setDescription(''); setAssignedTo(''); setDueDate('');
      fetchTasksAndUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Task deleted');
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const openReviewModal = (task) => setReviewModal({ isOpen: true, task, feedbackMessage: '' });
  const closeReviewModal = () => setReviewModal({ isOpen: false, task: null, feedbackMessage: '' });

  const handleReviewSubmit = async (status) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.put(`${import.meta.env.VITE_API_URL}/tasks/${reviewModal.task._id}`, {
        status,
        feedbackNote: reviewModal.feedbackMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Task marked as ${status === 'completed' ? 'Approved' : 'Revision Requested'}`);
      closeReviewModal();
      fetchTasksAndUsers();
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleGenerateDescription = async () => {
    if (!title) return toast.error("Enter a title first!");
    setAiLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/ai/generate-description`, { title }, { headers: { Authorization: `Bearer ${token}` }});
      setDescription(res.data.description);
      toast.success("AI Generation Complete");
    } catch (err) {
      toast.error("Failed to generate description");
    }
    setAiLoading(false);
  };

  const handleSuggestDeadline = async () => {
    if (!description) return toast.error("Write a description first!");
    setAiLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/ai/suggest-deadline`, { description }, { headers: { Authorization: `Bearer ${token}` }});
      const days = Math.floor((res.data.min + res.data.max) / 2) || 2;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      setDueDate(targetDate.toISOString().split('T')[0]);
      toast.success(`AI Suggested: ${res.data.reason} (${days} days)`);
    } catch (err) {
      toast.error("Failed to process deadline");
    }
    setAiLoading(false);
  };

  if (loading) return <div className="w-full h-[60vh] flex items-center justify-center"><div className="loader"></div></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-brand">Task Manager</h1>
      </div>

      {/* CREATE TASK FORM */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-brand mb-4">Assign New Task</h2>
        <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <input required placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-accent" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <div className="flex justify-between items-center mb-1 px-1">
              <label className="text-sm font-medium text-gray-700">Task Description</label>
              <button type="button" onClick={handleGenerateDescription} disabled={aiLoading} className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 transition shadow-sm border border-indigo-100">
                {aiLoading ? 'Thinking...' : '✨ Auto-Write'}
              </button>
            </div>
            <textarea required rows="2" placeholder="Task Description..." value={description} onChange={e => setDescription(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-accent"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 px-1">Assign To</label>
            <select required value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-accent bg-white">
              <option value="" disabled>Select User</option>
              <option value="all" className="font-bold text-brand bg-gray-50">👥 Assign to All Regular Users</option>
              {users
                .filter(u => u.email !== auth.currentUser?.email)
                .map(u => <option key={u._id} value={u._id}>{u.fullName} ({u.email})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 px-1">Due Date</label>
            <input required type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-accent" />
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-end">
             <Button type="submit">Deploy Task</Button>
          </div>
        </form>
      </div>

      {/* TASK LIST */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-muted">
              <th className="p-4">Task Name</th>
              <th className="p-4">Assigned To</th>
              <th className="p-4">Created On</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tasks.length === 0 && (
              <tr><td colSpan="6" className="p-8 text-center text-muted">No active tasks traversing the system.</td></tr>
            )}
            {tasks.map(task => (
              <tr key={task._id} className="hover:bg-gray-50/50">
                <td className="p-4">
                  <p className="font-semibold text-brand text-sm">{task.title}</p>
                  <p className="text-xs text-muted mt-1 max-w-xs truncate">{task.description}</p>
                </td>
                <td className="p-4 text-sm text-muted">{task.assignedTo?.fullName || 'Unknown'}</td>
                <td className="p-4 text-sm text-muted">{new Date(task.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-sm font-bold text-gray-700">{new Date(task.dueDate).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize whitespace-nowrap ${
                    task.status === 'completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'needs_review' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-end">
                  {task.status === 'needs_review' && (
                    <Button size="sm" onClick={() => openReviewModal(task)}>Review Panel</Button>
                  )}
                  <button onClick={() => handleDelete(task._id)} className="px-3 py-1.5 text-xs font-semibold text-danger bg-danger/10 hover:bg-danger hover:text-white rounded transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {reviewModal.isOpen && reviewModal.task && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 bg-gray-50 border-b border-gray-200 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-brand">{reviewModal.task.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-full bg-blue-100 text-blue-700">In Review</span>
                    <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-full bg-gray-200 text-gray-700">Assigned to: {reviewModal.task.assignedTo?.fullName}</span>
                  </div>
                </div>
                <button onClick={closeReviewModal} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Original Task Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                     <p className="text-sm"><span className="text-muted">Due:</span> {new Date(reviewModal.task.dueDate).toLocaleDateString()}</p>
                     <p className="text-sm"><span className="text-muted">Submitted:</span> {reviewModal.task.submittedAt ? new Date(reviewModal.task.submittedAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-700 border border-gray-100">
                    {reviewModal.task.description}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">What They Submitted</h4>
                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    {reviewModal.task.submissionNote ? (
                      <p className="text-sm text-brand italic mb-4">"{reviewModal.task.submissionNote}"</p>
                    ) : (
                      <p className="text-sm text-muted italic mb-4">No submission note provided.</p>
                    )}

                    <h5 className="text-xs font-bold text-gray-500 mb-2">Attachments</h5>
                    <div className="space-y-2">
                       {reviewModal.task.submissionText && reviewModal.task.submissionText !== 'No files or links provided.' && (
                         <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                           <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded">LINK</span>
                           <a href={reviewModal.task.submissionText} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline flex-1 truncate">
                             {reviewModal.task.submissionText}
                           </a>
                         </div>
                       )}
                       {reviewModal.task.submissionFiles?.map((file, i) => (
                         <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                           <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded">FILE</span>
                           <a href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${file}`} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline flex-1 truncate">
                             {file.split('-').pop()}
                           </a>
                         </div>
                       ))}
                       {(!reviewModal.task.submissionText || reviewModal.task.submissionText === 'No files or links provided.') && (!reviewModal.task.submissionFiles || reviewModal.task.submissionFiles.length === 0) && (
                         <p className="text-xs text-muted">No attachments.</p>
                       )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detailed Feedback</h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <button onClick={() => setReviewModal({...reviewModal, feedbackMessage: 'Great work — approved!'})} className="text-xs border border-green-200 bg-green-50 text-green-700 rounded-full px-3 py-1 hover:bg-green-100 transition">Great work — approved!</button>
                    <button onClick={() => setReviewModal({...reviewModal, feedbackMessage: 'Missing deliverable details.'})} className="text-xs border border-amber-200 bg-amber-50 text-amber-700 rounded-full px-3 py-1 hover:bg-amber-100 transition">Missing deliverables</button>
                  </div>
                  <textarea rows="3" placeholder="Write feedback to send to the user..." value={reviewModal.feedbackMessage} onChange={e => setReviewModal({...reviewModal, feedbackMessage: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-accent"></textarea>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl">
                <button onClick={() => handleReviewSubmit('revision')} className="px-5 py-2 text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 rounded-xl transition shadow-sm">
                  Request Revision
                </button>
                <button onClick={() => handleReviewSubmit('completed')} className="px-5 py-2 text-sm font-bold bg-green-500 text-white hover:bg-green-600 rounded-xl transition shadow-sm">
                  Approve Submission
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskManager;
