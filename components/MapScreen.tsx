"use client";

import React from 'react';
import Script from 'next/script';

export function MapScreen() {
  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      {/* 
        Official Map Container from Motus 
        Using the iframe to lookitag.com/motus/ ensures we use the 
        Google Maps implementation, styles, and authorized API key 
        exactly as the original project designed it.
      */}
      <div id="mapa" className="flex-1 w-full h-full relative z-0">
        <iframe 
          src="https://lookitag.com/motus/" 
          className="w-full h-full border-none absolute inset-0"
          title="Motus Core Map"
          allow="geolocation"
        />
      </div>

      {/* 
        Integration with local ubicacion.js 
        This handles the background reporting and coordinate synchronization
      */}
      <Script src="/ubicacion.js" strategy="afterInteractive" />
    </div>
  );
}
