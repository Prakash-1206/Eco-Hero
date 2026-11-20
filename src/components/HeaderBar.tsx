import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { ECO_WORLD_STAGES, EcoWorldStage } from '../types/eco';

interface HeaderBarProps {
  score: number;
  scoreAnimating: boolean;
  worldStage: EcoWorldStage;
  muted: boolean;
  onToggleMute: () => void;
  onHomeClick: () => void;
  onHowToPlayClick: () => void;
  onParentsTeachersClick: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  score,
  scoreAnimating,
  worldStage,
  muted,
  onToggleMute,
  onHomeClick,
  onHowToPlayClick,
  onParentsTeachersClick,
}) => {
  const stageInfo = ECO_WORLD_STAGES[worldStage];
  const nextMilestone =
    worldStage === 1 ? 30 : worldStage === 2 ? 60 : worldStage === 3 ? 100 : null;
  return (
    <header className="relative z-20 w-full bg-white/90 backdrop-blur-sm border-b-4 border-sky-200/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 lg:gap-3">
        {/* Row 1 Left: Playful ECO HERO Logo */}
        <button
          type="button"
          onClick={onHomeClick}
          className="order-1 group flex items-center gap-1.5 sm:gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400 rounded-2xl px-0.5 py-0.5 cursor-pointer shrink-0 min-h-[40px]"
          aria-label="Eco Hero Home"
        >
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-b from-lime-400 to-green-600 border-2 border-green-900 shadow-sm group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 36 36" className="w-5 h-5 sm:w-7 sm:h-7" aria-hidden="true">
              {/* Recycling triangle arrows */}
              <path
                d="M18 5 L24 14 H19 L25 24 L29 22 L27 29 L19 28 L22 25 L16 15 H12 Z"
                fill="#FFFFFF"
                stroke="#14532D"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M14 14 L8 24 L13 24 L11 28 L5 26 L7 19 L10 21 L14 14 Z"
                fill="#FEF08A"
                stroke="#14532D"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col leading-none text-left">
            <span className="font-display font-bold text-base sm:text-xl lg:text-2xl tracking-wide text-green-500 text-stroke-sm whitespace-nowrap">
              ECO
            </span>
            <span className="font-display font-bold text-sm sm:text-lg lg:text-xl tracking-wide text-orange-400 text-stroke-sm -mt-1 whitespace-nowrap">
              HERO
            </span>
          </div>
        </button>

        {/* Row 2 on Mobile/Tablet, Center on Desktop: Pill-shaped Navigation Buttons */}
        <nav
          aria-label="Main navigation"
          className="order-3 lg:order-2 w-full lg:w-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 pt-1.5 lg:pt-0 border-t border-sky-100 lg:border-t-0"
        >
          <button
            type="button"
            onClick={onHomeClick}
            className="font-display font-bold text-[11px] sm:text-sm tracking-wide text-white px-3 sm:px-5 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] rounded-full bg-gradient-to-b from-sky-400 to-blue-600 border-2 border-blue-900 shadow-[0_3px_0_#1e3a8a] hover:brightness-105 active:translate-y-0.5 active:shadow-[0_1px_0_#1e3a8a] transition-all cursor-pointer whitespace-nowrap shrink-0 text-stroke-nav focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
          >
            HOME
          </button>

          <button
            type="button"
            onClick={onHowToPlayClick}
            className="font-display font-bold text-[11px] sm:text-sm tracking-wide text-white px-3 sm:px-5 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] rounded-full bg-gradient-to-b from-amber-400 to-orange-500 border-2 border-orange-900 shadow-[0_3px_0_#9a3412] hover:brightness-105 active:translate-y-0.5 active:shadow-[0_1px_0_#9a3412] transition-all cursor-pointer whitespace-nowrap shrink-0 text-stroke-nav focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            HOW TO PLAY
          </button>

          <button
            type="button"
            onClick={onParentsTeachersClick}
            className="font-display font-bold text-[11px] sm:text-sm tracking-wide text-white px-3 sm:px-5 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] rounded-full bg-gradient-to-b from-purple-400 to-purple-700 border-2 border-purple-950 shadow-[0_3px_0_#4c1d95] hover:brightness-105 active:translate-y-0.5 active:shadow-[0_1px_0_#4c1d95] transition-all cursor-pointer whitespace-nowrap shrink-0 text-stroke-nav focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300"
          >
            PARENTS &amp; TEACHERS
          </button>
        </nav>

        {/* Row 1 Right: Sound Toggle + Gold Medal Score Badge + Stage Pill */}
        <div className="order-2 lg:order-3 flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            data-sound-toggle="true"
            onClick={onToggleMute}
            aria-pressed={!muted}
            aria-label={muted ? 'Unmute voice and sound effects' : 'Mute voice and sound effects'}
            title={muted ? 'Turn sound on' : 'Turn sound off'}
            className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 min-h-[36px] sm:min-h-[40px] rounded-full border-2 font-display font-bold text-[11px] sm:text-sm shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
              muted
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-400 text-slate-700'
                : 'bg-sky-100 hover:bg-sky-200 border-sky-500 text-sky-900'
            }`}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />}
            <span className="sm:hidden">{muted ? 'Muted' : 'ON'}</span>
            <span className="hidden sm:inline">{muted ? 'Muted 🔇' : 'Sound ON 🔊'}</span>
          </button>

          <div
            className={`relative flex items-center gap-1 sm:gap-2 pl-1.5 pr-2.5 sm:pl-2 sm:pr-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-amber-700 shadow-[0_2px_0_#b45309] sm:shadow-[0_3px_0_#b45309] transition-transform duration-200 ${
              scoreAnimating ? 'scale-110' : 'scale-100'
            }`}
            aria-live="polite"
          >
            {/* Gold Medal Star Icon */}
            <svg viewBox="0 0 40 44" className="w-5 h-6 sm:w-8 sm:h-8 -my-0.5 sm:-my-1 shrink-0" aria-hidden="true">
              <path d="M12 26 L8 42 L16 37 L20 42 L20 26 Z" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M28 26 L32 42 L24 37 L20 42 L20 26 Z" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="20" cy="17" r="14" fill="#FACC15" stroke="#92400E" strokeWidth="2.2" />
              <circle cx="20" cy="17" r="10.5" fill="#FDE047" stroke="#D97706" strokeWidth="1.2" />
              <polygon
                points="20,9 22.4,14.2 28,14.9 23.8,18.7 24.9,24.2 20,21.5 15.1,24.2 16.2,18.7 12,14.9 17.6,14.2"
                fill="#F59E0B"
                stroke="#92400E"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-display font-bold text-xs sm:text-lg text-amber-950 tabular-nums whitespace-nowrap">
              SCORE: {score}
            </span>
          </div>

          {/* Subtle World Stage Pill */}
          <div
            title={
              nextMilestone
                ? `${stageInfo.title} · Next upgrade at ${nextMilestone} points!`
                : `${stageInfo.title} · Max Eco-World unlocked!`
            }
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border-2 font-display font-bold text-[11px] sm:text-sm shadow-xs whitespace-nowrap shrink-0 transition-colors ${stageInfo.pillClasses}`}
          >
            {stageInfo.badgeLabel}
          </div>
        </div>
      </div>
    </header>
  );
};
