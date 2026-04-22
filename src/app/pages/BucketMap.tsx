import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useGame } from '../context/GameContext';
import { generateBucketMap, MapNode, MAP_NODE_CONFIG } from '../data/cards';
import { motion } from 'motion/react';

const PANEL = '#182426';
const PANEL_INNER = '#2e3a3d';
const FELT = '#0f3d26';
const FONT = "'Rajdhani', sans-serif";

const ROW_H = 128;

export function BucketMap() {
  const { currentMapNodeId, setCurrentMapNodeId } = useGame();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  const nodes = useMemo(() => generateBucketMap(), []);
  const maxRow = Math.max(...nodes.map(n => n.y));

  const go = (node: MapNode) => {
    if (node.state === 'locked') return;
    setCurrentMapNodeId(node.id);
    switch (node.type) {
      case 'subset':
      case 'elite':
      case 'boss':
      case 'dojo':
        navigate('/loadout'); break;
      case 'market': navigate('/market'); break;
      case 'miner': navigate('/dispatch'); break;
      case 'benchmark': navigate('/leaderboard'); break;
    }
  };

  const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <div style={{
      minHeight: '100%', padding: '20px 24px 40px',
      background: `radial-gradient(ellipse at 50% 20%, ${FELT} 0%, #051a10 80%)`,
      fontFamily: FONT, color: '#e9f2ea', position: 'relative', overflow: 'hidden',
    }}>
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: '#f5a742', letterSpacing: '0.3em', fontWeight: 800 }}>EXPEDITION · SEASON 1</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '0.02em' }}>THE KITCHEN TRAIL</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['dojo','subset','elite','market','miner','benchmark','boss'] as const).map(t => {
            const c = MAP_NODE_CONFIG[t];
            return (
              <div key={t} title={c.blurb} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: PANEL, border: `1px solid ${c.color}44`, borderRadius: 6,
                padding: '4px 8px', fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', color: c.color,
              }}>
                <span>{c.icon}</span>{c.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* map canvas */}
      <div style={{
        position: 'relative', background: PANEL, border: `2px solid ${PANEL_INNER}`,
        borderRadius: 16, padding: 24, height: (maxRow + 1) * ROW_H + 40,
        overflow: 'hidden',
      }}>
        {/* decorative fog */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at top, rgba(245,167,66,0.06) 0%, transparent 60%)' }} />

        {/* edges */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {nodes.map(n => n.connections.map(cid => {
            const to = nodeById[cid]; if (!to) return null;
            const live = n.state === 'completed' || to.state !== 'locked';
            const x1 = `${n.x}%`; const y1 = (n.y + 0.5) * ROW_H - 20;
            const x2 = `${to.x}%`; const y2 = (to.y + 0.5) * ROW_H - 20;
            return (
              <line key={`${n.id}-${cid}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={live ? '#5db44b' : '#2a4a3a'}
                strokeWidth={live ? 2 : 1.5}
                strokeDasharray={live ? 'none' : '4 6'}
                opacity={live ? 0.7 : 0.35}
              />
            );
          }))}
        </svg>

        {/* nodes */}
        {nodes.map(n => {
          const conf = MAP_NODE_CONFIG[n.type];
          const isCurrent = n.id === currentMapNodeId;
          const clickable = n.state !== 'locked';
          return (
            <motion.div key={n.id}
              whileHover={clickable ? { scale: 1.08 } : {}}
              onClick={() => go(n)}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'absolute',
                left: `calc(${n.x}% - 36px)`,
                top:  (n.y + 0.5) * ROW_H - 56,
                width: 72, height: 72, borderRadius: 16,
                background: n.state === 'completed' ? '#10221a' : clickable ? `${conf.color}22` : '#0a1a12',
                border: `2px solid ${clickable ? conf.color : '#2a4a3a'}`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 2,
                cursor: clickable ? 'pointer' : 'not-allowed',
                opacity: n.state === 'locked' ? 0.45 : 1,
                boxShadow: isCurrent ? `0 0 22px ${conf.color}cc, 0 0 4px ${conf.color}`
                  : `0 3px 10px rgba(0,0,0,0.45)`,
                transition: 'box-shadow 0.2s',
              }}>
              <div style={{ fontSize: 26 }}>{conf.icon}</div>
              <div style={{ fontSize: 8, fontWeight: 800, color: conf.color, letterSpacing: '0.14em' }}>
                {conf.label}
              </div>
              {n.state === 'completed' && (
                <div style={{ position: 'absolute', top: -6, right: -6, background: '#5db44b',
                  width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 11 }}>✓</div>
              )}
              {/* tooltip */}
              {hovered === n.id && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: 'absolute', top: 78, left: '50%', transform: 'translateX(-50%)',
                    background: '#0a1a12', border: `1.5px solid ${conf.color}`, borderRadius: 10,
                    padding: '8px 12px', width: 200, zIndex: 20, pointerEvents: 'none',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.6)',
                  }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{n.label}</div>
                  <div style={{ fontSize: 10, color: conf.color, letterSpacing: '0.15em', fontWeight: 700 }}>
                    {conf.label} {n.difficulty && `· ${n.difficulty.toUpperCase()}`}
                  </div>
                  <div style={{ fontSize: 10, color: '#b3cfb8', marginTop: 4, lineHeight: 1.35 }}>
                    {conf.blurb}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8ba5a0' }}>
        <span>🌿 Advance through subsets · build bond · evolve at the Brain apex</span>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#f5a742', fontWeight: 700 }}>← BACK TO ATELIER</span>
      </div>
    </div>
  );
}

export default BucketMap;
