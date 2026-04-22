export type PokemonType =
  | 'Psychic' | 'Fire' | 'Water' | 'Grass' | 'Electric'
  | 'Ghost' | 'Dragon' | 'Dark' | 'Fighting' | 'Bug'
  | 'Steel' | 'Fairy' | 'Flying' | 'Rock' | 'Ground'
  | 'Normal' | 'Poison' | 'Ice';

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

// AI Architecture — the "class" of the Logic Drone
export type AIArchitecture = 'Regression' | 'SVM' | 'MLP' | 'CNN' | 'Transformer';

export const ARCHITECTURE_COLORS: Record<AIArchitecture, { color: string; bg: string; label: string; icon: string }> = {
  Regression:   { color: '#5DB44B', bg: '#5DB44B22', label: 'REGRESSION', icon: '📈' },
  SVM:          { color: '#C8C8E0', bg: '#C8C8E022', label: 'SVM',         icon: '⚔️' },
  MLP:          { color: '#FF7C26', bg: '#FF7C2622', label: 'MLP',         icon: '🔥' },
  CNN:          { color: '#A890F0', bg: '#A890F022', label: 'CNN',         icon: '👁️' },
  Transformer:  { color: '#FF6DAE', bg: '#FF6DAE22', label: 'TRANSFORMER', icon: '🧠' },
};

// Architecture badge colors for card display (replaces elemental type badges)
export const ARCH_BADGE: Record<AIArchitecture, { bg: string; text: string; border: string }> = {
  Regression:  { bg: '#5DB44B22', text: '#5DB44B', border: '#5DB44B55' },
  SVM:         { bg: '#C8C8E022', text: '#C8C8E0', border: '#C8C8E055' },
  MLP:         { bg: '#FF7C2622', text: '#FF7C26', border: '#FF7C2655' },
  CNN:         { bg: '#A890F022', text: '#A890F0', border: '#A890F055' },
  Transformer: { bg: '#FF6DAE22', text: '#FF6DAE', border: '#FF6DAE55' },
};

// Formation tier rules (which architectures are required)
export const FORMATION_RULES = {
  standard: {
    label: 'STANDARD',
    rules: 'Min 1 Regression · Max 2 MLP · Any SVM/CNN/Transformer',
  },
  expert: {
    label: 'EXPERT',
    rules: 'Min 2 Regression · Exactly 1 SVM · Max 1 MLP',
  },
  dojo: {
    label: 'DOJO',
    rules: 'Free pick — practice without restrictions',
  },
  tournament: {
    label: 'TOURNAMENT',
    rules: 'Min 1 Transformer · Min 1 CNN · Max 1 MLP',
  },
};

export interface PokemonStats {
  pace: number;
  verbal: number;
  spatial: number;
  accuracy: number;
}

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  architecture: AIArchitecture;
  rarity: Rarity;
  price: number;
  stats: PokemonStats;
  ability: string;
  description: string;
}

export const typeColors: Record<string, { from: string; to: string; text: string; badge: string }> = {
  Psychic:  { from: '#FF6DAE', to: '#B83080', text: '#FF6DAE', badge: '#FF6DAE33' },
  Fire:     { from: '#FF7C26', to: '#B84000', text: '#FF7C26', badge: '#FF7C2633' },
  Water:    { from: '#5D9DFA', to: '#1448D8', text: '#5D9DFA', badge: '#5D9DFA33' },
  Grass:    { from: '#5DB44B', to: '#1A6010', text: '#5DB44B', badge: '#5DB44B33' },
  Electric: { from: '#FFD640', to: '#C08800', text: '#FFD640', badge: '#FFD64033' },
  Ghost:    { from: '#9B62C3', to: '#4A1860', text: '#9B62C3', badge: '#9B62C333' },
  Dragon:   { from: '#7038F8', to: '#3008C0', text: '#7038F8', badge: '#7038F833' },
  Dark:     { from: '#A07868', to: '#503828', text: '#A07868', badge: '#A0786833' },
  Fighting: { from: '#D04040', to: '#801010', text: '#D04040', badge: '#D0404033' },
  Bug:      { from: '#A8B820', to: '#607000', text: '#A8B820', badge: '#A8B82033' },
  Steel:    { from: '#C8C8E0', to: '#8888B0', text: '#C8C8E0', badge: '#C8C8E033' },
  Fairy:    { from: '#EE99CC', to: '#B04880', text: '#EE99CC', badge: '#EE99CC33' },
  Flying:   { from: '#A890F0', to: '#5030C0', text: '#A890F0', badge: '#A890F033' },
  Rock:     { from: '#C8B038', to: '#806010', text: '#C8B038', badge: '#C8B03833' },
  Ground:   { from: '#E0C068', to: '#906020', text: '#E0C068', badge: '#E0C06833' },
  Normal:   { from: '#B8B898', to: '#787858', text: '#B8B898', badge: '#B8B89833' },
  Poison:   { from: '#C040C0', to: '#601060', text: '#C040C0', badge: '#C040C033' },
  Ice:      { from: '#98D8D8', to: '#4898A0', text: '#98D8D8', badge: '#98D8D833' },
};

export const rarityColors: Record<Rarity, { color: string; glow: string; label: string }> = {
  Common:    { color: '#9CA3AF', glow: '#9CA3AF40', label: 'COMMON' },
  Rare:      { color: '#60A5FA', glow: '#60A5FA40', label: 'RARE' },
  Epic:      { color: '#A855F7', glow: '#A855F740', label: 'EPIC' },
  Legendary: { color: '#F59E0B', glow: '#F59E0B40', label: 'LEGENDARY' },
};

const sprite = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const overallRating = (stats: PokemonStats): number =>
  Math.round((stats.pace + stats.verbal + stats.spatial + stats.accuracy) / 4);

export const ALL_POKEMON: Pokemon[] = [
  {
    id: 25, name: 'Pikachu', types: ['Electric'], architecture: 'CNN', rarity: 'Common', price: 1200,
    stats: { pace: 72, verbal: 65, spatial: 68, accuracy: 70 },
    ability: 'Static Pulse',
    description: 'Quick spatial convolutions—snaps object boundaries at lightning speed.',
  },
  {
    id: 6, name: 'Charizard', types: ['Fire', 'Flying'], architecture: 'MLP', rarity: 'Epic', price: 8500,
    stats: { pace: 84, verbal: 72, spatial: 78, accuracy: 88 },
    ability: 'Blaze Scan',
    description: 'Deep MLP network burns through image layers with fiery precision.',
  },
  {
    id: 9, name: 'Blastoise', types: ['Water'], architecture: 'Regression', rarity: 'Rare', price: 3800,
    stats: { pace: 65, verbal: 78, spatial: 85, accuracy: 76 },
    ability: 'Hydro Vision',
    description: 'Regression-powered spatial model floods canvas with precise box annotations.',
  },
  {
    id: 3, name: 'Venusaur', types: ['Grass', 'Poison'], architecture: 'Regression', rarity: 'Rare', price: 3500,
    stats: { pace: 60, verbal: 82, spatial: 75, accuracy: 72 },
    ability: 'Petal Narrate',
    description: 'Regression model speaks fluent label language—verbal clarity unmatched.',
  },
  {
    id: 94, name: 'Gengar', types: ['Ghost', 'Poison'], architecture: 'CNN', rarity: 'Rare', price: 4200,
    stats: { pace: 86, verbal: 79, spatial: 71, accuracy: 77 },
    ability: 'Shadow Snipe',
    description: 'Convolutional net phase-shifts between objects at blistering speed.',
  },
  {
    id: 65, name: 'Alakazam', types: ['Psychic'], architecture: 'Transformer', rarity: 'Rare', price: 4500,
    stats: { pace: 77, verbal: 95, spatial: 88, accuracy: 80 },
    ability: 'Telepathy Tag',
    description: 'Full attention mechanism—reads every pixel relationship simultaneously.',
  },
  {
    id: 150, name: 'Mewtwo', types: ['Psychic'], architecture: 'Transformer', rarity: 'Legendary', price: 25000,
    stats: { pace: 90, verbal: 97, spatial: 96, accuracy: 98 },
    ability: 'Psystrike Vision',
    description: 'The ultimate Transformer. Attends to every object. No detail escapes.',
  },
  {
    id: 448, name: 'Lucario', types: ['Fighting', 'Steel'], architecture: 'SVM', rarity: 'Epic', price: 7500,
    stats: { pace: 79, verbal: 76, spatial: 85, accuracy: 90 },
    ability: 'Aura Aim',
    description: 'SVM with perfect decision hyperplanes—steel-clad classification accuracy.',
  },
  {
    id: 445, name: 'Garchomp', types: ['Dragon', 'Ground'], architecture: 'MLP', rarity: 'Epic', price: 9000,
    stats: { pace: 92, verbal: 68, spatial: 80, accuracy: 87 },
    ability: 'Dragon Rush',
    description: 'Blazing MLP network processes frames faster than any rival model.',
  },
  {
    id: 196, name: 'Espeon', types: ['Psychic'], architecture: 'Transformer', rarity: 'Rare', price: 5000,
    stats: { pace: 74, verbal: 90, spatial: 82, accuracy: 78 },
    ability: 'Future Sight',
    description: 'Attention-based predictor with near-prophetic verbal labeling power.',
  },
  {
    id: 197, name: 'Umbreon', types: ['Dark'], architecture: 'SVM', rarity: 'Rare', price: 4800,
    stats: { pace: 65, verbal: 75, spatial: 78, accuracy: 88 },
    ability: 'Night Scope',
    description: 'SVM thrives in the dark—maximum margin separation in low-light scenes.',
  },
  {
    id: 135, name: 'Jolteon', types: ['Electric'], architecture: 'CNN', rarity: 'Rare', price: 3900,
    stats: { pace: 95, verbal: 70, spatial: 72, accuracy: 75 },
    ability: 'Thunder Sprint',
    description: 'Fastest convolutional net alive. Inference speed is its superpower.',
  },
  {
    id: 134, name: 'Vaporeon', types: ['Water'], architecture: 'Regression', rarity: 'Common', price: 2800,
    stats: { pace: 65, verbal: 80, spatial: 74, accuracy: 72 },
    ability: 'Aqua Label',
    description: 'Linear regression model flows through images, leaving descriptive labels.',
  },
  {
    id: 212, name: 'Scizor', types: ['Bug', 'Steel'], architecture: 'SVM', rarity: 'Epic', price: 6800,
    stats: { pace: 88, verbal: 65, spatial: 79, accuracy: 91 },
    ability: 'Bullet Clip',
    description: 'SVM with steel-claw kernel—sharpest bounding box classifier in the arena.',
  },
  {
    id: 468, name: 'Togekiss', types: ['Fairy', 'Flying'], architecture: 'Transformer', rarity: 'Rare', price: 4100,
    stats: { pace: 62, verbal: 88, spatial: 76, accuracy: 75 },
    ability: 'Serene Grace',
    description: 'Attention-based verbal model with exceptional descriptive grace.',
  },
  {
    id: 130, name: 'Gyarados', types: ['Water', 'Flying'], architecture: 'CNN', rarity: 'Rare', price: 4700,
    stats: { pace: 76, verbal: 69, spatial: 88, accuracy: 80 },
    ability: 'Hydro Radar',
    description: 'Massive spatial CNN—draws bounding boxes like a titan of the deep.',
  },
  {
    id: 59, name: 'Arcanine', types: ['Fire'], architecture: 'MLP', rarity: 'Rare', price: 3600,
    stats: { pace: 91, verbal: 71, spatial: 74, accuracy: 76 },
    ability: 'Extreme Speed',
    description: 'Lightning-fast MLP. Covers every region of the image in milliseconds.',
  },
  {
    id: 248, name: 'Tyranitar', types: ['Rock', 'Dark'], architecture: 'SVM', rarity: 'Epic', price: 7200,
    stats: { pace: 68, verbal: 74, spatial: 88, accuracy: 86 },
    ability: 'Sand Stream',
    description: 'SVM with rock-hard regularization—dominates spatial box classification.',
  },
  {
    id: 149, name: 'Dragonite', types: ['Dragon', 'Flying'], architecture: 'MLP', rarity: 'Epic', price: 8000,
    stats: { pace: 80, verbal: 76, spatial: 82, accuracy: 85 },
    ability: 'Dragon Sight',
    description: 'Well-rounded MLP—balanced layers excelling across all annotation styles.',
  },
  {
    id: 151, name: 'Mew', types: ['Psychic'], architecture: 'Transformer', rarity: 'Legendary', price: 20000,
    stats: { pace: 88, verbal: 90, spatial: 88, accuracy: 90 },
    ability: 'Transform Data',
    description: 'Meta-learning Transformer—adapts to any annotation task instantly.',
  },
  {
    id: 384, name: 'Rayquaza', types: ['Dragon', 'Flying'], architecture: 'MLP', rarity: 'Legendary', price: 30000,
    stats: { pace: 95, verbal: 85, spatial: 92, accuracy: 94 },
    ability: 'Sky Supremacy',
    description: 'Sky-level MLP with divine depth. Annotates from above with zero errors.',
  },
  {
    id: 359, name: 'Absol', types: ['Dark'], architecture: 'CNN', rarity: 'Rare', price: 4300,
    stats: { pace: 82, verbal: 72, spatial: 76, accuracy: 83 },
    ability: 'Super Luck',
    description: 'Anomaly-detection CNN—spots the hidden objects that others miss.',
  },
  {
    id: 282, name: 'Gardevoir', types: ['Psychic', 'Fairy'], architecture: 'Transformer', rarity: 'Epic', price: 6500,
    stats: { pace: 70, verbal: 93, spatial: 84, accuracy: 81 },
    ability: 'Trace Mind',
    description: 'Empathic Transformer—reads scene context and labels with near-human nuance.',
  },
  {
    id: 68, name: 'Machamp', types: ['Fighting'], architecture: 'Regression', rarity: 'Common', price: 2500,
    stats: { pace: 72, verbal: 60, spatial: 71, accuracy: 82 },
    ability: 'No Guard',
    description: 'Brute-force regression with four-armed feature extraction.',
  },
  {
    id: 376, name: 'Metagross', types: ['Steel', 'Psychic'], architecture: 'Transformer', rarity: 'Epic', price: 8800,
    stats: { pace: 70, verbal: 88, spatial: 90, accuracy: 92 },
    ability: 'Clear Body Scan',
    description: 'Supercomputer Transformer—calculates the perfect attention map every time.',
  },
  {
    id: 637, name: 'Volcarona', types: ['Bug', 'Fire'], architecture: 'MLP', rarity: 'Epic', price: 7800,
    stats: { pace: 74, verbal: 82, spatial: 80, accuracy: 85 },
    ability: 'Flame Body',
    description: 'Deep MLP with fiery nonlinear activations—burns through uncertainty.',
  },
].reduce((acc, p) => {
  if (!acc.find(x => x.id === p.id && x.name === p.name)) acc.push(p);
  return acc;
}, [] as Pokemon[]).map((p, i) => ({ ...p, uid: i }));

export const getSpriteUrl = (id: number) => sprite(id);

// 7 starters: Pikachu(CNN), Charizard(MLP), Blastoise(Regression), Alakazam(Transformer), Gengar(CNN), Lucario(SVM), Espeon(Transformer)
export const STARTER_INVENTORY_IDS = [25, 6, 9, 65, 94, 448, 196];
