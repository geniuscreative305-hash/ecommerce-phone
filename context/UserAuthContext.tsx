'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export type AuthTriggerReason = 'cart' | 'checkout' | 'general';

interface UserAuthContextType {
  user: any | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authReason: AuthTriggerReason;
  openAuthModal: (reason?: AuthTriggerReason, onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  signOut: () => Promise<void>;
  pendingSuccessCallback: (() => void) | null;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authReason, setAuthReason] = useState<AuthTriggerReason>('general');
  const [pendingSuccessCallback, setPendingSuccessCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // 1. Check active user session
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user && pendingSuccessCallback) {
        pendingSuccessCallback();
        setPendingSuccessCallback(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pendingSuccessCallback]);

  const openAuthModal = (reason: AuthTriggerReason = 'general', onSuccess?: () => void) => {
    setAuthReason(reason);
    if (onSuccess) {
      setPendingSuccessCallback(() => onSuccess);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingSuccessCallback(null);
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
    } catch {}
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        authReason,
        openAuthModal,
        closeAuthModal,
        signOut,
        pendingSuccessCallback,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
}

