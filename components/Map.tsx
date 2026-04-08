"use client";

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';
import { Report } from '@/types';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then((mod) => mod.Circle), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

const CDMX_CENTER: [number, number] = [19.4326, -99.1332];

const getHeatColor = (type: string) => {
  switch (type) {
    case 'inseguridad': return '#f43f5e'; // Red
    case 'saturacion': return '#f59e0b'; // Amber
    case 'retraso': return '#3b82f6'; // Blue
    case 'manifestacion': return '#8b5cf6'; // Violet
    default: return '#3b82f6';
  }
};

export function Map() {
  const { reports } = useRealtimeReports();

  return (
    <div className="w-full h-screen absolute inset-0 z-0">
      <MapContainer
        center={CDMX_CENTER}
        zoom={13}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: '#020617' }} // Slate-950
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {reports.map((report: Report) => (
          <Circle
            key={report.id}
            center={[report.lat, report.lng]}
            radius={200 + (report.intensidad * 50)}
            pathOptions={{
              fillColor: getHeatColor(report.type),
              color: getHeatColor(report.type),
              weight: 1,
              opacity: 0.8,
              fillOpacity: 0.4
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 dark:bg-slate-900 border-slate-700">
                <h3 className="font-bold capitalize text-slate-100">{report.type}</h3>
                <p className="text-sm text-slate-300">{report.linea}</p>
                <p className="text-xs text-slate-400">Intensidad: {report.intensidad}/5</p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
