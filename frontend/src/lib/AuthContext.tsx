"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import LoginModal from "@/components/auth/LoginModal";
import { useDemo } from "@/lib/DemoContext";

import { User, clearAuthToken } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  showAuthModal: () => void;
  hideAuthModal: () => void;
  requireAuth: (callback: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const { isDemo, demoUser } = useDemo();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("mujmart_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
  }, []);

  // Execute pending action when user becomes authenticated
  useEffect(() => {
    if ((user || (isDemo && demoUser)) && pendingActionRef.current) {
      pendingActionRef.current();
      pendingActionRef.current = null;
    }
  }, [user, isDemo, demoUser]);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    clearAuthToken();
    window.location.reload();
  };

  const showAuthModal = () => setIsAuthModalOpen(true);
  const hideAuthModal = () => {
    setIsAuthModalOpen(false);
    pendingActionRef.current = null;
  };

  // Helper that checks if user is logged in before executing an action
  const requireAuth = (callback: () => void) => {
    if (user || (isDemo && demoUser)) {
      callback(); // User is logged in, proceed
    } else {
      pendingActionRef.current = callback;
      showAuthModal(); // User is not logged in, show modal
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isAuthModalOpen, showAuthModal, hideAuthModal, requireAuth }}>
      {children}
      {isAuthModalOpen && <LoginModal onClose={hideAuthModal} />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
