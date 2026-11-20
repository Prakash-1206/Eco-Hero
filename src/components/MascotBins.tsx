import React, { useState } from 'react';
import { BinConfig, WASTE_BINS, WasteCategory } from '../types/eco';
import { ConfettiBurst } from './ConfettiBurst';

interface MascotBinsProps {
  activeCategory: WasteCategory | null;
  celebrationKey: number;
  isGuessing?: boolean;
  awardedPoints?: number;
  extraConfetti?: boolean;
  onSelectBin?: (category: WasteCategory) => void;
}

const CategoryIcon: React.FC<{ category: WasteCategory }> = ({ category }) => {
  switch (category) {
    case 'Paper Waste':
      return (
        <g>
          {/* Sheet of paper + folded book + crumpled paper */}
          <rect x="61" y="114" width="26" height="30" rx="2.5" fill="#F8FAFC" stroke="#334155" strokeWidth="2" transform="rotate(-8 74 129)" />
          <line x1="66" y1="122" x2="80" y2="120" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <line x1="67" y1="128" x2="81" y2="126" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          {/* Little brown book */}
          <path d="M84 126 L104 122 L106 144 L86 148 Z" fill="#D97706" stroke="#451A03" strokeWidth="2" strokeLinejoin="round" />
          <path d="M87 128 L102 125" stroke="#FEF3C7" strokeWidth="2" />
          {/* Crumpled paper ball */}
          <path
            d="M66 138 C63 135 66 131 70 132 C72 129 77 130 78 134 C81 135 81 141 77 143 C74 146 67 144 66 138 Z"
            fill="#E2E8F0"
            stroke="#475569"
            strokeWidth="1.8"
          />
        </g>
      );
    case 'Glass Waste':
      return (
        <g>
          {/* Glass Jar */}
          <rect x="64" y="122" width="18" height="24" rx="4" fill="#D1FAE5" stroke="#065F46" strokeWidth="2" />
          <rect x="67" y="117" width="12" height="5" rx="1.5" fill="#6EE7B7" stroke="#065F46" strokeWidth="1.8" />
          <line x1="68" y1="128" x2="68" y2="140" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
          {/* Green Glass Bottle */}
          <path
            d="M90 112 H96 V120 L101 126 V146 H85 V126 L90 120 Z"
            fill="#34D399"
            stroke="#064E3B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line x1="89" y1="129" x2="89" y2="141" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'Organic Waste':
      return (
        <g>
          {/* Apple Core */}
          <path
            d="M64 118 Q73 122 81 118 Q77 127 77 134 Q77 140 81 145 Q73 142 64 145 Q68 139 68 133 Q68 126 64 118 Z"
            fill="#FEF3C7"
            stroke="#78350F"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M63 118 Q72 112 82 118" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1.8" />
          <path d="M63 145 Q72 150 82 145" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1.8" />
          <path d="M72 114 Q74 108 78 109" fill="none" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
          {/* Banana Peel */}
          <path
            d="M86 121 C90 126 88 137 82 144 C88 142 93 137 94 133 C96 138 101 142 106 142 C100 135 98 125 94 119 Z"
            fill="#FACC15"
            stroke="#854D0E"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <rect x="89" y="116" width="5" height="5" rx="1" fill="#78350F" />
        </g>
      );
    case 'Metal Waste':
      return (
        <g>
          {/* Red Soda Can */}
          <rect x="63" y="121" width="18" height="26" rx="3" fill="#EF4444" stroke="#450A0A" strokeWidth="2" />
          <ellipse cx="72" cy="121" rx="9" ry="2.8" fill="#E2E8F0" stroke="#475569" strokeWidth="1.8" />
          <path d="M64 132 H80" stroke="#FFFFFF" strokeWidth="3" opacity="0.85" />
          {/* Silver Tin Can */}
          <rect x="85" y="119" width="19" height="27" rx="2.5" fill="#CBD5E1" stroke="#334155" strokeWidth="2" />
          <ellipse cx="94.5" cy="119" rx="9.5" ry="3" fill="#94A3B8" stroke="#334155" strokeWidth="1.8" />
          <line x1="86" y1="127" x2="103" y2="127" stroke="#64748B" strokeWidth="1.5" />
          <line x1="86" y1="134" x2="103" y2="134" stroke="#64748B" strokeWidth="1.5" />
          <line x1="86" y1="141" x2="103" y2="141" stroke="#64748B" strokeWidth="1.5" />
        </g>
      );
    case 'Plastic Waste':
      return (
        <g>
          {/* Tall Water Bottle */}
          <rect x="63" y="120" width="14" height="27" rx="4" fill="#BAE6FD" stroke="#0369A1" strokeWidth="2" />
          <rect x="67" y="113" width="6" height="7" rx="1.5" fill="#0284C7" stroke="#0369A1" strokeWidth="1.8" />
          <rect x="64" y="129" width="12" height="7" fill="#38BDF8" opacity="0.7" />
          {/* Second Plastic Bottle */}
          <rect x="81" y="124" width="13" height="23" rx="4" fill="#E0F2FE" stroke="#0369A1" strokeWidth="2" />
          <rect x="84.5" y="118" width="6" height="6" rx="1.5" fill="#FACC15" stroke="#854D0E" strokeWidth="1.6" />
          {/* Small Cup */}
          <path d="M96 130 H106 L104 147 H98 Z" fill="#93C5FD" stroke="#1E40AF" strokeWidth="1.8" strokeLinejoin="round" />
        </g>
      );
  }
};

const BinCharacter: React.FC<{
  bin: BinConfig;
  gridSpanClass: string;
  isHighlighted: boolean;
  isDimmed: boolean;
  isGuessing: boolean;
  awardedPoints: number;
  extraConfetti: boolean;
  celebrationKey: number;
  onSelect?: () => void;
}> = ({
  bin,
  gridSpanClass,
  isHighlighted,
  isDimmed,
  isGuessing,
  awardedPoints,
  extraConfetti,
  celebrationKey,
  onSelect,
}) => {
  const [showTip, setShowTip] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isGuessing && onSelect && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role={isGuessing ? 'button' : undefined}
      tabIndex={isGuessing ? 0 : undefined}
      aria-label={isGuessing ? `Guess ${bin.id} bin` : undefined}
      onClick={isGuessing ? onSelect : undefined}
      onKeyDown={handleKeyDown}
      className={`${gridSpanClass} relative flex flex-col items-center transition-all duration-300 rounded-3xl p-1 focus:outline-none ${
        isGuessing
          ? 'cursor-pointer hover:-translate-y-2.5 hover:scale-105 active:scale-95 focus-visible:ring-4 focus-visible:ring-amber-300 z-20'
          : isHighlighted
          ? 'z-20 scale-105'
          : isDimmed
          ? 'opacity-65 scale-95'
          : 'hover:-translate-y-1.5'
      }`}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      {/* Celebratory Confetti Burst */}
      {isHighlighted && <ConfettiBurst key={celebrationKey} active extra={extraConfetti} />}

      {/* Floating Points Pill on Matched Bin */}
      {isHighlighted && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-300 border-2 border-amber-900 font-display font-bold text-sm text-amber-950 shadow-md whitespace-nowrap animate-bounce">
            +{awardedPoints} PTS!
          </span>
        </div>
      )}

      {/* Tap to Guess Pill Indicator during Quiz Mode */}
      {isGuessing && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/95 border-2 border-amber-500 font-display font-bold text-[11px] text-amber-900 shadow-sm whitespace-nowrap animate-pulse">
            Tap to guess!
          </span>
        </div>
      )}

      {/* Helpful Hover Tooltip (only when idle) */}
      {showTip && !isHighlighted && !isGuessing && (
        <div
          role="tooltip"
          className="hidden sm:block absolute -top-12 left-1/2 -translate-x-1/2 z-30 w-44 px-2.5 py-1.5 rounded-xl bg-white/95 border-2 border-slate-700 shadow-lg text-center pointer-events-none"
        >
          <p className="text-[11px] font-bold leading-tight text-slate-800">{bin.examples}</p>
        </div>
      )}

      {/* Gentle Pulsing Glow Behind All Bins During Quiz Mode, or Strong Glow on Winner */}
      {(isHighlighted || isGuessing) && (
        <div
          aria-hidden="true"
          className={`absolute inset-1 rounded-full blur-xl animate-pulse -z-10 ${
            isHighlighted ? 'opacity-95' : 'opacity-65'
          }`}
          style={{ backgroundColor: bin.glowColor }}
        />
      )}

      {/* Animated Bin Mascot SVG */}
      <div className={`w-32 sm:w-36 lg:w-40 ${isHighlighted ? 'animate-bin-celebrate' : ''}`}>
        <svg viewBox="0 0 165 188" className="w-full h-auto drop-shadow-[0_6px_6px_rgba(0,0,0,0.22)]">
          {/* Left Waving Arm */}
          <path
            d={isHighlighted ? 'M34 86 Q14 68 18 50' : 'M34 90 Q15 98 16 114'}
            fill="none"
            stroke={bin.bodyColor}
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d={isHighlighted ? 'M34 86 Q14 68 18 50' : 'M34 90 Q15 98 16 114'}
            fill="none"
            stroke="#1F2937"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.18"
          />
          <circle cx={isHighlighted ? 17 : 16} cy={isHighlighted ? 48 : 116} r="8" fill={bin.bodyColor} stroke="#1F2937" strokeWidth="2.8" />

          {/* Right Waving Arm */}
          <path
            d="M131 88 Q151 74 147 54"
            fill="none"
            stroke={bin.bodyColor}
            strokeWidth="11"
            strokeLinecap="round"
          />
          <circle cx="147" cy="52" r="8" fill={bin.bodyColor} stroke="#1F2937" strokeWidth="2.8" />

          {/* Side Wheels */}
          <circle cx="38" cy="166" r="11" fill="#374151" stroke="#111827" strokeWidth="2.8" />
          <circle cx="38" cy="166" r="4.5" fill="#D1D5DB" />
          <circle cx="127" cy="166" r="11" fill="#374151" stroke="#111827" strokeWidth="2.8" />
          <circle cx="127" cy="166" r="4.5" fill="#D1D5DB" />

          {/* Main Bin Body */}
          <path
            d="M32 52 H133 L123 168 C122.5 174 118 178 112 178 H53 C47 178 42.5 174 42 168 Z"
            fill={bin.bodyColor}
            stroke="#1F2937"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Subtle Right-Side Shading */}
          <path
            d="M114 54 H131 L121 168 C120.5 172 118 175 114 176 H105 C110 172 112 164 114 54 Z"
            fill={bin.bodyShade}
            opacity="0.55"
          />

          {/* Bin Lid */}
          <path
            d="M27 42 C27 36 32 32 38 32 H127 C133 32 138 36 138 42 V54 H27 Z"
            fill={bin.lidColor}
            stroke="#1F2937"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Lid Top Handle */}
          <path
            d="M52 32 L58 21 H107 L113 32 Z"
            fill={bin.lidColor}
            stroke="#1F2937"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect x="65" y="24" width="35" height="5" rx="2.5" fill={bin.lidHighlight} />
          {/* Lid Lip Highlight */}
          <rect x="33" y="42" width="99" height="6" rx="3" fill={bin.lidHighlight} opacity="0.6" />

          {/* Cute Cartoon Face */}
          {/* Left Eye */}
          <circle cx="65" cy="76" r="7.2" fill="#111827" />
          <circle cx="67.2" cy="73.5" r="2.5" fill="#FFFFFF" />
          <circle cx="63" cy="78" r="1.2" fill="#FFFFFF" />
          {/* Right Eye */}
          <circle cx="100" cy="76" r="7.2" fill="#111827" />
          <circle cx="102.2" cy="73.5" r="2.5" fill="#FFFFFF" />
          <circle cx="98" cy="78" r="1.2" fill="#FFFFFF" />
          {/* Rosy Cheeks */}
          <ellipse cx="52" cy="83" rx="6" ry="3.4" fill="#FB7185" opacity="0.7" />
          <ellipse cx="113" cy="83" rx="6" ry="3.4" fill="#FB7185" opacity="0.7" />
          {/* Happy Mouth */}
          <path
            d={isHighlighted ? 'M71 84 Q82.5 100 94 84 Z' : 'M73 85 Q82.5 96 92 85 Z'}
            fill="#991B1B"
            stroke="#111827"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path d="M77 91 Q82.5 94 88 91" fill="none" stroke="#FDA4AF" strokeWidth="3" strokeLinecap="round" />

          {/* Category Sticker Frame */}
          <rect
            x="49"
            y="102"
            width="67"
            height="54"
            rx="8"
            fill="#FFFFFF"
            stroke="#1F2937"
            strokeWidth="2.5"
          />
          <CategoryIcon category={bin.id} />

          {/* Category Label Text on Bin */}
          <text
            x="82.5"
            y="170"
            textAnchor="middle"
            fill="#FFFFFF"
            stroke="#111827"
            strokeWidth="2.6"
            paintOrder="stroke"
            fontFamily="Fredoka, sans-serif"
            fontWeight="700"
            fontSize="12.5"
          >
            {bin.id}
          </text>
        </svg>
      </div>
    </div>
  );
};

export const MascotBins: React.FC<MascotBinsProps> = ({
  activeCategory,
  celebrationKey,
  isGuessing = false,
  awardedPoints = 10,
  extraConfetti = false,
  onSelectBin,
}) => {
  const getGridSpanClass = (index: number): string => {
    // Mobile (<640px): 2 columns, 5th bin centered across bottom row
    // Tablet (640px-1023px): 6-col grid -> 3 bins top row (col-span-2 each), 2 centered bottom row (starts at col 2 & 4)
    // Desktop (>=1024px): 5-col single horizontal row
    if (index === 3) {
      return 'col-span-1 sm:col-span-2 sm:col-start-2 lg:col-span-1 lg:col-start-auto';
    }
    if (index === 4) {
      return 'col-span-2 justify-self-center sm:col-span-2 sm:col-start-4 lg:col-span-1 lg:col-start-auto';
    }
    return 'col-span-1 sm:col-span-2 lg:col-span-1';
  };

  return (
    <section aria-label="Recycling Bins" className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-6 pt-3 pb-4">
      <div className="grid grid-cols-2 sm:grid-cols-6 lg:grid-cols-5 gap-3 sm:gap-4 items-end justify-items-center">
        {WASTE_BINS.map((bin, index) => (
          <BinCharacter
            key={bin.id}
            bin={bin}
            gridSpanClass={getGridSpanClass(index)}
            isHighlighted={!isGuessing && activeCategory === bin.id}
            isDimmed={!isGuessing && activeCategory !== null && activeCategory !== bin.id}
            isGuessing={isGuessing}
            awardedPoints={awardedPoints}
            extraConfetti={extraConfetti}
            celebrationKey={celebrationKey}
            onSelect={() => onSelectBin?.(bin.id)}
          />
        ))}
      </div>
    </section>
  );
};
