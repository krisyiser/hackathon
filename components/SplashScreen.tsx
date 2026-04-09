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
      {/* Background Depth */}
      <div className="absolute inset-0 bg-[#050505]" />
      
      {/* Ambient Pulsing Background */}
      <motion.div 
        animate={{ opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(50,173,230,0.1)_0%,_transparent_70%)]"
      />

      {/* OFFICIAL LOGO CONTAINER */}
      <div className="relative w-[280px] sm:w-[400px] flex items-center justify-center">
        {/* Glow Layer 1 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isFinished ? 0.6 : 0.2 }}
          className="absolute inset-0 bg-white/5 blur-[100px] rounded-full"
        />

        {/* Logo with Reveal Animation */}
        <div className="relative overflow-hidden w-full h-[120px] flex items-center justify-center">
          {/* THE LOGO PNG */}
          <motion.img 
            src="/motus.png"
            alt="MOTUS OFFICIAL"
            className="w-full h-auto object-contain relative z-10"
            initial={{ opacity: 0, filter: 'brightness(1) drop-shadow(0 0 0px #32ADE6)' }}
            animate={{ 
                opacity: 1, 
                filter: isFinished 
                    ? 'brightness(1.2) drop-shadow(0 0 25px rgba(50,173,230,0.8))' 
                    : 'brightness(1) drop-shadow(0 0 10px rgba(50,173,230,0.4))'
            }}
            transition={{ duration: 2, delay: 0.5 }}
          />

          {/* Reveal Mask (Left to Right Wipe) */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 3.5, ease: "easeInOut", delay: 0.2 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#020202]/80 to-[#020202] z-20 pointer-events-none"
          />

          {/* Neon Scraper Effect (The leading edge of light) */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 3.5, ease: "easeInOut", delay: 0.2 }}
            className="absolute inset-y-0 w-2 bg-gradient-to-b from-transparent via-cyan-400 to-transparent blur-md z-30 shadow-[0_0_20px_#22d3ee]"
          />
        </div>
      </div>

      {/* Status HUD */}
      <motion.div 
        className="absolute bottom-20 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            SISTEMA CARGADO
        </span>
        <div className="h-0.5 w-[200px] bg-white/5 rounded-full overflow-hidden relative border border-white/5">
          <motion.div 
            className="h-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
