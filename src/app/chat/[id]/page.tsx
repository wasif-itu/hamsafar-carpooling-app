'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, MapPin, Paperclip, Phone } from 'lucide-react';
import { useStore } from '@/lib/store';

const QUICK_REPLIES = ['On my way', "I'm here", 'Running 5 mins late', 'Please wait', 'See you tomorrow'];

export default function ChatThreadPage() {
  const router = useRouter();
  const params = useParams();
  const currentUser = useStore((s) => s.user);
  const threads = useStore((s) => s.threads);

  const thread = threads.find((t) => t.id === params.id);
  const other = thread?.participants.find((p) => p.id !== currentUser?.id) ?? thread?.participants[0];

  const [msgs, setMsgs] = useState(thread?.messages ?? []);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        senderId: currentUser?.id ?? 'u1',
        text: text.trim(),
        timestamp: new Date().toISOString(),
        read: false,
        type: 'text' as const,
      },
    ]);
    setInput('');
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true });

  if (!thread || !other) {
    return (
      <div className="screen flex items-center justify-center">
        <p className="text-slate-400 text-sm">Thread not found</p>
      </div>
    );
  }

  return (
    <div className="screen bg-background flex flex-col">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-4 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-white/70 flex-shrink-0">
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <img
            src={other.avatar}
            alt={other.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-white/30 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm">{other.name.split(' ')[0]} {other.name.split(' ')[1]?.[0]}.</p>
            <p className="text-white/60 text-xs">⭐ {other.rating} · {other.totalRides} rides</p>
          </div>
          <button className="w-8 h-8 bg-white/15 rounded-full flex items-center justify-center">
            <Phone className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {msgs.map((msg) => {
          const isMe = msg.senderId === currentUser?.id;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}
            >
              {!isMe && (
                <img src={other.avatar} alt={other.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1" />
              )}
              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-white border border-border text-slate-800 rounded-bl-md shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <p className="text-[10px] text-slate-400 px-1">{formatTime(msg.timestamp)}</p>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
        {QUICK_REPLIES.map((qr) => (
          <button
            key={qr}
            onClick={() => send(qr)}
            className="px-3 py-1.5 bg-white border border-border rounded-full text-xs font-medium text-slate-700 whitespace-nowrap hover:bg-slate-50 hover:border-primary hover:text-primary transition-colors flex-shrink-0"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-6 pt-2 flex items-center gap-2 bg-white border-t border-border flex-shrink-0">
        <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Paperclip className="w-4 h-4 text-slate-500" />
        </button>
        <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-4 h-4 text-slate-500" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(input)}
          placeholder="Type a message…"
          className="flex-1 bg-slate-50 border border-border rounded-full px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-primary"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => send(input)}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 disabled:opacity-40"
        >
          <Send className="w-4 h-4 text-white" />
        </motion.button>
      </div>
    </div>
  );
}
