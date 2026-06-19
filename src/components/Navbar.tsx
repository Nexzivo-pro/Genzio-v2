import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Zap, Sun, Moon, ChevronDown, Mail, BarChart3, MessageSquare, LogOut, ShieldCheck } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuth } from '../lib/AuthContext';

import { GenzioLogo } from './GenzioLogo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, userProfile, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu or dropdown on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener to close tool dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToolClick = (path: string) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <GenzioLogo className="w-8 h-8" />
            <span className="font-display font-medium text-2xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-cyan group-hover:to-neon-pink transition-all duration-300 ml-1">
              Genzio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm font-medium transition-colors duration-300 hover:text-neon-cyan relative py-1 ${location.pathname === '/' ? 'text-neon-cyan' : 'text-gray-300'}`}>
              Home
              {location.pathname === '/' && (
                <motion.div layoutId="navbar-active-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-cyan/80 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
              )}
            </Link>
            
            <Link to="/features" className={`text-sm font-medium transition-colors duration-300 hover:text-neon-cyan relative py-1 ${location.pathname === '/features' ? 'text-neon-cyan' : 'text-gray-300'}`}>
              Features
              {location.pathname === '/features' && (
                <motion.div layoutId="navbar-active-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-cyan/80 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
              )}
            </Link>

            {/* Tool Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`text-sm font-medium transition-colors duration-300 hover:text-neon-cyan flex items-center gap-1 cursor-pointer outline-none relative py-1 ${
                  isDropdownOpen || location.pathname.startsWith('/tool') ? 'text-neon-cyan' : 'text-gray-300'
                }`}
              >
                <span>Tool</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                {location.pathname.startsWith('/tool') && (
                  <motion.div
                    layoutId="navbar-active-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-cyan/80 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]"
                  />
                )}
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-4 w-72 glass rounded-2xl border border-white/10 p-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] z-50 backdrop-blur-2xl bg-[#0a0a0f]/95 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent pointer-events-none" />
                    <button
                      onClick={() => handleToolClick('/tool/email-automation')}
                      className="w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-white/5 group transition-all duration-300 cursor-pointer relative"
                    >
                      <div className="p-2.5 rounded-xl bg-neon-cyan/10 text-neon-cyan group-hover:bg-neon-cyan group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.1)] group-hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] mt-0.5">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold transition-colors group-hover:text-neon-cyan drop-shadow-md">Email Automation</p>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed group-hover:text-gray-400">Visual sequence builder and intelligent routing.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleToolClick('/tool/email-verification')}
                      className="w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-white/5 group transition-all duration-300 cursor-pointer relative"
                    >
                      <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400 group-hover:bg-green-500 group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.1)] group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] mt-0.5">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold transition-colors group-hover:text-green-400 drop-shadow-md">Email Verification</p>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed group-hover:text-gray-400">Validate lists and identify risky addresses.</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleToolClick('/tool/email-automation')}
                      className="w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-white/5 group transition-all duration-300 cursor-pointer relative"
                    >
                      <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 group-hover:bg-pink-500 group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,10,120,0.1)] group-hover:shadow-[0_0_20px_rgba(255,10,120,0.4)] mt-0.5">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold transition-colors group-hover:text-neon-pink drop-shadow-md">Campaigns</p>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed group-hover:text-gray-400">Manage active running loops and prospect data.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleToolClick('/tool/analytics')}
                      className="w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-white/5 group transition-all duration-300 cursor-pointer relative"
                    >
                      <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-0.5">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold transition-colors group-hover:text-purple-400 drop-shadow-md">Analytics</p>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed group-hover:text-gray-400">Track opens, clicks, and conversion metrics.</p>
                      </div>
                    </button>

                    <Link
                      to="/tool/ai-chat"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-white/5 group transition-all duration-300 cursor-pointer relative"
                    >
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] mt-0.5">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold transition-colors group-hover:text-amber-500 drop-shadow-md">Genzio AI</p>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed group-hover:text-gray-400">Interact with the core optimization matrix.</p>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/pricing" className={`text-sm font-medium transition-colors duration-300 hover:text-neon-cyan relative py-1 ${location.pathname === '/pricing' ? 'text-neon-cyan' : 'text-gray-300'}`}>
              Pricing
              {location.pathname === '/pricing' && (
                <motion.div layoutId="navbar-active-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-cyan/80 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
              )}
            </Link>

            <Link to="/blog" className={`text-sm font-medium transition-colors duration-300 hover:text-neon-cyan relative py-1 ${location.pathname === '/blog' ? 'text-neon-cyan' : 'text-gray-300'}`}>
              Blog
              {location.pathname === '/blog' && (
                <motion.div layoutId="navbar-active-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-cyan/80 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
              )}
            </Link>

            <Link to="/about" className={`text-sm font-medium transition-colors duration-300 hover:text-neon-cyan relative py-1 ${location.pathname === '/about' ? 'text-neon-cyan' : 'text-gray-300'}`}>
              About
              {location.pathname === '/about' && (
                <motion.div layoutId="navbar-active-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-cyan/80 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
              )}
            </Link>

            <Link to="/contact" className={`text-sm font-medium transition-colors duration-300 hover:text-neon-cyan relative py-1 ${location.pathname === '/contact' ? 'text-neon-cyan' : 'text-gray-300'}`}>
              Contact
              {location.pathname === '/contact' && (
                <motion.div layoutId="navbar-active-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-cyan/80 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
              )}
            </Link>
          </div>


          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-300 hover:text-neon-cyan transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  {user.photoURL || userProfile?.photoURL ? (
                    <img 
                      src={user.photoURL || userProfile?.photoURL} 
                      alt={user.displayName || userProfile?.name || 'User'} 
                      className="w-8 h-8 rounded-full border border-white/20 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center text-neon-cyan text-xs font-bold font-mono">
                      {(user.displayName || userProfile?.displayName || userProfile?.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs text-gray-400 font-mono max-w-[100px] truncate" title={user.email || ''}>
                    {user.displayName || userProfile?.displayName || userProfile?.name || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors duration-300 cursor-pointer"
                >
                  Log out
                </button>
                <Link to="/tool/email-automation" className="btn-primary text-sm px-5 py-2">
                  Go to Tool
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-neon-pink transition-colors duration-300">
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary text-sm px-5 py-2 group/btn relative overflow-hidden flex items-center gap-2">
                  <span className="relative z-10 transition-transform duration-300 group-hover/btn:-translate-x-1">Start Automation</span>
                  <Zap className="w-3.5 h-3.5 relative z-10 opacity-0 -translate-x-4 transition-all duration-300 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 group-hover/btn:scale-110 group-hover/btn:text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-pink opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-300 hover:text-neon-cyan transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10 mt-4 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/" className="block text-base font-medium text-gray-300 hover:text-neon-cyan transition-colors py-1">Home</Link>
              <Link to="/features" className="block text-base font-medium text-gray-300 hover:text-neon-cyan transition-colors py-1">Features</Link>

              {/* Mobile Tool drop-items inline */}
              <div className="pt-2 pb-2 mt-2 border-y border-white/5 space-y-2">
                <span className="block text-xs font-mono uppercase tracking-widest text-[#555] font-bold px-1 mb-2">Tools</span>
                <button
                  onClick={() => handleToolClick('/tool/email-automation')}
                  className="w-full text-left block text-sm font-medium text-gray-400 hover:text-neon-cyan py-1"
                >
                  Email Automation
                </button>
                <button
                  onClick={() => handleToolClick('/tool/email-verification')}
                  className="w-full text-left block text-sm font-medium text-gray-400 hover:text-green-400 py-1"
                >
                  Email Verification
                </button>
                <button
                  onClick={() => handleToolClick('/tool/email-automation')}
                  className="w-full text-left block text-sm font-medium text-gray-400 hover:text-neon-pink py-1"
                >
                  Campaigns
                </button>
                <button
                  onClick={() => handleToolClick('/tool/analytics')}
                  className="w-full text-left block text-sm font-medium text-gray-400 hover:text-purple-400 py-1"
                >
                  Analytics
                </button>
                <Link
                  to="/tool/ai-chat"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-medium text-gray-400 hover:text-amber-500 py-1"
                >
                  Genzio AI
                </Link>
              </div>

              <Link to="/pricing" className="block text-base font-medium text-gray-300 hover:text-neon-cyan transition-colors py-1">Pricing</Link>
              <Link to="/blog" className="block text-base font-medium text-gray-300 hover:text-neon-cyan transition-colors py-1">Blog</Link>
              <Link to="/about" className="block text-base font-medium text-gray-300 hover:text-neon-cyan transition-colors py-1">About</Link>
              <Link to="/contact" className="block text-base font-medium text-gray-300 hover:text-neon-cyan transition-colors py-1">Contact</Link>

              <div className="pt-2 flex flex-col gap-4">
                {user ? (
                  <>
                    <div className="flex items-center justify-center gap-2 px-2">
                      {user.photoURL || userProfile?.photoURL ? (
                        <img 
                          src={user.photoURL || userProfile?.photoURL} 
                          alt={user.displayName || userProfile?.name || 'User'} 
                          className="w-8 h-8 rounded-full border border-white/20 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center text-neon-cyan text-xs font-bold font-mono">
                          {(user.displayName || userProfile?.displayName || userProfile?.name || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <p className="text-xs text-gray-400 font-mono truncate">
                        Logged in as: {user.displayName || userProfile?.displayName || userProfile?.name || user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-center text-red-400 hover:text-red-300 transition-colors py-2"
                    >
                      Log out
                    </button>
                    <button
                      onClick={() => handleToolClick('/tool/email-automation')}
                      className="btn-primary w-full text-center"
                    >
                      Go to Tool
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-center text-gray-300 hover:text-neon-pink transition-colors">
                      Log in
                    </Link>
                    <Link to="/signup" className="btn-primary w-full text-center group/btn relative overflow-hidden flex items-center justify-center gap-2">
                      <span className="relative z-10 transition-transform duration-300 group-hover/btn:-translate-x-1">Start Automation</span>
                      <Zap className="w-4 h-4 relative z-10 opacity-0 -translate-x-4 transition-all duration-300 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 group-hover/btn:scale-110 group-hover/btn:text-white" />
                      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-pink opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
