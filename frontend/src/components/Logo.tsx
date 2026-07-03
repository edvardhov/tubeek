"use client";

interface LogoProps {
  className?: string;
  markClassName?: string;
  showWord?: boolean;
}

function CardStackMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={`shrink-0 ${className}`}
      role="img"
      aria-hidden={true}
    >
      <rect
        x="11"
        y="4"
        width="24"
        height="30"
        rx="7"
        className="fill-accent/30"
        transform="rotate(8 23 19)"
      />
      <rect x="5" y="6" width="24" height="30" rx="7" className="fill-accent" />
      <path
        d="M14 14.5 L23 21 L14 27.5 Z"
        className="fill-accent-fg"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight text-text ${className}`}>
      Tub<span className="text-accent">ee</span>k
    </span>
  );
}

export function Logo({
  className = "",
  markClassName = "h-8 w-8",
  showWord = true,
}: LogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="Tubeek"
    >
      <CardStackMark className={markClassName} />
      {showWord && <Wordmark className="text-lg" />}
    </span>
  );
}

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return <CardStackMark className={className} />;
}
