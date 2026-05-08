import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, Settings, LogOut, MessageCircle } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import Logo from '../ui/Logo';

const Sidebar = ({ role, isOpen, setIsOpen }) => {
  const adminLinks = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Task Manager', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Team Control', path: '/teams', icon: <Users size={20} /> },
    { name: 'Role Control', path: '/roles', icon: <Users size={20} /> },
    { name: 'Messages', path: '/messages', icon: <MessageCircle size={20} /> },
  ];
  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Tasks', path: '/my-tasks', icon: <CheckSquare size={20} /> },
    { name: 'Messages', path: '/messages', icon: <MessageCircle size={20} /> },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-brand text-gray-300 flex flex-col border-r border-[#1a365d] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6">
        <Logo size="md" theme="dark" />
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={() => setIsOpen(false)}
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
