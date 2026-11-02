import { useRef, useState, type ChangeEvent } from 'react';
import { ImagePlus, Loader2, Send, X, Building2, Smile } from 'lucide-react';
import { compressImage } from '@/lib/images';
import { MAX_POST_IMAGES, MAX_POST_LENGTH } from '@/types';
import { useStore } from '@/store/useStore';
import { Avatar } from '@/components/common/Avatar';

export function Composer() {
  const { state, dispatch } = useStore();
  const me = state.profiles.find((p) => p.id === state.currentUserId);
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!me) return null;

  const collegeName = me.college || 'Medical College';
  const canPost = !busy && (text.trim().length > 0 || images.length > 0);

  async function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    const remaining = MAX_POST_IMAGES - images.length;
    const files = Array.from(e.target.files ?? [])
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, remaining);
    e.target.value = '';
    if (files.length === 0) return;

    setBusy(true);
    setError(null);
    try {
      const encoded = await Promise.all(files.map(compressImage));
      setImages((prev) => [...prev, ...encoded].slice(0, MAX_POST_IMAGES));
    } catch {
      setError('Some photos could not be processed. Please try another image.');
    } finally {
      setBusy(false);
    }
  }

  function submit() {
    if (!canPost) return;
    dispatch({
      type: 'post/create',
      text,
      images,
      college: collegeName,
    });
    setText('');
    setImages([]);
    setError(null);
  }

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition focus-within:border-teal-400 focus-within:shadow-md sm:p-5">
      <div className="flex gap-3">
        <Avatar name={me.name} seed={me.id} avatarUrl={me.avatar} />
        <div className="min-w-0 flex-1">
          {/* Header pill: @handle | College Name */}
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white">{me.name}</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-900/60">
              <Building2 className="h-3 w-3 text-teal-600 dark:text-teal-400" />
              @{me.handle} | {collegeName}
            </span>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_POST_LENGTH}
            rows={3}
            placeholder="Share what's happening in your college, confessions, campus memes, or study updates..."
            aria-label="Write a campus post"
            className="w-full resize-none border-none bg-transparent p-0 text-base leading-relaxed text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-0"
          />

          {images.length > 0 && (
            <div className="mt-3">
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {images.map((src, i) => (
                  <li key={i} className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <img src={src} alt={`Attachment ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      aria-label="Remove image"
                      className="absolute right-1.5 top-1.5 rounded-full bg-slate-900/80 p-1 text-white transition hover:bg-slate-900"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400 font-medium">{error}</p>}

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={busy || images.length >= MAX_POST_IMAGES}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 transition hover:bg-teal-50 dark:hover:bg-teal-950/40 disabled:cursor-not-allowed disabled:text-slate-400"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                <span>{images.length >= MAX_POST_IMAGES ? 'Max 5 Photos' : `Add Memes/Photos (${images.length}/${MAX_POST_IMAGES})`}</span>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="hidden"
              />
              <span className="hidden text-xs text-slate-400 dark:text-slate-500 sm:inline">
                {text.length}/{MAX_POST_LENGTH}
              </span>
            </div>
            <button
              type="button"
              onClick={submit}
              disabled={!canPost}
              className="flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-teal-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800 transition"
            >
              <Send className="h-4 w-4" />
              Post
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
