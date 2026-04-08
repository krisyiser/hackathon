"use client";

import { useEffect, useState, useCallback } from 'react';
import { Report } from '@/types';

/**
 * useRealtimeReports Hook
 * Currently disabled by user request to leave the feed empty.
 * Will be updated later with new data source.
 */
export function useRealtimeReports() {
  const [reports, setReports] = useState<Report[]>([]);

  const fetchReports = useCallback(async () => {
    // Content temporarily disabled per user instruction.
    setReports([]);
  }, []);

  useEffect(() => {
    fetchReports();
    return () => {};
  }, [fetchReports]);

  return { 
    reports: [] as Report[], 
    refresh: fetchReports 
  };
}
