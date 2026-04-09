"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, Activity } from 'lucide-react';

declare global {
  interface Window {
    initMap?: () => void;
  }
}

export default function MapInner() {
  const [reportMsg, setReportMsg] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // If the script is already loaded and initMap is available, call it.
    // ubicacion.js normally runs on DOMContentLoaded, but in SPA navigation 
    // we might need to re-trigger it.
    if (window.initMap) {
      window.initMap();
    }

    // Escuchar actualizaciones del script ubicacion.js
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      setReportMsg(customEvent.detail);
    };

    window.addEventListener('vialidad-update', handleUpdate);
    return () => window.removeEventListener('vialidad-update', handleUpdate);
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#0a0a0a]">
      <div id="mapa" className="w-full h-full absolute inset-0" />
      
      {/* Intelligence Toggle Button */}
      <div className="absolute top-24 right-4 z-[20]">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-2xl glass-premium flex items-center justify-center text-cyan-400 border-cyan-500/30 shadow-2xl relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-cyan-400/10 group-hover:bg-cyan-400/20 transition-colors" />
          <Activity className="w-7 h-7 relative z-10" />
          {reportMsg && !isOpen && (
            <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full animate-pulse border-2 border-black" />
          )}
        </motion.button>
      </div>

      {/* Expandable Mobility Card */}
      <AnimatePresence>
        {isOpen && reportMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-24 left-4 right-20 z-[30] pointer-events-auto"
          >
            <div className="bg-white rounded-[32px] p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-black hover:bg-slate-200 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.2em]">Sugerencia de Movilidad</h4>
                  <div className="text-[14px] font-black text-black uppercase tracking-tight">Reporte Táctico Motus</div>
                </div>
              </div>

              <div className="text-[13px] font-bold text-slate-800 leading-relaxed max-h-[40vh] overflow-y-auto pr-2">
                {reportMsg}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <span>Actualizado ahora</span>
                <span>ID_PROTOCOLO: MT-99</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
