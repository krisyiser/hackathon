"use client";

import { useEffect, useState, useCallback } from 'react';
import { Report, IncidentType } from '@/types';
import { addMinutes, isAfter, parseISO } from 'date-fns';

const CDMX_CENTER: [number, number] = [19.4326, -99.1332];

export function calculateExpiry(type: IncidentType): Date {
  const now = new Date();
  const durations: Record<IncidentType, number> = {
    seguridad: 30,
    emergencia: 45,
    obstruccion: 120,
    saturacion: 60,
    entorno: 180,
    manifestacion: 180
  };
  return addMinutes(now, durations[type] || 30);
}

export function useRealtimeReports() {
  const [reports, setReports] = useState<Report[]>([]);

  const fetchReports = useCallback(async () => {
    // SUPABASE REMOVED - USING MOCK DATA ONLY
    const mockReports: Report[] = [
      {
        id: '1',
        created_at: new Date(Date.now() - 300000).toISOString(),
        type: 'seguridad',
        linea: 'Metro Estación Hidalgo - Riesgo Crítico',
        intensidad: 4,
        lat: CDMX_CENTER[0] + 0.005,
        lng: CDMX_CENTER[1] + 0.005,
        expires_at: addMinutes(new Date(), 60).toISOString()
      },
      {
        id: '2',
        created_at: new Date(Date.now() - 600000).toISOString(),
        type: 'obstruccion',
        linea: 'Eje Central - Manifestación Activa',
        intensidad: 3,
        lat: CDMX_CENTER[0] - 0.008,
        lng: CDMX_CENTER[1] - 0.002,
        expires_at: addMinutes(new Date(), 120).toISOString()
      },
      {
        id: '3',
        created_at: new Date(Date.now() - 120000).toISOString(),
        type: 'emergencia',
        linea: 'Línea 2 - Falla de Energía',
        intensidad: 5,
        lat: CDMX_CENTER[0] + 0.012,
        lng: CDMX_CENTER[1] - 0.005,
        expires_at: addMinutes(new Date(), 45).toISOString()
      }
    ];
    setReports(mockReports);
  }, []);

  useEffect(() => {
    fetchReports();

    // Periodic cleanup of expired reports in local state
    const cleanupInterval = setInterval(() => {
      const now = new Date();
      setReports((prev) => prev.filter((r) => isAfter(parseISO(r.expires_at), now)));
    }, 60000);

    return () => {
      clearInterval(cleanupInterval);
    };
  }, [fetchReports]);

  return { 
    reports: [...reports].sort((a, b) => {
      // Sort by intensity (Desc) then by creation date (Desc)
      if (b.intensidad !== a.intensidad) return b.intensidad - a.intensidad;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }), 
    refresh: fetchReports 
  };
}
