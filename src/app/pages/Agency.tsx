import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import {
  Pokemon, getSpriteUrl, overallRating, ARCHITECTURE_COLORS, rarityColors,
} from '../data/pokemon';

const PANEL = '#182426';
const PANEL_INNER = '#2e3a3d';
const FELT = '#0f3d26';
const AMBER = '#f5a742';
const PAPER = '#f4e9ce';
const INK = '#1a120a';
const FONT = "'Rajdhani', sans-serif";
const MONO = "'Courier New', monospace";

const MOOD: Record<string, string> = { content:'😊', hyped:'🤩', tired:'😴', dazed:'😵', confused:'🥴' };

type Filter = 'all' | 'onCase' | 'atAgency' | 'recovering';

export function Agency() {
  const nav = useNavigate();
  const { inventory, companions, activePokemon, setActivePokemon, feedCompanion } = useGame();
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Pokemon | null>(activePokemon ?? inventory[0] ?? null);

  // ─── Classify agents by status ──────────────────────────────────────
  const buckets = useMemo(() => {
    const onCase: Pokemon[] = [];
    const atAgency: Pokemon[] = [];
    const recovering: Pokemon[] = [];
    inventory.forEach(p => {
      const c = companions[p.id];
      const stam = c?.stamina ?? 100;
      if (activePokemon?.id === p.id) onCase.push(p);
      else if (stam < 50) recovering.push(p);
      else atAgency.push(p);
    });
    return { onCase, atAgency, recovering };
  }, [inventory, companions, activePokemon]);

  // ─── Agency-wide stats ──────────────────────────────────────────────
  const avgOVR = Math.round(
    inventory.reduce((s, p) => s + overallRating(p.stats), 0) / Math.max(1, inventory.length)
  );
  const avgBond = Math.round(
    inventory.reduce((s, p) => s + (companions[p.id]?.bond ?? 0), 0) / Math.max(1, inventory.length)
  );
  const topSpec = useMemo(() => {
    const counts: Record<string, number> = {};
    inventory.forEach(p => { counts[p.architecture] = (counts[p.architecture] ?? 0) + 1; });
    const [arch] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] ?? ['CNN', 0];
    return arch;
  }, [inventory]);

  const visible = useMemo(() => {
    if (filter === 'onCase') return buckets.onCase;
    if (filter === 'atAgency') return buckets.atAgency;
    if (filter === 'recovering') return buckets.recovering;
    return inventory;
  }, [filter, buckets, inventory]);

  return (
    <div style={{
      minHeight: '100%',
      background: `
        radial-gradient(ellipse at top, #2a1a08 0%, transparent 60%),
        radial-gradient(ellipse at bottom, #0a1810 0%, transparent 60%),
        #0e0a06`,
      fontFamily: FONT, color: '#e9f2ea',
      padding: '22px 28px 50px',
    }}>
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.35em', color: AMBER, fontWeight: 800 }}>
            ANNOTOPIA BUREAU OF INVESTIGATION · EST. 1996
          </div>
          <div style={{ fontSize: 44, fontWeight: 900, color: '#fff', letterSpacing: '0.02em', lineHeight: 1 }}>
            THE DETECTIVE AGENCY
          </div>
          <div style={{ fontSize: 12, color: '#b3cfb8', marginTop: 4 }}>
            Agent dossiers, field assignments, and recovery logs — all in one place.
          </div>
        </div>
        <button onClick={() => nav('/map')} style={{
          background: `linear-gradient(180deg, ${AMBER} 0%, #c0721c 100%)`,
          color: '#1a0f05', border: 'none', padding: '12px 22px', borderRadius: 10,
          fontSize: 12, fontWeight: 900, letterSpacing: '0.2em', cursor: 'pointer', fontFamily: FONT,
          boxShadow: '0 4px 14px rgba(245,167,66,0.35)',
        }}>DEPLOY TO FIELD →</button>
      </div>

      {/* agency-wide stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10,
        background: PANEL, border: `2px solid ${PANEL_INNER}`, borderRadius: 14, padding: 12,
        marginBottom: 16,
      }}>
        <AgencyStat label="ACTIVE ROSTER" value={inventory.length} suffix="agents" color="#5db44b" />
        <AgencyStat label="AVG RATING" value={avgOVR} color="#fff" />
        <AgencyStat label="AVG BOND" value={avgBond} suffix="%" color="#ff6dae" />
        <AgencyStat label="TOP SPECIALTY" value={topSpec} color={AMBER} small />
        <AgencyStat
          label="IN RECOVERY"
          value={buckets.recovering.length}
          suffix={`/ ${inventory.length}`}
          color="#ef4637"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, alignItems: 'flex-start' }}>
        {/* ── Left: Roster board with status columns ── */}
        <div style={{
          background: PANEL, border: `2px solid ${PANEL_INNER}`, borderRadius: 14, padding: 14,
        }}>
          {/* filter tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, borderBottom: `1px solid ${PANEL_INNER}`, paddingBottom: 10 }}>
            {([
              ['all', 'ALL AGENTS', inventory.length],
              ['onCase', 'ON CASE', buckets.onCase.length],
              ['atAgency', 'AT AGENCY', buckets.atAgency.length],
              ['recovering', 'RECOVERING', buckets.recovering.length],
            ] as [Filter, string, number][]).map(([k, label, n]) => {
              const active = filter === k;
              return (
                <button key={k} onClick={() => setFilter(k)} style={{
                  background: active ? AMBER : 'transparent',
                  color: active ? '#1a0f05' : '#cfe4d1',
                  border: `1.5px solid ${active ? AMBER : PANEL_INNER}`,
                  borderRadius: 8, padding: '7px 12px', fontFamily: FONT,
                  fontSize: 10, fontWeight: 900, letterSpacing: '0.18em', cursor: 'pointer',
                }}>
                  {label} · {n}
                </button>
              );
            })}
          </div>

          {/* Status column layout when "all" */}
          {filter === 'all' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <StatusColumn
                title="ON CASE" tint="#f5a742"
                note="Deployed in the field"
                agents={buckets.onCase}
                companions={companions}
                selected={selected}
                onSelect={setSelected}
              />
              <StatusColumn
                title="AT THE AGENCY" tint="#5db44b"
                note="Ready for assignment"
                agents={buckets.atAgency}
                companions={companions}
                selected={selected}
                onSelect={setSelected}
              />
              <StatusColumn
                title="RECOVERING" tint="#ef4637"
                note="Stamina below 50%"
                agents={buckets.recovering}
                companions={companions}
                selected={selected}
                onSelect={setSelected}
              />
            </div>
          ) : (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: 12,
            }}>
              {visible.map(p => (
                <DossierCard key={p.id}
                  pokemon={p}
                  companion={companions[p.id]}
                  selected={selected?.id === p.id}
                  onClick={() => setSelected(p)}
                />
              ))}
              {visible.length === 0 && (
                <div style={{ color: '#8ba5a0', fontSize: 12, padding: 12 }}>No agents in this bucket.</div>
              )}
            </div>
          )}
        </div>

        {/* ── Right: Case file for selected agent ── */}
        {selected && (
          <CaseFile
            pokemon={selected}
            companion={companions[selected.id]}
            isActive={activePokemon?.id === selected.id}
            onAssign={() => setActivePokemon(selected)}
            onFeed={() => feedCompanion(selected.id, 25)}
          />
        )}
      </div>
    </div>
  );
}

function AgencyStat({ label, value, suffix, color, small }: {
  label: string; value: React.ReactNode; suffix?: string; color: string; small?: boolean;
}) {
  return (
    <div style={{ background: '#10221a', borderRadius: 10, padding: 10 }}>
      <div style={{ fontSize: 9, color: '#8ba5a0', letterSpacing: '0.2em', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: small ? 18 : 26, fontWeight: 900, color, marginTop: 2 }}>
        {value}
        {suffix && <span style={{ fontSize: 10, color: '#8ba5a0', marginLeft: 4 }}>{suffix}</span>}
      </div>
    </div>
  );
}

function StatusColumn({
  title, tint, note, agents, companions, selected, onSelect,
}: {
  title: string; tint: string; note: string;
  agents: Pokemon[]; companions: Record<number, any>;
  selected: Pokemon | null; onSelect: (p: Pokemon) => void;
}) {
  return (
    <div style={{
      background: '#10221a', borderRadius: 12, padding: 10,
      border: `1px solid ${tint}33`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{
          fontSize: 10, fontWeight: 900, letterSpacing: '0.22em', color: tint,
        }}>{title}</div>
        <div style={{
          background: `${tint}22`, color: tint, border: `1px solid ${tint}55`,
          fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4,
        }}>{agents.length}</div>
      </div>
      <div style={{ fontSize: 9, color: '#8ba5a0', marginBottom: 10, letterSpacing: '0.1em' }}>{note}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {agents.length === 0 && (
          <div style={{ fontSize: 11, color: '#5a706a', fontStyle: 'italic', textAlign: 'center', padding: 14 }}>
            — vacant —
          </div>
        )}
        {agents.map(p => (
          <DossierCard key={p.id}
            pokemon={p}
            companion={companions[p.id]}
            selected={selected?.id === p.id}
            onClick={() => onSelect(p)}
            compact
          />
        ))}
      </div>
    </div>
  );
}

function DossierCard({ pokemon, companion, selected, onClick, compact }: {
  pokemon: Pokemon; companion: any; selected: boolean; onClick: () => void; compact?: boolean;
}) {
  const arch = ARCHITECTURE_COLORS[pokemon.architecture];
  const rarity = rarityColors[pokemon.rarity];
  const stam = companion?.stamina ?? 100;
  const bond = companion?.bond ?? 0;
  const ovr = overallRating(pokemon.stats);
  const id = String(pokemon.id).padStart(4, '0');

  return (
    <motion.div
      whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        background: PAPER,
        border: `2px solid ${selected ? AMBER : rarity.color + '55'}`,
        boxShadow: selected ? `0 0 14px ${AMBER}77` : '0 3px 8px rgba(0,0,0,0.4)',
        borderRadius: 8, padding: 8, cursor: 'pointer', position: 'relative',
        color: INK, fontFamily: MONO,
      }}>
      {/* staple corner */}
      <div style={{
        position: 'absolute', top: -3, right: 10, width: 20, height: 6, background: '#9a9a9a',
        borderRadius: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
      }} />
      {/* dossier header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, letterSpacing: '0.1em', color: '#5a4a2a' }}>
        <span>AGENT #{id}</span>
        <span>{pokemon.rarity.toUpperCase()}</span>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
        <div style={{
          width: compact ? 44 : 60, height: compact ? 44 : 60,
          background: '#dcc79c', borderRadius: 4, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid #8a7040',
        }}>
          <img src={getSpriteUrl(pokemon.id)}
            style={{ width: '95%', height: '95%', objectFit: 'contain', imageRendering: 'pixelated' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: FONT, fontSize: compact ? 12 : 15, fontWeight: 900, color: INK,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{pokemon.name}</div>
          <div style={{ fontSize: 8, color: arch.color, fontWeight: 900, letterSpacing: '0.15em' }}>
            {arch.label}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 2, fontSize: 9, color: '#5a4a2a' }}>
            <span>OVR <b style={{ color: INK }}>{ovr}</b></span>
            <span>{MOOD[companion?.morale ?? 'content']}</span>
          </div>
        </div>
      </div>
      {/* stamina + bond bars */}
      <div style={{ marginTop: 6 }}>
        <Bar label="STAM" value={stam} color={stam < 50 ? '#ef4637' : '#5db44b'} />
        <Bar label="BOND" value={bond} color="#ff6dae" />
      </div>
    </motion.div>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
      <span style={{ fontSize: 7, fontWeight: 900, color: '#5a4a2a', width: 26, letterSpacing: '0.1em' }}>{label}</span>
      <div style={{ flex: 1, height: 4, background: '#dcc79c', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color }} />
      </div>
      <span style={{ fontSize: 8, fontWeight: 900, color: INK, width: 22, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function CaseFile({ pokemon, companion, isActive, onAssign, onFeed }: {
  pokemon: Pokemon; companion: any; isActive: boolean;
  onAssign: () => void; onFeed: () => void;
}) {
  const arch = ARCHITECTURE_COLORS[pokemon.architecture];
  const rarity = rarityColors[pokemon.rarity];
  const id = String(pokemon.id).padStart(4, '0');
  const stam = companion?.stamina ?? 100;
  const bond = companion?.bond ?? 0;

  return (
    <motion.div
      key={pokemon.id}
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      style={{
        background: PAPER, color: INK,
        borderRadius: 12, padding: 16,
        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
        fontFamily: MONO,
        position: 'sticky', top: 20,
      }}>
      {/* CLASSIFIED stamp */}
      <motion.div
        initial={{ rotate: -20, scale: 1.2, opacity: 0 }}
        animate={{ rotate: -12, scale: 1, opacity: 0.7 }}
        style={{
          position: 'absolute', top: 14, right: 14,
          border: '2px solid #a33', padding: '4px 10px', borderRadius: 3,
          color: '#a33', fontSize: 10, fontWeight: 900, letterSpacing: '0.25em',
        }}>CLASSIFIED</motion.div>

      <div style={{ fontSize: 9, letterSpacing: '0.25em', color: '#5a4a2a' }}>
        CASE FILE · AGENT #{id}
      </div>
      <div style={{
        fontFamily: FONT, fontSize: 28, fontWeight: 900, color: INK, marginTop: 2, letterSpacing: '-0.01em',
      }}>{pokemon.name}</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
        <Tag color={arch.color}>{arch.label}</Tag>
        <Tag color={rarity.color}>{pokemon.rarity.toUpperCase()}</Tag>
        {isActive && <Tag color={AMBER}>ON CASE</Tag>}
      </div>

      {/* mugshot */}
      <div style={{
        marginTop: 10,
        background: '#dcc79c', border: '2px solid #8a7040',
        borderRadius: 6, padding: 8,
        display: 'flex', justifyContent: 'center',
      }}>
        <img src={getSpriteUrl(pokemon.id)}
          style={{ width: 120, height: 120, imageRendering: 'pixelated' }} />
      </div>

      {/* typewriter brief */}
      <div style={{
        marginTop: 10, padding: 10, background: '#f8efd6',
        border: '1px dashed #8a7040', borderRadius: 4,
        fontSize: 11, lineHeight: 1.5, color: INK,
      }}>
        <span style={{ fontWeight: 900 }}>BRIEF:</span> {pokemon.description}
      </div>

      {/* stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 10 }}>
        {(['pace','verbal','spatial','accuracy'] as const).map(k => (
          <div key={k} style={{
            background: '#f8efd6', border: '1px solid #c7a977', borderRadius: 4,
            padding: 6, textAlign: 'center',
          }}>
            <div style={{ fontSize: 7, fontWeight: 900, color: '#5a4a2a', letterSpacing: '0.1em' }}>{k.toUpperCase()}</div>
            <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 900, color: INK }}>{pokemon.stats[k]}</div>
          </div>
        ))}
      </div>

      {/* vitals */}
      <div style={{ marginTop: 10 }}>
        <Bar label="STAM" value={stam} color={stam < 50 ? '#c23' : '#2a8' } />
        <Bar label="BOND" value={bond} color="#d06" />
      </div>

      {/* notes */}
      <div style={{
        marginTop: 10, fontSize: 10, lineHeight: 1.5, color: '#5a4a2a',
        borderTop: '1px dashed #8a7040', paddingTop: 8,
      }}>
        <span style={{ fontWeight: 900, color: INK }}>FIELD NOTES.</span>{' '}
        {stam < 50 ? 'Agent is fatigued. Feed treats before redeploying.'
          : bond < 30 ? 'Bond still forming. A few cases together will tighten trust.'
          : 'In top form. Can be dispatched immediately.'}
      </div>

      {/* actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={onAssign} disabled={isActive} style={{
          flex: 1,
          background: isActive ? '#c7a977' : INK,
          color: isActive ? '#5a4a2a' : PAPER,
          border: 'none', padding: '10px 0', borderRadius: 6,
          fontSize: 10, fontWeight: 900, letterSpacing: '0.22em',
          cursor: isActive ? 'default' : 'pointer', fontFamily: FONT,
        }}>{isActive ? '✓ ASSIGNED' : 'ASSIGN TO CASE'}</button>
        <button onClick={onFeed} style={{
          flex: 1, background: 'transparent', color: INK,
          border: `2px solid ${INK}`, padding: '10px 0', borderRadius: 6,
          fontSize: 10, fontWeight: 900, letterSpacing: '0.22em', cursor: 'pointer', fontFamily: FONT,
        }}>🍖 FEED TREAT</button>
      </div>
    </motion.div>
  );
}

function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 900, letterSpacing: '0.18em',
      background: `${color}22`, color, border: `1px solid ${color}66`,
      padding: '2px 8px', borderRadius: 4,
    }}>{children}</span>
  );
}

export default Agency;
