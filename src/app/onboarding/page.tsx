'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Calculator, MapPin } from 'lucide-react';
import { useStore } from '@/lib/store';
import PrimaryButton from '@/components/PrimaryButton';

// ─── Slide definitions ──────────────────────────────────────────────────────

const SLIDES = [
  {
    id: 0,
    icon: Shield,
    iconColor: '#0F766E',
    bgFrom: '#f0fdfa',
    bgTo:   '#ccfbf1',
    accentDot: '#14B8A6',
    illustration: <TrustIllustration />,
    headline: 'Verified Peers\nOnly',
    subheading:
      'Every rider is verified with CNIC, university email, or workplace ID — so you always know exactly who you\'re riding with.',
    cta: 'Next',
  },
  {
    id: 1,
    icon: Calculator,
    iconColor: '#0F766E',
    bgFrom: '#fefce8',
    bgTo:   '#fef9c3',
    accentDot: '#F59E0B',
    illustration: <SavingsIllustration />,
    headline: 'Split Costs\nTransparently',
    subheading:
      'See exactly how the fare is calculated. Share fuel costs fairly, save up to ₨ 40,000 a month, and track every rupee you save.',
    cta: 'Next',
  },
  {
    id: 2,
    icon: MapPin,
    iconColor: '#0F766E',
    bgFrom: '#fdf2f8',
    bgTo:   '#fce7f3',
    accentDot: '#EC4899',
    illustration: <SafetyIllustration />,
    headline: 'Safety Built\nIn',
    subheading:
      'Live ride tracking, one-tap SOS alerts, trusted contact sharing, and gender-preference filters — safety is never an afterthought.',
    cta: 'Get Started',
  },
];

// ─── Onboarding Page ─────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const router = useRouter();
  const { setOnboardingDone } = useStore();
  const goTo = (idx: number) => {
    setDir(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const handleNext = () => {
    if (current < SLIDES.length - 1) {
      goTo(current + 1);
    } else {
      setOnboardingDone();
      router.push('/onboarding/phone');
    }
  };

  const handleSkip = () => {
    setOnboardingDone();
    router.push('/onboarding/phone');
  };

  const slide = SLIDES[current];

  return (
    <div className="screen bg-background flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end px-5 pt-14 pb-2 flex-shrink-0">
        {current < SLIDES.length - 1 && (
          <button
            onClick={handleSkip}
            className="text-sm font-medium text-slate-400 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Illustration area */}
      <div className="px-5 flex-shrink-0">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl overflow-hidden relative"
          style={{
            height: 280,
            background: `linear-gradient(135deg, ${slide.bgFrom} 0%, ${slide.bgTo} 100%)`,
          }}
        >
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={current}
              custom={dir}
              variants={{
                enter:  (d: number) => ({ x: d * 60, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit:   (d: number) => ({ x: -d * 60, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="w-full h-full flex items-center justify-center"
            >
              {slide.illustration}
            </motion.div>
          </AnimatePresence>

          {/* Slide number pill */}
          <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-xs font-semibold text-slate-600">
              {current + 1} / {SLIDES.length}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mt-5 flex-shrink-0">
        {SLIDES.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            animate={{
              width: i === current ? 28 : 8,
              backgroundColor: i === current ? slide.accentDot : '#cbd5e1',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="h-2 rounded-full"
            style={{ minWidth: 8 }}
          />
        ))}
      </div>

      {/* Text content */}
      <div className="flex-1 px-6 pt-5 pb-2 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <h2
              className="text-3xl font-extrabold text-slate-900 leading-tight mb-3"
              style={{ whiteSpace: 'pre-line' }}
            >
              {slide.headline}
            </h2>
            <p className="text-slate-500 text-[15px] leading-relaxed">
              {slide.subheading}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="px-5 pb-10 flex-shrink-0">
        <PrimaryButton onClick={handleNext} icon={<ArrowRight className="w-5 h-5" />}>
          {slide.cta}
        </PrimaryButton>
      </div>
    </div>
  );
}

// ─── Illustrations ────────────────────────────────────────────────────────────

function TrustIllustration() {
  const people = [
    { x: 70,  y: 100, label: 'CNIC ✓',    color: '#0F766E', delay: 0.1 },
    { x: 170, y: 60,  label: 'LUMS ✓',    color: '#14B8A6', delay: 0.2 },
    { x: 270, y: 90,  label: 'Work ✓',    color: '#2563EB', delay: 0.3 },
  ];

  return (
    <svg width="340" height="260" viewBox="0 0 340 260">
      {/* Road */}
      <path
        d="M0 200 Q85 150 170 145 Q255 140 340 170"
        stroke="#a7f3d0"
        strokeWidth="36"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M0 200 Q85 150 170 145 Q255 140 340 170"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="10 8"
        fill="none"
        opacity="0.8"
      />

      {/* Car */}
      <g transform="translate(138, 124)">
        <rect x="0" y="10" width="64" height="20" rx="7" fill="#0F766E" />
        <rect x="7" y="2" width="50" height="14" rx="5" fill="#14B8A6" />
        <circle cx="13" cy="31" r="6" fill="#134E4A" />
        <circle cx="51" cy="31" r="6" fill="#134E4A" />
        <rect x="11" y="4" width="16" height="8" rx="2" fill="#a7f3d0" opacity="0.7" />
        <rect x="37" y="4" width="16" height="8" rx="2" fill="#a7f3d0" opacity="0.7" />
        {/* People heads */}
        <circle cx="20" cy="8" r="4" fill="white" opacity="0.9" />
        <circle cx="32" cy="8" r="4" fill="white" opacity="0.9" />
        <circle cx="44" cy="8" r="4" fill="white" opacity="0.9" />
      </g>

      {/* Verification cards */}
      {people.map((p, i) => (
        <motion.g
          key={i}
          transform={`translate(${p.x - 42}, ${p.y - 28})`}
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: p.delay, type: 'spring', stiffness: 200 }}
        >
          <rect
            width="84"
            height="38"
            rx="12"
            fill="white"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}
          />
          <rect x="0" y="0" width="84" height="38" rx="12" fill={p.color} opacity="0.08" />
          {/* Avatar circle */}
          <circle cx="20" cy="19" r="12" fill={p.color} opacity="0.15" />
          <circle cx="20" cy="15" r="4" fill={p.color} opacity="0.6" />
          <path d="M14 27 Q14 22 20 22 Q26 22 26 27" fill={p.color} opacity="0.6" />
          {/* Label */}
          <text x="38" y="16" fontSize="9.5" fontWeight="700" fill={p.color}>{p.label.split(' ')[0]}</text>
          <text x="38" y="28" fontSize="8" fill="#64748b">{p.label.split(' ')[1]}</text>
          {/* Green check dot */}
          <circle cx="72" cy="10" r="7" fill="#10B981" />
          <path d="M68.5 10 L71 12.5 L75.5 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </motion.g>
      ))}
    </svg>
  );
}

function SavingsIllustration() {
  const bars = [
    { h: 50,  m: 'N',  pkr: 3200 },
    { h: 38,  m: 'D',  pkr: 2400 },
    { h: 62,  m: 'J',  pkr: 4100 },
    { h: 58,  m: 'F',  pkr: 3800 },
    { h: 72,  m: 'M',  pkr: 4600 },
    { h: 88,  m: 'Ap', pkr: 5200 },
  ];

  return (
    <svg width="340" height="260" viewBox="0 0 340 260">
      {/* Savings card */}
      <rect x="20" y="16" width="300" height="88" rx="16" fill="#0F766E" />
      <text x="38" y="44" fontSize="11" fill="rgba(255,255,255,0.7)" fontWeight="500">Total Saved This Month</text>
      <text x="38" y="74" fontSize="26" fontWeight="800" fill="white">₨ 5,200</text>
      <text x="38" y="92" fontSize="10" fill="#6ee7b7">↑ 13% from last month</text>

      {/* Coin stack */}
      <ellipse cx="290" cy="72" rx="18" ry="6" fill="rgba(255,255,255,0.15)" />
      <ellipse cx="290" cy="64" rx="18" ry="6" fill="rgba(255,255,255,0.20)" />
      <ellipse cx="290" cy="56" rx="18" ry="6" fill="rgba(255,255,255,0.28)" />
      <text x="282" y="60" fontSize="12">₨</text>

      {/* Bar chart */}
      <text x="20" y="126" fontSize="10" fill="#475569" fontWeight="600">Monthly Savings (PKR)</text>
      {bars.map((b, i) => {
        const x = 20 + i * 50;
        const maxH = 88;
        const scaledH = (b.h / 100) * maxH;
        const y = 220 - scaledH;
        return (
          <g key={i}>
            <motion.rect
              x={x} width={38} rx={7}
              fill={i === bars.length - 1 ? '#0F766E' : '#99f6e4'}
              initial={{ height: 0, y: 220 }}
              animate={{ height: scaledH, y }}
              transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 160, damping: 20 }}
            />
            <text x={x + 19} y={234} fontSize="9" textAnchor="middle" fill="#94a3b8">{b.m}</text>
          </g>
        );
      })}

      {/* CO2 mini badge */}
      <rect x="225" y="130" width="115" height="62" rx="12" fill="#dcfce7" />
      <text x="282" y="152" fontSize="10" textAnchor="middle" fill="#166534" fontWeight="600">CO₂ Saved</text>
      <text x="282" y="178" fontSize="20" textAnchor="middle" fontWeight="800" fill="#15803d">72 kg</text>
    </svg>
  );
}

function SafetyIllustration() {
  return (
    <svg width="340" height="260" viewBox="0 0 340 260">
      {/* Shield */}
      <motion.path
        d="M170 18 L230 44 L230 130 Q230 192 170 218 Q110 192 110 130 L110 44 Z"
        fill="#EC4899"
        opacity="0.08"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.08 }}
        style={{ transformOrigin: '170px 118px' }}
        transition={{ delay: 0.1 }}
      />
      <motion.path
        d="M170 26 L224 49 L224 128 Q224 184 170 208 Q116 184 116 128 L116 49 Z"
        fill="none"
        stroke="#EC4899"
        strokeWidth="2.5"
        opacity="0.55"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 0.9, ease: 'easeOut' }}
      />

      {/* Check */}
      <motion.path
        d="M148 118 L163 133 L196 100"
        stroke="#EC4899"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.9, duration: 0.45 }}
      />

      {/* Feature pills around the shield */}
      {[
        { x: 14,  y: 52,  emoji: '🪪', label: 'CNIC Verified' },
        { x: 236, y: 52,  emoji: '📍', label: 'Live Tracking' },
        { x: 14,  y: 176, emoji: '🆘', label: 'SOS Alert' },
        { x: 236, y: 176, emoji: '🛡️', label: 'Women Safe' },
      ].map((p, i) => (
        <motion.g
          key={i}
          transform={`translate(${p.x}, ${p.y})`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 + i * 0.12, type: 'spring', stiffness: 220 }}
        >
          <rect
            width="94"
            height="40"
            rx="12"
            fill="white"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.09))' }}
          />
          <text x="10" y="26" fontSize="16">{p.emoji}</text>
          <text x="34" y="24" fontSize="9.5" fontWeight="600" fill="#334155">{p.label}</text>
        </motion.g>
      ))}

      {/* Pulse ring on SOS */}
      <motion.circle
        cx="57"
        cy="197"
        r="10"
        fill="none"
        stroke="#DC2626"
        strokeWidth="1.5"
        opacity="0.5"
        animate={{ r: [10, 18], opacity: [0.5, 0] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />

      {/* Location pin */}
      <motion.g
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="170" cy="240" rx="8" ry="3" fill="#0F766E" opacity="0.2" />
        <path
          d="M170 228 C170 228 158 216 158 208 A12 12 0 0 1 182 208 C182 216 170 228 170 228Z"
          fill="#0F766E"
        />
        <circle cx="170" cy="207" r="5" fill="white" />
      </motion.g>
    </svg>
  );
}
