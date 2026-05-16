'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Mail } from 'lucide-react';
import { useStore } from '@/lib/store';
import PrimaryButton from '@/components/PrimaryButton';

export default function EmailVerificationPage() {
  const router = useRouter();
  const { verificationMethod, setOnboardingStep } = useStore();

  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCodeSent(true);
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    if (code !== '123456') {
      setError('Incorrect code. Use 123456 for this demo.');
      return;
    }

    setLoading(true);
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setOnboardingStep('verify-pending');
    router.push('/onboarding/verification/pending');
  };

  const label =
    verificationMethod === 'university'
      ? 'University Email'
      : 'Workplace Email';
  const placeholder =
    verificationMethod === 'university'
      ? 'e.g., student@lums.edu.pk'
      : 'e.g., name@company.com';

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
        <p className="text-white/70 text-sm mb-1">Step 5 of 7</p>
        <h1 className="text-2xl font-extrabold text-white">Verify email</h1>
        <p className="text-white/65 text-sm mt-1">We&apos;ll send you a code to confirm</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32">
        {!codeSent ? (
          <>
            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                {label}
              </label>
              <input
                type="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="input-field"
              />
              {error && <p className="text-xs text-destructive mt-1">{error}</p>}
            </div>

            {/* Info box */}
            <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 mb-6">
              <p className="text-xs text-teal-700 font-medium">
                ✓ A 6-digit code will be sent to this email<br />
                ✓ Check your inbox and spam folder
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Verification Code */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4"
              >
                <Mail className="w-8 h-8 text-primary" />
              </motion.div>
              <h2 className="text-xl font-bold text-slate-900">Code sent!</h2>
              <p className="text-sm text-slate-500 mt-1">
                Check your email for the verification code
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Verification code
              </label>
              <input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                maxLength={6}
                className="input-field text-center text-xl tracking-widest font-semibold"
              />
              {error && <p className="text-xs text-destructive mt-1">{error}</p>}
              <p className="text-xs text-slate-500 mt-2">Hint: Use 123456 for demo</p>
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 pb-6">
        <PrimaryButton
          onClick={codeSent ? handleVerifyCode : handleSendCode}
          disabled={codeSent ? code.length < 6 : !email}
          loading={loading}
        >
          {loading ? 'Sending…' : codeSent ? 'Verify code' : 'Send code'}
        </PrimaryButton>
      </div>
    </div>
  );
}
