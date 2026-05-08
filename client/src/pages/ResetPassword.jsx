import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';

// Utility hook to get URL search parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidCode, setIsValidCode] = useState(null);
  
  const query = useQuery();
  const navigate = useNavigate();
  const oobCode = query.get('oobCode');

  useEffect(() => {
    // Verify the reset code when the component mounts
    if (oobCode) {
      verifyPasswordResetCode(auth, oobCode)
        .then(() => setIsValidCode(true))
        .catch(() => setIsValidCode(false));
    } else {
      setIsValidCode(false);
    }
  }, [oobCode]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success('Password successfully reset!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (isValidCode === null) {
    return <div className="min-h-screen flex items-center justify-center bg-surface"><div className="loader"></div></div>;
  }

  if (isValidCode === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface px-4">
        <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-brand mb-2">Invalid or Expired Link</h2>
          <p className="text-sm text-muted mb-6">This password reset link is invalid or has already been used.</p>
          <Button onClick={() => navigate('/forgot-password')} className="w-full">Request New Link</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-center text-brand mb-2">Create New Password</h2>
        <p className="text-sm text-center text-muted mb-6">Your new password must be different from previous used passwords.</p>
        
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full h-11 px-4 pr-10 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm"
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                required
                className="w-full h-11 px-4 pr-10 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm"
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-6" isLoading={loading}>Reset Password</Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
