import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { Sparkles, Tags, UploadCloud, Activity, Shield, Layout, ArrowRight, LogIn } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [hoveredNav, setHoveredNav] = useState(null);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
  ];

  const features = [
    { icon: Sparkles, title: 'AI-Powered Profiles', desc: 'Generate professional corporate biographies instantly with our embedded AI engine. Focus on your work, not your writing.', colSpan: 'col-span-1 md:col-span-2' },
    { icon: Tags, title: 'Smart Tagging', desc: 'Organize skills and task requirements with a seamless, interactive tagging system that adapts as you type.', colSpan: 'col-span-1' },
    { icon: UploadCloud, title: 'Seamless Uploads', desc: 'Attach physical documents, PDFs, and external workspace links directly to your task submissions.', colSpan: 'col-span-1' },
    { icon: Layout, title: 'Task Orchestration', desc: 'A centralized hub for admins to create, assign, and track employee tasks with complete organizational visibility.', colSpan: 'col-span-1 md:col-span-2' },
    { icon: Activity, title: 'Real-time Analytics', desc: 'Track organizational bottlenecks and monitor individual performance metrics instantly from your dashboard.', colSpan: 'col-span-1 md:col-span-2' },
    { icon: Shield, title: 'Role-Based Security', desc: 'Enterprise-grade authentication ensuring that admins and standard users stay perfectly segregated and secure.', colSpan: 'col-span-1' },
  ];

  return (
    <div className="font-sans text-brand bg-[#f0f4f8] overflow-x-hidden min-h-screen selection:bg-accent selection:text-white">
      
      {/* Floating Glassmorphism Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-full px-6 py-3 flex justify-between items-center transition-all duration-300">
        
        {/* Animated SVG Logo */}
        <div onClick={() => window.scrollTo(0, 0)}>
          <Logo size="md" hideTextOnMobile={true} />
        </div>

        {/* Animated Nav Links */}
        <div className="hidden md:flex relative gap-2">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onMouseEnter={() => setHoveredNav(link.name)}
              onMouseLeave={() => setHoveredNav(null)}
              className="relative px-4 py-2 text-sm font-semibold text-gray-600 hover:text-brand transition-colors z-10"
            >
              {link.name}
              {hoveredNav === link.name && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-blue-50/80 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Clear Call to Actions */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="hidden sm:flex font-semibold text-gray-600 hover:bg-gray-100/50 gap-2 items-center rounded-full" 
            onClick={() => navigate('/login')}
          >
            <LogIn size={16} /> Login
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              className="font-bold px-6 py-2.5 rounded-full bg-gradient-to-r from-accent to-blue-600 shadow-[0_0_20px_rgba(55,138,221,0.3)] border-none text-white" 
              onClick={() => navigate('/register')}
            >
              Sign Up Free
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="scroll-mt-32 relative pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-center min-h-[95vh] max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full lg:w-[50%] flex flex-col items-center lg:items-start text-center lg:text-left mx-auto max-w-2xl px-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 text-accent font-semibold text-sm mb-6 border border-blue-200/50">
            <Sparkles size={14} /> Powered by Gemini AI
          </div>
          
          <h1 className="text-5xl lg:text-[5rem] font-extrabold tracking-tighter text-brand mb-6 leading-[1.05]">
            Manage Talent. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-blue-500 to-purple-600 animate-gradient-x">
              Master Tasks.
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-500 mb-10 max-w-lg leading-relaxed font-medium">
            Stop wrestling with messy workflows. DTMS provides a centralized, AI-powered workspace to track employee tasks, submit work securely, and monitor progress.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
            <motion.div whileHover={{ scale: 1.05 }} className="w-full sm:w-auto">
              <Button size="lg" className="w-full px-8 py-4 rounded-2xl shadow-[0_8px_30px_rgba(55,138,221,0.3)] text-base group" onClick={() => navigate('/register')}>
                Create Account
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="w-full sm:w-auto">
              <Button size="lg" variant="ghost" className="w-full px-8 py-4 rounded-2xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-700 text-base" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                Explore Features
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Gen-AI Generated Hero Asset Space */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 w-full lg:w-[50%] mt-16 lg:mt-0"
        >
          {/* Placeholder for your AI generated vector illustration */}
          <div className="w-full aspect-square max-w-2xl mx-auto rounded-[3rem] bg-gradient-to-br from-blue-100/50 to-purple-100/50 border border-white/60 shadow-2xl backdrop-blur-3xl flex items-center justify-center p-8 overflow-hidden relative">
             <img src="/images/hero.png" alt="DTMS App Interface" className="w-full h-full object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700" />
          </div>
        </motion.div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="how-it-works" className="scroll-mt-32 py-16 relative z-20">
        <motion.div 
           initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }}
           className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { icon: Layout, title: 'Assign Tasks Easily', desc: 'Admins can create and assign tasks effortlessly with complete visibility.' },
            { icon: Activity, title: 'Track Progress', desc: 'Monitor task status and performance metrics dynamically at a glance.' },
            { icon: UploadCloud, title: 'Submit Your Work', desc: 'Users can submit their tasks, files, and links with absolute ease.' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 p-4 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/60 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center flex-shrink-0 border border-blue-100/50 shadow-inner text-accent">
                <item.icon size={28} strokeWidth={2.5} />
              </div>
              <div className="mt-2 sm:mt-0">
                <h3 className="font-bold text-lg text-brand mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[250px] mx-auto sm:mx-0">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Bento Box Features Section */}
      <section id="features" className="scroll-mt-32 py-24 px-6 relative z-20">
        <div className="max-w-[1200px] mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-brand tracking-tight mb-4">
            Built for the Modern Workflow
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Engineered from the ground up with AI integrations and cinematic UI.</p>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col overflow-hidden relative group ${feature.colSpan}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-accent mb-6 z-10">
                <feature.icon size={24} strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-brand z-10">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed z-10">{feature.desc}</p>
              
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section id="contact" className="scroll-mt-32 relative py-40 flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.35]"
          style={{ backgroundImage: "url('/images/footer_bg.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0f4f8] via-white/80 to-white/95 backdrop-blur-[6px]"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold text-brand mb-6 drop-shadow-sm">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-xl text-gray-600 mb-10 font-medium max-w-xl mx-auto leading-relaxed drop-shadow-sm">
            Join the Digital Talent Management System now and streamline your organization's entire workflow effortlessly.
          </p>
          <Button size="lg" className="px-12 py-4 text-lg font-bold shadow-2xl shadow-accent/30 hover:-translate-y-1 transition-transform" onClick={() => navigate('/register')}>
            Get Started Now
          </Button>
        </motion.div>
      </section>

      {/* Absolute Bottom Footer Bar */}
      <footer className="py-8 bg-white border-t border-gray-100 text-center text-sm text-gray-500 font-medium w-full relative z-20">
        © {new Date().getFullYear()} Digital Talent Management System. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Landing;
