import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string, firstName: string, lastName: string, company: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user metadata record in Firestore securely with resilient local backup
  const syncUserProfile = async (firebaseUser: User, extraData?: { firstName?: string; lastName?: string; company?: string }) => {
    const email = firebaseUser.email || '';
    const name = extraData ? `${extraData.firstName} ${extraData.lastName}` : (firebaseUser.displayName || email.split('@')[0]);
    const photoURL = firebaseUser.photoURL || '';
    const nowStr = new Date().toISOString();
    
    const fallbackProfile = {
      uid: firebaseUser.uid,
      name: name,
      displayName: name,
      email: email,
      photoURL: photoURL,
      company: extraData?.company || '',
      createdAt: nowStr,
      lastLogin: nowStr
    };

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, fallbackProfile);
        setUserProfile(fallbackProfile);
        localStorage.setItem(`user_profile_${firebaseUser.uid}`, JSON.stringify(fallbackProfile));
      } else {
        const existingData = userSnap.data() || {};
        const updateData = {
          lastLogin: nowStr,
          photoURL: photoURL || existingData.photoURL || '',
          displayName: name || existingData.displayName || existingData.name || ''
        };
        await updateDoc(userRef, updateData);
        const fullProfile = {
          ...existingData,
          ...updateData
        };
        setUserProfile(fullProfile);
        localStorage.setItem(`user_profile_${firebaseUser.uid}`, JSON.stringify(fullProfile));
      }
    } catch (err) {
      console.warn('Firestore is currently unreachable or offline. Applying local profile redundancy policy:', err);
      
      // Attempt to retrieve pre-existing synchronized profile from local cache
      const stored = localStorage.getItem(`user_profile_${firebaseUser.uid}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const cachedProfile = {
            ...parsed,
            lastLogin: nowStr,
            photoURL: photoURL || parsed.photoURL || '',
            displayName: name || parsed.displayName || parsed.name || ''
          };
          setUserProfile(cachedProfile);
          localStorage.setItem(`user_profile_${firebaseUser.uid}`, JSON.stringify(cachedProfile));
        } catch (e) {
          setUserProfile(fallbackProfile);
        }
      } else {
        setUserProfile(fallbackProfile);
        localStorage.setItem(`user_profile_${firebaseUser.uid}`, JSON.stringify(fallbackProfile));
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Sync of user profile record in Firestore
        await syncUserProfile(firebaseUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await syncUserProfile(cred.user);
    }
    return cred;
  };

  const signup = async (email: string, pass: string, firstName: string, lastName: string, company: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await syncUserProfile(cred.user, { firstName, lastName, company });
    }
    return cred;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    if (cred.user) {
      await syncUserProfile(cred.user);
    }
    return cred;
  };

  const forgotPassword = async (email: string) => {
    return await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      login,
      signup,
      loginWithGoogle,
      forgotPassword,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
