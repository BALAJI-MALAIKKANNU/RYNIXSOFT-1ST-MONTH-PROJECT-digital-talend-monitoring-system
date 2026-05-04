import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionModal, setSubmissionModal] = useState({ isOpen: false, task: null, link: '', note: '', file: null });

  const fetchTasks = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openModal = (task) => {
    setSubmissionModal({ isOpen: true, task, link: '', note: '', file: null });
  };

  const closeModal = () => {
    setSubmissionModal({ isOpen: false, task: null, link: '', note: '', file: null });
  };

  const handleComplete = async () => {
    const { task, link, note, file } = submissionModal;
    if (!task) return;
    
    try {
      const token = await auth.currentUser.getIdToken();
      
      const formData = new FormData();
      if (link) formData.append('submissionText', link);
      if (note) formData.append('submissionNote', note);
      if (file) formData.append('files', file);
      if (!link && !file && !note) formData.append('submissionText', 'No files or links provided.');

      await axios.post(`${import.meta.env.VITE_API_URL}/tasks/${task._id}/submit`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Task submitted successfully!');
      closeModal();
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit task');
    }
  };

  if (loading) return <div className="w-full h-[60vh] flex items-center justify-center"><div className="loader"></div></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-brand">My Tasks</h1>
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-muted">
              <th className="p-4">Task Name</th>
              <th className="p-4 hidden md:table-cell">Assigned By</th>
              <th className="p-4">Created On</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tasks.length === 0 && (
              <tr><td colSpan="6" className="p-8 text-center text-muted">No tasks available.</td></tr>
            )}
            {tasks.map(task => (
              <tr key={task._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <p className="font-semibold text-brand text-sm">{task.title}</p>
                </td>
                <td className="p-4 hidden md:table-cell text-sm text-muted">{task.assignedBy?.fullName}</td>
                <td className="p-4 text-sm text-muted">{new Date(task.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-sm font-bold text-gray-700">{new Date(task.dueDate).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize whitespace-nowrap ${
                    task.status === 'completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'in-progress' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 flex justify-end">
                  {task.status !== 'completed' && task.status !== 'needs_review' ? (
                    <Button size="sm" onClick={() => openModal(task)}>Submit Task</Button>
                  ) : (
                    <span className="text-xs text-muted font-medium">Locked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {submissionModal.isOpen && submissionModal.task && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header - Sticky */}
              <div className="p-5 bg-gray-50 border-b border-gray-200 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-brand mb-1">{submissionModal.task.title}</h3>
                  <div className="flex gap-4 text-xs text-muted">
                    <span>Due: {new Date(submissionModal.task.dueDate).toLocaleDateString()}</span>
                    <span>Assigned By: {submissionModal.task.assignedBy?.fullName}</span>
                  </div>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
              </div>

              {/* Body - Scrollable */}
              <div className="p-5 overflow-y-auto flex-1">
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Task Description</h4>
                  <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed border border-gray-100">
                    {submissionModal.task.description}
                  </div>
                </div>
                
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Submit Your Work</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-brand mb-1 block">Upload File</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 hover:border-accent/40 transition cursor-pointer relative bg-white">
                      <input type="file" onChange={e => setSubmissionModal({...submissionModal, file: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <p className="text-sm font-semibold text-brand mb-1">
                        {submissionModal.file ? submissionModal.file.name : 'Click to upload or drag & drop'}
                      </p>
                      {!submissionModal.file && <p className="text-xs text-muted">PDF, DOC, PNG, ZIP...</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-brand mb-1 block">External Link</label>
                    <input 
                      type="url"
                      placeholder="https://docs.google.com/..."
                      value={submissionModal.link}
                      onChange={(e) => setSubmissionModal({ ...submissionModal, link: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-brand mb-1 block">Submission Note (Optional)</label>
                    <textarea 
                      rows="3" 
                      placeholder="Briefly explain what you did..." 
                      value={submissionModal.note} 
                      onChange={e => setSubmissionModal({...submissionModal, note: e.target.value})} 
                      className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all resize-none text-sm"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              {/* Footer - Sticky */}
              <div className="p-5 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button onClick={closeModal} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
                  Cancel
                </button>
                <Button onClick={handleComplete}>Submit Work</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyTasks;
