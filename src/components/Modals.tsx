import React from 'react';
import { X, Upload, Camera, Sparkles, Recycle, BookOpen, GraduationCap } from 'lucide-react';
import { WASTE_BINS } from '../types/eco';
import { isModelConfigured, MODEL_URL } from '../lib/classifier';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
      onClick={onClose}
    >
      <div
        className="relative w-[92vw] max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl bg-[#FFFDF5] border-4 border-amber-500 shadow-2xl p-4 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close How to Play"
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 border-2 border-amber-500 text-amber-900 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 border-2 border-orange-900 flex items-center justify-center text-white shadow-sm shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 id="how-to-play-title" className="font-display font-bold text-2xl sm:text-3xl text-orange-600">
              How to Play Eco Hero!
            </h2>
            <p className="text-sm font-bold text-slate-600">3 super easy steps to become a Planet Protector</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl bg-orange-50 border-2 border-orange-200 p-4 text-center">
            <div className="w-11 h-11 mx-auto mb-2 rounded-full bg-orange-500 text-white flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-orange-900 mb-1">1. Pick an Item</h3>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              Drag and drop a trash picture, click Upload Image, or try a quick sample!
            </p>
          </div>

          <div className="rounded-2xl bg-sky-50 border-2 border-sky-200 p-4 text-center">
            <div className="w-11 h-11 mx-auto mb-2 rounded-full bg-sky-500 text-white flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-sky-900 mb-1">2. Or Snap a Photo</h3>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              Hold a bottle, can, or apple core up to your camera and press Snap Photo!
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-200 p-4 text-center">
            <div className="w-11 h-11 mx-auto mb-2 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-emerald-900 mb-1">3. Score +10 Points!</h3>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              Watch the matching bin mascot jump with confetti and learn a cool eco-fact!
            </p>
          </div>
        </div>

        <h3 className="font-display font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
          <Recycle className="w-5 h-5 text-green-600" />
          Meet Your 5 Recycling Bin Friends
        </h3>

        <div className="space-y-2">
          {WASTE_BINS.map((bin) => (
            <div
              key={bin.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 px-3.5 sm:px-4 py-2.5 rounded-2xl border-2 ${bin.accentBg} ${bin.accentBorder}`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-4 h-4 rounded-full border border-black/30 shrink-0"
                  style={{ backgroundColor: bin.bodyColor }}
                />
                <span className={`font-display font-bold text-sm sm:text-base ${bin.accentText}`}>
                  {bin.id}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-700 text-left sm:text-right">{bin.examples}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="font-display font-bold text-base text-white px-6 py-2.5 rounded-full bg-gradient-to-b from-green-400 to-green-600 border-2 border-green-900 btn-3d-green cursor-pointer"
          >
            Let&apos;s Start Sorting!
          </button>
        </div>
      </div>
    </div>
  );
};

export const ParentsTeachersModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const liveModelActive = isModelConfigured();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="parents-teachers-title"
      onClick={onClose}
    >
      <div
        className="relative w-[92vw] max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl bg-[#FFFDF5] border-4 border-purple-500 shadow-2xl p-4 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Parents and Teachers guide"
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200 border-2 border-purple-500 text-purple-900 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-purple-400 to-purple-700 border-2 border-purple-950 flex items-center justify-center text-white shadow-sm shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 id="parents-teachers-title" className="font-display font-bold text-2xl sm:text-3xl text-purple-700">
              Parents &amp; Teachers Guide
            </h2>
            <p className="text-sm font-bold text-slate-600">
              Classroom setup, kid-safe privacy &amp; Google Teachable Machine integration
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="rounded-2xl bg-purple-50 border-2 border-purple-200 p-4">
            <h3 className="font-display font-bold text-base text-purple-900 mb-1">
              Educational Goal &amp; Privacy
            </h3>
            <p className="font-semibold">
              Eco Hero introduces children ages 5–11 to waste sorting, recycling categories, and how
              machine learning recognizes everyday objects. All image classification and webcam
              captures run locally inside the browser—no photos are uploaded or stored on external
              servers.
            </p>
          </div>

          <div className="rounded-2xl bg-sky-50 border-2 border-sky-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="font-display font-bold text-base text-sky-900">
                Connecting Your Google Teachable Machine Model
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                  liveModelActive
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                    : 'bg-amber-100 border-amber-400 text-amber-900'
                }`}
              >
                {liveModelActive ? 'Live Model Connected' : 'Demo Simulation Active'}
              </span>
            </div>
            <ol className="list-decimal pl-5 space-y-1.5 font-semibold">
              <li>
                Open <strong>Google Teachable Machine</strong> and create an <strong>Image Project</strong>.
              </li>
              <li>
                Train 5 classes named: <code className="px-1.5 py-0.5 rounded bg-white border border-sky-200 text-xs font-mono">Paper Waste</code>,{' '}
                <code className="px-1.5 py-0.5 rounded bg-white border border-sky-200 text-xs font-mono">Glass Waste</code>,{' '}
                <code className="px-1.5 py-0.5 rounded bg-white border border-sky-200 text-xs font-mono">Organic Waste</code>,{' '}
                <code className="px-1.5 py-0.5 rounded bg-white border border-sky-200 text-xs font-mono">Metal Waste</code>, and{' '}
                <code className="px-1.5 py-0.5 rounded bg-white border border-sky-200 text-xs font-mono">Plastic Waste</code>.
              </li>
              <li>
                Click <strong>Export Model → Upload my model</strong> and copy your shareable link.
              </li>
              <li>
                Paste your link into <code className="px-1.5 py-0.5 rounded bg-white border border-sky-200 text-xs font-mono">MODEL_URL</code> inside{' '}
                <code className="px-1.5 py-0.5 rounded bg-white border border-sky-200 text-xs font-mono">src/lib/classifier.ts</code> (currently{' '}
                <code className="px-1.5 py-0.5 rounded bg-white border border-sky-200 text-xs font-mono break-all">{MODEL_URL}</code>).
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="font-display font-bold text-base text-white px-6 py-2.5 rounded-full bg-gradient-to-b from-purple-400 to-purple-700 border-2 border-purple-950 shadow-[0_4px_0_#4c1d95] hover:brightness-105 cursor-pointer"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
