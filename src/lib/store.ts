'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Ride, Notification, ChatThread, TrustedContact } from './types';
import { RIDES, NOTIFICATIONS, CHAT_THREADS } from './mockData';

// ─── Auth slice ─────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  onboardingDone: boolean;
  login: (user: User) => void;
  logout: () => void;
  setOnboardingDone: () => void;
  updateUser: (partial: Partial<User>) => void;
}

// ─── Rides slice ────────────────────────────────────────────────────────────

interface RidesState {
  rides: Ride[];
  activeRideId: string | null;
  setActiveRide: (id: string | null) => void;
}

// ─── Notifications slice ────────────────────────────────────────────────────

interface NotifState {
  notifications: Notification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;
}

// ─── Chat slice ─────────────────────────────────────────────────────────────

interface ChatState {
  threads: ChatThread[];
}

// ─── Verification & Onboarding slice ───────────────────────────────────────

interface OnboardingState {
  onboardingStep: 'phone' | 'otp' | 'profile' | 'verify-method' | 'verify-cnic' | 'verify-email' | 'verify-selfie' | 'verify-pending' | 'trusted-contacts' | 'complete';
  profileData: {
    name?: string;
    gender?: 'male' | 'female' | 'prefer-not-to-say';
    dob?: string;
    city?: 'Lahore' | 'Karachi' | 'Islamabad' | 'Rawalpindi';
  };
  verificationMethod?: 'cnic' | 'university' | 'workplace';
  verificationComplete: boolean;
  trustedContactsAdded: TrustedContact[];
  setOnboardingStep: (step: OnboardingState['onboardingStep']) => void;
  updateProfileData: (data: Partial<OnboardingState['profileData']>) => void;
  setVerificationMethod: (method: 'cnic' | 'university' | 'workplace') => void;
  markVerificationComplete: () => void;
  addTrustedContact: (contact: TrustedContact) => void;
  clearOnboardingData: () => void;
}

// ─── Combined store ─────────────────────────────────────────────────────────

type Store = AuthState & RidesState & NotifState & ChatState & OnboardingState;

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // ── Auth
      user: null,
      isAuthenticated: false,
      onboardingDone: false,

      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, onboardingDone: false }),
      setOnboardingDone: () => set({ onboardingDone: true }),
      updateUser: (partial) =>
        set((s) => ({ user: s.user ? { ...s.user, ...partial } : s.user })),

      // ── Rides
      rides: RIDES,
      activeRideId: null,
      setActiveRide: (id) => set({ activeRideId: id }),

      // ── Notifications
      notifications: NOTIFICATIONS,
      markRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,

      // ── Chat
      threads: CHAT_THREADS,

      // ── Onboarding & Verification
      onboardingStep: 'phone',
      profileData: {},
      verificationMethod: undefined,
      verificationComplete: false,
      trustedContactsAdded: [],

      setOnboardingStep: (step) => set({ onboardingStep: step }),
      updateProfileData: (data) =>
        set((s) => ({
          profileData: { ...s.profileData, ...data },
        })),
      setVerificationMethod: (method) => set({ verificationMethod: method }),
      markVerificationComplete: () => set({ verificationComplete: true }),
      addTrustedContact: (contact) =>
        set((s) => ({
          trustedContactsAdded: [...s.trustedContactsAdded, contact],
        })),
      clearOnboardingData: () =>
        set({
          onboardingStep: 'phone',
          profileData: {},
          verificationMethod: undefined,
          verificationComplete: false,
          trustedContactsAdded: [],
        }),
    }),
    {
      name: 'hamsafar-store',
      partialize: (s) => ({
        user: s.user,
        isAuthenticated: s.isAuthenticated,
        onboardingDone: s.onboardingDone,
      }),
    }
  )
);

// ─── Convenience selectors ──────────────────────────────────────────────────

export const useCurrentUser = () => useStore((s) => s.user);
export const useIsAuth = () => useStore((s) => s.isAuthenticated);
export const useRides = () => useStore((s) => s.rides);
export const useNotifs = () => useStore((s) => s.notifications);
export const useThreads = () => useStore((s) => s.threads);
