import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { getSpriteUrl, ARCHITECTURE_COLORS } from '../data/pokemon';
import { TEST_REVEAL_IMAGES, Q_COLORS } from '../data/gameImages';
import { BattleArena } from '../components/BattleArena';

const PANEL = '#182426';
const PANEL_INNER = '#2e3a3d';
const FELT = '#0f3d26';
const AMBER = '#f5a742';
const FONT = "'Rajdhani', sans-serif";

type Archetype = 'Sniper' | 'Hunter' | 'Tank' | 'Speedrunner' | 'Meta';

export function Results() {
  const nav = useNavigate();
  const { activePokemon, lastRoundScore, roundResults, cardCombat, updateLeaderboard, diamonds } = useGame();
  const [revealIdx, setRevealIdx] = useState(0);

  // Fake but coherent metrics derived from trust + honeypot streak
  const metrics = useMemo(() => {
    const base = cardCombat.trustScore / 100;
    const streak = Math.min(1, cardCombat.honeypotStreak / 5);
    const precision = Math.round((0.58 + base * 0.32 + streak * 0.08) * 100);
    const recall    = Math.round((0.52 + base * 0.28 + Math.random() * 0.05) * 100);
    const accuracy  = Math.round((0.50 + base * 0.34 + streak * 0.12) * 100);
    const f1 = Math.round((2 * precision * recall) / Math.max(1, precision + recall));
    const archetype: Archetype = precision > recall + 8 ? 'Sniper'
      : recall > precision + 8 ? 'Hunter'
      : accuracy > 80 ? 'Tank' : precision + recall < 120 ? 'Speedrunner' : 'Meta';
    return { precision, recall, accuracy, f1, archetype };
  }, [cardCombat]);

  useEffect(() => { updateLeaderboard(lastRoundScore); }, []);

  const reveal = TEST_REVEAL_IMAGES[revealIdx % TEST_REVEAL_IMAGES.length];
  const arch = activePokemon ? ARCHITECTURE_COLORS[activePokemon.architecture] : ARCHITECTURE_COLORS.CNN;

  // Generate fake ROC-ish curve points from accuracy
  const rocPoints = useMemo(() => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 20; i++) {
      const fpr = i / 20;
      const tpr = Math.min(1, Math.pow(fpr, 0.4 + (100 - metrics.accuracy) / 180));
      pts.push([fpr, tpr]);
    }
    return pts;
  }, [metrics.accuracy]);

  return (
    <div style={{
      minHeight: '100%', padding: '18px 22px 40px',
      background: `radial-gradient(ellipse at top, ${FELT} 0%, #051a10 85%)`,
      fontFamily: FONT, color: '#e9f2ea',
    }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10, color: AMBER, letterSpacing: '0.3em', fontWeight: 800 }}>DISPATCH DEBRIEF</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#fff' }}>CASE CLOSED</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: '#8ba5a0', letterSpacing: '0.2em' }}>ROUND SCORE</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: AMBER }}>{lastRoundScore.toLocaleString()}</div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
        {/* Left: companion card + archetype */}
        <div style={{ background: PANEL, border: `2px solid ${PANEL_INNER}`, borderRadius: 14, padding: 14 }}>
          {activePokemon && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={getSpriteUrl(activePokemon.id)} style={{ width: 96, height: 96 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{activePokemon.name}</div>
                  <div style={{ fontSize: 11, color: arch.color, fontWeight: 700, letterSpacing: '0.15em' }}>{arch.label}</div>
                  <div style={{
                    display: 'inline-block', marginTop: 6, padding: '3px 10px', borderRadius: 6,
                    background: '#b879ff22', color: '#b879ff', border: '1px solid #b879ff55',
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.2em',
                  }}>ARCHETYPE · {metrics.archetype.toUpperCase()}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#b3cfb8', marginTop: 10, lineHeight: 1.4 }}>
                Companion returned from dispatch. +4 bond. -15 stamina. Feed at the Atelier to restore.
              </div>
            </>
          )}

          <div style={{ marginTop: 14, background: '#10221a', borderRadius: 10, padding: 10 }}>
            <div style={{ fontSize: 10, color: '#8ba5a0', letterSpacing: '0.2em', fontWeight: 700, marginBottom: 8 }}>REWARDS</div>
            <Reward icon="💰" label="Coins"    value={`+${Math.floor(lastRoundScore/8)}`} color="#f5c542" />
            <Reward icon="💎" label="Diamonds" value={`+${Math.floor(lastRoundScore/500)}`} color="#22d3ee" />
            <Reward icon="✨" label="Bond XP"  value="+4" color="#ff6dae" />
          </div>
        </div>

        {/* Right: metrics + ROC */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: PANEL, border: `2px solid ${PANEL_INNER}`, borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.22em', fontWeight: 800, color: '#fff', marginBottom: 10 }}>📊 FIELD METRICS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              <MetricBar label="PRECISION" value={metrics.precision} color="#22d3ee" />
              <MetricBar label="RECALL"    value={metrics.recall}    color="#ff6dae" />
              <MetricBar label="ACCURACY"  value={metrics.accuracy}  color="#5db44b" />
              <MetricBar label="F1"        value={metrics.f1}        color={AMBER} />
            </div>
            {/* ROC curve */}
            <div style={{ marginTop: 14, background: '#0a1a12', borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 10, color: '#8ba5a0', letterSpacing: '0.2em', fontWeight: 700, marginBottom: 6 }}>ROC CURVE</div>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: 120 }}>
                <line x1={0} y1={100} x2={100} y2={0} stroke="#2a4a3a" strokeWidth="0.5" strokeDasharray="2 3" />
                <polyline
                  points={rocPoints.map(([x,y]) => `${x*100},${100 - y*100}`).join(' ')}
                  fill="none" stroke={AMBER} strokeWidth="1.5" />
                <polyline
                  points={[[0,0], ...rocPoints, [1,0]].map(([x,y]) => `${x*100},${100 - y*100}`).join(' ')}
                  fill={`${AMBER}22`} stroke="none" />
                <text x={2} y={8} fill="#8ba5a0" fontSize="4">TPR</text>
                <text x={90} y={98} fill="#8ba5a0" fontSize="4">FPR</text>
              </svg>
            </div>
          </div>

          {/* Smash-bros battle arena replay */}
          {activePokemon && (
            <BattleArena
              player={activePokemon}
              ghost={{ id: 94, name: 'NeuroGhost_X', color: '#b879ff', acc: 72 }}
              won={metrics.accuracy >= 65}
              revealIdx={revealIdx}
            />
          )}

          {/* Reveal picker */}
          <div style={{ background: PANEL, border: `2px solid ${PANEL_INNER}`, borderRadius: 14, padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.22em', fontWeight: 800, color: '#8ba5a0' }}>ARENA CASE</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {TEST_REVEAL_IMAGES.map((_, i) => (
                <button key={i} onClick={() => setRevealIdx(i)} style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: revealIdx === i ? AMBER : '#10221a',
                  color: revealIdx === i ? '#1a0f05' : '#cfe4d1',
                  border: `1px solid ${revealIdx === i ? AMBER : PANEL_INNER}`,
                  fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: FONT,
                }}>{i+1}</button>
              ))}
            </div>
            <div style={{ flex: 1, fontSize: 10, color: '#8ba5a0', textAlign: 'right' }}>
              Replay a different case in the arena.
            </div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18 }}>
        <motion.button whileHover={{ y: -2 }} onClick={() => nav('/map')}
          style={CTA(AMBER, true)}>➜ CONTINUE EXPEDITION</motion.button>
        <motion.button whileHover={{ y: -2 }} onClick={() => nav('/')}
          style={CTA(PANEL_INNER, false)}>⌂ BACK TO ATELIER</motion.button>
        <motion.button whileHover={{ y: -2 }} onClick={() => nav('/leaderboard')}
          style={CTA(PANEL_INNER, false)}>🏆 RANKS</motion.button>
      </div>
    </div>
  );
}

function Reward({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
      <span style={{ fontSize: 12, color: '#cfe4d1' }}>{icon} {label}</span>
      <span style={{ fontSize: 14, fontWeight: 800, color }}>{value}</span>
    </div>
  );
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: '#10221a', borderRadius: 10, padding: 10 }}>
      <div style={{ fontSize: 9, color: '#8ba5a0', letterSpacing: '0.2em', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}<span style={{ fontSize: 12, color: '#8ba5a0' }}>%</span></div>
      <div style={{ height: 4, background: '#0a1a12', borderRadius: 2, marginTop: 4 }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8 }}
          style={{ height: '100%', background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

const CTA = (col: string, primary: boolean): React.CSSProperties => ({
  background: primary ? `linear-gradient(180deg, ${col} 0%, #c0721c 100%)` : 'transparent',
  color: primary ? '#1a0f05' : '#cfe4d1',
  border: primary ? 'none' : `2px solid ${col}`,
  padding: '12px 22px', borderRadius: 10, fontSize: 12, fontWeight: 900, letterSpacing: '0.2em',
  cursor: 'pointer', fontFamily: FONT,
  boxShadow: primary ? '0 4px 14px rgba(245,167,66,0.35)' : 'none',
});

export default Results;
