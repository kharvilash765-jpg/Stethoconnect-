import { avatarTone, initials } from '@/lib/format';

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-24 w-24 text-3xl sm:h-28 sm:w-28 sm:text-4xl',
} as const;

interface AvatarProps {
  name: string;
  seed: string;
  avatarUrl?: string;
  size?: keyof typeof SIZES;
}

export function Avatar({ name, seed, avatarUrl, size = 'md' }: AvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm ${SIZES[size]}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 select-none items-center justify-center rounded-full font-bold text-white ring-2 ring-white dark:ring-slate-800 shadow-sm ${avatarTone(
        seed,
      )} ${SIZES[size]}`}
    >
      {initials(name)}
    </div>
  );
}
