"use client";

import React, { useEffect } from 'react';

declare global {
  interface Window {
    initMap?: () => void;
  }
}

export default function MapInner() {
  useEffect(() => {
    // If the script is already loaded and initMap is available, call it.
    // ubicacion.js normally runs on DOMContentLoaded, but in SPA navigation 
    // we might need to re-trigger it.
    if (window.initMap) {
      window.initMap();
    }
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#0a0a0a]">
      <div id="mapa" className="w-full h-full absolute inset-0" />
      
      {/* Mobility Report HUD */}
      <div className="absolute top-24 left-4 right-4 z-[10] pointer-events-none">
        <div 
          id="hud-vialidad"
          className="glass-premium p-4 rounded-3xl border border-cyan-500/20 bg-black/40 text-[11px] font-bold text-cyan-400 uppercase tracking-widest leading-relaxed shadow-2xl backdrop-blur-xl empty:hidden animate-in fade-in slide-in-from-top-4 duration-700"
        >
          ANALIZANDO FLUJO URBANO...
        </div>
      </div>
    </div>
  );
}
