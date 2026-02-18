// contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { UserProfile, BusinessProfile, UserRole } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/lib/firebase/config';

interface AuthContextType {
  user: UserProfile | BusinessProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isCustomer: boolean;
  isBusiness: boolean;
  isAdmin: boolean;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isCustomer: false,
  isBusiness: false,
  isAdmin: false,
  refetchUser: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato dentro AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = async () => {
    if (!session?.user?.id) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      let userData = null;
      
      // Controlla prima nella collezione users
      if (session.user.role === UserRole.CUSTOMER || session.user.role === UserRole.ADMIN) {
        const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, session.user.id));
        if (userDoc.exists()) {
          userData = { ...userDoc.data(), id: userDoc.id } as UserProfile;
        }
      }
      
      // Se è un business, controlla nella collezione businesses
      if (session.user.role === UserRole.BUSINESS) {
        const businessDoc = await getDoc(doc(db, COLLECTIONS.BUSINESSES, session.user.id));
        if (businessDoc.exists()) {
          userData = { ...businessDoc.data(), id: businessDoc.id } as BusinessProfile;
        }
      }

      setUser(userData);
      
      // Se l'utente non ha completato il profilo, redirect
      if (
        userData &&
        (
          (
            userData.role === UserRole.CUSTOMER || userData.role === UserRole.ADMIN
          )
            ? (!('firstName' in userData) || !userData.firstName || !userData.privacyAcceptedAt)
            : (!userData.privacyAcceptedAt)
        )
      ) {
        if (router.pathname !== '/auth/complete-profile') {
          router.push('/auth/complete-profile');
        }
      }
      
    } catch (error) {
      console.error('Errore nel recupero dati utente:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    
    fetchUserData();
  }, [session, status]);

  const refetchUser = async () => {
    setIsLoading(true);
    await fetchUserData();
  };

  const value: AuthContextType = {
    user,
    isLoading: status === 'loading' || isLoading,
    isAuthenticated: !!user,
    isCustomer: user?.role === UserRole.CUSTOMER,
    isBusiness: user?.role === UserRole.BUSINESS,
    isAdmin: user?.role === UserRole.ADMIN,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook per proteggere le route
export const useRequireAuth = (allowedRoles?: UserRole[]) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

  return { user, isLoading };
};

// Hook per redirect se autenticato
export const useRedirectIfAuthenticated = (redirectTo: string = '/dashboard') => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isLoading };
};