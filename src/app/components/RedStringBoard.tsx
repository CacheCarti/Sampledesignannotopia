import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pokemon, getSpriteUrl } from '../data/pokemon';

// ─── RED STRING DETECTIVE BOARD ─────────────────────────────────────────────
// Cork board: pokemon sprite pinned in the middle with a portrait frame,
// sticky notes / polaroids pinned around it, red string connecting them.
// Shows the Pokemon's live "thinking" — hunches, detected objects, theme
// hypothesis, streak etc.

export interface Clue {
  id: string;
  kind: 'object' | 'theme' | 'hunch' | 'streak' | 'warning';
  title: string;
  body?: string;
  // node position in 0-100 board coords. We pick sensible defaults.
}

const CORK = '#b6843f';
const CORK_DARK = '#8a5a22';
const CORK_SPECK = '#d9a55e';
const NOTE_YELLOW = '#f4e18a';
const NOTE_PINK = '#f7b0c6';
const NOTE_BLUE = '#bce0f2';
const POLAROID = '#f8f2e6';
const RED_STRING = '#c83030';
const PIN_RED = '#e43939';

interface Props {
  pokemon: Pokemon | null;
  clues: Clue[];
  theme?: string;
}

export function RedStringBoard({ pokemon, clues, theme }: Props) {
  // Positions around the centered portrait — rotating ring
  const positioned = useMemo(() => {
    const n = clues.length || 1;
    return clues.map((c, i) => {
      const angle = (i / Math.max(n, 5)) * Math.PI * 2 - Math.PI / 2;
      // radius varies so notes don't align perfectly
      const radius = 32 + ((i % 3) * 3);
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius * 0.72;
      const rot = ((i * 13) % 18) - 9;
      return { ...c, x, y, rot };
    });
  }, [clues]);

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: `
        radial-gradient(circle at 18% 22%, ${CORK_SPECK}77 1.5px, transparent 2px),
        radial-gradient(circle at 72% 38%, ${CORK_SPECK}99 1px, transparent 1.5px),
        radial-gradient(circle at 45% 78%, ${CORK_SPECK}55 2px, transparent 2.5px),
        radial-gradient(circle at 82% 82%, ${CORK_SPECK}66 1.2px, transparent 1.8px),
        linear-gradient(135deg, ${CORK} 0%, ${CORK_DARK} 100%)`,
      borderRadius: 10,
      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.4)',
      overflow: 'hidden',
      border: '3px solid #3a2410',
    }}>
      {/* tape strip at top */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 100, height: 14, background: 'rgba(245, 220, 160, 0.55)',
        borderLeft: '1px solid rgba(0,0,0,0.15)', borderRight: '1px solid rgba(0,0,0,0.15)',
      }} />

      {/* board title */}
      <div style={{
        position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
        fontFamily: "'Courier New', monospace",
        fontSize: 10, letterSpacing: '0.25em', color: '#2a1a08', fontWeight: 800,
      }}>
        CASE BOARD · {theme?.toUpperCase() ?? 'LIVE'}
      </div>

      {/* svg string layer */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {/* red string from each note to center */}
        {positioned.map((c, i) => (
          <motion.line key={`s-${c.id}`}
            x1={50} y1={50} x2={c.x} y2={c.y}
            stroke={RED_STRING} strokeWidth="0.35" opacity="0.9"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          />
        ))}
        {/* inter-note connections — a few spider links */}
        {positioned.length > 2 && positioned.slice(0, -1).map((c, i) => {
          const next = positioned[(i + 2) % positioned.length];
          return (
            <line key={`sx-${i}`} x1={c.x} y1={c.y} x2={next.x} y2={next.y}
              stroke={RED_STRING} strokeWidth="0.22" opacity="0.35" strokeDasharray="1 1.2" />
          );
        })}
      </svg>

      {/* center portrait of the pokemon */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        width: 96, height: 112, background: POLAROID, padding: 6,
        boxShadow: '0 6px 14px rgba(0,0,0,0.4)', borderRadius: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* thumbtack */}
        <div style={{
          position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)',
          width: 12, height: 12, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, #ff7777 0%, ${PIN_RED} 60%, #8a1818 100%)`,
          boxShadow: '0 2px 3px rgba(0,0,0,0.5)', zIndex: 10,
        }} />
        <div style={{
          width: '100%', height: 82, background: '#1a1208',
          borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {pokemon ? (
            <img src={getSpriteUrl(pokemon.id)} alt={pokemon.name}
              style={{ width: 78, height: 78, objectFit: 'contain' }} />
          ) : <span style={{ color: '#8a5a22', fontSize: 28 }}>?</span>}
        </div>
        <div style={{
          fontFamily: "'Courier New', monospace", fontSize: 9,
          fontWeight: 800, color: '#2a1a08', marginTop: 2, letterSpacing: '0.1em',
        }}>
          {pokemon?.name?.toUpperCase() ?? 'UNKNOWN'}
        </div>
      </div>

      {/* sticky notes */}
      <AnimatePresence>
        {positioned.map((c, i) => (
          <StickyNote key={c.id} clue={c} delay={i * 0.08} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function StickyNote({ clue, delay }: { clue: Clue & { x: number; y: number; rot: number }; delay: number }) {
  const palette: Record<Clue['kind'], { bg: string; pin: string; font: string }> = {
    object:  { bg: NOTE_YELLOW, pin: PIN_RED,  font: '#3a2a08' },
    theme:   { bg: NOTE_BLUE,   pin: '#2a78c8', font: '#0a2a48' },
    hunch:   { bg: POLAROID,    pin: '#e87a28', font: '#2a1808' },
    streak:  { bg: NOTE_PINK,   pin: '#c83068', font: '#4a0828' },
    warning: { bg: '#f2b06e',   pin: '#8a2808', font: '#4a1a08' },
  };
  const p = palette[clue.kind];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 22 }}
      style={{
        position: 'absolute',
        left: `${clue.x}%`, top: `${clue.y}%`,
        transform: `translate(-50%,-50%) rotate(${clue.rot}deg)`,
        width: 96, minHeight: 40,
        background: p.bg, padding: '6px 7px 5px', borderRadius: 2,
        boxShadow: '0 3px 6px rgba(0,0,0,0.35), inset 0 -2px 4px rgba(0,0,0,0.08)',
        fontFamily: "'Courier New', monospace", color: p.font,
      }}
    >
      {/* pin */}
      <div style={{
        position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
        width: 8, height: 8, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, #fff6 0%, ${p.pin} 65%, #000 100%)`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
      }} />
      <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.14em', opacity: 0.75 }}>
        {clue.kind.toUpperCase()}
      </div>
      <div style={{ fontSize: 10, fontWeight: 800, lineHeight: 1.15, marginTop: 1 }}>{clue.title}</div>
      {clue.body && <div style={{ fontSize: 8.5, lineHeight: 1.2, marginTop: 2, opacity: 0.85 }}>{clue.body}</div>}
    </motion.div>
  );
}
