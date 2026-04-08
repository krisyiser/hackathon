"use client";

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';

interface GlobalWin extends Window {
  lat_global?: number;
  lng_global?: number;
  google: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function MapScreen() {
  const { reports } = useRealtimeReports();
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMap = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // OFFICIAL API KEY FOUND IN LOOKITAG.COM/MOTUS/
  const GOOGLE_MAPS_API_KEY = "AIzaSyBEXm0irWiTFBPH4536b5T9qftzeqO4kbs";

  useEffect(() => {
    if (!googleLoaded || !mapRef.current) return;

    const initMotusMap = async () => {
      const win = window as unknown as GlobalWin;
      const { Map } = await win.google.maps.importLibrary("maps");
      const { AdvancedMarkerElement, PinElement } = await win.google.maps.importLibrary("marker");

      const initialPos = { 
        lat: win.lat_global || 19.4326, 
        lng: win.lng_global || -99.1332 
      };

      googleMap.current = new Map(mapRef.current, {
        zoom: 16,
        center: initialPos,
        mapId: "MOTUS_MAP_ID",
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
      });

      const userPin = new PinElement({
        background: "#3b82f6",
        borderColor: "#ffffff",
        glyphColor: "#ffffff",
        scale: 1.2
      });

      userMarkerRef.current = new AdvancedMarkerElement({
        map: googleMap.current,
        position: initialPos,
        content: userPin.element,
        title: "Tu Ubicación"
      });

      const locationInterval = setInterval(() => {
        if (win.lat_global && win.lng_global && userMarkerRef.current) {
          const newPos = { lat: win.lat_global, lng: win.lng_global };
          userMarkerRef.current.position = newPos;
          googleMap.current.setCenter(newPos);
        }
      }, 2000);

      return () => clearInterval(locationInterval);
    };

    initMotusMap();
  }, [googleLoaded]);

  useEffect(() => {
    if (!googleMap.current || !googleLoaded) return;

    const renderMarkers = async () => {
      const win = window as unknown as GlobalWin;
      const { AdvancedMarkerElement, PinElement } = await win.google.maps.importLibrary("marker");

      markersRef.current.forEach(m => { m.map = null; });
      markersRef.current = [];

      reports.forEach(report => {
        const colors: Record<string, string> = {
          seguridad: '#F21314',
          emergencia: '#FF6B00',
          obstruccion: '#F2FD14',
          saturacion: '#02D701',
          entorno: '#14C9D9'
        };

        const pin = new PinElement({
          background: colors[report.type] || '#14C9D9',
          borderColor: "#ffffff",
          glyphColor: "#ffffff",
          scale: 1.0
        });

        const marker = new AdvancedMarkerElement({
          map: googleMap.current,
          position: { lat: report.lat, lng: report.lng },
          content: pin.element,
          title: report.linea
        });

        marker.addListener("click", () => {
          const infoWindow = new win.google.maps.InfoWindow({
            content: `
              <div style="color:#000; padding:8px; font-family:sans-serif;">
                <h4 style="margin:0 0 4px 0; font-weight:900; text-transform:uppercase;">${report.linea}</h4>
                <p style="margin:0; font-size:12px;">${report.description || ''}</p>
              </div>
            `
          });
          infoWindow.open(googleMap.current, marker);
        });

        markersRef.current.push(marker);
      });
    };

    renderMarkers();
  }, [reports, googleLoaded]);

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden relative">
      <div 
        id="mapa" 
        ref={mapRef} 
        className="flex-1 w-full h-full relative z-0"
      />
      
      <Script 
        src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=maps,marker&v=beta`}
        strategy="afterInteractive"
        onLoad={() => setGoogleLoaded(true)}
      />

      <Script src="/ubicacion.js" strategy="afterInteractive" />
    </div>
  );
}
