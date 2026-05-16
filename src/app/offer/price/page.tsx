'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Minus, Plus, Info } from 'lucide-react';

function PriceContent() {
  const router = useRouter();
  const params = useSearchParams();
  const context = params.get('context') ?? 'city';

  // Suggested price based on context
  const suggestedPrice = context === 'intercity' ? 1500 : context === 'city' ? 400 : 250;

  const [seats, setSeats] = useState(3);
  const [price, setPrice] = useState(suggestedPrice);
  const [genderPref, setGenderPref] = useState<'any' | 'female' | 'male'>('any');
  const [requireCnic, setRequireCnic] = useState(false);
  const [requireUni, setRequireUni] = useState(context === 'campus');

  const totalEarning = seats * price;

  const handleContinue = () => {
    const q = new URLSearchParams({
      ...Object.fromEntries(params.entries()),
      seats: seats.toString(),
      price: price.toString(),
      genderPref,
      requireCnic: requireCnic.toString(),
      requireUni: requireUni.toString(),
    });
    router.push(`/offer/review?${q}`);
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
        <p className="text-white/70 text-sm mb-1">Step 4 of 5</p>
        <h1 className="text-2xl font-extrabold text-white">Price & seats</h1>
        <p className="text-white/65 text-sm mt-1">Set your preferences</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32 space-y-6">
        {/* Seats stepper */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">Available seats</label>
          <div className="flex items-center gap-5">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSeats(Math.max(1, seats - 1))}
              className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <Minus className="w-4 h-4 text-slate-700" />
            </motion.button>
            <div className="flex-1 text-center">
              <span className="text-4xl font-extrabold text-primary">{seats}</span>
              <p className="text-xs text-slate-500 mt-1">seat{seats !== 1 ? 's' : ''}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSeats(Math.min(6, seats + 1))}
              className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 text-slate-700" />
            </motion.button>
          </div>
        </div>

        {/* Price */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-900">Price per seat (₨)</label>
            <div className="flex items-center gap-1 text-xs text-primary font-medium">
              <Info className="w-3.5 h-3.5" />
              Suggested: ₨ {suggestedPrice}
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-sm">₨</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="input-field pl-8 font-bold text-lg"
              min={50}
              max={10000}
            />
          </div>
          <input
            type="range"
            min="50"
            max={context === 'intercity' ? 5000 : context === 'city' ? 1500 : 800}
            step="50"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-primary mt-2"
          />
        </div>

        {/* Total earning preview */}
        <motion.div
          key={`${seats}-${price}`}
          initial={{ opacity: 0.7, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-teal-600 font-semibold">Max earnings</p>
            <p className="text-2xl font-extrabold text-teal-900">₨ {totalEarning.toLocaleString()}</p>
            <p className="text-xs text-teal-700 mt-0.5">if all {seats} seats filled</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-teal-600 font-semibold">Per seat</p>
            <p className="text-lg font-bold text-teal-900">₨ {price}</p>
          </div>
        </motion.div>

        {/* Gender preference */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">Passenger gender preference</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'any', label: 'Anyone' },
              { key: 'female', label: '♀ Women only' },
              { key: 'male', label: '♂ Men only' },
            ].map(({ key, label }) => (
              <motion.button
                key={key}
                whileTap={{ scale: 0.96 }}
                onClick={() => setGenderPref(key as typeof genderPref)}
                className={`py-2.5 px-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                  genderPref === key
                    ? key === 'female'
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'bg-primary text-white border-primary'
                    : 'bg-white text-slate-700 border-border'
                }`}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">Passenger requirements</label>
          <div className="space-y-3">
            {[
              { key: 'requireCnic', val: requireCnic, set: setRequireCnic, label: 'CNIC verified', desc: 'Passengers must have CNIC verification' },
              { key: 'requireUni', val: requireUni, set: setRequireUni, label: 'University verified', desc: 'For campus rides — students only' },
            ].map(({ key, val, set, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
                <button
                  onClick={() => set(!val)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ml-4 ${val ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <motion.div
                    animate={{ x: val ? 24 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 pb-6">
        <button onClick={handleContinue} className="btn-primary">
          Continue
        </button>
      </div>
    </div>
  );
}

export default function OfferPricePage() {
  return (
    <Suspense fallback={<div className="screen flex items-center justify-center"><p className="text-slate-400">Loading...</p></div>}>
      <PriceContent />
    </Suspense>
  );
}
