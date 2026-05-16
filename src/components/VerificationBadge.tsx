import { BadgeCheck, GraduationCap, Briefcase } from 'lucide-react';
import type { Verification } from '@/lib/types';

interface Props {
  verification: Verification;
  showLabel?: boolean;
}

export default function VerificationBadge({ verification, showLabel = false }: Props) {
  if (verification.status !== 'verified') return null;

  const config = {
    cnic: {
      cls: 'badge-cnic',
      icon: <BadgeCheck className="w-3 h-3" />,
      label: 'CNIC',
    },
    university: {
      cls: 'badge-university',
      icon: <GraduationCap className="w-3 h-3" />,
      label: verification.institution ?? 'Uni',
    },
    workplace: {
      cls: 'badge-workplace',
      icon: <Briefcase className="w-3 h-3" />,
      label: verification.institution ?? 'Work',
    },
  }[verification.type];

  return (
    <span className={config.cls}>
      {config.icon}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

// Render all verified badges for a user
interface UserBadgesProps {
  verifications: Verification[];
  showLabels?: boolean;
}

export function UserBadges({ verifications, showLabels }: UserBadgesProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {verifications.map((v) => (
        <VerificationBadge key={v.type} verification={v} showLabel={showLabels} />
      ))}
    </div>
  );
}
