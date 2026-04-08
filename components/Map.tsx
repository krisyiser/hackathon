"use client";

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';
import { Report } from '@/types';
import { useEffect, useState } from 'react';

// Dynamically import Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

const CDMX_CENTER: [number, number] = [19.4326, -99.1332];

const getMarkerIcon = (report: Report) => {
  if (typeof window === 'undefined') return null;
  const L = require('leaflet');
  
  const color = report.type === 'inseguridad' ? '#f43f5e' : '#06b6d4';
  const glow = report.type === 'inseguridad' ? 'rose-glow' : 'cyan-glow';
  
  return L.divIcon({
    className: 'custom-tactical-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 rounded-full ripple-effect" style="color: ${color}"></div>
        <div class="relative w-4 h-4 bg-white rounded-full border-2 border-slate-950 ${glow}" style="background: ${color}"></div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

export default function Map() {
  const { reports } = useRealtimeReports();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-screen bg-slate-950 animate-pulse" />;

  return (
    <div id="map-container" className="w-full h-screen relative bg-slate-950">
      <MapContainer
        center={CDMX_CENTER}
        zoom={13}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={getMarkerIcon(report) as any}
          >
            <Popup className="tactical-popup">
              <div className="p-3 bg-slate-950/90 text-white border border-white/10 rounded-2xl backdrop-blur-xl">
                 <p className="text-[10px] font-black uppercase text-cyan-400 mb-1 tracking-widest">{report.type}</p>
                 <p className="text-xs font-bold uppercase">{report.linea}</p>
                 <div className="mt-2 flex items-center gap-2">
                    <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-cyan-500" style={{ width: `${(report.intensidad/5)*100}%` }} />
                    </div>
                    <span className="text-[8px] font-mono text-slate-500">LVL_{report.intensidad}</span>
                 </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Aesthetic Overlay Filters */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.3)_100%)]" />
        <div className="absolute inset-0 bg-slate-950 mix-blend-overlay opacity-30" />
      </div>
    </div>
  );
}
