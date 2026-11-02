import type { ReactNode } from 'react';
import { PostCard } from '@/components/feed/PostCard';
import type { Post } from '@/types';

interface PostFeedProps {
  posts: Post[];
  emptyTitle: string;
  emptyText: string;
  emptyAction?: ReactNode;
  onFilterCollege?: (college: string) => void;
}

export function PostFeed({ posts, emptyTitle, emptyText, emptyAction, onFilterCollege }: PostFeedProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-12 text-center shadow-sm">
        <p className="font-bold text-slate-900 dark:text-white">{emptyTitle}</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">{emptyText}</p>
        {emptyAction && <div className="mt-5">{emptyAction}</div>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onFilterCollege={onFilterCollege} />
      ))}
    </div>
  );
}
