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
    <div 
      id="mapa" 
      className="w-full h-full min-h-screen relative z-0" 
      style={{ background: '#0a0a0a' }}
    />
  );
}
