import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { ShieldAlert } from 'lucide-react';

import { GenzioLogo } from './GenzioLogo';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    let timeout: any;
    if (!loading && !user) {
      // Small pause to allow visual feedback to render completely
      timeout = setTimeout(() => {
        setShouldRedirect(true);
      }, 1500);
    }
    return () => clearTimeout(timeout);
  }, [loading, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <GenzioLogo className="w-16 h-16 mb-6" />
        <p className="text-gray-400 font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Platform...</p>
      </div>
    );
  }

  if (!user) {
    if (shouldRedirect) {
      return <Navigate to="/login" state={{ from: location, message: "Please login to continue." }} replace />;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center mb-6 text-neon-pink animate-bounce">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-display font-black text-white mb-2">Restricted Infrastructure</h2>
        <p className="text-lg font-medium text-neon-pink mb-4">Please login to continue.</p>
        <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Redirecting to login portal...</p>
      </div>
    );
  }

  return <>{children}</>;
}
