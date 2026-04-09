"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { Report } from '@/types';

export function useRealtimeReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const fetchStarted = useRef(false);

  const fetchReports = useCallback(async (force = false) => {
    if (fetchStarted.current && !force) return;
    fetchStarted.current = true;

    try {
      // Check for Demo Mode (Hidden switch)
      const isDemoMode = localStorage.getItem('motus_demo_mode') === 'true';
      
      if (isDemoMode) {
        console.log("DEMO MODE ACTIVE: Loading simulated tactical data...");
        const demoResponse = await fetch("/demo_reports.json");
        const demoData = await demoResponse.json();
        
        const types = ['seguridad', 'emergencia', 'obstruccion', 'saturacion', 'entorno'];
        
        const mappedReports: Report[] = demoData.map((item: any, index: number) => ({
          id: `demo-${index}-${Date.now()}`,
          created_at: item.fecha || new Date().toISOString(),
          // Si no tiene tipo, asignar uno aleatorio para que se vea variado en el mapa
          type: item.tipo?.toLowerCase() || types[index % types.length],
          linea: item.titulo || 'Simulación Motus',
          description: item.descripcion || 'Dato simulado para demostración.',
          intensidad: 3,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lng),
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          metadata: {
            calle: item.direccion || item.calle,
            direccion: item.direccion_objeto || item.direccion
          }
        }));
        setReports(mappedReports);
        return;
      }

      // Intentar obtener ubicación global (compartida con ubicacion.js)
      const lat = (window as any).lat_global || "19.4326";
      const lng = (window as any).lng_global || "-99.1332";

      const formData = new FormData();
      formData.append("latitud", lat.toString());
      formData.append("longitud", lng.toString());
      formData.append("marcadores", "seguridad,emergencia,obstruccion,saturacion,entorno");

      const response = await fetch("https://lookitag.com/motus/controlador/recibir_ubicacion.php", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Network response was not ok");
      
      const bodyText = await response.text();
      if (bodyText.toLowerCase().includes("error")) {
        console.warn("Server returned error message:", bodyText);
        return;
      }

      const data = JSON.parse(bodyText);
      
      const mappedReports: Report[] = data.map((item: any, index: number) => ({
        id: item.id || `live-${index}-${item.fecha}`,
        created_at: item.fecha || new Date().toISOString(),
        type: item.tipo?.toLowerCase().includes('seguridad') ? 'seguridad' :
              item.tipo?.toLowerCase().includes('emergencia') ? 'emergencia' :
              item.tipo?.toLowerCase().includes('obstruccion') ? 'obstruccion' :
              item.tipo?.toLowerCase().includes('saturacion') ? 'saturacion' : 'entorno',
        linea: item.titulo || 'Alerta Motus',
        description: item.descripcion || 'Sin descripción detallada.',
        intensidad: item.intensidad || 3,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lng),
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        metadata: {
          calle: item.direccion || item.calle,
          direccion: item.direccion_objeto || item.direccion
        }
      }));

      setReports(mappedReports);
      localStorage.setItem('motus_live_reports_cache', JSON.stringify(mappedReports));
    } catch (err) {
      console.error("Error fetching live reports:", err);
      // Fallback to cache if exists
      const cache = localStorage.getItem('motus_live_reports_cache');
      if (cache) setReports(JSON.parse(cache));
    }
  }, []);

  useEffect(() => {
    fetchReports();
    const interval = setInterval(() => fetchReports(true), 15000); // Auto-refresh every 15s
    return () => clearInterval(interval);
  }, [fetchReports]);

  return { reports, refresh: () => fetchReports(true) };
}
