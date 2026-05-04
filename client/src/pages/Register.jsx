import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/ui/Logo';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });
  
  const password = watch("password", "");

  const handleBackendRegister = async (firebaseUser, fullName) => {
    try {
      const token = await firebaseUser.getIdToken();
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        fullName: fullName || firebaseUser.displayName || firebaseUser.email.split('@')[0]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Successfully registered!');
      navigate('/login'); 
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to register on server.');
      console.error(err);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.fullName });
      await handleBackendRegister(userCredential.user, data.fullName);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const registerWithGoogle = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await handleBackendRegister(userCredential.user, userCredential.user.displayName);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStrength = (pw) => {
    if (pw.length === 0) return 0;
    if (pw.length < 6) return 1; 
    if (pw.length < 10) return 2; 
    return 3; 
  };
  const strength = getStrength(password);
  const strengthColors = ['bg-gray-200', 'bg-danger', 'bg-warning', 'bg-success'];

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        <h2 className="text-2xl font-bold text-center text-brand mb-6">Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" placeholder="Jane Doe" {...register('fullName')} error={errors.fullName?.message} />
          <Input label="Email" type="email" placeholder="you@email.com" {...register('email')} error={errors.email?.message} />
          <div>
            <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
            <div className="flex gap-1 mt-2">
              {[1, 2, 3].map((level) => (
                <div key={level} className={`h-1.5 flex-1 rounded-full ${strength >= level ? strengthColors[strength] : 'bg-gray-100'}`} />
              ))}
            </div>
            <span className="text-[10px] text-muted block mt-1">Weak / Medium / Strong</span>
          </div>
          <Input label="Confirm Password" type="password" placeholder="••••••••" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
          
          <Button type="submit" className="w-full mt-4" isLoading={loading}>Register</Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-muted">Or sign up with</span>
          </div>
        </div>

        <Button variant="secondary" onClick={registerWithGoogle} disabled={loading} className="w-full flex items-center justify-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </Button>
        <div className="mt-4 text-center text-sm text-muted">
          Already have an account? <Link to="/login" className="text-accent hover:underline">Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
