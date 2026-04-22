import { AIArchitecture } from './pokemon';

// ─── ANNOTOPIA CARD SYSTEM ──────────────────────────────────────────────────
// Cards are Pokémon body-parts or training protocols. They slot into an
// electrical-circuit skill tree. Organs = major PART slots. Fuses = cheap
// gating slots. Boosters = clip-on capacitors. Tactical = global slots.

// ─── Card Families (per Context §21-H) ──────────────────────────────────────
export type CardFamily = 'tactic' | 'protocol' | 'relic' | 'mutation' | 'counter';
export type CardRole = 'part' | 'boost' | 'tactical';
export type TacticalType = 'sabotage' | 'defense';
export type CardRarity = 'common' | 'rare' | 'epic';

// ─── Body-Part Slot Taxonomy ────────────────────────────────────────────────
// Major organs (PART slots)
export type BodyPart =
  | 'brain'   // 🧠 Architecture core (peak, epic)
  | 'eyes'    // 👁 Lens / spatial (DINO-leaning)
  | 'heart'   // ❤ Focus/morale power
  | 'hands'   // ✋ Tactical slot (defense/sabotage)
  | 'feet'    // 🦶 Pace / focus regen
  | 'ears'    // 👂 Verbal / semantic (CLIP-leaning)
  | 'gut';    // ⚙ Training regime

// Fuse slots (cheap gating joints that connect organs)
export type FuseTier = 'fuse_common' | 'fuse_rare';

export type SlotKind = BodyPart | FuseTier;

export const BODY_PARTS: BodyPart[] = ['brain', 'eyes', 'heart', 'hands', 'feet', 'ears', 'gut'];

export const BODY_PART_CONFIG: Record<BodyPart, {
  label: string;
  icon: string;
  color: string;
  glow: string;
  blurb: string;
  statAffinity: 'pace' | 'verbal' | 'spatial' | 'accuracy';
}> = {
  brain:  { label: 'BRAIN',  icon: '🧠', color: '#b879ff', glow: '#b879ff80', blurb: 'Architecture core — evolves MLP → CNN → ViT', statAffinity: 'accuracy' },
  eyes:   { label: 'EYES',   icon: '👁', color: '#22d3ee', glow: '#22d3ee80', blurb: 'Lens / vision — spatial acuity (DINO)',         statAffinity: 'spatial'  },
  heart:  { label: 'HEART',  icon: '❤',  color: '#f5a742', glow: '#f5a74280', blurb: 'Focus power — caps your morale meter',           statAffinity: 'accuracy' },
  hands:  { label: 'HANDS',  icon: '✋', color: '#ef4637', glow: '#ef463780', blurb: 'Tactical — plays defense & sabotage cards',     statAffinity: 'verbal'   },
  feet:   { label: 'FEET',   icon: '🦶', color: '#5db44b', glow: '#5db44b80', blurb: 'Pace — focus regen & annotation speed',          statAffinity: 'pace'     },
  ears:   { label: 'EARS',   icon: '👂', color: '#ff6dae', glow: '#ff6dae80', blurb: 'Semantic — verbal reasoning (CLIP)',             statAffinity: 'verbal'   },
  gut:    { label: 'GUT',    icon: '⚙',  color: '#c8c8e0', glow: '#c8c8e080', blurb: 'Training regime — epochs, lr, regularization',   statAffinity: 'accuracy' },
};

export const FUSE_CONFIG: Record<FuseTier, { label: string; color: string }> = {
  fuse_common: { label: 'SOLDER', color: '#8ba5a0' },
  fuse_rare:   { label: 'RELAY',  color: '#f5c542' },
};

// ─── Card ───────────────────────────────────────────────────────────────────
export interface GameCard {
  id: string;
  name: string;
  role: CardRole;
  family: CardFamily;
  rarity: CardRarity;
  focusCost: number;
  icon: string;
  description: string;
  effect: string;
  slot: SlotKind;               // which organ / fuse this card plugs into
  compatibleArchitectures?: AIArchitecture[];
  tacticalType?: TacticalType;
  statBoost?: { pace?: number; verbal?: number; spatial?: number; accuracy?: number };
  scoreMultiplier?: number;
}

export const FOCUS_COSTS: Record<CardRarity, number> = { common: 8, rare: 15, epic: 25 };

export const CARD_FAMILY_CONFIG: Record<CardFamily, { color: string; label: string; blurb: string }> = {
  tactic:   { color: '#22d3ee', label: 'TACTIC',   blurb: 'Single-round effect' },
  protocol: { color: '#b879ff', label: 'PROTOCOL', blurb: 'Multi-round buff' },
  relic:    { color: '#f5c542', label: 'RELIC',    blurb: 'Run-permanent passive' },
  mutation: { color: '#ff6dae', label: 'MUTATION', blurb: 'Changes growth curve' },
  counter:  { color: '#ef4637', label: 'COUNTER',  blurb: 'Reactive defense' },
};

export const CARD_ROLE_COLORS: Record<CardRole, { color: string; bg: string; label: string; icon: string }> = {
  part:     { color: '#60A5FA', bg: '#60A5FA15', label: 'PART',     icon: '⚙️' },
  boost:    { color: '#34D399', bg: '#34D39915', label: 'BOOST',    icon: '⚡' },
  tactical: { color: '#F87171', bg: '#F8717115', label: 'TACTICAL', icon: '🎯' },
};

export const CARD_RARITY_COLORS: Record<CardRarity, { color: string; glow: string; border: string }> = {
  common: { color: '#9CA3AF', glow: '#9CA3AF30', border: '#9CA3AF44' },
  rare:   { color: '#60A5FA', glow: '#60A5FA30', border: '#60A5FA44' },
  epic:   { color: '#A855F7', glow: '#A855F730', border: '#A855F744' },
};

export const TACTICAL_SLOT_CONFIG: Record<TacticalType, { color: string; icon: string; label: string }> = {
  sabotage: { color: '#EF4444', icon: '💣', label: 'SABOTAGE' },
  defense:  { color: '#3B82F6', icon: '🛡️', label: 'DEFENSE' },
};

// ─── Circuit Skill Tree (single-Pokémon, body-part organ graph) ─────────────
export interface CircuitNode {
  id: string;
  kind: SlotKind;
  label: string;
  description: string;
  x: number; y: number;         // relative layout (0-100)
  unlocked: boolean;
  equippedCard: GameCard | null;
  requires?: string[];          // node ids that must be equipped first (fuse gating)
  requiredArchitecture?: AIArchitecture;
}

export interface CircuitEdge {
  from: string;
  to: string;
  kind: 'bus' | 'fuse';         // bus = main power line, fuse = gating joint
}

export interface CircuitBoard {
  nodes: CircuitNode[];
  edges: CircuitEdge[];
}

// Create a single-Pokémon anatomical circuit.
// Layout: BRAIN at top-center (peak). EYES top-left, EARS top-right.
// HEART center. HANDS left-mid, FEET right-mid. GUT bottom.
// Fuses sit on every connector and gate the path upward.
export function createCircuitBoard(arch: AIArchitecture = 'CNN'): CircuitBoard {
  const n = (id: string, kind: SlotKind, label: string, desc: string, x: number, y: number, requires?: string[], unlocked = false, reqArch?: AIArchitecture): CircuitNode => ({
    id, kind, label, description: desc, x, y, unlocked, equippedCard: null, requires, requiredArchitecture: reqArch,
  });

  const nodes: CircuitNode[] = [
    // Bottom — root power
    n('gut',     'gut',    'GUT',    'Training regime. Always open — start here.', 50, 88, [], true),

    // Fuse ring 0 → organs
    n('f-gut-heart',   'fuse_common', 'solder',  'Solder joint.', 50, 72, ['gut'], true),
    n('f-gut-feet',    'fuse_common', 'solder',  'Solder joint.', 72, 82, ['gut'], true),
    n('f-gut-hands',   'fuse_common', 'solder',  'Solder joint.', 28, 82, ['gut'], true),

    // Mid row — HEART / HANDS / FEET
    n('heart',  'heart',  'HEART',  'Focus power core.',      50, 56, ['f-gut-heart'], false),
    n('hands',  'hands',  'HANDS',  'Tactical effectors.',    14, 64, ['f-gut-hands'], false),
    n('feet',   'feet',   'FEET',   'Pace drivers.',          86, 64, ['f-gut-feet'],  false),

    // Fuse ring 1 → sensory organs
    n('f-heart-eyes',  'fuse_rare', 'relay',  'Relay joint.', 30, 40, ['heart'], false),
    n('f-heart-ears',  'fuse_rare', 'relay',  'Relay joint.', 70, 40, ['heart'], false),

    // Upper row — EYES / EARS
    n('eyes',   'eyes',   'EYES',   'Vision lens.',           22, 24, ['f-heart-eyes'], false),
    n('ears',   'ears',   'EARS',   'Semantic receiver.',     78, 24, ['f-heart-ears'], false),

    // Fuse ring 2 → brain apex
    n('f-eyes-brain',  'fuse_rare', 'relay',  'Apex relay.',  36, 14, ['eyes'], false),
    n('f-ears-brain',  'fuse_rare', 'relay',  'Apex relay.',  64, 14, ['ears'], false),

    // Peak — BRAIN
    n('brain',  'brain',  'BRAIN',  'Architecture apex.',     50, 4,  ['f-eyes-brain','f-ears-brain'], false, arch),
  ];

  const edges: CircuitEdge[] = [
    { from: 'gut',    to: 'f-gut-heart', kind: 'fuse' },
    { from: 'gut',    to: 'f-gut-hands', kind: 'fuse' },
    { from: 'gut',    to: 'f-gut-feet',  kind: 'fuse' },
    { from: 'f-gut-heart', to: 'heart', kind: 'bus' },
    { from: 'f-gut-hands', to: 'hands', kind: 'bus' },
    { from: 'f-gut-feet',  to: 'feet',  kind: 'bus' },
    { from: 'heart',  to: 'f-heart-eyes', kind: 'fuse' },
    { from: 'heart',  to: 'f-heart-ears', kind: 'fuse' },
    { from: 'f-heart-eyes', to: 'eyes', kind: 'bus' },
    { from: 'f-heart-ears', to: 'ears', kind: 'bus' },
    { from: 'eyes',   to: 'f-eyes-brain', kind: 'fuse' },
    { from: 'ears',   to: 'f-ears-brain', kind: 'fuse' },
    { from: 'f-eyes-brain', to: 'brain', kind: 'bus' },
    { from: 'f-ears-brain', to: 'brain', kind: 'bus' },
  ];

  return { nodes, edges };
}

// Recompute which nodes are unlocked based on equipped requirements.
export function recomputeUnlocks(board: CircuitBoard): CircuitBoard {
  const equipped = new Set(board.nodes.filter(n => n.equippedCard).map(n => n.id));
  return {
    ...board,
    nodes: board.nodes.map(n => {
      if (!n.requires || n.requires.length === 0) return { ...n, unlocked: true };
      const ok = n.requires.every(req => equipped.has(req));
      return { ...n, unlocked: ok || n.unlocked && !!n.equippedCard };
    }),
  };
}

// ─── Card Library — body-part slotted, Annotopia flavor ─────────────────────
export const ALL_CARDS: GameCard[] = [
  // GUT (training regime) — always accessible, the warmup cards
  { id:'gut_epochs',  name:'Extra Epochs',     role:'part', family:'protocol', rarity:'common', focusCost:6, icon:'⏱️',
    description:'More training passes per image.', effect:'+3 Accuracy · +2 Pace', slot:'gut',
    statBoost:{ accuracy:3, pace:2 } },
  { id:'gut_reg',     name:'Weight Decay',     role:'part', family:'protocol', rarity:'common', focusCost:6, icon:'🪢',
    description:'L2 regularization. Less overfit.', effect:'+4 Accuracy · -1 Overfit', slot:'gut',
    statBoost:{ accuracy:4 } },

  // FUSES — cheap gating joints. Thematic, very spammy.
  { id:'fuse_solder_a', name:'Flux Solder',   role:'part', family:'tactic', rarity:'common', focusCost:4, icon:'🫠',
    description:'Cheap solder joint. Bridges two organs.', effect:'Unlocks next slot', slot:'fuse_common' },
  { id:'fuse_solder_b', name:'Copper Wire',   role:'part', family:'tactic', rarity:'common', focusCost:4, icon:'🧵',
    description:'Simple wire bridge.', effect:'Unlocks next slot', slot:'fuse_common' },
  { id:'fuse_solder_c', name:'Pin Bridge',    role:'part', family:'tactic', rarity:'common', focusCost:5, icon:'📎',
    description:'Cheap pin gate.', effect:'Unlocks next slot', slot:'fuse_common' },
  { id:'fuse_relay_a',  name:'Gold Relay',    role:'part', family:'protocol', rarity:'rare', focusCost:10, icon:'🔗',
    description:'High-throughput relay. Required for sensory organs.', effect:'Unlocks · +2 all stats', slot:'fuse_rare',
    statBoost:{ pace:2, verbal:2, spatial:2, accuracy:2 } },
  { id:'fuse_relay_b',  name:'Apex Coupler',  role:'part', family:'protocol', rarity:'rare', focusCost:10, icon:'🪙',
    description:'Couples sensory output into the brain bus.', effect:'Unlocks · +4 Verbal/Spatial', slot:'fuse_rare',
    statBoost:{ verbal:4, spatial:4 } },

  // HEART (focus power)
  { id:'heart_capacitor', name:'Focus Capacitor', role:'part', family:'protocol', rarity:'common', focusCost:8, icon:'⚡',
    description:'Bigger focus pool.', effect:'+15 Max Focus · +4 Accuracy', slot:'heart',
    statBoost:{ accuracy:4 } },
  { id:'heart_core',      name:'Resonance Core',  role:'part', family:'relic', rarity:'rare', focusCost:14, icon:'💠',
    description:'Focus regenerates from correct honeypots too.', effect:'+25 Max Focus · +6 all', slot:'heart',
    statBoost:{ pace:6, verbal:6, spatial:6, accuracy:6 } },

  // EYES (vision / spatial)
  { id:'eyes_lens_cnn', name:'Convolution Lens', role:'part', family:'mutation', rarity:'common', focusCost:9, icon:'🔲',
    description:'Stacked conv filters. Sharper edges.', effect:'+7 Spatial · +3 Accuracy', slot:'eyes',
    compatibleArchitectures:['CNN','MLP'], statBoost:{ spatial:7, accuracy:3 } },
  { id:'eyes_dino',      name:'DINO Iris',        role:'part', family:'mutation', rarity:'rare', focusCost:15, icon:'🦕',
    description:'Self-supervised spatial acuity.', effect:'+10 Spatial · +5 Pace', slot:'eyes',
    compatibleArchitectures:['CNN','Transformer'], statBoost:{ spatial:10, pace:5 } },
  { id:'eyes_sniper',    name:'Crosshair Optics', role:'part', family:'relic', rarity:'epic', focusCost:22, icon:'🎯',
    description:'Predictions concentrate into a single crosshair.', effect:'+12 Spatial · +12 Accuracy', slot:'eyes',
    statBoost:{ spatial:12, accuracy:12 } },

  // EARS (semantic / CLIP)
  { id:'ears_clip',  name:'CLIP Cochlea', role:'part', family:'mutation', rarity:'rare', focusCost:14, icon:'🎧',
    description:'Language-image contrastive alignment.', effect:'+10 Verbal · +5 Spatial', slot:'ears',
    compatibleArchitectures:['Transformer','MLP'], statBoost:{ verbal:10, spatial:5 } },
  { id:'ears_tok',   name:'Token Tuner',  role:'part', family:'mutation', rarity:'common', focusCost:9, icon:'📻',
    description:'Sharper tokenization.', effect:'+6 Verbal', slot:'ears',
    statBoost:{ verbal:6 } },

  // FEET (pace / focus regen)
  { id:'feet_sprint', name:'Sprint Routine',  role:'part', family:'protocol', rarity:'common', focusCost:7, icon:'🥾',
    description:'Faster inference loop.', effect:'+8 Pace · focus regen +20%', slot:'feet',
    statBoost:{ pace:8 } },
  { id:'feet_turbo',  name:'Turbo Graft',     role:'part', family:'mutation', rarity:'rare', focusCost:13, icon:'🚀',
    description:'Latency-trimmed forward pass.', effect:'+12 Pace · focus regen +35%', slot:'feet',
    statBoost:{ pace:12 } },

  // HANDS (tactical effectors — these organs *themselves* host tactical cards)
  { id:'hands_shield',  name:'Focus Shield',    role:'tactical', family:'counter', rarity:'common', focusCost:10, icon:'🛡️',
    description:'Blocks the next sabotage.', effect:'Immune to 1 sabotage', slot:'hands',
    tacticalType:'defense' },
  { id:'hands_reflect', name:'Counter Pulse',   role:'tactical', family:'counter', rarity:'rare',  focusCost:18, icon:'🪞',
    description:'Reflect sabotage back at sender.', effect:'Reflect + 10 focus dmg', slot:'hands',
    tacticalType:'defense' },
  { id:'hands_fortress',name:'Neural Fortress', role:'tactical', family:'counter', rarity:'epic',  focusCost:28, icon:'🏰',
    description:'15s total immunity.', effect:'Full immunity 15s', slot:'hands',
    tacticalType:'defense' },
  { id:'hands_jam',     name:'Signal Jam',      role:'tactical', family:'tactic', rarity:'common', focusCost:10, icon:'📡',
    description:'Disrupt opponent focus regen.', effect:'-5 focus/s for 10s', slot:'hands',
    tacticalType:'sabotage' },
  { id:'hands_blur',    name:'Visual Noise',    role:'tactical', family:'tactic', rarity:'rare',   focusCost:18, icon:'🌫️',
    description:'Noise overlay on opponents.', effect:'-15% accuracy for 12s', slot:'hands',
    tacticalType:'sabotage' },
  { id:'hands_drain',   name:'Focus Drain',     role:'tactical', family:'tactic', rarity:'epic',   focusCost:28, icon:'💀',
    description:'Steal focus from all opponents.', effect:'Steal 20 focus each', slot:'hands',
    tacticalType:'sabotage' },

  // BRAIN (architecture apex — end-state cards)
  { id:'brain_mlp', name:'Dense Cortex',  role:'part', family:'mutation', rarity:'rare', focusCost:18, icon:'🧱',
    description:'Dense MLP apex.', effect:'+10 all stats', slot:'brain',
    compatibleArchitectures:['MLP'], statBoost:{ pace:10, verbal:10, spatial:10, accuracy:10 } },
  { id:'brain_cnn', name:'ResNet Cortex', role:'part', family:'mutation', rarity:'rare', focusCost:18, icon:'🔁',
    description:'CNN apex with residuals.', effect:'+12 Spatial · +8 Accuracy', slot:'brain',
    compatibleArchitectures:['CNN'], statBoost:{ spatial:12, accuracy:8 } },
  { id:'brain_vit', name:'ViT Cortex',    role:'part', family:'mutation', rarity:'epic', focusCost:26, icon:'🧠',
    description:'Vision Transformer apex.', effect:'+14 Verbal · +14 Spatial · +8 Accuracy', slot:'brain',
    compatibleArchitectures:['Transformer'], statBoost:{ verbal:14, spatial:14, accuracy:8 } },
  { id:'brain_ridge', name:'Kernel Ridge Brain', role:'part', family:'mutation', rarity:'common', focusCost:14, icon:'📐',
    description:'Lightweight regression apex.', effect:'+8 Accuracy · +4 Verbal', slot:'brain',
    compatibleArchitectures:['Regression'], statBoost:{ accuracy:8, verbal:4 } },
  { id:'brain_svm', name:'Max-Margin Brain', role:'part', family:'mutation', rarity:'rare', focusCost:16, icon:'⚔️',
    description:'SVM apex, wide hyperplane.', effect:'+10 Accuracy · +6 Spatial', slot:'brain',
    compatibleArchitectures:['SVM'], statBoost:{ accuracy:10, spatial:6 } },
];

// Draw a themed hand. Heavy on fuses+organs so circuit filling is possible.
export function generateHand(size: number = 9): GameCard[] {
  const pool = [...ALL_CARDS];
  const fuses  = pool.filter(c => c.slot === 'fuse_common' || c.slot === 'fuse_rare');
  const organs = pool.filter(c => ['eyes','ears','heart','feet','gut'].includes(c.slot as string));
  const brain  = pool.filter(c => c.slot === 'brain');
  const hands  = pool.filter(c => c.slot === 'hands');

  const pick = (arr: GameCard[], n: number) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
  const hand = [
    ...pick(fuses,  3),
    ...pick(organs, 3),
    ...pick(hands,  2),
    ...pick(brain,  1),
  ].slice(0, size);
  return hand.sort(() => Math.random() - 0.5);
}

// ─── Legacy skill-tree shim (kept so any old imports still compile) ─────────
export interface SkillTreeNode {
  id: string; tier: 0 | 1 | 2 | 3; label: string; description: string;
  acceptsRole: 'part' | 'boost'; equippedCard: GameCard | null; unlocked: boolean;
  parentId?: string; requiredArchitecture?: AIArchitecture;
}
export function createSkillTree(_q: number): SkillTreeNode[] { return []; }

// ─── Map ────────────────────────────────────────────────────────────────────
export type MapNodeType = 'subset' | 'elite' | 'market' | 'miner' | 'benchmark' | 'boss' | 'dojo';

export interface MapNode {
  id: string;
  type: MapNodeType;
  label: string;
  x: number; y: number;
  connections: string[];
  state: 'locked' | 'available' | 'current' | 'completed';
  theme?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  flavor?: string;
}

export const MAP_NODE_CONFIG: Record<MapNodeType, { color: string; icon: string; label: string; blurb: string }> = {
  dojo:      { color: '#8ba5a0', icon: '🎋', label: 'DOJO',      blurb: 'Tutorial — low stakes warm-up' },
  subset:    { color: '#22D3EE', icon: '📦', label: 'SUBSET',    blurb: 'Standard annotation round' },
  elite:     { color: '#F59E0B', icon: '💀', label: 'ELITE',     blurb: 'Dense honeypots, rarer cards' },
  market:    { color: '#10B981', icon: '🏪', label: 'MARKET',    blurb: 'Buy, exhaust, trade mid-run' },
  miner:     { color: '#EC4899', icon: '⛏️', label: 'MINER',     blurb: 'Question-hunt · classification' },
  benchmark: { color: '#A78BFA', icon: '📊', label: 'BENCHMARK', blurb: 'Ship your Pokémon against industry baselines' },
  boss:      { color: '#EF4444', icon: '👑', label: 'GHOST BOSS', blurb: 'Fight an evolved Pokémon ghost' },
};

export function generateBucketMap(): MapNode[] {
  return [
    { id: 'start',  type:'dojo',   label:'Dojo',           x:50, y:0, connections:['n1a','n1b','n1c'], state:'completed', theme:'indoor', difficulty:'Easy', flavor:'Tutorial' },
    { id: 'n1a',    type:'subset', label:'Kitchen Scan',   x:20, y:1, connections:['n2a','n2b'], state:'available', theme:'kitchen', difficulty:'Easy' },
    { id: 'n1b',    type:'market', label:'Card Vendor',    x:50, y:1, connections:['n2b','n2c'], state:'available' },
    { id: 'n1c',    type:'subset', label:'Urban Recon',    x:80, y:1, connections:['n2c','n2d'], state:'available', theme:'urban', difficulty:'Medium' },
    { id: 'n2a',    type:'miner',  label:'Question Miner', x:15, y:2, connections:['n3a'],       state:'locked' },
    { id: 'n2b',    type:'subset', label:'Park Survey',    x:38, y:2, connections:['n3a','n3b'], state:'locked', theme:'outdoor', difficulty:'Medium' },
    { id: 'n2c',    type:'benchmark', label:'Benchmark',   x:62, y:2, connections:['n3b','n3c'], state:'locked' },
    { id: 'n2d',    type:'subset', label:'Beach Patrol',   x:85, y:2, connections:['n3c'],       state:'locked', theme:'outdoor', difficulty:'Medium' },
    { id: 'n3a',    type:'elite',  label:'Elite: Forest',  x:25, y:3, connections:['n4a'],       state:'locked', theme:'nature', difficulty:'Hard' },
    { id: 'n3b',    type:'market', label:'Black Market',   x:50, y:3, connections:['n4a','n4b'], state:'locked' },
    { id: 'n3c',    type:'elite',  label:'Elite: Market',  x:75, y:3, connections:['n4b'],       state:'locked', theme:'indoor', difficulty:'Hard' },
    { id: 'n4a',    type:'boss',   label:'Ghost: The Lab', x:35, y:4, connections:[],            state:'locked', theme:'indoor', difficulty:'Hard' },
    { id: 'n4b',    type:'boss',   label:'Ghost: Crowd',   x:65, y:4, connections:[],            state:'locked', theme:'urban',  difficulty:'Hard' },
  ];
}
