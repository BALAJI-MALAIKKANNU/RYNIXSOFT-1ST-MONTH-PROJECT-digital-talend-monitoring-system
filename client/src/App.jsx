import React, { useEffect } from 'react';
import { socket } from './lib/socket';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { pageVariants } from './animations/variants';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import MyTasks from './pages/MyTasks';
import TaskManager from './pages/TaskManager';
import Profile from './pages/Profile';
import RoleControl from './pages/RoleControl';
import TeamManagement from './pages/TeamManagement';
import Messages from './pages/Messages';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><PageWrapper><AdminDashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute requiredRole="user"><PageWrapper><UserDashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/my-tasks" element={<ProtectedRoute requiredRole="user"><PageWrapper><MyTasks /></PageWrapper></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute requiredRole="admin"><PageWrapper><TaskManager /></PageWrapper></ProtectedRoute>} />
        <Route path="/roles" element={<ProtectedRoute requiredRole="admin"><PageWrapper><RoleControl /></PageWrapper></ProtectedRoute>} />
        <Route path="/teams" element={<ProtectedRoute requiredRole="admin"><PageWrapper><TeamManagement /></PageWrapper></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><PageWrapper><Messages /></PageWrapper></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full">
    {children}
  </motion.div>
);

const App = () => {
  useEffect(() => {
    socket.on('new_task', (data) => {
      toast.success(data.message || 'New activity detected!', { icon: '🔔', duration: 5000 });
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch MongoDB _id to join chat room
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { Authorization: `Bearer ${await user.getIdToken()}` }
        });
        const users = await res.json();
        const mongoUser = users.find(u => u.firebaseUid === user.uid);
        if (mongoUser) {
          socket.emit('join_chat', mongoUser._id);
        }
      }
    });

    return () => {
      socket.off('new_task');
      unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default App;
