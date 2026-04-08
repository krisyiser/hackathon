"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Report, IncidentType } from '@/types';
import { addMinutes, isAfter, parseISO } from 'date-fns';
import { 
  ShieldAlert, 
  TrafficCone, 
  Users, 
  Mic, 
  Check, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

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
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .gt('expires_at', new Date().toISOString());

    if (error) {
      console.error("Error fetching reports from Supabase:", error);
      // Fallback to mock data for aesthetics in dev
      const mockReports: Report[] = [
        {
          id: '1',
          created_at: new Date().toISOString(),
          type: 'seguridad',
          linea: 'Metro Estación Hidalgo - Riesgo Crítico',
          intensidad: 4,
          lat: CDMX_CENTER[0] + 0.005,
          lng: CDMX_CENTER[1] + 0.005,
          expires_at: addMinutes(new Date(), 60).toISOString()
        },
        {
          id: '2',
          created_at: new Date().toISOString(),
          type: 'obstruccion',
          linea: 'Eje Central - Manifestación Activa',
          intensidad: 3,
          lat: CDMX_CENTER[0] - 0.008,
          lng: CDMX_CENTER[1] - 0.002,
          expires_at: addMinutes(new Date(), 120).toISOString()
        }
      ];
      setReports(mockReports);
      return;
    }
    setReports(data || []);
  }, []);

  useEffect(() => {
    fetchReports();

    const channel = supabase
      .channel(`reports-realtime-${Math.random().toString(36).substring(7)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        (payload: { eventType: string; new: any; old: any }) => {
          if (payload.eventType === 'INSERT') {
            const newReport = payload.new as Report;
            if (isAfter(parseISO(newReport.expires_at), new Date())) {
              setReports((prev) => [...prev, newReport]);
            }
          } else if (payload.eventType === 'DELETE') {
            setReports((prev) => prev.filter((r) => r.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            const updatedReport = payload.new as Report;
            if (isAfter(parseISO(updatedReport.expires_at), new Date())) {
              setReports((prev) => prev.map((r) => (r.id === updatedReport.id ? updatedReport : r)));
            } else {
              setReports((prev) => prev.filter((r) => r.id !== updatedReport.id));
            }
          }
        }
      )
      .subscribe();

    // Periodic cleanup of expired reports in local state
    const cleanupInterval = setInterval(() => {
      const now = new Date();
      setReports((prev) => prev.filter((r) => isAfter(parseISO(r.expires_at), now)));
    }, 60000);

    return () => {
      supabase.removeChannel(channel);
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
