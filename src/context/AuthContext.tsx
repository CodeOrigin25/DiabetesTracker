import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, app } from '../firebase';
import {
  getFirestore,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
  getDoc, // ✅ ADDED for fetching Firestore user data
} from 'firebase/firestore';

// ✅ ADD THIS INTERFACE
interface ExtendedUser extends FirebaseUser {
  name?: string;
  avatar?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: ExtendedUser | null; // ✅ CHANGED from FirebaseUser to ExtendedUser
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null); // ✅ CHANGED type here too
  const [isLoading, setIsLoading] = useState(true);

  // ✅ UPDATED useEffect to merge Firestore user data with Firebase auth user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const db = getFirestore(app);
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          const profileData = snapshot.data();
          setUser({ ...firebaseUser, ...profileData });
        } else {
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getReadableIST = () => {
    const date = new Date();
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) + ' IST';
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const db = getFirestore(app);
      const uid = userCredential.user.uid;

      await updateDoc(doc(db, 'users', uid), {
        Status: 'online',
      });

      await setDoc(doc(db, 'onlineUsers', uid), {
        email: userCredential.user.email,
        loggedInAt: getReadableIST(),
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const db = getFirestore(app);
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const onlineRef = doc(db, 'onlineUsers', currentUser.uid);

        await updateDoc(userRef, { onlineStatus: 'offline' });
        await deleteDoc(onlineRef);
      }

      await signOut(auth);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
