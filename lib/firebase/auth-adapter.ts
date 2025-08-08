// lib/firebase/auth-adapter.ts

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp as firestoreServerTimestamp
} from 'firebase/firestore';
import { db, COLLECTIONS } from './config';
import { UserRole } from '@/types';
import type { Adapter, AdapterAccount, AdapterSession, AdapterUser } from 'next-auth/adapters';

// Conversione tra formati NextAuth e nostro formato
function toAdapterUser(user: any): AdapterUser {
  return {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified?.toDate() || null,
    name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null,
    image: user.profileImage || null,
    role: UserRole.CUSTOMER,
    isVerified: false,
    isActive: false
};
}

export const FirebaseAdapter = (): Adapter => {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      const userId = doc(collection(db, COLLECTIONS.USERS)).id;
      const now = new Date();
      
      const userData = {
        id: userId,
        email: user.email!,
        role: UserRole.CUSTOMER,
        createdAt: firestoreServerTimestamp(),
        updatedAt: firestoreServerTimestamp(),
        
        // Dati personali - da completare dopo
        firstName: '',
        lastName: '',
        birthDate: null,
        birthPlace: '',
        profileImage: user.image || '',
        
        // Preferenze
        interests: [],
        musicGenres: [],
        eventTypes: [],
        defaultLocation: null,
        
        // Compliance - da completare
        privacyAcceptedAt: null,
        termsAcceptedAt: null,
        marketingConsent: false,
        
        // Stato account
        isActive: true,
        isVerified: false,
        emailVerified: user.emailVerified || null,
        lastLoginAt: firestoreServerTimestamp(),
      };
      
      await setDoc(doc(db, COLLECTIONS.USERS, userId), userData);
      
      return toAdapterUser({ ...userData, id: userId });
    },
    
    async getUser(id: string) {
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, id));
      if (!userDoc.exists()) return null;
      
      return toAdapterUser({ ...userDoc.data(), id: userDoc.id });
    },
    
    async getUserByEmail(email: string) {
      const q = query(collection(db, COLLECTIONS.USERS), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return null;
      
      const userDoc = querySnapshot.docs[0];
      return toAdapterUser({ ...userDoc.data(), id: userDoc.id });
    },
    
    async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }) {
      const accountQuery = query(
        collection(db, 'accounts'),
        where('provider', '==', provider),
        where('providerAccountId', '==', providerAccountId)
      );
      
      const accountSnapshot = await getDocs(accountQuery);
      if (accountSnapshot.empty) return null;
      
      const account = accountSnapshot.docs[0].data();
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, account.userId));
      
      if (!userDoc.exists()) return null;
      
      return toAdapterUser({ ...userDoc.data(), id: userDoc.id });
    },
    
    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      const { id, ...updates } = user;
      
      const updateData: any = {
        updatedAt: firestoreServerTimestamp(),
        lastLoginAt: firestoreServerTimestamp(),
      };
      
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.emailVerified !== undefined) updateData.emailVerified = updates.emailVerified;
      if (updates.image !== undefined) updateData.profileImage = updates.image;
      
      await updateDoc(doc(db, COLLECTIONS.USERS, id), updateData);
      
      const updatedDoc = await getDoc(doc(db, COLLECTIONS.USERS, id));
      return toAdapterUser({ ...updatedDoc.data(), id: updatedDoc.id });
    },
    
    async deleteUser(userId: string) {
      await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
    },
    
    async linkAccount(account: AdapterAccount) {
      await setDoc(doc(collection(db, 'accounts')), {
        ...account,
        createdAt: firestoreServerTimestamp(),
      });
    },
    
    async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }) {
      const q = query(
        collection(db, 'accounts'),
        where('provider', '==', provider),
        where('providerAccountId', '==', providerAccountId)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        await deleteDoc(querySnapshot.docs[0].ref);
      }
    },
    
    async createSession(session: { sessionToken: string; userId: string; expires: Date }) {
      await setDoc(doc(collection(db, 'sessions')), {
        ...session,
        createdAt: firestoreServerTimestamp(),
      });
      
      return session as AdapterSession;
    },
    
    async getSessionAndUser(sessionToken: string) {
      const q = query(collection(db, 'sessions'), where('sessionToken', '==', sessionToken));
      const sessionSnapshot = await getDocs(q);
      
      if (sessionSnapshot.empty) return null;
      
      const session = sessionSnapshot.docs[0].data() as AdapterSession;
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, session.userId));
      
      if (!userDoc.exists()) return null;
      
      return {
        session: {
          ...session,
          expires: session.expires instanceof Date ? session.expires : session.expires,
        },
        user: toAdapterUser({ ...userDoc.data(), id: userDoc.id }),
      };
    },
    
    async updateSession(session: { sessionToken: string } & Partial<AdapterSession>) {
      const q = query(collection(db, 'sessions'), where('sessionToken', '==', session.sessionToken));
      const sessionSnapshot = await getDocs(q);
      
      if (!sessionSnapshot.empty) {
        await updateDoc(sessionSnapshot.docs[0].ref, {
          ...session,
          updatedAt: firestoreServerTimestamp(),
        });
      }
      
      return session as AdapterSession;
    },
    
    async deleteSession(sessionToken: string) {
      const q = query(collection(db, 'sessions'), where('sessionToken', '==', sessionToken));
      const sessionSnapshot = await getDocs(q);
      
      if (!sessionSnapshot.empty) {
        await deleteDoc(sessionSnapshot.docs[0].ref);
      }
    },
    
    async createVerificationToken(verificationToken: { identifier: string; expires: Date; token: string }) {
      await setDoc(doc(collection(db, 'verificationTokens')), verificationToken);
      return verificationToken;
    },
    
    async useVerificationToken({ identifier, token }: { identifier: string; token: string }) {
      const q = query(
        collection(db, 'verificationTokens'),
        where('identifier', '==', identifier),
        where('token', '==', token)
      );
      
      const tokenSnapshot = await getDocs(q);
      if (tokenSnapshot.empty) return null;
      
      const verificationToken = tokenSnapshot.docs[0].data();
      await deleteDoc(tokenSnapshot.docs[0].ref);
      
      return {
        identifier: verificationToken.identifier,
        expires: verificationToken.expires.toDate(),
        token: verificationToken.token,
      };
    },
  };
};