'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Bell, Search, ChevronRight, Car, Navigation,
  TrendingUp, MapPin, Zap, GraduationCap, Clock, Users,
} from 'lucide-react';
import { useStore, useCurrentUser, useRides } from '@/lib/store';
import { POPULAR_ROUTES } from '@/lib/mockData';
import RideCard from '@/components/RideCard';
import BottomNav from '@/components/BottomNav';

type Context = 'all' | 'campus' | 'city' | 'intercity';

const TABS: { id: Context; label: string; icon: React.ElementType }[] = [
  { id: 'all',       label: 'All',       icon: Navigation },
  { id: 'campus',    label: 'Campus',    icon: GraduationCap },
  { id: 'city',      label: 'City',      icon: MapPin },
  { id: 'intercity', label: 'Intercity', icon: Car },
];

const CONTEXT_TILES = [
  {
    id: 'campus',
    label: 'Campus',
    desc: 'Student rides to universities',
    icon: GraduationCap,
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    border: 'border-blue-100',
  },
  {
    id: 'city',
    label: 'City',
    desc: 'Daily commutes within the city',
    icon: MapPin,
    bg: 'bg-teal-50',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    border: 'border-teal-100',
  },
  {
    id: 'intercity',
    label: 'Intercity',
    desc: 'Long-distance travel',
    icon: Car,
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    border: 'border-amber-100',
  },
] as const;

export default function HomePage() {
  const router = useRouter();
  const user = useCurrentUser();
  const rides = useRides();
  const unread = useStore((s) => s.notifications.filter((n) => !n.read).length);
  const [activeCtx, setActiveCtx] = useState<Context>('all');

  useEffect(() => {
    if (!user) router.replace('/');
  }, [user, router]);

  if (!user) return null;

  const firstName = user.name.split(' ')[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Assalam o Alaikum' :
    hour < 17 ? 'Good afternoon' : 'Good evening';

  const upcoming = rides.filter((r) => r.status === 'upcoming');
  const nextRide = upcoming[0];
  const filtered = activeCtx === 'all' ? upcoming : upcoming.filter((r) => r.context === activeCtx);

  return (
    <div className="screen" style={{ paddingBottom: 80 }}>
      {/* ── Header ── */}
      <div
        className="px-5 pt-14 pb-6 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 60%, #14B8A6 100%)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-white/70 text-[13px]">{greeting},</p>
            <h1 className="text-xl font-extrabold text-white mt-0.5">{firstName} 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/notifications">
              <div className="relative w-9 h-9 bg-white/15 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
                {unread > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-amber-400 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </div>
            </Link>
            <Link href="/profile">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full border-2 border-white/30 object-cover"
              />
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <Link href="/find">
          <div className="bg-white rounded-2xl px-4 h-12 flex items-center gap-3 shadow-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 text-sm flex-1">Where are you going?</span>
            <div className="bg-primary rounded-xl px-3 py-1.5">
              <span className="text-white text-xs font-semibold">Search</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="px-5 mt-4 flex flex-col gap-4">
        {/* ── Hero card — Next Ride ── */}
        {nextRide ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link href={`/ride/${nextRide.id}`}>
              <div className="rounded-2xl p-4 border border-teal-100 bg-gradient-to-r from-teal-50 to-emerald-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <p className="text-xs font-semibold text-teal-700">Upcoming ride</p>
                  </div>
                  <span className="text-[11px] text-slate-500 bg-white/70 px-2 py-0.5 rounded-full border border-teal-100">
                    {nextRide.date} · {nextRide.time}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <img
                    src={nextRide.driver.avatar}
                    alt={nextRide.driver.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900">
                      {nextRide.from.label.split(',')[0]} → {nextRide.to.label.split(',')[0]}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      with {nextRide.driver.name.split(' ')[0]} · ₨ {nextRide.pricePKR}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-teal-100 rounded-xl px-2 py-1">
                    <Users className="w-3 h-3 text-slate-500" />
                    <span className="text-[11px] text-slate-600">{nextRide.seatsLeft} left</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <div className="rounded-2xl p-4 border border-dashed border-border bg-slate-50 text-center">
            <p className="text-sm font-semibold text-slate-700 mb-1">No upcoming rides</p>
            <p className="text-xs text-slate-400 mb-3">Find a ride or offer one to get started</p>
            <Link href="/find">
              <span className="text-xs font-semibold text-primary">Browse rides →</span>
            </Link>
          </div>
        )}

        {/* ── Quick actions ── */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/find">
            <div className="card-interactive flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Find a Ride</p>
                <p className="text-xs text-slate-400">{upcoming.length} available</p>
              </div>
            </div>
          </Link>
          <Link href="/offer">
            <div className="card-interactive flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Car className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Offer a Ride</p>
                <p className="text-xs text-slate-400">Earn while commuting</p>
              </div>
            </div>
          </Link>
        </div>

        {/* ── Context tiles ── */}
        <div>
          <h2 className="font-bold text-slate-900 text-[15px] mb-3">Browse by category</h2>
          <div className="grid grid-cols-3 gap-2">
            {CONTEXT_TILES.map(({ id, label, desc, icon: Icon, bg, iconBg, iconColor, border }) => (
              <Link key={id} href={`/find?context=${id}`}>
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className={`p-3 rounded-2xl border ${bg} ${border} flex flex-col gap-2`}
                >
                  <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                  <p className="font-semibold text-slate-900 text-xs leading-tight">{label}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Savings banner ── */}
        <Link href="/profile/savings">
          <div
            className="rounded-2xl p-4 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #134E4A 0%, #0F766E 55%, #14B8A6 100%)' }}
          >
            <div>
              <p className="text-white/70 text-xs font-medium">Total savings</p>
              <p className="text-white text-2xl font-extrabold mt-0.5">
                ₨ {user.totalSavedPKR.toLocaleString()}
              </p>
              <p className="text-white/55 text-xs mt-1">
                {user.totalRides} rides · {user.ridesOffered} offered
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <ChevronRight className="w-4 h-4 text-white/50" />
            </div>
          </div>
        </Link>

        {/* ── Context filter tabs ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-900 text-[15px]">Available Rides</h2>
            <Link href="/find" className="text-xs text-primary font-semibold">See all</Link>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveCtx(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-200 flex-shrink-0 ${
                  activeCtx === id
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-slate-500 border-border'
                }`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Ride list ── */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-400 text-sm">No rides in this category</p>
            </div>
          ) : (
            filtered.slice(0, 4).map((ride, i) => (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <RideCard ride={ride} />
              </motion.div>
            ))
          )}
        </div>

        {/* ── Popular routes ── */}
        <div className="pb-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-900 text-[15px]">Popular Routes</h2>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex flex-col gap-2">
            {POPULAR_ROUTES.slice(0, 4).map((r, i) => (
              <div key={i} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-border">
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-800 truncate">{r.from}</span>
                  <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                  <span className="text-sm text-slate-500 truncate">{r.to}</span>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-xs font-bold text-primary">₨ {r.avgPKR}</p>
                  <p className="text-[10px] text-slate-400">{r.rides} rides</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
