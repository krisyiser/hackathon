"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { Report } from '@/types';

export function useRealtimeReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const hasLoadedRef = useRef(false);

  const fetchReports = useCallback(async () => {
    try {
      const lat = (window as any).lat_global;
      const lng = (window as any).lng_global;
      const marcadores = (window as any).marcadores || ["seguridad","emergencia","obstruccion","saturacion","entorno"];

      // If coordinates are not ready yet, we will retry in the next interval
      if (!lat || !lng) return;

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
      console.log("Raw Server Response:", body);
      
      let data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        const jsonMatch = body.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          data = JSON.parse(jsonMatch[0]);
        }
      }

      console.log("Parsed Data Array:", data);

      if (Array.isArray(data)) {
        const parsedReports: Report[] = data.map((item: any, index: number) => {
          const reportLat = parseFloat(item.lat);
          const reportLng = parseFloat(item.lng);
          
          return {
            id: `real-${index}-${item.fecha}`,
            created_at: item.fecha,
            type: item.titulo?.toLowerCase().includes('obra') ? 'obstruccion' : 
                  item.titulo?.toLowerCase().includes('inseguridad') ? 'seguridad' : 'emergencia',
            linea: item.titulo || 'Alerta de Movilidad',
            description: item.descripcion,
            intensidad: 3,
            lat: reportLat,
            lng: reportLng,
            expires_at: new Date(Date.now() + 3600000).toISOString(),
            metadata: {
              calle: item.calle,
              calle_colindante: item.calle_colindante,
              direccion: item.direccion_objeto
            }
          };
        });
        console.log("Final Parsed Reports applied to state:", parsedReports);
        setReports(parsedReports);
        hasLoadedRef.current = true;
      }
    } catch (err) {
      console.error("Error fetching real reports:", err);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchReports();
    
    // Polling every 10 seconds to keep feed updated
    const interval = setInterval(fetchReports, 10000);
    
    return () => clearInterval(interval);
  }, [fetchReports]);

  return { 
    reports, // RETURN THE STATE, NOT AN EMPTY ARRAY
    refresh: fetchReports 
  };
}
