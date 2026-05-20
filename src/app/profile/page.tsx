'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Shield, Users, Repeat2, Settings, HelpCircle,
  LogOut, ChevronRight, Star, Car,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { UserBadges } from '@/components/VerificationBadge';
import BottomNav from '@/components/BottomNav';

const MENU = [
  { href: '/profile/savings',      icon: TrendingUp, key: 'profile.savings',      desc: 'Your cost savings & CO₂ impact' },
  { href: '/profile/verification', icon: Shield,      key: 'profile.verification', desc: 'Manage your verified IDs' },
  { href: '/onboarding/trusted-contacts', icon: Users, key: 'profile.trusted',    desc: 'Emergency contacts' },
  { href: '/my-rides',             icon: Repeat2,    key: 'profile.myRides',      desc: 'History & recurring rides' },
  { href: '/profile/settings',     icon: Settings,   key: 'profile.settings',     desc: 'Preferences & privacy' },
  { href: '/profile/settings',     icon: HelpCircle, key: 'profile.help',         desc: 'FAQs and contact us' },
];

export default function ProfilePage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const t = useT();

  useEffect(() => {
    if (!user) router.replace('/');
  }, [user, router]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <div className="screen bg-background flex flex-col">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-8 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <div className="flex items-center gap-4 mb-5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-white/30 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold text-white truncate">{user.name}</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-white/80 text-sm">{user.rating}</span>
              <span className="text-white/50 text-xs">· {user.totalRides} rides</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1.5">
              <UserBadges verifications={user.verifications} />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Rides Taken',   value: user.ridesTaken },
            { label: 'Rides Offered', value: user.ridesOffered },
            { label: 'Saved (₨)',     value: `${(user.totalSavedPKR / 1000).toFixed(1)}k` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/15 rounded-2xl p-3 text-center">
              <p className="text-xl font-extrabold text-white">{value}</p>
              <p className="text-white/65 text-[10px] mt-0.5 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 space-y-3">
        {/* Bio */}
        {user.bio && (
          <div className="bg-white rounded-2xl border border-border px-4 py-3">
            <p className="text-xs text-slate-500 leading-relaxed">{user.bio}</p>
          </div>
        )}

        {/* Member since + vehicle */}
        <div className="bg-white rounded-2xl border border-border px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Member since</p>
            <p className="text-sm font-semibold text-slate-800">
              {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          {user.vehicle && (
            <div className="flex items-center gap-2 text-right">
              <div>
                <p className="text-xs text-slate-500">{user.vehicle.color} · {user.vehicle.plate}</p>
                <p className="text-sm font-semibold text-slate-800">
                  {user.vehicle.make} {user.vehicle.model}
                </p>
              </div>
              <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                <Car className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {MENU.map(({ href, icon: Icon, key, desc }, i) => {
            const label = t(key);
            return (
            <Link key={key} href={href}>
              <motion.div
                whileTap={{ backgroundColor: '#F8FAFC' }}
                className={`flex items-center gap-3 px-4 py-3.5 ${i < MENU.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
              </motion.div>
            </Link>
            );
          })}
        </div>

        {/* Logout */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-semibold text-sm"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
