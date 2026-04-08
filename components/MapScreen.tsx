"use client";

import Script from 'next/script';
import Head from 'next/head';

export function MapScreen() {
  return (
    <>
      <Head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/principal.css" />
      </Head>
      
      {/* 
        This is exactly the map from lookitag.com/motus/ 
        Using an iframe completely bypasses the Google Maps API "RefererNotAllowedMapError" 
        since it loads from the authorized origin.
      */}
      <div id="mapa" className="w-full h-full relative z-0">
        <iframe 
            src="https://lookitag.com/motus/" 
            className="w-full h-full border-none absolute inset-0"
            title="Motus City Map"
            allow="geolocation"
        />
      </div>

      {/* Execute the exact script the user provided in public/ubicacion.js */}
      <Script src="/ubicacion.js" strategy="afterInteractive" />
    </>
  );
}
