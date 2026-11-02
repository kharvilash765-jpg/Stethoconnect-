import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/common/Modal';
import { useStore } from '@/store/useStore';
import { Building2, GraduationCap } from 'lucide-react';

interface EditProfileModalProps {
  onClose: () => void;
}

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

export function EditProfileModal({ onClose }: EditProfileModalProps) {
  const { state, dispatch } = useStore();
  const me = state.profiles.find((p) => p.id === state.currentUserId);
  const [name, setName] = useState(me?.name ?? '');
  const [college, setCollege] = useState(me?.college ?? 'MGM Indore');
  const [bio, setBio] = useState(me?.bio ?? '');
  const [courseYear, setCourseYear] = useState(me?.specialty || me?.courseYear || COURSE_BATCH_YEARS[0]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch({
      type: 'profile/update',
      name,
      college: college.trim(),
      bio,
      specialty: courseYear,
    });
    onClose();
  }

  return (
    <Modal title="Edit Campus Profile" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
          />
        </label>

        <div className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            College / Institute
          </span>
          <input
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            maxLength={100}
            placeholder="e.g. MGM Indore, AIIMS Delhi"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SUGGESTED_COLLEGES.map((sCol) => (
              <button
                key={sCol}
                type="button"
                onClick={() => setCollege(sCol)}
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border transition ${
                  college === sCol
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {sCol}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            Course / Batch Year
          </span>
          <select
            value={courseYear}
            onChange={(e) => setCourseYear(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
          >
            {COURSE_BATCH_YEARS.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Bio & Campus Interests</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={250}
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
          />
        </label>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800 shadow-sm"
        >
          Save changes
        </button>
      </form>
    </Modal>
  );
}
