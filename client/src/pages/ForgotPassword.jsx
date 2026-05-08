import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success('Reset link sent to your email!');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const slideX = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20, position: 'absolute' }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface px-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative" style={{ minHeight: '320px' }}>
        <h2 className="text-2xl font-bold text-center text-brand mb-6">Reset Password</h2>
        
        <AnimatePresence mode="popLayout">
          {!emailSent ? (
            <motion.form key="step1" {...slideX} onSubmit={handleSendResetLink} className="space-y-4">
              <p className="text-sm text-muted">Enter your registered email address. We will send you a secure link to reset your password.</p>
              <Input 
                label="Email Address" 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@email.com"
              />
              <Button type="submit" className="w-full" isLoading={loading}>Send Reset Link</Button>
              
              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm text-accent hover:underline">Back to Login</Link>
              </div>
            </motion.form>
          ) : (
            <motion.div key="step2" {...slideX} className="space-y-6 flex flex-col items-center justify-center h-full text-center mt-4">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Check Your Email</h3>
                <p className="text-sm text-muted mt-2">
                  We have sent a password reset link to <span className="font-medium text-gray-700">{email}</span>. 
                  Click the link in the email to set a new password.
                </p>
              </div>
              <Button onClick={() => navigate('/login')} className="w-full mt-4">Return to Login</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ForgotPassword;
