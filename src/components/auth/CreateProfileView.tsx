import { useState, type FormEvent } from 'react';
import { Building2, LogOut, CheckCircle2, GraduationCap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Logo } from '@/components/common/Logo';

const HANDLE_PATTERN = /^[a-z0-9_]{3,20}$/;

const COURSE_BATCH_YEARS = [
  '1st Year Student',
  '2nd Year Student',
  '3rd Year Student',
  'Final Year Student',
  'Intern / House Officer',
  'Post-Graduate / Resident',
  'College Alumni',
];

const SUGGESTED_COLLEGES = [
  'MGM Indore',
  'AIIMS New Delhi',
  'KGMU Lucknow',
  'GMC Mumbai',
  'SMS Jaipur',
  'BHU Varanasi',
  'CMC Vellore',
];

export function CreateProfileView() {
  const { authUser, state, dispatch, signOutUser } = useStore();
  const [name, setName] = useState(authUser?.displayName ?? '');
  const [handle, setHandle] = useState(
    authUser?.displayName
      ? authUser.displayName.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 15)
      : '',
  );
  const [college, setCollege] = useState('MGM Indore');
  const [courseYear, setCourseYear] = useState(COURSE_BATCH_YEARS[0]);
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanHandle = handle.trim().replace(/^@/, '').toLowerCase();
    if (!name.trim()) return setError('Please enter your full name.');
    if (!HANDLE_PATTERN.test(cleanHandle)) {
      return setError('Username handle must be 3-20 characters: letters, numbers or underscore.');
    }
    if (state.profiles.some((p) => p.handle === cleanHandle)) {
      return setError('This username handle is already registered. Please choose another.');
    }

    setError(null);
    setSubmitting(true);

    try {
      dispatch({
        type: 'profile/create',
        name: name.trim(),
        handle: cleanHandle,
        college: college.trim() || 'MGM Indore',
        specialty: courseYear, // Backwards-compatible storage with Firestore
        bio: bio.trim(),
        avatar: authUser?.photoURL || undefined,
      });
    } catch {
      setError('Could not save profile to Firebase. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-slate-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-10 transition-colors">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size="lg" className="mb-3" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Create Student / Alumni Profile
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Set up your campus handle to connect with college mates.
          </p>
        </div>

        {/* Authenticated User Badge */}
        <div className="mb-5 rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/70 dark:bg-teal-950/30 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {authUser?.photoURL ? (
              <img
                src={authUser.photoURL}
                alt="Google user"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-teal-500 shadow-sm"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center">
                {name ? name[0].toUpperCase() : 'S'}
              </div>
            )}
            <div className="min-w-0">
              <span className="block truncate text-xs font-semibold text-teal-800 dark:text-teal-300">
                Connected with Google
              </span>
              <span className="block truncate text-xs text-slate-600 dark:text-slate-400">
                {authUser?.email}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signOutUser && signOutUser()}
            className="shrink-0 flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition"
            title="Sign out of Google"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Switch</span>
          </button>
        </div>

        {/* Profile Creation Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xl shadow-slate-200/50 dark:shadow-black/50"
        >
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Your Full Name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="e.g. Praveen Koli"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
            />
          </label>

          {/* College Name Selection */}
          <div className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              College / Institute Name
            </span>
            <input
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              maxLength={100}
              placeholder="e.g. MGM Indore, AIIMS Delhi, GMC Mumbai..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
            />
            {/* Quick College Suggestions */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SUGGESTED_COLLEGES.map((sCol) => (
                <button
                  key={sCol}
                  type="button"
                  onClick={() => setCollege(sCol)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border transition ${
                    college === sCol
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {sCol}
                </button>
              ))}
            </div>
          </div>

          {/* Course / Batch Year */}
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              Course / Batch Year
            </span>
            <select
              value={courseYear}
              onChange={(e) => setCourseYear(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
            >
              {COURSE_BATCH_YEARS.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Username Handle (@)
            </span>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold">
                @
              </span>
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/^@/, ''))}
                maxLength={20}
                placeholder="praveen_neet"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Bio & Campus Interests (Optional)
            </span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              rows={2}
              placeholder="e.g. MGM Indore 2nd year | Coffee, campus fest, sports & memes enthusiast!"
              className="w-full resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
            />
          </label>

          {error && <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-teal-600/25 hover:bg-teal-700 active:scale-[0.99] transition disabled:opacity-60"
          >
            {submitting ? (
              <span>Setting up your campus profile...</span>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span>Complete Profile & Enter Campus</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
