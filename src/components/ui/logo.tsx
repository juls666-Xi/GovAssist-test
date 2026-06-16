import React from "react";

interface LogoProps {
  className?: string;
}

export function GovAssistLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Government building/building icon */}
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
      <rect x="5" y="5" width="3" height="4" />
      <rect x="16" y="5" width="3" height="4" />
    </svg>
  );
}
