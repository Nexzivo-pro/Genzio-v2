import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook, Info } from 'lucide-react';
import { GenzioLogo } from './GenzioLogo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-24 pb-8 mt-auto overflow-hidden bg-black border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-gradient-to-b from-neon-pink/5 via-neon-cyan/5 to-transparent pointer-events-none blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-4 space-y-8 pr-4">
            <Link to="/" className="flex items-center gap-2 group inline-flex hover-float">
               <GenzioLogo className="w-8 h-8" />
              <span className="font-display font-medium text-2xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-cyan group-hover:to-neon-pink transition-all duration-300 ml-1">
                Genzio
              </span>
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              AI-powered email automation platform for modern outreach, campaign management and intelligent workflow automation.
              <br /><br />
              <span className="text-gray-500 font-medium">A Product By NEXZIVO</span>
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4 pt-2">
              <a href="https://twitter.com/nexzivo" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:-translate-y-1 transition-all duration-300 border border-white/5 hover:border-neon-cyan/40">
                <Twitter className="w-4 h-4" />
                <span className="sr-only">X (Twitter)</span>
              </a>
              <a href="https://instagram.com/nexzivo" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-neon-pink hover:bg-neon-pink/10 hover:shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:-translate-y-1 transition-all duration-300 border border-white/5 hover:border-neon-pink/40">
                <Instagram className="w-4 h-4" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://facebook.com/nexzivo.co" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-[#1877F2] hover:bg-[#1877F2]/10 hover:shadow-[0_0_15px_rgba(24,119,242,0.4)] hover:-translate-y-1 transition-all duration-300 border border-white/5 hover:border-[#1877F2]/40">
                <Facebook className="w-4 h-4" />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-white mb-6 tracking-wide text-sm uppercase">Tools</h4>
            <ul className="space-y-4">
              {[
                { name: 'Email Automation', path: '/tool/email-automation' },
                { name: 'Campaigns', path: '/tool/campaigns' },
                { name: 'Analytics', path: '/tool/analytics' },
                { name: 'Genzio AI', path: '/tool/ai-chat' }
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-neon-cyan hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] transition-all flex items-center gap-2 group">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-white mb-6 tracking-wide text-sm uppercase">Resources</h4>
            <ul className="space-y-4">
              {[
                { name: 'Features', path: '/features' },
                { name: 'Pricing', path: '/pricing' },
                { name: 'Blog', path: '/blog' },
                { name: 'Changelog', path: '/changelog' },
                { name: 'FAQ', path: '/faq' }
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-neon-pink hover:drop-shadow-[0_0_8px_rgba(255,0,255,0.8)] transition-all flex items-center gap-2 group">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-white mb-6 tracking-wide text-sm uppercase">Company</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'NEXZIVO', path: '/nexzivo' }
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-white transition-all flex items-center gap-2 group">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-white mb-6 tracking-wide text-sm uppercase">Legal</h4>
            <ul className="space-y-4">
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms & Conditions', path: '/terms' },
                { name: 'Security', path: '/security' },
                { name: 'Acceptable Use Policy', path: '/acceptable-use' },
                { name: 'Disclaimer', path: '/disclaimer' }
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-white transition-all flex items-center gap-2 group">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
        </div>

        {/* Disclaimer Area */}
        <div className="mb-10 bg-[#0a0a0a] border border-white/10 rounded-xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden group hover:border-white/20 transition-colors mx-auto max-w-6xl">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-cyan to-neon-pink opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
             <Info className="w-5 h-5 text-gray-400 group-hover:text-neon-cyan transition-colors" />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed flex-1">
            <strong className="text-white font-medium">Legal Disclaimer:</strong> Users are entirely responsible for their own campaigns, outreach practices, and compliance with all applicable laws and email provider policies. Genzio provides software tools only.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              Built By <Link to="/nexzivo" className="text-white font-medium hover:text-neon-cyan transition-colors tracking-wide">NEXZIVO</Link>
            </span>
            <span className="hidden sm:block text-white/20">•</span>
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Genzio. All Rights Reserved.
            </p>
          </div>
          <div>
            <a href="mailto:nexzivo@gmail.com" className="text-sm text-gray-500 hover:text-white transition-colors">
              nexzivo@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
