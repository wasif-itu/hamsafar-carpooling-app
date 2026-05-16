'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, MapPin, Plus, X } from 'lucide-react';

const LOCATIONS = [
  'DHA Phase 5', 'LUMS', 'Gulberg III', 'Johar Town', 'MM Alam Road',
  'Bahria Town', 'Model Town', 'Liberty Market', 'Ferozepur Road',
  'Arfa Tech Park', 'Packages Mall', 'F-10 Markaz', 'H-12 Islamabad',
];

function RouteContent() {
  const router = useRouter();
  const params = useSearchParams();
  const context = params.get('context') ?? 'city';

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [stops, setStops] = useState<string[]>([]);
  const [fromFocus, setFromFocus] = useState(false);
  const [toFocus, setToFocus] = useState(false);

  const handleContinue = () => {
    if (!from || !to) return;
    const q = new URLSearchParams({ context, from, to, stops: stops.join(',') });
    router.push(`/offer/schedule?${q}`);
  };

  return (
    <div className="screen bg-background flex flex-col">
      <div
        className="px-5 pt-14 pb-8 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <button onClick={() => router.back()} className="mb-5 text-white/70">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <p className="text-white/70 text-sm mb-1">Step 2 of 5</p>
        <h1 className="text-2xl font-extrabold text-white">Set your route</h1>
        <p className="text-white/65 text-sm mt-1">Where are you going?</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32">
        {/* From */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-900 mb-2">Pickup point</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
            <input
              type="text"
              placeholder="Starting location"
              value={from}
              onFocus={() => setFromFocus(true)}
              onBlur={() => setTimeout(() => setFromFocus(false), 150)}
              onChange={(e) => setFrom(e.target.value)}
              className="input-field pl-8"
            />
          </div>
          {fromFocus && (
            <div className="bg-white rounded-xl border border-border mt-1 overflow-hidden shadow-md">
              {LOCATIONS.filter(l => l.toLowerCase().includes(from.toLowerCase())).slice(0, 5).map((loc) => (
                <button
                  key={loc}
                  onMouseDown={(e) => { e.preventDefault(); setFrom(loc); setFromFocus(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left"
                >
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{loc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stops */}
        {stops.map((stop, i) => (
          <div key={i} className="mb-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-primary" />
              <input
                type="text"
                value={stop}
                onChange={(e) => {
                  const ns = [...stops];
                  ns[i] = e.target.value;
                  setStops(ns);
                }}
                placeholder={`Stop ${i + 1}`}
                className="input-field pl-8 pr-10"
              />
              <button
                onClick={() => setStops(stops.filter((_, j) => j !== i))}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        ))}

        {/* Add stop */}
        {stops.length < 3 && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setStops([...stops, ''])}
            className="w-full mb-4 flex items-center gap-2 py-2.5 text-sm font-medium text-primary"
          >
            <Plus className="w-4 h-4" /> Add a stop
          </motion.button>
        )}

        {/* To */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 mb-2">Drop-off point</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400" />
            <input
              type="text"
              placeholder="Destination"
              value={to}
              onFocus={() => setToFocus(true)}
              onBlur={() => setTimeout(() => setToFocus(false), 150)}
              onChange={(e) => setTo(e.target.value)}
              className="input-field pl-8"
            />
          </div>
          {toFocus && (
            <div className="bg-white rounded-xl border border-border mt-1 overflow-hidden shadow-md">
              {LOCATIONS.filter(l => l.toLowerCase().includes(to.toLowerCase()) && l !== from).slice(0, 5).map((loc) => (
                <button
                  key={loc}
                  onMouseDown={(e) => { e.preventDefault(); setTo(loc); setToFocus(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left"
                >
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{loc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mock Map preview */}
        <div className="bg-slate-100 rounded-2xl h-40 overflow-hidden">
          <svg viewBox="0 0 350 160" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <rect width="350" height="160" fill="#E8F5F0" />
            <line x1="0" y1="80" x2="350" y2="80" stroke="white" strokeWidth="16" />
            <line x1="120" y1="0" x2="120" y2="160" stroke="white" strokeWidth="10" />
            <rect x="0" y="0" width="110" height="70" rx="4" fill="#C8E6D8" />
            <rect x="130" y="0" width="110" height="70" rx="4" fill="#C8E6D8" />
            {from && to ? (
              <>
                <path d="M 50 80 Q 180 40 300 80" stroke="#0F766E" strokeWidth="3" fill="none" strokeDasharray="6,3" />
                <circle cx="50" cy="80" r="7" fill="#0F766E" />
                <circle cx="300" cy="80" r="7" fill="#F59E0B" />
                <text x="50" y="62" textAnchor="middle" fill="#0F766E" fontSize="9" fontWeight="bold" fontFamily="sans-serif">{from.slice(0, 8)}</text>
                <text x="300" y="62" textAnchor="middle" fill="#F59E0B" fontSize="9" fontWeight="bold" fontFamily="sans-serif">{to.slice(0, 8)}</text>
              </>
            ) : (
              <text x="175" y="88" textAnchor="middle" fill="#94A3B8" fontSize="12" fontFamily="sans-serif">Select route to preview</text>
            )}
          </svg>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 pb-6">
        <button
          onClick={handleContinue}
          disabled={!from || !to}
          className="btn-primary"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default function OfferRoutePage() {
  return (
    <Suspense fallback={<div className="screen flex items-center justify-center"><p className="text-slate-400">Loading...</p></div>}>
      <RouteContent />
    </Suspense>
  );
}
