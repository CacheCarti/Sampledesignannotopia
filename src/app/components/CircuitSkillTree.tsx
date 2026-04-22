import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CircuitBoard, CircuitNode, GameCard,
  BODY_PART_CONFIG, BODY_PARTS, FUSE_CONFIG,
  BodyPart,
} from '../data/cards';
import { AIArchitecture, ARCHITECTURE_COLORS } from '../data/pokemon';

// The circuit lives in a 100x100 viewBox. We hand-tune organ shapes as SVG paths.
// Design: dark PCB background, green solder mask, body-parts rendered as glowing
// silhouettes. Fuses render as capsule-shaped joints with tiny spark animation when
// current crosses them. Bus lines animate a traveling pulse when downstream is lit.

// ─── Organ silhouette paths (hand-tuned, circuit-diagram style) ─────────────
const ORGAN_PATHS: Record<BodyPart, string> = {
  brain: 'M-6 0 C-6 -4 -3 -6 0 -5 C3 -6 6 -4 6 0 C6 3 4 5 0 5 C-4 5 -6 3 -6 0 Z M-2 -3 L0 -1 L2 -3 M-3 1 L3 1',
  eyes:  'M-6 0 Q0 -5 6 0 Q0 5 -6 0 Z M0 0 m-1.8 0 a1.8 1.8 0 1 0 3.6 0 a1.8 1.8 0 1 0 -3.6 0',
  heart: 'M0 4 C-4 0 -6 -2 -4 -4 C-2 -5 -1 -3 0 -2 C1 -3 2 -5 4 -4 C6 -2 4 0 0 4 Z',
  hands: 'M-3 -4 L-3 3 L3 3 L3 -4 L2 -4 L2 1 L1 1 L1 -5 L0 -5 L0 1 L-1 1 L-1 -5 L-2 -5 L-2 1 L-3 1 Z',
  feet:  'M-4 2 C-4 -1 -2 -4 1 -4 C4 -4 5 -2 5 1 C5 3 3 4 0 4 L-3 4 C-4 4 -4 3 -4 2 Z',
  ears:  'M-3 -3 Q-5 0 -3 3 Q-1 4 0 3 Q2 0 1 -3 Q0 -5 -2 -4 Q-3 -4 -3 -3 Z',
  gut:   'M-5 0 C-5 -3 -3 -4 0 -4 C3 -4 5 -3 5 0 C5 3 3 4 0 4 C-3 4 -5 3 -5 0 Z M-3 0 L3 0 M-2 -2 L2 -2 M-2 2 L2 2',
};

const FUSE_SIZE = 5; // half-width of the capsule

interface Props {
  board: CircuitBoard;
  hand: GameCard[];
  selectedCard: GameCard | null;
  focus: number;
  architecture: AIArchitecture;
  onSlotClick: (nodeId: string) => void;
  pulsing?: string | null; // node id currently pulsing (just-equipped)
}

export function CircuitSkillTree({ board, hand, selectedCard, focus, architecture, onSlotClick, pulsing }: Props) {
  const nodeById = useMemo(() => {
    const m: Record<string, CircuitNode> = {};
    board.nodes.forEach(n => { m[n.id] = n; });
    return m;
  }, [board]);

  // Compatibility check: is this node a legal drop for the selected card?
  const isCompat = (n: CircuitNode): boolean => {
    if (!selectedCard) return false;
    if (n.equippedCard) return false;
    if (!n.unlocked) return false;
    if (focus < selectedCard.focusCost) return false;
    if (selectedCard.slot !== n.kind) return false;
    if (selectedCard.compatibleArchitectures && n.kind === 'brain') {
      if (!selectedCard.compatibleArchitectures.includes(architecture)) return false;
    }
    return true;
  };

  const archConf = ARCHITECTURE_COLORS[architecture];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* PCB backdrop */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <pattern id="pcb-grid" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="#1b3a2a" strokeWidth="0.15" />
          </pattern>
          <radialGradient id="pcb-bg" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#0f3d26" />
            <stop offset="100%" stopColor="#051a10" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* backdrop */}
        <rect x="0" y="0" width="100" height="100" fill="url(#pcb-bg)" rx="3" />
        <rect x="0" y="0" width="100" height="100" fill="url(#pcb-grid)" opacity="0.45" />

        {/* traces */}
        {board.edges.map((e, i) => {
          const a = nodeById[e.from]; const b = nodeById[e.to];
          if (!a || !b) return null;
          const live = !!a.equippedCard && !!b.equippedCard;
          const partial = !!a.equippedCard && !b.equippedCard;
          const color = live ? '#5dff9b' : partial ? '#f5c542' : '#2a4a3a';
          return (
            <g key={`e-${i}`}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={color} strokeWidth={live ? 0.9 : 0.55} strokeLinecap="round"
                opacity={live ? 0.9 : 0.55} filter={live ? 'url(#glow)' : undefined} />
              {live && (
                <motion.circle r={0.7} fill="#fff"
                  initial={{ offsetDistance: '0%' }}
                  animate={{ offsetDistance: '100%' }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                  style={{ offsetPath: `path('M ${a.x} ${a.y} L ${b.x} ${b.y}')` } as any}
                />
              )}
            </g>
          );
        })}

        {/* nodes */}
        {board.nodes.map(n => {
          const isFuse = n.kind === 'fuse_common' || n.kind === 'fuse_rare';
          const compat = isCompat(n);
          const dim = !n.unlocked;
          const organ = !isFuse ? BODY_PART_CONFIG[n.kind as BodyPart] : null;
          const color = organ ? organ.color : FUSE_CONFIG[n.kind as 'fuse_common' | 'fuse_rare'].color;

          return (
            <g key={n.id} style={{ cursor: n.unlocked && !n.equippedCard ? 'pointer' : 'default' }}
               onClick={() => onSlotClick(n.id)}>
              {/* compat ring — pulses when card is compatible */}
              {compat && (
                <motion.circle cx={n.x} cy={n.y} r={isFuse ? 5 : 9}
                  fill="none" stroke={color} strokeWidth="0.6"
                  animate={{ r: isFuse ? [5, 7, 5] : [9, 11, 9], opacity: [0.7, 0.3, 0.7] }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                />
              )}

              {isFuse ? (
                // Fuse = horizontal capsule
                <g transform={`translate(${n.x} ${n.y})`} opacity={dim ? 0.35 : 1}>
                  <rect x={-FUSE_SIZE/2} y={-1.4} width={FUSE_SIZE} height={2.8} rx={1.4}
                    fill={n.equippedCard ? color : '#1e2a26'}
                    stroke={color} strokeWidth="0.35" />
                  <line x1={-FUSE_SIZE/2 - 0.8} y1={0} x2={-FUSE_SIZE/2} y2={0} stroke={color} strokeWidth="0.4" />
                  <line x1={FUSE_SIZE/2} y1={0} x2={FUSE_SIZE/2 + 0.8} y2={0} stroke={color} strokeWidth="0.4" />
                  {n.equippedCard && (
                    <motion.circle r={0.5} fill="#fff"
                      animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                  )}
                </g>
              ) : (
                // Organ — outer hexring + inner silhouette
                <g transform={`translate(${n.x} ${n.y})`} opacity={dim ? 0.35 : 1}
                   filter={n.equippedCard ? 'url(#glow-strong)' : undefined}>
                  <motion.circle r={7.5}
                    fill={n.equippedCard ? `${color}22` : '#0a1a14'}
                    stroke={color} strokeWidth="0.7"
                    animate={pulsing === n.id ? { r: [7.5, 10, 7.5] } : {}}
                    transition={{ duration: 0.6 }}
                  />
                  <g transform="scale(0.85)">
                    <path d={ORGAN_PATHS[n.kind as BodyPart]}
                      fill={n.equippedCard ? color : 'none'}
                      stroke={color} strokeWidth="0.45" strokeLinejoin="round" strokeLinecap="round" />
                  </g>
                  {/* label */}
                  <text y={11.5} textAnchor="middle" fontSize="2.1" fontWeight={700}
                    fill={color} letterSpacing="0.1">
                    {organ!.label}
                  </text>
                  {/* architecture lock on brain */}
                  {n.kind === 'brain' && (
                    <text y={-9.5} textAnchor="middle" fontSize="1.8" fill={archConf.color} fontWeight={700}>
                      {archConf.label}
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating equipped-card badges (HTML overlay) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <AnimatePresence>
          {board.nodes.filter(n => n.equippedCard).map(n => {
            const card = n.equippedCard!;
            const isFuse = n.kind === 'fuse_common' || n.kind === 'fuse_rare';
            if (isFuse) return null; // fuses are tiny, no badge
            return (
              <motion.div key={n.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                style={{
                  position: 'absolute',
                  left: `calc(${n.x}% - 14px)`,
                  top:  `calc(${n.y}% + 8px)`,
                  width: 28, height: 28, borderRadius: 8,
                  background: '#182426',
                  border: `1.5px solid ${BODY_PART_CONFIG[n.kind as BodyPart].color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, boxShadow: `0 2px 6px ${BODY_PART_CONFIG[n.kind as BodyPart].color}55`,
                }}
              >
                {card.icon}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Small legend chip used next to the circuit
export function CircuitLegend() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {BODY_PARTS.map(p => {
        const c = BODY_PART_CONFIG[p];
        return (
          <div key={p} title={c.blurb} style={{
            display: 'flex', alignItems: 'center', gap: 3,
            background: '#182426', border: `1px solid ${c.color}55`,
            borderRadius: 6, padding: '2px 6px',
            fontSize: 9, fontWeight: 700, color: c.color, letterSpacing: '0.05em',
          }}>
            <span>{c.icon}</span><span>{c.label}</span>
          </div>
        );
      })}
    </div>
  );
}
