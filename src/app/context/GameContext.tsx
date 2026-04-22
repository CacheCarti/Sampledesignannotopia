import React, { createContext, useContext, useState, useCallback } from 'react';
import { Pokemon, ALL_POKEMON, STARTER_INVENTORY_IDS } from '../data/pokemon';
import {
  GameCard, generateHand, CircuitBoard, createCircuitBoard, recomputeUnlocks,
  SkillTreeNode, TacticalType,
} from '../data/cards';

export type RoundType = 'dojo' | 'standard' | 'expert' | 'tournament';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  roundScore: number;
  wins: number;
  pokemon: number[];
  isPlayer?: boolean;
}

export interface RoundResult {
  imageId: string;
  annotations: number;
  score: number;
  pokemonUsed: number[];
  honeypotHits?: number;
  honeypotMisses?: number;
}

// ─── Per-Pokémon companion state (Tamagotchi) ───────────────────────────────
export interface CompanionState {
  pokemonId: number;
  bond: number;        // 0-100, grows with rounds played
  stamina: number;     // 0-100, depletes when used, restores in Atelier
  overfit: Record<string, number>; // theme → overfit score (0-100)
  morale: 'content' | 'hyped' | 'tired' | 'dazed' | 'confused';
  lastUsedRound: number;
}

// ─── Card combat state (single-Pokémon per round) ──────────────────────────
export interface CardCombatState {
  activePokemonId: number | null;  // single active companion for this round
  hand: GameCard[];
  focus: number;
  maxFocus: number;
  circuit: CircuitBoard;           // single body-part circuit
  playedCards: GameCard[];
  pulsingNodeId: string | null;
  trustScore: number;              // per-round trust (0-100)
  honeypotStreak: number;
  dispatchLog: { time: number; message: string; type: 'good' | 'warning' | 'ghost' | 'chatter' }[];
}

interface GameContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
  coins: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  diamonds: number;
  addDiamonds: (n: number) => void;
  inventory: Pokemon[];
  addToInventory: (pokemon: Pokemon) => void;
  removeFromInventory: (pokemonId: number) => void;
  // Companion roster
  companions: Record<number, CompanionState>;
  getCompanion: (id: number) => CompanionState;
  feedCompanion: (id: number, amount: number) => void;
  // Round loadout — SINGLE Pokémon per round
  activePokemon: Pokemon | null;
  setActivePokemon: (p: Pokemon | null) => void;
  // Legacy multi-lane (kept for compat but unused in new flow)
  teamEnsembles: [Pokemon[], Pokemon[], Pokemon[]];
  addToEnsemble: (qIdx: 0 | 1 | 2, pokemon: Pokemon) => void;
  removeFromEnsemble: (qIdx: 0 | 1 | 2, slotIdx: number) => void;
  clearEnsemble: (qIdx: 0 | 1 | 2) => void;
  autoSelectEnsembles: () => void;
  totalScore: number;
  lastRoundScore: number;
  roundResults: RoundResult[];
  recordRound: (results: RoundResult[]) => void;
  leaderboard: LeaderboardEntry[];
  updateLeaderboard: (score: number) => void;
  roundsPlayed: number;
  roundType: RoundType;
  setRoundType: (type: RoundType) => void;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  // Circuit combat
  cardCombat: CardCombatState;
  initCardCombat: (activePokemon?: Pokemon | null) => void;
  playCard: (cardId: string, nodeId: string) => boolean;
  addFocus: (amount: number) => void;
  drainFocus: (amount: number) => void;
  addCombatLog: (message: string, type?: 'good' | 'warning' | 'ghost' | 'chatter') => void;
  registerHoneypot: (hit: boolean) => void;
  // Bucket map
  currentMapNodeId: string;
  setCurrentMapNodeId: (id: string) => void;
}

const GameContext = createContext<GameContextType | null>(null);

const DEFAULT_COMBAT: CardCombatState = {
  activePokemonId: null,
  hand: [],
  focus: 60,
  maxFocus: 100,
  circuit: createCircuitBoard('CNN'),
  playedCards: [],
  pulsingNodeId: null,
  trustScore: 50,
  honeypotStreak: 0,
  dispatchLog: [],
};

const noop = () => {};
const DEFAULT_CONTEXT: GameContextType = {
  playerName: 'Detective', setPlayerName: noop,
  coins: 0, addCoins: noop, spendCoins: () => false,
  diamonds: 0, addDiamonds: noop,
  inventory: [], addToInventory: noop, removeFromInventory: noop,
  companions: {}, getCompanion: (id) => ({ pokemonId: id, bond: 0, stamina: 100, overfit: {}, morale: 'content', lastUsedRound: 0 }),
  feedCompanion: noop,
  activePokemon: null, setActivePokemon: noop,
  teamEnsembles: [[], [], []],
  addToEnsemble: noop, removeFromEnsemble: noop, clearEnsemble: noop, autoSelectEnsembles: noop,
  totalScore: 0, lastRoundScore: 0, roundResults: [], recordRound: noop,
  leaderboard: [], updateLeaderboard: noop,
  roundsPlayed: 0,
  roundType: 'dojo', setRoundType: noop,
  selectedTheme: 'mixed', setSelectedTheme: noop,
  cardCombat: DEFAULT_COMBAT,
  initCardCombat: noop, playCard: () => false,
  addFocus: noop, drainFocus: noop, addCombatLog: noop, registerHoneypot: noop,
  currentMapNodeId: 'start', setCurrentMapNodeId: noop,
};

const MOCK_PLAYERS: Omit<LeaderboardEntry, 'rank'>[] = [
  { name: 'NeuroDetective_X', score: 94200, roundScore: 8800, wins: 12, pokemon: [150, 384, 376] },
  { name: 'DragonMaster99',   score: 87500, roundScore: 7200, wins: 9,  pokemon: [445, 149, 6] },
  { name: 'PsychicPro',       score: 81000, roundScore: 6900, wins: 8,  pokemon: [151, 196, 282] },
  { name: 'ShadowSniper',     score: 76400, roundScore: 6100, wins: 7,  pokemon: [197, 94, 359] },
  { name: 'ElectricEagle',    score: 71200, roundScore: 5800, wins: 6,  pokemon: [135, 25, 212] },
  { name: 'AquaAimer',        score: 65800, roundScore: 5400, wins: 5,  pokemon: [9, 130, 134] },
  { name: 'FireFighter_Z',    score: 60300, roundScore: 4900, wins: 5,  pokemon: [6, 59, 637] },
  { name: 'IronClad77',       score: 55700, roundScore: 4500, wins: 4,  pokemon: [376, 212, 248] },
  { name: 'FairyTaleBot',     score: 49200, roundScore: 4100, wins: 3,  pokemon: [468, 282, 151] },
  { name: 'GhostHunter',      score: 44500, roundScore: 3800, wins: 3,  pokemon: [94, 197, 359] },
  { name: 'GrassPatcher',     score: 39800, roundScore: 3400, wins: 2,  pokemon: [3, 468, 134] },
  { name: 'NoviceTrainer',    score: 28700, roundScore: 2500, wins: 1,  pokemon: [25, 3, 9] },
];

const getStarterInventory = () => ALL_POKEMON.filter(p => STARTER_INVENTORY_IDS.includes(p.id));

const makeCompanion = (id: number): CompanionState => ({
  pokemonId: id, bond: 5 + Math.floor(Math.random() * 20),
  stamina: 80 + Math.floor(Math.random() * 20),
  overfit: {}, morale: 'content', lastUsedRound: 0,
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [playerName, setPlayerName] = useState('Detective');
  const [coins, setCoins] = useState(10000);
  const [diamonds, setDiamonds] = useState(12);
  const [inventory, setInventory] = useState<Pokemon[]>(getStarterInventory());
  const [companions, setCompanions] = useState<Record<number, CompanionState>>(() => {
    const out: Record<number, CompanionState> = {};
    getStarterInventory().forEach(p => { out[p.id] = makeCompanion(p.id); });
    return out;
  });
  const [activePokemon, setActivePokemon] = useState<Pokemon | null>(null);
  const [teamEnsembles, setTeamEnsembles] = useState<[Pokemon[], Pokemon[], Pokemon[]]>([[], [], []]);
  const [totalScore, setTotalScore] = useState(0);
  const [lastRoundScore, setLastRoundScore] = useState(0);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [roundType, setRoundType] = useState<RoundType>('dojo');
  const [selectedTheme, setSelectedTheme] = useState<string>('mixed');
  const [currentMapNodeId, setCurrentMapNodeId] = useState('start');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() =>
    MOCK_PLAYERS.map((p, i) => ({ ...p, rank: i + 1 }))
  );
  const [cardCombat, setCardCombat] = useState<CardCombatState>(DEFAULT_COMBAT);

  const addCoins = useCallback((amount: number) => setCoins(c => c + amount), []);
  const spendCoins = useCallback((amount: number): boolean => {
    if (coins < amount) return false;
    setCoins(c => c - amount); return true;
  }, [coins]);
  const addDiamonds = useCallback((n: number) => setDiamonds(d => d + n), []);

  const addToInventory = useCallback((pokemon: Pokemon) => {
    setInventory(inv => [...inv, pokemon]);
    setCompanions(c => c[pokemon.id] ? c : { ...c, [pokemon.id]: makeCompanion(pokemon.id) });
  }, []);
  const removeFromInventory = useCallback((pokemonId: number) => {
    setInventory(inv => inv.filter(p => p.id !== pokemonId));
  }, []);

  const getCompanion = useCallback((id: number): CompanionState => {
    return companions[id] ?? makeCompanion(id);
  }, [companions]);

  const feedCompanion = useCallback((id: number, amount: number) => {
    setCompanions(prev => {
      const cur = prev[id] ?? makeCompanion(id);
      return { ...prev, [id]: { ...cur, stamina: Math.min(100, cur.stamina + amount), bond: Math.min(100, cur.bond + Math.floor(amount/3)) } };
    });
  }, []);

  const addToEnsemble = useCallback((qIdx: 0|1|2, pokemon: Pokemon) => {
    setTeamEnsembles(prev => {
      if (prev[qIdx].length >= 4) return prev;
      const next = [...prev] as [Pokemon[], Pokemon[], Pokemon[]];
      next[qIdx] = [...next[qIdx], pokemon]; return next;
    });
  }, []);
  const removeFromEnsemble = useCallback((qIdx: 0|1|2, slotIdx: number) => {
    setTeamEnsembles(prev => {
      const next = [...prev] as [Pokemon[], Pokemon[], Pokemon[]];
      next[qIdx] = next[qIdx].filter((_, i) => i !== slotIdx); return next;
    });
  }, []);
  const clearEnsemble = useCallback((qIdx: 0|1|2) => {
    setTeamEnsembles(prev => { const next=[...prev] as any; next[qIdx]=[]; return next; });
  }, []);
  const autoSelectEnsembles = useCallback(() => {
    const sorted = [...inventory].sort((a,b) => (b.stats.accuracy+b.stats.pace) - (a.stats.accuracy+a.stats.pace));
    setTeamEnsembles([sorted.slice(0,2), sorted.slice(0,2), sorted.slice(0,2)]);
  }, [inventory]);

  const recordRound = useCallback((results: RoundResult[]) => {
    const roundScore = results.reduce((s, r) => s + r.score, 0);
    setRoundResults(results);
    setLastRoundScore(roundScore);
    setTotalScore(s => s + roundScore);
    setRoundsPlayed(r => r + 1);
    setCoins(c => c + Math.floor(roundScore / 8));
    setDiamonds(d => d + Math.floor(roundScore / 500));
    // bond & stamina update for active
    if (activePokemon) {
      setCompanions(prev => {
        const cur = prev[activePokemon.id] ?? makeCompanion(activePokemon.id);
        return { ...prev, [activePokemon.id]: {
          ...cur,
          bond: Math.min(100, cur.bond + 4),
          stamina: Math.max(0, cur.stamina - 15),
          lastUsedRound: (cur.lastUsedRound || 0) + 1,
        }};
      });
    }
  }, [activePokemon]);

  const updateLeaderboard = useCallback((score: number) => {
    setLeaderboard(prev => {
      const playerEntry: LeaderboardEntry = {
        rank: 0, name: playerName, score: totalScore + score, roundScore: score,
        wins: roundsPlayed, pokemon: activePokemon ? [activePokemon.id] : [], isPlayer: true,
      };
      const others = prev.filter(e => !e.isPlayer);
      return [...others, playerEntry].sort((a,b) => b.score - a.score).map((e,i) => ({...e, rank:i+1}));
    });
  }, [playerName, totalScore, roundsPlayed, activePokemon]);

  // ─── Circuit Combat ───────────────────────────────────────────────────────
  const initCardCombat = useCallback((pokemon?: Pokemon | null) => {
    const p = pokemon ?? activePokemon;
    setCardCombat({
      activePokemonId: p?.id ?? null,
      hand: generateHand(9),
      focus: 60, maxFocus: 100,
      circuit: createCircuitBoard(p?.architecture ?? 'CNN'),
      playedCards: [],
      pulsingNodeId: null,
      trustScore: 50,
      honeypotStreak: 0,
      dispatchLog: [{ time: Date.now(), message: `${p?.name ?? 'Companion'} enters the arena. Ready to learn.`, type: 'chatter' }],
    });
  }, [activePokemon]);

  const playCard = useCallback((cardId: string, nodeId: string): boolean => {
    let success = false;
    setCardCombat(prev => {
      const card = prev.hand.find(c => c.id === cardId);
      const node = prev.circuit.nodes.find(n => n.id === nodeId);
      if (!card || !node) return prev;
      if (prev.focus < card.focusCost) return prev;
      if (node.equippedCard) return prev;
      if (!node.unlocked) return prev;
      if (card.slot !== node.kind) return prev;
      // brain arch gate
      const activeArch = prev.activePokemonId
        ? (inventory.find(p => p.id === prev.activePokemonId)?.architecture ?? 'CNN')
        : 'CNN';
      if (node.kind === 'brain' && card.compatibleArchitectures && !card.compatibleArchitectures.includes(activeArch)) return prev;

      const newNodes = prev.circuit.nodes.map(n => n.id === nodeId ? { ...n, equippedCard: card } : n);
      const newCircuit = recomputeUnlocks({ ...prev.circuit, nodes: newNodes });
      success = true;
      return {
        ...prev,
        hand: prev.hand.filter(c => c.id !== cardId),
        focus: prev.focus - card.focusCost,
        circuit: newCircuit,
        playedCards: [...prev.playedCards, card],
        pulsingNodeId: nodeId,
        dispatchLog: [...prev.dispatchLog.slice(-30), {
          time: Date.now(),
          message: `🔌 ${card.name} wired to ${node.kind.toUpperCase()}.`,
          type: 'good',
        }],
      };
    });
    setTimeout(() => setCardCombat(prev => ({ ...prev, pulsingNodeId: null })), 700);
    return success;
  }, [inventory]);

  const addFocus = useCallback((amount: number) => {
    setCardCombat(prev => ({ ...prev, focus: Math.min(prev.maxFocus, prev.focus + amount) }));
  }, []);
  const drainFocus = useCallback((amount: number) => {
    setCardCombat(prev => ({ ...prev, focus: Math.max(0, prev.focus - amount) }));
  }, []);
  const addCombatLog = useCallback((message: string, type: 'good'|'warning'|'ghost'|'chatter' = 'chatter') => {
    setCardCombat(prev => ({ ...prev, dispatchLog: [...prev.dispatchLog.slice(-30), { time: Date.now(), message, type }] }));
  }, []);
  const registerHoneypot = useCallback((hit: boolean) => {
    setCardCombat(prev => ({
      ...prev,
      honeypotStreak: hit ? prev.honeypotStreak + 1 : 0,
      trustScore: Math.max(0, Math.min(100, prev.trustScore + (hit ? 4 : -10))),
      focus: Math.min(prev.maxFocus, prev.focus + (hit ? 8 : 0)),
      dispatchLog: [...prev.dispatchLog.slice(-30), {
        time: Date.now(),
        message: hit ? `✓ Honeypot solved · trust +4 · focus +8` : `✗ Honeypot missed · trust -10 · morale shaken`,
        type: hit ? 'good' : 'warning',
      }],
    }));
  }, []);

  return (
    <GameContext.Provider value={{
      playerName, setPlayerName,
      coins, addCoins, spendCoins,
      diamonds, addDiamonds,
      inventory, addToInventory, removeFromInventory,
      companions, getCompanion, feedCompanion,
      activePokemon, setActivePokemon,
      teamEnsembles, addToEnsemble, removeFromEnsemble, clearEnsemble, autoSelectEnsembles,
      totalScore, lastRoundScore, roundResults, recordRound,
      leaderboard, updateLeaderboard,
      roundsPlayed,
      roundType, setRoundType,
      selectedTheme, setSelectedTheme,
      cardCombat, initCardCombat, playCard, addFocus, drainFocus, addCombatLog, registerHoneypot,
      currentMapNodeId, setCurrentMapNodeId,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = (): GameContextType => useContext(GameContext) ?? DEFAULT_CONTEXT;
