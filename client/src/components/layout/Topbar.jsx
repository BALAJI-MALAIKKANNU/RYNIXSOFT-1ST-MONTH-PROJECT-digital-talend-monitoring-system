import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Topbar = ({ user }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Menu size={20} />
        </button>
        <h2 className="text-xl font-semibold text-brand md:block hidden">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-brand relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
        </button>
        
        <Link to="/profile" className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:opacity-80 transition cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-brand">{user?.displayName || 'User'}</p>
            <p className="text-xs text-muted capitalize">{user?.role || 'user'}</p>
          </div>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-accent/20 shadow-sm" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 shadow-sm flex items-center justify-center text-accent font-bold">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
