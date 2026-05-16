'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, GraduationCap, MapPin, Car, ChevronRight } from 'lucide-react';

const CONTEXTS = [
  {
    id: 'campus',
    label: 'Campus',
    desc: 'Rides to/from universities and colleges',
    icon: GraduationCap,
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    examples: 'DHA → LUMS, Gulberg → Kinnaird',
  },
  {
    id: 'city',
    label: 'City',
    desc: 'Commutes within your city',
    icon: MapPin,
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    examples: 'Johar Town → MM Alam, Clifton → Karachi Central',
  },
  {
    id: 'intercity',
    label: 'Intercity',
    desc: 'Long-distance travel between cities',
    icon: Car,
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    examples: 'Lahore → Islamabad, Karachi → Hyderabad',
  },
] as const;

export default function OfferContextPage() {
  const router = useRouter();

  return (
    <div className="screen bg-background flex flex-col">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-8 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <button onClick={() => router.back()} className="mb-5 text-white/70">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <p className="text-white/70 text-sm mb-1">Step 1 of 5</p>
        <h1 className="text-2xl font-extrabold text-white">Offer a ride</h1>
        <p className="text-white/65 text-sm mt-1">What kind of ride are you offering?</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-8 space-y-4">
        {CONTEXTS.map(({ id, label, desc, icon: Icon, bg, border, iconBg, iconColor, examples }) => (
          <motion.button
            key={id}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/offer/route?context=${id}`)}
            className={`w-full p-4 rounded-2xl border ${bg} ${border} flex items-center gap-4 text-left`}
          >
            <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900">{label}</p>
              <p className="text-xs text-slate-600 mt-0.5">{desc}</p>
              <p className="text-[11px] text-slate-400 mt-1">e.g., {examples}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
          </motion.button>
        ))}

        <div className="pt-4 p-4 bg-teal-50 rounded-2xl border border-teal-100">
          <p className="text-xs text-teal-700 font-medium">
            🚗 <span className="font-bold">Earn while commuting.</span> You set the price and passengers share the cost.
            No extra taxes or deductions — you keep everything.
          </p>
        </div>
      </div>
    </div>
  );
}
