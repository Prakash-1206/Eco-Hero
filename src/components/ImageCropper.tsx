import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Check, FolderOpen, Move, X } from 'lucide-react';

export interface CropSource {
  src: string;
  origin: 'camera' | 'upload';
}

interface ImageCropperProps {
  source: CropSource;
  disabled: boolean;
  onConfirmCrop: (croppedCanvas: HTMLCanvasElement, previewDataUrl: string) => void;
  onRetakePhoto: () => void;
  onChooseAnother: () => void;
  onCancel: () => void;
}

interface CropRect {
  x: number;
  y: number;
  size: number;
}

type DragMode = 'move' | 'nw' | 'ne' | 'sw' | 'se' | null;

export const ImageCropper: React.FC<ImageCropperProps> = ({
  source,
  disabled,
  onConfirmCrop,
  onRetakePhoto,
  onChooseAnother,
  onCancel,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const cropSurfaceRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [maxBounds, setMaxBounds] = useState<{ w: number; h: number }>({ w: 380, h: 230 });
  const [displayDims, setDisplayDims] = useState<{ w: number; h: number } | null>(null);
  const [naturalDims, setNaturalDims] = useState<{ w: number; h: number } | null>(null);
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, size: 100 });

  const cropRef = useRef<CropRect>(crop);
  cropRef.current = crop;

  const displayDimsRef = useRef<{ w: number; h: number } | null>(displayDims);
  displayDimsRef.current = displayDims;

  const dragStateRef = useRef<{
    mode: DragMode;
    inputType: 'touch' | 'pointer' | null;
    startClientX: number;
    startClientY: number;
    startCrop: CropRect;
  }>({
    mode: null,
    inputType: null,
    startClientX: 0,
    startClientY: 0,
    startCrop: { x: 0, y: 0, size: 100 },
  });

  // Measure available container width so canvas never overflows mobile (360px) screens
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const updateBounds = () => {
      const availW = el.clientWidth;
      if (availW <= 0) return;
      const maxW = Math.min(400, Math.max(200, availW - 8));
      const maxH = availW < 360 ? 200 : 240;
      setMaxBounds((prev) => (prev.w === maxW && prev.h === maxH ? prev : { w: maxW, h: maxH }));
    };

    updateBounds();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateBounds);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  // Load image and initialize natural dimensions + 85% centered square crop box
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      const natW = img.naturalWidth || img.width;
      const natH = img.naturalHeight || img.height;
      const scale = Math.min(maxBounds.w / natW, maxBounds.h / natH);
      const dispW = Math.max(1, Math.round(natW * scale));
      const dispH = Math.max(1, Math.round(natH * scale));

      setNaturalDims({ w: natW, h: natH });
      setDisplayDims({ w: dispW, h: dispH });

      // Pre-position centered square at 85% of the smaller dimension (height or width)
      const smallerDim = Math.min(dispW, dispH);
      const initialSize = Math.max(24, Math.round(smallerDim * 0.85));
      setCrop({
        x: Math.round((dispW - initialSize) / 2),
        y: Math.round((dispH - initialSize) / 2),
        size: initialSize,
      });

      requestAnimationFrame(() => {
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;
        canvas.width = natW;
        canvas.height = natH;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, natW, natH);
          ctx.drawImage(img, 0, 0, natW, natH);
        }
      });
    };
    img.src = source.src;

    return () => {
      cancelled = true;
    };
    // Only re-initialize crop box when source image changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source.src]);

  // Proportionally scale displayDims & crop when viewport width changes (e.g. tablet rotation)
  useEffect(() => {
    if (!naturalDims || !displayDimsRef.current) return;
    const prevDisp = displayDimsRef.current;
    const scale = Math.min(maxBounds.w / naturalDims.w, maxBounds.h / naturalDims.h);
    const nextW = Math.max(1, Math.round(naturalDims.w * scale));
    const nextH = Math.max(1, Math.round(naturalDims.h * scale));
    if (nextW === prevDisp.w && nextH === prevDisp.h) return;

    const ratio = nextW / prevDisp.w;
    setDisplayDims({ w: nextW, h: nextH });
    setCrop((prev) => {
      const smaller = Math.min(nextW, nextH);
      const nextSize = Math.max(
        Math.round(smaller * 0.3),
        Math.min(Math.round(smaller * 0.95), Math.round(prev.size * ratio))
      );
      return {
        x: Math.max(0, Math.min(nextW - nextSize, Math.round(prev.x * ratio))),
        y: Math.max(0, Math.min(nextH - nextSize, Math.round(prev.y * ratio))),
        size: nextSize,
      };
    });
  }, [maxBounds, naturalDims]);

  const applyDragDelta = useCallback((clientX: number, clientY: number) => {
    const { mode, startClientX, startClientY, startCrop } = dragStateRef.current;
    const dims = displayDimsRef.current;
    if (!mode || !dims) return;

    const dx = clientX - startClientX;
    const dy = clientY - startClientY;
    const smallerDim = Math.min(dims.w, dims.h);
    const maxSquare = Math.max(24, Math.round(smallerDim * 0.95));
    const minSquare = Math.max(24, Math.round(smallerDim * 0.3));

    if (mode === 'move') {
      const nextX = Math.max(0, Math.min(dims.w - startCrop.size, startCrop.x + dx));
      const nextY = Math.max(0, Math.min(dims.h - startCrop.size, startCrop.y + dy));
      setCrop({ ...startCrop, x: Math.round(nextX), y: Math.round(nextY) });
      return;
    }

    if (mode === 'se') {
      const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      const maxAllowed = Math.min(maxSquare, dims.w - startCrop.x, dims.h - startCrop.y);
      const nextSize = Math.max(minSquare, Math.min(maxAllowed, startCrop.size + delta));
      setCrop({ x: startCrop.x, y: startCrop.y, size: Math.round(nextSize) });
      return;
    }

    if (mode === 'nw') {
      const right = startCrop.x + startCrop.size;
      const bottom = startCrop.y + startCrop.size;
      const delta = Math.abs(dx) > Math.abs(dy) ? -dx : -dy;
      const maxAllowed = Math.min(maxSquare, right, bottom);
      const nextSize = Math.round(Math.max(minSquare, Math.min(maxAllowed, startCrop.size + delta)));
      setCrop({
        x: right - nextSize,
        y: bottom - nextSize,
        size: nextSize,
      });
      return;
    }

    if (mode === 'ne') {
      const left = startCrop.x;
      const bottom = startCrop.y + startCrop.size;
      const delta = Math.abs(dx) > Math.abs(dy) ? dx : -dy;
      const maxAllowed = Math.min(maxSquare, dims.w - left, bottom);
      const nextSize = Math.round(Math.max(minSquare, Math.min(maxAllowed, startCrop.size + delta)));
      setCrop({
        x: left,
        y: bottom - nextSize,
        size: nextSize,
      });
      return;
    }

    if (mode === 'sw') {
      const right = startCrop.x + startCrop.size;
      const top = startCrop.y;
      const delta = Math.abs(dx) > Math.abs(dy) ? -dx : dy;
      const maxAllowed = Math.min(maxSquare, right, dims.h - top);
      const nextSize = Math.round(Math.max(minSquare, Math.min(maxAllowed, startCrop.size + delta)));
      setCrop({
        x: right - nextSize,
        y: top,
        size: nextSize,
      });
    }
  }, []);

  // Non-passive touchmove listener on crop surface prevents page scroll on iOS/Android while dragging/resizing
  useEffect(() => {
    const surface = cropSurfaceRef.current;
    if (!surface) return;

    const onNativeTouchMove = (e: TouchEvent) => {
      if (dragStateRef.current.mode && dragStateRef.current.inputType === 'touch') {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) {
          applyDragDelta(touch.clientX, touch.clientY);
        }
      }
    };

    const onNativeTouchEnd = () => {
      if (dragStateRef.current.inputType === 'touch') {
        dragStateRef.current.mode = null;
        dragStateRef.current.inputType = null;
      }
    };

    surface.addEventListener('touchmove', onNativeTouchMove, { passive: false });
    surface.addEventListener('touchend', onNativeTouchEnd);
    surface.addEventListener('touchcancel', onNativeTouchEnd);
    return () => {
      surface.removeEventListener('touchmove', onNativeTouchMove);
      surface.removeEventListener('touchend', onNativeTouchEnd);
      surface.removeEventListener('touchcancel', onNativeTouchEnd);
    };
  }, [applyDragDelta]);

  const beginTouchDrag = (mode: DragMode, e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    e.stopPropagation();
    const touch = e.touches[0];
    dragStateRef.current = {
      mode,
      inputType: 'touch',
      startClientX: touch.clientX,
      startClientY: touch.clientY,
      startCrop: { ...cropRef.current },
    };
  };

  const beginPointerDrag = (mode: DragMode, e: React.PointerEvent) => {
    // Let dedicated touch handlers drive touch input cleanly without double-firing
    if (e.pointerType === 'touch') return;
    e.preventDefault();
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture is unavailable
    }
    dragStateRef.current = {
      mode,
      inputType: 'pointer',
      startClientX: e.clientX,
      startClientY: e.clientY,
      startCrop: { ...cropRef.current },
    };
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragStateRef.current.inputType !== 'pointer') return;
      applyDragDelta(e.clientX, e.clientY);
    },
    [applyDragDelta]
  );

  const endPointerDrag = (e: React.PointerEvent) => {
    if (dragStateRef.current.inputType === 'pointer') {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture already released
      }
      dragStateRef.current.mode = null;
      dragStateRef.current.inputType = null;
    }
  };

  const handleConfirm = () => {
    const srcCanvas = canvasRef.current;
    if (!srcCanvas || !displayDims || !naturalDims) return;

    const sx = Math.max(0, Math.round((crop.x / displayDims.w) * naturalDims.w));
    const sy = Math.max(0, Math.round((crop.y / displayDims.h) * naturalDims.h));
    const sSize = Math.max(
      1,
      Math.min(
        naturalDims.w - sx,
        naturalDims.h - sy,
        Math.round((crop.size / displayDims.w) * naturalDims.w)
      )
    );

    const offscreen = document.createElement('canvas');
    offscreen.width = 224;
    offscreen.height = 224;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(srcCanvas, sx, sy, sSize, sSize, 0, 0, 224, 224);

    const previewDataUrl = offscreen.toDataURL('image/png');
    onConfirmCrop(offscreen, previewDataUrl);
  };

  return (
    <div ref={wrapperRef} className="relative w-full flex flex-col items-center gap-2.5 z-20">
      <p className="text-xs sm:text-sm font-display font-bold text-[#4A2E14] flex items-center justify-center gap-1.5 text-center px-1">
        <Move className="w-3.5 h-3.5 text-orange-600 shrink-0" />
        <span>Drag or resize the square around your trash item!</span>
      </p>

      {/* Frozen Image Canvas + Interactive Square Crop Overlay */}
      <div
        ref={cropSurfaceRef}
        className="relative overflow-hidden rounded-xl border-3 border-[#7A4419] bg-slate-900 shadow-md select-none touch-none"
        style={{
          width: displayDims ? `${displayDims.w}px` : `${Math.min(260, maxBounds.w)}px`,
          height: displayDims ? `${displayDims.h}px` : '180px',
          touchAction: 'none',
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerDrag}
        onPointerCancel={endPointerDrag}
      >
        <canvas
          ref={canvasRef}
          className="block w-full h-full pointer-events-none"
          style={{
            width: displayDims ? `${displayDims.w}px` : '100%',
            height: displayDims ? `${displayDims.h}px` : '100%',
          }}
        />

        {displayDims && (
          <div
            role="region"
            aria-label="Draggable square crop area"
            onTouchStart={(e) => beginTouchDrag('move', e)}
            onPointerDown={(e) => beginPointerDrag('move', e)}
            className="absolute cursor-move border-[3px] border-dashed border-amber-300 rounded-lg touch-none"
            style={{
              left: `${crop.x}px`,
              top: `${crop.y}px`,
              width: `${crop.size}px`,
              height: `${crop.size}px`,
              boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.42)',
              touchAction: 'none',
            }}
          >
            {/* Subtle center crosshair guide */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="w-5 h-5 border border-white/40 rounded-full" />
            </div>

            {/* 4 Corner Resize Handles — >= 32x32px touch targets */}
            <button
              type="button"
              aria-label="Resize crop top-left corner"
              onTouchStart={(e) => beginTouchDrag('nw', e)}
              onPointerDown={(e) => beginPointerDrag('nw', e)}
              style={{ touchAction: 'none' }}
              className="absolute -top-4 -left-4 w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center cursor-nwse-resize touch-none focus:outline-none"
            >
              <span className="w-5 h-5 rounded-full bg-amber-300 border-2 border-[#4A2E14] shadow" />
            </button>
            <button
              type="button"
              aria-label="Resize crop top-right corner"
              onTouchStart={(e) => beginTouchDrag('ne', e)}
              onPointerDown={(e) => beginPointerDrag('ne', e)}
              style={{ touchAction: 'none' }}
              className="absolute -top-4 -right-4 w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center cursor-nesw-resize touch-none focus:outline-none"
            >
              <span className="w-5 h-5 rounded-full bg-amber-300 border-2 border-[#4A2E14] shadow" />
            </button>
            <button
              type="button"
              aria-label="Resize crop bottom-left corner"
              onTouchStart={(e) => beginTouchDrag('sw', e)}
              onPointerDown={(e) => beginPointerDrag('sw', e)}
              style={{ touchAction: 'none' }}
              className="absolute -bottom-4 -left-4 w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center cursor-nesw-resize touch-none focus:outline-none"
            >
              <span className="w-5 h-5 rounded-full bg-amber-300 border-2 border-[#4A2E14] shadow" />
            </button>
            <button
              type="button"
              aria-label="Resize crop bottom-right corner"
              onTouchStart={(e) => beginTouchDrag('se', e)}
              onPointerDown={(e) => beginPointerDrag('se', e)}
              style={{ touchAction: 'none' }}
              className="absolute -bottom-4 -right-4 w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center cursor-nwse-resize touch-none focus:outline-none"
            >
              <span className="w-5 h-5 rounded-full bg-amber-300 border-2 border-[#4A2E14] shadow" />
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons Below Cropped Photo */}
      <div className="flex flex-wrap items-center justify-center gap-2 z-30 w-full">
        <button
          type="button"
          disabled={disabled || !displayDims}
          onClick={handleConfirm}
          className="inline-flex items-center justify-center gap-1.5 font-display font-bold text-xs sm:text-sm text-white px-4 py-2 min-h-[44px] rounded-full bg-gradient-to-b from-emerald-400 to-green-600 border-2 border-green-900 btn-3d-green hover:brightness-105 cursor-pointer disabled:opacity-60 whitespace-nowrap"
        >
          <Check className="w-4 h-4" />
          Sort This Item!
        </button>

        {source.origin === 'camera' ? (
          <button
            type="button"
            disabled={disabled}
            onClick={onRetakePhoto}
            className="inline-flex items-center justify-center gap-1.5 font-display font-bold text-xs sm:text-sm text-white px-4 py-2 min-h-[44px] rounded-full bg-gradient-to-b from-sky-400 to-blue-600 border-2 border-blue-950 btn-3d-blue hover:brightness-105 cursor-pointer disabled:opacity-60 whitespace-nowrap"
          >
            <Camera className="w-4 h-4" />
            Retake Photo
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={onChooseAnother}
            className="inline-flex items-center justify-center gap-1.5 font-display font-bold text-xs sm:text-sm text-white px-4 py-2 min-h-[44px] rounded-full bg-gradient-to-b from-amber-400 to-orange-600 border-2 border-orange-950 btn-3d-orange hover:brightness-105 cursor-pointer disabled:opacity-60 whitespace-nowrap"
          >
            <FolderOpen className="w-4 h-4" />
            Choose Another
          </button>
        )}

        <button
          type="button"
          disabled={disabled}
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-1 font-display font-bold text-xs sm:text-sm text-slate-700 px-3.5 py-2 min-h-[44px] rounded-full bg-white hover:bg-slate-100 border-2 border-slate-400 cursor-pointer whitespace-nowrap"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </button>
      </div>
    </div>
  );
};
