"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import LoginModal from "@/components/auth/LoginModal";
import { useDemo } from "@/lib/DemoContext";
import { User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
  isAuthModalOpen: boolean;
  showAuthModal: () => void;
  hideAuthModal: () => void;
  requireAuth: (callback: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const { isDemo, demoUser } = useDemo();

  const user = (session?.user as User) || null;
  const isAuthenticated = !!user;

  // Execute pending action when user becomes authenticated
  useEffect(() => {
    if ((user || (isDemo && demoUser)) && pendingActionRef.current) {
      pendingActionRef.current();
      pendingActionRef.current = null;
    }
  }, [user, isDemo, demoUser]);

  const logout = () => {
    signOut({ redirect: true, callbackUrl: "/" });
  };

  const showAuthModal = () => setIsAuthModalOpen(true);
  const hideAuthModal = () => {
    setIsAuthModalOpen(false);
    pendingActionRef.current = null;
  };

  const requireAuth = (callback: () => void) => {
    if (user || (isDemo && demoUser)) {
      callback();
    } else {
      pendingActionRef.current = callback;
      showAuthModal();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout, isAuthModalOpen, showAuthModal, hideAuthModal, requireAuth }}>
      {children}
      {isAuthModalOpen && <LoginModal onClose={hideAuthModal} />}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
