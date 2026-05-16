'use client';
import Link from 'next/link';
import { Star, Clock, Users, ArrowRight, Repeat2 } from 'lucide-react';
import type { Ride } from '@/lib/types';
import { UserBadges } from './VerificationBadge';

const CTX: Record<string, { label: string; bg: string; text: string }> = {
  campus:    { label: 'Campus',    bg: 'bg-blue-50',   text: 'text-blue-700'   },
  city:      { label: 'City',      bg: 'bg-teal-50',   text: 'text-teal-700'   },
  intercity: { label: 'Intercity', bg: 'bg-amber-50',  text: 'text-amber-700'  },
};

export default function RideCard({ ride }: { ride: Ride }) {
  const ctx = CTX[ride.context];
  const genderLabel =
    ride.genderPreference === 'female' ? '♀ Women only' :
    ride.genderPreference === 'male'   ? '♂ Men only'   : null;

  return (
    <Link href={`/ride/${ride.id}`}>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 active:scale-[0.99] transition-all duration-150 hover:shadow-md">

        {/* ── Driver row ── */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <img
              src={ride.driver.avatar}
              alt={ride.driver.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0"
            />
            <div>
              <p className="font-semibold text-slate-900 text-sm leading-tight">
                {ride.driver.name.split(' ')[0]} {ride.driver.name.split(' ')[1]?.[0]}.
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                <span className="text-xs text-slate-500">{ride.driver.rating}</span>
                <UserBadges verifications={ride.driver.verifications} />
              </div>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="font-extrabold text-primary text-[17px] leading-tight">
              ₨ {ride.pricePKR}
            </p>
            <p className="text-[11px] text-slate-400">per seat</p>
          </div>
        </div>

        {/* ── Route ── */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex flex-col items-center gap-[3px] flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-px h-6 bg-slate-200" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{ride.from.label}</p>
            <p className="text-sm text-slate-400 truncate">{ride.to.label}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-slate-100 mb-3" />

        {/* ── Meta row ── */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Context — only one with a colored border */}
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${ctx.bg} ${ctx.text}`}>
            {ctx.label}
          </span>

          {/* Time — borderless, subtle */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600">
            <Clock className="w-3 h-3" />
            {ride.time}
          </span>

          {/* Seats left */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600">
            <Users className="w-3 h-3" />
            {ride.seatsLeft} seat{ride.seatsLeft !== 1 ? 's' : ''} left
          </span>

          {/* Gender preference */}
          {genderLabel && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-600">
              {genderLabel}
            </span>
          )}

          {/* CNIC / Uni requirement */}
          {ride.requireCnic && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
              CNIC req.
            </span>
          )}
          {ride.requireUniversity && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700">
              Uni req.
            </span>
          )}

          {/* Recurring */}
          {ride.recurring && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-600">
              <Repeat2 className="w-3 h-3" />
              Recurring
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
