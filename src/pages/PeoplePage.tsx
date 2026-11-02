import { useState } from 'react';
import { Search, UserPlus, Building2, X } from 'lucide-react';
import { UserRow } from '@/components/profile/UserRow';
import { useStore } from '@/store/useStore';

const POPULAR_COLLEGES = [
  'MGM Indore',
  'AIIMS New Delhi',
  'KGMU Lucknow',
  'GMC Mumbai',
  'SMS Jaipur',
];

export function PeoplePage() {
  const { state } = useStore();
  const [query, setQuery] = useState('');
  const term = query.trim().toLowerCase().replace(/^@/, '');

  const others = state.profiles.filter((p) => p.id !== state.currentUserId);
  const matches = term
    ? others.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.handle.toLowerCase().includes(term) ||
          (p.college && p.college.toLowerCase().includes(term)) ||
          (p.specialty && p.specialty.toLowerCase().includes(term)) ||
          (p.bio && p.bio.toLowerCase().includes(term)),
      )
    : others;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">Student Directory</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Connect with students, batchmates, and alumni across medical colleges.
        </p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by student @handle, name, or college (e.g. MGM Indore)..."
            aria-label="Search students"
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 pl-11 pr-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15 shadow-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick College Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0 mr-1">
            Browse Colleges:
          </span>
          {POPULAR_COLLEGES.map((col) => (
            <button
              key={col}
              type="button"
              onClick={() => setQuery(col)}
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 font-semibold transition ${
                query.toLowerCase().includes(col.toLowerCase())
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Building2 className="h-3 w-3" />
              <span>{col}</span>
            </button>
          ))}
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-10 text-center">
          <UserPlus className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            {others.length === 0 ? 'No other campus members registered yet.' : `No students match "${query}".`}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {others.length === 0 ? 'Invite your college friends & batchmates to sign up!' : 'Try searching for other colleges or clear the filter.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {matches.map((p) => (
            <UserRow key={p.id} profile={p} />
          ))}
        </ul>
      )}
    </div>
  );
}
