import React from 'react';

// Realistic AI/Technology themed icons with gradients and glows
export const AIBrainIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="brain-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path 
      d="M50 15C35 15 25 25 25 40C25 48 28 55 33 60L30 75C30 78 32 80 35 80H45V85H55V80H65C68 80 70 78 70 75L67 60C72 55 75 48 75 40C75 25 65 15 50 15Z" 
      fill="url(#brain-grad)" 
      filter="url(#glow)"
      opacity="0.9"
    />
    <path d="M40 35H60" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M38 45H62" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M42 55H58" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <circle cx="50" cy="40" r="15" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
    <circle cx="50" cy="40" r="1" fill="white" />
  </svg>
);

export const FoodPreservationIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="preserve-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    <rect x="25" y="20" width="50" height="60" rx="8" stroke="url(#preserve-grad)" strokeWidth="4" />
    <path d="M35 35H65M35 50H65M35 65H65" stroke="url(#preserve-grad)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="50" cy="50" r="15" fill="url(#preserve-grad)" fillOpacity="0.1" />
    <path d="M45 50L48 53L55 47" stroke="url(#preserve-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const AnalyticsIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="anal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <path d="M20 80L20 20M20 80L80 80" stroke="url(#anal-grad)" strokeWidth="4" strokeLinecap="round" />
    <path d="M30 65L45 45L60 55L75 30" stroke="url(#anal-grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="30" cy="65" r="4" fill="url(#anal-grad)" />
    <circle cx="45" cy="45" r="4" fill="url(#anal-grad)" />
    <circle cx="60" cy="55" r="4" fill="url(#anal-grad)" />
    <circle cx="75" cy="30" r="4" fill="url(#anal-grad)" />
  </svg>
);

export const SustainabilityIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="sust-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <path d="M50 20C33.4 20 20 33.4 20 50C20 66.6 33.4 80 50 80C66.6 80 80 66.6 80 50" stroke="url(#sust-grad)" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 35C41.7 35 35 41.7 35 50C35 58.3 41.7 65 50 65" stroke="url(#sust-grad)" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 20L50 10M80 50L90 50M50 80L50 90" stroke="url(#sust-grad)" strokeWidth="4" strokeLinecap="round" />
    <path d="M60 40L75 25" stroke="url(#sust-grad)" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const SmartStorageIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="store-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    <rect x="20" y="20" width="60" height="60" rx="10" stroke="url(#store-grad)" strokeWidth="4" />
    <path d="M20 45H80M45 20V80" stroke="url(#store-grad)" strokeWidth="2" />
    <rect x="30" y="30" width="10" height="10" rx="2" fill="url(#store-grad)" fillOpacity="0.5" />
    <rect x="55" y="55" width="15" height="15" rx="3" fill="url(#store-grad)" />
  </svg>
);

export const RecipeSuggestionIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="recipe-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#d946ef" />
      </linearGradient>
    </defs>
    <path d="M30 20H70C75.5 20 80 24.5 80 30V70C80 75.5 75.5 80 70 80H30C24.5 80 20 75.5 20 70V30C20 24.5 24.5 20 30 20Z" stroke="url(#recipe-grad)" strokeWidth="4" />
    <path d="M40 35H60M40 50H60M40 65H50" stroke="url(#recipe-grad)" strokeWidth="3" strokeLinecap="round" />
    <path d="M65 65C65 65 70 60 75 65C80 70 75 75 75 75" stroke="url(#recipe-grad)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CommunityImpactIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="comm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#f43f5e" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="35" r="12" stroke="url(#comm-grad)" strokeWidth="4" />
    <path d="M30 75C30 63.95 38.95 55 50 55C61.05 55 70 63.95 70 75" stroke="url(#comm-grad)" strokeWidth="4" strokeLinecap="round" />
    <circle cx="25" cy="45" r="8" stroke="url(#comm-grad)" strokeWidth="2" strokeOpacity="0.6" />
    <circle cx="75" cy="45" r="8" stroke="url(#comm-grad)" strokeWidth="2" strokeOpacity="0.6" />
  </svg>
);