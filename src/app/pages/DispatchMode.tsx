import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

const FEATURES = [
  { icon: '🔍', title: 'Evidence Board', desc: 'Pin annotations, build chains of visual evidence. "Why was this labeled X?"', status: 'planned' },
  { icon: '🕵️', title: 'Scene Framing', desc: 'Frame scenes as cases. Each image is a crime scene to investigate.', status: 'planned' },
  { icon: '🤖', title: 'Companion AI', desc: 'Single AI assistant analyzes your work. Learns your style over time.', status: 'planned' },
  { icon: '📋', title: 'Question Mining', desc: 'Author new questions, mark evidence, dispatch companions to find similar scenes.', status: 'future' },
  { icon: '🏢', title: 'Agency Progression', desc: 'Build your detective agency. Unlock scouting, passive income, reputation.', status: 'future' },
  { icon: '📈', title: 'Mentorship System', desc: 'Evolve companion skills. Manager-level progression, not pet-sim.', status: 'future' },
];

export function DispatchMode() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #030308, #0A0A1A)',
      color: '#F9FAFB',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: 740, width: '100%' }}>
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🕵️</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#22D3EE22', border: '1px solid #22D3EE44',
            borderRadius: 20, padding: '6px 18px', marginBottom: 16,
          }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#22D3EE', letterSpacing: '0.2em' }}>
              IN DEVELOPMENT
            </span>
          </div>
          <h1 style={{
            fontSize: 32, fontWeight: 900, letterSpacing: '0.08em', margin: '0 0 12px',
            background: 'linear-gradient(135deg, #22D3EE, #A78BFA)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            DISPATCH MODE
          </h1>
          <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.8, maxWidth: 520, margin: '0 auto' }}>
            The <span style={{ color: '#22D3EE', fontWeight: 800 }}>Detective Agency</span> meta-layer.
            Investigate scenes, build evidence chains, dispatch companions on scouting operations.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 36 }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              style={{
                background: '#0A0A1A', border: '1px solid #22D3EE22',
                borderRadius: 12, padding: '18px 16px',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {f.status === 'future' && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  background: '#374151', borderRadius: 4, padding: '1px 6px',
                  fontSize: 7, fontWeight: 800, color: '#6B7280', letterSpacing: '0.08em',
                }}>
                  FUTURE
                </div>
              )}
              <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#22D3EE', letterSpacing: '0.08em', marginBottom: 6 }}>
                {f.title}
              </div>
              <p style={{ fontSize: 11, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <motion.button
            onClick={() => navigate('/mission')}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{
              background: 'linear-gradient(135deg, #22D3EE, #0891B2)',
              color: '#000', fontWeight: 900, fontSize: 13,
              padding: '12px 28px', borderRadius: 10, border: 'none',
              cursor: 'pointer', letterSpacing: '0.1em',
              boxShadow: '0 0 20px #22D3EE44',
            }}
          >
            🎯 PLAY MISSIONS
          </motion.button>
          <button onClick={() => navigate('/')} style={{
            background: 'transparent', color: '#6B7280', fontWeight: 700, fontSize: 13,
            padding: '12px 24px', borderRadius: 10, border: '1px solid #374151', cursor: 'pointer',
          }}>
            ← Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
