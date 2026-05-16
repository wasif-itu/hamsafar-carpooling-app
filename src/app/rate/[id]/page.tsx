'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, CheckCircle2 } from 'lucide-react';
import { useRides } from '@/lib/store';

const TAGS = ['Punctual', 'Polite', 'Safe driving', 'Clean car', 'Quiet ride', 'Good music', 'Helpful', 'Friendly'];

export default function RatePage() {
  const router = useRouter();
  const params = useParams();
  const rides = useRides();

  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const ride = rides.find((r) => r.id === params.id);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!stars) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setDone(true);
  };

  const starDisplay = hovered || stars;
  const label = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][starDisplay] ?? '';

  if (done) {
    return (
      <div className="screen bg-white flex flex-col items-center justify-center px-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-5"
        >
          <CheckCircle2 className="w-10 h-10 text-amber-500" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Rating submitted!</h2>
          <p className="text-slate-500 text-sm mb-8">
            Thank you for your feedback. It helps build trust in the community.
          </p>
          <button onClick={() => router.push('/home')} className="btn-primary" style={{ maxWidth: 280 }}>
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="screen bg-background flex flex-col">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-6 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <button onClick={() => router.back()} className="mb-4 text-white/70">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <h1 className="text-2xl font-extrabold text-white">Rate your ride</h1>
        {ride && (
          <p className="text-white/65 text-sm mt-1">
            {ride.from.label.split(',')[0]} → {ride.to.label.split(',')[0]}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32 space-y-6">
        {/* Driver info */}
        {ride && (
          <div className="flex items-center gap-3">
            <img
              src={ride.driver.avatar}
              alt={ride.driver.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-border"
            />
            <div>
              <p className="font-bold text-slate-900">
                {ride.driver.name.split(' ')[0]} {ride.driver.name.split(' ')[1]?.[0]}.
              </p>
              <p className="text-xs text-slate-500">{ride.date} · {ride.time}</p>
            </div>
          </div>
        )}

        {/* Star rating */}
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700 mb-3">How was your ride?</p>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.button
                key={n}
                whileTap={{ scale: 0.85 }}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setStars(n)}
              >
                <Star
                  className={`w-10 h-10 transition-colors duration-100 ${
                    n <= starDisplay ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
                  }`}
                />
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {starDisplay > 0 && (
              <motion.p
                key={starDisplay}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="text-sm font-semibold text-amber-500"
              >
                {label}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Tags */}
        <div>
          <p className="text-sm font-semibold text-slate-900 mb-3">
            What stood out? <span className="text-slate-400 font-normal">(optional)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <motion.button
                key={tag}
                whileTap={{ scale: 0.94 }}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-2 rounded-full text-xs font-semibold border-2 transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-slate-600 border-border'
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Leave a comment <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell others about your experience…"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-border text-sm text-slate-700 outline-none resize-none focus:border-primary"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="flex-shrink-0 px-5 pb-6 pt-4 bg-white border-t border-border">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!stars || submitting}
          className="btn-primary"
        >
          {submitting ? 'Submitting…' : 'Submit rating'}
        </motion.button>
      </div>
    </div>
  );
}
