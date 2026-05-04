import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-4 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-muted">{title}</p>
      <h3 className="text-2xl font-bold text-brand mt-1">{value}</h3>
    </div>
  </div>
);

const AdminDashboard = () => {
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

  const pending = tasks.filter(t => t.status === 'pending').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const completed = tasks.filter(t => t.status === 'completed').length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-brand">Admin Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={tasks.length} icon={<CheckCircle size={24} />} color="bg-blue-50 text-blue-600" />
        <StatCard title="In Progress" value={inProgress} icon={<Clock size={24} />} color="bg-amber-50 text-amber-600" />
        <StatCard title="Pending Review" value={pending} icon={<AlertTriangle size={24} />} color="bg-red-50 text-red-600" />
        <StatCard title="Completed" value={completed} icon={<Users size={24} />} color="bg-green-50 text-green-600" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-brand mb-4">Recent Task Activity</h2>
        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-muted text-center py-10">No tasks found. Create one in the Task Manager!</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {tasks.slice(0, 5).map(task => (
              <div key={task._id} className="py-4 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-brand">{task.title}</h4>
                  <p className="text-sm text-muted">Assigned to: {task.assignedTo?.fullName || 'Unknown'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  task.status === 'completed' ? 'bg-green-100 text-green-700' :
                  task.status === 'in-progress' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
