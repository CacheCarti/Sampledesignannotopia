import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ALL_POKEMON, overallRating, typeColors } from '../data/pokemon';
import { motion } from 'motion/react';

const TIER_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: '#B45309', text: '#FDE68A', label: '🏆 CHAMPION' },
  2: { bg: '#6B7280', text: '#E5E7EB', label: '🥈 GRANDMASTER' },
  3: { bg: '#92400E', text: '#FCD34D', label: '🥉 MASTER' },
};

function getRankDisplay(rank: number) {
  if (rank === 1) return { text: '🥇', color: '#F59E0B' };
  if (rank === 2) return { text: '🥈', color: '#9CA3AF' };
  if (rank === 3) return { text: '🥉', color: '#92400E' };
  return { text: `#${rank}`, color: '#4B5563' };
}

function TrendIcon({ change }: { change: number }) {
  if (change > 0) return <span style={{ color: '#10B981', fontSize: 10 }}>▲{change}</span>;
  if (change < 0) return <span style={{ color: '#EF4444', fontSize: 10 }}>▼{Math.abs(change)}</span>;
  return <span style={{ color: '#6B7280', fontSize: 10 }}>—</span>;
}

const MOCK_TRENDS = [3, -1, 2, 0, 1, -2, 0, 3, -1, 2, 0, -1, 1, 0, 2];

export function LeaderboardPage() {
  const { leaderboard, playerName, teamEnsembles, totalScore } = useGame();
  const [viewMode, setViewMode] = useState<'full' | 'compact'>('full');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const playerEntry = leaderboard.find(e => e.isPlayer);
  const playerRank = playerEntry?.rank || 'N/A';

  const topThree = leaderboard.slice(0, 3);
  const restList = leaderboard.slice(3);

  return (
    <div style={{
      minHeight: '100vh', background: '#060610', color: '#F9FAFB',
      padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 860 }}>
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ textAlign: 'center', marginBottom: 32 }}
        >
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
          <h1 style={{
            fontSize: 32, fontWeight: 900, letterSpacing: '0.1em', margin: 0,
            background: 'linear-gradient(90deg, #A78BFA, #22D3EE)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            NEURAL ARENA RANKINGS
          </h1>
          <p style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>
            Global detective rankings — Annotate, train, and climb to the top!
          </p>
        </motion.div>

        {/* Player quick stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #0D1F3C 100%)',
            border: '1px solid #4F46E544',
            borderRadius: 16, padding: '20px 24px',
            marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>
              🕵️
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#F9FAFB' }}>{playerName}</div>
              <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>YOUR RANK</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#F59E0B' }}>
                {typeof playerRank === 'number' ? `#${playerRank}` : 'UNRANKED'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: 'TOTAL SCORE', value: totalScore.toLocaleString(), color: '#F59E0B' },
              { label: 'TEAM POWER', value: teamEnsembles.flat().reduce((s, p) => s + overallRating(p.stats), 0) || '—', color: '#22D3EE' },
              { label: 'SQUAD', value: `${teamEnsembles.filter(e => e.length > 0).length}/3 Qs`, color: '#A855F7' },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 8, color: '#4B5563', fontWeight: 800, letterSpacing: '0.1em' }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Team preview */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {teamEnsembles.map((ensemble, qi) => (
              <div key={qi} style={{
                width: 44, height: 44, borderRadius: '50%',
                background: ensemble.length > 0 ? 'linear-gradient(135deg, #1E1B4B, #111827)' : '#1F2937',
                border: ensemble.length > 0 ? `2px solid ${['#22D3EE', '#F59E0B', '#EC4899'][qi]}` : '2px dashed #374151',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {ensemble.length > 0 ? (
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${ensemble[0].id}.png`}
                    alt={ensemble[0].name}
                    style={{ width: 36, height: 36, objectFit: 'contain' }}
                  />
                ) : (
                  <span style={{ fontSize: 10, color: '#374151' }}>?</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top 3 podium */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: 20 }}
        >
          <div style={{
            fontSize: 11, fontWeight: 800, color: '#6B7280', letterSpacing: '0.12em',
            marginBottom: 14, textAlign: 'center',
          }}>
            🏆 TOP TRAINERS
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {[topThree[1], topThree[0], topThree[2]].map((entry, podiumIdx) => {
              if (!entry) return null;
              const actualRank = entry.rank;
              const podiumHeight = actualRank === 1 ? 110 : actualRank === 2 ? 85 : 70;
              const rd = getRankDisplay(actualRank);
              const isPlayer = entry.isPlayer;
              const entryPokemons = ALL_POKEMON.filter(p => entry.pokemon.includes(p.id)).slice(0, 3);

              return (
                <motion.div
                  key={entry.name}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * podiumIdx }}
                  style={{
                    flex: '1 1 200px', maxWidth: 250,
                    background: isPlayer
                      ? 'linear-gradient(135deg, #1E1B4B, #0D1F3C)'
                      : '#0D0D20',
                    border: isPlayer ? '2px solid #F59E0B66' : '1px solid #1E1E48',
                    borderRadius: 14, padding: '16px 14px',
                    boxShadow: actualRank === 1
                      ? '0 0 24px #F59E0B33'
                      : isPlayer ? '0 0 16px #F59E0B22' : 'none',
                    position: 'relative', textAlign: 'center',
                    order: actualRank === 1 ? 0 : actualRank === 2 ? -1 : 1,
                  }}
                >
                  {isPlayer && (
                    <div style={{
                      position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                      background: '#F59E0B', borderRadius: 10, padding: '2px 10px',
                      fontSize: 8, fontWeight: 900, color: '#000', letterSpacing: '0.1em',
                    }}>
                      YOU
                    </div>
                  )}
                  <div style={{ fontSize: 32, marginBottom: 4 }}>{rd.text}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#F9FAFB', marginBottom: 4 }}>
                    {entry.name}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#F59E0B', textShadow: '0 0 12px #F59E0B88' }}>
                    {entry.score.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 9, color: '#6B7280', marginTop: 2 }}>
                    {entry.wins} wins
                  </div>

                  {/* Pokemon team */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
                    {entryPokemons.map(p => (
                      <img
                        key={p.id}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                        alt={p.name}
                        style={{ width: 28, height: 28, objectFit: 'contain' }}
                        title={p.name}
                      />
                    ))}
                  </div>

                  {/* Podium base */}
                  <div style={{
                    height: 8, marginTop: 12,
                    background: actualRank === 1 ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                      : actualRank === 2 ? 'linear-gradient(90deg, #9CA3AF, #6B7280)'
                      : 'linear-gradient(90deg, #92400E, #78350F)',
                    borderRadius: 4,
                    boxShadow: actualRank === 1 ? '0 0 8px #F59E0B88' : 'none',
                  }} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
          {(['full', 'compact'] as const).map(m => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              style={{
                background: viewMode === m ? '#1F2937' : 'transparent',
                border: '1px solid #374151',
                color: viewMode === m ? '#F9FAFB' : '#6B7280',
                padding: '5px 14px', borderRadius: 6,
                fontSize: 9, fontWeight: 800, cursor: 'pointer', letterSpacing: '0.1em',
              }}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Rest of leaderboard */}
        <div style={{
          background: '#0D0D20', border: '1px solid #1E1E48',
          borderRadius: 14, overflow: 'hidden',
        }}>
          {/* Header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewMode === 'full'
              ? '48px 1fr 100px 80px 80px 80px'
              : '48px 1fr 120px 80px',
            gap: 8, padding: '10px 16px',
            background: '#111827', borderBottom: '1px solid #1E1E48',
            fontSize: 9, fontWeight: 800, color: '#4B5563', letterSpacing: '0.1em',
          }}>
            <span>RANK</span>
            <span>TRAINER</span>
            <span style={{ textAlign: 'right' }}>SCORE</span>
            <span style={{ textAlign: 'right' }}>ROUND</span>
            {viewMode === 'full' && <>
              <span style={{ textAlign: 'right' }}>WINS</span>
              <span style={{ textAlign: 'center' }}>TEAM</span>
            </>}
          </div>

          {leaderboard.map((entry, idx) => {
            const rd = getRankDisplay(entry.rank);
            const isPlayer = entry.isPlayer;
            const trend = MOCK_TRENDS[idx % MOCK_TRENDS.length];
            const entryPokemons = ALL_POKEMON.filter(p => entry.pokemon.includes(p.id)).slice(0, 3);

            return (
              <motion.div
                key={entry.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                onMouseEnter={() => setHoveredRow(idx)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: viewMode === 'full'
                    ? '48px 1fr 100px 80px 80px 80px'
                    : '48px 1fr 120px 80px',
                  gap: 8, padding: '12px 16px',
                  borderBottom: '1px solid #1E1E4822',
                  background: isPlayer
                    ? '#F59E0B11'
                    : hoveredRow === idx ? '#FFFFFF06' : 'transparent',
                  alignItems: 'center',
                  border: isPlayer ? '1px solid #F59E0B22' : undefined,
                  position: 'relative',
                  transition: 'background 0.15s',
                }}
              >
                {/* Rank */}
                <div style={{
                  fontSize: entry.rank <= 3 ? 18 : 13,
                  fontWeight: 900, color: rd.color,
                  textAlign: 'center',
                }}>
                  {rd.text}
                </div>

                {/* Name & trend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: isPlayer
                      ? 'linear-gradient(135deg, #7C3AED, #4F46E5)'
                      : 'linear-gradient(135deg, #1F2937, #374151)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, flexShrink: 0,
                    border: isPlayer ? '2px solid #F59E0B66' : '1px solid #374151',
                  }}>
                    {isPlayer ? '🎮' : entry.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 12, fontWeight: 800,
                      color: isPlayer ? '#F59E0B' : '#E5E7EB',
                    }}>
                      {entry.name}
                      {isPlayer && <span style={{ fontSize: 8, color: '#F59E0B', marginLeft: 6, fontStyle: 'italic' }}>YOU</span>}
                    </div>
                    <TrendIcon change={isPlayer ? 0 : trend} />
                  </div>
                </div>

                {/* Score */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#F59E0B' }}>
                    {entry.score.toLocaleString()}
                  </div>
                </div>

                {/* Round score */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF' }}>
                    {entry.roundScore.toLocaleString()}
                  </div>
                </div>

                {/* Wins */}
                {viewMode === 'full' && (
                  <div style={{ textAlign: 'right', fontSize: 11, color: '#6B7280', fontWeight: 700 }}>
                    {entry.wins}W
                  </div>
                )}

                {/* Team */}
                {viewMode === 'full' && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                    {entryPokemons.map(p => (
                      <img
                        key={p.id}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                        alt={p.name}
                        style={{ width: 22, height: 22, objectFit: 'contain' }}
                        title={p.name}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Season info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: 20, padding: '16px 20px',
            background: '#0D0D20', border: '1px solid #1E1E48',
            borderRadius: 12,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 10,
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7280', letterSpacing: '0.1em' }}>
              SEASON 1 — MARCH 2026
            </div>
            <div style={{ fontSize: 10, color: '#4B5563', marginTop: 2 }}>
              Rankings reset monthly. Top 3 earn legendary bonuses!
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { label: 'PARTICIPANTS', value: leaderboard.length },
              { label: 'TOP SCORE', value: leaderboard[0]?.score.toLocaleString() },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#F9FAFB' }}>{s.value}</div>
                <div style={{ fontSize: 8, color: '#4B5563', fontWeight: 700, letterSpacing: '0.1em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}