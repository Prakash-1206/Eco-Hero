import React from 'react';
import { EcoWorldStage } from '../types/eco';

interface NatureBackgroundProps {
  worldStage: EcoWorldStage;
}

export const NatureBackground: React.FC<NatureBackgroundProps> = ({ worldStage }) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden select-none z-0"
      style={{
        background:
          'linear-gradient(180deg, #9FD8FB 0%, #C7EAFF 48%, #E6F6FF 72%, #86CF5E 72%, #6AB844 100%)',
      }}
    >
      {/* STAGE 4 (100+): Bright Semi-Transparent Cartoon Rainbow Arch Across the Sky */}
      {worldStage >= 4 && (
        <div className="absolute inset-x-0 top-10 sm:top-12 flex justify-center animate-eco-fade-in">
          <svg
            viewBox="0 0 1000 360"
            className="w-[96vw] max-w-[1050px] h-auto opacity-55"
            preserveAspectRatio="xMidYMin meet"
          >
            <path d="M80,350 A420,300 0 0,1 920,350" fill="none" stroke="#EF4444" strokeWidth="20" strokeLinecap="round" />
            <path d="M100,350 A400,282 0 0,1 900,350" fill="none" stroke="#FB923C" strokeWidth="20" strokeLinecap="round" />
            <path d="M120,350 A380,264 0 0,1 880,350" fill="none" stroke="#FACC15" strokeWidth="20" strokeLinecap="round" />
            <path d="M140,350 A360,246 0 0,1 860,350" fill="none" stroke="#4ADE80" strokeWidth="20" strokeLinecap="round" />
            <path d="M160,350 A340,228 0 0,1 840,350" fill="none" stroke="#38BDF8" strokeWidth="20" strokeLinecap="round" />
            <path d="M180,350 A320,210 0 0,1 820,350" fill="none" stroke="#A855F7" strokeWidth="20" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* STAGE 1+: Smiling Sun (Top Left) */}
      <div className="absolute top-14 left-4 sm:top-16 sm:left-12 w-24 h-24 sm:w-32 sm:h-32 animate-sun-glow">
        <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-sm">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30;
            return (
              <polygon
                key={i}
                points="70,6 76,22 64,22"
                fill="#FCD34D"
                stroke="#E59819"
                strokeWidth="2"
                strokeLinejoin="round"
                transform={`rotate(${angle} 70 70)`}
              />
            );
          })}
          <circle cx="70" cy="70" r="38" fill="#FFE055" stroke="#E59819" strokeWidth="3" />
          <ellipse cx="52" cy="75" rx="6" ry="3.5" fill="#FCA5A5" opacity="0.85" />
          <ellipse cx="88" cy="75" rx="6" ry="3.5" fill="#FCA5A5" opacity="0.85" />
          <path d="M53 65 Q57 60 61 65" fill="none" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
          <path d="M79 65 Q83 60 87 65" fill="none" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
          <path d="M62 77 Q70 86 78 77" fill="none" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* STAGE 1+: Smiling Cloud Left */}
      <div className="absolute top-28 -left-4 sm:left-2 w-28 sm:w-36 animate-gentle-float">
        <svg viewBox="0 0 160 95" className="w-full h-auto drop-shadow-sm">
          <path
            d="M34 78 H126 C140 78 150 68 150 55 C150 43 141 34 130 33 C126 18 112 8 95 8 C79 8 66 17 62 30 C57 27 51 25 44 25 C28 25 16 37 16 52 C16 67 24 78 34 78 Z"
            fill="#FFFFFF"
            stroke="#9BD0EC"
            strokeWidth="3"
          />
          <circle cx="66" cy="49" r="2.6" fill="#334155" />
          <circle cx="94" cy="49" r="2.6" fill="#334155" />
          <ellipse cx="60" cy="54" rx="4" ry="2.2" fill="#FECDD3" />
          <ellipse cx="100" cy="54" rx="4" ry="2.2" fill="#FECDD3" />
          <path d="M74 52 Q80 58 86 52" fill="none" stroke="#334155" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>

      {/* STAGE 1+: Small Smiling Cloud Inner Left */}
      <div
        className="hidden md:block absolute top-40 left-44 w-28 animate-gentle-float"
        style={{ animationDelay: '1.1s' }}
      >
        <svg viewBox="0 0 150 88" className="w-full h-auto drop-shadow-sm">
          <path
            d="M32 72 H118 C130 72 140 63 140 51 C140 40 132 31 121 30 C117 16 105 8 89 8 C74 8 62 16 58 28 C53 25 47 23 41 23 C26 23 15 34 15 48 C15 62 22 72 32 72 Z"
            fill="#FFFFFF"
            stroke="#9BD0EC"
            strokeWidth="2.8"
          />
          <circle cx="64" cy="45" r="2.4" fill="#334155" />
          <circle cx="90" cy="45" r="2.4" fill="#334155" />
          <path d="M72 48 Q77 53 82 48" fill="none" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* STAGE 1+: Smiling Cloud Right */}
      <div
        className="absolute top-32 right-2 sm:right-8 w-32 sm:w-40 animate-gentle-float"
        style={{ animationDelay: '0.6s' }}
      >
        <svg viewBox="0 0 160 95" className="w-full h-auto drop-shadow-sm">
          <path
            d="M34 78 H126 C140 78 150 68 150 55 C150 43 141 34 130 33 C126 18 112 8 95 8 C79 8 66 17 62 30 C57 27 51 25 44 25 C28 25 16 37 16 52 C16 67 24 78 34 78 Z"
            fill="#FFFFFF"
            stroke="#9BD0EC"
            strokeWidth="3"
          />
          <circle cx="67" cy="48" r="2.7" fill="#334155" />
          <circle cx="95" cy="48" r="2.7" fill="#334155" />
          <ellipse cx="60" cy="54" rx="4.5" ry="2.4" fill="#FECDD3" />
          <ellipse cx="102" cy="54" rx="4.5" ry="2.4" fill="#FECDD3" />
          <path d="M75 51 Q81 58 87 51" fill="none" stroke="#334155" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>

      {/* STAGE 1+: Rolling Green Hills Horizon */}
      <svg
        viewBox="0 0 1440 420"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-[46vh] min-h-[280px] max-h-[420px]"
      >
        <path
          d="M0,180 Q180,100 380,165 T760,150 T1140,165 T1440,140 L1440,420 L0,420 Z"
          fill="#BCE99A"
        />
        <path
          d="M0,210 Q280,135 560,205 T1100,195 T1440,175 L1440,420 L0,420 Z"
          fill="#93DA69"
        />
        <path
          d="M0,255 Q340,215 720,248 T1440,238 L1440,420 L0,420 Z"
          fill="#78C850"
        />
        <path
          d="M0,365 Q240,340 480,368 T960,360 T1440,368 L1440,420 L0,420 Z"
          fill="#55A630"
        />
      </svg>

      {/* STAGE 1+: Left Tree */}
      <div className="hidden lg:block absolute bottom-28 -left-4 w-44 h-56">
        <svg viewBox="0 0 180 220" className="w-full h-full drop-shadow-sm">
          <path d="M78 205 L78 115 L52 88 L60 80 L80 100 L84 65 L96 65 L98 104 L118 82 L126 90 L102 118 L102 205 Z" fill="#8B5A2B" stroke="#4A2E14" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="90" cy="68" r="44" fill="#68B844" stroke="#366E1D" strokeWidth="3" />
          <circle cx="54" cy="84" r="30" fill="#78C850" stroke="#366E1D" strokeWidth="3" />
          <circle cx="126" cy="82" r="31" fill="#5CA83A" stroke="#366E1D" strokeWidth="3" />
          <circle cx="90" cy="46" r="28" fill="#8AE062" />
        </svg>
      </div>

      {/* STAGE 1+: Right Tree */}
      <div className="hidden lg:block absolute bottom-28 -right-4 w-44 h-56">
        <svg viewBox="0 0 180 220" className="w-full h-full drop-shadow-sm">
          <path d="M78 205 L78 115 L52 88 L60 80 L80 100 L84 65 L96 65 L98 104 L118 82 L126 90 L102 118 L102 205 Z" fill="#8B5A2B" stroke="#4A2E14" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="90" cy="68" r="44" fill="#68B844" stroke="#366E1D" strokeWidth="3" />
          <circle cx="54" cy="84" r="30" fill="#78C850" stroke="#366E1D" strokeWidth="3" />
          <circle cx="126" cy="82" r="31" fill="#5CA83A" stroke="#366E1D" strokeWidth="3" />
          <circle cx="90" cy="46" r="28" fill="#8AE062" />
        </svg>
      </div>

      {/* STAGE 4 (100+): Extra Lush Leafy Bushes & Sparkling Stars on Hills & Sky */}
      {worldStage >= 4 && (
        <>
          {/* Extra Left Leafy Bush */}
          <svg
            className="hidden md:block absolute bottom-20 left-24 w-32 h-20 animate-eco-sprout"
            viewBox="0 0 140 90"
          >
            <circle cx="38" cy="56" r="26" fill="#55A630" stroke="#2D5A18" strokeWidth="2.6" />
            <circle cx="72" cy="44" r="32" fill="#70C946" stroke="#2D5A18" strokeWidth="2.6" />
            <circle cx="104" cy="58" r="24" fill="#5DB837" stroke="#2D5A18" strokeWidth="2.6" />
            <circle cx="58" cy="52" r="5" fill="#F472B6" />
            <circle cx="88" cy="46" r="5" fill="#FACC15" />
          </svg>

          {/* Extra Right Leafy Bush */}
          <svg
            className="hidden md:block absolute bottom-20 right-24 w-32 h-20 animate-eco-sprout"
            style={{ animationDelay: '150ms' }}
            viewBox="0 0 140 90"
          >
            <circle cx="36" cy="58" r="24" fill="#5DB837" stroke="#2D5A18" strokeWidth="2.6" />
            <circle cx="68" cy="44" r="32" fill="#70C946" stroke="#2D5A18" strokeWidth="2.6" />
            <circle cx="102" cy="56" r="26" fill="#55A630" stroke="#2D5A18" strokeWidth="2.6" />
            <circle cx="54" cy="46" r="5" fill="#C084FC" />
            <circle cx="84" cy="54" r="5" fill="#FDE047" />
          </svg>

          {/* Twinkling Sparkling Stars */}
          <svg className="hidden sm:block absolute top-24 left-44 w-7 h-7 animate-star-twinkle" viewBox="0 0 32 32">
            <polygon points="16,2 20,11 30,12 22,19 24,29 16,24 8,29 10,19 2,12 12,11" fill="#FDE047" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <svg
            className="hidden md:block absolute top-48 left-24 w-6 h-6 animate-star-twinkle"
            style={{ animationDelay: '0.7s' }}
            viewBox="0 0 32 32"
          >
            <polygon points="16,2 20,11 30,12 22,19 24,29 16,24 8,29 10,19 2,12 12,11" fill="#FDE047" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <svg
            className="hidden sm:block absolute top-56 right-28 w-6 h-6 animate-star-twinkle"
            style={{ animationDelay: '1.3s' }}
            viewBox="0 0 32 32"
          >
            <polygon points="16,2 20,11 30,12 22,19 24,29 16,24 8,29 10,19 2,12 12,11" fill="#FDE047" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <svg
            className="hidden sm:block absolute bottom-32 left-1/4 w-6 h-6 animate-star-twinkle"
            style={{ animationDelay: '0.4s' }}
            viewBox="0 0 32 32"
          >
            <polygon points="16,2 20,11 30,12 22,19 24,29 16,24 8,29 10,19 2,12 12,11" fill="#FEF08A" stroke="#D97706" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          <svg
            className="hidden sm:block absolute bottom-36 right-1/4 w-6 h-6 animate-star-twinkle"
            style={{ animationDelay: '1.1s' }}
            viewBox="0 0 32 32"
          >
            <polygon points="16,2 20,11 30,12 22,19 24,29 16,24 8,29 10,19 2,12 12,11" fill="#FEF08A" stroke="#D97706" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </>
      )}

      {/* STAGE 2+ (30+): Blooming Meadow Wildflowers & Clovers */}
      {worldStage >= 2 && (
        <>
          {/* Left Meadow Flower Cluster */}
          <svg
            className="hidden sm:block absolute bottom-3 left-6 w-32 h-24 animate-eco-sprout"
            viewBox="0 0 140 90"
          >
            <g transform="translate(26,46)">
              <line x1="0" y1="6" x2="0" y2="42" stroke="#3F7D20" strokeWidth="4" strokeLinecap="round" />
              {[0, 72, 144, 216, 288].map((deg) => (
                <circle key={deg} cx="0" cy="-10" r="8" fill="#F472B6" stroke="#831843" strokeWidth="1.6" transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="6.5" fill="#FDE047" stroke="#92400E" strokeWidth="1.6" />
            </g>
            <g transform="translate(76,54) scale(0.84)">
              <line x1="0" y1="6" x2="0" y2="42" stroke="#3F7D20" strokeWidth="4" strokeLinecap="round" />
              {[0, 72, 144, 216, 288].map((deg) => (
                <circle key={deg} cx="0" cy="-10" r="8" fill="#FACC15" stroke="#854D0E" strokeWidth="1.6" transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="6.5" fill="#FB923C" stroke="#7C2D12" strokeWidth="1.6" />
            </g>
            {/* Lucky Clover */}
            <g transform="translate(115,66)">
              <line x1="0" y1="4" x2="0" y2="20" stroke="#2D5A18" strokeWidth="3" strokeLinecap="round" />
              <circle cx="-5" cy="-2" r="5" fill="#4ADE80" stroke="#166534" strokeWidth="1.4" />
              <circle cx="5" cy="-2" r="5" fill="#4ADE80" stroke="#166534" strokeWidth="1.4" />
              <circle cx="0" cy="-7" r="5" fill="#4ADE80" stroke="#166534" strokeWidth="1.4" />
            </g>
          </svg>

          {/* Mid-Hills Wildflowers & Clovers */}
          <svg
            className="hidden md:block absolute bottom-24 left-[18%] w-24 h-16 animate-eco-sprout"
            style={{ animationDelay: '120ms' }}
            viewBox="0 0 100 65"
          >
            <g transform="translate(24,32) scale(0.7)">
              <line x1="0" y1="6" x2="0" y2="38" stroke="#3F7D20" strokeWidth="4" strokeLinecap="round" />
              {[0, 72, 144, 216, 288].map((deg) => (
                <circle key={deg} cx="0" cy="-10" r="8" fill="#38BDF8" stroke="#075985" strokeWidth="1.6" transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="6" fill="#FEF08A" stroke="#854D0E" strokeWidth="1.6" />
            </g>
            <g transform="translate(68,42)">
              <circle cx="-4" cy="-2" r="4.5" fill="#4ADE80" stroke="#166534" strokeWidth="1.3" />
              <circle cx="4" cy="-2" r="4.5" fill="#4ADE80" stroke="#166534" strokeWidth="1.3" />
              <circle cx="0" cy="-6" r="4.5" fill="#4ADE80" stroke="#166534" strokeWidth="1.3" />
            </g>
          </svg>

          {/* Right Meadow Flower Cluster */}
          <svg
            className="hidden sm:block absolute bottom-3 right-6 w-32 h-24 animate-eco-sprout"
            style={{ animationDelay: '180ms' }}
            viewBox="0 0 140 90"
          >
            <g transform="translate(106,46)">
              <line x1="0" y1="6" x2="0" y2="42" stroke="#3F7D20" strokeWidth="4" strokeLinecap="round" />
              {[0, 72, 144, 216, 288].map((deg) => (
                <circle key={deg} cx="0" cy="-10" r="8" fill="#C084FC" stroke="#581C87" strokeWidth="1.6" transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="6.5" fill="#FDE047" stroke="#92400E" strokeWidth="1.6" />
            </g>
            <g transform="translate(56,56) scale(0.82)">
              <line x1="0" y1="6" x2="0" y2="42" stroke="#3F7D20" strokeWidth="4" strokeLinecap="round" />
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <circle key={deg} cx="0" cy="-10" r="7.5" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.5" transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="6.5" fill="#FACC15" stroke="#854D0E" strokeWidth="1.6" />
            </g>
            {/* Lucky Clover */}
            <g transform="translate(22,66)">
              <line x1="0" y1="4" x2="0" y2="20" stroke="#2D5A18" strokeWidth="3" strokeLinecap="round" />
              <circle cx="-5" cy="-2" r="5" fill="#4ADE80" stroke="#166534" strokeWidth="1.4" />
              <circle cx="5" cy="-2" r="5" fill="#4ADE80" stroke="#166534" strokeWidth="1.4" />
              <circle cx="0" cy="-7" r="5" fill="#4ADE80" stroke="#166534" strokeWidth="1.4" />
            </g>
          </svg>
        </>
      )}

      {/* STAGE 3+ (60+): Fluttering Butterflies & Little Songbirds */}
      {worldStage >= 3 && (
        <>
          {/* Left Pink Butterfly */}
          <div className="hidden md:block absolute top-[45%] left-[11%] w-11 h-11 animate-butterfly">
            <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-sm">
              <ellipse cx="19" cy="24" rx="13" ry="11" fill="#F472B6" stroke="#831843" strokeWidth="2.2" transform="rotate(-20 19 24)" />
              <ellipse cx="41" cy="24" rx="13" ry="11" fill="#F472B6" stroke="#831843" strokeWidth="2.2" transform="rotate(20 41 24)" />
              <ellipse cx="21" cy="39" rx="9" ry="8" fill="#FBBF24" stroke="#831843" strokeWidth="2.2" />
              <ellipse cx="39" cy="39" rx="9" ry="8" fill="#FBBF24" stroke="#831843" strokeWidth="2.2" />
              <rect x="27.5" y="18" width="5" height="24" rx="2.5" fill="#4B2E1E" />
              <path d="M29 19 Q23 11 19 13" fill="none" stroke="#4B2E1E" strokeWidth="2" strokeLinecap="round" />
              <path d="M31 19 Q37 11 41 13" fill="none" stroke="#4B2E1E" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Right Orange Butterfly */}
          <div
            className="hidden md:block absolute top-[43%] right-[13%] w-11 h-11 animate-butterfly"
            style={{ animationDelay: '1.8s' }}
          >
            <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-sm">
              <ellipse cx="19" cy="24" rx="13" ry="11" fill="#FB923C" stroke="#7C2D12" strokeWidth="2.2" transform="rotate(-20 19 24)" />
              <ellipse cx="41" cy="24" rx="13" ry="11" fill="#FB923C" stroke="#7C2D12" strokeWidth="2.2" transform="rotate(20 41 24)" />
              <ellipse cx="21" cy="39" rx="9" ry="8" fill="#FDE047" stroke="#7C2D12" strokeWidth="2.2" />
              <ellipse cx="39" cy="39" rx="9" ry="8" fill="#FDE047" stroke="#7C2D12" strokeWidth="2.2" />
              <rect x="27.5" y="18" width="5" height="24" rx="2.5" fill="#4B2E1E" />
              <path d="M29 19 Q23 11 19 13" fill="none" stroke="#4B2E1E" strokeWidth="2" strokeLinecap="round" />
              <path d="M31 19 Q37 11 41 13" fill="none" stroke="#4B2E1E" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Little Blue Songbird (Left Tree Area) */}
          <div className="hidden sm:block absolute top-[55%] left-[6%] w-11 h-10 animate-bird-glide">
            <svg viewBox="0 0 64 52" className="w-full h-full drop-shadow-sm">
              <path d="M12 28 Q26 14 42 24 Q48 28 44 36 Q28 44 14 34 Z" fill="#38BDF8" stroke="#0C4A6E" strokeWidth="2.4" />
              <path d="M22 24 Q30 14 36 22" fill="#BAE6FD" stroke="#0C4A6E" strokeWidth="2" strokeLinecap="round" />
              <polygon points="44,26 54,28 45,32" fill="#FBBF24" stroke="#78350F" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="38" cy="25" r="2.2" fill="#0F172A" />
              <path d="M12 28 L4 22 L8 32 Z" fill="#0284C7" stroke="#0C4A6E" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Little Yellow Songbird (Right Sky Area) */}
          <div
            className="hidden sm:block absolute top-[26%] right-[17%] w-10 h-9 animate-bird-glide"
            style={{ animationDelay: '1.4s' }}
          >
            <svg viewBox="0 0 64 52" className="w-full h-full drop-shadow-sm -scale-x-100">
              <path d="M12 28 Q26 14 42 24 Q48 28 44 36 Q28 44 14 34 Z" fill="#FDE047" stroke="#854D0E" strokeWidth="2.4" />
              <path d="M22 24 Q30 14 36 22" fill="#FEF9C3" stroke="#854D0E" strokeWidth="2" strokeLinecap="round" />
              <polygon points="44,26 54,28 45,32" fill="#FB923C" stroke="#7C2D12" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="38" cy="25" r="2.2" fill="#0F172A" />
              <path d="M12 28 L4 22 L8 32 Z" fill="#FACC15" stroke="#854D0E" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
};
