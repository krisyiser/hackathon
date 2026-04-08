"use client";

import React, { useState, useRef } from 'react';
import { Drawer } from 'vaul';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { ShieldAlert, TrafficCone, Users, Mic, Send, AlertCircle, X } from 'lucide-react';
import { useVoiceReport } from '@/hooks/useVoiceReport';
import { useRealtimeReports, calculateExpiry } from '@/hooks/useRealtimeReports';
import { supabase } from '@/lib/supabase';
import { IncidentType } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CDMX_CENTER = [19.4326, -99.1332]; // Hardcoded for report placeholder

export function ActionSheet() {
  const [snap, setSnap] = useState<string | number | null>('120px');
  const [isPressing, setIsPressing] = useState(false);
  const pressTimer = useRef<any>(null);
  const { reports } = useRealtimeReports();
  const { startListening, isListening, isProcessing } = useVoiceReport();

  const handleQuickReport = async (type: IncidentType) => {
    const expiresAt = calculateExpiry(type);
    
    // Simulate getting current user location (using center for now)
    const { error } = await supabase.from('reports').insert({
      type,
      linea: 'Reporte Rápido',
      intensidad: 3,
      lat: CDMX_CENTER[0] + (Math.random() - 0.5) * 0.05,
      lng: CDMX_CENTER[1] + (Math.random() - 0.5) * 0.05,
      expires_at: expiresAt.toISOString()
    });

    if (error) console.error("Error creating report:", error);
    setIsPressing(false);
  };

  const categories = [
    { id: 'inseguridad' as IncidentType, icon: ShieldAlert, color: 'bg-rose-500', label: 'Inseguridad' },
    { id: 'retraso' as IncidentType, icon: TrafficCone, color: 'bg-blue-500', label: 'Tráfico' },
    { id: 'saturacion' as IncidentType, icon: Users, color: 'bg-amber-500', label: 'Saturación' },
  ];

  return (
    <Drawer.Root
      open={true}
      dismissible={false}
      modal={false}
      snapPoints={['120px', '300px', '90%']}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
    >
      <Drawer.Trigger asChild>
        <button className="sr-only">Open</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex h-full flex-col outline-none">
          <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 bg-slate-700/50 rounded-full" />
          
          <div className="flex h-full flex-col bg-slate-950/80 backdrop-blur-xl rounded-t-[32px] border-t border-white/10 shadow-2xl p-6 overflow-hidden">
            
            {/* Header / Minimized State */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Urban Pulse</h2>
                <p className="text-xs text-slate-400 font-medium">CDMX Resiliente • {reports.length} reportes activos</p>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur animate-pulse" />
                <div className="relative h-3 w-3 bg-blue-500 rounded-full" />
              </div>
            </div>

            {/* Quick Report / Medium State */}
            <AnimatePresence>
              {(snap === '300px' || snap === '120px') && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="relative flex flex-col items-center justify-center py-4"
                >
                  <p className="text-slate-400 text-sm mb-6 font-medium">Mantén presionado para reportar</p>
                  
                  {/* Radial Menu / Reporting Button */}
                  <div className="relative flex items-center justify-center">
                    {/* Radial Options */}
                    <AnimatePresence>
                      {isPressing && (
                        <>
                          {categories.map((cat, idx) => (
                            <motion.button
                              key={cat.id}
                              initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                              animate={{ 
                                scale: 1, 
                                opacity: 1, 
                                x: Math.cos((idx * 120 - 90) * (Math.PI / 180)) * 100,
                                y: Math.sin((idx * 120 - 90) * (Math.PI / 180)) * 100
                              }}
                              exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                              onClick={() => handleQuickReport(cat.id)}
                              className={cn("absolute z-20 w-14 h-14 rounded-full flex items-center justify-center shadow-lg", cat.color)}
                            >
                              <cat.icon className="w-6 h-6 text-white" />
                              <span className="absolute -bottom-6 text-[10px] text-white font-bold uppercase">{cat.label}</span>
                            </motion.button>
                          ))}
                        </>
                      )}
                    </AnimatePresence>

                    {/* Main Pulse Button */}
                    <motion.button
                      onPointerDown={() => {
                        setIsPressing(true);
                      }}
                      onPointerUp={() => {
                        // Logic to send report if dragged to a specific zone? 
                        // For now we use the radial buttons directly if pressed.
                        // If they just let go, we close it.
                        setTimeout(() => setIsPressing(false), 2000);
                      }}
                      className="relative z-10 w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] border-4 border-blue-400/30"
                    >
                      <motion.div
                        animate={{ scale: isPressing ? 1.5 : 1 }}
                        className="absolute inset-0 bg-blue-500 rounded-full opacity-20"
                      />
                      <AlertCircle className="w-10 h-10 text-white" />
                    </motion.button>

                    {/* Microphone Button */}
                    <button 
                      onClick={async () => {
                        const res = await startListening();
                        if (res) {
                           // Automatic insert from voice
                           supabase.from('reports').insert({
                              type: res.incidente,
                              linea: res.ubicacion_relativa,
                              intensidad: res.gravedad,
                              lat: CDMX_CENTER[0],
                              lng: CDMX_CENTER[1],
                              expires_at: calculateExpiry(res.incidente).toISOString()
                           });
                        }
                      }}
                      className={cn(
                        "absolute -right-16 w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        isListening ? "bg-red-500 animate-pulse" : "bg-slate-800 border border-slate-700"
                      )}
                    >
                      <Mic className={cn("w-5 h-5", isListening ? "text-white" : "text-blue-400")} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feed / Expanded State */}
            <div className="mt-8 flex-1 overflow-y-auto custom-scrollbar pb-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-200 font-semibold">Incidentes Activos</h3>
              </div>
              
              <div className="space-y-4">
                {reports.length === 0 ? (
                  <div className="text-center py-10 opacity-50">
                    <p className="text-slate-400">Todo tranquilo en la ciudad</p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <motion.div 
                      layout
                      key={report.id}
                      className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-4"
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        report.type === 'inseguridad' ? 'bg-rose-500/20 text-rose-500' :
                        report.type === 'saturacion' ? 'bg-amber-500/20 text-amber-500' :
                        'bg-blue-500/20 text-blue-500'
                      )}>
                        {report.type === 'inseguridad' ? <ShieldAlert className="w-5 h-5" /> : 
                         report.type === 'saturacion' ? <Users className="w-5 h-5" /> : 
                         <TrafficCone className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{report.type}</span>
                          <span className="text-[10px] text-slate-500">{new Date(report.created_at).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-slate-100 font-medium">{report.linea}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500" 
                              style={{ width: `${(report.intensidad / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500">I:{report.intensidad}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
