"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Report, IncidentType } from '@/types';
import { addMinutes, isAfter, parseISO } from 'date-fns';

export function calculateExpiry(type: IncidentType): Date {
  const now = new Date();
  const durations: Record<IncidentType, number> = {
    'saturacion': 20,
    'retraso': 45, // Assuming Traffic/Choque corresponds to retraso/tráfico
    'inseguridad': 60,
    'manifestacion': 180,
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
      console.error("Error fetching reports:", error);
      return;
    }
    setReports(data || []);
  }, []);

  useEffect(() => {
    fetchReports();

    const channel = supabase
      .channel('reports-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        (payload) => {
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

  return { reports, refresh: fetchReports };
}
