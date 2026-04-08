"use client";

import dynamic from 'next/dynamic';
import Script from 'next/script';
import Head from 'next/head';
import 'leaflet/dist/leaflet.css';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';
import { Report } from '@/types';
import { useEffect, useState } from 'react';
import type { DivIconOptions } from 'leaflet';

// Dynamically import Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

const CDMX_CENTER: [number, number] = [19.4326, -99.1332];

const getMarkerIcon = (report: Report) => {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const L = (window as any).L; 
  if (!L) return null;
  
  const neonColors: Record<string, string> = {
    seguridad: '#F21314',
    emergencia: '#FF6B00',
    obstruccion: '#F2FD14',
    saturacion: '#02D701',
    entorno: '#14C9D9'
  };
  
  const color = neonColors[report.type] || '#14C9D9';
  
  return L.divIcon({
    className: 'custom-premium-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-14 h-14 bg-white/10 rounded-full blur-[4px] border border-white/30 animate-pulse"></div>
        <div class="w-5 h-5 rounded-full border-2 border-white shadow-2xl" style="background: ${color}; box-shadow: 0 0 20px ${color}"></div>
      </div>
    `,
    iconSize: [56, 56],
    iconAnchor: [28, 28],
  } as DivIconOptions);
};

export function MapScreen() {
  const { reports } = useRealtimeReports();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    import('leaflet').then(L => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).L = L;
    });

    // Initialize global variables for ubicacion.js
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).lat_global = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).lng_global = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).accuracy_global = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).timestamp_global = null;
  }, []);

  const neonColors: Record<string, string> = {
    seguridad: '#F21314',
    emergencia: '#FF6B00',
    obstruccion: '#F2FD14',
    saturacion: '#02D701',
    entorno: '#14C9D9'
  };

  if (!isMounted) return <div className="w-full h-screen bg-black" />;

  return (
    <div id="mapa" className="w-full h-full relative overflow-hidden bg-black">
      {/* Load custom styles and scripts from user */}
      <Head>
        <link rel="stylesheet" href="/principal.css" />
      </Head>
      <Script 
        src="/ubicacion.js" 
        strategy="afterInteractive"
        onLoad={() => {
          console.log("ubicacion.js loaded");
        }}
      />

      {/* Hidden button to prevent ubicacion.js crash if it tries to access it */}
      <button id="btn_dar_permisos" style={{ display: 'none' }} />

      <MapContainer
        center={CDMX_CENTER}
        zoom={13}
        className="w-full h-full grayscale brightness-[0.5] contrast-[1.2] z-0"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {reports.map((report) => {
          const icon = getMarkerIcon(report);
          if (!icon) return null;
          
          return (
            <Marker
              key={report.id}
              position={[report.lat, report.lng]}
              icon={icon}
            >
              <Popup className="premium-popup">
                <div className="p-8 glass-premium rounded-[32px] border-white/30 text-white min-w-[240px] shadow-2xl">
                   <p 
                     className="text-[12px] font-black uppercase tracking-widest mb-4 opacity-70"
                     style={{ color: neonColors[report.type] }}
                   >
                     {report.type.toUpperCase()}
                   </p>
                   <p className="text-xl font-black leading-tight tracking-tight uppercase italic">{report.linea}</p>
                   <div className="mt-6 flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-2 h-6 rounded-full transition-all" 
                          style={{ backgroundColor: i < report.intensidad ? neonColors[report.type] : 'rgba(255,255,255,0.1)' }}
                        />
                      ))}
                   </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
    </div>
  );
}
