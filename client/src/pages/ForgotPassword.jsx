import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if(email) setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if(otp) setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if(newPassword) navigate('/login');
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
          {step === 1 && (
            <motion.form key="step1" {...slideX} onSubmit={handleSendOtp} className="space-y-4">
              <p className="text-sm text-muted">Enter your email to receive a 6-digit OTP.</p>
              <Input label="Email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
              <Button type="submit" className="w-full">Send OTP</Button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form key="step2" {...slideX} onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-muted">Enter the OTP sent to {email}.</p>
              <Input label="OTP" required value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} />
              <Button type="submit" className="w-full">Verify OTP</Button>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form key="step3" {...slideX} onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-sm text-muted">Enter your new password.</p>
              <Input label="New Password" type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <Button type="submit" className="w-full">Reset Password</Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ForgotPassword;
