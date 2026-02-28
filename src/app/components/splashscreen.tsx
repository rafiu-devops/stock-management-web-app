import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0d1117',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* ── Background glows ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 38%, rgba(59,143,255,0.13) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(59,143,255,0.06) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Subtle grid dots pattern ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(48,54,61,0.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
          opacity: 0.4,
        }}
      />

      {/* ── Logo ── */}
      <motion.div
        initial={{ scale: 0.45, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          damping: 18,
          stiffness: 130,
          delay: 0.1,
        }}
        style={{ position: 'relative', marginBottom: 36 }}
      >
        {/* Pulse ring 1 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.85, 1.5], opacity: [0.45, 0] }}
          transition={{
            duration: 1.6,
            delay: 0.55,
            repeat: Infinity,
            repeatDelay: 0.6,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            inset: -10,
            borderRadius: '36px',
            border: '1.5px solid rgba(59,143,255,0.45)',
            pointerEvents: 'none',
          }}
        />

        {/* Pulse ring 2 (offset) */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.85, 1.8], opacity: [0.25, 0] }}
          transition={{
            duration: 1.6,
            delay: 0.85,
            repeat: Infinity,
            repeatDelay: 0.6,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            inset: -10,
            borderRadius: '36px',
            border: '1px solid rgba(59,143,255,0.25)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo card */}
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: '32px',
            background:
              'linear-gradient(145deg, rgba(59,143,255,0.22) 0%, rgba(59,143,255,0.07) 100%)',
            border: '1.5px solid rgba(88,166,255,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow:
              '0 0 48px rgba(59,143,255,0.2), 0 0 96px rgba(59,143,255,0.08), inset 0 1px 0 rgba(255,255,255,0.07)',
          }}
        >
          {/* Inner icon glow */}
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Droplets size={56} color="#58a6ff" strokeWidth={1.4} />
          </motion.div>
        </div>
      </motion.div>

      {/* ── App name ── */}
      <motion.h1
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
        style={{
          color: '#e6edf3',
          fontSize: '27px',
          fontWeight: 700,
          margin: 0,
          letterSpacing: '-0.4px',
          lineHeight: 1.2,
          textAlign: 'center',
        }}
      >
        Oil & Grease Exchange
      </motion.h1>

      {/* ── Tagline ── */}
      <motion.p
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{
          color: '#8b949e',
          fontSize: '14px',
          margin: '8px 0 0',
          letterSpacing: '0.2px',
          textAlign: 'center',
        }}
      >
        Shop Management System
      </motion.p>

      {/* ── Animated separator ── */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 48, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        style={{
          height: 1,
          background:
            'linear-gradient(to right, transparent, rgba(88,166,255,0.5), transparent)',
          marginTop: 22,
          marginBottom: 18,
        }}
      />

      {/* ── Pulsing dots (loading indicator) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.3 }}
        style={{ display: 'flex', gap: 7, alignItems: 'center' }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1, 0.8] }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#3b8fff',
            }}
          />
        ))}
      </motion.div>

      {/* ── Version tag ── */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.4 }}
        style={{
          position: 'absolute',
          bottom: 32,
          color: '#484f58',
          fontSize: '11px',
          letterSpacing: '0.4px',
        }}
      >
        v1.0.0
      </motion.span>

      {/* ── Progress bar (bottom) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'rgba(48,54,61,0.5)',
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.4, delay: 0.25, ease: [0.4, 0, 0.6, 1] }}
          style={{
            height: '100%',
            background:
              'linear-gradient(to right, #1f6feb, #3b8fff, #58a6ff)',
            boxShadow: '0 0 8px rgba(88,166,255,0.6)',
            borderRadius: '0 2px 2px 0',
          }}
        />
      </div>
    </motion.div>
  );
}
