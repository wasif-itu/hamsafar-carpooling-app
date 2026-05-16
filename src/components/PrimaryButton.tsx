'use client';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
  type?: 'button' | 'submit';
  className?: string;
  icon?: React.ReactNode;
}

export default function PrimaryButton({
  children,
  onClick,
  loading = false,
  disabled = false,
  variant = 'primary',
  type = 'button',
  className = '',
  icon,
}: PrimaryButtonProps) {
  const cls =
    variant === 'primary' ? 'btn-primary' :
    variant === 'outline'  ? 'btn-outline'  :
    'btn-ghost';

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${cls} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}
