"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AuthModal } from "./auth-modal";

type AuthView = "login" | "register";

interface AuthContextType {
  openAuth: (view?: AuthView) => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultView, setDefaultView] = useState<AuthView>("login");

  const openAuth = useCallback((view: AuthView = "login") => {
    setDefaultView(view);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AuthContext.Provider value={{ openAuth, closeAuth }}>
      {children}
      <AuthModal isOpen={isOpen} onClose={closeAuth} defaultView={defaultView} />
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