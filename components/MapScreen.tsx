/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-css-tags */
"use client";

import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';

export function MapScreen() {
  const { reports } = useRealtimeReports();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Only run if google maps is not loaded yet
    if (typeof window !== "undefined" && !(window as any).google) {
      const g = {
        key: "AIzaSyBEXm0irWiTFBPH4536b5T9qftzeqO4kbs",
        v: "weekly"
      };
      
      // eslint-disable-next-line
      let h: any, a: any, k: any, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b: any = window;
      b = b[c] || (b[c] = {});
      // eslint-disable-next-line
      let d = b.maps || (b.maps = {});
      // eslint-disable-next-line
      let r = new Set(), e = new URLSearchParams();
      // eslint-disable-next-line
      let u = () => h || (h = new Promise(async (f, n) => {
        a = m.createElement("script");
        e.set("libraries", [...Array.from(r)].join(","));
        for (k in g) e.set(k.replace(/[A-Z]/g, (t: string) => "_" + t[0].toLowerCase()), (g as any)[k]);
        e.set("callback", c + ".maps." + q);
        a.src = "https://maps.googleapis.com/maps/api/js?" + e;
        d[q] = f;
        a.onerror = () => h = n(Error(p + " no se pudo cargar."));
        a.nonce = (m.querySelector("script[nonce]") as any)?.nonce || "";
        m.head.append(a);
      }));
      // eslint-disable-next-line
      d[l] ? console.warn(p + " solo se carga una vez. Ignorando:", g)
        // eslint-disable-next-line
        : d[l] = (f: any, ...n: any[]) => r.add(f) && u().then(() => d[l](f, ...n));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any;

    const initMap = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { Map, InfoWindow } = await (window as any).google.maps.importLibrary("maps");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { AdvancedMarkerElement } = await (window as any).google.maps.importLibrary("marker");

      const ubicacion_inicial = { lat: 19.4326, lng: -99.1332 };

      const mapElement = document.getElementById("mapa");
      if (!mapElement) return;

      map = new Map(mapElement, {
        center: ubicacion_inicial,
        zoom: 15,
        mapId: "motus_google_map_id" // required for AdvancedMarkerElement
      });

      const infoWindow = new InfoWindow();

      // Read from the global variables populated by ubicacion.js if available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const globalLat = (window as any).lat_global;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const globalLng = (window as any).lng_global;

      if (globalLat && globalLng) {
         const ubicacion_actual = { lat: globalLat, lng: globalLng };
         map.setCenter(ubicacion_actual);

         new AdvancedMarkerElement({
           map,
           position: ubicacion_actual,
           title: "Tu ubicación actual"
         });
         infoWindow.open(map);
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          posicion => {
            const ubicacion_actual = {
              lat: posicion.coords.latitude,
              lng: posicion.coords.longitude
            };

            map.setCenter(ubicacion_actual);

            new AdvancedMarkerElement({
              map,
              position: ubicacion_actual,
              title: "Tu ubicación actual"
            });

            infoWindow.open(map);
          },
          () => {
            mostrarErrorUbicacion(infoWindow, ubicacion_inicial, true);
          }
        );
      } else {
        mostrarErrorUbicacion(infoWindow, ubicacion_inicial, false);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mostrarErrorUbicacion = (infoWindow: any, posicion: any, navegadorSoportaGeo: boolean) => {
      infoWindow.setPosition(posicion);
      infoWindow.setContent(
        navegadorSoportaGeo
          ? "No se pudo obtener tu ubicación actual."
          : "Tu navegador no soporta geolocalización."
      );
      if (map) infoWindow.open(map);
    };

    // Try starting initMap immediately if possible, or wait a timeout to allow script load
    setTimeout(() => {
       if ((window as any).google) {
          initMap();
       }
    }, 500);

  }, []);

  if (!isMounted) return <div className="w-full h-screen bg-black" />;

  return (
    <div className="w-full h-full relative overflow-hidden bg-white">
      <Head>
        <link rel="stylesheet" href="/principal.css" />
      </Head>
      <Script
        src="/ubicacion.js"
        strategy="afterInteractive"
      />

      <button id="btn_dar_permisos" style={{ display: 'none' }} />

      <div id="mapa" className="w-full h-full z-50"></div>
    </div>
  );
}
