import type { AppState } from '@/types';

export function getProfileStats(state: AppState, userId: string) {
  const posts = state.posts.filter((p) => p.authorId === userId);
  return {
    posts: posts.length,
    followers: state.follows.filter((f) => f.followeeId === userId).length,
    following: state.follows.filter((f) => f.followerId === userId).length,
    reach: posts.reduce((sum, p) => sum + (p.viewers?.length || 0), 0),
  };
}

export function getFollowingIds(state: AppState, userId: string): Set<string> {
  return new Set(state.follows.filter((f) => f.followerId === userId).map((f) => f.followeeId));
}

export function isFollowing(state: AppState, followerId: string, followeeId: string): boolean {
  return state.follows.some((f) => f.followerId === followerId && f.followeeId === followeeId);
}
