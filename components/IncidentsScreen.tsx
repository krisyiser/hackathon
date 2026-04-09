"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';
import { 
  ShieldAlert, 
  TrafficCone, 
  Users, 
  Zap, 
  Activity,
  Share2,
  CheckCircle,
  X,
  Navigation,
  Info,
  ArrowUpRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Report as Incident } from '@/types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function IncidentsScreen() {
  const { reports } = useRealtimeReports();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const allReports: Incident[] = [...reports].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  interface CategoryConfig {
    icon: React.ElementType;
    color: string;
    bg: string;
    label: string;
    hex: string;
  }

  const categoryConfigs: Record<string, CategoryConfig> = {
    seguridad: { icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/20', label: 'SEGURIDAD', hex: '#F21314' },
    emergencia: { icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/20', label: 'EMERGENCIA', hex: '#FF6B00' },
    obstruccion: { icon: TrafficCone, color: 'text-amber-500', bg: 'bg-amber-500/20', label: 'OBSTRUCCIÓN', hex: '#F2FD14' },
    saturacion: { icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/20', label: 'SATURACIÓN', hex: '#02D701' },
    entorno: { icon: Activity, color: 'text-cyan-500', bg: 'bg-cyan-500/20', label: 'ENTORNO', hex: '#14C9D9' }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-black px-4 sm:px-6 pt-10 sm:pt-16 pb-48 no-scrollbar relative">
      <div className="mb-12 sm:mb-20 px-2 flex items-end justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2 sm:mb-4"
          >
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
             <span className="text-[8px] sm:text-[10px] font-black text-cyan-400/80 uppercase tracking-widest truncate">Operación Activa CDMX</span>
          </motion.div>
          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.9] mix-blend-difference break-words">Inteligencia<br/><span className="text-white/20">Urbana.</span></h3>
        </div>
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[32px] glass-premium flex items-center justify-center border-white/10 shadow-2xl relative group overflow-hidden shrink-0">
           <Activity className="w-7 h-7 sm:w-10 sm:h-10 text-cyan-400 animate-pulse" strokeWidth={3} />
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <AnimatePresence mode="popLayout">
          {allReports.length > 0 ? (
            allReports.map((report, idx) => {
              const config = categoryConfigs[report.type] || categoryConfigs.entorno;
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedIncident(report)}
                  className="group relative w-full mb-4"
                >
                  <div 
                    className="absolute -inset-1 rounded-[32px] sm:rounded-[44px] opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700 pointer-events-none" 
                    style={{ background: config.hex + '33' }}
                  />

                  <div className="relative glass-card-premium p-6 sm:p-10 rounded-[40px] border-white/10 hover:border-white/20 transition-all duration-700 cursor-pointer overflow-hidden flex flex-col gap-6 shadow-2xl w-full">
                    <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 pointer-events-none" style={{ background: config.hex }} />
                    <div className="flex justify-between items-center gap-4 w-full relative z-10">
                        <div className="flex-1 flex items-center gap-5 sm:gap-8 min-w-0">
                           <div className={cn("w-14 h-14 sm:w-20 sm:h-20 rounded-[28px] flex items-center justify-center shadow-2xl relative shrink-0", config.bg, config.color)}>
                              <div className="absolute inset-0 rounded-[28px] blur-lg opacity-40" style={{ backgroundColor: config.hex }} />
                              <config.icon className="w-7 h-7 sm:w-10 sm:h-10 relative z-10" strokeWidth={2.5} />
                           </div>
                           <div className="flex flex-col gap-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 animate-pulse">ALERTA {config.label}</span>
                                <div className="h-px flex-1 bg-white/5" />
                              </div>
                              <span className="text-xl sm:text-3xl font-black text-white tracking-tighter uppercase italic group-hover:text-cyan-400 transition-colors leading-[1.1] break-words pr-2">
                                 {report.linea}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <Navigation className="w-2.5 h-2.5 text-white/20" />
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest truncate">{report.metadata?.direccion || 'ZONA METROPOLITANA'}</span>
                              </div>
                           </div>
                        </div>
                        <div className="shrink-0 group-hover:translate-x-1 transition-transform">
                           <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                              <ArrowUpRight className="w-6 h-6 text-white/20 group-hover:text-cyan-400" />
                           </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-6 relative z-10">
                       <div className="flex items-center gap-4">
                          <div className="flex gap-1.5">
                             {[...Array(5)].map((_, i) => (
                               <div key={i} className={cn("w-8 h-1 rounded-full transition-all duration-1000", i < report.intensidad ? config.bg : 'bg-white/5')} />
                             ))}
                          </div>
                          <span className="text-[9px] font-black text-white/20 tracking-widest uppercase">NIVEL {report.intensidad}</span>
                       </div>
                       <div className="text-[10px] font-bold text-white/40 font-mono tracking-tighter bg-white/5 px-3 py-1 rounded-lg italic">
                          {new Date(report.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                       </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="w-16 h-16 rounded-full glass-premium flex items-center justify-center mb-6 border-white/5">
                  <Activity className="text-white/10 animate-pulse" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Sincronizando transmisiones tácticas...</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedIncident && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center bg-black/95 backdrop-blur-3xl px-0 sm:px-10"
          >
            <motion.div 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="w-full max-w-3xl bg-[#050505] rounded-t-[40px] sm:rounded-[64px] border-t sm:border border-white/10 relative overflow-hidden shadow-2xl h-[90vh] sm:h-auto flex flex-col"
            >
               <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${categoryConfigs[selectedIncident.type].hex}66, transparent)` }} />
               <div className="bg-white/5 border-b border-white/5 px-8 sm:px-12 py-6 flex items-center justify-between shrink-0 relative z-10">
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-50" />
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-50" />
                  </div>
                  <span className="text-[10px] font-bold font-mono text-white/20 tracking-[0.3em] uppercase">{selectedIncident.id.toString().slice(-6).toUpperCase()}</span>
                  <button onClick={() => setSelectedIncident(null)} className="text-white/40 hover:text-white transition-colors bg-white/5 p-2 rounded-xl border border-white/10">
                     <X className="w-6 h-6" />
                  </button>
               </div>
               <div className="p-8 sm:p-16 space-y-10 sm:space-y-14 relative overflow-y-auto no-scrollbar flex-1 z-10">
                  <div className="flex items-center gap-6 sm:gap-10">
                     <div className={cn("w-20 h-20 sm:w-28 sm:h-28 rounded-[36px] flex items-center justify-center shadow-2xl relative shrink-0", categoryConfigs[selectedIncident.type].bg, categoryConfigs[selectedIncident.type].color)}>
                        <div className="absolute inset-0 rounded-[36px] blur-xl opacity-30" style={{ backgroundColor: categoryConfigs[selectedIncident.type].hex }} />
                        {React.createElement(categoryConfigs[selectedIncident.type].icon, { className: "w-10 h-10 sm:w-14 sm:h-14 relative z-10", strokeWidth: 2.5 })}
                     </div>
                     <div className="flex flex-col gap-2 min-w-0">
                        <span className={cn("text-xs sm:text-sm font-black uppercase tracking-[0.3em]", categoryConfigs[selectedIncident.type].color)}>{categoryConfigs[selectedIncident.type].label}</span>
                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase italic leading-[1.1] break-words">{selectedIncident.linea}</h2>
                     </div>
                  </div>
                  <div className="relative">
                     <div className="relative bg-white/[0.04] rounded-[48px] border border-white/10 p-8 sm:p-12 flex flex-col gap-6 shadow-2xl backdrop-blur-lg">
                        <div className="flex items-center gap-3 text-white/30">
                           <Info className="w-5 h-5 text-cyan-400" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em]">REPORTE DE CAMPO</span>
                        </div>
                        <p className="text-xl sm:text-3xl font-medium text-white/95 leading-snug sm:leading-tight italic tracking-tight break-words">
                           &ldquo;{selectedIncident.description}&rdquo;
                        </p>
                        <div className="h-px w-20 bg-white/10 mt-2" />
                        {selectedIncident.metadata?.direccion && (
                          <div className="flex items-start gap-4 text-white/50">
                             <Navigation className="w-5 h-5 text-emerald-400 mt-1" strokeWidth={3} />
                             <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">UBICACIÓN CONFIRMADA</span>
                                <span className="text-sm sm:text-lg font-black text-white uppercase italic tracking-tighter">{selectedIncident.metadata.direccion}</span>
                             </div>
                          </div>
                        )}
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-8">
                     <div className="p-6 sm:p-10 rounded-[32px] sm:rounded-[44px] bg-white/[0.03] border border-white/10 flex flex-col gap-2 sm:gap-4 shadow-xl">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">INTEGRIDAD</span>
                        <span className="text-xs sm:text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 italic">
                           <CheckCircle className="w-4 h-4" /> VERIFICADO
                        </span>
                     </div>
                     <div className="p-6 sm:p-10 rounded-[32px] sm:rounded-[44px] bg-white/[0.03] border border-white/10 flex flex-col gap-2 sm:gap-4 shadow-xl">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">SEVERIDAD</span>
                        <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] italic" style={{ color: categoryConfigs[selectedIncident.type].hex }}>RANGO NIVEL {selectedIncident.intensidad}</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-4 pt-4 pb-32">
                     <button className="group w-full py-6 sm:py-8 bg-cyan-400 hover:bg-cyan-300 text-black rounded-[32px] font-black uppercase tracking-[0.3em] text-[11px] sm:text-xs active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(34,211,238,0.3)]">
                        <Share2 className="w-5 h-5" strokeWidth={3} />
                        Compartir en Redes
                     </button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="fixed top-1/2 -right-40 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />
    </div>
  );
}
