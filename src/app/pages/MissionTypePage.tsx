import React from 'react';
import { useNavigate } from 'react-router';
import { useGame, RoundType } from '../context/GameContext';
import { motion } from 'motion/react';

const MISSION_TYPES: {
  type: RoundType; icon: string; label: string; color: string;
  desc: string; rules: string; reward: string; xp: string;
}[] = [
  {
    type: 'dojo', icon: '🥋', label: 'DOJO', color: '#10B981',
    desc: 'Free practice mode. Perfect for warming up tools and testing new formations.',
    rules: 'No squad restrictions · Any image set',
    reward: '1× Coins', xp: 'Low XP',
  },
  {
    type: 'standard', icon: '⚔️', label: 'STANDARD', color: '#22D3EE',
    desc: 'Main competitive rounds. Build your ranking and earn steady rewards.',
    rules: 'Min 1 drone per question · Min 1 Regression arch',
    reward: '2× Coins', xp: 'Standard XP',
  },
  {
    type: 'expert', icon: '💀', label: 'EXPERT', color: '#F59E0B',
    desc: 'Harder images, time pressure, higher rewards. For seasoned detectives.',
    rules: 'Full squads required · Min 1 Transformer',
    reward: '4× Coins', xp: 'High XP',
  },
  {
    type: 'tournament', icon: '🏆', label: 'TOURNAMENT', color: '#A855F7',
    desc: 'Extended events with maximum stakes. Legendary tier rewards await.',
    rules: 'Full squads · Min 1 CNN + 1 Transformer',
    reward: '8× Coins', xp: 'Legendary XP',
  },
];

export function MissionTypePage() {
  const { roundType, setRoundType } = useGame();
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', background: '#060610', color: '#F9FAFB',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: 820, width: '100%' }}>
        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 8, fontWeight: 800, color: '#4B5563', letterSpacing: '0.25em', marginBottom: 10 }}>
            STEP 1 OF 3
          </div>
          <h1 style={{
            fontSize: 30, fontWeight: 900, letterSpacing: '0.08em', margin: '0 0 10px',
            background: 'linear-gradient(90deg, #A78BFA, #22D3EE)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            SELECT MISSION TYPE
          </h1>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
            Choose your difficulty. This determines squad restrictions and reward multipliers.
          </p>
        </motion.div>

        {/* Mission type cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 14, marginBottom: 32 }}>
          {MISSION_TYPES.map((m, i) => {
            const isSelected = roundType === m.type;
            return (
              <motion.button
                key={m.type}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.07 * i }}
                onClick={() => setRoundType(m.type)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: isSelected ? `${m.color}18` : '#0D0D20',
                  border: `2px solid ${isSelected ? m.color : '#1E1E48'}`,
                  borderRadius: 16, padding: '20px 22px',
                  cursor: 'pointer', textAlign: 'left',
                  boxShadow: isSelected ? `0 0 28px ${m.color}33` : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                    background: `${m.color}22`, border: `1px solid ${m.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26,
                  }}>
                    {m.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 14, fontWeight: 900, color: isSelected ? m.color : '#E5E7EB',
                        letterSpacing: '0.1em',
                      }}>
                        {m.label}
                      </span>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          style={{
                            fontSize: 10, background: m.color, color: '#000',
                            borderRadius: 20, padding: '1px 8px', fontWeight: 900,
                          }}
                        >
                          SELECTED
                        </motion.span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 10px', lineHeight: 1.6 }}>{m.desc}</p>
                    <div style={{ fontSize: 9, color: '#4B5563', fontWeight: 700, marginBottom: 6 }}>{m.rules}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 800, color: m.color,
                        background: `${m.color}18`, borderRadius: 6, padding: '2px 8px',
                      }}>
                        {m.reward}
                      </span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, color: '#6B7280',
                        background: '#1F2937', borderRadius: 6, padding: '2px 8px',
                      }}>
                        {m.xp}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center' }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent', color: '#6B7280', fontWeight: 700, fontSize: 13,
              padding: '12px 24px', borderRadius: 12, border: '1px solid #374151', cursor: 'pointer',
            }}
          >
            ← Back
          </button>
          <motion.button
            onClick={() => navigate('/games')}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{
              background: `linear-gradient(135deg, ${MISSION_TYPES.find(m => m.type === roundType)!.color}, ${MISSION_TYPES.find(m => m.type === roundType)!.color}CC)`,
              color: '#fff', fontWeight: 900, fontSize: 14,
              padding: '14px 40px', borderRadius: 12, border: 'none',
              cursor: 'pointer', letterSpacing: '0.1em',
              boxShadow: `0 0 24px ${MISSION_TYPES.find(m => m.type === roundType)!.color}66`,
            }}
          >
            SELECT GAME SET →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
