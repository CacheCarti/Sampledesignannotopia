import React from 'react';
import { motion } from 'motion/react';

interface Props {
  activity: 'observing' | 'writing' | 'analyzing' | 'confused';
  archColor: string;
  intensity?: number; // 0-1 scale
}

export function PetLearningIndicator({ activity, archColor, intensity = 0.7 }: Props) {
  const getActivityIcon = () => {
    switch (activity) {
      case 'writing': return '✍️';
      case 'observing': return '👁️';
      case 'analyzing': return '🔍';
      case 'confused': return '🤔';
    }
  };

  const getActivityLabel = () => {
    switch (activity) {
      case 'writing': return 'TAKING NOTES';
      case 'observing': return 'OBSERVING';
      case 'analyzing': return 'ANALYZING';
      case 'confused': return 'PUZZLING';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: 'absolute',
        bottom: -6,
        right: -6,
        background: archColor,
        color: '#001018',
        borderRadius: '50%',
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        boxShadow: `0 2px 6px rgba(0,0,0,0.4), 0 0 ${12 * intensity}px ${archColor}`,
        border: '2px solid #0a1a12',
      }}>
      <motion.div
        animate={{
          rotate: activity === 'analyzing' ? [0, 360] : 0,
          scale: activity === 'writing' ? [1, 1.1, 1] : 1,
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
          scale: { duration: 0.6, repeat: Infinity },
        }}>
        {getActivityIcon()}
      </motion.div>

      {/* Pulse ring for high activity */}
      {intensity > 0.6 && (
        <motion.div
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            border: `2px solid ${archColor}`,
            pointerEvents: 'none',
          }} />
      )}
    </motion.div>
  );
}

export default PetLearningIndicator;
