'use client';
import { create } from 'zustand';

type Lang = 'en' | 'ur';

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export const useLang = create<LangState>((set) => ({
  lang: 'en',
  setLang: (lang) => set({ lang }),
}));

const DICT: Record<string, { en: string; ur: string }> = {
  // Bottom nav
  'nav.home':     { en: 'Home',    ur: 'ہوم' },
  'nav.find':     { en: 'Find',    ur: 'تلاش' },
  'nav.track':    { en: 'Track',   ur: 'ٹریک' },
  'nav.inbox':    { en: 'Inbox',   ur: 'پیغامات' },
  'nav.profile':  { en: 'Profile', ur: 'پروفائل' },

  // Home
  'home.findRide':      { en: 'Find a ride',      ur: 'سواری تلاش کریں' },
  'home.offerRide':     { en: 'Offer a ride',     ur: 'سواری پیش کریں' },
  'home.popularRoutes': { en: 'Popular routes',   ur: 'مشہور راستے' },
  'home.upcomingRide':  { en: 'Your next ride',   ur: 'آپ کی اگلی سواری' },
  'home.greeting':      { en: 'Hi',               ur: 'سلام' },

  // Settings
  'settings.title':         { en: 'Settings',          ur: 'ترتیبات' },
  'settings.subtitle':      { en: 'Preferences & privacy', ur: 'ترجیحات اور رازداری' },
  'settings.account':       { en: 'Account',           ur: 'اکاؤنٹ' },
  'settings.notifications': { en: 'Notifications',     ur: 'اطلاعات' },
  'settings.appearance':    { en: 'Appearance',        ur: 'ظاہری شکل' },
  'settings.language':      { en: 'Language',          ur: 'زبان' },
  'settings.darkMode':      { en: 'Dark Mode',         ur: 'ڈارک موڈ' },
  'settings.logout':        { en: 'Log out',           ur: 'لاگ آؤٹ' },

  // Profile
  'profile.savings':       { en: 'Savings Dashboard', ur: 'بچت ڈیش بورڈ' },
  'profile.verification':  { en: 'Verification',      ur: 'تصدیق' },
  'profile.myRides':       { en: 'My Rides',          ur: 'میری سواریاں' },
  'profile.settings':      { en: 'Settings',          ur: 'ترتیبات' },
  'profile.help':          { en: 'Help & Support',    ur: 'مدد اور سپورٹ' },
  'profile.trusted':       { en: 'Trusted Contacts',  ur: 'قابل اعتماد رابطے' },
};

export function useT() {
  const lang = useLang((s) => s.lang);
  return (key: string) => DICT[key]?.[lang] ?? key;
}
