"use client";

import React, { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';

// Dynamic import for Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const ZoomControl = dynamic(() => import('react-leaflet').then(mod => mod.ZoomControl), { ssr: false });

interface GlobalWin extends Window {
  lat_global?: number;
  lng_global?: number;
  pedirUbicacion?: () => void;
}

export function MapScreen() {
  const { reports } = useRealtimeReports();
  const [L, setL] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [userPos, setUserPos] = useState<[number, number]>([19.4326, -99.1332]);
  const mapRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    // Import leaflet for internal use
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });

    const win = window as unknown as GlobalWin;
    
    // Ensure the functions from ubicacion.js can run
    const interval = setInterval(() => {
      if (win.lat_global && win.lng_global) {
        const newPos: [number, number] = [win.lat_global, win.lng_global];
        if (newPos[0] !== userPos[0] || newPos[1] !== userPos[1]) {
          setUserPos(newPos);
          if (mapRef.current) {
            mapRef.current.setView(newPos, mapRef.current.getZoom());
          }
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [userPos]);

  const getIcon = (type: string) => {
    if (!L) return null;
    const color = type === 'seguridad' ? '#F21314' : 
                  type === 'emergencia' ? '#FF6B00' : 
                  type === 'obstruccion' ? '#F2FD14' : 
                  type === 'saturacion' ? '#02D701' : '#14C9D9';

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="width:32px;height:32px;background:${color};border-radius:50%;border:4px solid white;box-shadow:0 4px 15px rgba(0,0,0,0.2)"></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  const getUserIcon = () => {
    if (!L) return null;
    return L.divIcon({
      className: 'user-marker',
      html: `<div style="width:24px;height:24px;background:#3b82f6;border-radius:50%;border:4px solid white;box-shadow:0 0 20px rgba(59,130,246,0.6);animation: pulse-user 2s infinite;"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      <Head>
        <link rel="stylesheet" href="/principal.css" />
        <title>Mapa | MOTUS City</title>
      </Head>
      <div id="mapa" className="flex-1 w-full h-full relative z-0">
        {typeof window !== 'undefined' && MapContainer && (
          <MapContainer 
            center={userPos} 
            zoom={16} 
            zoomControl={false}
            className="w-full h-full"
            style={{ position: 'absolute', inset: 0 }}
            ref={mapRef}
          >
            {/* LIGTH MODE (Standard OSM) */}
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <ZoomControl position="bottomright" />

            {/* User Position */}
            {getUserIcon() && (
              <Marker position={userPos} icon={getUserIcon()} />
            )}

            {/* Reports Markers */}
            {reports.map((report) => {
              const icon = getIcon(report.type);
              if (!icon) return null;
              return (
                <Marker key={report.id} position={[report.lat, report.lng]} icon={icon}>
                  <Popup className="premium-popup-light">
                    <div className="flex flex-col gap-1 min-w-[200px] p-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{report.type}</span>
                      <h4 className="font-bold text-slate-800 text-base">{report.linea}</h4>
                      {report.description && <p className="text-xs text-slate-600 leading-snug">{report.description}</p>}
                      <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                        <span>{new Date(report.created_at).toLocaleDateString()}</span>
                        <span>{new Date(report.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse-user {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .leaflet-container { background: #f1f5f9 !important; }
        
        .premium-popup-light .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          color: #1e293b;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          padding: 4px;
        }
        .premium-popup-light .leaflet-popup-tip { background: white; }
      `}</style>

      {/* Script integration */}
      <Script src="/ubicacion.js" strategy="afterInteractive" />
    </div>
  );
}
