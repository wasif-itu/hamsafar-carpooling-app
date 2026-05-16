'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Calendar, SlidersHorizontal,
  X, Check, Map, List,
  BellPlus,
} from 'lucide-react';
import { useRides } from '@/lib/store';
import RideCard from '@/components/RideCard';
import BottomNav from '@/components/BottomNav';
import { RideCardSkeleton } from '@/components/Skeleton';
import type { Ride } from '@/lib/types';

const LOCATIONS = [
  'DHA Phase 5', 'LUMS', 'Gulberg III', 'Johar Town', 'MM Alam Road',
  'Bahria Town', 'Model Town', 'Liberty Market', 'Ferozepur Road',
  'Arfa Tech Park', 'Packages Mall', 'Emporium Mall',
];

interface Filters {
  femaleOnly: boolean;
  verifiedOnly: boolean;
  minRating: number;
  sameUniversity: boolean;
  maxPrice: number;
  context: 'all' | 'campus' | 'city' | 'intercity';
  timeRange: 'any' | 'morning' | 'afternoon' | 'evening';
}

const DEFAULT_FILTERS: Filters = {
  femaleOnly: false,
  verifiedOnly: false,
  minRating: 0,
  sameUniversity: false,
  maxPrice: 2000,
  context: 'all',
  timeRange: 'any',
};

function FilterPanel({
  filters,
  onChange,
  onClose,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<Filters>(filters);

  const apply = () => {
    onChange(local);
    onClose();
  };
  const reset = () => setLocal(DEFAULT_FILTERS);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto"
    >
      {/* Handle */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 bg-slate-200 rounded-full" />
      </div>

      <div className="px-5 pb-6">
        <div className="flex items-center justify-between py-4 border-b border-border mb-5">
          <h2 className="font-bold text-slate-900 text-lg">Filters</h2>
          <button onClick={reset} className="text-primary text-sm font-semibold">
            Reset all
          </button>
        </div>

        {/* Context */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-900 mb-3">Ride type</p>
          <div className="grid grid-cols-4 gap-2">
            {(['all', 'campus', 'city', 'intercity'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setLocal({ ...local, context: c })}
                className={`py-2 px-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  local.context === c
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="mb-6 space-y-4">
          {[
            { key: 'femaleOnly', label: 'Female-only rides', desc: 'Show rides open to women only' },
            { key: 'verifiedOnly', label: 'Verified drivers', desc: 'CNIC or institution verified' },
            { key: 'sameUniversity', label: 'Same university', desc: 'Rides with your fellow students' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
              <button
                onClick={() => setLocal({ ...local, [key]: !local[key as keyof Filters] })}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  local[key as keyof Filters] ? 'bg-primary' : 'bg-slate-200'
                }`}
              >
                <motion.div
                  animate={{ x: local[key as keyof Filters] ? 24 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                />
              </button>
            </div>
          ))}
        </div>

        {/* Rating */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-900 mb-3">
            Minimum rating: {local.minRating === 0 ? 'Any' : `${local.minRating}★+`}
          </p>
          <div className="flex gap-2">
            {[0, 3, 3.5, 4, 4.5].map((r) => (
              <button
                key={r}
                onClick={() => setLocal({ ...local, minRating: r })}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  local.minRating === r
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {r === 0 ? 'Any' : `${r}★`}
              </button>
            ))}
          </div>
        </div>

        {/* Max price */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-900 mb-3">
            Max price: ₨ {local.maxPrice}
          </p>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={local.maxPrice}
            onChange={(e) => setLocal({ ...local, maxPrice: Number(e.target.value) })}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>₨ 100</span>
            <span>₨ 5,000</span>
          </div>
        </div>

        {/* Departure window */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-slate-900 mb-3">Departure time</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { key: 'any', label: 'Any' },
              { key: 'morning', label: 'Morning' },
              { key: 'afternoon', label: 'Noon' },
              { key: 'evening', label: 'Evening' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setLocal({ ...local, timeRange: key as Filters['timeRange'] })}
                className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all ${
                  local.timeRange === key
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={apply} className="btn-primary">
          Apply filters
        </button>
      </div>
    </motion.div>
  );
}

function MockMapView({ rides }: { rides: Ride[] }) {
  const [selected, setSelected] = useState<Ride | null>(rides[0] ?? null);

  return (
    <div className="flex-1 relative">
      {/* Mock map background */}
      <div className="absolute inset-0 bg-slate-100">
        <svg className="w-full h-full" viewBox="0 0 390 500" preserveAspectRatio="xMidYMid slice">
          <rect width="390" height="500" fill="#E8EFF5" />
          {/* Road grid */}
          <line x1="0" y1="150" x2="390" y2="150" stroke="white" strokeWidth="12" />
          <line x1="0" y1="300" x2="390" y2="300" stroke="white" strokeWidth="8" />
          <line x1="100" y1="0" x2="100" y2="500" stroke="white" strokeWidth="8" />
          <line x1="260" y1="0" x2="260" y2="500" stroke="white" strokeWidth="12" />
          <line x1="0" y1="420" x2="390" y2="420" stroke="white" strokeWidth="8" />
          {/* Blocks */}
          <rect x="110" y="160" width="140" height="130" rx="4" fill="#D8E5EE" />
          <rect x="0" y="160" width="90" height="130" rx="4" fill="#D8E5EE" />
          <rect x="270" y="160" width="120" height="130" rx="4" fill="#D8E5EE" />
          <rect x="110" y="310" width="140" height="100" rx="4" fill="#D8E5EE" />
          {/* Labels */}
          <text x="180" y="230" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">Gulberg</text>
          <text x="45" y="230" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">DHA</text>
          <text x="325" y="230" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">Model Town</text>
        </svg>

        {/* Ride pins */}
        {rides.slice(0, 4).map((ride, i) => (
          <motion.button
            key={ride.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelected(ride)}
            className="absolute flex flex-col items-center"
            style={{
              left: `${20 + i * 22}%`,
              top: `${25 + (i % 2) * 20}%`,
            }}
          >
            <div
              className={`px-2.5 py-1 rounded-xl text-white text-xs font-bold shadow-md transition-all ${
                selected?.id === ride.id ? 'bg-primary scale-110' : 'bg-slate-700'
              }`}
            >
              ₨{ride.pricePKR}
            </div>
            <div
              className={`w-2 h-2 rounded-full mt-0.5 ${selected?.id === ride.id ? 'bg-primary' : 'bg-slate-700'}`}
            />
          </motion.button>
        ))}
      </div>

      {/* Selected ride bottom sheet */}
      {selected && (
        <motion.div
          key={selected.id}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl px-4 pt-3 pb-4"
        >
          <div className="w-8 h-1 bg-slate-200 rounded-full mx-auto mb-3" />
          <RideCard ride={selected} />
        </motion.div>
      )}
    </div>
  );
}

function FindContent() {
  const params = useSearchParams();
  const rides = useRides();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS, context: (params.get('context') as Filters['context']) ?? 'all' });
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [fromFocus, setFromFocus] = useState(false);
  const [toFocus, setToFocus] = useState(false);
  const [notifyRequested, setNotifyRequested] = useState(false);
  const [searching, setSearching] = useState(false);

  const applyFilters = (r: Ride) => {
    if (filters.context !== 'all' && r.context !== filters.context) return false;
    if (filters.femaleOnly && r.genderPreference !== 'female') return false;
    if (filters.verifiedOnly && r.driver.verifications.filter(v => v.status === 'verified').length === 0) return false;
    if (filters.minRating > 0 && r.driver.rating < filters.minRating) return false;
    if (r.pricePKR > filters.maxPrice) return false;
    return true;
  };

  const results = rides.filter((r) => r.status === 'upcoming').filter(applyFilters);

  const activeFilterCount = [
    filters.femaleOnly,
    filters.verifiedOnly,
    filters.sameUniversity,
    filters.minRating > 0,
    filters.maxPrice < 2000,
    filters.context !== 'all',
    filters.timeRange !== 'any',
  ].filter(Boolean).length;

  return (
    <div className="screen bg-background flex flex-col">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-4 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <h1 className="text-xl font-extrabold text-white mb-4">Find a Ride</h1>

        {/* From input */}
        <div className="relative mb-2">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-[2px]">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <input
            type="text"
            placeholder="From — pickup location"
            value={from}
            onFocus={() => setFromFocus(true)}
            onBlur={() => setTimeout(() => setFromFocus(false), 150)}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full pl-8 pr-4 h-12 bg-white rounded-xl text-sm text-slate-800 outline-none border-0"
          />
          {from && (
            <button onClick={() => setFrom('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Suggestions for from */}
        {fromFocus && (
          <div className="bg-white rounded-xl overflow-hidden mb-2 shadow-md">
            {LOCATIONS.filter(l => !to.includes(l)).slice(0, 4).map((loc) => (
              <button
                key={loc}
                onMouseDown={(e) => { e.preventDefault(); setFrom(loc); setFromFocus(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left"
              >
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-700">{loc}</span>
              </button>
            ))}
          </div>
        )}

        {/* To input */}
        <div className="relative mb-3">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <input
            type="text"
            placeholder="To — drop-off location"
            value={to}
            onFocus={() => setToFocus(true)}
            onBlur={() => setTimeout(() => setToFocus(false), 150)}
            onChange={(e) => setTo(e.target.value)}
            className="w-full pl-8 pr-4 h-12 bg-white rounded-xl text-sm text-slate-800 outline-none border-0"
          />
          {to && (
            <button onClick={() => setTo('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Suggestions for to */}
        {toFocus && (
          <div className="bg-white rounded-xl overflow-hidden mb-3 shadow-md">
            {LOCATIONS.filter(l => !from.includes(l)).slice(0, 4).map((loc) => (
              <button
                key={loc}
                onMouseDown={(e) => { e.preventDefault(); setTo(loc); setToFocus(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left"
              >
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-700">{loc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Date + Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-9 pr-3 h-12 bg-white rounded-xl text-sm text-slate-700 outline-none border-0"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { setSearching(true); setTimeout(() => { setSearching(false); }, 800); }}
            className="flex items-center gap-2 px-5 h-12 bg-white/20 rounded-xl text-white font-semibold text-sm border border-white/30"
          >
            <Search className="w-4 h-4" />
            Search
          </motion.button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-border bg-white flex-shrink-0">
        <button
          onClick={() => setShowFilters(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border flex-shrink-0 transition-all ${
            activeFilterCount > 0
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-slate-600 border-border'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>

        {[
          { key: 'femaleOnly', label: '♀ Women-only' },
          { key: 'verifiedOnly', label: '✓ Verified' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilters({ ...filters, [key]: !filters[key as keyof Filters] })}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex-shrink-0 whitespace-nowrap transition-all ${
              filters[key as keyof Filters]
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-slate-600 border-border'
            }`}
          >
            {label}
          </button>
        ))}

        {[
          { id: 'campus', label: 'Campus' },
          { id: 'city', label: 'City' },
          { id: 'intercity', label: 'Intercity' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilters({ ...filters, context: id === filters.context ? 'all' : id as Filters['context'] })}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex-shrink-0 whitespace-nowrap transition-all ${
              filters.context === id
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-slate-600 border-border'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* View toggle + results count */}
      <div className="px-5 py-3 flex items-center justify-between bg-white border-b border-border flex-shrink-0">
        <p className="text-sm font-semibold text-slate-700">
          {results.length} ride{results.length !== 1 ? 's' : ''} available
        </p>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'
            }`}
          >
            <List className="w-3.5 h-3.5" /> List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'map' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'
            }`}
          >
            <Map className="w-3.5 h-3.5" /> Map
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {searching ? (
          <div className="px-4 pt-4 space-y-3">
            {[1, 2, 3].map((k) => <RideCardSkeleton key={k} />)}
          </div>
        ) : viewMode === 'map' ? (
          <MockMapView rides={results} />
        ) : results.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No rides found</h3>
            <p className="text-sm text-slate-500 mb-6">
              No rides match your filters. Try adjusting your search or get notified when one becomes available.
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotifyRequested(true)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                notifyRequested
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-primary/10 text-primary border border-primary/20'
              }`}
            >
              {notifyRequested ? (
                <>
                  <Check className="w-4 h-4" /> Notification set
                </>
              ) : (
                <>
                  <BellPlus className="w-4 h-4" /> Notify me when available
                </>
              )}
            </motion.button>
          </div>
        ) : (
          <div className="px-4 py-4 pb-20 flex flex-col gap-3">
            {results.map((ride, i) => (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <RideCard ride={ride} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onClose={() => setShowFilters(false)}
            />
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}

export default function FindPage() {
  return (
    <Suspense fallback={<div className="screen flex items-center justify-center"><p className="text-slate-400">Loading...</p></div>}>
      <FindContent />
    </Suspense>
  );
}
