// Built-in Web Audio API sound effects & Web Speech API voice narration
// Safe wrappers ensure zero errors on unsupported browsers or locked devices.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtx) {
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function unlockAudio() {
  getAudioContext();
}

// 1. Camera Shutter / Snap Sound: crisp, quick click/pop
export function playShutterPop(muted: boolean) {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(760, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.085);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // Ignore audio errors cleanly
  }
}

// 2. Success / Sorting Chime: bright, rising major-chord arpeggio
export function playCelebrationChime(muted: boolean) {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.15, now + idx * 0.08 + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.34);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.36);
    });
  } catch {
    // Ignore audio errors cleanly
  }
}

// 3. Gentle Try-Again Boing: soft, friendly low-to-mid tone (never harsh)
export function playTryAgainBoing(muted: boolean) {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.14);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.28);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.34);
  } catch {
    // Ignore audio errors cleanly
  }
}

// 4. Friendly Voice Narration (Web Speech API)
let cachedFemaleVoice: SpeechSynthesisVoice | null = null;
let voicesListenerAttached = false;

function selectPreferredVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!('speechSynthesis' in window) || !window.speechSynthesis) {
      return null;
    }

    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
      return null;
    }

    const findByNames = (targets: string[]): SpeechSynthesisVoice | undefined => {
      for (const target of targets) {
        const t = target.toLowerCase();
        const exact = voices.find((v) => v.name.toLowerCase() === t);
        if (exact) return exact;
        const partial = voices.find((v) => v.name.toLowerCase().includes(t));
        if (partial) return partial;
      }
      return undefined;
    };

    // Priority 1: Google UK English Female or Google US English
    const priority1 = findByNames(['Google UK English Female', 'Google US English']);
    if (priority1) return priority1;

    // Priority 2: Microsoft Zira, Microsoft Aria, Samantha, Victoria, or Karen
    const priority2 = findByNames([
      'Microsoft Zira',
      'Microsoft Aria',
      'Samantha',
      'Victoria',
      'Karen',
    ]);
    if (priority2) return priority2;

    // Priority 3: Any English voice with female/natural keywords
    const englishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
    const femaleKeywords = ['female', 'woman', 'girl', 'natural', 'samantha'];
    const priority3 = englishVoices.find((v) => {
      const lowerName = v.name.toLowerCase();
      return femaleKeywords.some((kw) => lowerName.includes(kw));
    });
    if (priority3) return priority3;

    // Priority 4: Fallback to first available English voice
    if (englishVoices.length > 0) {
      return englishVoices[0];
    }

    return null;
  } catch {
    return null;
  }
}

function ensureVoiceListener() {
  if (typeof window === 'undefined' || voicesListenerAttached) return;
  try {
    if (!('speechSynthesis' in window) || !window.speechSynthesis) return;

    cachedFemaleVoice = selectPreferredVoice();
    voicesListenerAttached = true;

    const handleVoicesChanged = () => {
      cachedFemaleVoice = selectPreferredVoice();
    };

    if (typeof window.speechSynthesis.addEventListener === 'function') {
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    } else {
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    }
  } catch {
    // Ignore on browsers without speechSynthesis event support
  }
}

ensureVoiceListener();

export const BACKGROUND_MUSIC_SRC =
  '/assets/aistudio/daynigthmorning-sunshine-kid-playtime-286890_035b6daf.mp3';
const BGM_NORMAL_VOLUME = 0.18;
const BGM_DUCKED_VOLUME = 0.07;

let bgMusic: HTMLAudioElement | null = null;
let isSpeaking = false;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let speechQueue: string[] = [];

function getBackgroundMusic(): HTMLAudioElement | null {
  if (typeof window === 'undefined' || typeof Audio === 'undefined') return null;
  try {
    if (!bgMusic) {
      bgMusic = new Audio(BACKGROUND_MUSIC_SRC);
      bgMusic.loop = true;
      bgMusic.preload = 'auto';
      bgMusic.volume = isSpeaking ? BGM_DUCKED_VOLUME : BGM_NORMAL_VOLUME;
    }
    return bgMusic;
  } catch {
    return null;
  }
}

function setMusicDucked(ducked: boolean) {
  isSpeaking = ducked;
  if (!bgMusic) return;
  try {
    bgMusic.volume = ducked ? BGM_DUCKED_VOLUME : BGM_NORMAL_VOLUME;
  } catch {
    // Ignore volume assignment errors
  }
}

export function startBackgroundMusic(muted: boolean) {
  if (muted) return;
  const audio = getBackgroundMusic();
  if (!audio) return;
  try {
    audio.loop = true;
    audio.volume = isSpeaking ? BGM_DUCKED_VOLUME : BGM_NORMAL_VOLUME;
    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    }
  } catch {
    // Ignore autoplay or playback errors cleanly
  }
}

export function pauseBackgroundMusic() {
  if (!bgMusic) return;
  try {
    bgMusic.pause();
  } catch {
    // Ignore pause errors
  }
}

export function stopSpeech() {
  speechQueue = [];
  activeUtterance = null;
  setMusicDucked(false);
  if (typeof window === 'undefined') return;
  try {
    if ('speechSynthesis' in window && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // Ignore speech synthesis errors on unsupported environments
  }
}

export function stripEmojiForSpeech(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function dispatchUtterance(text: string) {
  ensureVoiceListener();
  if (!cachedFemaleVoice) {
    cachedFemaleVoice = selectPreferredVoice();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  if (cachedFemaleVoice) {
    utterance.voice = cachedFemaleVoice;
    utterance.lang = cachedFemaleVoice.lang;
  } else {
    utterance.lang = 'en-US';
  }
  utterance.rate = 0.94;
  utterance.pitch = 1.25;
  utterance.volume = 1;

  setMusicDucked(true);
  activeUtterance = utterance;

  const handleFinish = () => {
    if (activeUtterance !== utterance) return;
    activeUtterance = null;
    if (speechQueue.length > 0) {
      const nextText = speechQueue.shift()!;
      dispatchUtterance(nextText);
    } else {
      setMusicDucked(false);
    }
  };

  utterance.onstart = () => {
    if (activeUtterance === utterance) {
      setMusicDucked(true);
    }
  };
  utterance.onend = handleFinish;
  utterance.onerror = handleFinish;

  window.speechSynthesis.speak(utterance);
}

export function speakText(
  text: string,
  muted: boolean,
  options?: { queue?: boolean }
) {
  if (muted || typeof window === 'undefined') return;
  try {
    if (
      !('speechSynthesis' in window) ||
      !window.speechSynthesis ||
      typeof SpeechSynthesisUtterance === 'undefined'
    ) {
      return;
    }

    if (options?.queue && (activeUtterance || window.speechSynthesis.speaking)) {
      speechQueue.push(text);
      return;
    }

    speechQueue = [];
    window.speechSynthesis.cancel();
    dispatchUtterance(text);
  } catch {
    speechQueue = [];
    activeUtterance = null;
    setMusicDucked(false);
  }
}
