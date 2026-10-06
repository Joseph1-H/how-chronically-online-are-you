interface LogoMarkProps {
  className?: string;
  /** Unique id suffix so multiple instances don't clash on gradient ids. */
  idSuffix?: string;
}

/**
 * The QuizLab logo mark: a violet→coral squircle with a stylized eye —
 * a nod to "how online are you / the algorithm sees everything."
 */
export function LogoMark({ className = 'h-8 w-8', idSuffix = 'nav' }: LogoMarkProps) {
  const gid = `logo-grad-${idSuffix}`;
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="QuizLab logo">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b3df5" />
          <stop offset="1" stopColor="#ff4d6d" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13" fill={`url(#${gid})`} />
      {/* eye outline */}
      <path
        d="M10 24c4-7.5 24-7.5 28 0-4 7.5-24 7.5-28 0Z"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* iris + pupil */}
      <circle cx="24" cy="24" r="5.6" fill="#fff" />
      <circle cx="24" cy="24" r="2.4" fill="#5b3df5" />
      {/* sparkle */}
      <circle cx="34.5" cy="13.5" r="1.7" fill="#fff" />
    </svg>
  );
}

/** Full lockup: mark + wordmark, used in the nav/footer. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 font-bold tracking-tight text-ink ${className}`}>
      <LogoMark className="h-8 w-8" />
      <span className="text-lg">
        quiz<span className="text-brick">lab</span>
      </span>
    </span>
  );
}
