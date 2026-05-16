'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Clock, Repeat2 } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type RecurType = 'once' | 'daily' | 'weekdays' | 'custom';

function ScheduleContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [recurType, setRecurType] = useState<RecurType>('once');
  const [customDays, setCustomDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleContinue = () => {
    const q = new URLSearchParams({
      ...Object.fromEntries(params.entries()),
      date,
      time,
      recur: recurType,
      days: customDays.join(','),
    });
    router.push(`/offer/price?${q}`);
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
        <p className="text-white/70 text-sm mb-1">Step 3 of 5</p>
        <h1 className="text-2xl font-extrabold text-white">Schedule</h1>
        <p className="text-white/65 text-sm mt-1">When is the ride?</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32 space-y-6">
        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Departure date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Departure time</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Recurring options */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">Repeat</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'once', label: 'One-time', icon: Calendar },
              { key: 'daily', label: 'Daily', icon: Repeat2 },
              { key: 'weekdays', label: 'Weekdays', icon: Repeat2 },
              { key: 'custom', label: 'Custom days', icon: Repeat2 },
            ].map(({ key, label, icon: Icon }) => (
              <motion.button
                key={key}
                onClick={() => setRecurType(key as RecurType)}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  recurType === key
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-slate-700 border-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom day picker */}
        {recurType === 'custom' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <label className="block text-sm font-semibold text-slate-900 mb-3">Select days</label>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map((day) => (
                <motion.button
                  key={day}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleDay(day)}
                  className={`w-11 h-11 rounded-full text-sm font-semibold transition-all ${
                    customDays.includes(day)
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {day}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Preview pill */}
        {date && time && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-teal-50 border border-teal-200 rounded-2xl p-4"
          >
            <p className="text-xs text-teal-600 font-semibold mb-1">Schedule preview</p>
            <p className="text-sm font-bold text-teal-900">
              {date} at {time}
            </p>
            {recurType !== 'once' && (
              <p className="text-xs text-teal-700 mt-1">
                Repeats: {recurType === 'daily' ? 'Every day' : recurType === 'weekdays' ? 'Mon–Fri' : customDays.join(', ')}
              </p>
            )}
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 pb-6">
        <button
          onClick={handleContinue}
          disabled={!date || !time || (recurType === 'custom' && customDays.length === 0)}
          className="btn-primary"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default function OfferSchedulePage() {
  return (
    <Suspense fallback={<div className="screen flex items-center justify-center"><p className="text-slate-400">Loading...</p></div>}>
      <ScheduleContent />
    </Suspense>
  );
}
