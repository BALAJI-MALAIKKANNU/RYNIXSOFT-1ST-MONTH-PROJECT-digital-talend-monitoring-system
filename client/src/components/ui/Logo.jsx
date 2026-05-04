import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ size = 'md', className = '', hideTextOnMobile = false, theme = 'light' }) => {
  const sizes = {
    sm: { container: 'w-8 h-8 rounded-lg', icon: '16', text: 'text-lg' },
    md: { container: 'w-10 h-10 rounded-xl', icon: '20', text: 'text-xl' },
    lg: { container: 'w-12 h-12 rounded-2xl', icon: '24', text: 'text-3xl' },
    xl: { container: 'w-16 h-16 rounded-2xl', icon: '32', text: 'text-4xl' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div 
        whileHover={{ rotate: 180 }} 
        transition={{ duration: 0.6, type: "spring" }}
        className={`${s.container} flex-shrink-0 bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center shadow-lg shadow-accent/30 cursor-pointer`}
      >
        <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      </motion.div>
      <span className={`font-extrabold ${s.text} tracking-tight ${hideTextOnMobile ? 'hidden sm:block' : ''} ${theme === 'dark' ? 'text-white' : 'text-brand bg-clip-text text-transparent bg-gradient-to-r from-brand to-accent'}`}>
        DTMS
      </span>
    </div>
  );
};

export default Logo;
