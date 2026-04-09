"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
      {/* Dynamic Background Depth */}
      <div className="absolute inset-0 bg-[#050505]" />
      
      {/* 1. REAR AMBIENT GLOWS (Vibrant Hues) */}
      <motion.div 
        animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(255,45,85,0.08)_0%,_transparent_70%)] -left-40 -top-40 blur-[100px]"
      />
      <motion.div 
        animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(50,173,230,0.08)_0%,_transparent_70%)] -right-40 -bottom-40 blur-[100px]"
      />

      {/* OFFICIAL LOGO HUD CONTAINER */}
      <div className="relative w-[320px] sm:w-[500px] flex items-center justify-center translate-y-[-20px]">
        {/* Neon Wrapping Light Frame (Subtle outline) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 border-x border-cyan-400/20 rounded-[100px] blur-sm scale-110 pointer-events-none"
        />

        {/* Cinematic Backdrop Glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isFinished ? 0.7 : [0, 0.1, 0.05, 0.3, 0.1, 0.4] }}
          transition={{ duration: 4, times: [0, 0.1, 0.2, 0.3, 0.4, 1] }}
          className="absolute inset-0 bg-white/[0.03] blur-[120px] rounded-full"
        />

        {/* THE LOGO ENGINE */}
        <div className="relative overflow-hidden w-full h-[180px] flex items-center justify-center">
          
          {/* LOGO PNG WITH FLICKER ANIMATION */}
          <motion.img 
            src="/motus.png"
            alt="MOTUS OFFICIAL"
            className="w-full h-auto object-contain relative z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
                opacity: isFinished ? 1 : [0, 0, 1, 0.2, 1, 0.4, 1, 0.8, 1],
                filter: isFinished 
                    ? 'brightness(1.1) drop-shadow(0 0 30px rgba(50,173,230,0.7)) drop-shadow(0 0 10px white)' 
                    : 'brightness(1) drop-shadow(0 0 10px rgba(50,173,230,0.3))',
                scale: 1
            }}
            transition={{ 
                duration: 4, 
                times: [0, 0.5, 0.52, 0.55, 0.6, 0.65, 0.7, 0.8, 1],
                type: "spring",
                stiffness: 100
            }}
          />

          {/* Reveal Wipe Layer */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#020202]/90 to-[#020202] z-20 pointer-events-none"
          />

          {/* Laser-Ignition Line */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="absolute inset-y-0 w-1 bg-cyan-400 blur-[2px] z-30 shadow-[0_0_20px_#22d3ee]"
          />
        </div>
      </div>

      {/* SYTEM INITIALIZATION HUD */}
      <motion.div 
        className="absolute bottom-24 flex flex-col items-center gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex flex-col items-center gap-1.5">
           <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.8em] ml-[0.8em] animate-pulse">
               ESTABLECIENDO ENLACE TÁCTICO
           </span>
           <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em] font-mono">
               MOD_OS_v4.2.0 // NODE_SYNC
           </span>
        </div>
        
        <div className="h-0.5 w-[240px] bg-white/5 rounded-full overflow-hidden relative border border-white/5">
          <motion.div 
            className="h-full bg-cyan-400 shadow-[0_0_20px_#22d3ee]"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
