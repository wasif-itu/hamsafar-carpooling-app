'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import BottomNav from '@/components/BottomNav';

function timeSince(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

export default function ChatPage() {
  const threads = useStore((s) => s.threads);
  const currentUser = useStore((s) => s.user);

  return (
    <div className="screen bg-background flex flex-col">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-5 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <h1 className="text-2xl font-extrabold text-white">Inbox</h1>
        <p className="text-white/65 text-sm mt-1">Messages with drivers & passengers</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-7 h-7 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700 mb-1">No conversations yet</p>
            <p className="text-sm text-slate-400">Messages with your drivers will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {threads.map((thread, i) => {
              const other = thread.participants.find((p) => p.id !== currentUser?.id) ?? thread.participants[0];
              const last = thread.messages[thread.messages.length - 1];
              const unread = thread.messages.filter((m) => !m.read && m.senderId !== currentUser?.id).length;

              return (
                <Link key={thread.id} href={`/chat/${thread.id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={other.avatar}
                        alt={other.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {unread > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                          {unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-sm ${unread > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                          {other.name.split(' ')[0]} {other.name.split(' ')[1]?.[0]}.
                        </p>
                        <p className="text-xs text-slate-400 flex-shrink-0 ml-2">
                          {timeSince(thread.updatedAt)}
                        </p>
                      </div>
                      <p className={`text-xs truncate ${unread > 0 ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                        {last?.senderId === currentUser?.id ? 'You: ' : ''}{last?.text ?? 'No messages yet'}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
