import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up — creates Firebase Auth user + Firestore profile
  async function signup(email, password, companyCode, companyName) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    // Store user profile in Firestore 'users' collection
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      companyCode: companyCode || '',
      companyName: companyName || '',
      createdAt: serverTimestamp(),
      needsOnboarding: true
    });

    setUserProfile({
      email: user.email,
      companyCode,
      companyName,
      needsOnboarding: true
    });

    return credential;
  }

  // Login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout
  async function logout() {
    setUserProfile(null);
    return signOut(auth);
  }

  // Fetch user profile from Firestore
  async function fetchUserProfile(uid) {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
        return docSnap.data();
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
    return null;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    fetchUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
