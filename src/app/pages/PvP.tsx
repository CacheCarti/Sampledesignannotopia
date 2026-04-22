import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

const MODES = [
  {
    icon: '⚔️', label: '1v1 DUEL', color: '#EF4444',
    desc: 'Face one opponent on the same image. Most annotations wins.',
    status: 'COMING SOON',
  },
  {
    icon: '👥', label: '2v2 TEAMS', color: '#3B82F6',
    desc: 'Two-player teams race to annotate and outscore rivals.',
    status: 'COMING SOON',
  },
  {
    icon: '🌪️', label: 'BATTLE ROYALE', color: '#A855F7',
    desc: '8 players, one image set. Last drone standing wins.',
    status: 'COMING SOON',
  },
  {
    icon: '🏆', label: 'RANKED ARENA', color: '#F59E0B',
    desc: 'Climb the ranked ladder. ELO-rated, season rewards.',
    status: 'COMING SOON',
  },
];

const FEATURES = [
  { icon: '⚡', title: 'Real-Time', desc: 'Live opponent tracking — see their probe markers appear in real time.' },
  { icon: '🧠', title: 'Ensemble Clash', desc: 'Your AI drone formation faces theirs. Best ensemble wins the data round.' },
  { icon: '💬', title: 'Trash Talk', desc: 'In-game emote system. Taunt. React. Celebrate.' },
  { icon: '🏅', title: 'PvP Exclusive Skins', desc: 'Unlock rare card skins and drone cosmetics only from PvP wins.' },
];

export function PvP() {
  const navigate = useNavigate();
  const [hoveredMode, setHoveredMode] = useState<number | null>(null);

  return (
    <div style={{
      minHeight: '100vh', background: '#060610', color: '#F9FAFB',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: 780, width: '100%' }}>
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ textAlign: 'center', marginBottom: 36 }}
        >
          <div style={{ fontSize: 64, marginBottom: 12 }}>⚔️</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#EF444422', border: '1px solid #EF444444',
            borderRadius: 20, padding: '6px 18px', marginBottom: 16,
          }}>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ fontSize: 10, fontWeight: 900, color: '#EF4444', letterSpacing: '0.2em' }}
            >
              COMING SOON
            </motion.span>
          </div>
          <h1 style={{
            fontSize: 36, fontWeight: 900, letterSpacing: '0.08em', margin: '0 0 12px',
            background: 'linear-gradient(135deg, #EF4444, #F87171)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            PvP — PLAYER vs PLAYER
          </h1>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, maxWidth: 520, margin: '0 auto' }}>
            Challenge real annotators in <span style={{ color: '#EF4444', fontWeight: 800 }}>live adversarial rounds</span>. 
            Deploy your AI formation, race against opponents on shared images, 
            and let the best ensemble win.
          </p>
        </motion.div>

        {/* Game modes grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 28 }}>
          {MODES.map((mode, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              onMouseEnter={() => setHoveredMode(i)}
              onMouseLeave={() => setHoveredMode(null)}
              style={{
                background: hoveredMode === i ? `${mode.color}15` : '#0D0D20',
                border: `1px solid ${hoveredMode === i ? mode.color + '55' : mode.color + '22'}`,
                borderRadius: 14, padding: '20px 16px', textAlign: 'center',
                cursor: 'default', transition: 'all 0.2s',
                boxShadow: hoveredMode === i ? `0 0 20px ${mode.color}22` : 'none',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{mode.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 900, color: mode.color, letterSpacing: '0.1em', marginBottom: 6 }}>
                {mode.label}
              </div>
              <p style={{ fontSize: 10, color: '#6B7280', margin: '0 0 10px', lineHeight: 1.5 }}>{mode.desc}</p>
              <div style={{
                background: mode.color + '22', border: `1px solid ${mode.color}33`,
                borderRadius: 6, padding: '3px 10px',
                fontSize: 8, fontWeight: 900, color: mode.color, letterSpacing: '0.12em',
              }}>
                {mode.status}
              </div>
            </motion.div>
          ))}
        </div>

        {/* PvP features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 28 }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              style={{
                background: '#0D0D20', border: '1px solid #EF444411',
                borderRadius: 10, padding: '14px',
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#E5E7EB', marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 10, color: '#4B5563', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Matchmaking UI preview (fake) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            background: 'linear-gradient(135deg, #1A000D, #0D0D20)',
            border: '1px solid #EF444433',
            borderRadius: 16, padding: '24px 28px', textAlign: 'center', marginBottom: 28,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: '#EF4444', letterSpacing: '0.15em', marginBottom: 16 }}>
            🔒 MATCHMAKING — LOCKED
          </div>

          {/* Fake matchmaking UI */}
          <div style={{
            background: '#111827', borderRadius: 10, padding: '14px',
            border: '1px solid #374151', marginBottom: 16, opacity: 0.5,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24 }}>🧠</div>
                <div style={{ fontSize: 9, color: '#A78BFA', fontWeight: 800 }}>YOU</div>
                <div style={{ fontSize: 8, color: '#4B5563' }}>???</div>
              </div>
              <div>
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ fontSize: 18, color: '#EF4444', fontWeight: 900 }}
                >
                  VS
                </motion.div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24 }}>❓</div>
                <div style={{ fontSize: 9, color: '#6B7280', fontWeight: 800 }}>OPPONENT</div>
                <div style={{ fontSize: 8, color: '#4B5563' }}>Searching...</div>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 20px', lineHeight: 1.7 }}>
            PvP launches in a future update. Grind missions to build your formation and be ready.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              onClick={() => navigate('/battle')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'linear-gradient(135deg, #EF4444, #B91C1C)',
                color: '#fff', fontWeight: 900, fontSize: 13,
                padding: '12px 28px', borderRadius: 10, border: 'none',
                cursor: 'pointer', letterSpacing: '0.1em',
                boxShadow: '0 0 20px #EF444466',
              }}
            >
              🎯 PRACTICE SOLO
            </motion.button>
            <motion.button
              onClick={() => navigate('/loadout')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'transparent', color: '#A78BFA', fontWeight: 800, fontSize: 13,
                padding: '12px 22px', borderRadius: 10,
                border: '2px solid #A78BFA66', cursor: 'pointer', letterSpacing: '0.1em',
              }}
            >
              🧬 BUILD FORMATION
            </motion.button>
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'transparent', color: '#6B7280', fontWeight: 700, fontSize: 13,
                padding: '12px 22px', borderRadius: 10,
                border: '1px solid #374151', cursor: 'pointer',
              }}
            >
              ← Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
