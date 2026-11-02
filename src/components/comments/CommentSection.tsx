import { useState } from 'react';
import { ArrowDownWideNarrow, Sparkles, type LucideIcon } from 'lucide-react';
import { CommentInput } from '@/components/comments/CommentInput';
import { CommentThread } from '@/components/comments/CommentThread';
import { useStore } from '@/store/useStore';

type SortMode = 'top' | 'newest';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { state, dispatch } = useStore();
  const [sort, setSort] = useState<SortMode>('top');
  const comments = state.comments.filter((c) => c.postId === postId);
  const roots = comments.filter((c) => c.parentId === null);
  const sortedRoots = [...roots].sort((a, b) => {
    if (sort === 'top') {
      const diff = (b.likes?.length || 0) - (a.likes?.length || 0);
      if (diff !== 0) return diff;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const repliesFor = (rootId: string) =>
    comments
      .filter((c) => c.parentId === rootId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const sortButton = (mode: SortMode, label: string, Icon: LucideIcon) => (
    <button
      type="button"
      onClick={() => setSort(mode)}
      aria-pressed={sort === mode}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        sort === mode
          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h2>
        <div className="flex items-center gap-1 rounded-full bg-slate-50 dark:bg-slate-800 p-1">
          {sortButton('top', 'Top', Sparkles)}
          {sortButton('newest', 'Newest', ArrowDownWideNarrow)}
        </div>
      </div>

      {state.currentUserId ? (
        <div className="mb-6">
          <CommentInput
            placeholder="Write a comment or share your reaction..."
            submitLabel="Comment"
            onSubmit={(text) => dispatch({ type: 'comment/add', postId, parentId: null, text })}
          />
        </div>
      ) : null}

      {sortedRoots.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          No comments yet. Be the first to join the conversation.
        </p>
      ) : (
        <div className="space-y-6">
          {sortedRoots.map((root) => (
            <CommentThread key={root.id} comment={root} replies={repliesFor(root.id)} />
          ))}
        </div>
      )}
    </section>
  );
}
