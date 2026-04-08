"use client";

import React, { useEffect, useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  ZoomControl, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';

interface GlobalWin extends Window {
  lat_global?: number;
  lng_global?: number;
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center[0] !== 19.4326 || center[1] !== -99.1332) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function MapInner() {
  const { reports } = useRealtimeReports();
  const [userPos, setUserPos] = useState<[number, number]>([19.4326, -99.1332]);

  useEffect(() => {
    const interval = setInterval(() => {
      const win = window as unknown as GlobalWin;
      if (win.lat_global && win.lng_global) {
        setUserPos([win.lat_global, win.lng_global]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getMarkerIcon = (type: string) => {
    const colors: Record<string, string> = {
      seguridad: '#F21314',
      emergencia: '#FF6B00',
      obstruccion: '#F2FD14',
      saturacion: '#02D701',
      entorno: '#14C9D9'
    };
    const color = colors[type] || '#14C9D9';

    return L.divIcon({
      className: 'custom-pin',
      html: `
        <div style="position:relative; width:50px; height:50px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.4));">
          <div style="position:absolute; width:100%; height:100%; background:${color}; border-radius:50% 50% 50% 0; transform:rotate(-45deg); border:4px solid white;"></div>
          <div style="position:absolute; width:18px; height:18px; background:white; border-radius:50%; top:12px; left:16px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);"></div>
          <div style="position:absolute; width:60px; height:60px; background:${color}; opacity:0.2; border-radius:50%; top:-5px; left:-5px; animation: pulse-pin 2s infinite;"></div>
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 50]
    });
  };

  const getUserIcon = () => {
    return L.divIcon({
      className: 'user-pin',
      html: `<div style="width:32px; height:32px; background:#3b82f6; border-radius:50%; border:5px solid white; box-shadow:0 0 30px rgba(59,130,246,1); animation: pulse-user 2s infinite;"></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={userPos} 
        zoom={16} 
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; Google'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />
        <ZoomControl position="bottomright" />
        <MapController center={userPos} />

        <Marker position={userPos} icon={getUserIcon()} zIndexOffset={1000} />

        {reports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.lat, report.lng]} 
            icon={getMarkerIcon(report.type)}
          >
            <Popup className="premium-map-popup" minWidth={280}>
              <div className="flex flex-col gap-4 p-4 font-sans overflow-hidden">
                <div className="flex justify-between items-start">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 animate-pulse mb-1">MOVILIDAD ACTIVA</span>
                      <h4 className="font-black text-slate-900 text-xl leading-tight uppercase italic tracking-tighter">{report.linea}</h4>
                   </div>
                </div>
                
                <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                   <div className="flex items-center gap-2 text-blue-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{report.metadata?.calle || 'UBICACIÓN TÁCTICA'}</span>
                   </div>
                   <p className="text-xs text-slate-600 leading-relaxed font-medium italic">&quot;{report.description}&quot;</p>
                </div>

                <div className="flex items-center justify-between mt-1">
                   <div className="px-3 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-[9px] font-black text-slate-500">
                      ID: {report.id.toString().slice(-6).toUpperCase()}
                   </div>
                   <div className="text-[9px] font-black text-slate-400">
                      SNAPSHOT: {new Date(report.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                   </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <style jsx global>{`
        @keyframes pulse-user {
          0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 25px rgba(59, 130, 246, 0); }
          100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        @keyframes pulse-pin {
          0% { transform: scale(0.5); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .leaflet-container { background: #f8fafc !important; height: 100% !important; width: 100% !important; }
        .premium-map-popup .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.25), 0 18px 36px -18px rgba(0,0,0,0.3);
          padding: 0;
          overflow: hidden;
        }
        .premium-map-popup .leaflet-popup-content { margin: 0; width: auto !important; }
        .premium-map-popup .leaflet-popup-tip { background: white; box-shadow: none; }
        .premium-map-popup .leaflet-popup-close-button {
          padding: 12px !important;
          color: #94a3b8 !important;
          font-size: 20px !important;
        }
      `}</style>
    </div>
  );
}
