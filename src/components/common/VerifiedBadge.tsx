import React from 'react';

interface VerifiedBadgeProps {
  size?: number;
  className?: string;
}

/**
 * Distinctive "official verified" badge — a solid blue circle with a white
 * checkmark, similar in spirit to the official verification badges used by
 * major platforms. Used for the site's official/admin account and any other
 * profile the admin decides to verify from the dashboard.
 */
export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ size = 16, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="حساب موثّق"
    >
      <path
        d="M11 0.5L13.09 2.6L16.02 2.02L16.6 4.95L19.5 6L18.4 8.79L20.5 11L18.4 13.21L19.5 16L16.6 17.05L16.02 19.98L13.09 19.4L11 21.5L8.91 19.4L5.98 19.98L5.4 17.05L2.5 16L3.6 13.21L1.5 11L3.6 8.79L2.5 6L5.4 4.95L5.98 2.02L8.91 2.6L11 0.5Z"
        fill="url(#verified-gradient)"
      />
      <path
        d="M7 11.2L9.7 13.9L15 8.3"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="verified-gradient" x1="0" y1="0" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B9EFF" />
          <stop offset="1" stopColor="#0B67D6" />
        </linearGradient>
      </defs>
    </svg>
  );
};
