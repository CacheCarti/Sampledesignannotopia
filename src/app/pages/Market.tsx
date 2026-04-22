import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { PokemonCard, PokemonDetailCard } from '../components/PokemonCard';
import { Pokemon, ALL_POKEMON, typeColors, rarityColors, overallRating, Rarity, PokemonType } from '../data/pokemon';
import { motion, AnimatePresence } from 'motion/react';

type SortKey = 'price' | 'overall' | 'pace' | 'verbal' | 'spatial' | 'accuracy' | 'name';
type FilterRarity = Rarity | 'All';

const TOAST_DURATION = 2500;

export function Market() {
  const { coins, spendCoins, addCoins, inventory, addToInventory, removeFromInventory, teamEnsembles } = useGame();
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [activeTab, setActiveTab] = useState<'market' | 'inventory'>('market');
  const [sortBy, setSortBy] = useState<SortKey>('overall');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filterRarity, setFilterRarity] = useState<FilterRarity>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: 'success' | 'error' }[]>([]);
  const [recentTx, setRecentTx] = useState<{ name: string; action: 'buy' | 'sell'; price: number }[]>([]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(ts => [...ts, { id, msg, type }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), TOAST_DURATION);
  };

  const inInventory = (p: Pokemon) => inventory.some(inv => inv.id === p.id && inv.name === p.name);
  const inTeam = (p: Pokemon) => teamEnsembles.some(e => e.some(t => t?.id === p.id));

  const handleBuy = (p: Pokemon) => {
    if (inInventory(p)) {
      showToast(`Already own ${p.name}!`, 'error');
      return;
    }
    const ok = spendCoins(p.price);
    if (!ok) {
      showToast(`Not enough coins! Need ${p.price.toLocaleString()} ⚡`, 'error');
      return;
    }
    addToInventory(p);
    setRecentTx(tx => [{ name: p.name, action: 'buy', price: p.price }, ...tx.slice(0, 4)]);
    showToast(`Bought ${p.name} for ${p.price.toLocaleString()} ⚡!`);
    setSelectedPokemon(null);
  };

  const handleSell = (p: Pokemon) => {
    if (inTeam(p)) {
      showToast(`Remove ${p.name} from your team first!`, 'error');
      return;
    }
    const sellPrice = Math.round(p.price * 0.75);
    removeFromInventory(p.id);
    addCoins(sellPrice);
    setRecentTx(tx => [{ name: p.name, action: 'sell', price: sellPrice }, ...tx.slice(0, 4)]);
    showToast(`Sold ${p.name} for ${sellPrice.toLocaleString()} ⚡!`);
    setSelectedPokemon(null);
  };

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    ALL_POKEMON.forEach(p => p.types.forEach(t => types.add(t)));
    return ['All', ...Array.from(types).sort()];
  }, []);

  const sortAndFilter = (list: Pokemon[]) => {
    return list
      .filter(p => filterRarity === 'All' || p.rarity === filterRarity)
      .filter(p => filterType === 'All' || p.types.includes(filterType as PokemonType))
      .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        let va: number, vb: number;
        if (sortBy === 'name') return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        if (sortBy === 'price') { va = a.price; vb = b.price; }
        else if (sortBy === 'overall') { va = overallRating(a.stats); vb = overallRating(b.stats); }
        else { va = (a.stats as any)[sortBy]; vb = (b.stats as any)[sortBy]; }
        return sortDir === 'desc' ? vb - va : va - vb;
      });
  };

  const marketList = sortAndFilter(ALL_POKEMON.filter(p => !inInventory(p)));
  const inventoryList = sortAndFilter(inventory);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(key); setSortDir('desc'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#060610', color: '#F9FAFB', padding: '24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{
              fontSize: 28, fontWeight: 900, letterSpacing: '0.08em', margin: 0,
              background: 'linear-gradient(90deg, #F59E0B, #A78BFA)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              🏪 TRANSFER MARKET
            </h1>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 0' }}>
              Acquire and trade Logic Drones. Click any card to view full stat breakdown.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{
              background: '#1F1C00', border: '1px solid #F59E0B66',
              borderRadius: 10, padding: '8px 16px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 18 }}>⚡</span>
              <div>
                <div style={{ fontSize: 9, color: '#78716C', fontWeight: 700, letterSpacing: '0.1em' }}>YOUR BALANCE</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#F59E0B' }}>{coins.toLocaleString()}</div>
              </div>
            </div>

            {/* Recent transactions */}
            {recentTx.length > 0 && (
              <div style={{ fontSize: 9, color: '#6B7280', textAlign: 'right' }}>
                {recentTx.slice(0, 2).map((tx, i) => (
                  <div key={i} style={{ color: tx.action === 'buy' ? '#EF4444' : '#10B981' }}>
                    {tx.action === 'buy' ? '▼' : '▲'} {tx.name} {tx.price.toLocaleString()} ⚡
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
          {(['market', 'inventory'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#1F2937' : 'transparent',
                border: activeTab === tab ? '1px solid #374151' : '1px solid transparent',
                color: activeTab === tab ? '#F9FAFB' : '#6B7280',
                padding: '8px 20px', borderRadius: 8,
                fontSize: 11, fontWeight: 800, cursor: 'pointer', letterSpacing: '0.1em',
              }}
            >
              {tab === 'market' ? `🏪 MARKET (${ALL_POKEMON.filter(p => !inInventory(p)).length})` : `🤖 ROSTER (${inventory.length})`}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          background: '#0D0D20', border: '1px solid #1E1E48',
          borderRadius: 12, padding: '12px 16px', marginBottom: 20,
          display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
        }}>
          {/* Search */}
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Pokémon..."
            style={{
              background: '#111827', border: '1px solid #374151',
              borderRadius: 8, padding: '6px 12px',
              color: '#F9FAFB', fontSize: 12, outline: 'none', flex: '1 1 160px',
            }}
          />

          {/* Rarity filter */}
          <select
            value={filterRarity}
            onChange={e => setFilterRarity(e.target.value as FilterRarity)}
            style={{
              background: '#111827', border: '1px solid #374151',
              borderRadius: 8, padding: '6px 10px',
              color: '#F9FAFB', fontSize: 11, outline: 'none', cursor: 'pointer',
            }}
          >
            {(['All', 'Common', 'Rare', 'Epic', 'Legendary'] as const).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            style={{
              background: '#111827', border: '1px solid #374151',
              borderRadius: 8, padding: '6px 10px',
              color: '#F9FAFB', fontSize: 11, outline: 'none', cursor: 'pointer',
            }}
          >
            {availableTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Sort */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#4B5563', fontWeight: 700 }}>SORT:</span>
            {(['overall', 'price', 'pace', 'spatial', 'accuracy'] as SortKey[]).map(key => (
              <button
                key={key}
                onClick={() => toggleSort(key)}
                style={{
                  background: sortBy === key ? '#1F2937' : 'transparent',
                  border: sortBy === key ? '1px solid #374151' : '1px solid transparent',
                  color: sortBy === key ? '#F9FAFB' : '#6B7280',
                  padding: '4px 8px', borderRadius: 6,
                  fontSize: 9, fontWeight: 800, cursor: 'pointer', letterSpacing: '0.08em',
                }}
              >
                {key.toUpperCase()} {sortBy === key ? (sortDir === 'desc' ? '↓' : '↑') : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Market stats bar */}
        {activeTab === 'market' && (
          <div style={{
            display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap',
          }}>
            {Object.entries({ Common: '#9CA3AF', Rare: '#60A5FA', Epic: '#A855F7', Legendary: '#F59E0B' }).map(([rarity, color]) => {
              const count = ALL_POKEMON.filter(p => p.rarity === rarity && !inInventory(p)).length;
              return (
                <div key={rarity} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', borderRadius: 6,
                  background: `${color}11`, border: `1px solid ${color}33`,
                  cursor: 'pointer',
                  opacity: filterRarity === rarity || filterRarity === 'All' ? 1 : 0.4,
                }}
                  onClick={() => setFilterRarity(filterRarity === rarity ? 'All' : rarity as Rarity)}
                >
                  <span style={{ fontSize: 9, color, fontWeight: 800 }}>{rarity.toUpperCase()}</span>
                  <span style={{ fontSize: 12, fontWeight: 900, color }}>{count}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Pokemon grid */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 12,
          minHeight: 200,
        }}>
          <AnimatePresence mode="popLayout">
            {(activeTab === 'market' ? marketList : inventoryList).map((pokemon, idx) => {
              const owned = inInventory(pokemon);
              const team = inTeam(pokemon);
              return (
                <motion.div
                  key={`${pokemon.id}-${pokemon.name}`}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  style={{ position: 'relative' }}
                >
                  <PokemonCard
                    pokemon={pokemon}
                    size="md"
                    selected={team}
                    showPrice
                    onClick={() => setSelectedPokemon(pokemon)}
                  />
                  {/* Owned badge */}
                  {owned && activeTab === 'market' && (
                    <div style={{
                      position: 'absolute', top: 6, left: 6,
                      background: '#10B981', borderRadius: 6,
                      fontSize: 7, fontWeight: 900, color: '#fff',
                      padding: '2px 6px', letterSpacing: '0.08em',
                    }}>
                      OWNED
                    </div>
                  )}
                  {team && (
                    <div style={{
                      position: 'absolute', top: 6, left: 6,
                      background: '#7C3AED', borderRadius: 6,
                      fontSize: 7, fontWeight: 900, color: '#fff',
                      padding: '2px 6px', letterSpacing: '0.08em',
                    }}>
                      IN TEAM
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {(activeTab === 'market' ? marketList : inventoryList).length === 0 && (
            <div style={{
              width: '100%', textAlign: 'center', padding: '60px 20px',
              color: '#4B5563', fontSize: 14,
            }}>
              {activeTab === 'market' ? 'All Logic Drones are in your roster!' : 'No companions in your roster yet.'}
            </div>
          )}
        </div>
      </div>

      {/* Toast notifications */}
      <div style={{
        position: 'fixed', bottom: 80, right: 20,
        display: 'flex', flexDirection: 'column', gap: 8, zIndex: 500,
      }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              style={{
                background: t.type === 'success' ? '#0D1F0D' : '#1F0D0D',
                border: `1px solid ${t.type === 'success' ? '#10B98166' : '#EF444466'}`,
                color: t.type === 'success' ? '#10B981' : '#F87171',
                padding: '10px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                boxShadow: '0 4px 20px #00000088',
                maxWidth: 280,
              }}
            >
              {t.type === 'success' ? '✅' : '❌'} {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedPokemon && (
          <PokemonDetailCard
            pokemon={selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
            onBuy={() => handleBuy(selectedPokemon)}
            onSell={() => handleSell(selectedPokemon)}
            inInventory={inInventory(selectedPokemon)}
            inTeam={inTeam(selectedPokemon)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}