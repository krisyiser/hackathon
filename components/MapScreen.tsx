"use client";

import dynamic from 'next/dynamic';
import Script from 'next/script';
import Head from 'next/head';
import 'leaflet/dist/leaflet.css';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';
import { Report } from '@/types';
import { useEffect, useState, useRef } from 'react';
import { useMap } from 'react-leaflet';

// Dynamically import Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

const CDMX_CENTER: [number, number] = [19.4326, -99.1332];

// Component to handle map view updates
function MapRefresher({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] !== 0) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export function MapScreen() {
  const { reports } = useRealtimeReports();
  const [isMounted, setIsMounted] = useState(false);
  const [LReady, setLReady] = useState(false);
  const [userPos, setUserPos] = useState<[number, number]>(CDMX_CENTER);
  const hasCentered = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Proper way to load Leaflet and its global instance
    const initLeaflet = async () => {
      const L = (await import('leaflet')).default;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).L = L;
      setLReady(true);
    };

    initLeaflet();

    const checkInterval = setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lat = (window as any).lat_global;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lng = (window as any).lng_global;
        
        if (lat && lng && (lat !== userPos[0] || lng !== userPos[1])) {
            setUserPos([lat, lng]);
            if (!hasCentered.current) {
               hasCentered.current = true;
            }
        }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [userPos]);

  const getMarkerIcon = (isUser = false, type = 'entorno') => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L;
    if (!L) return null;

    if (isUser) {
      return L.divIcon({
        className: 'user-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping"></div>
            <div class="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });
    }

    const neonColors: Record<string, string> = {
      seguridad: '#F21314',
      emergencia: '#FF6B00',
      obstruccion: '#F2FD14',
      saturacion: '#02D701',
      entorno: '#14C9D9'
    };

    const color = neonColors[type] || '#14C9D9';

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
    });
  };

  if (!isMounted) return <div className="w-full h-screen bg-black" />;

  return (
    <div className="w-full h-full relative overflow-hidden bg-white">
      <Head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/principal.css" />
      </Head>
      <Script
        src="/ubicacion.js"
        strategy="afterInteractive"
      />

      <button id="btn_dar_permisos" style={{ display: 'none' }} />

      <MapContainer
        id="mapa"
        center={userPos}
        zoom={17}
        className="w-full h-full z-50"
        zoomControl={false}
        attributionControl={false}
      >
        <MapRefresher center={userPos} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {LReady && (
          <>
            <Marker position={userPos} icon={getMarkerIcon(true)!} />

            {reports.map((report) => {
              if (!report.lat || !report.lng) return null;
              
              const icon = getMarkerIcon(false, report.type);
              if (!icon) return null;

              return (
                <Marker
                  key={report.id}
                  position={[report.lat, report.lng]}
                  icon={icon}
                >
                  <Popup className="premium-popup">
                    <div className="p-6 glass-premium rounded-[24px] border-white/30 text-black min-w-[200px] shadow-2xl">
                       <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-40">Reporte Recibido</p>
                       <p className="text-sm font-bold leading-tight uppercase italic">{report.linea}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </>
        )}
      </MapContainer>
    </div>
  );
}
