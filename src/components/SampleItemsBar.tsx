import React from 'react';
import { WasteCategory } from '../types/eco';

interface SampleItemsBarProps {
  disabled: boolean;
  onSelectSample: (imageSrc: string, label: string, category: WasteCategory) => void;
}

interface SampleItem {
  label: string;
  category: WasteCategory;
  emojiLabel: string;
  bgColor: string;
  borderColor: string;
  drawCanvas: (ctx: CanvasRenderingContext2D) => void;
}

function createSampleDataUrl(draw: (ctx: CanvasRenderingContext2D) => void): string {
  const canvas = document.createElement('canvas');
  canvas.width = 240;
  canvas.height = 240;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#FFFDF2';
    ctx.fillRect(0, 0, 240, 240);
    draw(ctx);
  }
  return canvas.toDataURL('image/png');
}

const SAMPLE_ITEMS: SampleItem[] = [
  {
    label: 'Newspaper',
    category: 'Paper Waste',
    emojiLabel: 'Paper',
    bgColor: 'bg-sky-100 hover:bg-sky-200',
    borderColor: 'border-sky-400 text-sky-900',
    drawCanvas: (ctx) => {
      ctx.fillStyle = '#E0F2FE';
      ctx.fillRect(0, 0, 240, 240);
      ctx.save();
      ctx.translate(120, 120);
      ctx.rotate(-0.08);
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 6;
      ctx.fillRect(-65, -75, 130, 150);
      ctx.strokeRect(-65, -75, 130, 150);
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(-48, -56, 96, 22);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(-48, -20, 44, 44);
      ctx.fillRect(4, -20, 44, 12);
      ctx.fillRect(4, 2, 44, 12);
      ctx.fillRect(-48, 36, 96, 12);
      ctx.fillRect(-48, 56, 72, 12);
      ctx.restore();
    },
  },
  {
    label: 'Glass Jar',
    category: 'Glass Waste',
    emojiLabel: 'Glass',
    bgColor: 'bg-emerald-100 hover:bg-emerald-200',
    borderColor: 'border-emerald-400 text-emerald-900',
    drawCanvas: (ctx) => {
      ctx.fillStyle = '#ECFDF5';
      ctx.fillRect(0, 0, 240, 240);
      ctx.fillStyle = '#6EE7B7';
      ctx.strokeStyle = '#065F46';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(72, 72, 96, 126, 18);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#10B981';
      ctx.fillRect(86, 44, 68, 28);
      ctx.strokeRect(86, 44, 68, 28);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(90, 96, 14, 78);
    },
  },
  {
    label: 'Apple Core',
    category: 'Organic Waste',
    emojiLabel: 'Organic',
    bgColor: 'bg-amber-100 hover:bg-amber-200',
    borderColor: 'border-amber-500 text-amber-950',
    drawCanvas: (ctx) => {
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(0, 0, 240, 240);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(116, 40, 10, 32);
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.ellipse(144, 52, 22, 10, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FEF08A';
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(85, 72);
      ctx.quadraticCurveTo(106, 120, 85, 174);
      ctx.lineTo(155, 174);
      ctx.quadraticCurveTo(134, 120, 155, 72);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.ellipse(120, 74, 48, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(120, 176, 46, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    },
  },
  {
    label: 'Soda Can',
    category: 'Metal Waste',
    emojiLabel: 'Metal',
    bgColor: 'bg-rose-100 hover:bg-rose-200',
    borderColor: 'border-rose-400 text-rose-900',
    drawCanvas: (ctx) => {
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(0, 0, 240, 240);
      ctx.fillStyle = '#EF4444';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(78, 56, 84, 134, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(82, 54, 76, 16);
      ctx.strokeRect(82, 54, 76, 16);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(82, 108, 76, 26);
    },
  },
  {
    label: 'Water Bottle',
    category: 'Plastic Waste',
    emojiLabel: 'Plastic',
    bgColor: 'bg-yellow-100 hover:bg-yellow-200',
    borderColor: 'border-yellow-500 text-yellow-950',
    drawCanvas: (ctx) => {
      ctx.fillStyle = '#FEFCE8';
      ctx.fillRect(0, 0, 240, 240);
      ctx.fillStyle = '#0284C7';
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 5;
      ctx.fillRect(102, 34, 36, 20);
      ctx.strokeRect(102, 34, 36, 20);
      ctx.fillStyle = '#BAE6FD';
      ctx.beginPath();
      ctx.roundRect(80, 64, 80, 136, 20);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(83, 108, 74, 42);
    },
  },
];

export const SampleItemsBar: React.FC<SampleItemsBarProps> = ({ disabled, onSelectSample }) => {
  return (
    <div className="w-full max-w-[92%] sm:max-w-none flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-2">
      <span className="text-xs font-extrabold text-sky-950/75 mr-0.5">Quick try:</span>
      {SAMPLE_ITEMS.map((item) => (
        <button
          key={item.label}
          type="button"
          disabled={disabled}
          onClick={() => {
            const dataUrl = createSampleDataUrl(item.drawCanvas);
            onSelectSample(dataUrl, `${item.label}.png`, item.category);
          }}
          className={`px-3 py-1.5 sm:py-1 min-h-[36px] sm:min-h-[32px] rounded-full border-2 text-xs font-bold shadow-xs transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${item.bgColor} ${item.borderColor}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
