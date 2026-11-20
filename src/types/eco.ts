export type WasteCategory =
  | 'Paper Waste'
  | 'Glass Waste'
  | 'Organic Waste'
  | 'Metal Waste'
  | 'Plastic Waste';

export interface BinConfig {
  id: WasteCategory;
  shortName: string;
  bodyColor: string;
  bodyShade: string;
  lidColor: string;
  lidHighlight: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  glowColor: string;
  examples: string;
  transformation: string;
  ecoFacts: string[];
}

export interface ClassificationResult {
  category: WasteCategory;
  confidence: number;
  isConfident: boolean;
  ecoFact: string;
  isDemoMode: boolean;
}

export type EcoWorldStage = 1 | 2 | 3 | 4;

export interface EcoWorldStageInfo {
  stage: EcoWorldStage;
  minScore: number;
  badgeLabel: string;
  title: string;
  toastMessage: string;
  speechMessage: string;
  pillClasses: string;
}

export const ECO_WORLD_STAGES: Record<EcoWorldStage, EcoWorldStageInfo> = {
  1: {
    stage: 1,
    minScore: 0,
    badgeLabel: '🌱 Stage 1',
    title: 'Clean Start',
    toastMessage: '',
    speechMessage: '',
    pillClasses: 'bg-lime-100 border-lime-500 text-lime-900',
  },
  2: {
    stage: 2,
    minScore: 30,
    badgeLabel: '🌸 Stage 2',
    title: 'Blooming Meadow',
    toastMessage: '🌸 Eco-World Leveled Up! Flowers are blooming!',
    speechMessage: 'Look! Your sorting helped colorful flowers bloom across the hills!',
    pillClasses: 'bg-pink-100 border-pink-400 text-pink-900',
  },
  3: {
    stage: 3,
    minScore: 60,
    badgeLabel: '🦋 Stage 3',
    title: 'Fluttering Friends',
    toastMessage: '🦋 Eco-World Leveled Up! Butterflies arrived!',
    speechMessage: 'Hooray! Friendly butterflies and little birds came to visit your clean forest!',
    pillClasses: 'bg-sky-100 border-sky-500 text-sky-900',
  },
  4: {
    stage: 4,
    minScore: 100,
    badgeLabel: '🌈 Stage 4',
    title: 'Sparkling Rainbow & Thriving Forest',
    toastMessage: '🌈 Eco-World Max Level! A rainbow appeared!',
    speechMessage: 'Amazing! You unlocked a sparkling rainbow and a thriving eco-world!',
    pillClasses: 'bg-amber-100 border-amber-500 text-amber-950',
  },
};

export function getEcoWorldStage(score: number): EcoWorldStage {
  if (score >= 100) return 4;
  if (score >= 60) return 3;
  if (score >= 30) return 2;
  return 1;
}

export const WASTE_BINS: BinConfig[] = [
  {
    id: 'Paper Waste',
    shortName: 'Paper',
    bodyColor: '#3B9AE1',
    bodyShade: '#2678BA',
    lidColor: '#2B80C7',
    lidHighlight: '#64B5F6',
    accentBg: 'bg-sky-50',
    accentBorder: 'border-sky-400',
    accentText: 'text-sky-800',
    glowColor: 'rgba(59, 154, 225, 0.55)',
    examples: 'Newspapers, cardboard boxes, notebooks & magazines',
    transformation: '📰 ➡️ 📓 Recycled into brand-new notebooks, comic books, and cardboard boxes!',
    ecoFacts: [
      'Recycling 1 ton of paper saves 17 big trees and lots of homes for forest animals!',
      'Recycled paper can be turned into brand-new comic books, cereal boxes, and notebooks!',
      'Making new paper from old paper uses 70% less water than starting from fresh trees.',
    ],
  },
  {
    id: 'Glass Waste',
    shortName: 'Glass',
    bodyColor: '#3EB466',
    bodyShade: '#298B4A',
    lidColor: '#2E9652',
    lidHighlight: '#6BD48D',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-400',
    accentText: 'text-emerald-800',
    glowColor: 'rgba(62, 180, 102, 0.55)',
    examples: 'Glass jars, juice bottles & jam containers',
    transformation: '🫙 ➡️ 🍾 Melted and shaped into shiny new jars and bottles!',
    ecoFacts: [
      'Glass can be recycled forever—over and over again—without ever losing its sparkle!',
      'Recycling just one glass bottle saves enough electricity to light a bulb for 4 hours!',
      'Crushed recycled glass melts at a lower temperature, helping keep our air cleaner.',
    ],
  },
  {
    id: 'Organic Waste',
    shortName: 'Organic',
    bodyColor: '#9B653E',
    bodyShade: '#764A2B',
    lidColor: '#7D4F2E',
    lidHighlight: '#B98057',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-500',
    accentText: 'text-amber-900',
    glowColor: 'rgba(155, 101, 62, 0.55)',
    examples: 'Apple cores, banana peels, leaves & veggie scraps',
    transformation: '🍌 ➡️ 🌻 Turns into rich compost soil to help garden flowers and trees grow!',
    ecoFacts: [
      'Worms and tiny garden helpers turn food scraps into rich compost soil for growing flowers!',
      'Composting fruit peels keeps trash out of landfills and feeds hungry garden plants.',
      'A banana peel in a compost pile transforms into super-plant food in just a few weeks!',
    ],
  },
  {
    id: 'Metal Waste',
    shortName: 'Metal',
    bodyColor: '#9AA5B1',
    bodyShade: '#737F8C',
    lidColor: '#E04F45',
    lidHighlight: '#F4766D',
    accentBg: 'bg-rose-50',
    accentBorder: 'border-rose-400',
    accentText: 'text-rose-800',
    glowColor: 'rgba(224, 79, 69, 0.5)',
    examples: 'Soda cans, soup tins & clean aluminum foil',
    transformation: '🥫 ➡️ 🚲 Melted down to make new cans, scooters, and bicycles!',
    ecoFacts: [
      'An aluminum soda can you recycle today can become a brand-new can in just 60 days!',
      'Recycling metal saves 95% of the energy needed to make shiny new metal from rocks.',
      'Steel food cans are magnetic, so giant recycling magnets zoom them right off the belt!',
    ],
  },
  {
    id: 'Plastic Waste',
    shortName: 'Plastic',
    bodyColor: '#F5C431',
    bodyShade: '#D49E12',
    lidColor: '#E3AC19',
    lidHighlight: '#FFE066',
    accentBg: 'bg-yellow-50',
    accentBorder: 'border-yellow-400',
    accentText: 'text-yellow-900',
    glowColor: 'rgba(245, 196, 49, 0.6)',
    examples: 'Water bottles, milk jugs & yogurt cups',
    transformation: '🧴 ➡️ 🛝 Recycled into playground slides, cozy fleece jackets, and backpacks!',
    ecoFacts: [
      'Recycled plastic bottles can be spun into cozy fleece jackets, backpacks, and playground slides!',
      'Sorting plastic keeps oceans and rivers safe and clean for sea turtles and dolphins.',
      'Just 5 recycled plastic bottles make enough soft fiber to fill a warm winter ski jacket!',
    ],
  },
];

export const BIN_MAP: Record<WasteCategory, BinConfig> = WASTE_BINS.reduce(
  (acc, bin) => {
    acc[bin.id] = bin;
    return acc;
  },
  {} as Record<WasteCategory, BinConfig>
);
