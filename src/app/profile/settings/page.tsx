'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, User, Bell, Globe, Lock, Trash2,
  ChevronRight, RotateCcw, Moon, LogOut,
} from 'lucide-react';
import { useStore } from '@/lib/store';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-slate-200'} flex items-center px-0.5`}
    >
      <motion.div
        animate={{ x: value ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-5 h-5 bg-white rounded-full shadow"
      />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useStore();
  const [notifRide, setNotifRide] = useState(true);
  const [notifChat, setNotifChat] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="screen bg-background flex flex-col relative">
      <div
        className="px-5 pt-14 pb-6 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <button onClick={() => router.back()} className="mb-4 text-white/70">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <h1 className="text-2xl font-extrabold text-white">Settings</h1>
        <p className="text-white/65 text-sm mt-1">Preferences & privacy</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 px-4 pt-4 space-y-4">
        {/* Account */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">Account</p>
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            {[
              { icon: User, label: 'Edit Profile', desc: user?.name ?? '' },
              { icon: Lock, label: 'Privacy', desc: 'Control what others see' },
            ].map(({ icon: Icon, label, desc }, i) => (
              <button key={label} className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 ${i === 0 ? 'border-b border-border' : ''}`}>
                <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-400 truncate">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">Notifications</p>
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            {[
              { label: 'Ride updates', desc: 'Request accepted, driver en route', value: notifRide, onChange: setNotifRide },
              { label: 'Messages', desc: 'New chat messages', value: notifChat, onChange: setNotifChat },
              { label: 'Promotions', desc: 'Offers and announcements', value: notifPromo, onChange: setNotifPromo },
            ].map(({ label, desc, value, onChange }, i, arr) => (
              <div key={label} className={`flex items-center gap-3 px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <Toggle value={value} onChange={onChange} />
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">Appearance</p>
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
              <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Moon className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">Dark Mode</p>
                <p className="text-xs text-slate-400">Coming soon</p>
              </div>
              <Toggle value={darkMode} onChange={setDarkMode} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">Language</p>
                <p className="text-xs text-slate-400">App display language</p>
              </div>
              <div className="flex bg-slate-100 rounded-lg p-0.5">
                {(['en', 'ur'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${language === lang ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  >
                    {lang === 'en' ? 'EN' : 'اردو'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">Account Actions</p>
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border hover:bg-slate-50"
            >
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <LogOut className="w-4 h-4 text-red-500" />
              </div>
              <p className="flex-1 text-left text-sm font-semibold text-red-600">Log out</p>
            </button>
            <button
              onClick={handleReset}
              className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border hover:bg-slate-50"
            >
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-amber-700">Reset Demo</p>
                <p className="text-xs text-slate-400">Clears all local data</p>
              </div>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50"
            >
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4 text-red-500" />
              </div>
              <p className="flex-1 text-left text-sm font-semibold text-red-600">Delete account</p>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-300 pb-2">HamSafar v1.0 · Made in Pakistan</p>
      </div>

      {/* Delete confirm sheet */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black z-40"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 px-5 pb-8"
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-6" />
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 text-center mb-2">Delete account?</h3>
              <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
                This will permanently delete your account and all ride history. This cannot be undone.
              </p>
              <button
                onClick={() => { setShowDeleteConfirm(false); handleLogout(); }}
                className="w-full py-3.5 rounded-2xl bg-red-500 text-white font-bold text-sm mb-3"
              >
                Delete my account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-semibold text-sm"
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
