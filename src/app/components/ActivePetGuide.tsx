import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getSpriteUrl, ARCHITECTURE_COLORS, AIArchitecture } from '../data/pokemon';

type AnimationState = 'idle' | 'moving' | 'taking_notes' | 'confused' | 'focused' | 'dazed' | 'happy' | 'celebrating';

interface Props {
  pokemonId: number;
  pokemonName: string;
  architecture: AIArchitecture;
  canvasRect: DOMRect | null;
  lastClickPos: { x: number; y: number } | null; // percentage-based position
  onAnnotation?: number;
  trustScore: number;
}

export function ActivePetGuide({
  pokemonId,
  pokemonName,
  architecture,
  canvasRect,
  lastClickPos,
  onAnnotation,
  trustScore
}: Props) {
  const [position, setPosition] = useState({ x: 50, y: 20 }); // percentage from canvas top-left
  const [animState, setAnimState] = useState<AnimationState>('idle');
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isThinking, setIsThinking] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; type: string }>>([]);
  const particleIdRef = useRef(0);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const [eyeDirection, setEyeDirection] = useState<'forward' | 'up' | 'down'>('forward');

  const arch = ARCHITECTURE_COLORS[architecture];

  // Random eye movements when idle
  useEffect(() => {
    if (animState === 'idle') {
      const eyeMovement = setInterval(() => {
        const directions: Array<'forward' | 'up' | 'down'> = ['forward', 'up', 'down', 'forward'];
        setEyeDirection(directions[Math.floor(Math.random() * directions.length)]);
      }, 2000 + Math.random() * 3000);

      return () => clearInterval(eyeMovement);
    } else {
      setEyeDirection('forward');
    }
  }, [animState]);

  // Auto-patrol when idle - circle around the edges
  useEffect(() => {
    if (animState === 'idle' && !lastClickPos) {
      let angle = 0;
      const patrol = setInterval(() => {
        angle += 0.3;
        const centerX = 50;
        const centerY = 50;
        const radiusX = 35;
        const radiusY = 30;

        setPosition({
          x: centerX + Math.cos(angle) * radiusX,
          y: centerY + Math.sin(angle) * radiusY,
        });

        // Face direction of movement
        setFacing(Math.cos(angle) > 0 ? 'right' : 'left');
      }, 2000);

      return () => clearInterval(patrol);
    }
  }, [animState, lastClickPos]);

  // React to clicks - move toward click position
  useEffect(() => {
    if (lastClickPos && canvasRect) {
      setAnimState('moving');

      // Move to near the click position
      const targetX = lastClickPos.x;
      const targetY = lastClickPos.y;

      // Determine which side to approach from
      const shouldFaceRight = targetX > position.x;
      setFacing(shouldFaceRight ? 'right' : 'left');

      // Move to hover near the click
      const offsetX = shouldFaceRight ? -15 : 15; // Stay to the side
      const offsetY = -10;

      setPosition({
        x: Math.max(5, Math.min(95, targetX + offsetX)),
        y: Math.max(5, Math.min(95, targetY + offsetY)),
      });

      // After moving, show focus state
      setTimeout(() => {
        setAnimState('focused');
        setIsThinking(true);

        // Then take notes
        setTimeout(() => {
          setAnimState('taking_notes');

          // Spawn note particles
          const noteTypes = ['📝', '📋', '✏️'];
          for (let i = 0; i < 4; i++) {
            setTimeout(() => {
              setParticles(prev => [...prev, {
                id: particleIdRef.current++,
                x: position.x,
                y: position.y,
                type: noteTypes[Math.floor(Math.random() * noteTypes.length)]
              }]);
            }, i * 150);
          }

          // Clean up particles
          setTimeout(() => {
            setParticles([]);
          }, 1500);

          // Show happy after notes
          setTimeout(() => {
            setAnimState('happy');
            setIsThinking(false);

            // Spawn happy stars
            for (let i = 0; i < 3; i++) {
              setTimeout(() => {
                setParticles(prev => [...prev, {
                  id: particleIdRef.current++,
                  x: position.x + (Math.random() - 0.5) * 10,
                  y: position.y - 8,
                  type: '✨'
                }]);
              }, i * 150);
            }

            setTimeout(() => {
              setAnimState('idle');
              setParticles([]);
            }, 1200);
          }, 1200);
        }, 600);
      }, 500);
    }
  }, [lastClickPos, canvasRect]);

  // Celebrate high trust
  useEffect(() => {
    if (trustScore > 0 && trustScore % 20 === 0 && trustScore > 60) {
      setAnimState('celebrating');

      // Spawn confetti
      const colors = ['#f5a742', '#8de0b0', '#b879ff', '#22d3ee'];
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          setConfetti(prev => [...prev, {
            id: particleIdRef.current++,
            x: position.x + (Math.random() - 0.5) * 20,
            y: position.y - 10,
            color: colors[Math.floor(Math.random() * colors.length)]
          }]);
        }, i * 80);
      }

      setTimeout(() => {
        setAnimState('idle');
        setConfetti([]);
      }, 1500);
    }
  }, [trustScore, position.x, position.y]);

  // Random confusion states
  useEffect(() => {
    const confusionCheck = setInterval(() => {
      if (animState === 'idle' && Math.random() < 0.15) {
        setAnimState('confused');

        // Spawn confusion marks
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            setParticles(prev => [...prev, {
              id: particleIdRef.current++,
              x: position.x,
              y: position.y - 10,
              type: '❓'
            }]);
          }, i * 200);
        }

        setTimeout(() => {
          setAnimState('idle');
          setParticles([]);
        }, 1500);
      }
    }, 8000);

    return () => clearInterval(confusionCheck);
  }, [animState, position.x, position.y]);

  if (!canvasRect) return null;

  // Get sprite scale and animation based on state
  const getSpriteAnimation = () => {
    switch (animState) {
      case 'moving':
        return {
          y: [0, -4, 0],
          transition: { duration: 0.3, repeat: Infinity },
        };
      case 'taking_notes':
        return {
          rotate: [0, -8, 8, -8, 0],
          y: [0, -2, 0],
          transition: { duration: 0.4, repeat: 3 },
        };
      case 'confused':
        return {
          rotate: [-10, 10, -10, 10, 0],
          transition: { duration: 0.5, repeat: 2 },
        };
      case 'focused':
        return {
          scale: [1, 1.1, 1.1],
          transition: { duration: 0.3 },
        };
      case 'dazed':
        return {
          rotate: [5, -5, 5, -5, 0],
          opacity: [1, 0.7, 1],
          transition: { duration: 0.8, repeat: 2 },
        };
      case 'happy':
      case 'celebrating':
        return {
          y: [0, -12, 0],
          scale: [1, 1.15, 1],
          transition: { duration: 0.5, repeat: 2 },
        };
      default: // idle
        return {
          y: [0, -3, 0],
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        };
    }
  };

  const getStateEmoji = () => {
    switch (animState) {
      case 'taking_notes': return '📝';
      case 'confused': return '❓';
      case 'focused': return '🔍';
      case 'dazed': return '💫';
      case 'happy': return '✨';
      case 'celebrating': return '🎉';
      default: return null;
    }
  };

  return (
    <>
      {/* Pet positioned around the canvas */}
      <motion.div
        animate={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
        transition={{
          type: 'spring',
          stiffness: 60,
          damping: 15,
          mass: 0.8,
        }}
        style={{
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          zIndex: 100,
          pointerEvents: 'none',
        }}>

        {/* Shadow under pet */}
        <motion.div
          animate={{
            scaleX: animState === 'happy' || animState === 'celebrating' ? 0.7 : 1,
            opacity: animState === 'happy' || animState === 'celebrating' ? 0.3 : 0.5,
          }}
          style={{
            position: 'absolute',
            bottom: -15,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 50,
            height: 15,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.4), transparent)',
            filter: 'blur(4px)',
          }} />

        {/* Spotlight under pet */}
        <motion.div
          animate={{
            opacity: animState === 'focused' || animState === 'taking_notes' ? 0.6 : 0.2,
            scale: animState === 'focused' ? 1.4 : 1,
          }}
          style={{
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 80,
            height: 40,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${arch.color}66, transparent)`,
            filter: 'blur(12px)',
          }} />

        {/* Pet sprite with animations */}
        <motion.div
          animate={getSpriteAnimation()}
          style={{
            position: 'relative',
            width: 64,
            height: 64,
            filter: animState === 'dazed' ? 'blur(1px)' : 'none',
          }}>

          {/* Glow effects */}
          {(animState === 'focused' || animState === 'taking_notes') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{
                position: 'absolute',
                inset: -8,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${arch.color}, transparent)`,
                filter: 'blur(10px)',
              }} />
          )}

          <motion.img
            src={getSpriteUrl(pokemonId)}
            animate={{
              y: eyeDirection === 'up' ? -2 : eyeDirection === 'down' ? 2 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{
              width: '100%',
              height: '100%',
              imageRendering: 'pixelated',
              transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
              filter: animState === 'celebrating' ? 'brightness(1.3)' : 'brightness(1)',
            }}
            alt={pokemonName}
          />

          {/* State emoji indicator */}
          <AnimatePresence>
            {getStateEmoji() && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.5 }}
                animate={{ opacity: 1, y: -10, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 20,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}>
                {getStateEmoji()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thinking bubbles */}
          {isThinking && (
            <div style={{ position: 'absolute', top: -30, right: -30 }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 1], scale: [0, 1, 1] }}
                  transition={{ delay: i * 0.15, duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    bottom: i * 12,
                    right: i * 6,
                    width: 6 + i * 3,
                    height: 6 + i * 3,
                    borderRadius: '50%',
                    background: '#fff',
                    border: '2px solid #2e3a3d',
                  }} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Movement trail */}
        {animState === 'moving' && (
          <>
            <motion.div
              initial={{ opacity: 0.6, scale: 0.8 }}
              animate={{ opacity: 0, scale: 2.5 }}
              transition={{ duration: 0.8 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: `3px solid ${arch.color}`,
                boxShadow: `0 0 15px ${arch.color}`,
              }} />
            <motion.div
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 20,
                filter: 'blur(2px)',
              }}>
              💨
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Note particles that fly up when taking notes */}
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            initial={{
              opacity: 1,
              scale: 1,
              x: `${particle.x}%`,
              y: `${particle.y}%`,
            }}
            animate={{
              opacity: 0,
              scale: 0.3,
              y: `${particle.y - 20}%`,
              x: `${particle.x + (Math.random() - 0.5) * 10}%`,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{
              position: 'absolute',
              fontSize: 16,
              pointerEvents: 'none',
              zIndex: 99,
            }}>
            {particle.type}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Confetti when celebrating */}
      <AnimatePresence>
        {confetti.map(piece => (
          <motion.div
            key={piece.id}
            initial={{
              opacity: 1,
              scale: 1,
              x: `${piece.x}%`,
              y: `${piece.y}%`,
              rotate: 0,
            }}
            animate={{
              opacity: 0,
              y: `${piece.y + 30 + Math.random() * 20}%`,
              x: `${piece.x + (Math.random() - 0.5) * 30}%`,
              rotate: Math.random() * 720 - 360,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              background: piece.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '0%',
              pointerEvents: 'none',
              zIndex: 99,
            }} />
        ))}
      </AnimatePresence>

      {/* Target indicator at click location */}
      {lastClickPos && animState === 'moving' && (
        <motion.div
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: [0.6, 0], scale: [1.5, 2.5] }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'absolute',
            left: `${lastClickPos.x}%`,
            top: `${lastClickPos.y}%`,
            transform: 'translate(-50%, -50%)',
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: `3px solid ${arch.color}`,
            pointerEvents: 'none',
          }} />
      )}

      {/* Arrow pointing to target when moving */}
      {animState === 'moving' && lastClickPos && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: 24,
            color: arch.color,
            pointerEvents: 'none',
          }}>
          ➜
        </motion.div>
      )}
    </>
  );
}

export default ActivePetGuide;
