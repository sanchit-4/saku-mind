import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  function signup(email, password) {
    if (auth.app.options.apiKey === "AIzaSyDummyKeyForTestingOnly") {
      const mockUser = { email, uid: "mock-user-id-" + Date.now(), isMock: true };
      localStorage.setItem("mockUser", JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      return Promise.resolve(mockUser);
    }
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Login function
  function login(email, password) {
    if (auth.app.options.apiKey === "AIzaSyDummyKeyForTestingOnly") {
      const mockUser = { email, uid: "mock-user-id-123", isMock: true };
      localStorage.setItem("mockUser", JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      return Promise.resolve(mockUser);
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout function
  function logout() {
    localStorage.removeItem("mockUser");
    setCurrentUser(null);
    if (auth.app.options.apiKey === "AIzaSyDummyKeyForTestingOnly") {
      return Promise.resolve();
    }
    return signOut(auth);
  }

  useEffect(() => {
    if (auth.app.options.apiKey === "AIzaSyDummyKeyForTestingOnly") {
      const savedUser = localStorage.getItem("mockUser");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
