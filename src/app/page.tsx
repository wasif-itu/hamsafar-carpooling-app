'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, onboardingDone } = useStore();

  useEffect(() => {
    // Small delay to let Zustand persist hydrate before reading auth state
    const timer = setTimeout(() => {
      if (isAuthenticated) router.push('/home');
      else if (onboardingDone) router.push('/onboarding/phone');
      else router.push('/onboarding');
    }, 2600);
    return () => clearTimeout(timer);
  }, [router, isAuthenticated, onboardingDone]);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-dvh relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 45%, #14B8A6 100%)' }}
    >
      {/* Background decorative circles */}
      <div className="absolute top-[-80px] right-[-60px] w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute bottom-[-40px] left-[-80px] w-80 h-80 rounded-full bg-white/5" />
      <div className="absolute top-1/3 left-[-40px] w-32 h-32 rounded-full bg-white/8" />

      {/* Logo mark */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22, delay: 0.1 }}
        className="mb-6"
      >
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center relative"
          style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(255,255,255,0.25)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          <HamSafarLogoMark />
        </div>
      </motion.div>

      {/* Wordmark */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-center mb-3"
      >
        {/* Urdu logotype */}
        <p
          className="text-white/90 text-3xl font-bold mb-1"
          style={{ fontFamily: 'serif', letterSpacing: '0.02em' }}
        >
          ہم سفر
        </p>
        <h1 className="text-white text-4xl font-extrabold tracking-tight">
          HamSafar
        </h1>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85, duration: 0.6 }}
        className="text-white/65 text-sm text-center px-10 leading-relaxed"
      >
        Verified peers. Shared journeys.{'\n'}Safer roads.
      </motion.p>

      {/* Loading dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-14 flex gap-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/50"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 text-white text-[10px] tracking-widest uppercase"
      >
        Made for Pakistan
      </motion.p>
    </div>
  );
}

function HamSafarLogoMark() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {/* Route path */}
      <path
        d="M8 40 Q16 20 28 16 Q38 12 48 20"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Car silhouette */}
      <rect x="16" y="28" width="24" height="10" rx="3.5" fill="white" opacity="0.92" />
      <rect x="20" y="22" width="16" height="9" rx="3" fill="white" opacity="0.75" />
      {/* Wheels */}
      <circle cx="20" cy="38" r="3.5" fill="rgba(255,255,255,0.45)" />
      <circle cx="36" cy="38" r="3.5" fill="rgba(255,255,255,0.45)" />
      {/* People inside */}
      <circle cx="25" cy="26" r="2" fill="#0F766E" />
      <circle cx="30" cy="26" r="2" fill="#0F766E" />
      <circle cx="35" cy="26" r="2" fill="#0F766E" />
      {/* Checkmark / trust star */}
      <path
        d="M43 9 L44.2 12.5 L48 12.5 L45 14.7 L46.2 18.2 L43 16 L39.8 18.2 L41 14.7 L38 12.5 L41.8 12.5 Z"
        fill="rgba(255,255,255,0.85)"
      />
    </svg>
  );
}
