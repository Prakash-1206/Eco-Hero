import React, { useRef, useState } from 'react';
import { FolderOpen, Camera, RotateCcw, CheckCircle2, X, Loader2, HelpCircle, Crop, Sparkles, Trophy } from 'lucide-react';
import { BIN_MAP, ClassificationResult, WasteCategory } from '../types/eco';
import { SampleItemsBar } from './SampleItemsBar';
import { CropSource, ImageCropper } from './ImageCropper';

interface DropStageProps {
  previewSrc: string | null;
  cropSource: CropSource | null;
  canAdjustCrop: boolean;
  isCameraOpen: boolean;
  errorMessage: string | null;
  isModelLoading: boolean;
  isClassifying: boolean;
  result: ClassificationResult | null;
  guessMode: boolean;
  awaitingGuess: boolean;
  guessedCategory: WasteCategory | null;
  onToggleGuessMode: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onFileSelected: (file: File) => void;
  onSampleSelected: (imageSrc: string, fileName: string, category: WasteCategory) => void;
  onStartCamera: () => void;
  onSnapPhoto: () => void;
  onStopCamera: () => void;
  onConfirmCrop: (croppedCanvas: HTMLCanvasElement, previewDataUrl: string) => void;
  onAdjustCrop: () => void;
  onReset: () => void;
}

const CameraMascot: React.FC = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -bottom-3 -right-2 sm:bottom-1 sm:right-3 w-20 sm:w-28 z-20 drop-shadow-md"
  >
    <svg viewBox="0 0 130 120" className="w-full h-auto">
      {/* Left waving arm */}
      <path d="M26 68 Q10 56 12 40" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
      <circle cx="11" cy="37" r="6" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2.5" />
      {/* Right arm */}
      <path d="M104 68 Q118 76 116 90" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
      <circle cx="116" cy="92" r="6" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2.5" />
      {/* Little legs & shoes */}
      <line x1="50" y1="92" x2="48" y2="108" stroke="#334155" strokeWidth="5.5" strokeLinecap="round" />
      <ellipse cx="44" cy="110" rx="9" ry="5" fill="#475569" stroke="#1E293B" strokeWidth="2.2" />
      <line x1="80" y1="92" x2="82" y2="108" stroke="#334155" strokeWidth="5.5" strokeLinecap="round" />
      <ellipse cx="86" cy="110" rx="9" ry="5" fill="#475569" stroke="#1E293B" strokeWidth="2.2" />

      {/* Camera Top Viewfinder & Shutter */}
      <rect x="44" y="25" width="38" height="14" rx="5" fill="#CBD5E1" stroke="#1E293B" strokeWidth="3" />
      <rect x="28" y="30" width="14" height="7" rx="3" fill="#EF4444" stroke="#1E293B" strokeWidth="2.4" />
      <rect x="88" y="28" width="12" height="9" rx="2.5" fill="#FACC15" stroke="#1E293B" strokeWidth="2.4" />

      {/* Camera Body */}
      <rect x="22" y="36" width="86" height="58" rx="14" fill="#F1F5F9" stroke="#1E293B" strokeWidth="3.2" />
      <rect x="22" y="54" width="86" height="28" fill="#64748B" opacity="0.22" />

      {/* Big Friendly Lens */}
      <circle cx="65" cy="65" r="21" fill="#334155" stroke="#0F172A" strokeWidth="3" />
      <circle cx="65" cy="65" r="15" fill="#1E293B" stroke="#94A3B8" strokeWidth="2.2" />
      <circle cx="65" cy="65" r="9" fill="#0F172A" />
      <circle cx="60" cy="60" r="3.5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="70" cy="69" r="1.8" fill="#38BDF8" opacity="0.8" />

      {/* Cute Smile & Eyes above lens */}
      <circle cx="36" cy="48" r="2.8" fill="#0F172A" />
      <circle cx="94" cy="48" r="2.8" fill="#0F172A" />
      <path d="M58 44 Q65 50 72 44" fill="none" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  </div>
);

export const DropStage: React.FC<DropStageProps> = ({
  previewSrc,
  cropSource,
  canAdjustCrop,
  isCameraOpen,
  errorMessage,
  isModelLoading,
  isClassifying,
  result,
  guessMode,
  awaitingGuess,
  guessedCategory,
  onToggleGuessMode,
  videoRef,
  onFileSelected,
  onSampleSelected,
  onStartCamera,
  onSnapPhoto,
  onStopCamera,
  onConfirmCrop,
  onAdjustCrop,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    setFileError(null);
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setFileError('Oops! Please pick or drop an image picture file (PNG, JPG, or WEBP).');
      return;
    }
    onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const activeBin = result ? BIN_MAP[result.category] : null;

  return (
    <main className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 pt-1.5 sm:pt-2 pb-1 flex flex-col items-center">
      {/* Title Row + Ribbon Banner */}
      <div className="relative w-full flex flex-col items-center mb-1.5">
        {/* Arched / Playful Main Title */}
        <div className="w-full max-w-3xl flex justify-center overflow-hidden">
          <svg
            viewBox="0 0 800 92"
            className="w-full max-w-[680px] h-auto"
            role="heading"
            aria-level={1}
            aria-label="ECO HERO: KIDS GARBAGE SORTER!"
          >
            <defs>
              <path id="title-arch" d="M 42 76 Q 400 14 758 76" />
              <linearGradient id="title-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFF066" />
                <stop offset="55%" stopColor="#FFB703" />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>
            </defs>
            {/* Dark outline stroke layer */}
            <text
              textAnchor="middle"
              fontFamily="Fredoka, sans-serif"
              fontWeight="700"
              fontSize="38"
              letterSpacing="1.2"
              fill="#3F2818"
              stroke="#3F2818"
              strokeWidth="9"
              strokeLinejoin="round"
            >
              <textPath href="#title-arch" startOffset="50%">
                ECO HERO: KIDS GARBAGE SORTER!
              </textPath>
            </text>
            {/* Bright yellow-orange fill layer */}
            <text
              textAnchor="middle"
              fontFamily="Fredoka, sans-serif"
              fontWeight="700"
              fontSize="38"
              letterSpacing="1.2"
              fill="url(#title-grad)"
            >
              <textPath href="#title-arch" startOffset="50%">
                ECO HERO: KIDS GARBAGE SORTER!
              </textPath>
            </text>
          </svg>
        </div>

        {/* Ribbon Banner "Sort & Save the Planet!" positioned to top-right on desktop, centered below on mobile/tablet */}
        <div className="lg:absolute lg:right-2 lg:top-10 flex items-center gap-1.5 -mt-0.5 lg:mt-0 z-20">
          <svg
            aria-hidden="true"
            viewBox="0 0 48 40"
            className="hidden lg:block w-10 h-8 -mt-4 -mr-1 text-amber-400 drop-shadow-sm"
          >
            <path
              d="M6 8 Q32 8 36 30"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <polygon points="36,36 27,25 44,24" fill="#FBBF24" stroke="#451A03" strokeWidth="2" strokeLinejoin="round" />
          </svg>

          <div className="relative px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-xl bg-[#FFF6D6] border-2 border-[#6B4423] shadow-[0_3px_0_#6B4423] rotate-1">
            <span className="font-display font-bold text-xs sm:text-sm text-[#4A2E14] whitespace-nowrap">
              Sort &amp; Save the Planet!
            </span>
          </div>
        </div>
      </div>

      {/* Main Wooden-Framed Drop & Preview Box */}
      <div className="relative w-[92%] max-w-[600px] mx-auto">
        {/* Playful Quiz Mode Toggle Bar near top of wooden drop box */}
        <div className="flex justify-center mb-1.5 relative z-20">
          <button
            type="button"
            role="switch"
            aria-checked={guessMode}
            onClick={onToggleGuessMode}
            className={`inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border-2 shadow-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
              guessMode
                ? 'bg-gradient-to-b from-amber-100 to-amber-200 border-amber-700 text-[#4A2E14]'
                : 'bg-white/85 border-slate-400 text-slate-700'
            }`}
          >
            <span className="font-display font-bold text-xs sm:text-sm whitespace-nowrap">
              Guess Before You Scan! 🧠
            </span>
            <span
              className={`relative inline-flex items-center w-12 h-6 rounded-full border-2 transition-colors px-1 ${
                guessMode
                  ? 'bg-emerald-500 border-emerald-900 justify-end'
                  : 'bg-slate-300 border-slate-500 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-xs border border-black/15" />
            </span>
            <span className="font-display font-bold text-xs uppercase tracking-wide">
              {guessMode ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
        {/* Decorative Little Sun on Top-Right Corner of Wood Frame */}
        <div aria-hidden="true" className="hidden sm:block absolute -top-4 -right-3 w-11 h-11 z-20">
          <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-sm">
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="25"
                y1="3"
                x2="25"
                y2="9"
                stroke="#F59E0B"
                strokeWidth="3"
                strokeLinecap="round"
                transform={`rotate(${i * 45} 25 25)`}
              />
            ))}
            <circle cx="25" cy="25" r="13" fill="#FDE047" stroke="#92400E" strokeWidth="2.2" />
            <circle cx="21" cy="23" r="1.5" fill="#451A03" />
            <circle cx="29" cy="23" r="1.5" fill="#451A03" />
            <path d="M21 28 Q25 32 29 28" fill="none" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>

        {/* Decorative Flower on Bottom-Left Corner */}
        <div aria-hidden="true" className="hidden sm:block absolute -bottom-3 -left-4 w-12 h-12 z-20">
          <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-sm">
            <path d="M18 46 Q8 34 16 24 Q28 28 24 44 Z" fill="#65A30D" stroke="#365314" strokeWidth="2" />
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle key={deg} cx="34" cy="24" r="7.5" fill="#FB7185" stroke="#881337" strokeWidth="1.8" transform={`rotate(${deg} 34 34)`} />
            ))}
            <circle cx="34" cy="34" r="6" fill="#FDE047" stroke="#92400E" strokeWidth="1.8" />
          </svg>
        </div>

        {/* Wooden Outer Frame */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-[28px] p-3 sm:p-3.5 transition-all duration-200 ${
            isDragging
              ? 'scale-[1.02] ring-4 ring-amber-300'
              : ''
          }`}
          style={{
            background: 'linear-gradient(180deg, #C98242 0%, #A9642C 50%, #8D4E1E 100%)',
            border: '4px solid #4A2810',
            boxShadow: '0 8px 0 #5C3214, 0 14px 28px rgba(45, 25, 10, 0.25)',
          }}
        >
          {/* Wood grain detail lines */}
          <div aria-hidden="true" className="pointer-events-none absolute top-1.5 left-8 right-12 h-0.5 rounded-full bg-amber-200/30" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-1.5 left-12 right-16 h-0.5 rounded-full bg-amber-950/25" />

          {/* Warm Cream Inner Canvas */}
          <div
            className={`relative rounded-[18px] bg-[#FCE99F] border-2 border-[#7A4419] p-2 sm:p-3 min-h-[260px] sm:min-h-[300px] flex flex-col items-center justify-center overflow-hidden ${
              isDragging ? 'bg-[#FFF3B0]' : ''
            }`}
          >
            {/* Dashed Inner Drop Zone Border */}
            <div
              className={`w-full h-full min-h-[240px] sm:min-h-[276px] rounded-xl border-[3px] border-dashed transition-colors flex flex-col items-center justify-center p-2.5 sm:p-3 text-center relative ${
                isDragging
                  ? 'border-orange-500 bg-orange-100/60'
                  : 'border-[#B68238]/75 bg-[#FFF4C2]/60'
              }`}
            >
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = '';
                }}
              />

              {/* STATE 1: Live Webcam Stream with 1:1 Target Framing Square */}
              {isCameraOpen ? (
                <div className="relative w-full flex flex-col items-center gap-2 z-20">
                  <p className="text-xs sm:text-sm font-display font-bold text-[#4A2E14] px-1">
                    Put your trash item inside the square, then click Snap Photo!
                  </p>
                  <div className="relative w-full max-w-[360px] aspect-[4/3] sm:aspect-video rounded-xl overflow-hidden border-3 border-sky-700 bg-slate-900 shadow-inner">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      onLoadedMetadata={(e) => {
                        e.currentTarget.play().catch(() => {});
                      }}
                      className="w-full h-full object-cover"
                    />
                    {/* Centered 85%-of-smaller-dimension bright dashed square guide with lighter outer dim */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-[3px] border-dashed border-amber-300 rounded-xl"
                      style={{
                        height: '85%',
                        aspectRatio: '1 / 1',
                        boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.36)',
                      }}
                    >
                      <span className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-4 border-l-4 border-white rounded-tl" />
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-4 border-r-4 border-white rounded-tr" />
                      <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-4 border-l-4 border-white rounded-bl" />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-4 border-r-4 border-white rounded-br" />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 z-30">
                    <button
                      type="button"
                      onClick={onSnapPhoto}
                      className="inline-flex items-center justify-center gap-2 font-display font-bold text-sm sm:text-base text-white px-5 py-2 min-h-[44px] rounded-full bg-gradient-to-b from-emerald-400 to-green-600 border-2 border-green-900 btn-3d-green hover:brightness-105 cursor-pointer whitespace-nowrap"
                    >
                      <Camera className="w-4 h-4" />
                      Snap Photo!
                    </button>
                    <button
                      type="button"
                      onClick={onStopCamera}
                      className="inline-flex items-center justify-center gap-1 font-display font-bold text-sm text-slate-700 px-4 py-2 min-h-[44px] rounded-full bg-white hover:bg-slate-100 border-2 border-slate-400 cursor-pointer whitespace-nowrap"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : cropSource ? (
                /* STATE 2: Interactive Square Cropper */
                <ImageCropper
                  source={cropSource}
                  disabled={isClassifying}
                  onConfirmCrop={onConfirmCrop}
                  onRetakePhoto={onStartCamera}
                  onChooseAnother={() => fileInputRef.current?.click()}
                  onCancel={onReset}
                />
              ) : previewSrc ? (
                /* STATE 3: Preview Image + Classifying / Result */
                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 z-10 px-1 sm:pr-10">
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-3 border-[#7A4419] bg-white shadow-md shrink-0">
                    <img
                      src={previewSrc}
                      alt="Item to sort"
                      className="w-full h-full object-contain bg-white"
                      referrerPolicy="no-referrer"
                    />
                    {isClassifying && (
                      <div aria-hidden="true" className="absolute inset-0 bg-sky-400/20 overflow-hidden">
                        <div className="w-full h-8 bg-gradient-to-b from-transparent via-amber-300/75 to-transparent animate-scan-sweep" />
                      </div>
                    )}
                  </div>

                  {/* Classifying Spinner, Quiz Prompt, Cheerful Result, or Friendly Error */}
                  <div className="w-full max-w-[92vw] sm:max-w-[360px] max-h-[80vh] overflow-y-auto flex flex-col items-center sm:items-start text-center sm:text-left">
                    {isClassifying ? (
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 font-display font-bold text-base sm:text-xl text-amber-900">
                          <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                          <span>{isModelLoading ? 'Loading AI Sorter...' : 'Checking your item...'}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-amber-800/80">
                          Our Eco Hero scanner is finding the right bin!
                        </p>
                      </div>
                    ) : awaitingGuess && result && result.isConfident ? (
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 border border-purple-400 text-purple-900 font-display font-bold text-xs">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          <span>Eco-Detective Challenge!</span>
                        </div>
                        <p className="font-display font-bold text-sm sm:text-lg leading-snug text-[#3F2818]">
                          Which bin does this go in? Tap a bin below to guess!
                        </p>
                        <p className="text-xs font-bold text-[#6B4423]">
                          Guess right for <span className="text-emerald-700 font-extrabold">+20 Bonus Points!</span>
                        </p>
                        <button
                          type="button"
                          onClick={onReset}
                          className="inline-flex items-center justify-center gap-1 font-display font-bold text-xs text-slate-700 px-3.5 py-1.5 min-h-[40px] rounded-full bg-white/90 hover:bg-white border border-slate-400 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      </div>
                    ) : result && activeBin && result.isConfident ? (
                      <div className="w-full space-y-1.5">
                        {guessedCategory === result.category ? (
                          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-emerald-700 font-display font-bold text-xs sm:text-sm leading-snug">
                            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>
                              SUPER ECO-DETECTIVE! You guessed right! It goes in the {result.category}! (+20 Points)
                            </span>
                          </div>
                        ) : guessedCategory !== null ? (
                          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-amber-900 font-display font-bold text-xs sm:text-sm leading-snug">
                            <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
                            <span>
                              Nice try! You picked {guessedCategory}, but this actually goes in the {result.category}! (+5 Points)
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-emerald-700 font-display font-bold text-xs sm:text-sm leading-snug">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>Awesome! That goes in the {result.category} bin! +10 Points</span>
                          </div>
                        )}

                        <p className="text-[11px] font-extrabold text-[#4A2E14] tabular-nums">
                          Confidence:{' '}
                          <span className={activeBin.accentText}>{result.confidence}% match</span>
                        </p>

                        {/* Feature 2: "What Happens Next?" Recycling Transformation Card */}
                        <div
                          className={`w-full rounded-2xl px-3 py-2 border-2 shadow-xs text-left ${activeBin.accentBg} ${activeBin.accentBorder}`}
                        >
                          <p className={`font-display font-bold text-xs mb-0.5 ${activeBin.accentText}`}>
                            What Happens Next? ✨
                          </p>
                          <p className="text-xs font-bold text-slate-800 leading-snug">
                            {activeBin.transformation}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={onReset}
                          className="inline-flex items-center justify-center gap-1.5 font-display font-bold text-xs sm:text-sm text-white px-4 py-2 min-h-[44px] rounded-full bg-gradient-to-b from-emerald-400 to-green-600 border-2 border-green-900 btn-3d-green cursor-pointer whitespace-nowrap"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Sort Another Item
                        </button>
                      </div>
                    ) : result && !result.isConfident ? (
                      <div className="space-y-2">
                        <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-amber-900 font-display font-bold text-xs sm:text-sm">
                          <HelpCircle className="w-4 h-4 text-orange-500 shrink-0" />
                          <span>Hmm, I&apos;m not quite sure what that is!</span>
                        </div>
                        <p className="text-xs font-bold text-[#5C3A1D] leading-snug bg-white/80 rounded-xl px-3 py-2 border border-amber-400/80">
                          Please adjust the crop box, click another photo, or upload a clearer, better-lit image!
                        </p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          {canAdjustCrop && (
                            <button
                              type="button"
                              onClick={onAdjustCrop}
                              className="inline-flex items-center gap-1.5 font-display font-bold text-xs sm:text-sm text-white px-3.5 py-1.5 rounded-full bg-gradient-to-b from-emerald-400 to-green-600 border-2 border-green-900 btn-3d-green cursor-pointer whitespace-nowrap"
                            >
                              <Crop className="w-3.5 h-3.5" />
                              Adjust Crop
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={onStartCamera}
                            className="inline-flex items-center gap-1.5 font-display font-bold text-xs sm:text-sm text-white px-3.5 py-1.5 rounded-full bg-gradient-to-b from-sky-400 to-blue-600 border-2 border-blue-950 btn-3d-blue cursor-pointer whitespace-nowrap"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            Retake Photo
                          </button>
                          <button
                            type="button"
                            onClick={onReset}
                            className="inline-flex items-center gap-1.5 font-display font-bold text-xs sm:text-sm text-white px-3.5 py-1.5 rounded-full bg-gradient-to-b from-amber-400 to-orange-600 border-2 border-orange-950 btn-3d-orange cursor-pointer whitespace-nowrap"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Try Again
                          </button>
                        </div>
                      </div>
                    ) : errorMessage ? (
                      <div className="space-y-2">
                        <p className="text-xs sm:text-sm font-bold text-rose-900 bg-rose-100 border-2 border-rose-400 rounded-xl px-3 py-2">
                          {errorMessage}
                        </p>
                        <button
                          type="button"
                          onClick={onReset}
                          className="inline-flex items-center gap-1.5 font-display font-bold text-xs sm:text-sm text-white px-4 py-1.5 rounded-full bg-gradient-to-b from-amber-400 to-orange-600 border-2 border-orange-900 btn-3d-orange cursor-pointer whitespace-nowrap"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Try Another Item
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                /* STATE 3: Idle Drop Box Prompt */
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group w-full h-full flex flex-col items-center justify-center py-4 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400 rounded-lg"
                >
                  {/* Decorative Corner Sparkles matching reference */}
                  <svg aria-hidden="true" className="w-8 h-8 text-amber-500/80 mb-1 group-hover:scale-110 transition-transform" viewBox="0 0 40 40">
                    <path d="M20 4 L23 16 L35 19 L23 22 L20 34 L17 22 L5 19 L17 16 Z" fill="#FDE047" stroke="#B45309" strokeWidth="1.8" strokeLinejoin="round" />
                  </svg>
                  <span className="font-display font-bold text-2xl sm:text-3xl tracking-wide text-[#4A2E14] leading-tight">
                    DROP AN ITEM
                    <br />
                    HERE!
                  </span>
                  <span className="mt-1.5 text-xs sm:text-sm font-extrabold text-[#7A5124]">
                    Drag &amp; drop a picture, or click to choose a file
                  </span>
                  {isModelLoading && (
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-800/80">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Warming up Eco Hero AI...
                    </span>
                  )}
                </button>
              )}

              {/* Friendly Inline Errors when not in preview state (Camera / File Type) */}
              {!previewSrc && (errorMessage || fileError) && (
                <div
                  role="alert"
                  className="mt-2 px-3 py-1.5 rounded-xl bg-rose-100 border-2 border-rose-400 text-rose-900 text-xs font-bold max-w-md z-30"
                >
                  {errorMessage || fileError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cute Waving Camera Mascot on Bottom Right (hidden on small screens during camera/crop so controls stay unobstructed) */}
        {!(isCameraOpen || cropSource) ? (
          <CameraMascot />
        ) : (
          <div className="hidden sm:block">
            <CameraMascot />
          </div>
        )}
      </div>

      {/* Primary Action Buttons Directly Below Drop Box */}
      <div className="relative z-20 w-[92%] max-w-[600px] grid grid-cols-2 lg:flex lg:w-auto items-center justify-center gap-2 sm:gap-4 mt-3">
        <button
          type="button"
          disabled={isClassifying}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center justify-center gap-1.5 sm:gap-2.5 w-full lg:w-auto min-h-[48px] font-display font-bold text-sm sm:text-lg text-white px-3 sm:px-7 py-2.5 rounded-full bg-gradient-to-b from-amber-400 via-orange-500 to-orange-600 border-2 border-orange-950 btn-3d-orange hover:brightness-105 transition-all cursor-pointer disabled:opacity-60 whitespace-nowrap text-stroke-nav focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
        >
          <span>Upload Image</span>
          <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        </button>

        <button
          type="button"
          disabled={isClassifying}
          onClick={isCameraOpen ? onSnapPhoto : onStartCamera}
          className="inline-flex items-center justify-center gap-1.5 sm:gap-2.5 w-full lg:w-auto min-h-[48px] font-display font-bold text-sm sm:text-lg text-white px-3 sm:px-7 py-2.5 rounded-full bg-gradient-to-b from-sky-400 via-blue-500 to-blue-600 border-2 border-blue-950 btn-3d-blue hover:brightness-105 transition-all cursor-pointer disabled:opacity-60 whitespace-nowrap text-stroke-nav focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
        >
          <span>{isCameraOpen ? 'Snap Photo!' : 'Take Photo'}</span>
          <Camera className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        </button>
      </div>

      {/* Subtext Below Buttons */}
      <p className="mt-2 font-display font-bold text-sm sm:text-base text-[#1E3A5F] tracking-wide text-center">
        Show us what you want to sort!
      </p>

      {/* Quick Try Sample Items Bar */}
      <SampleItemsBar disabled={isClassifying} onSelectSample={onSampleSelected} />
    </main>
  );
};
