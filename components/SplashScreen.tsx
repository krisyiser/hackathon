"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PATHS = [
  { 
    letter: "M", 
    color: "#FF007F", 
    d: "M 10 140 L 25 60 L 40 120 L 55 60 L 70 140 Q 80 140 90 125" 
  },
  { 
    letter: "O", 
    color: "#FFEA00", 
    d: "M 90 125 A 30 30 0 1 1 100 125 Q 130 150 180 140" 
  },
  { 
    letter: "T", 
    color: "#00FFFF", 
    d: "M 180 140 Q 200 140 200 100 L 200 60 L 170 60 L 230 60 L 200 60 L 200 140 Q 210 140 250 60" 
  },
  { 
    letter: "U", 
    color: "#39FF14", 
    d: "M 250 60 L 250 120 A 30 30 0 0 0 310 120 L 310 60 Q 330 20 360 40 Q 380 50 390 60" 
  },
  { 
    letter: "S", 
    color: "#0080FF", 
    d: "M 390 60 L 360 60 A 20 20 0 0 0 340 80 A 20 20 0 0 0 360 100 L 370 100 A 20 20 0 0 1 390 120 A 20 20 0 0 1 370 140 L 330 140" 
  }
];

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // 5 seconds animation + 1 second glow/finish transition
    const timer = setTimeout(() => {
      setIsFinished(true);
      setTimeout(onComplete, 1200);
    }, 5500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#020202] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FF007F]/5 via-black to-[#00FFFF]/5 pointer-events-none" />

      {/* MOTUS Neon Logo - Mexico 86 Style */}
      <div className="relative w-full max-w-4xl px-4 sm:px-12 flex items-center justify-center -mt-10">
        <svg 
          viewBox="-10 20 440 160" 
          className="w-full h-auto overflow-visible" 
          style={{ 
            filter: isFinished ? 'drop-shadow(0 0 25px rgba(255,255,255,0.2))' : 'none', 
            transition: 'filter 1s ease' 
          }}
        >
          {PATHS.map((path, i) => {
            // Sequence timing: each letter takes 1s to draw, starting 0.9s after the previous
            const transition = { duration: 1.2, delay: i * 0.9, ease: "easeInOut" };
            
            return (
              <g key={i}>
                {/* 1. Outer Neon Aura (Blur) */}
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
                
                {/* 2. Outer Neon Track */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={transition}
                />

                {/* 3. Black Inner Asphalt */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke="#020202"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={transition}
                />

                {/* 4. Center Neon Stripe */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="4"
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

        {/* Global Glow Overlay Triggered at End */}
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

      {/* Loading Progress Bar */}
      <motion.div 
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">
          {isFinished ? 'SISTEMA INICIADO' : 'ESTABLECIENDO ENLACE...'}
        </span>
        <div className="h-1 w-[200px] sm:w-[300px] bg-white/10 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full rounded-full absolute left-0 top-0 shadow-[0_0_15px_#22d3ee]"
            style={{ backgroundColor: '#22d3ee' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
