import type { ReactNode } from 'react';
import { Building2, GraduationCap } from 'lucide-react';
import { formatCount } from '@/lib/format';
import type { Profile } from '@/types';
import { Avatar } from '@/components/common/Avatar';

interface ProfileHeaderProps {
  profile: Profile;
  stats: { posts: number; followers: number; following: number; reach: number };
  actions: ReactNode;
}

const STAT_LABELS: { key: 'posts' | 'followers' | 'following' | 'reach'; label: string }[] = [
  { key: 'posts', label: 'Posts' },
  { key: 'followers', label: 'Followers' },
  { key: 'following', label: 'Following' },
  { key: 'reach', label: 'Reach' },
];

export function ProfileHeader({ profile, stats, actions }: ProfileHeaderProps) {
  const collegeName = profile.college || 'Medical College';
  const courseYear = profile.specialty || profile.courseYear || 'Student';

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-7">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
        <Avatar name={profile.name} seed={profile.id} avatarUrl={profile.avatar} size="lg" />
        <div className="mt-4 min-w-0 flex-1 sm:ml-6 sm:mt-1">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h1 className="text-2xl font-extrabold leading-tight text-slate-900 dark:text-white">{profile.name}</h1>
            {courseYear && (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 text-xs font-semibold text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-900/60">
                <GraduationCap className="h-3 w-3" />
                {courseYear}
              </span>
            )}
          </div>

          {/* Student Handle and College Name */}
          <div className="flex items-center flex-wrap justify-center sm:justify-start gap-2 text-sm text-slate-600 dark:text-slate-400 mt-1">
            <span className="font-semibold text-teal-700 dark:text-teal-400">@{profile.handle}</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
              <Building2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              {collegeName}
            </span>
          </div>

          {profile.bio && (
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:mx-0">{profile.bio}</p>
          )}
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">{actions}</div>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-4 divide-x divide-slate-100 dark:divide-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        {STAT_LABELS.map((s) => (
          <div key={s.key} className="px-2 py-3 text-center">
            <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400">{s.label}</dt>
            <dd className="mt-0.5 text-lg font-extrabold text-slate-900 dark:text-white">{formatCount(stats[s.key])}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
