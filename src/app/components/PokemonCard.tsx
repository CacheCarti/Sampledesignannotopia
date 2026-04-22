import React, { useState } from 'react';
import { Pokemon, typeColors, rarityColors, overallRating, getSpriteUrl, ARCHITECTURE_COLORS, ARCH_BADGE } from '../data/pokemon';
import { motion } from 'motion/react';

interface PokemonCardProps {
  pokemon: Pokemon;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
  showPrice?: boolean;
  slot?: number;
  compact?: boolean;
}

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex items-center gap-1">
    <span style={{ color: '#9CA3AF', fontSize: '9px', fontWeight: 700, width: 28, letterSpacing: '0.05em' }}>
      {label}
    </span>
    <div style={{ flex: 1, height: 4, background: '#1F2937', borderRadius: 2, overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        style={{
          height: '100%',
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          borderRadius: 2,
          boxShadow: `0 0 6px ${color}80`,
        }}
      />
    </div>
    <span style={{ color: '#E5E7EB', fontSize: '10px', fontWeight: 800, width: 22, textAlign: 'right' }}>
      {value}
    </span>
  </div>
);

// Slot color map: Q1=cyan, Q2=pink, Q3=amber
const SLOT_COLORS = ['#22D3EE', '#EC4899', '#F59E0B', '#A855F7'];
const SLOT_LABELS = ['Q1', 'Q2', 'Q3', 'Q4'];

export function PokemonCard({ pokemon, size = 'md', selected, onClick, showPrice, slot, compact }: PokemonCardProps) {
  const [flipped, setFlipped] = useState(false);
  const primaryType = pokemon.types[0];
  const colors = typeColors[primaryType] || typeColors.Normal;
  const rarity = rarityColors[pokemon.rarity];
  const overall = overallRating(pokemon.stats);
  const spriteUrl = getSpriteUrl(pokemon.id);
  const arch = ARCHITECTURE_COLORS[pokemon.architecture];
  const archBadge = ARCH_BADGE[pokemon.architecture];

  const cardSizes = {
    sm: { width: 120, height: 170, sprite: 60 },
    md: { width: 160, height: 230, sprite: 88 },
    lg: { width: 200, height: 290, sprite: 110 },
  };
  const s = compact ? cardSizes.sm : cardSizes[size];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setFlipped(f => !f);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      style={{
        width: s.width,
        height: s.height,
        cursor: 'pointer',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Glow on selected */}
      {selected && (
        <div style={{
          position: 'absolute', inset: -3, borderRadius: 14,
          background: `radial-gradient(circle, ${arch.color}55, transparent)`,
          boxShadow: `0 0 20px ${arch.color}88, 0 0 40px ${arch.color}44`,
          zIndex: 0,
        }} />
      )}

      <div style={{
        width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden',
        position: 'relative', zIndex: 1,
        border: selected ? `2px solid ${arch.color}` : `1px solid ${arch.color}44`,
        background: `linear-gradient(160deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)`,
        boxShadow: selected
          ? `0 8px 32px ${arch.color}44, inset 0 1px 0 ${arch.color}44`
          : `0 4px 16px #00000088, inset 0 1px 0 #FFFFFF11`,
      }}>
        {/* Arch gradient top band */}
        <div style={{
          height: compact ? 50 : 70,
          background: `linear-gradient(135deg, ${arch.color}33 0%, ${arch.color}11 100%)`,
          position: 'relative',
          display: 'flex', alignItems: 'flex-start', padding: '6px 8px',
          justifyContent: 'space-between',
        }}>
          {/* Overall rating */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{
              fontSize: compact ? 20 : 28, fontWeight: 900, color: '#FFFFFF',
              lineHeight: 1, textShadow: `0 2px 8px ${arch.color}`,
              fontFamily: 'monospace',
            }}>
              {overall}
            </span>
            <span style={{
              fontSize: 7, fontWeight: 800, color: rarity.color,
              letterSpacing: '0.1em', textShadow: `0 0 8px ${rarity.color}`,
            }}>
              {rarity.label}
            </span>
          </div>

          {/* Slot indicator */}
          {slot !== undefined && (
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: SLOT_COLORS[slot] || '#9CA3AF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, fontWeight: 900, color: '#000',
              boxShadow: `0 0 8px ${SLOT_COLORS[slot] || '#9CA3AF'}`,
              position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
            }}>
              {SLOT_LABELS[slot] || slot + 1}
            </div>
          )}

          {/* Architecture badge (replaces elemental type) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
            <span style={{
              fontSize: 7, fontWeight: 800,
              color: archBadge.text,
              background: archBadge.bg,
              border: `1px solid ${archBadge.border}`,
              padding: '1px 5px', borderRadius: 4,
              letterSpacing: '0.08em',
            }}>
              {arch.icon} {arch.label}
            </span>
          </div>
        </div>

        {/* Sprite */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          height: compact ? 50 : 70, position: 'relative',
          marginTop: compact ? -10 : -14,
        }}>
          <div style={{
            width: s.sprite, height: s.sprite,
            filter: `drop-shadow(0 4px 12px ${arch.color}88)`,
            position: 'relative', zIndex: 2,
          }}>
            <img
              src={spriteUrl}
              alt={pokemon.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          {/* Glow circle behind sprite */}
          <div style={{
            position: 'absolute', width: s.sprite * 0.8, height: s.sprite * 0.8,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${arch.color}22, transparent)`,
            filter: 'blur(8px)',
          }} />
        </div>

        {/* Name */}
        <div style={{
          padding: compact ? '2px 8px' : '4px 10px',
          borderTop: `1px solid ${arch.color}22`,
        }}>
          <div style={{
            fontSize: compact ? 10 : 13, fontWeight: 900, color: '#F9FAFB',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            textShadow: `0 0 12px ${arch.color}66`,
          }}>
            {pokemon.name}
          </div>
          {!compact && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <span style={{
                fontSize: 7, fontWeight: 800, color: arch.color,
                background: arch.bg, padding: '1px 5px', borderRadius: 4,
                letterSpacing: '0.06em',
              }}>
                {arch.label}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        {!compact && (
          <div style={{ padding: '6px 10px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <StatBar label="PAC" value={pokemon.stats.pace} color={arch.color} />
            <StatBar label="VER" value={pokemon.stats.verbal} color={arch.color} />
            <StatBar label="SPA" value={pokemon.stats.spatial} color={arch.color} />
            <StatBar label="ACC" value={pokemon.stats.accuracy} color={arch.color} />
          </div>
        )}

        {/* Price */}
        {showPrice && (
          <div style={{
            padding: '4px 10px',
            borderTop: `1px solid ${arch.color}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontSize: 11, fontWeight: 800,
              color: '#F59E0B',
              textShadow: '0 0 8px #F59E0B88',
            }}>
              ⚡ {pokemon.price.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Full detail modal card
interface PokemonDetailCardProps {
  pokemon: Pokemon;
  onClose: () => void;
  onBuy?: () => void;
  onSell?: () => void;
  inInventory?: boolean;
  inTeam?: boolean;
}

export function PokemonDetailCard({ pokemon, onClose, onBuy, onSell, inInventory, inTeam }: PokemonDetailCardProps) {
  const primaryType = pokemon.types[0];
  const colors = typeColors[primaryType] || typeColors.Normal;
  const rarity = rarityColors[pokemon.rarity];
  const overall = overallRating(pokemon.stats);
  const spriteUrl = getSpriteUrl(pokemon.id);
  const arch = ARCHITECTURE_COLORS[pokemon.architecture];
  const archBadge = ARCH_BADGE[pokemon.architecture];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 40, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.3 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: 360, borderRadius: 20, overflow: 'hidden',
          background: `linear-gradient(160deg, #0B1120 0%, #1A1040 50%, #0B1120 100%)`,
          border: `2px solid ${arch.color}66`,
          boxShadow: `0 0 60px ${arch.color}44, 0 20px 60px #00000088`,
          position: 'relative',
        }}
      >
        {/* Background art */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 30%, ${arch.color}18, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${arch.color}44, ${arch.color}22)`,
          padding: '20px 24px 0',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#fff', lineHeight: 1, fontFamily: 'monospace' }}>
                {overall}
              </div>
              <div style={{
                fontSize: 11, fontWeight: 800, color: rarity.color,
                letterSpacing: '0.15em', textShadow: `0 0 12px ${rarity.color}`,
              }}>
                ★ {rarity.label}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
              {/* Architecture badge — primary identity */}
              <span style={{
                fontSize: 12, fontWeight: 900, color: archBadge.text,
                background: archBadge.bg, padding: '4px 12px', borderRadius: 20,
                letterSpacing: '0.1em', border: `1px solid ${archBadge.border}`,
              }}>
                {arch.icon} {arch.label}
              </span>
              <span style={{
                fontSize: 9, fontWeight: 700, color: '#6B7280',
                background: '#1F2937', padding: '2px 8px', borderRadius: 10,
                letterSpacing: '0.08em',
              }}>
                AI ARCHITECTURE
              </span>
            </div>
          </div>

          {/* Sprite */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <motion.img
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              src={spriteUrl}
              alt={pokemon.name}
              style={{
                width: 140, height: 140, objectFit: 'contain',
                filter: `drop-shadow(0 8px 24px ${arch.color}99)`,
              }}
            />
          </div>
        </div>

        {/* Name & ability */}
        <div style={{ padding: '12px 24px 0', borderTop: `1px solid ${arch.color}33` }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#F9FAFB', letterSpacing: '0.08em' }}>
            {pokemon.name.toUpperCase()}
          </div>
          <div style={{ fontSize: 12, color: arch.color, fontWeight: 700, marginTop: 2 }}>
            ⚡ {pokemon.ability}
          </div>
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 6, fontStyle: 'italic', lineHeight: 1.5 }}>
            {pokemon.description}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ padding: '14px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
            {[
              { key: 'pace', label: 'PACE', val: pokemon.stats.pace, icon: '💨' },
              { key: 'verbal', label: 'VERBAL', val: pokemon.stats.verbal, icon: '💬' },
              { key: 'spatial', label: 'SPATIAL', val: pokemon.stats.spatial, icon: '📐' },
              { key: 'accuracy', label: 'ACCURACY', val: pokemon.stats.accuracy, icon: '🎯' },
            ].map(stat => (
              <div key={stat.key} style={{
                background: `${arch.color}11`,
                borderRadius: 10, padding: '10px 12px',
                border: `1px solid ${arch.color}22`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 18 }}>{stat.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#F9FAFB', lineHeight: 1 }}>
                  {stat.val}
                </div>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#6B7280', letterSpacing: '0.12em', marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price & actions */}
        <div style={{
          padding: '12px 24px 20px',
          borderTop: `1px solid ${arch.color}22`,
          display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>TRANSFER VALUE</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#F59E0B', textShadow: '0 0 12px #F59E0B88' }}>
              ⚡ {pokemon.price.toLocaleString()}
            </div>
          </div>
          {onBuy && !inInventory && (
            <button onClick={onBuy} style={{
              background: `linear-gradient(135deg, #10B981, #059669)`,
              color: '#fff', fontWeight: 800, fontSize: 12,
              padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              letterSpacing: '0.05em',
            }}>
              ACQUIRE
            </button>
          )}
          {onSell && inInventory && !inTeam && (
            <button onClick={onSell} style={{
              background: `linear-gradient(135deg, #EF4444, #B91C1C)`,
              color: '#fff', fontWeight: 800, fontSize: 12,
              padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              letterSpacing: '0.05em',
            }}>
              TRANSFER
            </button>
          )}
          <button onClick={onClose} style={{
            background: '#1F2937', color: '#9CA3AF', fontWeight: 700, fontSize: 12,
            padding: '10px 16px', borderRadius: 10, border: '1px solid #374151', cursor: 'pointer',
          }}>
            CLOSE
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}