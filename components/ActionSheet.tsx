"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Drawer } from 'vaul';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  TrafficCone, 
  Users, 
  Mic, 
  Check, 
  AlertCircle, 
  Sparkles,
  ChevronUp
} from 'lucide-react';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';
import { useVoiceReport } from '@/hooks/useVoiceReport';
import { supabase } from '@/lib/supabase';
import { IncidentType } from '@/types';
import { calculateExpiry } from '@/hooks/useRealtimeReports';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CDMX_CENTER: [number, number] = [19.4326, -99.1332];

export function ActionSheet() {
  const [snap, setSnap] = useState<string | number | null>('70px');
  const { reports } = useRealtimeReports();
  const { startListening, isListening, isProcessing } = useVoiceReport();
  const [isPressing, setIsPressing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IncidentType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const categories = [
    { id: 'inseguridad' as IncidentType, icon: ShieldAlert, label: 'Alerta', color: 'bg-rose-500', angle: -90 },
    { id: 'trafico' as IncidentType, icon: TrafficCone, label: 'Tráfico', color: 'bg-cyan-500', angle: -30 },
    { id: 'saturacion' as IncidentType, icon: Users, label: 'Gente', color: 'bg-amber-500', angle: -150 },
  ];

  const handlePointerDown = () => {
    pressTimer.current = setTimeout(() => {
      setIsPressing(true);
      if (typeof window !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 400);
  };

  const handlePointerUp = async () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (isPressing && selectedCategory) {
      await submitReport(selectedCategory);
    }
    setIsPressing(false);
    setSelectedCategory(null);
  };

  const submitReport = async (type: IncidentType) => {
    const { error } = await supabase.from('reports').insert({
      type,
      linea: 'Reporte de Usuario (Una Mano)',
      intensidad: 3,
      lat: CDMX_CENTER[0] + (Math.random() - 0.5) * 0.01,
      lng: CDMX_CENTER[1] + (Math.random() - 0.5) * 0.01,
      expires_at: calculateExpiry(type).toISOString()
    });

    if (!error) {
      setShowSuccess(true);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  return (
    <Drawer.Root 
      open={true} 
      dismissible={false} 
      modal={false}
      snapPoints={['70px', '320px', '0.9']}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
    >
      <Drawer.Portal>
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col h-full pointer-events-none">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-800 my-4 pointer-events-auto" />
          
          <div className="flex-1 bg-slate-950/95 backdrop-blur-2xl border-t border-white/5 rounded-t-[32px] pointer-events-auto overflow-hidden relative shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            
            {/* Snap 1 & 2 Indicator / Pulse */}
            <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center opacity-30">
               {snap === '70px' && <ChevronUp className="w-6 h-6 text-cyan-500 animate-bounce" />}
            </div>

            <div className="p-6 h-full flex flex-col pt-10">
              
              {/* SNAP 2: QUICK ACTIONS (RADIAL) */}
              <AnimatePresence>
                {(snap === '320px') && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex-1 flex flex-col items-center justify-center -mt-10"
                  >
                    <div className="relative w-64 h-64 flex items-center justify-center">
                      
                      {/* Radial Background Ring */}
                      <div className="absolute inset-0 border-2 border-dashed border-cyan-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
                      
                      {/* Radial Buttons */}
                      <AnimatePresence>
                        {isPressing && (
                          <>
                            {categories.map((cat) => (
                              <motion.div
                                key={cat.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ 
                                  scale: selectedCategory === cat.id ? 1.2 : 1, 
                                  opacity: 1,
                                  x: Math.cos(cat.angle * (Math.PI / 180)) * 100,
                                  y: Math.sin(cat.angle * (Math.PI / 180)) * 100
                                }}
                                exit={{ scale: 0, opacity: 0 }}
                                className={cn(
                                  "absolute w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-xl border-2 transition-all duration-200",
                                  selectedCategory === cat.id ? "scale-125 border-white ring-8 ring-white/10" : "border-white/10",
                                  cat.color
                                )}
                                onPointerEnter={() => setSelectedCategory(cat.id)}
                              >
                                <cat.icon className="w-8 h-8 text-white" />
                                <span className="text-[8px] font-black uppercase mt-1 text-white tracking-tighter">{cat.label}</span>
                              </motion.div>
                            ))}
                          </>
                        )}
                      </AnimatePresence>

                      {/* Main Trigger Button */}
                      <button
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                        className={cn(
                          "relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300",
                          isPressing ? "bg-slate-900 scale-90" : "bg-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.4)]"
                        )}
                      >
                        {showSuccess ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Check className="w-16 h-16 text-emerald-400" />
                          </motion.div>
                        ) : (
                          <AlertCircle className={cn("w-16 h-16 transition-colors", isPressing ? "text-cyan-400" : "text-slate-950")} />
                        )}
                        <AnimatePresence>
                          {!isPressing && !showSuccess && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute -bottom-10 whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-cyan-500/50"
                            >
                              Hold to Report
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>

                      {/* Voice Mic Overlay */}
                      <button 
                         onClick={startListening}
                         className={cn(
                           "absolute -bottom-4 right-0 w-14 h-14 rounded-full flex items-center justify-center transition-all",
                           isListening ? "bg-rose-500 cyan-glow animate-pulse" : "bg-slate-900 border border-white/5"
                         )}
                      >
                        {isListening ? (
                          <div className="flex gap-1 items-center">
                             {[...Array(5)].map((_,i) => <div key={i} className="w-1 h-4 bg-white rounded-full wave-bar" />)}
                          </div>
                        ) : (
                          <Mic className="w-6 h-6 text-cyan-500" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SNAP 3: INTELLIGENCE FEED */}
              <AnimatePresence>
                {snap === '0.9' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 overflow-y-auto no-scrollbar"
                  >
                    {/* NLP AI Summary */}
                    <div className="mb-8 p-5 bg-gradient-to-br from-cyan-950/40 to-slate-900/40 rounded-3xl border border-cyan-500/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="w-12 h-12 text-cyan-400 rotate-12" />
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-cyan-500/20 rounded-xl">
                          <AlertCircle className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Resumen de Resiliencia</span>
                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed font-medium italic">
                        "CDMX Poniente: 2 manifestaciones activas. Ruta Observatorio saturada. Sugerencia: Evita el tramo central por las próximas 2 horas."
                      </p>
                    </div>

                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 px-2">Incidentes Activos</h3>
                    
                    <div className="space-y-4 pb-20">
                      {reports.map((report) => (
                        <div 
                          key={report.id}
                          className={cn(
                            "p-5 rounded-2xl border-l-4 bg-slate-900/40 backdrop-blur-md border border-white/5",
                            report.intensidad >= 4 ? "border-l-rose-500" : 
                            report.intensidad >= 3 ? "border-l-amber-500" : 
                            "border-l-cyan-500"
                          )}
                        >
                          <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                               <div className={cn(
                                 "p-1.5 rounded-lg",
                                 report.type === 'inseguridad' ? 'bg-rose-500/20 text-rose-500' : 'bg-cyan-500/20 text-cyan-400'
                               )}>
                                 {report.type === 'inseguridad' ? <ShieldAlert className="w-4 h-4" /> : <TrafficCone className="w-4 h-4" />}
                               </div>
                               <span className="text-[10px] font-black uppercase text-white/50">{report.type}</span>
                             </div>
                             <span className="text-[10px] font-mono text-slate-500 bg-black/20 px-2 py-0.5 rounded-full">
                                {new Date(report.expires_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} EXP
                             </span>
                          </div>
                          <h4 className="text-white font-bold text-sm tracking-tight mb-2 uppercase">{report.linea}</h4>
                          <div className="h-0.5 bg-white/5 w-full rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(report.intensidad/5)*100}%` }}
                                className={cn(
                                  "h-full",
                                  report.intensidad >= 4 ? "bg-rose-500" : "bg-cyan-500"
                                )}
                             />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
