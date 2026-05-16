'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar } from 'lucide-react';
import { useStore } from '@/lib/store';
import PrimaryButton from '@/components/PrimaryButton';

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi'] as const;

export default function ProfileCreationPage() {
  const router = useRouter();
  const { updateProfileData, setOnboardingStep } = useStore();

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'prefer-not-to-say' | null>(null);
  const [dob, setDob] = useState('');
  const [city, setCity] = useState<'Lahore' | 'Karachi' | 'Islamabad' | 'Rawalpindi' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isComplete = name.trim() && gender && dob && city;

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!gender) newErrors.gender = 'Please select a gender';
    if (!dob) newErrors.dob = 'Date of birth is required';
    if (!city) newErrors.city = 'Please select a city';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateProfileData({ name: name.trim(), gender: gender ?? undefined, dob, city: city ?? undefined });
    setOnboardingStep('verify-method');
    router.push('/onboarding/verification');
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
        <p className="text-white/70 text-sm mb-1">Step 3 of 7</p>
        <h1 className="text-2xl font-extrabold text-white">Create your profile</h1>
        <p className="text-white/65 text-sm mt-1">Let&apos;s get to know you better</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32">
        {/* Name */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 mb-2">Full name</label>
          <input
            type="text"
            placeholder="e.g., Ahmed Hassan"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({ ...errors, name: '' });
            }}
            className="input-field"
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 mb-3">Gender</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'male', label: 'Male' },
              { key: 'female', label: 'Female' },
              { key: 'prefer-not-to-say', label: 'Prefer not to say' },
            ].map(({ key, label }) => (
              <motion.button
                key={key}
                onClick={() => {
                  setGender(key as typeof gender);
                  setErrors({ ...errors, gender: '' });
                }}
                whileTap={{ scale: 0.95 }}
                className={`py-3 px-4 rounded-xl font-medium text-sm transition-all duration-150 border-2 ${
                  gender === key
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-slate-700 border-border hover:border-primary'
                }`}
              >
                {label}
              </motion.button>
            ))}
          </div>
          {errors.gender && <p className="text-xs text-destructive mt-1">{errors.gender}</p>}
        </div>

        {/* Date of Birth */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 mb-2">Date of birth</label>
          <div className="relative">
            <input
              type="date"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setErrors({ ...errors, dob: '' });
              }}
              className="input-field pl-10"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          {errors.dob && <p className="text-xs text-destructive mt-1">{errors.dob}</p>}
        </div>

        {/* City */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 mb-2">City</label>
          <select
            value={city ?? ''}
            onChange={(e) => {
              setCity(e.target.value as typeof city);
              setErrors({ ...errors, city: '' });
            }}
            className="input-field"
          >
            <option value="">Select your city</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 pb-6">
        <PrimaryButton
          onClick={handleContinue}
          disabled={!isComplete}
        >
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
}
