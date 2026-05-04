import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';

const RoleControl = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.put(`${import.meta.env.VITE_API_URL}/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User role updated successfully');
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  if (loading) return <div className="w-full h-[60vh] flex items-center justify-center"><div className="loader"></div></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-brand">Role Control</h1>
      <p className="text-muted">Promote or demote users across the system.</p>
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-muted">
              <th className="p-4">User Name</th>
              <th className="p-4 hidden md:table-cell">Email</th>
              <th className="p-4">Current Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(user => (
              <tr key={user._id} className="hover:bg-gray-50/50">
                <td className="p-4 font-semibold text-brand text-sm">{user.fullName}</td>
                <td className="p-4 hidden md:table-cell text-sm text-muted">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                    user.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-end">
                  {user.role === 'user' ? (
                    <Button size="sm" onClick={() => handleRoleChange(user._id, 'admin')}>Promote to Admin</Button>
                  ) : (
                    <button onClick={() => handleRoleChange(user._id, 'user')} className="px-3 py-1.5 text-xs font-semibold text-danger bg-danger/10 hover:bg-danger hover:text-white rounded transition-colors">
                      Demote to User
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RoleControl;
