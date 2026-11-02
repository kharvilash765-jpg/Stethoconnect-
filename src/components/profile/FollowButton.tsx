import { UserCheck, UserPlus } from 'lucide-react';
import { isFollowing } from '@/lib/social';
import { useStore } from '@/store/useStore';

interface FollowButtonProps {
  userId: string;
}

export function FollowButton({ userId }: FollowButtonProps) {
  const { state, dispatch } = useStore();
  if (!state.currentUserId || state.currentUserId === userId) return null;
  const following = isFollowing(state, state.currentUserId, userId);

  if (!following) {
    return (
      <button
        type="button"
        onClick={() => dispatch({ type: 'follow/toggle', userId })}
        className="group flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700 active:scale-95"
      >
        <UserPlus className="h-3.5 w-3.5" />
        Follow
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => dispatch({ type: 'follow/toggle', userId })}
      aria-label="Unfollow"
      className="group flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 transition hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 active:scale-95"
    >
      <UserCheck className="h-3.5 w-3.5 group-hover:hidden text-teal-600 dark:text-teal-400" />
      <span className="group-hover:hidden">Following</span>
      <span className="hidden group-hover:inline">Unfollow</span>
    </button>
  );
}
