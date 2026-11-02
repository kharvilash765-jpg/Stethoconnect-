import { useEffect, useState } from 'react';
import { Eye, Flag, Heart, MessageCircle, Share2, Trash2, Building2 } from 'lucide-react';
import type { Post } from '@/types';
import { formatCount, timeAgo } from '@/lib/format';
import { useStore } from '@/store/useStore';
import { Avatar } from '@/components/common/Avatar';
import { ImageGrid } from '@/components/feed/ImageGrid';
import { ReportModal } from '@/components/feed/ReportModal';

interface PostCardProps {
  post: Post;
  onFilterCollege?: (college: string) => void;
}

export function PostCard({ post, onFilterCollege }: PostCardProps) {
  const { state, dispatch } = useStore();
  const [reportOpen, setReportOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const me = state.currentUserId;
  const author = state.profiles.find((p) => p.id === post.authorId);

  useEffect(() => {
    if (me && me !== post.authorId && (!post.viewers || !post.viewers.includes(me))) {
      dispatch({ type: 'post/view', postId: post.id });
    }
  }, [dispatch, me, post.id, post.authorId, post.viewers]);

  const isOwn = me === post.authorId;
  const myReaction = me && post.reactions ? post.reactions[me] : undefined;
  const isLiked = myReaction === 'like';
  const likeCount = post.reactions
    ? Object.values(post.reactions).filter((r) => r === 'like').length
    : 0;
  const commentCount = state.comments.filter((c) => c.postId === post.id).length;
  const reportedByMe = state.reports.some((r) => r.postId === post.id && r.reporterId === me);
  const hidden = reportedByMe && !revealed;

  if (!author) return null;

  const collegeDisplay = post.college || author.college || 'Medical College';

  function handleDelete() {
    if (window.confirm('Delete this post? This cannot be undone.')) {
      dispatch({ type: 'post/delete', postId: post.id });
    }
  }

  function handleShare() {
    const url = `${window.location.origin}${window.location.pathname}#/post/${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition hover:shadow-md overflow-hidden">
      {/* Top Header: Instagram / Facebook style */}
      <header className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <a href={`#/profile/${author.id}`} aria-label={`View ${author.name}'s profile`} className="relative group shrink-0">
            <div className="rounded-full ring-2 ring-teal-500/80 p-0.5 transition group-hover:scale-105">
              <Avatar name={author.name} seed={author.id} avatarUrl={author.avatar} size="md" />
            </div>
          </a>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <a href={`#/profile/${author.id}`} className="truncate font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition">
                {author.name}
              </a>
              {author.specialty && (
                <span className="hidden sm:inline-block rounded-full bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-900/60">
                  {author.specialty}
                </span>
              )}
            </div>

            {/* Crucial requirement: @username | College Name */}
            <div className="flex items-center flex-wrap gap-1 text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
              <a href={`#/profile/${author.id}`} className="text-teal-700 dark:text-teal-400 hover:underline">
                @{author.handle}
              </a>
              <span className="text-slate-300 dark:text-slate-600 font-semibold">|</span>
              <button
                type="button"
                onClick={() => onFilterCollege && onFilterCollege(collegeDisplay)}
                className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:underline bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md transition"
                title={`Filter all posts from ${collegeDisplay}`}
              >
                <Building2 className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                <span>{collegeDisplay}</span>
              </button>
              <span className="text-slate-400 dark:text-slate-600">·</span>
              <span className="text-slate-400 dark:text-slate-500">{timeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Options / Delete / Report */}
        <div className="flex items-center gap-1">
          {isOwn ? (
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Delete post"
              className="rounded-full p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : (
            me && (
              <button
                type="button"
                onClick={() => setReportOpen(true)}
                className="rounded-full p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Report post"
              >
                <Flag className="h-4 w-4" />
              </button>
            )
          )}
        </div>
      </header>

      {hidden ? (
        <div className="mx-4 mb-4 rounded-xl bg-slate-50 dark:bg-slate-800 px-4 py-3 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Post reported. Hidden from active feed.</span>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="font-semibold text-teal-700 dark:text-teal-400 hover:underline"
          >
            Show
          </button>
        </div>
      ) : (
        <>
          {/* Post Text */}
          {post.text && (
            <div className="px-4 pb-3">
              <p className="whitespace-pre-line break-words text-[15px] leading-relaxed text-slate-800 dark:text-slate-200">
                {post.text}
              </p>
            </div>
          )}

          {/* Post Images Grid */}
          {post.images && post.images.length > 0 && (
            <div className="px-4 pb-3">
              <ImageGrid images={post.images} alt={`Post by ${author.name}`} />
            </div>
          )}

          {/* Instagram / Facebook Modern Action Bar */}
          <footer className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-4 py-2.5 flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              {/* Like Button */}
              <button
                type="button"
                onClick={() => me && dispatch({ type: 'post/react', postId: post.id, reaction: 'like' })}
                disabled={!me}
                aria-pressed={isLiked}
                aria-label="Like post"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition active:scale-95 ${
                  isLiked
                    ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/60'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>{formatCount(likeCount)}</span>
              </button>

              {/* Comment Button */}
              <a
                href={`#/post/${post.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{formatCount(commentCount)}</span>
              </a>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
                title="Copy post link"
              >
                <Share2 className="h-4 w-4" />
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>

            {/* Reach counter */}
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium px-2" title="Unique views">
              <Eye className="h-3.5 w-3.5" />
              <span>{formatCount(post.viewers?.length || 0)} views</span>
            </div>
          </footer>
        </>
      )}

      {reportOpen && <ReportModal postId={post.id} onClose={() => setReportOpen(false)} />}
    </article>
  );
}
