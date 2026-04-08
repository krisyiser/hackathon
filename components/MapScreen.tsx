"use client";

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';
import 'leaflet/dist/leaflet.css';

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const ZoomControl = dynamic(() => import('react-leaflet').then(mod => mod.ZoomControl), { ssr: false });

interface GlobalWin extends Window {
  lat_global?: number;
  lng_global?: number;
}

export function MapScreen() {
  const { reports } = useRealtimeReports();
  const [L, setL] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [userPos, setUserPos] = useState<[number, number]>([19.4326, -99.1332]); // CDMX Center default

  useEffect(() => {
    // Import leaflet for custom icons
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });

    const checkInterval = setInterval(() => {
      const win = window as unknown as GlobalWin;
      const lat = win.lat_global;
      const lng = win.lng_global;
      if (lat && lng) {
        setUserPos([lat, lng]);
        clearInterval(checkInterval);
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  const getIcon = (type: string) => {
    if (!L) return null;
    
    const color = type === 'seguridad' ? '#F21314' : 
                  type === 'emergencia' ? '#FF6B00' : 
                  type === 'obstruccion' ? '#F2FD14' : 
                  type === 'saturacion' ? '#02D701' : '#14C9D9';

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 30px; 
        height: 30px; 
        background: ${color}; 
        border-radius: 50%; 
        border: 4px solid rgba(255,255,255,0.8);
        box-shadow: 0 0 20px ${color}aa;
        animation: pulse-marker 2s infinite;
      "></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  const getUserIcon = () => {
    if (!L) return null;
    return L.divIcon({
      className: 'user-marker',
      html: `<div style="
        width: 20px; 
        height: 20px; 
        background: #3b82f6; 
        border-radius: 50%; 
        border: 3px solid white;
        box-shadow: 0 0 15px #3b82f6;
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  return (
    <div className="w-full h-full relative z-0">
      <div id="mapa" className="bg-slate-950">
        {typeof window !== 'undefined' && MapContainer && (
          <MapContainer 
            center={userPos} 
            zoom={15} 
            zoomControl={false}
            className="w-full h-full"
            style={{ background: '#020617' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
                <Marker 
                  key={report.id} 
                  position={[report.lat, report.lng]} 
                  icon={icon}
                >
                  <Popup className="premium-popup">
                    <div className="flex flex-col gap-1 p-1">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                        {report.type}
                      </span>
                      <h4 className="font-bold text-slate-100">{report.linea}</h4>
                      <p className="text-sm text-slate-300 leading-tight">{report.description}</p>
                      <span className="text-[10px] text-slate-500 mt-2 italic">
                        {new Date(report.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse-marker {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .premium-popup .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.9) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: white;
          padding: 8px;
        }
        .premium-popup .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.9) !important;
        }
        .leaflet-container {
          background: #020617 !important;
        }
      `}</style>

      {/* Execute the exact script the user provided in public/ubicacion.js */}
      <Script src="/ubicacion.js" strategy="afterInteractive" />
    </div>
  );
}
