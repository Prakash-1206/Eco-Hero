/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { NatureBackground } from './components/NatureBackground';
import { DropStage } from './components/DropStage';
import { CropSource } from './components/ImageCropper';
import { MascotBins } from './components/MascotBins';
import { HowToPlayModal, ParentsTeachersModal } from './components/Modals';
import { classifyTrashImage, getTeachableMachineModel, isModelReady } from './lib/classifier';
import {
  pauseBackgroundMusic,
  playCelebrationChime,
  playShutterPop,
  playTryAgainBoing,
  speakText,
  startBackgroundMusic,
  stopSpeech,
  stripEmojiForSpeech,
  unlockAudio,
} from './lib/sound';
import {
  BIN_MAP,
  ClassificationResult,
  ECO_WORLD_STAGES,
  EcoWorldStage,
  EcoWorldStageInfo,
  WasteCategory,
  getEcoWorldStage,
} from './types/eco';

export default function App() {
  const [score, setScore] = useState<number>(0);
  const scoreRef = useRef<number>(0);
  const [scoreAnimating, setScoreAnimating] = useState<boolean>(false);
  const [milestoneToast, setMilestoneToast] = useState<EcoWorldStageInfo | null>(null);
  const milestoneTimerRef = useRef<number | null>(null);
  const [muted, setMuted] = useState<boolean>(false);
  const mutedRef = useRef<boolean>(false);

  // Feature 1: "Guess Before You Scan!" Quiz Mode (defaults to ON)
  const [guessMode, setGuessMode] = useState<boolean>(true);
  const [awaitingGuess, setAwaitingGuess] = useState<boolean>(false);
  const [guessedCategory, setGuessedCategory] = useState<WasteCategory | null>(null);
  const [awardedPoints, setAwardedPoints] = useState<number>(10);

  const [cropSource, setCropSource] = useState<CropSource | null>(null);
  const [lastCropSource, setLastCropSource] = useState<CropSource | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(() => !isModelReady());
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [celebrationKey, setCelebrationKey] = useState<number>(0);

  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [howToPlayOpen, setHowToPlayOpen] = useState<boolean>(false);
  const [parentsModalOpen, setParentsModalOpen] = useState<boolean>(false);

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  }, []);

  // Preload Teachable Machine model quietly on mount
  useEffect(() => {
    let active = true;
    if (!isModelReady()) {
      setIsModelLoading(true);
      getTeachableMachineModel()
        .catch(() => {
          // Will surface friendly error if user attempts classification while offline
        })
        .finally(() => {
          if (active) setIsModelLoading(false);
        });
    }
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [isCameraOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setHowToPlayOpen(false);
        setParentsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // Start looping background music automatically on user's first page interaction
  useEffect(() => {
    const handleFirstInteraction = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-sound-toggle="true"]')) {
        return;
      }
      if (!mutedRef.current) {
        unlockAudio();
        startBackgroundMusic(false);
      }
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    return () => {
      stopSpeech();
      pauseBackgroundMusic();
      if (milestoneTimerRef.current !== null) {
        window.clearTimeout(milestoneTimerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => {
      const nextMuted = !prev;
      mutedRef.current = nextMuted;
      if (nextMuted) {
        stopSpeech();
        pauseBackgroundMusic();
      } else {
        unlockAudio();
        startBackgroundMusic(false);
      }
      return nextMuted;
    });
  }, []);

  const triggerAwardAndCelebration = useCallback(
    (points: number, playSuccessChime: boolean): EcoWorldStage | null => {
      const prevScore = scoreRef.current;
      const nextScore = prevScore + points;
      scoreRef.current = nextScore;

      const prevStage = getEcoWorldStage(prevScore);
      const nextStage = getEcoWorldStage(nextScore);
      const unlockedStage = nextStage > prevStage ? nextStage : null;

      setAwardedPoints(points);
      setCelebrationKey((k) => k + 1);
      setScore(nextScore);
      setScoreAnimating(true);
      window.setTimeout(() => setScoreAnimating(false), 450);

      if (playSuccessChime) {
        playCelebrationChime(muted);
      } else {
        playTryAgainBoing(muted);
      }

      if (unlockedStage) {
        setMilestoneToast(ECO_WORLD_STAGES[unlockedStage]);
        if (milestoneTimerRef.current !== null) {
          window.clearTimeout(milestoneTimerRef.current);
        }
        milestoneTimerRef.current = window.setTimeout(() => {
          setMilestoneToast(null);
          milestoneTimerRef.current = null;
        }, 4600);
      }

      return unlockedStage;
    },
    [muted]
  );

  const handleToggleGuessMode = useCallback(() => {
    unlockAudio();
    setGuessMode((prev) => {
      const next = !prev;
      // If toggled OFF while waiting for a guess, smoothly auto-reveal with +10 points
      if (!next && awaitingGuess && result && result.isConfident) {
        setAwaitingGuess(false);
        setGuessedCategory(null);
        const unlockedStage = triggerAwardAndCelebration(10, true);
        const transformationSpeech = stripEmojiForSpeech(
          BIN_MAP[result.category].transformation
        );
        speakText(
          `Awesome! That goes in the ${result.category} bin! ${transformationSpeech}`,
          muted
        );
        if (unlockedStage) {
          speakText(ECO_WORLD_STAGES[unlockedStage].speechMessage, muted, { queue: true });
        }
      }
      return next;
    });
  }, [awaitingGuess, muted, result, triggerAwardAndCelebration]);

  const handleSelectBinGuess = useCallback(
    (selectedBin: WasteCategory) => {
      if (!awaitingGuess || !result || !result.isConfident) return;
      unlockAudio();
      setAwaitingGuess(false);
      setGuessedCategory(selectedBin);

      const isCorrect = selectedBin === result.category;
      if (isCorrect) {
        const unlockedStage = triggerAwardAndCelebration(20, true);
        speakText(
          `Super Eco-Detective! You guessed right! That goes in the ${result.category} bin!`,
          muted
        );
        if (unlockedStage) {
          speakText(ECO_WORLD_STAGES[unlockedStage].speechMessage, muted, { queue: true });
        }
      } else {
        const unlockedStage = triggerAwardAndCelebration(5, false);
        speakText(
          `Nice try! That actually goes in the ${result.category} bin!`,
          muted
        );
        if (unlockedStage) {
          speakText(ECO_WORLD_STAGES[unlockedStage].speechMessage, muted, { queue: true });
        }
      }
    },
    [awaitingGuess, muted, result, triggerAwardAndCelebration]
  );

  const runClassification = useCallback(
    async (input: { canvas?: HTMLCanvasElement; imageSrc: string }) => {
      stopSpeech();
      setErrorMessage(null);
      setPreviewSrc(input.imageSrc);
      setResult(null);
      setAwaitingGuess(false);
      setGuessedCategory(null);
      setIsClassifying(true);
      if (!isModelReady()) {
        setIsModelLoading(true);
      }

      try {
        const classification = await classifyTrashImage({
          canvas: input.canvas,
          imageSrc: input.imageSrc,
        });
        setResult(classification);

        if (!classification.isConfident) {
          playTryAgainBoing(muted);
          speakText(
            "Hmm, I'm not quite sure what that is! Please take another photo or upload a clearer picture.",
            muted
          );
          return;
        }

        if (guessMode) {
          // Hold answer and points until kid taps one of the 5 bins
          setAwaitingGuess(true);
          speakText('Which bin does this go in? Tap a bin below to guess!', muted);
        } else {
          const unlockedStage = triggerAwardAndCelebration(10, true);
          const transformationSpeech = stripEmojiForSpeech(
            BIN_MAP[classification.category].transformation
          );
          speakText(
            `Awesome! That goes in the ${classification.category} bin! ${transformationSpeech}`,
            muted
          );
          if (unlockedStage) {
            speakText(ECO_WORLD_STAGES[unlockedStage].speechMessage, muted, { queue: true });
          }
        }
      } catch (err) {
        playTryAgainBoing(muted);
        const friendlyMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Oops! Something went wrong checking that picture. Please try again!';
        setErrorMessage(friendlyMessage);
      } finally {
        setIsModelLoading(false);
        setIsClassifying(false);
      }
    },
    [guessMode, muted, triggerAwardAndCelebration]
  );

  // Uploaded or dragged-and-dropped images enter the interactive square cropper
  const handleFileSelected = useCallback(
    (file: File) => {
      unlockAudio();
      stopSpeech();
      stopCameraStream();
      setErrorMessage(null);
      setResult(null);
      setAwaitingGuess(false);
      setGuessedCategory(null);
      setPreviewSrc(null);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const nextSource: CropSource = { src: reader.result, origin: 'upload' };
          setCropSource(nextSource);
          setLastCropSource(nextSource);
        }
      };
      reader.onerror = () => {
        setErrorMessage('Could not read that image file. Please try another picture!');
      };
      reader.readAsDataURL(file);
    },
    [stopCameraStream]
  );

  const handleSampleSelected = useCallback(
    (imageSrc: string, _fileName: string, _category: WasteCategory) => {
      unlockAudio();
      playShutterPop(muted);
      stopCameraStream();
      setCropSource(null);
      setLastCropSource(null);
      runClassification({ imageSrc });
    },
    [muted, runClassification, stopCameraStream]
  );

  const handleStartCamera = useCallback(async () => {
    unlockAudio();
    stopSpeech();
    setErrorMessage(null);
    setResult(null);
    setAwaitingGuess(false);
    setGuessedCategory(null);
    setPreviewSrc(null);
    setCropSource(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage(
        'Live camera is not supported in this browser. Try Upload Image or Quick Try below!'
      );
      return;
    }

    const requestStream = async (): Promise<MediaStream> => {
      try {
        return await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
      } catch {
        return await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }
    };

    try {
      const stream = await requestStream();
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch (err) {
      const errorName = err instanceof DOMException ? err.name : '';
      if (errorName === 'NotAllowedError' || errorName === 'SecurityError') {
        setErrorMessage(
          'Camera access was blocked! Please allow camera permission in your browser address bar, or use Upload Image.'
        );
      } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
        setErrorMessage(
          'No camera was found on this device. You can still Upload Image or try a Quick Sample!'
        );
      } else if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
        setErrorMessage(
          'Your camera is currently busy in another app. Close the other app or use Upload Image!'
        );
      } else {
        setErrorMessage(
          'Could not open the camera right now. You can still Upload Image or try a Quick Sample!'
        );
      }
      setIsCameraOpen(false);
    }
  }, []);

  // Freeze captured webcam frame onto canvas & open interactive square cropper
  const handleSnapPhoto = useCallback(() => {
    unlockAudio();
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setErrorMessage('Camera is still warming up—wait one second and try again!');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const capturedDataUrl = canvas.toDataURL('image/png');

    playShutterPop(muted);
    stopCameraStream();

    const nextSource: CropSource = { src: capturedDataUrl, origin: 'camera' };
    setCropSource(nextSource);
    setLastCropSource(nextSource);
  }, [muted, stopCameraStream]);

  // Extract 224x224 cropped square canvas and run model.predict()
  const handleConfirmCrop = useCallback(
    (croppedCanvas: HTMLCanvasElement, previewDataUrl: string) => {
      unlockAudio();
      playShutterPop(muted);
      setCropSource(null);
      runClassification({ canvas: croppedCanvas, imageSrc: previewDataUrl });
    },
    [muted, runClassification]
  );

  // Let user adjust the crop box again if confidence was below 75%
  const handleAdjustCrop = useCallback(() => {
    if (!lastCropSource) return;
    stopSpeech();
    setErrorMessage(null);
    setResult(null);
    setAwaitingGuess(false);
    setGuessedCategory(null);
    setPreviewSrc(null);
    setCropSource(lastCropSource);
  }, [lastCropSource]);

  const handleReset = useCallback(() => {
    stopSpeech();
    stopCameraStream();
    setErrorMessage(null);
    setCropSource(null);
    setLastCropSource(null);
    setPreviewSrc(null);
    setResult(null);
    setAwaitingGuess(false);
    setGuessedCategory(null);
    setIsClassifying(false);
  }, [stopCameraStream]);

  const handleHomeClick = useCallback(() => {
    setHowToPlayOpen(false);
    setParentsModalOpen(false);
    handleReset();
  }, [handleReset]);

  const worldStage: EcoWorldStage = getEcoWorldStage(score);
  const activeBinCategory =
    !awaitingGuess && result && result.isConfident ? result.category : null;
  const isBonusConfetti =
    Boolean(activeBinCategory) && guessedCategory === activeBinCategory;

  return (
    <div className="relative min-h-screen w-full max-w-full flex flex-col justify-between overflow-x-hidden">
      <NatureBackground worldStage={worldStage} />

      <HeaderBar
        score={score}
        scoreAnimating={scoreAnimating}
        worldStage={worldStage}
        muted={muted}
        onToggleMute={handleToggleMute}
        onHomeClick={handleHomeClick}
        onHowToPlayClick={() => setHowToPlayOpen(true)}
        onParentsTeachersClick={() => setParentsModalOpen(true)}
      />

      {milestoneToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-28 lg:top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-3 w-[92vw] max-w-lg flex justify-center"
        >
          <div className="animate-toast-in px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-b from-amber-100 to-yellow-200 border-[3px] border-amber-700 shadow-[0_5px_0_#b45309,0_10px_24px_rgba(180,83,9,0.28)] font-display font-bold text-xs sm:text-base text-amber-950 text-center">
            {milestoneToast.toastMessage}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-evenly py-1">
        <DropStage
          previewSrc={previewSrc}
          cropSource={cropSource}
          canAdjustCrop={Boolean(lastCropSource)}
          isCameraOpen={isCameraOpen}
          errorMessage={errorMessage}
          isModelLoading={isModelLoading}
          isClassifying={isClassifying}
          result={result}
          guessMode={guessMode}
          awaitingGuess={awaitingGuess}
          guessedCategory={guessedCategory}
          onToggleGuessMode={handleToggleGuessMode}
          videoRef={videoRef}
          onFileSelected={handleFileSelected}
          onSampleSelected={handleSampleSelected}
          onStartCamera={handleStartCamera}
          onSnapPhoto={handleSnapPhoto}
          onStopCamera={stopCameraStream}
          onConfirmCrop={handleConfirmCrop}
          onAdjustCrop={handleAdjustCrop}
          onReset={handleReset}
        />

        <MascotBins
          activeCategory={activeBinCategory}
          celebrationKey={celebrationKey}
          isGuessing={awaitingGuess}
          awardedPoints={awardedPoints}
          extraConfetti={isBonusConfetti}
          onSelectBin={handleSelectBinGuess}
        />
      </div>

      <HowToPlayModal isOpen={howToPlayOpen} onClose={() => setHowToPlayOpen(false)} />
      <ParentsTeachersModal isOpen={parentsModalOpen} onClose={() => setParentsModalOpen(false)} />
    </div>
  );
}
