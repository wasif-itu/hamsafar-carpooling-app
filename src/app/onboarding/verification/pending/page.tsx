'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function VerificationPendingPage() {
  const router = useRouter();
  const { setOnboardingStep, markVerificationComplete } = useStore();
  const [autoVerifying, setAutoVerifying] = useState(false);

  const handleSkipForDemo = () => {
    setAutoVerifying(true);
    // Simulate quick verification
    setTimeout(() => {
      markVerificationComplete();
      setOnboardingStep('trusted-contacts');
      router.push('/onboarding/trusted-contacts');
    }, 1200);
  };

  return (
    <div className="screen bg-background flex flex-col">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-8"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <p className="text-white/70 text-sm mb-1">Step 7 of 8</p>
        <h1 className="text-2xl font-extrabold text-white">Verification pending</h1>
        <p className="text-white/65 text-sm mt-1">We&apos;re reviewing your documents</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-12 pb-20 flex flex-col items-center justify-center text-center">
        {!autoVerifying ? (
          <>
            {/* Pending illustration */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full">
                <Clock className="w-10 h-10 text-amber-600" />
              </div>
            </motion.div>

            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              Thanks for submitting!
            </h2>

            <p className="text-slate-600 text-sm mb-6 leading-relaxed max-w-xs">
              We typically verify documents within <span className="font-semibold">24 hours</span>.
              <br />
              You&apos;ll get a notification once you&apos;re verified.
            </p>

            {/* Timeline info */}
            <div className="w-full max-w-xs p-4 bg-slate-50 rounded-2xl mb-8">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-xs text-slate-700">Documents received</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex-shrink-0 mt-0.5 flex items-center justify-center">
                    <span className="text-slate-400 text-xs">2</span>
                  </div>
                  <p className="text-xs text-slate-600">Under review (6-24 hours)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex-shrink-0 mt-0.5 flex items-center justify-center">
                    <span className="text-slate-400 text-xs">3</span>
                  </div>
                  <p className="text-xs text-slate-600">Notification sent</p>
                </div>
              </div>
            </div>

            {/* Skip for demo link */}
            <p className="text-xs text-slate-500 mb-2">For demo purposes:</p>
            <button
              onClick={handleSkipForDemo}
              className="text-primary font-semibold text-sm hover:underline active:scale-95 transition-transform"
            >
              Skip for demo & auto-verify →
            </button>
          </>
        ) : (
          <>
            {/* Auto-verification animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full">
                <motion.svg
                  className="w-10 h-10 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                </motion.svg>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-slate-900">Verified!</h2>
              <p className="text-slate-500 text-sm mt-2">Setting up trusted contacts…</p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
