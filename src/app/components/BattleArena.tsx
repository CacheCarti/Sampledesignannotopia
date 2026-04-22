import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pokemon, getSpriteUrl } from '../data/pokemon';
import { TEST_REVEAL_IMAGES, Q_COLORS } from '../data/gameImages';

// ─── Smash Bros-style battle arena ─────────────────────────────────────────
// Huge TV on top shows the test image with phased overlays:
//   phase 1: MY PREDICTIONS (crosshairs from the player's model)
//   phase 2: ANSWER KEYS (ground truth)
//   phase 3: CLASH (pokemon duel under the TV with lightning/fire)
//   phase 4: VICTOR'S PREDICTIONS (winner's crosshairs glow, loser's fade)

type Phase = 'predictions' | 'keys' | 'clash' | 'victor';

interface Props {
  player: Pokemon;
  ghost: { id: number; name: string; color: string; acc: number };
  won: boolean;
  revealIdx?: number;
}

const TV_BG = '#0a1a12';

export function BattleArena({ player, ghost, won, revealIdx = 0 }: Props) {
  const [phase, setPhase] = useState<Phase>('predictions');
  const reveal = TEST_REVEAL_IMAGES[revealIdx % TEST_REVEAL_IMAGES.length];

  useEffect(() => {
    const steps: [Phase, number][] = [
      ['predictions', 2200],
      ['keys', 2200],
      ['clash', 2600],
      ['victor', 9999],
    ];
    let cancelled = false;
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      setPhase(steps[i][0]);
      if (i < steps.length - 1) {
        const t = setTimeout(() => { i++; tick(); }, steps[i][1]);
        (tick as any)._t = t;
      }
    };
    tick();
    return () => { cancelled = true; clearTimeout((tick as any)._t); };
  }, []);

  const playerCrosshairs = reveal.probeTargets.slice(0, 4);
  const answerCrosshairs = reveal.probeTargets2;

  return (
    <div style={{
      background: '#05120b',
      border: '2px solid #2e3a3d',
      borderRadius: 14,
      padding: 14,
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* phase ticker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.22em', fontWeight: 800, color: '#fff' }}>⚔ ARENA REPLAY</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['predictions','keys','clash','victor'] as Phase[]).map(p => (
            <div key={p} style={{
              fontSize: 9, fontWeight: 800, letterSpacing: '0.18em',
              padding: '3px 8px', borderRadius: 6,
              background: phase === p ? '#f5a74222' : 'transparent',
              color: phase === p ? '#f5a742' : '#6b8078',
              border: `1px solid ${phase === p ? '#f5a742' : '#2e3a3d'}`,
            }}>{p.toUpperCase()}</div>
          ))}
        </div>
      </div>

      {/* ─── TV ───────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        background: '#1a1208',
        borderRadius: 14,
        padding: 10,
        border: '4px solid #2a1a0a',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.7), 0 6px 18px rgba(0,0,0,0.55)',
      }}>
        {/* TV antenna */}
        <div style={{ position: 'absolute', top: -18, left: '50%', display: 'flex', gap: 24, transform: 'translateX(-50%)' }}>
          <div style={{ width: 2, height: 18, background: '#2a1a0a', transform: 'rotate(-18deg)' }} />
          <div style={{ width: 2, height: 18, background: '#2a1a0a', transform: 'rotate(18deg)' }} />
        </div>
        {/* screen */}
        <div style={{
          position: 'relative',
          width: '100%', aspectRatio: '16/7',
          background: TV_BG, borderRadius: 8, overflow: 'hidden',
        }}>
          <img src={reveal.url} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
          {/* scanlines */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px)',
          }} />
          {/* phase banner */}
          <AnimatePresence mode="wait">
            <motion.div key={phase}
              initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.65)', borderRadius: 8, padding: '4px 14px',
                fontSize: 11, fontWeight: 900, letterSpacing: '0.25em', color: '#f5a742',
                border: '1px solid #f5a74288',
              }}>
              {phase === 'predictions' && `${player.name.toUpperCase()} · PREDICTIONS`}
              {phase === 'keys' && 'GROUND TRUTH · ANSWER KEYS'}
              {phase === 'clash' && 'CLASH!'}
              {phase === 'victor' && `${(won ? player.name : ghost.name).toUpperCase()} WINS`}
            </motion.div>
          </AnimatePresence>

          {/* player crosshairs */}
          <AnimatePresence>
            {(phase === 'predictions' || phase === 'victor') && playerCrosshairs.map((t, i) => (
              <motion.div key={`pc-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: phase === 'victor' && !won ? 0.25 : 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ delay: phase === 'predictions' ? i * 0.18 : 0 }}
                style={{
                  position: 'absolute', left: `${t.x}%`, top: `${t.y}%`,
                  transform: 'translate(-50%,-50%)', width: 40, height: 40, pointerEvents: 'none',
                }}>
                <Crosshair color={Q_COLORS[0]} glow={phase === 'victor' && won} />
                <div style={{
                  position: 'absolute', top: 34, left: '50%', transform: 'translateX(-50%)',
                  background: `${Q_COLORS[0]}cc`, color: '#001018', fontSize: 8, fontWeight: 900,
                  letterSpacing: '0.12em', padding: '1px 5px', borderRadius: 3, whiteSpace: 'nowrap',
                }}>{t.label}</div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* answer keys */}
          <AnimatePresence>
            {(phase === 'keys' || phase === 'victor') && answerCrosshairs.map((t, i) => (
              <motion.div key={`ak-${i}`}
                initial={{ scale: 0, rotate: -30, opacity: 0 }}
                animate={{
                  scale: 1, rotate: 0,
                  opacity: phase === 'victor' && won ? 0.35 : 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ delay: phase === 'keys' ? i * 0.18 : 0, type: 'spring' }}
                style={{
                  position: 'absolute', left: `${t.x}%`, top: `${t.y}%`,
                  transform: 'translate(-50%,-50%)', pointerEvents: 'none',
                }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 6,
                  border: `2.5px solid ${Q_COLORS[2]}`,
                  background: `${Q_COLORS[2]}33`,
                  boxShadow: `0 0 14px ${Q_COLORS[2]}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 900, color: '#fff',
                }}>✓</div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* clash flash */}
          <AnimatePresence>
            {phase === 'clash' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0, 0.7, 0] }}
                transition={{ duration: 2.4, times: [0, 0.15, 0.35, 0.6, 1] }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(circle at 50% 60%, #fff 0%, #f5a742 25%, transparent 60%)',
                  mixBlendMode: 'screen', pointerEvents: 'none',
                }} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Stage (below the TV) ─────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        height: 180,
        marginTop: 14,
        background: 'linear-gradient(180deg, #0b1f14 0%, #0a1a12 60%, #061410 100%)',
        borderRadius: 12,
        overflow: 'hidden',
        border: '2px solid #1a2a20',
      }}>
        {/* stage floor */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 22,
          background: 'linear-gradient(180deg, #1c3a2a 0%, #0a1a12 100%)',
          borderTop: '2px solid #2a4a38',
        }} />
        {/* spotlights */}
        <div style={{
          position: 'absolute', top: 0, left: '22%', width: 120, height: 180,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(245,167,66,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 0, right: '22%', width: 120, height: 180,
          background: `radial-gradient(ellipse at 50% 0%, ${ghost.color}33 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* player fighter */}
        <Fighter
          side="left"
          sprite={getSpriteUrl(player.id)}
          name={player.name}
          color="#f5a742"
          phase={phase}
          won={won}
          isWinner={won}
        />
        {/* ghost fighter */}
        <Fighter
          side="right"
          sprite={getSpriteUrl(ghost.id)}
          name={ghost.name}
          color={ghost.color}
          phase={phase}
          won={!won}
          isWinner={!won}
          flipped
        />

        {/* clash effects */}
        <AnimatePresence>
          {phase === 'clash' && (
            <>
              {/* lightning from player */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: [0, 1, 0.7, 0], scaleX: [0, 1, 1, 1] }}
                transition={{ duration: 1.6, times: [0, 0.3, 0.6, 1] }}
                style={{
                  position: 'absolute', left: '22%', top: '40%', width: '32%', height: 8,
                  background: 'linear-gradient(90deg, #ffe067 0%, #f5a742 50%, transparent 100%)',
                  filter: 'drop-shadow(0 0 8px #f5a742)',
                  transformOrigin: 'left center',
                  clipPath: 'polygon(0 0, 20% 100%, 40% 0, 60% 100%, 80% 0, 100% 50%, 80% 100%, 0 100%)',
                }} />
              {/* fire from ghost */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: [0, 0.9, 0.5, 0], scaleX: [0, 1, 1, 1] }}
                transition={{ duration: 1.6, delay: 0.25, times: [0, 0.3, 0.6, 1] }}
                style={{
                  position: 'absolute', right: '22%', top: '45%', width: '28%', height: 16,
                  background: `linear-gradient(270deg, ${ghost.color} 0%, #ff6dae 50%, transparent 100%)`,
                  filter: `drop-shadow(0 0 12px ${ghost.color})`,
                  borderRadius: 8,
                  transformOrigin: 'right center',
                }} />
              {/* impact star at center */}
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{ scale: [0, 1.6, 1.2], opacity: [0, 1, 0.8], rotate: [0, 60, 30] }}
                transition={{ duration: 1.2, delay: 0.55 }}
                style={{
                  position: 'absolute', left: '50%', top: '48%',
                  transform: 'translate(-50%,-50%)',
                  width: 70, height: 70,
                  background: 'radial-gradient(circle, #fff 0%, #ffe067 40%, #f5a742 70%, transparent 100%)',
                  clipPath: 'polygon(50% 0%, 62% 35%, 100% 50%, 62% 65%, 50% 100%, 38% 65%, 0% 50%, 38% 35%)',
                  filter: 'drop-shadow(0 0 18px #ffe067)',
                }} />
              {/* BAM text */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.4, 1.1], opacity: [0, 1, 0.9] }}
                transition={{ duration: 0.9, delay: 0.8 }}
                style={{
                  position: 'absolute', left: '50%', top: '50%',
                  transform: 'translate(-50%,-50%)',
                  fontSize: 42, fontWeight: 900, color: '#fff',
                  textShadow: '3px 3px 0 #f5a742, 6px 6px 0 #c0721c',
                  letterSpacing: '0.08em',
                  fontFamily: "'Rajdhani', sans-serif",
                }}>BAM!</motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* legend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: '#8ba5a0' }}>
        <span><span style={{ color: Q_COLORS[0] }}>●</span> Your predictions</span>
        <span><span style={{ color: Q_COLORS[2] }}>✓</span> Ground truth</span>
        <span>Clash resolves the case.</span>
      </div>
    </div>
  );
}

function Crosshair({ color, glow }: { color: string; glow: boolean }) {
  return (
    <svg viewBox="0 0 40 40" style={{ width: '100%', height: '100%', filter: glow ? `drop-shadow(0 0 10px ${color})` : 'none' }}>
      <circle cx={20} cy={20} r={16} fill="none" stroke={color} strokeWidth="1.6" opacity="0.85" />
      <circle cx={20} cy={20} r={3} fill={color} />
      <line x1={20} y1={0} x2={20} y2={8} stroke={color} strokeWidth="1.6" />
      <line x1={20} y1={32} x2={20} y2={40} stroke={color} strokeWidth="1.6" />
      <line x1={0} y1={20} x2={8} y2={20} stroke={color} strokeWidth="1.6" />
      <line x1={32} y1={20} x2={40} y2={20} stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

function Fighter({ side, sprite, name, color, phase, won, isWinner, flipped }: {
  side: 'left' | 'right';
  sprite: string; name: string; color: string;
  phase: Phase; won: boolean; isWinner: boolean; flipped?: boolean;
}) {
  const base = side === 'left' ? { left: '15%' } : { right: '15%' };
  const lungeX = side === 'left' ? 70 : -70;

  const anim = phase === 'predictions' || phase === 'keys'
    ? { x: 0, y: [0, -4, 0], rotate: 0, scale: 1 }
    : phase === 'clash'
      ? { x: [0, lungeX, 0, lungeX * 0.6, 0], y: [0, -12, 0, -8, 0], rotate: [0, side === 'left' ? 8 : -8, 0, 4, 0], scale: [1, 1.08, 1, 1.05, 1] }
      : isWinner
        ? { x: 0, y: [0, -10, 0], rotate: 0, scale: 1.1 }
        : { x: 0, y: 24, rotate: side === 'left' ? -35 : 35, scale: 0.9, opacity: 0.5 };

  return (
    <motion.div
      animate={anim}
      transition={{ duration: phase === 'clash' ? 2 : 1.2, repeat: phase === 'predictions' || phase === 'keys' ? Infinity : 0 }}
      style={{
        position: 'absolute', bottom: 18, ...base,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      }}>
      {/* nameplate */}
      <div style={{
        background: `${color}cc`, color: '#001018',
        fontSize: 9, fontWeight: 900, letterSpacing: '0.15em',
        padding: '2px 8px', borderRadius: 4,
        boxShadow: `0 0 10px ${color}77`,
        fontFamily: "'Rajdhani', sans-serif",
      }}>
        {name.toUpperCase()}
        {phase === 'victor' && isWinner && <span style={{ marginLeft: 6 }}>👑</span>}
      </div>
      {/* sprite */}
      <div style={{
        width: 96, height: 96,
        filter: phase === 'victor' && isWinner ? `drop-shadow(0 0 18px ${color})` : 'none',
      }}>
        <img src={sprite} style={{
          width: '100%', height: '100%', objectFit: 'contain',
          transform: flipped ? 'scaleX(-1)' : 'none',
          imageRendering: 'pixelated',
        }} />
      </div>
      {/* shadow */}
      <div style={{
        width: 70, height: 8, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%)',
        marginTop: -6,
      }} />
    </motion.div>
  );
}

export default BattleArena;
