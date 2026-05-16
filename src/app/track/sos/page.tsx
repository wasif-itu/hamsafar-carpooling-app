'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SOSPage() {
  const router = useRouter();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const startHold = () => {
    setHolding(true);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) {
          clearInterval(intervalRef.current);
          setSent(true);
          return 1;
        }
        return p + 0.033; // ~3 seconds to fill
      });
    }, 100);
  };

  const cancelHold = () => {
    setHolding(false);
    setProgress(0);
    clearInterval(intervalRef.current);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className="screen bg-white flex flex-col relative">
      {/* Back */}
      {!sent && (
        <button
          onClick={() => router.back()}
          className="absolute top-14 left-5 z-10 text-slate-500"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      <AnimatePresence>
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-red-600" />
            </motion.div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">SOS sent!</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Emergency alerts have been sent to your trusted contacts and local authorities
              with your current location.
            </p>
            <div className="w-full max-w-xs space-y-3 mb-8">
              {['Alert sent to Ammi (Fatima Tariq)', 'Location shared with trusted contacts', 'Emergency services notified'].map((s) => (
                <div key={s} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-slate-700 text-left">{s}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.back()}
              className="w-full h-14 rounded-full bg-slate-100 font-semibold text-slate-700"
            >
              Return to tracking
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="hold"
            className="flex-1 flex flex-col items-center justify-center px-8 text-center"
          >
            {/* Warning icon */}
            <motion.div
              animate={{ scale: holding ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 0.4, repeat: holding ? Infinity : 0 }}
              className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6"
            >
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </motion.div>

            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Emergency SOS</h1>
            <p className="text-slate-500 text-sm mb-10">
              Hold the button for 3 seconds to send an SOS alert to your trusted contacts
              and emergency services.
            </p>

            {/* Hold button */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Progress ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="80" cy="80" r="72"
                  fill="none" stroke="#FEE2E2" strokeWidth="8"
                />
                <circle
                  cx="80" cy="80" r="72"
                  fill="none" stroke="#DC2626" strokeWidth="8"
                  strokeDasharray={`${progress * 452} 452`}
                  strokeLinecap="round"
                />
              </svg>

              {/* Pulse rings */}
              {holding && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute w-36 h-36 rounded-full bg-red-500"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                    className="absolute w-36 h-36 rounded-full bg-red-500"
                  />
                </>
              )}

              <motion.button
                onPointerDown={startHold}
                onPointerUp={cancelHold}
                onPointerLeave={cancelHold}
                whileTap={{ scale: 0.93 }}
                className="relative z-10 w-32 h-32 rounded-full bg-red-600 flex flex-col items-center justify-center shadow-lg select-none"
                style={{ boxShadow: '0 8px 32px rgba(220,38,38,0.5)' }}
              >
                <span className="text-white font-extrabold text-2xl">SOS</span>
                <span className="text-red-200 text-xs mt-0.5">
                  {holding ? `${Math.round(progress * 3)}s...` : 'Hold 3s'}
                </span>
              </motion.button>
            </div>

            <p className="text-xs text-slate-400 mt-8">
              Release to cancel · Activating will alert your contacts
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
