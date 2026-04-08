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

const getHeatColor = (type: string) => {
  switch (type) {
    case 'inseguridad': return '#f43f5e'; // Rose-500
    case 'saturacion': return '#f59e0b'; // Amber-500
    case 'retraso': return '#3b82f6'; // Blue-500
    case 'manifestacion': return '#8b5cf6'; // Violet-500
    default: return '#3b82f6';
  }
};

export function Map() {
  const { reports } = useRealtimeReports();
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  const createCustomIcon = (type: string, intensity: number) => {
    if (!L) return null;
    const color = getHeatColor(type);
    const size = 12 + (intensity * 4);
    
    return L.divIcon({
      className: 'custom-tactical-icon',
      html: `
        <div class="relative flex items-center justify-center" style="color: ${color}">
          <div class="absolute w-full h-full rounded-full pulse-ring" style="width: ${size * 3}px; height: ${size * 3}px; left: -${size}px; top: -${size}px;"></div>
          <div class="relative rounded-full border-2 border-white shadow-lg" style="background-color: ${color}; width: ${size}px; height: ${size}px;"></div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  return (
    <div className="w-full h-screen absolute inset-0 z-0 overflow-hidden" id="map-container">
      <MapContainer
        center={CDMX_CENTER}
        zoom={14}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: '#020617' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        
        {L && reports.map((report: Report) => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={createCustomIcon(report.type, report.intensidad)}
          >
            <Popup className="custom-popup">
              <div className="p-3 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold capitalize text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: getHeatColor(report.type) }}></span>
                    {report.type}
                  </h3>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                    ID: {report.id.slice(0,4)}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-2 font-medium">{report.linea}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  <span>Intensidad</span>
                  <span>{report.intensidad}/5</span>
                </div>
                <div className="mt-1 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div 
                    className="h-full" 
                    style={{ background: getHeatColor(report.type), width: `${(report.intensidad/5)*100}%` }} 
                   />
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
