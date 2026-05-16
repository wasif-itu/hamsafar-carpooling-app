'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, FileText, Mail, Briefcase, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import PrimaryButton from '@/components/PrimaryButton';

const METHODS = [
  {
    key: 'cnic',
    name: 'CNIC',
    description: 'National ID card',
    icon: FileText,
    unlocks: ['Verified badge', 'Ride history visible', 'Full features unlocked'],
    color: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-700',
  },
  {
    key: 'university',
    name: 'University Email',
    description: 'Educational institution',
    icon: Mail,
    unlocks: ['Campus ride filters', 'Student community', 'Special discounts'],
    color: 'bg-teal-50 border-teal-200',
    textColor: 'text-teal-700',
  },
  {
    key: 'workplace',
    name: 'Workplace Email',
    description: 'Corporate email',
    icon: Briefcase,
    unlocks: ['Verified badge', 'Workplace network', 'B2B ride benefits'],
    color: 'bg-indigo-50 border-indigo-200',
    textColor: 'text-indigo-700',
  },
];

export default function VerificationMethodPage() {
  const router = useRouter();
  const { setVerificationMethod, setOnboardingStep } = useStore();
  const [selected, setSelected] = useState<'cnic' | 'university' | 'workplace' | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    setVerificationMethod(selected);
    setOnboardingStep(
      selected === 'cnic'
        ? 'verify-cnic'
        : selected === 'university'
          ? 'verify-email'
          : 'verify-email'
    );

    const paths: Record<typeof selected, string> = {
      cnic: '/onboarding/verification/cnic',
      university: '/onboarding/verification/email',
      workplace: '/onboarding/verification/email',
    };
    router.push(paths[selected]);
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
        <p className="text-white/70 text-sm mb-1">Step 4 of 7</p>
        <h1 className="text-2xl font-extrabold text-white">Verify your identity</h1>
        <p className="text-white/65 text-sm mt-1">Choose a verification method to continue</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32 space-y-4">
        {METHODS.map(({ key, name, description, icon: Icon, unlocks, color, textColor }) => (
          <motion.button
            key={key}
            onClick={() => setSelected(key as typeof selected)}
            whileTap={{ scale: 0.98 }}
            className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
              selected === key
                ? 'bg-white border-primary shadow-md'
                : `${color} border-current ${textColor}`
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-lg flex-shrink-0 ${selected === key ? 'bg-primary' : `bg-${key === 'cnic' ? 'blue' : key === 'university' ? 'teal' : 'indigo'}-100`}`}>
                <Icon
                  className="w-5 h-5"
                  color={
                    selected === key
                      ? 'white'
                      : key === 'cnic'
                        ? '#1E40AF'
                        : key === 'university'
                          ? '#0F766E'
                          : '#4338CA'
                  }
                />
              </div>

              <div className="flex-1">
                <h3 className={`font-bold text-sm ${selected === key ? 'text-slate-900' : ''}`}>
                  {name}
                </h3>
                <p
                  className={`text-xs mt-0.5 ${
                    selected === key ? 'text-slate-500' : 'opacity-75'
                  }`}
                >
                  {description}
                </p>
                <div
                  className={`mt-2.5 space-y-1 ${
                    selected === key ? '' : 'hidden'
                  }`}
                >
                  <p className="text-[11px] font-semibold text-slate-600">Unlocks:</p>
                  {unlocks.map((u) => (
                    <div key={u} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span className="text-xs text-slate-600">{u}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selected === key && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 pb-6">
        <PrimaryButton onClick={handleContinue} disabled={!selected}>
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
}
