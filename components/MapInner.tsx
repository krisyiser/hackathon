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
        <div style="position:relative; width:44px; height:44px;">
          <div style="position:absolute; width:100%; height:100%; background:${color}; border-radius:50% 50% 50% 0; transform:rotate(-45deg); border:3px solid white; box-shadow:0 8px 20px rgba(0,0,0,0.3);"></div>
          <div style="position:absolute; width:14px; height:14px; background:white; border-radius:50%; top:10px; left:15px;"></div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 44]
    });
  };

  const getUserIcon = () => {
    return L.divIcon({
      className: 'user-pin',
      html: `<div style="width:28px; height:28px; background:#3b82f6; border-radius:50%; border:4px solid white; box-shadow:0 0 25px rgba(59,130,246,0.8); animation: pulse-user 2s infinite;"></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
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
            <Popup className="premium-map-popup">
              <div className="flex flex-col gap-1 min-w-[220px] p-2">
                <div className="flex justify-between items-center mb-1">
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{report.type}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-base leading-tight uppercase italic mb-1">{report.linea}</h4>
                <p className="text-[10px] font-bold text-blue-500 mb-1">{report.metadata?.calle}</p>
                {report.description && <p className="text-xs text-slate-500 leading-snug bg-slate-50 p-2 rounded-lg border border-slate-100 italic">&quot;{report.description}&quot;</p>}
                <div className="text-[9px] font-extrabold text-slate-300 mt-2 text-right">
                   {new Date(report.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <style jsx global>{`
        @keyframes pulse-user {
          0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
          100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .leaflet-container { background: #e5e7eb !important; height: 100% !important; width: 100% !important; }
        .premium-map-popup .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 1);
          border-radius: 20px;
          border: 1px solid #eee;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          padding: 6px;
        }
        .premium-map-popup .leaflet-popup-tip { background: white; }
      `}</style>
    </div>
  );
}
