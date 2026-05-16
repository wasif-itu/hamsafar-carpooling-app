'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Phone, MessageCircle, Share2, Flag,
  Star, Navigation,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import BottomNav from '@/components/BottomNav';

// Mock animated driver marker along a bezier path
function LiveMap({ progress }: { progress: number }) {
  // Bezier curve control points for the route (SVG 390Ã—360)
  const startX = 60, startY = 280;
  const cp1X = 140, cp1Y = 180;
  const cp2X = 260, cp2Y = 120;
  const endX = 330, endY = 70;

  // Compute point along cubic bezier at t=progress
  const t = progress;
  const mt = 1 - t;
  const px = mt*mt*mt*startX + 3*mt*mt*t*cp1X + 3*mt*t*t*cp2X + t*t*t*endX;
  const py = mt*mt*mt*startY + 3*mt*mt*t*cp1Y + 3*mt*t*t*cp2Y + t*t*t*endY;

  return (
    <svg viewBox="0 0 390 360" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      {/* Map background */}
      <rect width="390" height="360" fill="#E8EFF5" />
      {/* Roads */}
      <line x1="0" y1="200" x2="390" y2="200" stroke="white" strokeWidth="14" />
      <line x1="0" y1="290" x2="390" y2="290" stroke="white" strokeWidth="10" />
      <line x1="100" y1="0" x2="100" y2="360" stroke="white" strokeWidth="10" />
      <line x1="220" y1="0" x2="220" y2="360" stroke="white" strokeWidth="14" />
      <line x1="330" y1="0" x2="330" y2="360" stroke="white" strokeWidth="8" />
      {/* Blocks */}
      <rect x="0"   y="0"   width="90"  height="190" rx="4" fill="#D8E5EE" />
      <rect x="110" y="0"   width="100" height="190" rx="4" fill="#D8E5EE" />
      <rect x="230" y="0"   width="90"  height="190" rx="4" fill="#D8E5EE" />
      <rect x="0"   y="210" width="90"  height="70"  rx="4" fill="#D8E5EE" />
      <rect x="110" y="210" width="100" height="70"  rx="4" fill="#D8E5EE" />
      <rect x="230" y="210" width="90"  height="70"  rx="4" fill="#D8E5EE" />
      {/* Route path (dashed) */}
      <path
        d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
        fill="none" stroke="#0F766E" strokeWidth="4" strokeDasharray="8,4" opacity="0.6"
      />
      {/* Traveled portion */}
      <path
        d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
        fill="none" stroke="#0F766E" strokeWidth="4"
        strokeDasharray={`${progress * 420} 420`}
      />
      {/* Start pin */}
      <circle cx={startX} cy={startY} r="8" fill="#0F766E" />
      <circle cx={startX} cy={startY} r="4" fill="white" />
      {/* End pin */}
      <circle cx={endX} cy={endY} r="8" fill="#F59E0B" />
      <circle cx={endX} cy={endY} r="4" fill="white" />
      {/* Driver marker */}
      <g transform={`translate(${px},${py})`}>
        <circle r="16" fill="#0F766E" opacity="0.2" />
        <circle r="10" fill="#0F766E" />
        <circle r="5" fill="white" />
      </g>
    </svg>
  );
}

export default function TrackPage() {
  const rides = useStore((s) => s.rides);
  const activeRide = rides[0]; // First ride as demo active ride

  const [progress, setProgress] = useState(0.08);
  const [eta, setEta] = useState(8);
  const rafRef = useRef<number>();
  const lastRef = useRef<number>(0);

  // Animate driver marker smoothly
  useEffect(() => {
    const step = (ts: number) => {
      if (!lastRef.current) lastRef.current = ts;
      const delta = (ts - lastRef.current) / 1000;
      lastRef.current = ts;
      setProgress((p) => {
        const next = Math.min(p + delta * 0.015, 1);
        setEta(Math.max(0, Math.round((1 - next) * 25)));
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  if (!activeRide) {
    return (
      <div className="screen bg-background flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <Navigation className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="font-bold text-slate-900">No active ride</h2>
          <p className="text-sm text-slate-500">Start or join a ride to track it here</p>
          <Link href="/find">
            <button className="btn-primary" style={{ width: 200 }}>Find a ride</button>
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  const driver = activeRide.driver;
  const minsAway = Math.max(1, Math.round(eta * 0.3));

  return (
    <div className="screen bg-background flex flex-col relative">
      {/* SOS Button */}
      <Link href="/track/sos">
        <motion.div
          whileTap={{ scale: 0.92 }}
          className="absolute top-14 right-4 z-30 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg"
          style={{ boxShadow: '0 0 0 4px rgba(220,38,38,0.2)' }}
        >
          <span className="text-white font-extrabold text-sm">SOS</span>
        </motion.div>
      </Link>

      {/* Map */}
      <div className="relative flex-shrink-0" style={{ height: '50vh' }}>
        <div className="absolute inset-0">
          <LiveMap progress={progress} />
        </div>

        {/* Side action bar */}
        <div className="absolute right-4 top-32 flex flex-col gap-2 z-20">
          {[
            { Icon: Phone,          label: 'Call',  bg: 'bg-white' },
            { Icon: MessageCircle,  label: 'Chat',  bg: 'bg-white' },
            { Icon: Share2,         label: 'Share', bg: 'bg-white' },
            { Icon: Flag,           label: 'Report',bg: 'bg-white' },
          ].map(({ Icon, label, bg }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.9 }}
              className={`w-11 h-11 ${bg} rounded-full shadow flex items-center justify-center border border-slate-100`}
              title={label}
            >
              <Icon className="w-4 h-4 text-slate-600" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Driver info card */}
      <div className="flex-1 overflow-y-auto bg-white rounded-t-3xl -mt-4 relative z-10 shadow-lg px-5 pt-4 pb-24">
        {/* Handle */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

        {/* ETA banner */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-500 font-medium">Driver is</p>
            <p className="text-2xl font-extrabold text-primary">{minsAway} min{minsAway !== 1 ? 's' : ''} away</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium">Arrival ETA</p>
            <p className="text-lg font-bold text-slate-900">{eta} mins</p>
          </div>
        </div>

        {/* Driver */}
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-4">
          <img
            src={driver.avatar}
            alt={driver.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900">
              {driver.name.split(' ')[0]} {driver.name.split(' ')[1]?.[0]}.
            </p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs text-slate-600">{driver.rating}</span>
            </div>
          </div>
          {activeRide.vehicle && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-semibold text-slate-800">
                {activeRide.vehicle.make} {activeRide.vehicle.model}
              </p>
              <p className="text-xs text-slate-500">
                {activeRide.vehicle.color} Â· {activeRide.vehicle.plate}
              </p>
            </div>
          )}
        </div>

        {/* Route summary */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
            <p className="text-sm text-slate-700 truncate">{activeRide.from.label}</p>
          </div>
          <div className="w-px h-4 bg-slate-200 ml-1" />
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
            <p className="text-sm text-slate-700 truncate">{activeRide.to.label}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
          <motion.div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>Pickup</span>
          <span>{Math.round(progress * 100)}% complete</span>
          <span>Drop-off</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

