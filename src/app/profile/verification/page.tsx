'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Shield, CheckCircle2, Clock, XCircle, Plus, ChevronRight } from 'lucide-react';

const METHOD_INFO: Record<string, { label: string; desc: string; color: string }> = {
  cnic:       { label: 'CNIC',         desc: 'National ID card', color: 'blue' },
  university: { label: 'University ID', desc: 'Student verification', color: 'purple' },
  workplace:  { label: 'Workplace',    desc: 'Office email', color: 'orange' },
  phone:      { label: 'Phone',        desc: 'Mobile number', color: 'green' },
  email:      { label: 'Email',        desc: 'Email address', color: 'teal' },
};

type Status = 'verified' | 'pending' | 'rejected';

interface VerItem {
  method: string;
  status: Status;
  date: string;
}

const MOCK_VERIFICATIONS: VerItem[] = [
  { method: 'phone',  status: 'verified', date: '2024-03-01' },
  { method: 'cnic',   status: 'verified', date: '2024-03-05' },
  { method: 'email',  status: 'pending',  date: '2024-05-10' },
];

const AVAILABLE = ['university', 'workplace'];

function StatusIcon({ status }: { status: Status }) {
  if (status === 'verified') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
  if (status === 'pending')  return <Clock className="w-5 h-5 text-amber-500" />;
  return <XCircle className="w-5 h-5 text-red-500" />;
}

function StatusLabel({ status }: { status: Status }) {
  const map = { verified: 'text-emerald-600 bg-emerald-50', pending: 'text-amber-600 bg-amber-50', rejected: 'text-red-600 bg-red-50' };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${map[status]}`}>{status}</span>
  );
}

export default function VerificationPage() {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [items, setItems] = useState<VerItem[]>(MOCK_VERIFICATIONS);

  const addVerification = (method: string) => {
    if (!items.find((v) => v.method === method)) {
      setItems((prev) => [...prev, { method, status: 'pending', date: new Date().toISOString().split('T')[0] }]);
    }
    setShowAdd(false);
  };

  const remaining = AVAILABLE.filter((m) => !items.find((v) => v.method === m));

  return (
    <div className="screen bg-background flex flex-col relative">
      <div
        className="px-5 pt-14 pb-6 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <button onClick={() => router.back()} className="mb-4 text-white/70">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <h1 className="text-2xl font-extrabold text-white">Verification</h1>
        <p className="text-white/65 text-sm mt-1">Manage your verified identity</p>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${(items.filter((v) => v.status === 'verified').length / 5) * 100}%` }}
            />
          </div>
          <span className="text-white/80 text-xs font-medium">
            {items.filter((v) => v.status === 'verified').length}/5 verified
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 px-4 pt-4 space-y-3">
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {items.map((item, i) => {
            const info = METHOD_INFO[item.method];
            return (
              <div key={item.method} className={`flex items-center gap-3 px-4 py-3.5 ${i < items.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{info?.label ?? item.method}</p>
                  <p className="text-xs text-slate-400">{info?.desc ?? ''} · {item.date}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusIcon status={item.status} />
                  <StatusLabel status={item.status} />
                </div>
              </div>
            );
          })}
        </div>

        {remaining.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAdd(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-primary/30 text-primary font-semibold text-sm bg-primary/5"
          >
            <Plus className="w-4 h-4" />
            Add verification
          </motion.button>
        )}

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-sm font-bold text-blue-900 mb-1">Why verify?</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Verified users get priority in ride requests, access to female-only rides, and build trust with the community.
          </p>
        </div>
      </div>

      {/* Add sheet */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black z-40"
              onClick={() => setShowAdd(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 pb-8"
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-5" />
              <p className="text-base font-bold text-slate-900 px-5 mb-4">Add verification</p>
              {remaining.map((method) => {
                const info = METHOD_INFO[method];
                return (
                  <button
                    key={method}
                    onClick={() => addVerification(method)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 active:bg-slate-100 border-b border-border"
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-slate-900">{info?.label}</p>
                      <p className="text-xs text-slate-400">{info?.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


