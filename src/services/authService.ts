// Authentication Service for FORGE
// Manages real Firebase Auth state & sessions with local persistence fallback.
// Strict separation between Auth User (credentials) and Profile (identity).

import {
  auth,
  googleProvider,
  isFirebaseConfigured
} from '../config/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { UserProfile } from '../types';
import { dataService } from './dataService';

export interface AuthSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

type AuthListener = (session: AuthSession | null, profile: UserProfile | null) => void;

const LOCAL_SESSION_KEY = 'forge_auth_session_v1';

class AuthService {
  private currentSession: AuthSession | null = null;
  private currentProfile: UserProfile | null = null;
  private listeners: Set<AuthListener> = new Set();
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (this.initialized) return;

    if (isFirebaseConfigured && auth) {
      onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          this.currentSession = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL
          };
          this.currentProfile = await dataService.getProfile(fbUser.uid);
        } else {
          this.currentSession = null;
          this.currentProfile = null;
        }
        this.notifyListeners();
      });
    } else {
      // Local persistent session restore
      const saved = localStorage.getItem(LOCAL_SESSION_KEY);
      if (saved) {
        try {
          const session: AuthSession = JSON.parse(saved);
          this.currentSession = session;
          this.currentProfile = await dataService.getProfile(session.uid);
        } catch {
          // Fallback if session corrupted
        }
      }
      this.notifyListeners();
    }

    this.initialized = true;
  }

  // Subscribe to auth state updates
  subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    if (this.initialized) {
      listener(this.currentSession, this.currentProfile);
    }
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener(this.currentSession, this.currentProfile);
    }
  }

  getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  getCurrentProfile(): UserProfile | null {
    return this.currentProfile;
  }

  // Google Sign-In
  async signInWithGoogle(): Promise<{ session: AuthSession; isNewUser: boolean }> {
    if (isFirebaseConfigured && auth && googleProvider) {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const session: AuthSession = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };

      const existingProfile = await dataService.getProfile(user.uid);
      this.currentSession = session;
      this.currentProfile = existingProfile;
      this.notifyListeners();

      return { session, isNewUser: !existingProfile };
    }

    // Fallback: demo google login with simulated secure token
    const demoUid = `google_${Date.now()}`;
    const session: AuthSession = {
      uid: demoUid,
      email: 'builder@example.com',
      displayName: 'New Builder',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };

    this.setLocalSession(session);
    return { session, isNewUser: true };
  }

  // Email/Password Sign Up
  async signUpWithEmail(email: string, pass: string, displayName: string): Promise<AuthSession> {
    if (isFirebaseConfigured && auth) {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const user = result.user;
      const session: AuthSession = {
        uid: user.uid,
        email: user.email,
        displayName,
        photoURL: null
      };
      this.currentSession = session;
      this.notifyListeners();
      return session;
    }

    // Local authentication signup
    const uid = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const session: AuthSession = {
      uid,
      email,
      displayName,
      photoURL: `https://api.dicebear.com/7.x/identicon/svg?seed=${displayName}`
    };

    this.setLocalSession(session);
    return session;
  }

  // Email/Password Sign In
  async signInWithEmail(email: string, pass: string): Promise<AuthSession> {
    if (isFirebaseConfigured && auth) {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const user = result.user;
      const session: AuthSession = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
      this.currentSession = session;
      this.currentProfile = await dataService.getProfile(user.uid);
      this.notifyListeners();
      return session;
    }

    // In local persistent mode, let user log in or switch to any seed profile
    const targetProfile = (await dataService.getProfileByUsername(email.split('@')[0])) ||
      (await dataService.getProfile('usr_rajiv'));

    const uid = targetProfile ? targetProfile.id : `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const session: AuthSession = {
      uid,
      email,
      displayName: targetProfile ? targetProfile.displayName : email.split('@')[0],
      photoURL: targetProfile ? targetProfile.avatar : null
    };

    this.setLocalSession(session);
    this.currentProfile = targetProfile;
    this.notifyListeners();
    return session;
  }

  // Quick switch for development / testing personas
  async switchPersona(profileId: string): Promise<UserProfile> {
    const profile = await dataService.getProfile(profileId);
    if (!profile) throw new Error('Profile not found');

    const session: AuthSession = {
      uid: profile.id,
      email: `${profile.username}@forge.dev`,
      displayName: profile.displayName,
      photoURL: profile.avatar
    };

    this.setLocalSession(session);
    this.currentProfile = profile;
    this.notifyListeners();
    return profile;
  }

  // Create initial profile for newly signed-in user
  async createInitialProfile(data: {
    username: string;
    displayName: string;
    headline: string;
    avatar?: string;
    bio?: string;
    currentlyBuilding?: string[];
    currentlyLearning?: string[];
    currentlyExploring?: string[];
    interests?: string[];
  }): Promise<UserProfile> {
    if (!this.currentSession) throw new Error('No active authentication session');

    const isAvailable = await dataService.isUsernameAvailable(data.username, this.currentSession.uid);
    if (!isAvailable) {
      throw new Error(`Username @${data.username} is already taken. Please choose another.`);
    }

    const now = new Date().toISOString();
    const newProfile: UserProfile = {
      id: this.currentSession.uid,
      username: data.username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      displayName: data.displayName.trim(),
      headline: data.headline.trim(),
      avatar: data.avatar || this.currentSession.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${data.username}`,
      bio: data.bio?.trim() || '',
      currentlyBuilding: data.currentlyBuilding || [],
      currentlyLearning: data.currentlyLearning || [],
      currentlyExploring: data.currentlyExploring || [],
      openToCollaboration: true,
      interests: data.interests || ['TypeScript', 'Open Source'],
      buildsCount: 0,
      followersCount: 0,
      followingCount: 0,
      appreciationsReceived: 0,
      createdAt: now,
      updatedAt: now
    };

    const saved = await dataService.saveProfile(newProfile);
    this.currentProfile = saved;
    this.notifyListeners();
    return saved;
  }

  async updateCurrentProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!this.currentProfile) throw new Error('No active profile');

    if (updates.username && updates.username !== this.currentProfile.username) {
      const isAvailable = await dataService.isUsernameAvailable(updates.username, this.currentProfile.id);
      if (!isAvailable) throw new Error(`Username @${updates.username} is taken.`);
    }

    const updated = await dataService.saveProfile({
      ...this.currentProfile,
      ...updates
    });

    this.currentProfile = updated;
    this.notifyListeners();
    return updated;
  }

  async signOut(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    }
    this.currentSession = null;
    this.currentProfile = null;
    localStorage.removeItem(LOCAL_SESSION_KEY);
    this.notifyListeners();
  }

  private setLocalSession(session: AuthSession) {
    this.currentSession = session;
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
  }
}

export const authService = new AuthService();
