"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isFinished, setIsFinished] = useState(false);

  // HYPER-PRECISE CONTINUOUS PATH (MEXICO 86 STYLE)
  // Designed to match the sketch's flow and vehicle-path logic
  const MASTER_PATH = 
    "M 10 150 L 35 40 L 65 115 L 95 40 L 120 150 " + // M (Rose)
    "C 120 150, 185 150, 185 105 C 185 60, 120 60, 120 105 C 120 150, 185 150, 205 150 " + // O (Yellow/Orange)
    "M 175 60 L 255 60 M 215 60 L 215 150 " + // T (Cyan)
    "L 260 60 L 260 115 C 260 145, 310 145, 310 115 L 310 60 " + // U (Green)
    "M 320 60 C 365 60, 365 100, 340 105 C 315 110, 315 150, 360 150"; // S (Blue)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFinished(true);
      setTimeout(onComplete, 2000);
    }, 6000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#020202] flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Background Depth & Texture */}
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#111_0%,_#000_100%)]" />
      
      {/* Professional Reflection Halo */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            className="absolute inset-0 bg-white/5 blur-[150px] rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* MEXICO 86 NEON LOGO RECREATION */}
      <div className="relative w-full max-w-5xl px-8 sm:px-16 flex items-center justify-center -mt-10">
        <svg 
          viewBox="0 30 370 140" 
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="neonGradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF2D55" />
              <stop offset="20%" stopColor="#FF9F0A" />
              <stop offset="45%" stopColor="#32ADE6" />
              <stop offset="70%" stopColor="#34C759" />
              <stop offset="100%" stopColor="#007AFF" />
            </linearGradient>

            <filter id="neon-bloom" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur stdDeviation="3" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* LAYER 1: 18px - OUTER NEON TUBE (Boundary) */}
          <motion.path
            d={MASTER_PATH}
            fill="none"
            stroke="url(#neonGradientLine)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 5.5, ease: "linear" }}
            style={{ filter: "blur(12px) opacity(0.3)" }}
          />

          {/* LAYER 2: 18px - OUTER TUBE PHYSICAL */}
          <motion.path
            d={MASTER_PATH}
            fill="none"
            stroke="url(#neonGradientLine)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5.5, ease: "linear" }}
          />

          {/* LAYER 3: 14px - BLACK GAP (Masking for 2 lanes) */}
          <motion.path
            d={MASTER_PATH}
            fill="none"
            stroke="#020202"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5.5, ease: "linear" }}
          />

          {/* LAYER 4: 10px - INTERMEDIATE LINE (THE ONE CENTRAL LINE) */}
          <motion.path
            d={MASTER_PATH}
            fill="none"
            stroke="url(#neonGradientLine)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5.5, ease: "linear" }}
          />

          {/* LAYER 5: 6px - BLACK GAP (Inner Road) */}
          <motion.path
            d={MASTER_PATH}
            fill="none"
            stroke="#020202"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5.5, ease: "linear" }}
          />

          {/* LAYER 6: 2px - CORE NEON GLOW */}
          <motion.path
            d={MASTER_PATH}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="butt"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0, 1] }}
            transition={{ 
              pathLength: { duration: 5.5, ease: "linear" },
              opacity: { times: [0, 0.9, 1], duration: 6 }
            }}
          />
        </svg>
      </div>

      {/* Status HUD */}
      <motion.div 
        className="absolute bottom-20 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            SISTEMA DE MOVILIDAD OPERATIVO
        </span>
        <div className="h-0.5 w-[200px] bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 5.5, ease: "linear" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
