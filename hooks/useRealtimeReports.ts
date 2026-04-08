"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { Report } from '@/types';

export function useRealtimeReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const fetchStarted = useRef(false);

  const fetchReports = useCallback(async (force = false) => {
    if (fetchStarted.current && !force) return;
    fetchStarted.current = true;

    const parseData = (data: any[]): Report[] => {
      return data.map((item: any, index: number) => ({
        id: `real-${index}-${item.fecha}`,
        created_at: item.fecha,
        type: item.titulo?.toLowerCase().includes('obra') || item.titulo?.toLowerCase().includes('bache') ? 'obstruccion' : 
              item.titulo?.toLowerCase().includes('agua') || item.titulo?.toLowerCase().includes('gas') ? 'emergencia' : 
              item.titulo?.toLowerCase().includes('alumbrado') || item.titulo?.toLowerCase().includes('semaforo') ? 'entorno' : 'seguridad',
        linea: item.titulo || 'Alerta de Movilidad',
        description: item.descripcion,
        intensidad: 3,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lng),
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        metadata: {
          calle: item.calle,
          calle_colindante: item.calle_colindante,
          direccion: item.direccion_objeto
        }
      }));
    };

    try {
      const lat = (window as any).lat_global || 19.4326;
      const lng = (window as any).lng_global || -99.1332;
      const marcadores = (window as any).marcadores || ["seguridad","emergencia","obstruccion","saturacion","entorno"];

      // Start with cache
      const cached = localStorage.getItem('motus_reports_cache');
      if (cached) setReports(JSON.parse(cached));

      const formData = new FormData();
      formData.append("latitud", lat.toString());
      formData.append("longitud", lng.toString());
      formData.append("marcadores", Array.isArray(marcadores) ? marcadores.join(',') : marcadores);

      const response = await fetch("https://lookitag.com/motus/controlador/recibir_ubicacion.php", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Fetch failed");
      
      const body = await response.text();
      
      if (body.includes("Fatal error") || body.includes("Quota exceeded") || body.trim() === "") {
        throw new Error("Backend Quota Limit reached");
      }

      let data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        const jsonMatch = body.match(/\[[\s\S]*\]/);
        if (jsonMatch) data = JSON.parse(jsonMatch[0]);
      }

      if (Array.isArray(data) && data.length > 0) {
        const results = parseData(data);
        setReports(results);
        localStorage.setItem('motus_reports_cache', JSON.stringify(results));
      } else {
        throw new Error("No data returned");
      }
    } catch (err) {
      console.warn("Backend unavailable or limited. Loading DEMO DATA as fallback.");
      try {
        const demoResponse = await fetch("/demo_reports.json");
        const demoData = await demoResponse.json();
        const demoResults = parseData(demoData);
        setReports(demoResults);
        localStorage.setItem('motus_reports_cache', JSON.stringify(demoResults));
      } catch (demoErr) {
        console.error("Critical: Could not load demo data.", demoErr);
      }
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, refresh: fetchReports };
}
