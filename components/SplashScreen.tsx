"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isFinished, setIsFinished] = useState(false);

  // PRECISE CONTINUOUS PATH (M-O-T-U-S)
  const MASTER_PATH = 
    "M 15 140 L 35 40 L 55 110 L 75 40 L 95 140 " + // M
    "C 95 80, 155 80, 155 120 C 155 160, 95 160, 95 120 C 95 100, 145 90, 175 90 " + // O
    "L 215 90 M 195 90 L 195 140 " + // T
    "L 235 90 L 235 120 A 25 25 0 0 0 285 120 L 285 90 " + // U
    "L 345 90 C 315 90, 315 115, 330 115 C 345 115, 345 140, 315 140"; // S

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFinished(true);
      setTimeout(onComplete, 1800);
    }, 5500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#020202] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Depth */}
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#111_0%,_#000_100%)] opacity-50" />
      
      {/* Dynamic Ambient Reflections */}
      <motion.div 
        animate={{ opacity: isFinished ? 0.3 : 0.05 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)] transition-opacity duration-1000"
      />

      {/* CONTINUOUS NEON MASTER LOGO */}
      <div className="relative w-full max-w-4xl px-4 sm:px-12 flex items-center justify-center -mt-10">
        <svg 
          viewBox="0 25 360 150" 
          className="w-full h-auto overflow-visible select-none drop-shadow-2xl"
        >
          <defs>
            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF2D55" />
              <stop offset="25%" stopColor="#FF9F0A" />
              <stop offset="50%" stopColor="#32ADE6" />
              <stop offset="75%" stopColor="#34C759" />
              <stop offset="100%" stopColor="#007AFF" />
            </linearGradient>
            
            <filter id="real-neon" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur1" />
              <feGaussianBlur stdDeviation="4" result="blur2" />
              <feGaussianBlur stdDeviation="12" result="blur3" />
              <feMerge>
                <feMergeNode in="blur3" />
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* LAYER 1: Ultra-Soft Ambient Glow */}
          <motion.path
            d={MASTER_PATH}
            fill="none"
            stroke="url(#neonGradient)"
            strokeWidth="30"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.1 }}
            transition={{ duration: 5, ease: "linear" }}
            style={{ filter: "blur(30px)" }}
          />

          {/* LAYER 2: Primary Neon Halo */}
          <motion.path
            d={MASTER_PATH}
            fill="none"
            stroke="url(#neonGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 5, ease: "linear" }}
            style={{ filter: "blur(8px)" }}
          />

          {/* LAYER 3: Outer Shell (The Road Sides) */}
          <motion.path
            d={MASTER_PATH}
            fill="none"
            stroke="url(#neonGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: isFinished ? [1, 0.9, 1, 0.95, 1] : 1 
            }}
            transition={{ 
              pathLength: { duration: 5, ease: "linear" },
              opacity: { repeat: Infinity, duration: 0.2 }
            }}
            style={{ filter: "url(#real-neon)" }}
          />

          {/* LAYER 4: Dark Inner (creates the lane gap) */}
          <motion.path
            d={MASTER_PATH}
            fill="none"
            stroke="#020202"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, ease: "linear" }}
          />

          {/* LAYER 5: CENTER INTERMEDIATE LINE (THE CORE) */}
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
              pathLength: { duration: 5, ease: "linear" },
              opacity: { times: [0, 0.9, 1], duration: 5.5 }
            }}
            style={{ mixBlendMode: 'plus-lighter' }}
          />
        </svg>

        {/* Ending Flare */}
        <AnimatePresence>
          {isFinished && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.5 }}
              className="absolute inset-0 bg-white/5 blur-[150px] rounded-full pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Loading Context */}
      <motion.div 
        className="absolute bottom-20 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.6em] italic animate-pulse">
            Sincronizando Módulos de Movilidad
        </span>
        <div className="h-0.5 w-48 bg-white/5 rounded-full overflow-hidden">
             <motion.div 
                className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: "linear" }}
             />
        </div>
      </motion.div>
    </div>
  );
}
