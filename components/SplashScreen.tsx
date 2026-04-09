"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PATHS = [
  // M: Pink/Rose
  { color: "#FF3366", d: "M 20 140 L 40 40 L 60 110 L 80 40 L 100 140" },
  // O: Yellow/Gold - Passes under to T
  { color: "#FFCC00", d: "M 100 140 C 100 80, 160 80, 160 120 C 160 160, 100 160, 100 120 C 100 100, 150 90, 180 90" },
  // T: Cyan - Header passes top
  { color: "#00CCFF", d: "M 150 90 L 230 90 M 190 90 L 190 150" },
  // U: Green
  { color: "#33FF66", d: "M 240 90 L 240 130 C 240 160, 300 160, 300 130 L 300 90" },
  // S: Blue
  { color: "#3366FF", d: "M 350 90 C 310 90, 310 120, 330 120 C 350 120, 350 150, 310 150" }
];

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFinished(true);
      setTimeout(onComplete, 1200);
    }, 5500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#020202] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FF3366]/5 via-black to-[#00CCFF]/5 pointer-events-none" />

      {/* MOTUS 3-Line Neon Road Logo */}
      <div className="relative w-full max-w-4xl px-4 sm:px-12 flex items-center justify-center -mt-10">
        <svg 
          viewBox="-10 20 400 160" 
          className="w-full h-auto overflow-visible"
        >
          {PATHS.map((path, i) => {
            const transition = { duration: 1.5, delay: i * 0.8, ease: "easeInOut" };
            
            return (
              <g key={i}>
                {/* 1. Neon Aura Bloom */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.2 }}
                  transition={transition}
                  style={{ filter: 'blur(12px)' }}
                />
                
                {/* 2. Outer Line (Line 1) */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={transition}
                />

                {/* 3. Gap 1 (Black) */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke="#020202"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={transition}
                />

                {/* 4. Intermediate Line (Line 2 - REQUESTED) */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={transition}
                />

                {/* 5. Gap 2 (Black) */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke="#020202"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={transition}
                />

                {/* 6. Inner Line (Line 3) */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={transition}
                />
              </g>
            );
          })}
        </svg>

        <AnimatePresence>
          {isFinished && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/5 blur-[80px] rounded-full pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar Sync */}
      <motion.div 
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">
          {isFinished ? 'NODO INICIADO' : 'CARGANDO SISTEMA MOTUS...'}
        </span>
        <div className="h-1 w-[200px] sm:w-[300px] bg-white/10 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full rounded-full absolute left-0 top-0 shadow-[0_0_20px_#22d3ee]"
            style={{ backgroundColor: '#22d3ee' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5.5, ease: "linear" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
