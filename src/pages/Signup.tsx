import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, Building, ArrowRight, AlertCircle, Chrome } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Dynamic client-side pre-validation of Master Key strength
    if (password.length < 6) {
      setError('Weak Authorization Key. Minimum length is 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await signup(email.trim(), password, firstName.trim(), lastName.trim(), company.trim());
      navigate('/tool/email-automation');
    } catch (err: any) {
      console.error('Firebase Signup failed:', err);
      const isWeakPassword = 
        err.code === 'auth/weak-password' || 
        (err.message && (
          err.message.toLowerCase().includes('weak-password') || 
          err.message.toLowerCase().includes('at least 6 characters')
        ));

      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already registered. If you already have an account, please go to the login page to access your session.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email & Password Sign-up is currently disabled in your Firebase configurations. Please use the secure Google Sign-Up button below, or enable "Email/Password" under Authentication -> Sign-in Method in your Firebase Console.');
      } else if (isWeakPassword) {
        setError('Weak Authorization Key. Minimum length is 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid transmission email.');
      } else {
        setError(err.message || 'Deployment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/tool/email-automation');
    } catch (err: any) {
      console.error('Google Sign-Up failed:', err);
      setError(err.message || 'Google authorization failed during workspace creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-100px)] items-center justify-center p-4 py-20 relative overflow-hidden">
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-neon-pink/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 hover-float mb-6 group hover:border-neon-pink/40 transition-all">
            <Zap className="w-8 h-8 text-neon-pink group-hover:scale-110 transition-transform" />
          </Link>
          <h1 className="text-4xl font-display font-black tracking-tight mb-2 text-white">Create Your Account</h1>
          <p className="text-gray-400 font-medium">Create your account and start automating emails in minutes.</p>
        </div>

        <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-2xl bg-[#050508]/80 hover:border-neon-pink/20 transition-all">
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs leading-relaxed font-mono font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 group-focus-within:text-neon-pink transition-colors ml-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-pink transition-colors">
                     <User className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    required 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-neon-pink outline-none transition-all text-base shadow-inner" 
                    placeholder="John" 
                  />
                </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 group-focus-within:text-neon-pink transition-colors ml-1">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-pink transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    required 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-neon-pink outline-none transition-all text-base shadow-inner" 
                    placeholder="Doe" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 group-focus-within:text-neon-pink transition-colors ml-1">Company Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-pink transition-colors">
                  <Building className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-neon-pink outline-none transition-all text-base shadow-inner" 
                  placeholder="Acme Corp" 
                />
              </div>
            </div>
            
            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 group-focus-within:text-neon-pink transition-colors ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-pink transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-neon-pink outline-none transition-colors duration-200"
                  placeholder="john@company.com" 
                />
              </div>
            </div>
            
            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 group-focus-within:text-neon-pink transition-colors ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-pink transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-neon-pink outline-none transition-colors duration-200"
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="magnetic-btn w-full mt-8 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-black font-display font-black text-lg group hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {loading ? 'Processing...' : 'Create Account'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] tracking-widest font-mono text-gray-500 text-center mt-6">
              INITIALIZING REQUIRES ACCEPTANCE OF <Link to="/terms" className="underline hover:text-white transition-colors">TERMS</Link> & <Link to="/privacy" className="underline hover:text-white transition-colors">PRIVACY</Link> CONFIGURATIONS.
            </p>
          </form>

          <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-[10px] font-mono tracking-widest text-gray-500 uppercase">OR CONNECT WITH</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all cursor-pointer"
          >
            <Chrome className="w-5 h-5 text-neon-pink" /> Continue with Google
          </button>

          <div className="mt-8 text-center text-sm font-medium text-gray-400 border-t border-white/10 pt-8">
            Already have an account? <Link to="/login" className="text-neon-cyan hover:text-white font-bold transition-colors ml-1 uppercase tracking-wider text-[10px]">Login</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
