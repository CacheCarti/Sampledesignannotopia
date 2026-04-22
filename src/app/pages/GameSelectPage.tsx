import React from 'react';
import { useNavigate } from 'react-router';
import { useGame } from '../context/GameContext';
import { GAME_THEMES, BATTLE_IMAGES } from '../data/gameImages';
import { motion } from 'motion/react';

const ROUND_TYPE_CONFIG = {
  dojo:       { label: 'DOJO',       color: '#10B981', icon: '🥋' },
  standard:   { label: 'STANDARD',   color: '#22D3EE', icon: '⚔️' },
  expert:     { label: 'EXPERT',     color: '#F59E0B', icon: '💀' },
  tournament: { label: 'TOURNAMENT', color: '#A855F7', icon: '🏆' },
};

export function GameSelectPage() {
  const { roundType, selectedTheme, setSelectedTheme } = useGame();
  const navigate = useNavigate();
  const rtc = ROUND_TYPE_CONFIG[roundType];

  return (
    <div style={{
      minHeight: '100vh', background: '#060610', color: '#F9FAFB',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: 900, width: '100%' }}>
        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center', marginBottom: 36 }}>
          {/* Round type context badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${rtc.color}22`, border: `1px solid ${rtc.color}44`,
            borderRadius: 20, padding: '5px 14px', marginBottom: 14,
          }}>
            <span>{rtc.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 900, color: rtc.color, letterSpacing: '0.15em' }}>
              {rtc.label} MISSION
            </span>
          </div>
          <div style={{ fontSize: 8, fontWeight: 800, color: '#4B5563', letterSpacing: '0.25em', marginBottom: 8 }}>
            STEP 2 OF 3
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 900, letterSpacing: '0.08em', margin: '0 0 10px',
            background: 'linear-gradient(90deg, #A78BFA, #22D3EE)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            SELECT IMAGE SET
          </h1>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
            Choose the type of images you'll annotate. Each image has 3 questions per round.
          </p>
        </motion.div>

        {/* Theme grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 32 }}>
          {GAME_THEMES.map((theme, i) => {
            const isSelected = selectedTheme === theme.id;
            const previewImages = BATTLE_IMAGES.filter(img => theme.filter.includes(img.theme)).slice(0, 3);
            return (
              <motion.div
                key={theme.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.08 * i }}
                onClick={() => setSelectedTheme(theme.id)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: isSelected ? `${theme.color}15` : '#0D0D20',
                  border: `2px solid ${isSelected ? theme.color : '#1E1E48'}`,
                  borderRadius: 16, overflow: 'hidden',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: isSelected ? `0 0 28px ${theme.color}33` : 'none',
                }}
              >
                {/* Image strip */}
                <div style={{ display: 'flex', height: 90, overflow: 'hidden' }}>
                  {previewImages.length > 0 ? previewImages.map((img, j) => (
                    <div key={img.id} style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={img.url}
                        alt={img.label}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
                    </div>
                  )) : (
                    <div style={{
                      flex: 1, background: `${theme.color}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 40,
                    }}>
                      {theme.icon}
                    </div>
                  )}
                  {/* Color overlay + title */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 40,
                    background: `linear-gradient(to top, ${theme.color}88, transparent)`,
                  }} />
                </div>

                {/* Card body */}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 20 }}>{theme.icon}</span>
                    <div style={{
                      fontSize: 12, fontWeight: 900, color: isSelected ? theme.color : '#E5E7EB',
                      letterSpacing: '0.06em',
                    }}>
                      {theme.label}
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        style={{
                          marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%',
                          background: theme.color, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#000',
                        }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 10px', lineHeight: 1.5 }}>{theme.desc}</p>

                  {/* Sample questions preview */}
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {['🔵 Probe', '🟣 Sweep', '🟠 Probe'].map((q, qi) => (
                      <div key={qi} style={{
                        fontSize: 7, fontWeight: 800,
                        color: qi === 1 ? '#EC4899' : qi === 2 ? '#F59E0B' : '#22D3EE',
                        background: qi === 1 ? '#EC489911' : qi === 2 ? '#F59E0B11' : '#22D3EE11',
                        borderRadius: 5, padding: '2px 7px',
                      }}>
                        Q{qi + 1} · {q}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center' }}
        >
          <button
            onClick={() => navigate('/mission')}
            style={{
              background: 'transparent', color: '#6B7280', fontWeight: 700, fontSize: 13,
              padding: '12px 24px', borderRadius: 12, border: '1px solid #374151', cursor: 'pointer',
            }}
          >
            ← Back
          </button>
          <motion.button
            onClick={() => navigate('/loadout')}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{
              background: `linear-gradient(135deg, ${rtc.color}, ${rtc.color}CC)`,
              color: '#fff', fontWeight: 900, fontSize: 14,
              padding: '14px 40px', borderRadius: 12, border: 'none',
              cursor: 'pointer', letterSpacing: '0.1em',
              boxShadow: `0 0 24px ${rtc.color}66`,
            }}
          >
            BUILD FORMATION →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}