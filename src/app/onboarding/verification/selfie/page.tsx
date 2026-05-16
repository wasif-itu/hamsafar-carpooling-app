'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Camera, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import PrimaryButton from '@/components/PrimaryButton';

export default function SelfieVerificationPage() {
  const router = useRouter();
  const { setOnboardingStep } = useStore();

  const [stage, setStage] = useState<'capture' | 'matching' | 'complete'>('capture');
  const [loading, setLoading] = useState(false);

  const handleCapture = async () => {
    setLoading(true);
    setStage('matching');

    // Simulate face matching
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setStage('complete');

    // Auto-advance to pending
    await new Promise((resolve) => setTimeout(resolve, 800));
    setOnboardingStep('verify-pending');
    router.push('/onboarding/verification/pending');
  };

  return (
    <div className="screen bg-background flex flex-col">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-8"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <button onClick={() => router.back()} className="mb-5 text-white/70">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <p className="text-white/70 text-sm mb-1">Step 6 of 7</p>
        <h1 className="text-2xl font-extrabold text-white">Verify with selfie</h1>
        <p className="text-white/65 text-sm mt-1">We&apos;ll match it against your ID</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32 flex flex-col items-center justify-center">
        {stage === 'capture' && (
          <>
            {/* Mock Camera */}
            <div className="w-full aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden mb-6 relative max-w-xs">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex flex-col items-center gap-3 text-slate-400"
                >
                  <Camera className="w-12 h-12" />
                  <p className="text-sm font-medium">Camera ready</p>
                </motion.div>
              </div>

              {/* Animated frame guide */}
              <motion.div
                animate={{
                  borderColor: ['rgba(15, 118, 110, 0.2)', 'rgba(15, 118, 110, 0.6)'],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 border-4 border-primary rounded-3xl"
              />
            </div>

            {/* Instructions */}
            <div className="text-center mb-8 max-w-xs">
              <p className="text-sm text-slate-600 font-medium">
                ✓ Face the camera directly<br />
                ✓ Make sure your face is well-lit<br />
                ✓ No glasses or hats
              </p>
            </div>
          </>
        )}

        {stage === 'matching' && (
          <>
            {/* Animated matching UI */}
            <motion.div
              className="w-full aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden mb-6 relative max-w-xs flex items-center justify-center"
              animate={{ scale: [0.95, 1] }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 border-2 border-primary rounded-full"
                />
                <p className="text-white text-sm font-medium">Matching face…</p>
              </div>

              {/* Scan line animation */}
              <motion.div
                animate={{ y: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 w-full h-1 bg-gradient-to-b from-primary to-transparent opacity-50"
              />
            </motion.div>

            <p className="text-center text-slate-600 text-sm">
              Verifying your identity…
            </p>
          </>
        )}

        {stage === 'complete' && (
          <>
            {/* Success state */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6"
            >
              <Check className="w-10 h-10 text-emerald-600" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-slate-900">Verified!</h2>
              <p className="text-slate-500 text-sm mt-2">
                Your selfie matches your ID<br />
                Continuing…
              </p>
            </motion.div>
          </>
        )}
      </div>

      {/* CTA */}
      {stage === 'capture' && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 pb-6">
          <PrimaryButton onClick={handleCapture} loading={loading}>
            {loading ? 'Processing…' : 'Capture selfie'}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
