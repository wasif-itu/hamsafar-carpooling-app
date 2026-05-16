'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, TrendingUp, Leaf, Zap, Share2 } from 'lucide-react';
import { useStore } from '@/lib/store';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const SAVINGS_DATA = [1200, 2400, 1800, 3200, 2800, 4100];
const MAX_SAVINGS = Math.max(...SAVINGS_DATA);
const CO2_KG = 48.2;
const TREES_EQUIV = 2.1;

export default function SavingsPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const [selected, setSelected] = useState(5);

  const totalSaved = SAVINGS_DATA.reduce((a, b) => a + b, 0);
  const vsRideHailing = totalSaved * 2.3;
  const vsSolo = totalSaved * 0.6;

  return (
    <div className="screen bg-background flex flex-col">
      <div
        className="px-5 pt-14 pb-6 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <button onClick={() => router.back()} className="mb-4 text-white/70">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Savings Dashboard</h1>
            <p className="text-white/65 text-sm mt-1">Your cost & CO2 impact</p>
          </div>
          <button className="w-9 h-9 bg-white/15 rounded-full flex items-center justify-center mt-1">
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="mt-5 bg-white/15 rounded-2xl p-4 text-center">
          <p className="text-white/65 text-xs font-medium mb-1">Total saved this year</p>
          <p className="text-4xl font-extrabold text-white">Rs.{(totalSaved / 1000).toFixed(1)}k</p>
          <p className="text-white/65 text-xs mt-1">across {user?.totalRides ?? 0} rides</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 px-4 pt-4 space-y-4">
        <div className="bg-white rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-slate-900">Monthly Savings (Rs.)</p>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-end gap-2 h-28">
            {SAVINGS_DATA.map((val, i) => {
              const pct = (val / MAX_SAVINGS) * 100;
              const isSel = i === selected;
              return (
                <button key={i} onClick={() => setSelected(i)} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 260, damping: 24 }}
                    style={{ height: `${pct}%`, originY: 1 }}
                    className={`w-full rounded-t-md ${isSel ? 'bg-primary' : 'bg-primary/20'}`}
                  />
                  <span className={`text-[10px] font-medium ${isSel ? 'text-primary' : 'text-slate-400'}`}>{MONTHS[i]}</span>
                </button>
              );
            })}
          </div>
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-primary/5 rounded-xl px-4 py-2.5 flex items-center justify-between"
          >
            <span className="text-sm font-semibold text-slate-700">{MONTHS[selected]}</span>
            <span className="text-sm font-extrabold text-primary">Rs.{SAVINGS_DATA[selected].toLocaleString()}</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center mb-2">
              <Zap className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-xs text-slate-500 leading-tight">Saved vs ride-hailing</p>
            <p className="text-lg font-extrabold text-slate-900 mt-1">Rs.{(vsRideHailing / 1000).toFixed(1)}k</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Uber/Careem equivalent</p>
          </div>
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-xs text-slate-500 leading-tight">Earned by offering</p>
            <p className="text-lg font-extrabold text-slate-900 mt-1">Rs.{(vsSolo / 1000).toFixed(1)}k</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Fuel cost recovered</p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900">CO2 Impact</p>
              <p className="text-xs text-emerald-600">Your green contribution</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white/60 rounded-xl p-3 text-center">
              <p className="text-2xl font-extrabold text-emerald-700">{CO2_KG}</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">kg CO2 saved</p>
            </div>
            <div className="bg-white/60 rounded-xl p-3 text-center">
              <p className="text-2xl font-extrabold text-emerald-700">{TREES_EQUIV}</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">trees equivalent</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-emerald-600 font-medium">Progress to 100 kg</span>
            <span className="text-[10px] text-emerald-700 font-bold">{Math.round(CO2_KG)}%</span>
          </div>
          <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${CO2_KG}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-sm font-bold text-slate-900 mb-3">Ride Streaks</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Current', value: '7 days', hl: true },
              { label: 'Longest', value: '21 days', hl: false },
              { label: 'This month', value: '14 rides', hl: false },
            ].map(({ label, value, hl }) => (
              <div key={label} className={`rounded-xl p-3 text-center ${hl ? 'bg-amber-50 border border-amber-100' : 'bg-slate-50'}`}>
                <p className={`text-base font-extrabold ${hl ? 'text-amber-600' : 'text-slate-800'}`}>{value}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm"
        >
          <Share2 className="w-4 h-4" />
          Share my savings milestone
        </motion.button>
      </div>
    </div>
  );
}
