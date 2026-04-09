"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="fixed inset-0 z-[1000] bg-[#010101] flex flex-col items-center justify-center overflow-hidden">
      {/* Absolute Dark Void */}
      <div className="absolute inset-0 bg-black" />
      
      {/* CINEMATIC REAR GLOWS (Pulsing background) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            opacity: isFinished ? 0.3 : [0.05, 0.15, 0.05, 0.2, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            opacity: isFinished ? 0.2 : [0.02, 0.1, 0.02, 0.15, 0.05],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500/5 blur-[150px] rounded-full"
        />
      </div>

      {/* THE LOGO ENGINE (Flickering Sign) */}
      <div className="relative w-[300px] sm:w-[450px] flex items-center justify-center px-10">
        
        {/* Glow halo behind the sign */}
        <motion.div
          animate={{ 
            opacity: isFinished ? 0.6 : [0, 0.2, 0.05, 0.4, 0.1, 0.5, 0.2, 0.8],
          }}
          transition={{ 
            duration: 3, 
            times: [0, 0.1, 0.15, 0.2, 0.25, 0.35, 0.4, 1],
            repeat: Infinity,
            repeatDelay: 5
          }}
          className="absolute inset-0 bg-cyan-400/20 blur-[80px] rounded-full"
        />

        <div className="relative z-10 w-full h-auto">
          {/* THE LOGO PNG */}
          <motion.img 
            src="/motus.png"
            alt="MOTUS OFFICIAL"
            className="w-full h-auto object-contain"
            initial={{ opacity: 0.05, filter: 'brightness(0.3) grayscale(0.2)' }}
            animate={{ 
                opacity: isFinished ? 1 : [0.05, 0.1, 0.8, 0.1, 1, 0.3, 1, 0.5, 1],
                filter: isFinished 
                    ? 'brightness(1.2) drop-shadow(0 0 35px rgba(50,173,230,0.8))' 
                    : [
                        'brightness(0.3) drop-shadow(0 0 0px transparent)',
                        'brightness(1.5) drop-shadow(0 0 20px rgba(50,173,230,1))',
                        'brightness(0.5) drop-shadow(0 0 5px rgba(50,173,230,0.5))',
                        'brightness(1.8) drop-shadow(0 0 40px rgba(50,173,230,1))'
                      ],
            }}
            transition={{ 
                duration: 4, 
                times: [0, 0.1, 0.12, 0.15, 0.2, 0.25, 0.3, 0.4, 1],
                ease: "easeInOut",
                repeat: isFinished ? 0 : Infinity,
                repeatDelay: 4
            }}
          />

          {/* Micro-sparkle overlay (The 'buzzing' light effect) */}
          <motion.div 
            animate={{ opacity: [0, 0.1, 0, 0.2, 0] }}
            transition={{ duration: 0.1, repeat: Infinity }}
            className="absolute inset-0 bg-white/5 blur-[1px] pointer-events-none"
          />
        </div>
      </div>

      {/* TACTICAL STATUS HUD */}
      <motion.div 
        className="absolute bottom-24 flex flex-col items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col items-center gap-2">
           <motion.span 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.6em] ml-[0.6em] italic"
           >
               ESTABLECIENDO PROTOCOLOS DE CIUDAD
           </motion.span>
           <div className="flex items-center gap-4 text-[7px] font-bold text-white/10 uppercase tracking-[0.4em] font-mono">
              <span>GPS_SYNC: OK</span>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <span>CRYPT_AUTH: OK</span>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <span>NODES: 256</span>
           </div>
        </div>
        
        <div className="h-0.5 w-[260px] bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-cyan-400 shadow-[0_0_20px_#22d3ee]"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
