import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getSpriteUrl, ARCHITECTURE_COLORS, AIArchitecture } from '../data/pokemon';
import { PetLearningIndicator } from './PetLearningIndicator';

type MoodState = 'idle' | 'thinking' | 'excited' | 'focused' | 'celebrating';
type ActivityState = 'observing' | 'writing' | 'analyzing' | 'confused';

interface Props {
  pokemonId: number;
  pokemonName: string;
  architecture: AIArchitecture;
  onAnnotation?: number; // timestamp of last annotation
  cardPlayed?: number; // timestamp of last card played
  trustScore: number;
}

export function LivePetCompanion({ pokemonId, pokemonName, architecture, onAnnotation, cardPlayed, trustScore }: Props) {
  const [mood, setMood] = useState<MoodState>('idle');
  const [activity, setActivity] = useState<ActivityState>('observing');
  const [thoughtBubbles, setThoughtBubbles] = useState<string[]>([]);
  const [eyeState, setEyeState] = useState<'open' | 'blink' | 'focused'>('open');
  const [notesTaken, setNotesTaken] = useState(0);

  const arch = ARCHITECTURE_COLORS[architecture];

  // Random idle behaviors (blinks, subtle movements)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (mood === 'idle' || mood === 'thinking') {
        setEyeState('blink');
        setTimeout(() => setEyeState('open'), 150);
      }
    }, 3000 + Math.random() * 4000);

    const activityCycle = setInterval(() => {
      if (mood === 'idle') {
        const activities: ActivityState[] = ['observing', 'analyzing', 'writing'];
        setActivity(activities[Math.floor(Math.random() * activities.length)]);
      }
    }, 4000 + Math.random() * 3000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(activityCycle);
    };
  }, [mood]);

  // React to annotations
  useEffect(() => {
    if (onAnnotation && onAnnotation > 0) {
      setMood('excited');
      setActivity('writing');
      setNotesTaken(n => n + 1);

      const thoughts = [
        'Got it! 📝',
        'Interesting pattern...',
        'Cross-referencing...',
        'Noted! ✓',
        'Learning from this!',
        'Ah, I see!',
        'Recording observation',
        'Pattern detected!',
      ];
      setThoughtBubbles([thoughts[Math.floor(Math.random() * thoughts.length)]]);

      setTimeout(() => {
        setMood('thinking');
        setTimeout(() => {
          setMood('idle');
          setThoughtBubbles([]);
        }, 1200);
      }, 800);
    }
  }, [onAnnotation]);

  // React to card plays
  useEffect(() => {
    if (cardPlayed && cardPlayed > 0) {
      setMood('focused');
      setEyeState('focused');
      setActivity('analyzing');
      setThoughtBubbles(['Powering up! ⚡']);

      setTimeout(() => {
        setMood('idle');
        setEyeState('open');
        setThoughtBubbles([]);
      }, 1800);
    }
  }, [cardPlayed]);

  // Celebrate high trust scores
  useEffect(() => {
    if (trustScore > 80 && trustScore % 10 === 0) {
      setMood('celebrating');
      setThoughtBubbles(['We\'re doing great! 🌟']);
      setTimeout(() => {
        setMood('idle');
        setThoughtBubbles([]);
      }, 2000);
    }
  }, [trustScore]);

  const bobAnimation = mood === 'idle'
    ? { y: [0, -3, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }
    : mood === 'excited'
    ? { y: [0, -8, 0], scale: [1, 1.05, 1], transition: { duration: 0.5 } }
    : mood === 'thinking'
    ? { rotate: [-2, 2, -2], transition: { duration: 1.5, repeat: Infinity } }
    : mood === 'focused'
    ? { scale: [1, 1.08, 1.08], transition: { duration: 0.4 } }
    : { scale: [1, 1.1, 1], y: [0, -10, 0], transition: { duration: 0.6 } };

  // Calculate learning intensity based on activity
  const learningIntensity = activity === 'writing' ? 0.9
    : activity === 'analyzing' ? 0.8
    : activity === 'observing' ? 0.5
    : 0.3;

  return (
    <div style={{
      background: `radial-gradient(circle at 40% 30%, ${arch.color}55, #0a1a12)`,
      border: `2px solid ${arch.color}66`,
      borderRadius: 12,
      padding: 12,
      position: 'relative',
      overflow: 'visible',
    }}>
      {/* Thought bubbles */}
      <AnimatePresence>
        {thoughtBubbles.map((thought, i) => (
          <motion.div
            key={`${thought}-${i}`}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -60, scale: 1 }}
            exit={{ opacity: 0, y: -80 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              top: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255,255,255,0.95)',
              color: '#1a0f05',
              padding: '6px 12px',
              borderRadius: 12,
              fontSize: 11,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 10,
            }}>
            {thought}
            {/* Speech bubble tail */}
            <div style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(255,255,255,0.95)',
            }} />
          </motion.div>
        ))}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', position: 'relative' }}>
        {/* Animated sprite container */}
        <motion.div
          animate={bobAnimation}
          style={{
            width: 70,
            height: 70,
            borderRadius: 10,
            background: `radial-gradient(circle at 40% 30%, ${arch.color}77, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
          {/* Glow effect when focused */}
          {(mood === 'focused' || mood === 'excited') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                position: 'absolute',
                inset: -4,
                borderRadius: 12,
                background: `radial-gradient(circle, ${arch.color}88, transparent)`,
                filter: 'blur(8px)',
              }} />
          )}

          <motion.img
            src={getSpriteUrl(pokemonId)}
            style={{
              width: 62,
              height: 62,
              imageRendering: 'pixelated',
              filter: eyeState === 'blink' ? 'brightness(0.8)' : 'brightness(1)',
            }}
            animate={eyeState === 'focused' ? { scale: [1, 1.1, 1.1] } : {}}
            transition={{ duration: 0.3 }}
          />

          {/* Activity indicator */}
          <PetLearningIndicator
            activity={activity}
            archColor={arch.color}
            intensity={learningIntensity}
          />
        </motion.div>

        {/* Info section */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, color: arch.color, fontWeight: 800, letterSpacing: '0.18em' }}>
            {arch.label}
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', lineHeight: 1.05 }}>
            {pokemonName}
          </div>
          <div style={{ fontSize: 9, color: '#8ba5a0', letterSpacing: '0.15em', marginTop: 2 }}>
            {activity === 'writing' && '📝 TAKING NOTES'}
            {activity === 'observing' && '👁️ OBSERVING SCENE'}
            {activity === 'analyzing' && '🔬 ANALYZING PATTERNS'}
            {activity === 'confused' && '🤔 PUZZLING THIS OUT'}
          </div>

          {/* Learning progress indicator */}
          {notesTaken > 0 && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              style={{
                marginTop: 4,
                fontSize: 8,
                color: '#8de0b0',
                fontWeight: 700,
                letterSpacing: '0.1em',
              }}>
              📚 {notesTaken} NOTE{notesTaken !== 1 ? 'S' : ''} LOGGED
            </motion.div>
          )}
        </div>
      </div>

      {/* Ambient particles when thinking/learning */}
      <AnimatePresence>
        {(mood === 'thinking' || mood === 'excited') && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, x: -10 + i * 10 }}
                animate={{
                  opacity: [0, 0.6, 0],
                  y: -30,
                  x: -10 + i * 10 + (Math.random() - 0.5) * 20,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
                style={{
                  position: 'absolute',
                  bottom: 30,
                  left: 35,
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: arch.color,
                  boxShadow: `0 0 8px ${arch.color}`,
                  pointerEvents: 'none',
                }} />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LivePetCompanion;
