"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PATHS = [
  // M: Rose
  { color: "#FF2D55", d: "M 20 140 L 40 40 L 60 110 L 80 40 L 100 140" },
  // O: Orange/Gold
  { color: "#FF9F0A", d: "M 100 140 C 100 80, 160 80, 160 120 C 160 160, 100 160, 100 120 C 100 100, 150 90, 180 90" },
  // T: Cyan
  { color: "#32ADE6", d: "M 150 90 L 230 90 M 190 90 L 190 150" },
  // U: Green
  { color: "#34C759", d: "M 240 90 L 240 130 C 240 160, 300 160, 300 130 L 300 90" },
  // S: Blue
  { color: "#007AFF", d: "M 350 90 C 310 90, 310 120, 330 120 C 350 120, 350 150, 310 150" }
];

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFinished(true);
      setTimeout(onComplete, 1500);
    }, 5500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#020202] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-black" />
      
      {/* Dynamic Lighting Background */}
      <motion.div 
        animate={{ opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)]"
      />

      {/* MOTUS Hyper-Realistic Neon Sign */}
      <div className="relative w-full max-w-4xl px-4 sm:px-12 flex items-center justify-center -mt-10">
        <svg 
          viewBox="-10 20 400 160" 
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {PATHS.map((path, i) => {
            const transition = { 
              duration: 1.8, 
              delay: i * 0.8, 
              ease: [0.25, 0.1, 0.25, 1] 
            };
            
            return (
              <g key={i}>
                {/* Layer 1: Expansive Bloom */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="28"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.12 }}
                  transition={transition}
                  style={{ filter: 'blur(24px)' }}
                />
                
                {/* Layer 2: Tight Core Glow */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={transition}
                  style={{ filter: 'blur(6px)' }}
                />

                {/* Layer 3: Physical Tube Boundary */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: 1,
                    strokeWidth: isFinished ? [12, 12.5, 12] : 12,
                  }}
                  transition={{
                    ...transition,
                    strokeWidth: { duration: 0.1, repeat: Infinity, repeatType: "reverse" }
                  }}
                  style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' }}
                />

                {/* Layer 4: Road Mask (Creates the 2 paths) */}
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

                {/* Layer 5: Intermediate Divider Line (THE ONE INTERNAL LINE) */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="1.5"
                  strokeLinecap="butt" // Prevents starting dots
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: [0, 0, 1], // Flicks on at end of drawing
                  }}
                  transition={{
                    ...transition,
                    opacity: { times: [0, 0.8, 1], duration: 1.8 + i * 0.8 }
                  }}
                />
              </g>
            );
          })}
        </svg>

        <AnimatePresence>
          {isFinished && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-white/[0.02] blur-[120px] rounded-full pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Progress Info */}
      <motion.div 
        className="absolute bottom-20 flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col items-center gap-2">
           <motion.span 
             animate={{ opacity: [0.3, 0.6, 0.3] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="text-[9px] font-black text-white uppercase tracking-[0.8em] ml-[0.8em]"
           >
             {isFinished ? 'STATUS: ONLINE' : 'AUTODIAGNÓSTICO INICIAL'}
           </motion.span>
        </div>
        
        <div className="h-0.5 w-[240px] bg-white/5 rounded-full overflow-hidden relative border border-white/5">
          <motion.div 
            className="h-full absolute left-0 top-0"
            style={{ 
              backgroundColor: '#32ADE6',
              boxShadow: '0 0 15px #32ADE6'
            }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
