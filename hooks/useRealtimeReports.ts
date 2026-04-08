"use client";

import { useEffect, useState, useCallback } from 'react';
import { Report, IncidentType } from '@/types';
import { parseISO, isValid } from 'date-fns';

export function useRealtimeReports() {
  const [reports, setReports] = useState<Report[]>([]);

  const fetchReports = useCallback(async () => {
    try {
      // Get current view context from global variables set by ubicacion.js
      const lat = (window as any).lat_global;
      const lng = (window as any).lng_global;

      // If we don't have location yet, we can't contextually fetch, but we try with default or just wait
      if (!lat || !lng) return;

      const formData = new FormData();
      formData.append("latitud", lat.toString());
      formData.append("longitud", lng.toString());
      formData.append("marcadores", "seguridad,emergencia,obstruccion,saturacion,entorno");

      const response = await fetch("https://lookitag.com/motus/controlador/recibir_ubicacion.php", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Fetch failed");
      
      const body = await response.text();
      
      // PARSE THE REAL DATA FROM THE SCRIPT'S RESPONSE
      const blocks = body.split("------------------------------------------------------------");
      const realReports: Report[] = [];

      blocks.forEach((block, index) => {
        if (!block.trim() || !block.includes("Fecha:")) return;

        const fechaMatch = block.match(/Fecha:\s*([^\n]+)/);
        const textoMatch = block.match(/Texto:\s*([\s\S]+?)(?=\nRespuestas:|$)/);

        if (fechaMatch && textoMatch) {
          const dateStr = fechaMatch[1].trim();
          const parsedDate = parseISO(dateStr);
          const createdAt = isValid(parsedDate) ? parsedDate.toISOString() : new Date().toISOString();

          realReports.push({
            id: `real-${index}`,
            created_at: createdAt,
            type: 'entorno', 
            linea: textoMatch[1].trim(),
            intensidad: 3,
            // SIN INVENTAR: No colocamos coordenadas si el script no las manda.
            // Esto hará que no aparezcan en el mapa, pero sí en el Feed.
            lat: 0, 
            lng: 0,
            expires_at: new Date(Date.now() + 3600000).toISOString()
          });
        }
      });

      setReports(realReports);
    } catch (err) {
      console.error("Error fetching real reports:", err);
      setReports([]);
    }
  }, []);

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 10000); // More frequent polling to be "real-time"
    return () => clearInterval(interval);
  }, [fetchReports]);

  return { 
    reports: [...reports].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), 
    refresh: fetchReports 
  };
}
