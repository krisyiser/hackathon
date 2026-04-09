"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PATHS = [
  // M: Vivid Pink
  { color: "#FF0066", d: "M 10 140 L 25 60 L 45 120 L 65 60 L 80 140 Q 85 140 95 125" },
  // O: Vivid Orange
  { color: "#FF6600", d: "M 95 125 A 25 25 0 1 1 105 125 Q 120 150 160 140" },
  // T: Cyber Cyan
  { color: "#00E5FF", d: "M 160 140 Q 190 140 190 110 L 190 60 L 160 60 L 220 60 L 190 60 L 190 130 Q 190 140 220 140" },
  // U: Emerald Teal
  { color: "#00FF66", d: "M 220 140 Q 230 140 240 60 L 240 120 A 20 20 0 0 0 280 120 L 280 60 C 280 15 350 15 350 60" },
  // S: Electric Purple
  { color: "#A800FF", d: "M 350 60 L 320 60 A 20 20 0 0 0 320 100 L 330 100 A 20 20 0 0 1 330 140 L 290 140" }
];

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Sequence total matches 5s progress bar
    const timer = setTimeout(() => {
      setIsFinished(true);
      setTimeout(onComplete, 1200);
    }, 5500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#020202] flex flex-col items-center justify-center overflow-hidden">
      {/* Deep Space Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FF0066]/5 via-black to-[#00E5FF]/5 pointer-events-none" />

      {/* MOTUS 2-Lane Neon Sign */}
      <div className="relative w-full max-w-4xl px-4 sm:px-12 flex items-center justify-center -mt-10">
        <svg 
          viewBox="-10 10 390 180" 
          className="w-full h-auto overflow-visible" 
          style={{ 
            filter: isFinished ? 'drop-shadow(0 0 25px rgba(255,255,255,0.3))' : 'drop-shadow(0 0 15px rgba(0,0,0,0.5))', 
            transition: 'filter 1s ease' 
          }}
        >
          {PATHS.map((path, i) => {
            const transition = { duration: 1.5, delay: i * 0.8, ease: [0.22, 1, 0.36, 1] };
            
            return (
              <g key={i}>
                {/* Massive Neon Aura */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="32"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.15 }}
                  transition={transition}
                  style={{ filter: 'blur(20px)' }}
                />
                
                {/* Secondary Tight Glow */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={transition}
                  style={{ filter: 'blur(8px)' }}
                />
                
                {/* Physical Outer Tube */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={transition}
                />

                {/* Inner Cutout (Forms the two tracks natively!) */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke="#020202"
                  strokeWidth="8"
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

      {/* Progress Sync Bar */}
      <motion.div 
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">
          {isFinished ? 'SISTEMA INICIADO' : 'CARGANDO MÓDULOS...'}
        </span>
        <div className="h-1 w-[200px] sm:w-[300px] bg-white/10 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full rounded-full absolute left-0 top-0 shadow-[0_0_20px_#00E5FF]"
            style={{ backgroundColor: '#00E5FF' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5.5, ease: "linear" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
