"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { Report } from '@/types';

export function useRealtimeReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const fetchStarted = useRef(false);

  const fetchReports = useCallback(async (force = false) => {
    // To save Gemini tokens and prevent quota exhaustion, 
    // we only execute this once per session/page load unless forced.
    if (fetchStarted.current && !force) return;
    fetchStarted.current = true;

    try {
      const lat = (window as any).lat_global || 19.4326;
      const lng = (window as any).lng_global || -99.1332;
      const marcadores = (window as any).marcadores || ["seguridad","emergencia","obstruccion","saturacion","entorno"];

      // Check for cached data to show something immediately
      const cached = localStorage.getItem('motus_reports_cache');
      if (cached) {
        try {
          setReports(JSON.parse(cached));
          console.log("Loaded reports from Local Cache (Screenshot).");
        } catch (e) {
          localStorage.removeItem('motus_reports_cache');
        }
      }

      const formData = new FormData();
      formData.append("latitud", lat.toString());
      formData.append("longitud", lng.toString());
      formData.append("marcadores", Array.isArray(marcadores) ? marcadores.join(',') : marcadores);

      console.log("Executory Single Snapshot Fetch to save tokens...");
      const response = await fetch("https://lookitag.com/motus/controlador/recibir_ubicacion.php", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Fetch failed");
      
      const body = await response.text();
      
      if (body.includes("Fatal error") || body.includes("Quota exceeded")) {
        console.warn("Backend Gemini is limited. Keeping existing cache.");
        return;
      }

      let data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        const jsonMatch = body.match(/\[[\s\S]*\]/);
        if (jsonMatch) data = JSON.parse(jsonMatch[0]);
      }

      if (Array.isArray(data)) {
        const parsedReports: Report[] = data.map((item: any, index: number) => ({
          id: `real-${index}-${item.fecha}`,
          created_at: item.fecha,
          type: item.titulo?.toLowerCase().includes('obra') ? 'obstruccion' : 
                item.titulo?.toLowerCase().includes('inseguridad') ? 'seguridad' : 'emergencia',
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
        
        setReports(parsedReports);
        // Persist the "Snapshot"
        localStorage.setItem('motus_reports_cache', JSON.stringify(parsedReports));
        console.log("Snapshot successfully saved to local storage.");
      }
    } catch (err) {
      console.error("Error in snapshot fetch:", err);
    }
  }, []);

  useEffect(() => {
    fetchReports();
    // INTERVAL REMOVED TO PRESERVE API TOKENS
  }, [fetchReports]);

  return { reports, refresh: fetchReports };
}
