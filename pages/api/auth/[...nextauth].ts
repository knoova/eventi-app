// pages/api/auth/[...nextauth].ts

import NextAuth, { DefaultSession, NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { FirebaseAdapter } from '@/lib/firebase/auth-adapter';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth as firebaseAuth, db, COLLECTIONS } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { UserRole } from '@/types';

// Estensione dei tipi NextAuth
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      role: UserRole;
      isVerified: boolean;
      isActive: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
    isActive: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
    isActive: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: FirebaseAdapter(),
  
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e password sono richiesti');
        }
        
        try {
          // Autenticazione con Firebase
          const userCredential = await signInWithEmailAndPassword(
            firebaseAuth,
            credentials.email,
            credentials.password
          );
          
          // Recupera i dati utente da Firestore
          const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid));
          
          if (!userDoc.exists()) {
            // Se non esiste in users, controlla in businesses
            const businessDoc = await getDoc(doc(db, COLLECTIONS.BUSINESSES, userCredential.user.uid));
            
            if (!businessDoc.exists()) {
              throw new Error('Utente non trovato');
            }
            
            const businessData = businessDoc.data();
            return {
              id: userCredential.user.uid,
              email: businessData.email,
              role: UserRole.BUSINESS,
              isVerified: businessData.isVerified || false,
              isActive: businessData.isActive || true,
            };
          }
          
          const userData = userDoc.data();
          return {
            id: userCredential.user.uid,
            email: userData.email,
            role: userData.role || UserRole.CUSTOMER,
            isVerified: userData.isVerified || false,
            isActive: userData.isActive || true,
          };
          
        } catch (error: any) {
          if (error.code === 'auth/user-not-found') {
            throw new Error('Email non trovata');
          }
          if (error.code === 'auth/wrong-password') {
            throw new Error('Password errata');
          }
          if (error.code === 'auth/invalid-email') {
            throw new Error('Email non valida');
          }
          throw new Error('Errore durante il login');
        }
      }
    }),
    
    // Google Provider (da configurare in seguito)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 giorni
  },
  
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    newUser: '/auth/complete-profile',
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.isActive = user.isActive;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email!;
        session.user.role = token.role;
        session.user.isVerified = token.isVerified;
        session.user.isActive = token.isActive;
      }
      
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      // Redirect basato sul ruolo dopo il login
      if (url === '/auth/complete-profile') {
        return url;
      }
      
      // Se l'URL è relativo, usa quello
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Se l'URL è dello stesso dominio
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      
      // Default redirect
      return baseUrl;
    },
  },
  
  events: {
    async signIn({ user, isNewUser }) {
      // Aggiorna lastLoginAt quando l'utente fa login
      if (!isNewUser && user?.id) {
        const { updateDoc, doc, serverTimestamp } = await import('firebase/firestore');
        
        // Prova prima nella collezione users
        try {
          await updateDoc(doc(db, COLLECTIONS.USERS, user.id), {
            lastLoginAt: serverTimestamp(),
          });
        } catch {
          // Se fallisce, prova nella collezione businesses
          try {
            await updateDoc(doc(db, COLLECTIONS.BUSINESSES, user.id), {
              lastLoginAt: serverTimestamp(),
            });
          } catch (error) {
            console.error('Errore aggiornamento lastLoginAt:', error);
          }
        }
      }
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);