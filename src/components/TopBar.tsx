'use client';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  back?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  transparent?: boolean;
}

export default function TopBar({
  title,
  subtitle,
  back = false,
  onBack,
  right,
  transparent = false,
}: TopBarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return (
    <div
      className={`flex items-center justify-between px-4 pt-12 pb-3 ${
        transparent ? 'bg-transparent' : 'bg-background'
      }`}
    >
      {/* Left */}
      <div className="flex items-center gap-3 flex-1">
        {back && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center -ml-1"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" strokeWidth={2.5} />
          </motion.button>
        )}
        {(title || subtitle) && (
          <div>
            {title && (
              <h1 className="text-base font-bold text-foreground leading-tight">{title}</h1>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground leading-tight">{subtitle}</p>
            )}
          </div>
        )}
      </div>

      {/* Right slot */}
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}
