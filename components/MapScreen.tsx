"use client";

import React, { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';

// Dynamic import for Leaflet elements
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
  const [userPos, setUserPos] = useState<[number, number]>([19.4326, -99.1332]);
  const mapRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    // Load Leaflet dynamically
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });

    // Track real location from ubicacion.js
    const interval = setInterval(() => {
      const win = window as unknown as GlobalWin;
      if (win.lat_global && win.lng_global) {
        const newPos: [number, number] = [win.lat_global, win.lng_global];
        if (newPos[0] !== userPos[0] || newPos[1] !== userPos[1]) {
          setUserPos(newPos);
          if (mapRef.current) {
            // Smoothly move map to user position if centered
            // mapRef.current.panTo(newPos);
          }
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [userPos]);

  const getMarkerIcon = (type: string) => {
    if (!L) return null;
    
    // Categorization logic
    const color = type === 'seguridad' ? '#F21314' : 
                  type === 'emergencia' ? '#FF6B00' : 
                  type === 'obstruccion' ? '#F2FD14' : 
                  type === 'saturacion' ? '#02D701' : '#14C9D9';

    return L.divIcon({
      className: 'custom-pin',
      html: `
        <div style="position:relative; width:40px; height:40px;">
          <div style="position:absolute; width:100%; height:100%; background:${color}; border-radius:50% 50% 50% 0; transform:rotate(-45deg); border:2px solid white; box-shadow:0 10px 15px -3px rgba(0,0,0,0.3);"></div>
          <div style="position:absolute; width:12px; height:12px; background:white; border-radius:50%; top:10px; left:14px; box-shadow:inset 0 2px 4px rgba(0,0,0,0.2);"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
  };

  const getUserIcon = () => {
    if (!L) return null;
    return L.divIcon({
      className: 'user-pin',
      html: `<div style="width:24px; height:24px; background:#3b82f6; border-radius:50%; border:4px solid white; box-shadow:0 0 15px rgba(59,130,246,0.6); animation: pulse-user 2s infinite;"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 overflow-hidden">
      
      {/* 
        Native Map Implementation 
        To allow real-time Pins from the server, we use a native Leaflet layer 
        that respects the light theme and integrates with ubicacion.js coordinates.
      */}
      <div id="mapa" className="flex-1 w-full h-full relative z-0">
        {typeof window !== 'undefined' && MapContainer && (
          <MapContainer 
            center={userPos} 
            zoom={16} 
            zoomControl={false}
            className="w-full h-full"
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <ZoomControl position="bottomright" />

            {/* User Position Tracking */}
            {getUserIcon() && (
              <Marker position={userPos} icon={getUserIcon()} />
            )}

            {/* Real-time Server Pins */}
            {reports.map((report) => {
              const icon = getMarkerIcon(report.type);
              if (!icon) return null;
              return (
                <Marker 
                  key={report.id} 
                  position={[report.lat, report.lng]} 
                  icon={icon}
                >
                  <Popup className="premium-map-popup">
                    <div className="flex flex-col gap-1 min-w-[200px] p-2 leading-tight">
                      <div className="flex items-center gap-2 mb-1">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: icon.options.html.match(/background:([^;]+)/)?.[1] || '#ccc' }} />
                         <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{report.type}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-base italic uppercase">{report.linea}</h4>
                      {report.description && <p className="text-xs text-slate-600 mb-2">{report.description}</p>}
                      <div className="text-[9px] font-bold text-slate-300 border-t border-slate-100 pt-2 flex justify-between">
                         <span>POS: {report.lat.toFixed(4)}, {report.lng.toFixed(4)}</span>
                         <span>{new Date(report.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
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
          0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .leaflet-container { background: #f1f5f9 !important; height: 100% !important; width: 100% !important; }
        .premium-map-popup .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(8px);
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          padding: 4px;
        }
        .premium-map-popup .leaflet-popup-tip { background: white; }
      `}</style>
      
      <Script src="/ubicacion.js" strategy="afterInteractive" />
    </div>
  );
}
