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
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  <h2 className="text-xl font-black tracking-tighter text-white uppercase italic">Status<span className="text-blue-500">_</span>Red</h2>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">CDMX Resilient Hub • {reports.length} Nodes</p>
              </div>
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500/50" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Report / Medium State */}
            <AnimatePresence>
              {(snap === '300px' || snap === '120px') && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative flex flex-col items-center justify-center py-6"
                >
                  {/* Reporting Radial */}
                  <div className="relative flex items-center justify-center p-12">
                    <AnimatePresence>
                      {isPressing && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]" 
                        />
                      )}
                    </AnimatePresence>

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
                                x: Math.cos((idx * 120 - 90) * (Math.PI / 180)) * 120,
                                y: Math.sin((idx * 120 - 90) * (Math.PI / 180)) * 120
                              }}
                              exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                              whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
                              onClick={() => handleQuickReport(cat.id)}
                              className={cn(
                                "absolute z-20 w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-2xl border-2 border-white/20 overflow-hidden",
                                cat.color
                              )}
                            >
                              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
                              <cat.icon className="w-6 h-6 text-white relative z-10" />
                              <span className="text-[8px] text-white font-black uppercase mt-1 relative z-10 tracking-tighter">{cat.label}</span>
                            </motion.button>
                          ))}
                        </>
                      )}
                    </AnimatePresence>

                    {/* Main Pulse Button */}
                    <motion.button
                      onPointerDown={() => setIsPressing(true)}
                      onPointerUp={() => setTimeout(() => setIsPressing(false), 300)}
                      className="relative z-10 group"
                    >
                      <motion.div
                        animate={{ scale: isPressing ? [1, 1.2, 1] : 1 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -inset-4 bg-blue-500/10 rounded-full border border-blue-500/20"
                      />
                      <div className="relative w-28 h-28 bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent" />
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                          className="absolute inset-0 border-[3px] border-transparent border-t-blue-500/40 rounded-full" 
                        />
                        <AlertCircle className={cn("w-12 h-12 transition-colors", isPressing ? "text-blue-400" : "text-slate-400")} />
                      </div>
                    </motion.button>

                    {/* Microphone / Voice */}
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={async () => {
                        const res = await startListening();
                        if (res) {
                           supabase.from('reports').insert({
                              type: res.incidente,
                              linea: res.ubicacion_relativa,
                              intensidad: res.gravedad,
                              lat: CDMX_CENTER[0] + (Math.random()-0.5)*0.01,
                              lng: CDMX_CENTER[1] + (Math.random()-0.5)*0.01,
                              expires_at: calculateExpiry(res.incidente).toISOString()
                           });
                        }
                      }}
                      className={cn(
                        "absolute -right-20 w-16 h-16 rounded-full flex items-center justify-center transition-all border-2",
                        isListening 
                          ? "bg-rose-500 border-rose-400 animate-pulse glow-rose" 
                          : "bg-slate-900 border-slate-800 text-blue-500"
                      )}
                    >
                      <Mic className={cn("w-6 h-6", isListening ? "text-white" : "text-blue-500")} />
                      <AnimatePresence>
                        {isListening && (
                           <motion.div 
                             initial={{ scale: 0.8, opacity: 0 }}
                             animate={{ scale: 1.5, opacity: 0.5 }}
                             exit={{ scale: 0.8, opacity: 0 }}
                             className="absolute inset-0 border-2 border-rose-500 rounded-full"
                           />
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feed / Expanded State */}
            <div className="mt-8 flex-1 overflow-y-auto custom-scrollbar pb-20 px-1">
              {/* Concierge de Seguridad AI */}
              <div className="mb-10 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative p-5 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                        <ShieldAlert className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Safety_Concierge_v2</span>
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed font-medium">
                    {isProcessing ? "Analizando tráfico de red..." : reports.some(r => r.type === 'inseguridad') 
                      ? "ANOMALÍA DETECTADA: Se reportan incidentes de inseguridad críticos en tu perímetro cardinal. Sugerimos protocolos de desvío via Eje Central." 
                      : "SITUACIÓN NOMINAL: No se detectan fricciones críticas en el pulso urbano actual. Rutas operativas al 98%."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-blue-500 rounded-full" />
                  <h3 className="text-slate-100 text-xs font-black uppercase tracking-widest italic">Live_Feed</h3>
                </div>
                <div className="px-2 py-1 bg-white/5 rounded text-[8px] font-bold text-slate-500 uppercase">Order By Severity</div>
              </div>
              
              <div className="space-y-4">
                {reports.length === 0 ? (
                  <div className="text-center py-16 opacity-30">
                    <div className="inline-block p-4 border border-dashed border-slate-700 rounded-full mb-4">
                      <ShieldAlert className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Zone Clear • Scanning...</p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={report.id}
                      className="p-5 bg-slate-900/40 rounded-2xl border border-white/5 flex items-start gap-4 hover:bg-slate-900/60 transition-colors group"
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10 relative overflow-hidden",
                        report.type === 'inseguridad' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                        report.type === 'saturacion' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      )}>
                        <div className="absolute inset-0 bg-current opacity-5 group-hover:opacity-10 transition-opacity" />
                        {report.type === 'inseguridad' ? <ShieldAlert className="w-6 h-6" /> : 
                         report.type === 'saturacion' ? <Users className="w-6 h-6" /> : 
                         <TrafficCone className="w-6 h-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-[0.2em]",
                            report.type === 'inseguridad' ? 'text-rose-500' :
                            report.type === 'saturacion' ? 'text-amber-500' :
                            'text-blue-500'
                          )}>{report.type}</span>
                          <span className="text-[10px] text-slate-600 font-mono italic">{new Date(report.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <h4 className="text-slate-100 font-bold text-sm truncate uppercase tracking-tight">{report.linea}</h4>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1 h-1 bg-slate-800/80 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(report.intensidad / 5) * 100}%` }}
                              className={cn(
                                "h-full",
                                report.type === 'inseguridad' ? 'bg-rose-500' : 'bg-blue-500'
                              )}
                            />
                          </div>
                          <span className="text-[9px] text-slate-500 font-black">LVL_{report.intensidad}</span>
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
