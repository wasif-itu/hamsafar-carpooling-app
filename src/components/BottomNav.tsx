'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Navigation, MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';

const NAV = [
  { href: '/home',     icon: Home,          label: 'Home' },
  { href: '/find',     icon: Search,        label: 'Find' },
  { href: '/track',    icon: Navigation,    label: 'Track' },
  { href: '/chat',     icon: MessageSquare, label: 'Inbox' },
  { href: '/profile',  icon: User,          label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const threads = useStore((s) => s.threads);
  const chatUnread = threads.reduce(
    (acc, t) => acc + t.messages.filter((m) => !m.read && m.senderId !== 'u1').length,
    0
  );

  const badges: Record<string, number> = {
    '/chat': chatUnread,
  };

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          const badge = badges[href] ?? 0;

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 min-w-[56px] relative"
            >
              <div className="relative">
                <Icon
                  className="transition-colors duration-200"
                  style={{
                    width: 22,
                    height: 22,
                    color: active ? '#0F766E' : '#94a3b8',
                    strokeWidth: active ? 2.5 : 1.8,
                  }}
                />
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-brand-coral rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>

              <span
                className="text-[10px] font-medium transition-colors duration-200"
                style={{ color: active ? '#0F766E' : '#94a3b8' }}
              >
                {label}
              </span>

              {/* Active indicator dot */}
              {active && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
