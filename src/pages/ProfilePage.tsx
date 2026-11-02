import { useState } from 'react';
import { LogOut, Pencil, Settings } from 'lucide-react';
import { PostFeed } from '@/components/feed/PostFeed';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { FollowButton } from '@/components/profile/FollowButton';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { getProfileStats } from '@/lib/social';
import { useStore } from '@/store/useStore';

interface ProfilePageProps {
  userId: string;
}

export function ProfilePage({ userId }: ProfilePageProps) {
  const { state, dispatch, signOutUser } = useStore();
  const [editing, setEditing] = useState(false);
  const profile = state.profiles.find((p) => p.id === userId);

  if (!profile) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-12 text-center">
        <p className="font-bold text-slate-900 dark:text-white">Student profile not found</p>
        <a href="#/" className="mt-4 inline-block text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline">
          Back to home
        </a>
      </div>
    );
  }

  const isOwn = state.currentUserId === profile.id;
  const stats = getProfileStats(state, profile.id);
  const posts = state.posts.filter((p) => p.authorId === profile.id);

  const ownActions = (
    <>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 transition hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 shadow-sm"
      >
        <Pencil className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        Edit profile
      </button>
      <button
        type="button"
        onClick={() => signOutUser ? signOutUser() : dispatch({ type: 'session/set', userId: null })}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 transition hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <ProfileHeader profile={profile} stats={stats} actions={isOwn ? ownActions : <FollowButton userId={profile.id} />} />
        {isOwn && (
          <a
            href="#/settings"
            aria-label="Settings"
            className="absolute right-3 top-3 rounded-full p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition sm:right-5 sm:top-5"
          >
            <Settings className="h-5 w-5" />
          </a>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
          {isOwn ? 'Your Campus Posts' : `Posts by ${profile.name}`}
        </h2>
        <PostFeed
          posts={posts}
          emptyTitle={isOwn ? "You haven't posted anything on campus yet" : 'No posts yet'}
          emptyText={isOwn ? "Share your first meme, study question, confession, or campus update from the home feed." : 'Check back later for new updates from this student.'}
        />
      </div>

      {editing && <EditProfileModal onClose={() => setEditing(false)} />}
    </div>
  );
}
