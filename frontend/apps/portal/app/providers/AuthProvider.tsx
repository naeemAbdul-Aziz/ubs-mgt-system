'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthAPI } from '@ubs-lmis/api-client';
import { useRouter, usePathname } from 'next/navigation';

export interface UserProfile {
  personId: string;
  username: string;
  personType: string;
  permissions: string[];
  mustChangePassword?: boolean;
}

interface AuthContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await AuthAPI.me();
      setUserProfile(profile as UserProfile);
    } catch (err) {
      console.error('Failed to fetch profile', err);
      setUserProfile(null);
      // Redirect to login if not already on login page
      if (pathname !== '/login') {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch profile if we don't have one and we aren't on login
    // If the path changes, and we don't have a profile (e.g. initial load), we fetch.
    if (pathname !== '/login' && !userProfile) {
      fetchProfile();
    } else if (pathname === '/login') {
      setLoading(false);
    }
  }, [pathname]);

  const logout = async () => {
    await AuthAPI.logout();
    setUserProfile(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ userProfile, loading, refreshProfile: fetchProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
