'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Star, MapPin, Clock, Users, Car,
  ChevronDown, ChevronUp, Shield, CheckCircle2,
  MessageCircle, Phone,
} from 'lucide-react';
import { useRides } from '@/lib/store';
import { UserBadges } from '@/components/VerificationBadge';
import { toast } from 'sonner';

function MockRouteMap({ from, to }: { from: string; to: string }) {
  return (
    <div className="w-full h-40 bg-slate-100 rounded-2xl overflow-hidden">
      <svg viewBox="0 0 350 160" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="350" height="160" fill="#E8F5F0" />
        <line x1="0" y1="80" x2="350" y2="80" stroke="white" strokeWidth="16" />
        <line x1="120" y1="0" x2="120" y2="160" stroke="white" strokeWidth="10" />
        <line x1="250" y1="0" x2="250" y2="160" stroke="white" strokeWidth="10" />
        <rect x="0" y="0" width="110" height="70" rx="4" fill="#C8E6D8" />
        <rect x="130" y="0" width="110" height="70" rx="4" fill="#C8E6D8" />
        <rect x="130" y="90" width="110" height="70" rx="4" fill="#C8E6D8" />
        <path d="M 50 80 Q 180 40 300 80" stroke="#0F766E" strokeWidth="3" fill="none" strokeDasharray="6,3" />
        <circle cx="50" cy="80" r="8" fill="#0F766E" />
        <circle cx="50" cy="80" r="4" fill="white" />
        <circle cx="300" cy="80" r="8" fill="#F59E0B" />
        <circle cx="300" cy="80" r="4" fill="white" />
        <text x="50" y="60" textAnchor="middle" fill="#0F766E" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
          {from.slice(0, 10)}
        </text>
        <text x="300" y="60" textAnchor="middle" fill="#F59E0B" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
          {to.slice(0, 10)}
        </text>
      </svg>
    </div>
  );
}

export default function RideDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rides = useRides();

  const [priceBreakdownOpen, setPriceBreakdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [requestPending, setRequestPending] = useState(false);
  const [requestDone, setRequestDone] = useState(false);
  const [note, setNote] = useState('');

  const ride = rides.find((r) => r.id === params.id);

  if (!ride) {
    return (
      <div className="screen flex items-center justify-center">
        <p className="text-slate-400">Ride not found</p>
      </div>
    );
  }

  const { driver } = ride;
  const driverFirst = driver.name.split(' ')[0];
  const driverLastInitial = driver.name.split(' ')[1]?.[0] ?? '';

  const handleSendRequest = () => {
    setShowModal(false);
    setRequestPending(true);
    toast.success('Request sent!', { description: 'Waiting for driver to accept.' });
    setTimeout(() => {
      setRequestPending(false);
      setRequestDone(true);
    }, 4000);
  };

  return (
    // relative here so absolute-positioned modals stay inside the phone frame
    <div className="screen bg-background flex flex-col relative">
      {/* ── Pending overlay (absolute, inside phone frame) ── */}
      <AnimatePresence>
        {requestPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center px-8 text-center"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ scale: [1, 1.6, 1.6], opacity: [0.7, 0, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-4 border-primary"
              />
              <motion.div
                animate={{ scale: [1, 1.35, 1.35], opacity: [0.5, 0, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
                className="absolute inset-0 rounded-full border-4 border-teal-300"
              />
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-10 h-10 text-primary" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Request sent!</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Waiting for <span className="font-semibold">{driverFirst}</span> to accept your
              request. You&apos;ll get a notification within 30 minutes.
            </p>

            <div className="w-full max-w-xs space-y-3 mb-8">
              {[
                { label: 'Request sent', done: true },
                { label: 'Awaiting driver response', done: false },
                { label: 'Confirmation & payment', done: false },
              ].map(({ label, done }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      done ? 'bg-primary' : 'bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <span className={`text-sm ${done ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setRequestPending(false)}
              className="text-slate-500 text-sm font-medium underline"
            >
              Cancel request
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal backdrop + panel (absolute, inside phone frame) ── */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black z-40"
            />
            {/* Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 32 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50"
            >
              <div className="flex justify-center pt-3 mb-4">
                <div className="w-10 h-1 bg-slate-200 rounded-full" />
              </div>
              <div className="px-5 pb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-1">Request to join</h2>
                <p className="text-slate-500 text-sm mb-5">
                  Send a ride request to {driverFirst}. They&apos;ll accept or decline within 30 mins.
                </p>

                <div className="bg-slate-50 rounded-2xl p-4 mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Total you&apos;ll pay</p>
                    <p className="text-2xl font-extrabold text-primary mt-0.5">₨ {ride.pricePKR}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Per seat</p>
                    <p className="text-sm font-semibold text-slate-700">Cash / JazzCash</p>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Note to driver{' '}
                    <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g., I'll be at the main gate"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border text-sm text-slate-700 outline-none resize-none focus:border-primary"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-14 rounded-full font-semibold text-slate-700 border-2 border-border"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSendRequest}
                    className="h-14 px-6 rounded-full font-semibold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #14B8A6, #0F766E)',
                      flexGrow: 2,
                    }}
                  >
                    Send request
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div
        className="px-5 pt-14 pb-4 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <button onClick={() => router.back()} className="mb-4 text-white/70">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-extrabold text-white">Ride details</h1>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              ride.context === 'campus'
                ? 'bg-blue-400/30 text-blue-100'
                : ride.context === 'city'
                ? 'bg-teal-400/30 text-teal-100'
                : 'bg-amber-400/30 text-amber-100'
            }`}
          >
            {ride.context.charAt(0).toUpperCase() + ride.context.slice(1)}
          </span>
          <span className="text-white/60 text-sm">
            {ride.date} · {ride.time}
          </span>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-28 space-y-4">
        {/* Driver card */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <div className="flex items-start gap-3 mb-4">
            <img
              src={driver.avatar}
              alt={driver.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-slate-900 text-base">
                {driverFirst} {driverLastInitial}.
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold text-slate-700">{driver.rating}</span>
                <span className="text-xs text-slate-400">· {driver.totalRides} rides</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                <UserBadges verifications={driver.verifications} />
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-3 border-t border-border text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              Member since{' '}
              {new Date(driver.memberSince).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Route map */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <MockRouteMap from={ride.from.label} to={ride.to.label} />
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
              <p className="text-sm font-medium text-slate-800 truncate">{ride.from.label}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
              <p className="text-sm text-slate-500 truncate">{ride.to.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">{ride.estimatedMinutes ?? 25} mins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">{ride.distanceKm ?? 12} km</span>
            </div>
          </div>
        </div>

        {/* Passengers */}
        {ride.passengers.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-4">
            <h3 className="font-semibold text-slate-900 text-sm mb-3">Other passengers</h3>
            <div className="space-y-3">
              {ride.passengers.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {p.name.split(' ')[0]} {p.name.split(' ')[1]?.[0]}.
                      {p.gender === 'female' && (
                        <span className="ml-1 text-pink-500 text-xs">♀</span>
                      )}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-slate-500">{p.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price breakdown */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 text-sm">Price</h3>
            <p className="text-xl font-extrabold text-primary">₨ {ride.pricePKR}</p>
          </div>
          <button
            onClick={() => setPriceBreakdownOpen(!priceBreakdownOpen)}
            className="flex items-center gap-1 text-xs text-primary font-semibold"
          >
            How is this calculated?
            {priceBreakdownOpen ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
          <AnimatePresence>
            {priceBreakdownOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-border space-y-2">
                  {[
                    { label: 'Fuel cost share', value: Math.round(ride.pricePKR * 0.65) },
                    { label: 'Toll charges', value: Math.round(ride.pricePKR * 0.10) },
                    { label: 'Driver convenience', value: Math.round(ride.pricePKR * 0.25) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-medium text-slate-700">₨ {value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold border-t border-border pt-2 mt-1">
                    <span className="text-slate-800">Total per seat</span>
                    <span className="text-primary">₨ {ride.pricePKR}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vehicle */}
        {ride.vehicle && (
          <div className="bg-white rounded-2xl border border-border p-4">
            <h3 className="font-semibold text-slate-900 text-sm mb-3">Vehicle</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  {ride.vehicle.make} {ride.vehicle.model} {ride.vehicle.year}
                </p>
                <p className="text-xs text-slate-500">
                  {ride.vehicle.color} · {ride.vehicle.plate}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Driver note */}
        {ride.driverNote && (
          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
            <p className="text-xs font-semibold text-amber-700 mb-1">Driver&apos;s note</p>
            <p className="text-sm text-amber-900">{ride.driverNote}</p>
          </div>
        )}

        {/* Seats */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <p className="text-sm font-semibold text-slate-900">
                {ride.seatsLeft} seat{ride.seatsLeft !== 1 ? 's' : ''} remaining
              </p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: ride.seats }).map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-lg ${
                    i < ride.seats - ride.seatsLeft ? 'bg-primary/20' : 'bg-slate-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky CTA (stays inside phone frame via relative parent) ── */}
      <div className="flex-shrink-0 px-5 pb-6 pt-4 bg-white border-t border-border">
        {requestDone ? (
          <div className="flex items-center justify-center gap-2 h-14 rounded-full bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-emerald-700">Request sent!</span>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            disabled={ride.seatsLeft === 0}
            className="btn-primary"
          >
            {ride.seatsLeft === 0
              ? 'No seats available'
              : `Request to Join · ₨ ${ride.pricePKR}`}
          </motion.button>
        )}
      </div>
    </div>
  );
}
