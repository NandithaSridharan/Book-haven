"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User } from '@/lib/types';
import { users } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user in localStorage
    try {
      const storedUserEmail = localStorage.getItem('bookHavenUser');
      if (storedUserEmail) {
        const foundUser = users.find(u => u.email === storedUserEmail);
        setUser(foundUser || null);
      }
    } catch (error) {
      // localStorage is not available
    }
    setLoading(false);
  }, []);

  const login = (email: string): boolean => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      try {
        localStorage.setItem('bookHavenUser', foundUser.email);
      } catch (error) {
        // localStorage not available
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
     try {
        localStorage.removeItem('bookHavenUser');
      } catch (error) {
        // localStorage not available
      }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
