import { BIN_MAP, ClassificationResult, WasteCategory } from '../types/eco';

// ============================================================================
// Google Teachable Machine Configuration
// ============================================================================
export const MODEL_URL: string = 'https://teachablemachine.withgoogle.com/models/j6ti3Rb5j/';

interface TeachableMachinePrediction {
  className: string;
  probability: number;
}

interface TeachableMachineModel {
  predict: (
    image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
  ) => Promise<TeachableMachinePrediction[]>;
  getTotalClasses?: () => number;
}

declare global {
  interface Window {
    tmImage?: {
      load: (modelURL: string, metadataURL: string) => Promise<TeachableMachineModel>;
    };
  }
}

let cachedModel: TeachableMachineModel | null = null;
let loadingPromise: Promise<TeachableMachineModel> | null = null;

export function isModelConfigured(): boolean {
  return (
    Boolean(MODEL_URL) &&
    MODEL_URL !== 'YOUR_TEACHABLE_MACHINE_MODEL_URL_HERE/' &&
    MODEL_URL.startsWith('http')
  );
}

function normalizeUrl(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

async function waitForTeachableMachineLib(): Promise<NonNullable<Window['tmImage']>> {
  for (let i = 0; i < 40; i++) {
    if (window.tmImage) {
      return window.tmImage;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(
    'Could not load the Eco Hero AI library. Please check your internet connection and refresh the page.'
  );
}

export async function getTeachableMachineModel(): Promise<TeachableMachineModel> {
  if (cachedModel) {
    return cachedModel;
  }
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      const tmImage = await waitForTeachableMachineLib();
      const base = normalizeUrl(MODEL_URL);
      const modelURL = `${base}model.json`;
      const metadataURL = `${base}metadata.json`;
      const model = await tmImage.load(modelURL, metadataURL);
      cachedModel = model;
      return model;
    } catch (err) {
      loadingPromise = null;
      if (err instanceof Error && err.message.includes('Eco Hero AI library')) {
        throw err;
      }
      throw new Error(
        'Oops! We could not reach the Teachable Machine model right now. Please check your internet connection and try again!'
      );
    }
  })();

  return loadingPromise;
}

export function isModelReady(): boolean {
  return cachedModel !== null;
}

function mapLabelToCategory(rawLabel: string): WasteCategory {
  const label = rawLabel.trim().toLowerCase();

  if (
    label.includes('paper') ||
    label.includes('cardboard') ||
    label.includes('book') ||
    label.includes('newspaper')
  ) {
    return 'Paper Waste';
  }
  if (label.includes('glass') || label.includes('jar')) {
    return 'Glass Waste';
  }
  if (
    label.includes('organic') ||
    label.includes('compost') ||
    label.includes('food') ||
    label.includes('fruit') ||
    label.includes('apple') ||
    label.includes('banana')
  ) {
    return 'Organic Waste';
  }
  if (
    label.includes('metal') ||
    label.includes('tin') ||
    label.includes('aluminum') ||
    label.includes('aluminium') ||
    label.includes('can')
  ) {
    return 'Metal Waste';
  }
  if (label.includes('plastic') || label.includes('bottle') || label.includes('jug')) {
    return 'Plastic Waste';
  }

  return 'Plastic Waste';
}

function pickRandomFact(category: WasteCategory): string {
  const facts = BIN_MAP[category].ecoFacts;
  return facts[Math.floor(Math.random() * facts.length)];
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Oops! We could not read that picture. Try another image!'));
    img.src = src;
  });
}

export async function classifyTrashImage(options: {
  canvas?: HTMLCanvasElement;
  imageSrc?: string;
}): Promise<ClassificationResult> {
  const { canvas, imageSrc } = options;

  let targetElement: HTMLCanvasElement | HTMLImageElement;
  const modelPromise = getTeachableMachineModel();

  if (canvas) {
    targetElement = canvas;
  } else if (imageSrc) {
    targetElement = await loadHtmlImage(imageSrc);
  } else {
    throw new Error('No image was provided to classify.');
  }

  const model = await modelPromise;
  const predictions = await model.predict(targetElement);
  if (!predictions || predictions.length === 0) {
    throw new Error('Could not classify this picture. Please try a clearer photo!');
  }

  const sorted = [...predictions].sort((a, b) => b.probability - a.probability);
  const top = sorted[0];
  const isConfident = top.probability >= 0.75;
  const category = mapLabelToCategory(top.className);

  return {
    category,
    confidence: Math.round(top.probability * 100),
    isConfident,
    ecoFact: pickRandomFact(category),
    isDemoMode: false,
  };
}
