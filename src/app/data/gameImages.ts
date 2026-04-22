// Q colors: Q1=cyan, Q2=pink, Q3=amber
export const Q_COLORS = ['#22D3EE', '#EC4899', '#F59E0B'];

export interface GameQuestion {
  text: string;
  short: string;
  tool: 'probe' | 'sweep';
}

export interface GameImage {
  id: string;
  url: string;
  label: string;
  theme: 'nature' | 'urban' | 'kitchen' | 'outdoor' | 'indoor';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  mission: string;
  questions: [GameQuestion, GameQuestion, GameQuestion]; // always exactly 3
}

export const BATTLE_IMAGES: GameImage[] = [
  {
    id: 'wildlife',
    url: 'https://images.unsplash.com/photo-1739387137597-659c6862345c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    label: 'Wildlife Scene',
    theme: 'nature', difficulty: 'Medium',
    mission: 'Natural Habitat — Annotate every living creature, terrain zone, and water source',
    questions: [
      { text: 'Click on every visible animal and living creature in this scene', short: 'Identify all animals', tool: 'probe' },
      { text: 'Paint all open terrain zones, vegetation boundaries and ground cover areas', short: 'Segment terrain', tool: 'sweep' },
      { text: 'Click on all water sources, reflective surfaces, and sky regions', short: 'Mark water & sky', tool: 'probe' },
    ],
  },
  {
    id: 'city',
    url: 'https://images.unsplash.com/photo-1768332479800-e71db8e6acf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    label: 'City Street',
    theme: 'urban', difficulty: 'Hard',
    mission: 'Urban Autonomy — Mark all vehicles, hazard zones, and pedestrians for self-driving AI',
    questions: [
      { text: 'Click on every vehicle (cars, bikes, trucks) in the scene', short: 'Tag all vehicles', tool: 'probe' },
      { text: 'Paint all non-drivable zones — sidewalks, barriers, obstacles and hazard areas', short: 'Segment hazard zones', tool: 'sweep' },
      { text: 'Click on every pedestrian, cyclist and person visible', short: 'Locate all people', tool: 'probe' },
    ],
  },
  {
    id: 'kitchen',
    url: 'https://images.unsplash.com/photo-1768163188662-21c9daf6e99d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    label: 'Kitchen Scene',
    theme: 'kitchen', difficulty: 'Easy',
    mission: 'Safety Audit — Find every hazard, reachable zone and electrical appliance',
    questions: [
      { text: 'Click on every sharp or dangerous item — knives, scissors, small parts', short: 'Mark danger items', tool: 'probe' },
      { text: 'Paint all zones reachable by a child — low surfaces, floor areas, low shelves', short: 'Segment child zones', tool: 'sweep' },
      { text: 'Click on all electrical appliances and indicate their on/off state', short: 'Tag appliances', tool: 'probe' },
    ],
  },
  {
    id: 'park',
    url: 'https://images.unsplash.com/photo-1765118384650-7660293e74f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    label: 'Park Activities',
    theme: 'outdoor', difficulty: 'Medium',
    mission: 'Crowd Analysis — Map all social clusters, pathways, and fixed structures',
    questions: [
      { text: 'Click on every person or group of people visible in the park', short: 'Find all people', tool: 'probe' },
      { text: 'Paint all walkways, open paths and potential crowd bottleneck zones', short: 'Segment pathways', tool: 'sweep' },
      { text: 'Click all fixed structures — benches, signs, fountains and trees', short: 'Mark structures', tool: 'probe' },
    ],
  },
  {
    id: 'supermarket',
    url: 'https://images.unsplash.com/photo-1670684684445-a4504dca0bbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    label: 'Supermarket',
    theme: 'indoor', difficulty: 'Hard',
    mission: 'Retail Inventory — Tag products, segment shelf zones, and mark signage',
    questions: [
      { text: 'Click on every individual distinct product you can identify on the shelves', short: 'Tag products', tool: 'probe' },
      { text: 'Paint entire shelf category zones — dairy, produce, beverages, etc.', short: 'Segment shelf zones', tool: 'sweep' },
      { text: 'Click on all price tags, signs, promotional labels and aisle markers', short: 'Mark all signage', tool: 'probe' },
    ],
  },
  {
    id: 'beach',
    url: 'https://images.unsplash.com/photo-1768076956005-dd299a63d960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    label: 'Beach Scene',
    theme: 'outdoor', difficulty: 'Medium',
    mission: 'Coastal Safety — Identify all water hazards, people, and safety equipment',
    questions: [
      { text: 'Click on every person, boat and visible hazard in or near the water', short: 'Identify water hazards', tool: 'probe' },
      { text: 'Paint all wave zones, rip current areas and unsafe swimming regions', short: 'Segment unsafe water', tool: 'sweep' },
      { text: 'Click on all safety equipment — flags, lifeguard posts, warning signs', short: 'Mark safety gear', tool: 'probe' },
    ],
  },
  {
    id: 'forest',
    url: 'https://images.unsplash.com/photo-1578759463746-bfa6ec4d27e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    label: 'Forest Trail',
    theme: 'nature', difficulty: 'Medium',
    mission: 'Terrain Mapping — Map all trail markers, dense zones, and habitat features',
    questions: [
      { text: 'Click on all trail markers, path openings and visible wildlife', short: 'Map path markers', tool: 'probe' },
      { text: 'Paint dense vegetation zones, passable path areas and light clearings', short: 'Segment vegetation', tool: 'sweep' },
      { text: 'Click on all notable habitat features — fallen trees, clearings, streams', short: 'Tag habitat features', tool: 'probe' },
    ],
  },
];

// Game theme presets for the game-select page
export interface GameTheme {
  id: string;
  label: string;
  icon: string;
  desc: string;
  color: string;
  filter: GameImage['theme'][];
  previewUrl: string;
}

export const GAME_THEMES: GameTheme[] = [
  {
    id: 'nature',
    label: 'Nature & Wildlife',
    icon: '🌿',
    desc: 'Forests, trails and wildlife scenes. Habitat mapping and species identification.',
    color: '#10B981',
    filter: ['nature'],
    previewUrl: 'https://images.unsplash.com/photo-1739387137597-659c6862345c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 'urban',
    label: 'Urban Environments',
    icon: '🚦',
    desc: 'City streets, autonomous vehicle training and pedestrian detection.',
    color: '#22D3EE',
    filter: ['urban'],
    previewUrl: 'https://images.unsplash.com/photo-1768332479800-e71db8e6acf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 'indoor',
    label: 'Indoor Spaces',
    icon: '🏠',
    desc: 'Kitchens, supermarkets and indoor environments. Safety and inventory tasks.',
    color: '#F59E0B',
    filter: ['kitchen', 'indoor'],
    previewUrl: 'https://images.unsplash.com/photo-1768163188662-21c9daf6e99d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 'outdoor',
    label: 'Outdoor Activities',
    icon: '🏃',
    desc: 'Parks, beaches and outdoor scenes. Crowd flow and coastal safety.',
    color: '#A855F7',
    filter: ['outdoor'],
    previewUrl: 'https://images.unsplash.com/photo-1765118384650-7660293e74f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 'mixed',
    label: 'Mixed Batch',
    icon: '🔀',
    desc: 'Random selection from all themes. Maximum variety, maximum XP.',
    color: '#EF4444',
    filter: ['nature', 'urban', 'kitchen', 'outdoor', 'indoor'],
    previewUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
];

// Test reveal images — shown during the AI evaluation phase in Results
export interface TestRevealImage {
  id: string;
  url: string;
  label: string;
  probeTargets: { x: number; y: number; label: string }[];
  sweepRegions: { x: number; y: number; w: number; h: number; label: string }[];
  probeTargets2: { x: number; y: number; label: string }[];
}

export const TEST_REVEAL_IMAGES: TestRevealImage[] = [
  {
    id: 'test-lab',
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    label: 'Research Laboratory',
    probeTargets: [
      { x: 22, y: 38, label: 'Microscope' }, { x: 55, y: 45, label: 'Flask' },
      { x: 78, y: 32, label: 'Monitor' }, { x: 35, y: 62, label: 'Sample' },
    ],
    sweepRegions: [
      { x: 10, y: 25, w: 40, h: 55, label: 'Lab bench' },
      { x: 55, y: 20, w: 38, h: 45, label: 'Equipment zone' },
    ],
    probeTargets2: [
      { x: 45, y: 28, label: 'Centrifuge' }, { x: 68, y: 55, label: 'Screen' }, { x: 18, y: 70, label: 'Storage' },
    ],
  },
  {
    id: 'test-crowd',
    url: 'https://images.unsplash.com/photo-1534214526114-0ea4d47b04f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    label: 'Urban Crowd',
    probeTargets: [
      { x: 18, y: 55, label: 'Person A' }, { x: 38, y: 48, label: 'Person B' },
      { x: 60, y: 52, label: 'Person C' }, { x: 80, y: 45, label: 'Person D' }, { x: 50, y: 70, label: 'Person E' },
    ],
    sweepRegions: [
      { x: 5, y: 60, w: 50, h: 35, label: 'Pedestrian zone' },
      { x: 55, y: 30, w: 40, h: 40, label: 'High density area' },
    ],
    probeTargets2: [
      { x: 25, y: 35, label: 'Signage' }, { x: 70, y: 62, label: 'Vehicle' }, { x: 42, y: 78, label: 'Obstacle' },
    ],
  },
  {
    id: 'test-aerial',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    label: 'Aerial View',
    probeTargets: [
      { x: 25, y: 30, label: 'Structure A' }, { x: 65, y: 25, label: 'Structure B' },
      { x: 45, y: 60, label: 'Vehicle' }, { x: 80, y: 55, label: 'Junction' },
    ],
    sweepRegions: [
      { x: 5, y: 5, w: 45, h: 50, label: 'Zone Alpha' },
      { x: 50, y: 10, w: 45, h: 45, label: 'Zone Beta' },
      { x: 15, y: 55, w: 70, h: 40, label: 'Ground level' },
    ],
    probeTargets2: [
      { x: 35, y: 15, label: 'Roof A' }, { x: 72, y: 42, label: 'Road split' }, { x: 20, y: 75, label: 'Open lot' },
    ],
  },
  {
    id: 'test-medical',
    url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    label: 'Medical Imaging',
    probeTargets: [
      { x: 30, y: 35, label: 'ROI-A' }, { x: 55, y: 40, label: 'ROI-B' }, { x: 70, y: 60, label: 'Anomaly' },
    ],
    sweepRegions: [
      { x: 15, y: 20, w: 35, h: 60, label: 'Primary tissue' },
      { x: 50, y: 25, w: 40, h: 50, label: 'Secondary zone' },
    ],
    probeTargets2: [
      { x: 42, y: 55, label: 'Secondary ROI' }, { x: 25, y: 68, label: 'Border marker' }, { x: 65, y: 30, label: 'Density peak' },
    ],
  },
];
