'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Bell, CheckCheck } from 'lucide-react';
import { useStore } from '@/lib/store';
import BottomNav from '@/components/BottomNav';

const TYPE_STYLE: Record<string, { bg: string; dot: string }> = {
  request_received: { bg: 'bg-blue-50',    dot: 'bg-blue-500' },
  request_accepted: { bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  request_declined: { bg: 'bg-red-50',     dot: 'bg-red-500' },
  ride_reminder:    { bg: 'bg-amber-50',   dot: 'bg-amber-500' },
  system:           { bg: 'bg-slate-50',   dot: 'bg-slate-400' },
};

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

export default function NotificationsPage() {
  const router = useRouter();
  const notifs = useStore((s) => s.notifications);
  const markRead = useStore((s) => s.markRead);
  const markAllRead = useStore((s) => s.markAllRead);
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="screen bg-background flex flex-col">
      <div
        className="px-5 pt-14 pb-5 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <div className="flex items-center justify-between mb-1">
          <button onClick={() => router.back()} className="text-white/70">
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          {unread > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-white/80 text-xs font-semibold">
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-3">Notifications</h1>
        {unread > 0 && <p className="text-white/65 text-sm mt-1">{unread} unread</p>}
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-7 h-7 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700">All caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifs.map((n, i) => {
              const style = TYPE_STYLE[n.type] ?? TYPE_STYLE.system;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-3 px-5 py-4 cursor-pointer ${!n.read ? style.bg : 'bg-white'}`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? style.dot : 'bg-slate-200'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
