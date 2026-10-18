// Hook for subscribing to authentication and profile state

import { useState, useEffect } from 'react';
import { authService, AuthSession } from '../services/authService';
import { UserProfile } from '../types';

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(() => authService.getCurrentSession());
  const [profile, setProfile] = useState<UserProfile | null>(() => authService.getCurrentProfile());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = authService.subscribe((newSession, newProfile) => {
      setSession(newSession);
      setProfile(newProfile);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    session,
    profile,
    loading,
    isAuthenticated: Boolean(session),
    signInWithGoogle: authService.signInWithGoogle.bind(authService),
    signInWithEmail: authService.signInWithEmail.bind(authService),
    signUpWithEmail: authService.signUpWithEmail.bind(authService),
    signOut: authService.signOut.bind(authService),
    switchPersona: authService.switchPersona.bind(authService),
    createInitialProfile: authService.createInitialProfile.bind(authService),
    updateCurrentProfile: authService.updateCurrentProfile.bind(authService)
  };
}
