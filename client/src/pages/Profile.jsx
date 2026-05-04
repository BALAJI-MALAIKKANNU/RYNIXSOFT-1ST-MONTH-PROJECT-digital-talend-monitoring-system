import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { updateProfile } from 'firebase/auth';
import axios from 'axios';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Custom Tag Input States
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [aiSkillLoading, setAiSkillLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setSkills(res.data.skills || []);
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser.getIdToken();
      
      const payload = {
        fullName: e.target.fullName.value,
        bio: e.target.bio.value,
        avatar: e.target.avatar.value,
        phone: e.target.phone.value,
        department: e.target.department.value,
        skills: skills
      };

      const res = await axios.put(`${import.meta.env.VITE_API_URL}/users/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (payload.avatar) {
        await updateProfile(auth.currentUser, { photoURL: payload.avatar, displayName: payload.fullName });
      }

      setUser(res.data);
      toast.success('Profile updated successfully!');
      if (payload.avatar || payload.fullName) {
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleGenerateBio = async () => {
    if (!user?.fullName) return toast.error("Name is required");
    setAiLoading(true);
    try {
      const currentBio = document.querySelector('textarea[name="bio"]').value;
      const token = await auth.currentUser.getIdToken();
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/ai/generate-bio`, { name: user.fullName, currentBio }, { headers: { Authorization: `Bearer ${token}` }});
      const generated = res.data.bio;
      document.querySelector('textarea[name="bio"]').value = generated;
      toast.success("AI Generation Complete");
    } catch (err) {
      toast.error("Failed to generate bio");
    }
    setAiLoading(false);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (newSkill && !skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleRecommendSkills = async () => {
    const dept = document.querySelector('input[name="department"]').value;
    const bioText = document.querySelector('textarea[name="bio"]').value;

    setAiSkillLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/ai/recommend-skills`, {
        department: dept, bio: bioText
      }, { headers: { Authorization: `Bearer ${token}` }});
      
      const newSkills = res.data.skills;
      const merged = [...skills];
      newSkills.forEach(ns => {
        if (!merged.includes(ns)) merged.push(ns);
      });
      setSkills(merged);
      toast.success("AI added recommended skills!");
    } catch (err) {
      toast.error("Failed to recommend skills");
    }
    setAiSkillLoading(false);
  };

  if (loading) return <div className="w-full h-[60vh] flex items-center justify-center"><div className="loader"></div></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-brand">Profile Settings</h1>
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-6 mb-8">
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-accent/20 border-4 border-white shadow-md flex items-center justify-center text-3xl text-accent font-bold">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-brand">{user?.fullName || 'Full Name'}</h2>
            <p className="text-muted">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold capitalize text-gray-600">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand mb-1">Full Name</label>
              <input name="fullName" defaultValue={user?.fullName || ''}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand mb-1">Avatar Image URL</label>
              <input name="avatar" defaultValue={user?.avatar || ''} placeholder="https://..."
                className="w-full h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand mb-1">Phone Number</label>
              <input name="phone" defaultValue={user?.phone || ''}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand mb-1">Job Title / Department</label>
              <input name="department" defaultValue={user?.department || ''}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all" />
            </div>
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-brand mb-1">Skills (Tags)</label>
                <button type="button" onClick={handleRecommendSkills} disabled={aiSkillLoading} className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1 rounded-full hover:bg-green-100 transition shadow-sm border border-green-200 decoration-none flex items-center gap-1">
                  {aiSkillLoading ? 'Analyzing...' : '✨ Auto-Suggest Skills'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 p-2 min-h-12 border border-gray-200 rounded-xl focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all bg-white cursor-text" onClick={() => document.getElementById('skillInput').focus()}>
                {skills.map((skill, index) => (
                  <span key={index} className="flex items-center gap-1 bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm shadow-sm transition">
                    {skill}
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeSkill(skill); }} className="ml-1 text-gray-400 hover:text-white rounded-full p-0.5 focus:outline-none">
                      ✕
                    </button>
                  </span>
                ))}
                <input 
                  id="skillInput"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder={skills.length === 0 ? "Add a skill and press Enter or comma..." : ""}
                  className="flex-1 min-w-[150px] outline-none bg-transparent text-sm p-1 ml-1"
                />
              </div>
              <p className="text-xs text-muted mt-1 px-1">Type a skill and hit Enter or comma to create it as a tag.</p>
            </div>
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-brand mb-1">Bio</label>
                <button type="button" onClick={handleGenerateBio} disabled={aiLoading} className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 transition shadow-sm border border-indigo-100">
                  {aiLoading ? 'Thinking...' : '✨ Wrap Bio'}
                </button>
              </div>
              <textarea name="bio" defaultValue={user?.bio || ''} rows="4"
                className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all resize-none"></textarea>
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto mt-6">Save Changes</Button>
        </form>
      </div>
    </motion.div>
  );
};

export default Profile;
