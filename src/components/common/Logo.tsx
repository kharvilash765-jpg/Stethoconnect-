interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const SIZES = {
  sm: { icon: 28, text: 'text-base' },
  md: { icon: 36, text: 'text-xl' },
  lg: { icon: 48, text: 'text-2xl' },
  xl: { icon: 64, text: 'text-3xl' },
};

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const { icon, text } = SIZES[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Unique Custom Vector StethoConnect Logo */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 p-2 shadow-md shadow-teal-500/20 ring-1 ring-teal-400/30"
        style={{ width: icon + 10, height: icon + 10 }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          <defs>
            <linearGradient id="scGradient" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="0.6" stopColor="#e0f2fe" />
              <stop offset="1" stopColor="#a7f3d0" />
            </linearGradient>
            <linearGradient id="pulseGradient" x1="12" y1="24" x2="36" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Left Earpiece & Binaural Arc */}
          <path
            d="M13 8C13 6.9 13.9 6 15 6H16C17.1 6 18 6.9 18 8V16C18 20.4 21.6 24 26 24"
            stroke="url(#scGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Right Earpiece & Binaural Arc */}
          <path
            d="M35 8C35 6.9 34.1 6 33 6H32C30.9 6 30 6.9 30 8V16C30 18.5 28.5 20.7 26.3 21.6"
            stroke="url(#scGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Ear tips */}
          <circle cx="15.5" cy="7" r="2" fill="#ffffff" />
          <circle cx="32.5" cy="7" r="2" fill="#ffffff" />

          {/* Intertwined Connecting Loop */}
          <path
            d="M26 24V28C26 31.3 23.3 34 20 34C16.7 34 14 31.3 14 28C14 25.8 15.2 23.8 17 22.8"
            stroke="url(#scGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Flexible Lead into Chestpiece / Network Node */}
          <path
            d="M20 34C20 37.3 22.7 40 26 40H30"
            stroke="url(#scGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Acoustic Stethoscope Bell / Cross-Connect Nexus */}
          <circle cx="34" cy="40" r="5" fill="#ffffff" />
          <circle cx="34" cy="40" r="2.5" fill="#0f766e" />

          {/* Vital Pulse / Campus Connection Wave */}
          <path
            d="M19 18L21.5 14L24.5 21L27 17H30"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight text-slate-900 dark:text-white leading-tight ${text}`}>
            Stetho<span className="text-teal-600 dark:text-teal-400">Connect</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700/80 dark:text-teal-400/80">
            Campus Social Network
          </span>
        </div>
      )}
    </div>
  );
}
