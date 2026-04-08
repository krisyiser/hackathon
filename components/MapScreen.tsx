"use client";

import React from 'react';
import Script from 'next/script';

export function MapScreen() {
  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden relative">
      {/* 
        Official Motus Map via Iframe
        We use the iframe because the Google Maps API Key is restricted to lookitag.com.
        This approach ensures the map loads correctly on Netlify without Referer errors
        and preserves the exact aesthetics requested by the project.
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
        Official Logic Script
        Handles background reporting and coordinate sync
      */}
      <Script src="/ubicacion.js" strategy="afterInteractive" />
      
      <style jsx global>{`
        #mapa { width: 100%; height: 100%; }
      `}</style>
    </div>
  );
}
