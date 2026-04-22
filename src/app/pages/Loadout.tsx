import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useGame } from '../context/GameContext';
import { Pokemon, getSpriteUrl, overallRating, ARCHITECTURE_COLORS } from '../data/pokemon';
import { BATTLE_IMAGES } from '../data/gameImages';
import { motion } from 'motion/react';

const PANEL = '#182426';
const PANEL_INNER = '#2e3a3d';
const FELT = '#0f3d26';
const AMBER = '#f5a742';
const FONT = "'Rajdhani', sans-serif";

const MOOD_EMOJI: Record<string, string> = { content:'😊', hyped:'🤩', tired:'😴', dazed:'😵', confused:'🥴' };

export function Loadout() {
  const nav = useNavigate();
  const { inventory, companions, activePokemon, setActivePokemon, initCardCombat, selectedTheme } = useGame();
  const [hover, setHover] = useState<number | null>(null);

  const theme = selectedTheme;
  const preview = BATTLE_IMAGES[0];

  const confirm = () => {
    if (!activePokemon) return;
    initCardCombat(activePokemon);
    nav('/battle');
  };

  return (
    <div style={{
      minHeight: '100%', padding: '20px 24px 40px',
      background: `radial-gradient(ellipse at top, ${FELT} 0%, #051a10 80%)`,
      fontFamily: FONT, color: '#e9f2ea',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10, color: AMBER, letterSpacing: '0.3em', fontWeight: 800 }}>
            LOADOUT · PICK ONE COMPANION FOR THIS CASE
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}>ASSEMBLE THE SQUAD</div>
        </div>
        <button onClick={() => nav('/map')} style={{
          background: 'transparent', border: `2px solid ${PANEL_INNER}`, color: '#cfe4d1',
          padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 800, letterSpacing: '0.18em',
          cursor: 'pointer', fontFamily: FONT,
        }}>← MAP</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Roster */}
        <div style={{
          background: PANEL, border: `2px solid ${PANEL_INNER}`, borderRadius: 14, padding: 14,
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.2em', color: '#fff', marginBottom: 10 }}>
            🐾 YOUR COMPANIONS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: 10 }}>
            {inventory.map(p => {
              const active = activePokemon?.id === p.id;
              const c = companions[p.id];
              const arch = ARCHITECTURE_COLORS[p.architecture];
              const ovr = overallRating(p.stats);
              return (
                <motion.div key={p.id}
                  whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setActivePokemon(p)}
                  onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)}
                  style={{
                    background: '#10221a',
                    border: `2px solid ${active ? AMBER : arch.color + '55'}`,
                    boxShadow: active ? `0 0 18px ${AMBER}77` : 'none',
                    borderRadius: 12, padding: 10, cursor: 'pointer', position: 'relative',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: arch.color, letterSpacing: '0.14em' }}>{arch.label}</div>
                    <div style={{ fontSize: 13 }}>{MOOD_EMOJI[c?.morale ?? 'content']}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={getSpriteUrl(p.id)} style={{ width: 86, height: 86, objectFit: 'contain' }} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', textAlign: 'center' }}>{p.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: '#8ba5a0', fontWeight: 700 }}>
                    <span>OVR <span style={{ color:'#fff' }}>{ovr}</span></span>
                    <span>STAM <span style={{ color:'#5db44b' }}>{c?.stamina ?? 100}</span></span>
                    <span>BOND <span style={{ color:'#ff6dae' }}>{c?.bond ?? 0}</span></span>
                  </div>
                  {active && (
                    <div style={{
                      position: 'absolute', top: -10, left: 8, background: AMBER, color: '#1a0f05',
                      fontSize: 9, fontWeight: 900, letterSpacing: '0.15em',
                      padding: '2px 8px', borderRadius: 4,
                    }}>ACTIVE</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Active pokémon detail + scenario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            background: PANEL, border: `2px solid ${PANEL_INNER}`, borderRadius: 14, padding: 14,
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.22em', fontWeight: 800, color: AMBER, marginBottom: 8 }}>SELECTED · ACTIVE POKÉMON</div>
            {activePokemon ? (
              <>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img src={getSpriteUrl(activePokemon.id)} style={{ width: 96, height: 96, objectFit: 'contain' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{activePokemon.name}</div>
                    <div style={{ fontSize: 11, color: ARCHITECTURE_COLORS[activePokemon.architecture].color, fontWeight: 700, letterSpacing: '0.15em' }}>
                      {ARCHITECTURE_COLORS[activePokemon.architecture].label} · {activePokemon.rarity.toUpperCase()}
                    </div>
                    <div style={{ fontSize: 11, color: '#b3cfb8', marginTop: 4, lineHeight: 1.3 }}>
                      {activePokemon.description}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 10 }}>
                  {(['pace','verbal','spatial','accuracy'] as const).map(k => (
                    <div key={k} style={{ background: '#10221a', borderRadius: 8, padding: '6px 8px' }}>
                      <div style={{ fontSize: 8, color: '#8ba5a0', letterSpacing: '0.15em', fontWeight: 700 }}>{k.toUpperCase()}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{activePokemon.stats[k]}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ color: '#8ba5a0', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>
                Pick a companion on the left. One Pokémon handles Q1 · Q2 · Q3 this round.
              </div>
            )}
          </div>

          <div style={{
            background: PANEL, border: `2px solid ${PANEL_INNER}`, borderRadius: 14, padding: 14,
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.22em', fontWeight: 800, color: AMBER, marginBottom: 8 }}>CASE PREVIEW</div>
            <img src={preview.url} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginTop: 6 }}>{preview.label}</div>
            <div style={{ fontSize: 11, color: '#b3cfb8', marginTop: 2, lineHeight: 1.35 }}>{preview.mission}</div>
          </div>

          <motion.button
            disabled={!activePokemon}
            whileHover={activePokemon ? { scale: 1.03 } : {}}
            onClick={confirm}
            style={{
              background: activePokemon ? `linear-gradient(180deg, ${AMBER} 0%, #c0721c 100%)` : '#2a3a33',
              color: activePokemon ? '#1a0f05' : '#6b8078',
              border: 'none', padding: '14px 0', borderRadius: 10,
              fontSize: 14, fontWeight: 900, letterSpacing: '0.2em',
              cursor: activePokemon ? 'pointer' : 'not-allowed',
              fontFamily: FONT,
              boxShadow: activePokemon ? '0 4px 14px rgba(245,167,66,0.35)' : 'none',
            }}>
            ▶ ENTER THE ARENA
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default Loadout;
