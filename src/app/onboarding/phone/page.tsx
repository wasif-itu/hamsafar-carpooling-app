'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronDown, ArrowRight } from 'lucide-react';
import { USERS } from '@/lib/mockData';
import PrimaryButton from '@/components/PrimaryButton';

export default function PhonePage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (phone.replace(/\D/g, '').length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(`/onboarding/otp?phone=${encodeURIComponent(phone)}`);
    }, 900);
  };

  const fillDemo = (phone: string) => {
    setPhone(phone.replace('+92', ''));
  };

  return (
    <div className="screen bg-background flex flex-col">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-8 relative"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <button onClick={() => router.back()} className="mb-5 text-white/70 active:text-white">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-white/70 text-sm mb-1">Step 1 of 2</p>
          <h1 className="text-2xl font-extrabold text-white">Enter your number</h1>
          <p className="text-white/65 text-sm mt-1 leading-relaxed">
            We&apos;ll send a 6-digit OTP to verify your identity.
          </p>
        </motion.div>
      </div>

      {/* Wave */}
      <div className="relative -mt-px flex-shrink-0">
        <svg viewBox="0 0 390 32" className="w-full block">
          <path d="M0 0 Q97.5 32 195 16 Q292.5 0 390 24 L390 0 Z" fill="#0F766E" />
          <path d="M0 8 Q97.5 36 195 20 Q292.5 4 390 28 L390 32 L0 32 Z" fill="#FAFAF9" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 px-5 pt-4 pb-8 flex flex-col"
      >
        {/* Phone input */}
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
          Mobile Number
        </label>
        <div className="flex gap-2 mb-6">
          <div className="flex items-center gap-1.5 px-3 bg-white border border-border rounded-xl h-[52px] min-w-[80px]">
            <span className="text-lg">🇵🇰</span>
            <span className="text-sm font-semibold text-slate-700">+92</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="3XX XXX XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="input-field flex-1 font-semibold tracking-widest text-base"
            autoFocus
          />
        </div>

        {/* Demo persona quick-fill */}
        <div className="mb-8">
          <p className="text-xs text-slate-400 font-medium mb-2.5">
            Demo personas — tap to fill:
          </p>
          <div className="flex flex-wrap gap-2">
            {USERS.slice(0, 4).map((u) => (
              <button
                key={u.id}
                onClick={() => fillDemo(u.phone)}
                className="flex items-center gap-2 px-3 py-2 bg-teal-50 rounded-full text-xs font-semibold text-teal-700 border border-teal-200 active:scale-95 transition-all"
              >
                <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full" />
                {u.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <PrimaryButton
            onClick={handleContinue}
            loading={loading}
            disabled={phone.replace(/\D/g, '').length < 10}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Send OTP
          </PrimaryButton>

          <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
            By continuing you agree to our{' '}
            <span className="text-primary font-medium">Terms of Service</span>
            {' '}and{' '}
            <span className="text-primary font-medium">Privacy Policy</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
