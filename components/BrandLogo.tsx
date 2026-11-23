import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only';
  theme?: 'dark' | 'light' | 'auto';
  customLogoUrl?: string | null;
  brandName?: string;
}

export default function BrandLogo({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'light',
  customLogoUrl,
  brandName = 'Jaya Cell',
}: BrandLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const textColor =
    theme === 'dark'
      ? 'text-white'
      : theme === 'light'
      ? 'text-slate-900'
      : 'text-slate-900 dark:text-white';

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {customLogoUrl ? (
        <img
          src={customLogoUrl}
          alt={brandName}
          className={`${iconSizes[size]} object-contain rounded-lg`}
        />
      ) : (
        <div className={`relative flex items-center justify-center ${iconSizes[size]} flex-shrink-0 group`}>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
          >
            <defs>
              <linearGradient id="jcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0066FF" />
                <stop offset="100%" stopColor="#004099" />
              </linearGradient>
              <linearGradient id="jcAccent" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>

            {/* Geometric rounded squircle container */}
            <rect width="48" height="48" rx="13" fill="url(#jcGradient)" />

            {/* Stylized Modern Smartphone Silhouette */}
            <rect
              x="11"
              y="7"
              width="26"
              height="34"
              rx="5"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              fill="rgba(255, 255, 255, 0.08)"
            />

            {/* Dynamic Island / Speaker Pill */}
            <rect x="20" y="10" width="8" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.8" />

            {/* Stylized 'JC' Wave Monogram */}
            <path
              d="M17 19H22V27C22 28.6569 20.6569 30 19 30C17.8 30 17 29.3 17 29.3"
              stroke="url(#jcAccent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M31 22C30 20.2 28.2 19 26 19C23.2386 19 21 21.2386 21 24C21 26.7614 23.2386 29 26 29C28.2 29 30 27.8 31 26"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Signal wave indicator in top-right */}
            <circle cx="34" cy="11" r="1.8" fill="#38BDF8" />
          </svg>
        </div>
      )}

      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={`${textSizes[size]} font-extrabold ${textColor} tracking-tight font-sans`}>
              {brandName.split(' ')[0] || 'Jaya'}
            </span>
            <span className={`${textSizes[size]} font-extrabold text-[#0066FF] tracking-tight font-sans`}>
              {brandName.split(' ').slice(1).join(' ') || 'Cell'}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
            Phone Store & POS
          </span>
        </div>
      )}
    </div>
  );
}

