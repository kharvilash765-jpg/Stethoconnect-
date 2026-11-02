import { ArrowLeft } from 'lucide-react';
import { PostCard } from '@/components/feed/PostCard';
import { CommentSection } from '@/components/comments/CommentSection';
import { useStore } from '@/store/useStore';

interface PostPageProps {
  postId: string;
}

export function PostPage({ postId }: PostPageProps) {
  const { state } = useStore();
  const post = state.posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-12 text-center">
        <p className="font-bold text-slate-900 dark:text-white">This post is no longer available</p>
        <a href="#/" className="mt-4 inline-block text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline">
          Return to campus feed
        </a>
      </div>
    );
  }

  return (
    <div>
      <a
        href="#/"
        className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to feed
      </a>
      <PostCard post={post} />
      <CommentSection postId={post.id} />
    </div>
  );
}
