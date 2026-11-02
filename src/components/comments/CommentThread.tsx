import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Comment } from '@/types';
import { CommentInput } from '@/components/comments/CommentInput';
import { CommentRow } from '@/components/comments/CommentRow';
import { useStore } from '@/store/useStore';

interface CommentThreadProps {
  comment: Comment;
  replies: Comment[];
}

export function CommentThread({ comment, replies }: CommentThreadProps) {
  const { dispatch } = useStore();
  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false);
  const repliesVisible = showReplies && replies.length > 0;

  function submitReply(text: string) {
    dispatch({ type: 'comment/add', postId: comment.postId, parentId: comment.id, text });
    setReplying(false);
    setShowReplies(true);
  }

  return (
    <div>
      <CommentRow comment={comment} onReply={() => setReplying((v) => !v)} />

      {replying && (
        <div className="ml-12 mt-3">
          <CommentInput
            placeholder="Add a reply..."
            submitLabel="Reply"
            autoFocus
            onSubmit={submitReply}
            onCancel={() => setReplying(false)}
          />
        </div>
      )}

      {replies.length > 0 && (
        <button
          type="button"
          onClick={() => setShowReplies((v) => !v)}
          className="ml-12 mt-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-teal-700 dark:text-teal-400 transition hover:bg-teal-50 dark:hover:bg-teal-950/40"
        >
          {showReplies ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
        </button>
      )}

      {repliesVisible && (
        <div className="ml-12 mt-3 space-y-4 border-l-2 border-slate-100 dark:border-slate-800 pl-4">
          {replies.map((reply) => (
            <CommentRow key={reply.id} comment={reply} size="reply" onReply={() => setReplying(true)} />
          ))}
        </div>
      )}
    </div>
  );
}
