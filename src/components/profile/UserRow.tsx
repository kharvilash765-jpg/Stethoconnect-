import { Avatar } from '@/components/common/Avatar';
import { FollowButton } from '@/components/profile/FollowButton';
import type { Profile } from '@/types';
import { Building2, GraduationCap } from 'lucide-react';

interface UserRowProps {
  profile: Profile;
}

export function UserRow({ profile }: UserRowProps) {
  const collegeName = profile.college || 'Medical College';
  const courseYear = profile.specialty || profile.courseYear;

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition hover:shadow-md">
      <a href={`#/profile/${profile.id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar name={profile.name} seed={profile.id} avatarUrl={profile.avatar} />
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="truncate font-bold text-slate-900 dark:text-white">{profile.name}</span>
            {courseYear && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 text-[11px] font-semibold text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-900/60">
                <GraduationCap className="h-3 w-3" />
                {courseYear}
              </span>
            )}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            <span className="text-teal-700 dark:text-teal-400">@{profile.handle}</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              <Building2 className="h-3 w-3 text-teal-600 dark:text-teal-400" />
              {collegeName}
            </span>
          </span>
          {profile.bio && <span className="mt-1 block truncate text-xs text-slate-600 dark:text-slate-400">{profile.bio}</span>}
        </span>
      </a>
      <FollowButton userId={profile.id} />
    </li>
  );
}
