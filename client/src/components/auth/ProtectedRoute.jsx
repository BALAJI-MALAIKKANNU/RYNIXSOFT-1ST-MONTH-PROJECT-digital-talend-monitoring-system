import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import Sidebar from '../layout/Sidebar';
import Topbar from '../layout/Topbar';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('role') || 'user';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-surface"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && requiredRole !== userRole) {
    return <Navigate to={userRole === 'admin' ? '/admin-dashboard' : '/dashboard'} replace />;
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar role={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={{ displayName: user.displayName || user.email?.split('@')[0], role: userRole, photoURL: user.photoURL }} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
