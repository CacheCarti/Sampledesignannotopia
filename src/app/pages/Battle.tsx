import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { BATTLE_IMAGES, Q_COLORS } from '../data/gameImages';
import { getSpriteUrl, ARCHITECTURE_COLORS } from '../data/pokemon';
import {
  GameCard, CARD_FAMILY_CONFIG, CARD_RARITY_COLORS, BODY_PART_CONFIG,
  BodyPart,
} from '../data/cards';
import { CircuitSkillTree } from '../components/CircuitSkillTree';
import { LivePetCompanion } from '../components/LivePetCompanion';
import { ActivePetGuide } from '../components/ActivePetGuide';

const PANEL = '#182426';
const PANEL_INNER = '#2e3a3d';
const PANEL_LIGHT = '#394e52';
const FELT = '#0f3d26';
const AMBER = '#f5a742';
const FONT = "'Rajdhani', sans-serif";

const ROUND_TIME = 90;
const NUM_IMAGES = 4;
const FOCUS_DRAIN = 0.35;
const FOCUS_GAIN_ANNO = 7;
const HONEYPOT_IDX = 2; // every round, image #3 is the honeypot

type Phase = 'intro' | 'playing' | 'dispatch' | 'done';
type Mode = 'probe' | 'sweep';

interface Annotation { mode: Mode; x: number; y: number; w?: number; h?: number; qIdx: 0|1|2; correct?: boolean; }

const MOCK_OPPONENTS = [
  { name: 'NeuroDetective_X', color: '#b879ff', progress: 0, acc: 72 },
  { name: 'DragonMaster99',   color: '#22d3ee', progress: 0, acc: 65 },
  { name: 'ShadowSniper',     color: '#ef4637', progress: 0, acc: 58 },
];

export function Battle() {
  const nav = useNavigate();
  const { activePokemon, cardCombat, initCardCombat, playCard, addFocus, drainFocus, addCombatLog, registerHoneypot, recordRound } = useGame();

  const [phase, setPhase] = useState<Phase>('intro');
  const [imageIdx, setImageIdx] = useState(0);
  const [qIdx, setQIdx] = useState<0|1|2>(0);
  const [time, setTime] = useState(ROUND_TIME);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [opponents, setOpponents] = useState(MOCK_OPPONENTS);
  const [crosshair, setCrosshair] = useState<{ x:number; y:number; qIdx:0|1|2 } | null>(null);
  const [sweepDrag, setSweepDrag] = useState<{ x:number; y:number; w:number; h:number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Pet companion triggers
  const [lastAnnotationTime, setLastAnnotationTime] = useState<number>(0);
  const [lastCardPlayTime, setLastCardPlayTime] = useState<number>(0);

  // Active pet guide state
  const [canvasRect, setCanvasRect] = useState<DOMRect | null>(null);
  const [lastClickPos, setLastClickPos] = useState<{ x: number; y: number } | null>(null);

  const image = BATTLE_IMAGES[imageIdx % BATTLE_IMAGES.length];

  // init on mount
  useEffect(() => {
    if (!activePokemon) { nav('/loadout'); return; }
    if (!cardCombat.activePokemonId) initCardCombat(activePokemon);
    const t = setTimeout(() => setPhase('playing'), 1800);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, []);

  // Track canvas rect
  useEffect(() => {
    const updateRect = () => {
      if (canvasRef.current) {
        setCanvasRect(canvasRef.current.getBoundingClientRect());
      }
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [phase]);

  // timer + focus drain + opponent progress
  useEffect(() => {
    if (phase !== 'playing') return;
    const iv = setInterval(() => {
      setTime(t => {
        if (t <= 1) { clearInterval(iv); setPhase('dispatch'); return 0; }
        return t - 1;
      });
      drainFocus(FOCUS_DRAIN);
      setOpponents(prev => prev.map(o => ({ ...o, progress: Math.min(100, o.progress + 0.6 + Math.random()*1.3) })));
    }, 1000);
    return () => clearInterval(iv);
  }, [phase, drainFocus]);

  // dispatch -> finalise
  useEffect(() => {
    if (phase !== 'dispatch') return;
    const t = setTimeout(() => {
      recordRound([{
        imageId: image.id, annotations: annotations.length,
        score: annotations.length * 60 + cardCombat.trustScore * 6,
        pokemonUsed: activePokemon ? [activePokemon.id] : [],
        honeypotHits: cardCombat.honeypotStreak,
      }]);
      setPhase('done');
      setTimeout(() => nav('/results'), 2400);
    }, 3500);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [phase]);

  // clicking the image → annotate (probe) or start sweep
  const q = image.questions[qIdx];
  const qMode: Mode = q.tool;
  const qColor = Q_COLORS[qIdx];

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (phase !== 'playing') return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const isHoneypot = imageIdx === HONEYPOT_IDX;
    const correct = Math.random() > 0.25;
    if (qMode === 'probe') {
      setAnnotations(prev => [...prev, { mode: 'probe', x, y, qIdx, correct }]);
      setCrosshair({ x, y, qIdx });
      setTimeout(() => setCrosshair(null), 500);
      addFocus(FOCUS_GAIN_ANNO);
      if (isHoneypot) registerHoneypot(correct);
      setLastAnnotationTime(Date.now()); // Trigger pet reaction
      setLastClickPos({ x, y }); // Guide pet to click location
    }
  };

  const handleSweepStart = (e: React.MouseEvent) => {
    if (phase !== 'playing' || qMode !== 'sweep') return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSweepDrag({ x, y, w: 0, h: 0 });
  };
  const handleSweepMove = (e: React.MouseEvent) => {
    if (!sweepDrag || qMode !== 'sweep') return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSweepDrag({ ...sweepDrag, w: x - sweepDrag.x, h: y - sweepDrag.y });
  };
  const handleSweepEnd = () => {
    if (!sweepDrag) return;
    if (Math.abs(sweepDrag.w) > 2 && Math.abs(sweepDrag.h) > 2) {
      setAnnotations(prev => [...prev, { mode: 'sweep', ...sweepDrag, qIdx, correct: Math.random() > 0.3 }]);
      addFocus(FOCUS_GAIN_ANNO);
      setLastAnnotationTime(Date.now()); // Trigger pet reaction
      // Guide pet to center of sweep
      setLastClickPos({
        x: sweepDrag.x + sweepDrag.w / 2,
        y: sweepDrag.y + sweepDrag.h / 2,
      });
    }
    setSweepDrag(null);
  };

  // card play
  const tryPlayCard = useCallback((cardId: string, nodeId: string) => {
    const ok = playCard(cardId, nodeId);
    if (ok) {
      setSelectedCard(null);
      setLastCardPlayTime(Date.now()); // Trigger pet reaction
    }
    return ok;
  }, [playCard]);

  const nextImage = () => {
    if (imageIdx >= NUM_IMAGES - 1) { setPhase('dispatch'); return; }
    setImageIdx(i => i + 1);
    setQIdx(0);
  };

  const selCard = selectedCard ? cardCombat.hand.find(c => c.id === selectedCard) : null;
  const arch = activePokemon ? ARCHITECTURE_COLORS[activePokemon.architecture] : ARCHITECTURE_COLORS.CNN;

  // ─── live "thinking" lines synthesized from current state
  const thinking = React.useMemo(() => {
    const lines: { tone: 'obs' | 'hunch' | 'warn' | 'good'; text: string; timestamp?: number }[] = [];
    image.questions.forEach((qq, i) => {
      const n = annotations.filter(a => a.qIdx === i).length;
      lines.push({ tone: 'obs', text: `Q${i+1} ${qq.short} · ${n ? n + ' marks' : 'scanning…'}`, timestamp: Date.now() });
    });
    if (imageIdx === HONEYPOT_IDX) lines.push({ tone: 'warn', text: 'Honeypot suspected — audit each call.', timestamp: Date.now() });
    if (cardCombat.honeypotStreak > 0) lines.push({ tone: 'good', text: `${cardCombat.honeypotStreak}× streak on decoys.`, timestamp: Date.now() });

    // Add more dynamic thoughts based on recent activity
    if (annotations.length > 0) {
      const recentAnnotations = annotations.slice(-3);
      const uniqueQs = new Set(recentAnnotations.map(a => a.qIdx)).size;
      if (uniqueQs > 1) {
        lines.push({ tone: 'hunch', text: 'Cross-referencing between regions...', timestamp: Date.now() });
      }
    }
    if (annotations.length > 8) {
      lines.push({ tone: 'good', text: 'Building comprehensive dataset!', timestamp: Date.now() });
    }

    lines.push({ tone: 'hunch', text: cardCombat.trustScore > 65 ? 'Top-right edge looks staged.' : 'Pattern forming — cross-ref prior cases.', timestamp: Date.now() });
    return lines;
  }, [image, annotations, cardCombat.honeypotStreak, cardCombat.trustScore, imageIdx]);

  // ─── RENDER ──────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100%', height: '100%',
      background: `radial-gradient(ellipse at center, ${FELT} 0%, #051a10 85%)`,
      fontFamily: FONT, color: '#e9f2ea', display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <AnimatePresence>
        {phase === 'intro' && <IntroOverlay pokemon={activePokemon} />}
        {phase === 'dispatch' && <DispatchOverlay pokemon={activePokemon} annotations={annotations} />}
        {phase === 'done' && <DoneOverlay />}
      </AnimatePresence>

      {/* top HUD */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', background: PANEL, borderBottom: `2px solid ${PANEL_INNER}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {activePokemon && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={getSpriteUrl(activePokemon.id)} style={{ width: 42, height: 42 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{activePokemon.name}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: arch.color, letterSpacing: '0.15em' }}>{arch.label}</div>
              </div>
            </div>
          )}
          <HUDChip label="TRUST"    value={cardCombat.trustScore}     max={100} color="#5db44b" />
          <HUDChip label="FOCUS"    value={Math.round(cardCombat.focus)} max={100} color={AMBER} />
          <HUDChip label="STREAK"   value={cardCombat.honeypotStreak}   color="#b879ff" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: '#10221a', borderRadius: 10, padding: '6px 14px',
            fontSize: 22, fontWeight: 900, color: time < 15 ? '#ef4637' : '#fff',
          }}>{String(Math.floor(time/60)).padStart(2,'0')}:{String(time%60).padStart(2,'0')}</div>
          <div style={{ fontSize: 10, color: '#8ba5a0', letterSpacing: '0.2em' }}>
            IMG {imageIdx+1}/{NUM_IMAGES}{imageIdx === HONEYPOT_IDX && ' · 🍯 HONEYPOT'}
          </div>
        </div>
      </div>

      {/* main 3-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 280px', gap: 10, padding: 10, flex: 1, overflow: 'hidden' }}>
        {/* ── Left: companion dossier + live thinking + tiny ghost radar ── */}
        <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr 120px', gap: 10, minHeight: 0 }}>
          {activePokemon && (
            <LivePetCompanion
              pokemonId={activePokemon.id}
              pokemonName={activePokemon.name}
              architecture={activePokemon.architecture}
              onAnnotation={lastAnnotationTime}
              cardPlayed={lastCardPlayTime}
              trustScore={cardCombat.trustScore}
            />
          )}
          <div style={{
            background: PANEL, border: `2px solid ${PANEL_INNER}`, borderRadius: 12,
            padding: 10, display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden',
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '0.2em', display: 'flex', alignItems: 'center', gap: 6 }}>
              🧠 {activePokemon?.name?.toUpperCase() ?? 'AGENT'} IS THINKING
              {/* Brain activity pulse */}
              <motion.div
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: arch.color,
                  boxShadow: `0 0 8px ${arch.color}`,
                }} />
            </div>
            <div style={{ fontSize: 9, color: '#8ba5a0', letterSpacing: '0.15em', fontWeight: 700 }}>
              SCENE · {image.label.toUpperCase()}
            </div>
            <div style={{ fontSize: 10, color: '#b3cfb8', lineHeight: 1.4 }}>{image.mission}</div>
            <div style={{ height: 1, background: PANEL_INNER, margin: '2px 0' }} />
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <AnimatePresence initial={false}>
                {thinking.map((t, i) => {
                  const col = t.tone === 'good' ? '#8de0b0'
                    : t.tone === 'warn' ? '#ef4637'
                    : t.tone === 'hunch' ? '#b879ff' : '#cfe4d1';
                  const label = t.tone === 'good' ? 'OBS+' : t.tone === 'warn' ? 'WARN' : t.tone === 'hunch' ? 'HUNCH' : 'OBS';
                  return (
                    <motion.div key={`${i}-${t.text}`}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                      <span style={{
                        fontSize: 8, fontWeight: 900, color: col, letterSpacing: '0.15em',
                        background: `${col}18`, border: `1px solid ${col}55`,
                        borderRadius: 4, padding: '1px 5px', marginTop: 2, flexShrink: 0,
                      }}>{label}</span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                        style={{ fontSize: 11, color: '#e9f2ea', lineHeight: 1.35 }}>
                        {t.text}
                      </motion.span>
                      {/* Thinking pulse indicator for recent thoughts */}
                      {t.timestamp && Date.now() - t.timestamp < 3000 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.2, 0.8] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            background: col,
                            marginTop: 6,
                            marginLeft: 'auto',
                          }} />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
          <div style={{
            background: PANEL, border: `2px solid ${PANEL_INNER}`, borderRadius: 10,
            padding: 8, display: 'flex', flexDirection: 'column', gap: 5, overflow: 'hidden',
          }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#fff', letterSpacing: '0.2em' }}>📡 GHOST RADAR</div>
            {opponents.map(o => (
              <div key={o.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 9, color: o.color, fontWeight: 700, minWidth: 92, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.name}</span>
                <div style={{ flex: 1, height: 3, background: '#0a1a12', borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${o.progress}%` }} style={{ height: '100%', background: o.color }} />
                </div>
                <span style={{ fontSize: 8, color: '#8ba5a0', minWidth: 18, textAlign: 'right' }}>{o.acc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Center: image canvas ── */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, minHeight: 0,
        }}>
          {/* question tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {image.questions.map((qq, i) => {
              const active = qIdx === i;
              return (
                <button key={i} onClick={() => setQIdx(i as 0|1|2)} style={{
                  flex: 1, background: active ? `${Q_COLORS[i]}22` : PANEL,
                  border: `2px solid ${active ? Q_COLORS[i] : PANEL_INNER}`,
                  color: active ? Q_COLORS[i] : '#cfe4d1',
                  borderRadius: 10, padding: '8px 10px', fontFamily: FONT,
                  fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', cursor: 'pointer',
                  textAlign: 'left',
                }}>
                  <div style={{ fontSize: 9, letterSpacing: '0.2em' }}>Q{i+1} · {qq.tool.toUpperCase()}</div>
                  <div style={{ fontSize: 11, color: active ? '#fff' : '#cfe4d1', fontWeight: 700, textTransform:'none' }}>{qq.short}</div>
                </button>
              );
            })}
          </div>

          {/* image */}
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseDown={handleSweepStart}
            onMouseMove={handleSweepMove}
            onMouseUp={handleSweepEnd}
            style={{
              position: 'relative', flex: 1, minHeight: 520,
              background: '#000', borderRadius: 12, overflow: 'hidden',
              border: `3px solid ${qColor}66`,
              cursor: qMode === 'probe' ? 'crosshair' : 'grab',
            }}>
            <img src={image.url} style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
            {/* annotations */}
            {annotations.map((a, i) => {
              const c = Q_COLORS[a.qIdx];
              if (a.mode === 'probe') {
                return <div key={i} style={{
                  position: 'absolute', left: `${a.x}%`, top: `${a.y}%`,
                  transform: 'translate(-50%,-50%)', width: 14, height: 14, borderRadius: '50%',
                  background: c, border: '2px solid #fff', boxShadow: `0 0 10px ${c}`,
                }} />;
              }
              return <div key={i} style={{
                position: 'absolute', left: `${a.w < 0 ? a.x + a.w : a.x}%`, top: `${a.h < 0 ? a.y + a.h : a.y}%`,
                width: `${Math.abs(a.w!)}%`, height: `${Math.abs(a.h!)}%`,
                background: `${c}33`, border: `2px solid ${c}`, borderRadius: 4,
              }} />;
            })}
            {/* active sweep */}
            {sweepDrag && (
              <div style={{
                position: 'absolute',
                left: `${sweepDrag.w < 0 ? sweepDrag.x + sweepDrag.w : sweepDrag.x}%`,
                top: `${sweepDrag.h < 0 ? sweepDrag.y + sweepDrag.h : sweepDrag.y}%`,
                width: `${Math.abs(sweepDrag.w)}%`, height: `${Math.abs(sweepDrag.h)}%`,
                background: `${qColor}22`, border: `2px dashed ${qColor}`, borderRadius: 4, pointerEvents: 'none',
              }} />
            )}
            {/* crosshair splash */}
            <AnimatePresence>
              {crosshair && (
                <motion.div
                  initial={{ scale: 0.2, opacity: 1 }} animate={{ scale: 2.4, opacity: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                  style={{
                    position: 'absolute', left: `${crosshair.x}%`, top: `${crosshair.y}%`,
                    transform: 'translate(-50%,-50%)', width: 40, height: 40, borderRadius: '50%',
                    border: `3px solid ${Q_COLORS[crosshair.qIdx]}`, pointerEvents: 'none',
                  }}/>
              )}
            </AnimatePresence>

            {/* Active Pet Guide - circles around and responds to clicks */}
            {activePokemon && phase === 'playing' && (
              <ActivePetGuide
                pokemonId={activePokemon.id}
                pokemonName={activePokemon.name}
                architecture={activePokemon.architecture}
                canvasRect={canvasRect}
                lastClickPos={lastClickPos}
                onAnnotation={lastAnnotationTime}
                trustScore={cardCombat.trustScore}
              />
            )}
          </div>

          {/* progress + next */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
              {[0,1,2].map(i => {
                const n = annotations.filter(a => a.qIdx === i).length;
                return (
                  <div key={i} style={{
                    background: PANEL, borderRadius: 6, padding: '4px 8px',
                    border: `1.5px solid ${Q_COLORS[i]}44`, display:'flex', justifyContent: 'space-between',
                    fontSize: 11, fontWeight: 700, color: Q_COLORS[i],
                  }}>
                    <span>Q{i+1}</span><span style={{ color: '#fff' }}>{n}</span>
                  </div>
                );
              })}
            </div>
            <button onClick={nextImage} style={{
              background: AMBER, color: '#1a0f05', border: 'none', padding: '8px 20px', borderRadius: 10,
              fontSize: 12, fontWeight: 900, letterSpacing: '0.2em', cursor: 'pointer', fontFamily: FONT,
            }}>NEXT IMAGE →</button>
          </div>
        </div>

        {/* ── Right: Circuit Board + Dispatch Log ── */}
        <div style={{
          background: PANEL, border: `2px solid ${PANEL_INNER}`, borderRadius: 12,
          padding: 10, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden',
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '0.2em' }}>⚡ CIRCUIT BOARD</div>
          <div style={{ fontSize: 9, color: '#8ba5a0' }}>Wire organs to power up. Fuses gate the next tier.</div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CircuitSkillTree
              board={cardCombat.circuit}
              hand={cardCombat.hand}
              selectedCard={selCard || null}
              focus={cardCombat.focus}
              architecture={activePokemon?.architecture ?? 'CNN'}
              pulsing={cardCombat.pulsingNodeId}
              onSlotClick={(nodeId) => {
                if (selectedCard) tryPlayCard(selectedCard, nodeId);
              }}
            />
          </div>
          <div style={{ height: 1, background: PANEL_INNER }} />
          <div style={{ fontSize: 10, color: '#8ba5a0', letterSpacing: '0.15em', fontWeight: 700 }}>DISPATCH LOG</div>
          <div style={{ maxHeight: 110, overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse', gap: 3 }}>
            {cardCombat.dispatchLog.slice(-10).reverse().map((l, i) => {
              const col = l.type === 'good' ? '#8de0b0' : l.type === 'warning' ? '#ef4637' : l.type === 'ghost' ? '#b879ff' : '#cfe4d1';
              return <div key={i} style={{ fontSize: 10, color: col, lineHeight: 1.35 }}>{l.message}</div>;
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom: fanned hand ── */}
      <div style={{
        height: 150, background: PANEL, borderTop: `2px solid ${PANEL_INNER}`,
        position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}>
        <div style={{ position: 'absolute', left: 16, top: 10, fontSize: 10, color: '#8ba5a0', letterSpacing: '0.18em', fontWeight: 700 }}>
          HAND · {cardCombat.hand.length} CARDS
        </div>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {cardCombat.hand.map((card, i) => (
            <CardInHand key={card.id} card={card} index={i} total={cardCombat.hand.length}
              selected={selectedCard === card.id}
              canAfford={cardCombat.focus >= card.focusCost}
              onSelect={() => setSelectedCard(card.id === selectedCard ? null : card.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── sub-components ────────────────────────────────────────────────────────
function HUDChip({ label, value, max, color }: { label: string; value: number; max?: number; color: string }) {
  return (
    <div style={{
      background: '#10221a', borderRadius: 8, padding: '6px 10px',
      display: 'flex', flexDirection: 'column', minWidth: 76,
    }}>
      <div style={{ fontSize: 8, color: '#8ba5a0', letterSpacing: '0.18em', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}{max ? <span style={{ fontSize: 9, color: '#8ba5a0' }}>/{max}</span> : ''}</div>
    </div>
  );
}

function CardInHand({ card, index, total, selected, canAfford, onSelect }: {
  card: GameCard; index: number; total: number; selected: boolean; canAfford: boolean; onSelect: () => void;
}) {
  const spread = Math.min(70, 780 / Math.max(total, 5));
  const offset = (index - (total - 1) / 2) * spread;
  const angle = (index - (total - 1) / 2) * 3.5;
  const rarity = CARD_RARITY_COLORS[card.rarity];
  const fam = CARD_FAMILY_CONFIG[card.family];
  const bodyColor = card.slot in BODY_PART_CONFIG
    ? BODY_PART_CONFIG[card.slot as BodyPart].color
    : '#8ba5a0';

  return (
    <motion.div
      onClick={canAfford ? onSelect : undefined}
      initial={{ y: 60, opacity: 0 }}
      animate={{
        x: offset, y: selected ? -55 : 0,
        rotate: selected ? 0 : angle, opacity: 1, scale: selected ? 1.1 : 1,
      }}
      whileHover={canAfford ? { y: selected ? -60 : -30, scale: 1.05, zIndex: 99 } : {}}
      transition={{ type: 'spring', stiffness: 250, damping: 22 }}
      style={{
        position: 'absolute', bottom: 4, left: '50%',
        marginLeft: -56, width: 112, height: 138,
        background: '#f8f2f4', borderRadius: 10,
        border: `2.5px solid ${rarity.border}`,
        boxShadow: selected ? `0 10px 24px rgba(0,0,0,0.6), 0 0 22px ${bodyColor}88`
          : '0 6px 14px rgba(0,0,0,0.45)',
        cursor: canAfford ? 'pointer' : 'not-allowed',
        opacity: canAfford ? 1 : 0.55,
        display: 'flex', flexDirection: 'column', padding: 6, color: '#1a0f05',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 7, color: fam.color, fontWeight: 800, letterSpacing: '0.15em' }}>{fam.label}</div>
        <div style={{ background: AMBER, color: '#1a0f05', borderRadius: 4, fontSize: 9, fontWeight: 900, padding: '1px 5px' }}>{card.focusCost}</div>
      </div>
      <div style={{ fontSize: 26, textAlign: 'center', margin: '4px 0' }}>{card.icon}</div>
      <div style={{ fontSize: 10, fontWeight: 800, textAlign: 'center', lineHeight: 1.1 }}>{card.name}</div>
      <div style={{ fontSize: 8, color: bodyColor, fontWeight: 800, textAlign: 'center', letterSpacing: '0.12em', marginTop: 2 }}>
        → {card.slot.replace('fuse_','').toUpperCase()}
      </div>
      <div style={{ fontSize: 8, color: '#4a3828', textAlign: 'center', marginTop: 2, lineHeight: 1.15 }}>{card.effect}</div>
    </motion.div>
  );
}

function IntroOverlay({ pokemon }: { pokemon: any }) {
  return (
    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(5,20,12,0.95)', zIndex: 999,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
      }}>
      <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
        style={{ fontSize: 72, fontWeight: 900, letterSpacing: '0.06em', color: '#fff' }}>
        CASE OPEN
      </motion.div>
      {pokemon && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
          <img src={getSpriteUrl(pokemon.id)} style={{ width: 120, height: 120 }} />
          <div style={{ fontSize: 24, fontWeight: 800, color: AMBER }}>{pokemon.name} is ready.</div>
        </div>
      )}
    </motion.div>
  );
}

function DispatchOverlay({ pokemon, annotations }: { pokemon: any; annotations: Annotation[] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(5,20,12,0.92)', zIndex: 998,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16,
      }}>
      <div style={{ fontSize: 10, color: AMBER, letterSpacing: '0.3em', fontWeight: 800 }}>DISPATCH SEQUENCE</div>
      <div style={{ fontSize: 56, fontWeight: 900, color: '#fff' }}>TESTING {pokemon?.name?.toUpperCase()}</div>
      <div style={{ fontSize: 14, color: '#8de0b0' }}>Shipping {annotations.length} annotations into the field...</div>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        style={{ width: 80, height: 80, borderRadius: '50%', border: `4px solid ${AMBER}`, borderTopColor: 'transparent' }} />
    </motion.div>
  );
}

function DoneOverlay() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(5,20,12,0.96)', zIndex: 997,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
      <div style={{ fontSize: 72, fontWeight: 900, color: '#8de0b0', letterSpacing: '0.06em' }}>
        CASE CLOSED
      </div>
    </motion.div>
  );
}

export default Battle;
