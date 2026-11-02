import { Heart, MessageSquare, Trash2 } from 'lucide-react';
import type { Comment } from '@/types';
import { formatCount, timeAgo } from '@/lib/format';
import { useStore } from '@/store/useStore';
import { Avatar } from '@/components/common/Avatar';

interface CommentRowProps {
  comment: Comment;
  size?: 'root' | 'reply';
  onReply?: () => void;
}

export function CommentRow({ comment, size = 'root', onReply }: CommentRowProps) {
  const { state, dispatch } = useStore();
  const me = state.currentUserId;
  const author = state.profiles.find((p) => p.id === comment.authorId);
  if (!author) return null;

  const liked = me !== null && (comment.likes || []).includes(me);
  const isOwn = me === comment.authorId;

  function handleDelete() {
    if (window.confirm('Delete this comment?')) {
      dispatch({ type: 'comment/delete', commentId: comment.id });
    }
  }

  return (
    <div className="flex gap-3">
      <a href={`#/profile/${author.id}`} aria-label={`View ${author.name}'s profile`}>
        <Avatar name={author.name} seed={author.id} avatarUrl={author.avatar} size={size === 'root' ? 'md' : 'sm'} />
      </a>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <a href={`#/profile/${author.id}`} className="text-sm font-bold text-slate-900 dark:text-white hover:underline">
            {author.name}
          </a>
          <span className="text-xs text-slate-500 dark:text-slate-400">@{author.handle}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="mt-1 whitespace-pre-line break-words text-sm leading-normal text-slate-800 dark:text-slate-200">{comment.text}</p>

        <div className="mt-1.5 flex items-center gap-1">
          <button
            type="button"
            onClick={() => dispatch({ type: 'comment/like', commentId: comment.id })}
            disabled={!me}
            aria-pressed={liked}
            aria-label="Like comment"
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition active:scale-95 ${
              liked
                ? 'text-teal-700 dark:text-teal-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-current' : ''}`} />
            {comment.likes && comment.likes.length > 0 && formatCount(comment.likes.length)}
          </button>
          {onReply && me && (
            <button
              type="button"
              onClick={onReply}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Reply
            </button>
          )}
          {isOwn && (
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Delete comment"
              className="rounded-full p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
