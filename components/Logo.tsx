export default function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg
      className="nav__mark"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#6EE7F9" />
          <stop offset="0.5" stopColor="#A78BFA" />
          <stop offset="1" stopColor="#4ADE9E" />
        </linearGradient>
      </defs>
      <path
        d="M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14"
        stroke="url(#logoGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M16 9c-3.87 0-7 3.13-7 7s3.13 7 7 7"
        stroke="url(#logoGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="22" cy="16" r="2.6" fill="url(#logoGrad)" />
    </svg>
  );
}
