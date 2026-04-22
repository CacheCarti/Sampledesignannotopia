import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useGame } from '../context/GameContext';
import { motion } from 'motion/react';

const NAV_ITEMS = [
  { path: '/',           label: 'HOME',      icon: '🏡' },
  { path: '/map',        label: 'MAP',       icon: '🗺️' },
  { path: '/agency',     label: 'AGENCY',    icon: '🕵️' },
  { path: '/dispatch',   label: 'DISPATCH',  icon: '📡' },
  { path: '/market',     label: 'MARKET',    icon: '🏪' },
  { path: '/leaderboard',label: 'RANKS',     icon: '🏆' },
];

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const { playerName, coins, diamonds } = useGame();

  return (
    <div style={{
      minHeight: '100vh', background: '#061a10',
      fontFamily: "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top Navbar */}
      <header style={{
        background: '#182426',
        borderBottom: '2px solid #2e3a3d',
        padding: '0 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 56, position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #f5a742 0%, #c0721c 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 2px 8px rgba(245,167,66,0.5)',
          }}>
            🌿
          </div>
          <span style={{
            fontSize: 18, fontWeight: 800, letterSpacing: '0.12em', color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}>
            ANNOTOPIA
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  background: active ? '#394e52' : 'transparent',
                  border: 'none',
                  color: active ? '#fff' : '#6B8B73',
                  padding: '6px 12px', borderRadius: 8,
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                  boxShadow: active ? '0 2px 4px rgba(0,0,0,0.25)' : 'none',
                  textShadow: active ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Player info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Coins - Balatro $ style */}
          <div style={{
            background: '#2e3a3d', borderRadius: 10,
            padding: '4px 12px',
            display: 'flex', alignItems: 'center', gap: 5,
            boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fa8c01', textShadow: '0 2px 4px rgba(0,0,0,0.25)' }}>
              ${coins.toLocaleString()}
            </span>
          </div>

          <div style={{
            background: '#2e3a3d', borderRadius: 10,
            padding: '4px 12px',
            display: 'flex', alignItems: 'center', gap: 5,
            boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#22d3ee', textShadow: '0 2px 4px rgba(0,0,0,0.25)' }}>
              💎{diamonds}
            </span>
          </div>

          {/* Detective badge */}
          <div style={{
            background: '#2e3a3d', borderRadius: 10,
            padding: '4px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
          }}>
            <span style={{ fontSize: 11 }}>🕵️</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
              {playerName}
            </span>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>

      {/* Bottom mobile nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        background: '#182426', borderTop: '2px solid #2e3a3d',
        padding: '8px 0', position: 'sticky', bottom: 0,
      }}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                background: 'none', border: 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                color: active ? '#fff' : '#4B5563',
                cursor: 'pointer', padding: '4px 12px',
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.08em' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}