import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import type { ReportReason } from '@/types';
import { useStore } from '@/store/useStore';

const REASONS: { value: ReportReason; label: string; hint: string }[] = [
  { value: 'spam', label: 'Spam or irrelevant promotion', hint: 'Repetitive spam or commercial advertising' },
  { value: 'harassment', label: 'Bullying or harassment', hint: 'Targeted insults, abuse or hate speech' },
  { value: 'inappropriate', label: 'Inappropriate or offensive content', hint: 'Graphic, explicit, or offensive material' },
  { value: 'misinformation', label: 'False or misleading rumors', hint: 'Fake college notifications or rumors' },
  { value: 'other', label: 'Other violation', hint: 'Breach of StethoConnect student guidelines' },
];

interface ReportModalProps {
  postId: string;
  onClose: () => void;
}

export function ReportModal({ postId, onClose }: ReportModalProps) {
  const { dispatch } = useStore();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    if (!reason) return;
    dispatch({ type: 'post/report', postId, reason });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Modal title="Report Submitted" onClose={onClose}>
        <div className="py-4 text-center">
          <p className="font-bold text-slate-900 dark:text-white">Thank you for reporting</p>
          <p className="mt-2 text-sm leading-normal text-slate-600 dark:text-slate-400">
            Our student moderation team will review this. This post has been hidden from your active feed.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 rounded-xl bg-slate-900 dark:bg-slate-100 px-5 py-2.5 text-sm font-semibold text-white dark:text-slate-900 transition hover:bg-slate-800 dark:hover:bg-slate-200"
          >
            Done
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Report Post" onClose={onClose}>
      <p className="mb-4 text-sm leading-normal text-slate-600 dark:text-slate-400">
        Help keep StethoConnect a safe and fun campus space. Why are you reporting this post?
      </p>
      <fieldset className="space-y-2">
        <legend className="sr-only">Reason</legend>
        {REASONS.map((r) => (
          <label
            key={r.value}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
              reason === r.value
                ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 dark:border-teal-700'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <input
              type="radio"
              name="report-reason"
              value={r.value}
              checked={reason === r.value}
              onChange={() => setReason(r.value)}
              className="mt-1 h-4 w-4 accent-teal-600"
            />
            <span>
              <span className="block text-sm font-semibold text-slate-900 dark:text-white">{r.label}</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">{r.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <button
        type="button"
        onClick={submit}
        disabled={!reason}
        className="mt-5 w-full rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
      >
        Submit Report
      </button>
    </Modal>
  );
}
