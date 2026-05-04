import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, ListTodo, Award, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchTasks();
  }, []);

  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand">Welcome back!</h1>
          <p className="text-muted mt-1">Here is the latest update on your tasks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-brand to-[#2a4365] p-6 rounded-2xl text-white shadow-lg overflow-hidden relative">
          <div className="z-10 relative">
            <h2 className="text-lg font-medium opacity-80">Weekly Progress</h2>
            <div className="flex items-end gap-3 mt-4">
              <span className="text-5xl font-bold tracking-tight">{progress}%</span>
              <span className="mb-1 opacity-80">Tasks Completed</span>
            </div>
            <div className="mt-6 w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${progress}%` }} 
                className="h-full bg-accent rounded-full"
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
          <PieChart className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-10 text-white" />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-500"><ListTodo size={24}/></div>
            <div>
              <p className="text-sm font-medium text-muted">To Do</p>
              <p className="text-2xl font-bold text-brand">{inProgress}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-500"><Award size={24}/></div>
            <div>
              <p className="text-sm font-medium text-muted">Completed</p>
              <p className="text-2xl font-bold text-brand">{completed}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-brand">My Active Tasks</h2>
        </div>
        
        {loading ? (
          <p className="text-muted">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center">
            <CheckCircle2 size={48} className="text-green-400 mb-3" />
            <p className="text-muted">You have no active tasks. You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task._id} className="p-4 rounded-xl border border-gray-100 hover:border-accent/30 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h4 className="font-bold text-brand text-md">{task.title}</h4>
                  <p className="text-sm text-muted mt-1 max-w-2xl line-clamp-2">{task.description}</p>
                  <p className="text-xs font-medium text-gray-400 mt-2">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                   <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    task.status === 'completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'in-progress' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserDashboard;
