import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

const FEATURES = [
  { icon: '📋', title: 'Review Annotations', desc: 'Audit submitted annotations from other players and flag errors or confirm correctness.' },
  { icon: '🗝️', title: 'Answer Key Access', desc: 'Access ground truth labels and compare against player submissions in real time.' },
  { icon: '⚡', title: 'Consensus Voting', desc: 'Cast votes on disputed annotations. High consensus = higher data quality score.' },
  { icon: '💰', title: 'Reviewer Rewards', desc: 'Earn coins for accurate reviews. Your ratings affect player leaderboard standings.' },
  { icon: '🔬', title: 'Quality Metrics', desc: 'See inter-annotator agreement, recall and precision scores per image batch.' },
  { icon: '🤖', title: 'AI Audit Mode', desc: 'Compare your reviews against AI-generated labels to train your own detection sense.' },
];

export function ReviewerMode() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', background: '#060610', color: '#F9FAFB',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: 740, width: '100%' }}>
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ textAlign: 'center', marginBottom: 36 }}
        >
          <div style={{ fontSize: 64, marginBottom: 12 }}>📋</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#F59E0B22', border: '1px solid #F59E0B44',
            borderRadius: 20, padding: '6px 18px', marginBottom: 16,
          }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#F59E0B', letterSpacing: '0.2em' }}>
              COMING SOON
            </span>
          </div>
          <h1 style={{
            fontSize: 36, fontWeight: 900, letterSpacing: '0.08em', margin: '0 0 12px',
            background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            REVIEWER MODE
          </h1>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, maxWidth: 520, margin: '0 auto' }}>
            Become a <span style={{ color: '#F59E0B', fontWeight: 800 }}>Quality Arbitrator</span> — 
            audit player annotations, enforce ground truth standards, and earn coins for accurate reviews.
            This mode flips the script: you judge the data, not just annotate it.
          </p>
        </motion.div>

        {/* Features grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 36 }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              style={{
                background: '#0D0D20', border: '1px solid #F59E0B22',
                borderRadius: 12, padding: '18px 16px',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#F59E0B', letterSpacing: '0.08em', marginBottom: 6 }}>
                {f.title}
              </div>
              <p style={{ fontSize: 11, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Waitlist CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, #F59E0B11, #0D0D20)',
            border: '1px solid #F59E0B33',
            borderRadius: 16, padding: '28px 32px', textAlign: 'center', marginBottom: 28,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, color: '#F59E0B', marginBottom: 8, letterSpacing: '0.06em' }}>
            🔒 LOCKED — In Development
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 20px', lineHeight: 1.7 }}>
            Reviewer Mode launches with the next major update. Complete Standard missions to unlock early access.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              onClick={() => navigate('/battle')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#000', fontWeight: 900, fontSize: 13,
                padding: '12px 28px', borderRadius: 10, border: 'none',
                cursor: 'pointer', letterSpacing: '0.1em',
                boxShadow: '0 0 20px #F59E0B66',
              }}
            >
              🎯 PLAY MISSIONS FIRST
            </motion.button>
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'transparent', color: '#6B7280', fontWeight: 700, fontSize: 13,
                padding: '12px 24px', borderRadius: 10,
                border: '1px solid #374151', cursor: 'pointer',
              }}
            >
              ← Back to Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
