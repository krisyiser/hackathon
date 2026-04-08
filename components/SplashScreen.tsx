"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const letters = "MOTUS".split("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFinished(true);
      setTimeout(onComplete, 1000); // Transition to next state after glow
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/20 via-black to-slate-900/20" />
      
      <div className="relative flex items-center gap-4 sm:gap-8">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              filter: 'blur(0px)',
              textShadow: isFinished ? '0 0 40px rgba(34, 211, 238, 0.8)' : '0 0 0px rgba(0,0,0,0)'
            }}
            transition={{ 
              duration: 0.8, 
              delay: i * 0.3, 
              ease: [0.22, 1, 0.36, 1]
            }}
            className="text-6xl sm:text-9xl font-black text-white italic tracking-tighter"
          >
            {letter}
          </motion.span>
        ))}

        {/* Global Glow Overlay */}
        <AnimatePresence>
          {isFinished && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-cyan-400/10 blur-[100px] rounded-full"
            />
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: '200px' }}
        transition={{ duration: 2.5, ease: "linear" }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 h-1 bg-white/10 rounded-full"
      >
        <motion.div 
          className="h-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}
