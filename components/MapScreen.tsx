"use client";

import React from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';

// Dynamic import of the actual map implementation to avoid SSR issues
const MapInner = dynamic(() => import('./MapInner'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center font-black text-slate-400 italic">CARGANDO SISTEMA TÁCTICO...</div>
});

export function MapScreen() {
  return (
    <div className="w-full h-full flex flex-col bg-slate-100 overflow-hidden relative">
      <div id="mapa" className="flex-1 w-full h-full relative z-0">
        <MapInner />
      </div>
      <Script src="/ubicacion.js" strategy="afterInteractive" />
    </div>
  );
}
