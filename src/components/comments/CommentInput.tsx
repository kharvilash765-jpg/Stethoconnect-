import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { MAX_COMMENT_LENGTH } from '@/types';
import { useStore } from '@/store/useStore';
import { Avatar } from '@/components/common/Avatar';

interface CommentInputProps {
  placeholder: string;
  submitLabel: string;
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
}

export function CommentInput({ placeholder, submitLabel, onSubmit, onCancel, autoFocus }: CommentInputProps) {
  const { state } = useStore();
  const me = state.profiles.find((p) => p.id === state.currentUserId);
  const [text, setText] = useState('');
  const canSubmit = text.trim().length > 0;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(text);
    setText('');
  }

  if (!me) return null;

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Avatar name={me.name} seed={me.id} avatarUrl={me.avatar} size="sm" />
      <div className="min-w-0 flex-1">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={MAX_COMMENT_LENGTH}
          placeholder={placeholder}
          aria-label={placeholder}
          autoFocus={autoFocus}
          className="w-full border-b border-slate-300 dark:border-slate-700 bg-transparent pb-1.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition focus:border-teal-500 focus:outline-none"
        />
        <div className="mt-2 flex justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-teal-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
          >
            <Send className="h-3.5 w-3.5" />
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
