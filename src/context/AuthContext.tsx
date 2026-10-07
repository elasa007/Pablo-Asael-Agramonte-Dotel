import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logoutUser, handleFirestoreError, OperationType } from '../firebase';

const ADMIN_EMAILS = [
  'elasa007@gmail.com',
  'asael.agramonte@gmail.com'
];

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  adminError: string | null;
  clearAdminError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  isLoading: true,
  loginWithGoogle: async () => { throw new Error('Not initialized'); },
  logout: async () => {},
  adminError: null,
  clearAdminError: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminError, setAdminError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const email = user.email?.toLowerCase();
        let authorized = false;

        if (email && ADMIN_EMAILS.includes(email)) {
          authorized = true;
        } else {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            if (adminDoc.exists()) {
              authorized = true;
            }
          } catch (e) {
            console.warn('Could not verify admin doc', e);
          }
        }

        setIsAdmin(authorized);
        if (!authorized) {
          setAdminError(`La cuenta ${user.email} ha iniciado sesión, pero no posee permisos de edición para este portafolio.`);
        } else {
          setAdminError(null);
        }
      } else {
        setIsAdmin(false);
        setAdminError(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<User> => {
    setAdminError(null);
    try {
      const user = await signInWithGoogle();
      return user;
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        setAdminError(error?.message || 'Error al iniciar sesión con Google');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setIsAdmin(false);
      setAdminError(null);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAdmin,
      isLoading,
      loginWithGoogle,
      logout,
      adminError,
      clearAdminError: () => setAdminError(null)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
