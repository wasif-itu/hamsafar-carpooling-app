'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Upload, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import PrimaryButton from '@/components/PrimaryButton';

export default function CNICUploadPage() {
  const router = useRouter();
  const { setOnboardingStep } = useStore();

  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: 'front' | 'back'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (side === 'front') setFrontImage(base64);
        else setBackImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = async () => {
    if (!frontImage || !backImage) return;

    setLoading(true);
    // Simulate verification check
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setOnboardingStep('verify-pending');
    router.push('/onboarding/verification/pending');
  };

  const isComplete = frontImage && backImage;

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
        <h1 className="text-2xl font-extrabold text-white">Upload CNIC</h1>
        <p className="text-white/65 text-sm mt-1">Front and back sides required</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32">
        {/* Guidance */}
        <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-xs text-blue-700 font-medium">
            ✓ Make sure the CNIC is clear and all text is visible<br />
            ✓ Upload photos in good lighting<br />
            ✓ Face should be fully visible in selfie verification later
          </p>
        </div>

        {/* Front Side */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 mb-3">Front side</label>
          <div
            onClick={() => frontInputRef.current?.click()}
            className="relative border-2 border-dashed border-border rounded-2xl p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-200 bg-slate-50"
          >
            {frontImage ? (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <img src={frontImage} alt="CNIC Front" className="w-full h-48 object-cover rounded-xl" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-2 right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>
            ) : (
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-block mb-2"
                >
                  <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                </motion.div>
                <p className="text-sm font-medium text-slate-700">Upload or take a photo</p>
                <p className="text-xs text-slate-500 mt-1">Front side of CNIC</p>
              </div>
            )}
            <input
              ref={frontInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'front')}
              className="hidden"
            />
          </div>
        </div>

        {/* Back Side */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 mb-3">Back side</label>
          <div
            onClick={() => backInputRef.current?.click()}
            className="relative border-2 border-dashed border-border rounded-2xl p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-200 bg-slate-50"
          >
            {backImage ? (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <img src={backImage} alt="CNIC Back" className="w-full h-48 object-cover rounded-xl" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-2 right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>
            ) : (
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-block mb-2"
                >
                  <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                </motion.div>
                <p className="text-sm font-medium text-slate-700">Upload or take a photo</p>
                <p className="text-xs text-slate-500 mt-1">Back side of CNIC</p>
              </div>
            )}
            <input
              ref={backInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'back')}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 pb-6">
        <PrimaryButton
          onClick={handleContinue}
          disabled={!isComplete}
          loading={loading}
        >
          {loading ? 'Verifying…' : 'Continue'}
        </PrimaryButton>
      </div>
    </div>
  );
}
