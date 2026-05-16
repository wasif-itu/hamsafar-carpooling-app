'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Calendar, Clock, Users, Car,
  CheckCircle2, Repeat2, Shield,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

function ReviewContent() {
  const router = useRouter();
  const params = useSearchParams();
  const user = useStore((s) => s.user);

  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  void params.get('context');
  const from = params.get('from') ?? '';
  const to = params.get('to') ?? '';
  const date = params.get('date') ?? '';
  const time = params.get('time') ?? '';
  const recur = params.get('recur') ?? 'once';
  const days = params.get('days') ?? '';
  const seats = Number(params.get('seats') ?? 3);
  const price = Number(params.get('price') ?? 400);
  const genderPref = params.get('genderPref') ?? 'any';
  const requireCnic = params.get('requireCnic') === 'true';
  const requireUni = params.get('requireUni') === 'true';

  const handlePublish = async () => {
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPublished(true);
    toast.success('Ride published!', { description: 'Passengers can now find your ride.' });
  };

  if (published) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="screen bg-background flex flex-col items-center justify-center px-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Ride published!</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Your ride is now live. Passengers can request to join and you&apos;ll be notified.
          </p>
          <div className="bg-teal-50 rounded-2xl p-4 border border-teal-200 mb-8 text-left">
            <p className="text-xs text-teal-700 font-semibold mb-1">Summary</p>
            <p className="text-sm font-bold text-teal-900">{from} → {to}</p>
            <p className="text-xs text-teal-700 mt-0.5">{date} · {time} · ₨ {price}/seat · {seats} seats</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/home')}
            className="btn-primary"
          >
            Go to Home
          </motion.button>
          <button
            onClick={() => router.push('/my-rides')}
            className="block w-full mt-3 text-sm font-semibold text-primary text-center"
          >
            View my rides
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="screen bg-background flex flex-col">
      <div
        className="px-5 pt-14 pb-8 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <button onClick={() => router.back()} className="mb-5 text-white/70">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <p className="text-white/70 text-sm mb-1">Step 5 of 5</p>
        <h1 className="text-2xl font-extrabold text-white">Review & publish</h1>
        <p className="text-white/65 text-sm mt-1">Double-check before going live</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-28 space-y-4">
        {/* Summary card */}
        <div className="bg-white rounded-2xl border border-border p-4 space-y-4">
          <h3 className="font-bold text-slate-900">Ride summary</h3>

          {/* Route */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <div className="w-px h-8 bg-slate-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-slate-900">{from || 'Not set'}</p>
              <p className="text-sm text-slate-500">{to || 'Not set'}</p>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-700">{date || 'No date'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-700">{time || 'No time'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-700">{seats} seats</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary">₨ {price}</span>
              <span className="text-xs text-slate-500">per seat</span>
            </div>
          </div>

          {recur !== 'once' && (
            <div className="flex items-center gap-2 pt-1">
              <Repeat2 className="w-4 h-4 text-violet-500" />
              <span className="text-xs text-violet-700 font-semibold">
                Recurring — {recur === 'daily' ? 'Every day' : recur === 'weekdays' ? 'Mon–Fri' : days}
              </span>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Preferences</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Passengers:</span>
            <span className="text-xs text-slate-800">
              {genderPref === 'any' ? 'Anyone welcome' : genderPref === 'female' ? '♀ Women only' : '♂ Men only'}
            </span>
          </div>
          {(requireCnic || requireUni) && (
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs text-slate-700">
                Requires: {[requireCnic && 'CNIC', requireUni && 'University'].filter(Boolean).join(', ')} verification
              </span>
            </div>
          )}
        </div>

        {/* Your vehicle */}
        {user?.vehicle && (
          <div className="bg-white rounded-2xl border border-border p-4">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Your vehicle</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  {user.vehicle.make} {user.vehicle.model} {user.vehicle.year}
                </p>
                <p className="text-xs text-slate-500">
                  {user.vehicle.color} · {user.vehicle.plate}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Earnings preview */}
        <div className="bg-teal-50 rounded-2xl border border-teal-200 p-4">
          <p className="text-xs text-teal-600 font-semibold mb-1">Potential earnings</p>
          <p className="text-2xl font-extrabold text-teal-900">₨ {(seats * price).toLocaleString()}</p>
          <p className="text-xs text-teal-700 mt-0.5">If all {seats} seats are filled. No commissions.</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 pb-6 pt-4 bg-white border-t border-border">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePublish}
          disabled={publishing}
          className="btn-primary"
        >
          {publishing ? 'Publishing…' : 'Publish ride'}
        </motion.button>
      </div>
    </div>
  );
}

export default function OfferReviewPage() {
  return (
    <Suspense fallback={<div className="screen flex items-center justify-center"><p className="text-slate-400">Loading...</p></div>}>
      <ReviewContent />
    </Suspense>
  );
}
