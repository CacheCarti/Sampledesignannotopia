import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { getSpriteUrl } from '../data/pokemon';

const PANEL = '#182426';
const PANEL_INNER = '#2e3a3d';
const AMBER = '#f5a742';
const FONT = "'Rajdhani', sans-serif";

export function Home() {
  const nav = useNavigate();
  const { playerName, inventory, lastRoundScore, coins, diamonds } = useGame();

  // hero trio — first three companions silhouetted in the welcome banner
  const hero = inventory.slice(0, 3);

  return (
    <div style={{
      minHeight: '100%',
      background: `
        radial-gradient(ellipse at 50% -10%, #1a4a2e 0%, transparent 60%),
        radial-gradient(ellipse at 15% 80%, #0f3d26 0%, transparent 50%),
        radial-gradient(ellipse at 85% 90%, #1a3a2e 0%, transparent 55%),
        #061a10`,
      fontFamily: FONT, color: '#e9f2ea',
      padding: '30px 40px 60px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* drifting fireflies */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.9, 0],
            x: [0, (i % 2 ? 30 : -30)],
            y: [0, -40],
          }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
          style={{
            position: 'absolute',
            left: `${(i * 53) % 100}%`,
            top: `${20 + (i * 37) % 70}%`,
            width: 4, height: 4, borderRadius: '50%',
            background: '#f5c542', boxShadow: '0 0 10px #f5c542',
            pointerEvents: 'none',
          }} />
      ))}

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.4em', fontWeight: 800, color: AMBER, marginBottom: 6,
        }}>
          WELCOME BACK, DETECTIVE {playerName.toUpperCase()}
        </div>
        <div style={{
          fontSize: 76, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em',
          textShadow: '0 6px 24px rgba(0,0,0,0.5)',
        }}>
          ANNOTOPIA
        </div>
        <div style={{
          fontSize: 14, color: '#b3cfb8', maxWidth: 620, marginTop: 12, lineHeight: 1.5,
        }}>
          A living world where your pocket‑sized models hatch, train, and hunt for the
          signal hidden in every scene. Feed them, wire their circuits, and deploy them
          against the ghosts haunting the datasets.
        </div>

        {/* hero sprites floating */}
        <div style={{
          position: 'absolute', top: -10, right: 0, display: 'flex', gap: 10,
          pointerEvents: 'none',
        }}>
          {hero.map((p, i) => (
            <motion.div key={p.id}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
              style={{
                width: 110, height: 110,
                filter: 'drop-shadow(0 8px 18px rgba(245,167,66,0.35))',
              }}>
              <img src={getSpriteUrl(p.id)} style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }} />
            </motion.div>
          ))}
        </div>

        {/* quick stats row */}
        <div style={{
          display: 'flex', gap: 10, marginTop: 22,
          background: `${PANEL}cc`, border: `2px solid ${PANEL_INNER}`, borderRadius: 14,
          padding: 14, backdropFilter: 'blur(6px)',
        }}>
          <Stat icon="🐾" label="COMPANIONS"  value={inventory.length} color="#5db44b" />
          <Divider />
          <Stat icon="💰" label="COINS"       value={coins.toLocaleString()} color="#f5c542" />
          <Divider />
          <Stat icon="💎" label="DIAMONDS"    value={diamonds} color="#22d3ee" />
          <Divider />
          <Stat icon="🏆" label="LAST SCORE"  value={lastRoundScore.toLocaleString()} color={AMBER} />
        </div>

        {/* primary CTAs */}
        <div style={{
          marginTop: 22, display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12,
        }}>
          <CTA
            primary icon="🗺️" title="ENTER THE FIELD"
            subtitle="Pick a case on the expedition map"
            onClick={() => nav('/map')}
          />
          <CTA
            icon="🕵️" title="THE AGENCY"
            subtitle="Manage your roster of field agents"
            onClick={() => nav('/agency')}
          />
          <CTA
            icon="🏪" title="UNDERGROUND MARKET"
            subtitle="Buy cards, relics & stamina treats"
            onClick={() => nav('/market')}
          />
          <CTA
            icon="🏆" title="LEADERBOARDS"
            subtitle="See where the best detectives rank"
            onClick={() => nav('/leaderboard')}
          />
        </div>

        {/* lore strip */}
        <div style={{
          marginTop: 26, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
        }}>
          <Lore
            step="01" title="HATCH & BOND"
            body="Every agent is an architecture — CNN, ViT, DINO — with its own temperament and taste for data."
          />
          <Lore
            step="02" title="WIRE THE CIRCUIT"
            body="Cards slot into organs: eyes, brain, hands. Fuses gate the next tier. Build the body that fits the case."
          />
          <Lore
            step="03" title="CLOSE THE CASE"
            body="Deploy to the field, dispatch predictions, and duel rival ghosts for precision and recall."
          />
        </div>
      </motion.div>
    </div>
  );
}

function Stat({ icon, label, value, color }: { icon: string; label: string; value: React.ReactNode; color: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${color}22`, border: `1px solid ${color}66`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 9, color: '#8ba5a0', letterSpacing: '0.2em', fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color }}>{value}</div>
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, background: PANEL_INNER }} />;
}

function CTA({ icon, title, subtitle, onClick, primary }: {
  icon: string; title: string; subtitle: string; onClick: () => void; primary?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        background: primary
          ? `linear-gradient(135deg, ${AMBER} 0%, #c0721c 100%)`
          : PANEL,
        color: primary ? '#1a0f05' : '#fff',
        border: primary ? 'none' : `2px solid ${PANEL_INNER}`,
        borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
        textAlign: 'left', fontFamily: FONT,
        boxShadow: primary ? '0 8px 20px rgba(245,167,66,0.35)' : '0 4px 10px rgba(0,0,0,0.25)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.15em' }}>{title}</div>
        <div style={{
          fontSize: 10, marginTop: 2, letterSpacing: '0.08em',
          color: primary ? '#3a1f08' : '#8ba5a0', fontWeight: 600,
        }}>{subtitle}</div>
      </div>
    </motion.button>
  );
}

function Lore({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div style={{
      background: `${PANEL}aa`, border: `1px solid ${PANEL_INNER}`, borderRadius: 10, padding: 12,
    }}>
      <div style={{ fontSize: 10, color: AMBER, letterSpacing: '0.25em', fontWeight: 800 }}>{step}</div>
      <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', marginTop: 2 }}>{title}</div>
      <div style={{ fontSize: 11, color: '#b3cfb8', marginTop: 4, lineHeight: 1.4 }}>{body}</div>
    </div>
  );
}

export default Home;
