import { PostFeed } from '@/components/feed/PostFeed';
import { getFollowingIds } from '@/lib/social';
import { useStore } from '@/store/useStore';

export function FollowingPage() {
  const { state } = useStore();
  const me = state.currentUserId;
  if (!me) return null;

  const followingIds = getFollowingIds(state, me);
  const posts = state.posts.filter((p) => followingIds.has(p.authorId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">Campus Following</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Latest posts from the {followingIds.size} {followingIds.size === 1 ? 'student' : 'peers'} you follow.
        </p>
      </div>
      <PostFeed
        posts={posts}
        emptyTitle={followingIds.size === 0 ? 'You are not following any students or peers yet' : 'No posts from students you follow'}
        emptyText="Follow college mates and batchmates from MGM Indore, AIIMS, and other campuses to see their posts here."
        emptyAction={
          <a
            href="#/people"
            className="inline-flex rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 shadow-sm"
          >
            Find Campus Mates
          </a>
        }
      />
    </div>
  );
}
