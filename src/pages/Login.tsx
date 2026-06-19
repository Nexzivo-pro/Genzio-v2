import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, Chrome, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if we came from a ProtectedRoute redirection
  const locationState = location.state as { message?: string; from?: any };
  const redirectMessage = locationState?.message || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await login(email, password);
      // Perfect authentication! Navigate to tool automation
      navigate('/tool/email-automation');
    } catch (err: any) {
      console.error('Firebase Login failed:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid Email Address or Password.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email & Password Sign-in is currently disabled. Please use the secure Google Login button below, or enable "Email/Password" in your Firebase Console.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Access Denied: Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate('/tool/email-automation');
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setError(err.message || 'Google authorization failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email) {
      setError('Please enter your Email Address in the field below first, then click Reset Password.');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccessMsg('Password reset email sent. Please check your inbox for instructions.');
    } catch (err: any) {
      console.error('Password reset failed:', err);
      setError(err.message || 'Failed to dispatch reset key email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-100px)] items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-[20%] right-[30%] w-[400px] h-[400px] bg-neon-pink/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 hover-float mb-6 group hover:border-neon-cyan/40 transition-all">
            <Zap className="w-8 h-8 text-neon-cyan group-hover:scale-110 transition-transform" />
          </Link>
          <h1 className="text-4xl font-display font-black tracking-tight mb-2 text-white">System Access</h1>
          <p className="text-gray-400 font-medium">Initialize your Genzio session.</p>
        </div>

        <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-2xl bg-[#050508]/80 hover:border-neon-cyan/20 transition-all">
          {redirectMessage && !error && !successMsg && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-neon-pink/10 border border-neon-pink/20 rounded-2xl text-neon-pink text-xs leading-relaxed font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{redirectMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs leading-relaxed font-mono font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-neon-cyan/10 border border-neon-cyan/20 rounded-2xl text-neon-cyan text-xs leading-relaxed font-bold">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2 group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-focus-within:text-neon-cyan transition-colors ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-cyan transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-white/15 focus:border-neon-cyan outline-none rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none transition-all shadow-inner text-base" 
                  placeholder="you@company.com" 
                />
              </div>
            </div>
            
            <div className="space-y-2 group">
              <div className="flex items-center justify-between ml-1 mb-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-focus-within:text-neon-cyan transition-colors">Password</label>
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] font-bold uppercase tracking-widest text-neon-cyan hover:text-white transition-colors cursor-pointer outline-none border-none bg-transparent"
                >
                  Reset Password
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-cyan transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-white/15 focus:border-neon-cyan outline-none rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none transition-all shadow-inner text-base" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="magnetic-btn w-full mt-6 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-black font-display font-black text-lg group hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {loading ? 'Processing...' : 'Login'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-[10px] font-mono tracking-widest text-gray-500 uppercase">OR CONNECT WITH</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all cursor-pointer"
          >
            <Chrome className="w-5 h-5 text-neon-cyan" /> Continue with Google
          </button>

          <div className="mt-8 text-center text-sm font-medium text-gray-400 border-t border-white/10 pt-8">
            Do not have an account? <Link to="/signup" className="text-neon-pink hover:text-white font-bold transition-colors ml-1 uppercase tracking-wider text-[10px]">Create Account</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
