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

    console.log("DEMO MODE: Loading static reports from local JSON...");
    try {
      const demoResponse = await fetch("/demo_reports.json");
      const demoData = await demoResponse.json();
      const demoResults = parseData(demoData);
      setReports(demoResults);
      localStorage.setItem('motus_reports_cache', JSON.stringify(demoResults));
    } catch (demoErr) {
      console.error("Critical: Could not load demo data.", demoErr);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, refresh: fetchReports };
}
