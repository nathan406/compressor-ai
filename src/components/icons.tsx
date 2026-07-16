'use client';

import React from 'react';

type IconProps = { size?: number; color?: string; className?: string };

export const IconBrain = ({ size = 24, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 4a4 4 0 0 0-3.5 2.1A4 4 0 0 0 4 10a4 4 0 0 0 .5 7.5A4 4 0 0 0 8 21a4 4 0 0 0 4-1.5" />
    <path d="M12 4a4 4 0 0 1 3.5 2.1A4 4 0 0 1 20 10a4 4 0 0 1-.5 7.5A4 4 0 0 1 16 21a4 4 0 0 1-4-1.5" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 14v4" />
  </svg>
);

export const IconEdit = ({ size = 24, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

export const IconShuffle = ({ size = 24, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 18h2.5a6 6 0 0 0 5-2.5L14 10" />
    <path d="M16 4h4v4" />
    <path d="M20 4 13.5 10.5" />
    <path d="M2 6h2.5a6 6 0 0 1 5 2.5L14 14" />
    <path d="M16 20h4v-4" />
    <path d="M20 20 13.5 13.5" />
  </svg>
);

export const IconCompress = ({ size = 24, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" />
    <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
    <path d="M12 12H8" />
    <path d="M16 12h-4" />
    <path d="M12 8v8" />
  </svg>
);

export const IconNetwork = ({ size = 24, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="8" height="8" rx="1.5" />
    <rect x="14" y="2" width="8" height="8" rx="1.5" />
    <rect x="2" y="14" width="8" height="8" rx="1.5" />
    <rect x="14" y="14" width="8" height="8" rx="1.5" />
    <path d="M6 10v4" />
    <path d="M18 10v4" />
    <path d="M10 6h4" />
    <path d="M10 18h4" />
  </svg>
);

export const IconScan = ({ size = 24, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 8v4l2 2" />
  </svg>
);

export const IconRefresh = ({ size = 24, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M21 21v-5h-5" />
  </svg>
);

export const IconCheck = ({ size = 24, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const IconChart = ({ size = 24, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="20" x2="4" y2="14" />
    <line x1="9" y1="20" x2="9" y2="10" />
    <line x1="14" y1="20" x2="14" y2="6" />
    <line x1="19" y1="20" x2="19" y2="2" />
  </svg>
);

export const IconDownload = ({ size = 24, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const IconLightbulb = ({ size = 24, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5C8.3 12.3 8.8 13 9 14" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

export const IconSparkle = ({ size = 24, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3c.5 2.5 2.5 4.5 5 5-2.5.5-4.5 2.5-5 5-.5-2.5-2.5-4.5-5-5 2.5-.5 4.5-2.5 5-5Z" />
    <path d="M19 17c-.7 1.2-1.8 2.3-3 3 .7-1.2 1.8-2.3 3-3Z" />
    <path d="M6 17c.7 1.2 1.8 2.3 3 3-.7-1.2-1.8-2.3-3-3Z" />
  </svg>
);

export const IconServer = ({ size = 24, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

export const IconGpu = ({ size = 24, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="8" y="8" width="8" height="4" rx="1" />
    <path d="M12 12v4" />
    <path d="M8 20v2" />
    <path d="M16 20v2" />
  </svg>
);
