'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { USERS } from '@/lib/mockData';
import { useStore } from '@/lib/store';
import PrimaryButton from '@/components/PrimaryButton';

function OTPContent() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get('phone') ?? '';
  const { login } = useStore();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(30);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleInput = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    setError('');
    if (val && i < 5) refs.current[i + 1]?.focus();
    if (next.every(Boolean)) verify(next.join(''));
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const verify = (code: string) => {
    if (code !== '123456') {
      setError('Incorrect OTP. Use 123456 for this demo.');
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => refs.current[0]?.focus(), 50);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      const fullPhone = '+92' + phone;
      const user = USERS.find((u) => u.phone === fullPhone) ?? USERS[0];
      login(user);
      setTimeout(() => router.push('/onboarding/profile'), 800);
    }, 1000);
  };

  const filled = otp.join('');

  if (success) {
    return (
      <div className="screen bg-background flex flex-col items-center justify-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <CheckCircle2 className="w-20 h-20 text-primary" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-2xl font-extrabold text-slate-900">Verified!</h2>
          <p className="text-slate-500 text-sm mt-1">Signing you in…</p>
        </motion.div>
      </div>
    );
  }

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
        <p className="text-white/70 text-sm mb-1">Step 2 of 2</p>
        <h1 className="text-2xl font-extrabold text-white">Verify your number</h1>
        <p className="text-white/65 text-sm mt-1">
          OTP sent to <span className="font-semibold text-white/90">+92 {phone}</span>
        </p>
      </div>

      <div className="relative -mt-px flex-shrink-0">
        <svg viewBox="0 0 390 32" className="w-full block">
          <path d="M0 0 Q97.5 32 195 16 Q292.5 0 390 24 L390 0 Z" fill="#0F766E" />
          <path d="M0 8 Q97.5 36 195 20 Q292.5 4 390 28 L390 32 L0 32 Z" fill="#FAFAF9" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex-1 px-5 pt-6 pb-8 flex flex-col"
      >
        {/* OTP boxes */}
        <div className="flex justify-center gap-2.5 mb-3">
          {otp.map((d, i) => (
            <motion.input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`otp-box ${d ? 'filled' : ''}`}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              style={error ? { borderColor: '#DC2626', backgroundColor: '#fef2f2' } : undefined}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {/* Demo hint */}
        <p className="text-center text-xs text-slate-400 mb-1">
          Demo OTP:{' '}
          <button
            className="font-bold text-primary tracking-widest"
            onClick={() => {
              setOtp(['1','2','3','4','5','6']);
              verify('123456');
            }}
          >
            1 2 3 4 5 6
          </button>
        </p>

        {/* Error */}
        <AnimError message={error} />

        <div className="mt-6">
          <PrimaryButton
            onClick={() => verify(filled)}
            loading={loading}
            disabled={filled.length < 6}
          >
            Verify & Continue
          </PrimaryButton>
        </div>

        {/* Resend */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          {timer > 0 ? (
            <p className="text-sm text-slate-400">
              Resend in{' '}
              <span className="font-semibold text-slate-600">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={() => setTimer(30)}
              className="text-sm text-primary font-semibold"
            >
              Resend OTP
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function AnimError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center text-sm text-red-500 font-medium mt-1"
    >
      {message}
    </motion.p>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={
      <div className="screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      </div>
    }>
      <OTPContent />
    </Suspense>
  );
}
