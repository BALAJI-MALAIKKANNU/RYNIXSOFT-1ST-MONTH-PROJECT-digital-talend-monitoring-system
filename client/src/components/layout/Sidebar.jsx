import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, Settings, LogOut } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import Logo from '../ui/Logo';

const Sidebar = ({ role }) => {
  const adminLinks = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Task Manager', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Role Control', path: '/roles', icon: <Users size={20} /> },
  ];

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Tasks', path: '/my-tasks', icon: <CheckSquare size={20} /> },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className="w-64 h-screen bg-brand text-gray-300 flex flex-col hidden md:flex border-r border-[#1a365d]">
      <div className="p-6">
        <Logo size="md" theme="dark" />
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? 'bg-accent/10 text-accent font-medium' : 'hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1a365d]">
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2 ${isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}
        >
          <Settings size={20} />
          Profile
        </NavLink>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-danger hover:bg-danger/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
