'use client';

import React, { useState } from 'react';

interface BrandVectorIconProps {
  name: string;
  customLogoUrl?: string | null;
  className?: string;
}

export default function BrandVectorIcon({
  name,
  customLogoUrl,
  className = 'w-full h-full',
}: BrandVectorIconProps) {
  const [imageError, setImageError] = useState(false);
  const normalized = name ? name.trim().toLowerCase() : '';

  // If customLogoUrl is provided and hasn't errored, try displaying it
  if (customLogoUrl && !imageError) {
    return (
      <img
        src={customLogoUrl}
        alt={name}
        onError={() => setImageError(true)}
        className={`${className} object-contain`}
      />
    );
  }

  // Official Vector SVGs (100% Offline & Hotlink-Proof)
  switch (normalized) {
    case 'apple':
      return (
        <svg
          viewBox="0 0 170 170"
          fill="currentColor"
          className={`${className} text-slate-900`}
          aria-label="Apple Logo"
        >
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.85-12.01-14.42-6.53-9.91-11.75-21.49-15.66-34.73-3.91-13.24-5.87-25.79-5.87-37.66 0-14.82 3.69-27.14 11.07-36.98 7.38-9.84 16.74-14.87 28.09-15.11 4.79 0 10.15 1.25 16.08 3.76 5.93 2.5 9.77 3.82 11.53 3.96 1.76-.14 5.75-1.54 11.96-4.21 6.21-2.67 11.66-3.88 16.36-3.63 12.86.63 23.01 5.37 30.45 14.22-11.33 6.86-16.89 16.57-16.68 29.13.21 9.92 4.14 18.23 11.79 24.94 7.65 6.7 16.73 10.42 27.24 11.16-2.39 7.42-5.49 15.22-9.3 23.41zM119.22 33.64c0-7.39 2.7-14.15 8.11-20.27 5.41-6.13 12.03-10.37 19.86-12.73.65 1.74.98 3.59.98 5.56 0 7.39-2.8 14.26-8.4 20.61-5.6 6.36-12.39 10.43-20.37 12.2-.06-1.74-.18-3.53-.18-5.37z" />
        </svg>
      );

    case 'samsung':
      return (
        <svg
          viewBox="0 0 300 80"
          fill="none"
          className={className}
          aria-label="Samsung Logo"
        >
          <path
            d="M26.2 36.8c-8.9-2.8-12.3-5.3-12.3-9.8 0-4.8 4.4-8 11.7-8 7.5 0 12.4 3.7 12.7 9.8h9.8c-.4-11.4-9.5-18-22.5-18-13 0-21.7 7.2-21.7 17.5 0 10.2 7.7 14.8 17.5 17.8 9.5 2.9 12.8 5.7 12.8 10.4 0 5.4-4.8 8.8-12.8 8.8-8.8 0-14.4-4.5-14.8-11.1H6.7c.4 12.4 10.4 19.4 24.6 19.4 14.1 0 23-7.5 23-18.7 0-10.4-8.2-15.3-28.1-18.1zM79.2 11.8h-9.9L51.5 67.2h10.4l3.8-11.5h17.8l3.8 11.5h10.4L79.2 11.8zm-10.8 35.6 6-18.2 6 18.2h-12zM140.7 11.8h-9.8l-15.8 34.5-15.8-34.5h-9.8v55.4h9.5V26.4l13.6 29.8h5.2l13.6-29.8v40.8h9.3V11.8zM182.2 36.8c-8.9-2.8-12.3-5.3-12.3-9.8 0-4.8 4.4-8 11.7-8 7.5 0 12.4 3.7 12.7 9.8h9.8c-.4-11.4-9.5-18-22.5-18-13 0-21.7 7.2-21.7 17.5 0 10.2 7.7 14.8 17.5 17.8 9.5 2.9 12.8 5.7 12.8 10.4 0 5.4-4.8 8.8-12.8 8.8-8.8 0-14.4-4.5-14.8-11.1h-9.8c.4 12.4 10.4 19.4 24.6 19.4 14.1 0 23-7.5 23-18.7 0-10.4-8.2-15.3-28.1-18.1zM235.1 11.8v34.5c0 14-8.7 21.9-22 21.9s-22-7.9-22-21.9V11.8h9.8v34.7c0 8.5 4.9 13.1 12.2 13.1s12.2-4.6 12.2-13.1V11.8h9.8zM260.1 11.8v33.4L241 11.8h-9.5v55.4h9.5V33.8l19.1 33.4h9.5V11.8h-9.5z"
            fill="#034EA2"
          />
        </svg>
      );

    case 'google':
      return (
        <svg
          viewBox="0 0 48 48"
          className={`${className} max-w-[32px]`}
          aria-label="Google Logo"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
      );

    case 'xiaomi':
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${className} max-w-[36px]`}
          aria-label="Xiaomi Logo"
        >
          <rect width="100" height="100" rx="28" fill="#FF6900" />
          <path
            d="M32 30h11v24h14V30h11v40H57V43H43v27H32V30z"
            fill="#FFFFFF"
          />
          <rect x="53" y="47" width="10" height="10" rx="2" fill="#FF6900" />
        </svg>
      );

    case 'oneplus':
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${className} max-w-[36px]`}
          aria-label="OnePlus Logo"
        >
          <rect width="100" height="100" rx="18" fill="#F50514" />
          <rect x="22" y="22" width="56" height="56" rx="6" fill="#FFFFFF" />
          <rect x="28" y="28" width="44" height="44" rx="3" fill="#F50514" />
          <path d="M43 40h7v23h-7V40z" fill="#FFFFFF" />
          <path d="M57 47h7v5h-7v7h-5v-7h-7v-5h7v-7h5v7z" fill="#FFFFFF" />
        </svg>
      );

    case 'realme':
      return (
        <svg
          viewBox="0 0 120 40"
          className={className}
          aria-label="realme Logo"
        >
          <text
            x="50%"
            y="70%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="26"
            fontWeight="900"
            fill="#FFC915"
            letterSpacing="-1"
          >
            realme
          </text>
        </svg>
      );

    case 'oppo':
      return (
        <svg viewBox="0 0 120 40" className={className} aria-label="OPPO Logo">
          <text
            x="50%"
            y="68%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="28"
            fontWeight="bold"
            fill="#0F7042"
            letterSpacing="2"
          >
            OPPO
          </text>
        </svg>
      );

    case 'vivo':
      return (
        <svg viewBox="0 0 120 40" className={className} aria-label="vivo Logo">
          <text
            x="50%"
            y="68%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="30"
            fontWeight="bold"
            fill="#415FFF"
            letterSpacing="-1"
          >
            vivo
          </text>
        </svg>
      );

    default:
      // Elegant typography badge for any other brand
      return (
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0066FF] flex items-center justify-center font-extrabold text-sm uppercase shadow-inner">
          {name ? name.slice(0, 2) : 'HP'}
        </div>
      );
  }
}

