import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '', limit: 50, members: [] });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();
      const [teamsRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/teams`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${import.meta.env.VITE_API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setTeams(teamsRes.data);
      setUsers(usersRes.data.filter(u => u.role === 'user'));
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/teams`, newTeam, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams([...teams, res.data]);
      toast.success('Team created successfully!');
      setModalOpen(false);
      setNewTeam({ name: '', description: '', limit: 50, members: [] });
      setSearchTerm('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create team');
    }
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`${import.meta.env.VITE_API_URL}/teams/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(teams.filter(t => t._id !== id));
      toast.success('Team deleted');
    } catch (err) {
      toast.error('Failed to delete team');
    }
  };

  const handleAddMember = async (teamId, userId) => {
    if (!userId) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/teams/${teamId}/members`, { userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(teams.map(t => t._id === teamId ? res.data : t));
      toast.success('Member added!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (teamId, userId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/teams/${teamId}/members/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(teams.map(t => t._id === teamId ? res.data : t));
      toast.success('Member removed');
    } catch (err) {
      toast.error('Failed to remove member');
    }
  };

  if (loading) return <div className="w-full h-[60vh] flex items-center justify-center"><div className="loader"></div></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand">Team Management</h1>
          <p className="text-muted">Create groups and assign users for bulk tasks.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Create Team</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teams.length === 0 && <p className="text-muted">No teams created yet.</p>}
        {teams.map(team => (
          <div key={team._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-brand">{team.name}</h3>
              <button onClick={() => handleDeleteTeam(team._id)} className="text-gray-400 hover:text-danger text-sm">Delete</button>
            </div>
            <p className="text-sm text-muted mb-4">{team.description}</p>
            
            <div className="flex justify-between items-center text-xs text-brand font-medium mb-3">
              <span>Members ({team.members.length}/{team.limit})</span>
            </div>
            
            <div className="flex-1 bg-gray-50 rounded-lg p-3 overflow-y-auto max-h-48 mb-4 border border-gray-100">
              {team.members.length === 0 && <p className="text-xs text-muted text-center py-2">No members yet</p>}
              {team.members.map(member => (
                <div key={member._id} className="flex justify-between items-center bg-white p-2 rounded border border-gray-100 mb-2">
                  <span className="text-sm text-brand truncate">{member.fullName}</span>
                  <button onClick={() => handleRemoveMember(team._id, member._id)} className="text-xs text-danger font-semibold hover:underline">Remove</button>
                </div>
              ))}
            </div>
            
            <div className="mt-auto flex gap-2">
              <select id={`add-user-${team._id}`} className="flex-1 h-9 px-3 rounded-lg border border-gray-200 outline-none focus:border-accent text-sm" defaultValue="">
                <option value="" disabled>Add user...</option>
                {users.filter(u => !team.members.find(m => m._id === u._id)).map(u => (
                  <option key={u._id} value={u._id}>{u.fullName}</option>
                ))}
              </select>
              <Button size="sm" onClick={() => {
                const select = document.getElementById(`add-user-${team._id}`);
                handleAddMember(team._id, select.value);
                select.value = '';
              }}>Add</Button>
            </div>
          </div>
        ))}
      </div>

      {createPortal(
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-gray-100 overflow-hidden"
              >
                <div className="p-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-brand">Create New Team</h3>
                  <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
                </div>
                <form onSubmit={handleCreateTeam} className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                    <input required type="text" value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-accent outline-none" placeholder="e.g. Section A" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={newTeam.description} onChange={e => setNewTeam({...newTeam, description: e.target.value})} className="w-full p-3 rounded-lg border border-gray-200 focus:border-accent outline-none text-sm" placeholder="Optional details..." rows="3"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member Limit</label>
                    <input type="number" min="1" value={newTeam.limit} onChange={e => setNewTeam({...newTeam, limit: parseInt(e.target.value)})} className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-accent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Add Members</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-accent outline-none text-sm" 
                        placeholder="Search users to add..." 
                      />
                      {searchTerm && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-lg max-h-48 overflow-y-auto z-50">
                          {users.filter(u => u?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) && !newTeam.members.includes(u._id)).length === 0 ? (
                            <div className="p-3 text-sm text-gray-500 text-center">No users found</div>
                          ) : (
                            users.filter(u => u?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) && !newTeam.members.includes(u._id)).map(u => (
                              <div 
                                key={u._id} 
                                onClick={() => {
                                  setNewTeam({ ...newTeam, members: [...newTeam.members, u._id] });
                                  setSearchTerm('');
                                }}
                                className="p-3 hover:bg-gray-50 cursor-pointer text-sm text-brand border-b border-gray-50 last:border-0"
                              >
                                {u.fullName}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    {newTeam.members.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {newTeam.members.map(userId => {
                          const user = users.find(u => u._id === userId);
                          if (!user) return null;
                          return (
                            <div key={userId} className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full text-xs font-medium text-brand">
                              <span>{user.fullName}</span>
                              <button 
                                type="button" 
                                onClick={() => setNewTeam({ ...newTeam, members: newTeam.members.filter(id => id !== userId) })}
                                className="text-gray-400 hover:text-danger ml-1"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
                    <Button type="submit">Create</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      , document.body)}
    </motion.div>
  );
};

export default TeamManagement;
