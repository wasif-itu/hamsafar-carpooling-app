'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Eye, MessageCircle, X, Repeat2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useRides } from '@/lib/store';
import BottomNav from '@/components/BottomNav';
import type { Ride } from '@/lib/types';

const TABS = ['Upcoming', 'Active', 'Past', 'Recurring'] as const;
type Tab = typeof TABS[number];

const STATUS_PILL: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  upcoming:  { label: 'Upcoming',  cls: 'bg-blue-50 text-blue-600',      icon: Clock },
  active:    { label: 'Active',    cls: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  completed: { label: 'Done',      cls: 'bg-slate-100 text-slate-500',    icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-600',         icon: XCircle },
};

function RideRow({ ride }: { ride: Ride }) {
  const pill = STATUS_PILL[ride.status] ?? STATUS_PILL.upcoming;
  const PillIcon = pill.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-border p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <img src={ride.driver.avatar} alt={ride.driver.name} className="w-8 h-8 rounded-full object-cover" />
          <div>
            <p className="text-sm font-semibold text-slate-900">{ride.driver.name.split(' ')[0]} {ride.driver.name.split(' ')[1]?.[0]}.</p>
            <p className="text-xs text-slate-400">{ride.date} · {ride.time}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${pill.cls}`}>
          <PillIcon className="w-3 h-3" />
          {pill.label}
        </span>
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-px h-5 bg-slate-200" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-xs font-semibold text-slate-800 truncate">{ride.from.label}</p>
          <p className="text-xs text-slate-400 truncate">{ride.to.label}</p>
        </div>
        <p className="text-sm font-bold text-primary flex-shrink-0">₨ {ride.pricePKR}</p>
      </div>

      {ride.recurring && (
        <div className="flex items-center gap-1.5 mb-3 text-xs text-violet-600 font-medium">
          <Repeat2 className="w-3.5 h-3.5" />
          Recurring · {ride.recurring.type === 'weekdays' ? 'Mon–Fri' : ride.recurring.type}
        </div>
      )}

      {/* Actions */}
      {(ride.status === 'upcoming' || ride.status === 'active') && (
        <div className="flex gap-2 pt-3 border-t border-border">
          <Link href={`/ride/${ride.id}`} className="flex-1">
            <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors">
              <Eye className="w-3.5 h-3.5" /> View
            </button>
          </Link>
          <Link href={`/chat/ct1`} className="flex-1">
            <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors">
              <MessageCircle className="w-3.5 h-3.5" /> Chat
            </button>
          </Link>
          {ride.status === 'active' && (
            <Link href="/track" className="flex-1">
              <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold">
                Track
              </button>
            </Link>
          )}
          {ride.status === 'upcoming' && (
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors">
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
        </div>
      )}

      {ride.status === 'completed' && (
        <div className="pt-3 border-t border-border">
          <Link href={`/rate/${ride.id}`}>
            <button className="w-full py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors">
              Rate this ride ★
            </button>
          </Link>
        </div>
      )}
    </motion.div>
  );
}

export default function MyRidesPage() {
  const router = useRouter();
  const rides = useRides();
  const [activeTab, setActiveTab] = useState<Tab>('Upcoming');

  const filtered = rides.filter((r) => {
    if (activeTab === 'Upcoming')  return r.status === 'upcoming';
    if (activeTab === 'Active')    return r.status === 'active';
    if (activeTab === 'Past')      return r.status === 'completed' || r.status === 'cancelled';
    if (activeTab === 'Recurring') return !!r.recurring;
    return false;
  });

  return (
    <div className="screen bg-background flex flex-col">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-5 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <button onClick={() => router.back()} className="mb-4 text-white/70">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <h1 className="text-2xl font-extrabold text-white">My Rides</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 py-3 bg-white border-b border-border overflow-x-auto scrollbar-hide flex-shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-3">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-slate-600 font-semibold mb-1">No {activeTab.toLowerCase()} rides</p>
              <p className="text-slate-400 text-sm">
                {activeTab === 'Upcoming' ? 'Find a ride to get started' : 'Your history will appear here'}
              </p>
            </motion.div>
          ) : (
            <motion.div key="list" className="space-y-3">
              {filtered.map((ride) => <RideRow key={ride.id} ride={ride} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
}
