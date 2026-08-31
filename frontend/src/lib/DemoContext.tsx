"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface DemoUser {
  name: string;
  email: string;
  role: "customer" | "admin";
}

interface DemoContextType {
  isDemo: boolean;
  demoUser: DemoUser | null;
  enterDemoMode: (role: "customer" | "admin") => void;
  exitDemoMode: () => void;
}

const DemoContext = createContext<DemoContextType>({
  isDemo: false,
  demoUser: null,
  enterDemoMode: () => {},
  exitDemoMode: () => {},
});

export function useDemo() {
  return useContext(DemoContext);
}

const demoUsers: Record<"customer" | "admin", DemoUser> = {
  customer: {
    name: "Demo Student",
    email: "demo@example.com",
    role: "customer",
  },
  admin: {
    name: "Demo Admin",
    email: "admin@example.com",
    role: "admin",
  },
};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemo, setIsDemo] = useState(false);
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);

  const enterDemoMode = useCallback((role: "customer" | "admin") => {
    setIsDemo(true);
    setDemoUser(demoUsers[role]);
  }, []);

  const exitDemoMode = useCallback(() => {
    setIsDemo(false);
    setDemoUser(null);
  }, []);

  return (
    <DemoContext.Provider value={{ isDemo, demoUser, enterDemoMode, exitDemoMode }}>
      {children}
    </DemoContext.Provider>
  );
}
