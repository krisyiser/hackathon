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
  ArrowUpRight,
  Navigation,
  Info
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
    <div className="flex-1 overflow-y-auto bg-black px-4 sm:px-6 pt-32 sm:pt-40 pb-48 no-scrollbar relative">
      
      {/* Responsive Header - Fixed Overflows */}
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

      <div className="space-y-4 sm:space-y-6">
        <AnimatePresence>
          {allReports.map((report) => {
            const config = categoryConfigs[report.type] || categoryConfigs.entorno;
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => setSelectedIncident(report)}
                className="group relative w-full"
              >
                <div 
                   className="absolute -inset-1 rounded-[32px] sm:rounded-[44px] opacity-0 group-hover:opacity-102 blur-2xl transition-all duration-700 pointer-events-none" 
                   style={{ background: config.hex + '33' }}
                />

                <div className="relative glass-card-premium p-5 sm:p-8 rounded-[32px] sm:rounded-[44px] border-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col gap-4 sm:gap-6 shadow-2xl w-full">
                   
                   <div className="flex justify-between items-start gap-3 w-full">
                      <div className="flex-1 flex items-center gap-4 sm:gap-6 min-w-0">
                         <div className={cn("w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[24px] flex items-center justify-center shadow-2xl relative shrink-0", config.bg, config.color)}>
                            <config.icon className="w-6 h-6 sm:w-8 sm:h-8 relative z-10" strokeWidth={3} />
                         </div>
                         <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0 flex-1">
                            <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white/30">{config.label}</span>
                            <span className="text-lg sm:text-2xl font-black text-white tracking-tighter uppercase italic group-hover:text-cyan-400 transition-colors leading-tight break-words pr-2">
                               {report.linea}
                            </span>
                         </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0 pt-1">
                         <div className="px-2.5 sm:px-4 py-1 rounded-full bg-white/5 border border-white/10 mb-2 sm:mb-3">
                            <span className="text-[8px] sm:text-[10px] font-black text-white/60 font-mono italic">{new Date(report.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                         </div>
                         <ArrowUpRight className="w-4 h-4 sm:w-6 sm:h-6 text-white/10 group-hover:text-white transition-all hidden sm:block" strokeWidth={3} />
                      </div>
                   </div>

                   <div className="flex items-center justify-between border-t border-white/5 pt-4 sm:pt-6">
                      <div className="flex gap-1 sm:gap-2">
                         {[...Array(5)].map((_, i) => (
                           <div 
                              key={i} 
                              className={cn(
                                "w-6 sm:w-10 h-1 sm:h-1.5 rounded-full transition-all duration-1000", 
                                i < report.intensidad ? config.color.replace('text', 'bg') : 'bg-white/5'
                              )} 
                           />
                         ))}
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="flex items-center gap-1 text-emerald-400/60">
                            <CheckCircle className="w-2.5 h-2.5 sm:w-4 sm:h-4 shrink-0" strokeWidth={3} />
                            <span className="text-[8px] sm:text-[10px] font-black tracking-widest">OK</span>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* DETAIL MODAL - MOBILE FIXES */}
      <AnimatePresence>
        {selectedIncident && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center bg-black/95 backdrop-blur-2xl px-0 sm:px-10"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl bg-[#050505] rounded-t-[40px] sm:rounded-[56px] border-t sm:border border-white/10 relative overflow-hidden shadow-2xl h-[85vh] sm:h-auto flex flex-col"
            >
               <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${categoryConfigs[selectedIncident.type].hex}55, transparent)` }} />
               
               <div className="bg-white/5 border-b border-white/5 px-6 sm:px-10 py-5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[9px] font-black font-mono text-white/20 tracking-widest uppercase truncate max-w-[150px]">EXP-{selectedIncident.id.toString().slice(0,6)}</span>
                  <button onClick={() => setSelectedIncident(null)} className="text-white/40 hover:text-white p-1">
                     <X className="w-6 h-6" />
                  </button>
               </div>

               <div className="p-6 sm:p-12 space-y-6 sm:space-y-10 relative overflow-y-auto no-scrollbar flex-1">
                  
                  <div className="flex items-center gap-4 sm:gap-8">
                     <div className={cn("w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[28px] flex items-center justify-center shadow-2xl relative shrink-0", categoryConfigs[selectedIncident.type].bg, categoryConfigs[selectedIncident.type].color)}>
                        {React.createElement(categoryConfigs[selectedIncident.type].icon, { className: "w-8 h-8 sm:w-10 sm:h-10", strokeWidth: 3 })}
                     </div>
                     <div className="flex flex-col gap-1 min-w-0">
                        <span className={cn("text-[9px] sm:text-[11px] font-black uppercase tracking-widest", categoryConfigs[selectedIncident.type].color)}>{categoryConfigs[selectedIncident.type].label}</span>
                        <h2 className="text-xl sm:text-4xl font-black text-white tracking-tighter uppercase italic leading-tight break-words">{selectedIncident.linea}</h2>
                     </div>
                  </div>

                  <div className="relative">
                     <div className="relative bg-white/[0.03] rounded-[24px] sm:rounded-[40px] border border-white/5 p-5 sm:p-8 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-white/20">
                           <Info className="w-4 h-4" />
                           <span className="text-[8px] font-black uppercase tracking-widest">REPORTE TÁCTICO</span>
                        </div>
                        <p className="text-base sm:text-xl font-medium text-white/90 leading-normal sm:leading-relaxed italic tracking-tight break-words">
                           {selectedIncident.description}
                        </p>
                        {selectedIncident.metadata?.direccion && (
                          <div className="mt-4 flex items-center gap-2 text-white/40">
                             <Navigation className="w-3 h-3" />
                             <span className="text-[10px] font-bold uppercase tracking-widest">
                               {selectedIncident.metadata.direccion}
                             </span>
                          </div>
                        )}
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-6">
                     <div className="p-4 sm:p-8 rounded-[20px] sm:rounded-[32px] bg-white/[0.03] border border-white/5 flex flex-col gap-1.5 sm:gap-3">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">STATUS</span>
                        <span className="text-[10px] sm:text-xs font-black text-white uppercase truncate">VERIFICADO</span>
                     </div>
                     <div className="p-4 sm:p-8 rounded-[20px] sm:rounded-[32px] bg-white/[0.03] border border-white/5 flex flex-col gap-1.5 sm:gap-3">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">RANGO</span>
                        <span className="text-[10px] sm:text-xs font-black text-white uppercase" style={{ color: categoryConfigs[selectedIncident.type].hex }}>NIVEL {selectedIncident.intensidad}</span>
                     </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 pb-8">
                     <button className="w-full py-5 sm:py-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-[20px] sm:rounded-[32px] text-white font-black uppercase tracking-widest text-[9px] sm:text-xs active:scale-95 transition-all flex items-center justify-center gap-3">
                        <Navigation className="w-5 h-5" />
                        RUTAS ALTERNAS
                     </button>
                     
                     <div className="grid grid-cols-2 gap-3">
                        <button className="py-4 bg-white/5 rounded-[16px] sm:rounded-[24px] border border-white/10 text-white/40 font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-2">
                           <Share2 className="w-3.5 h-3.5" />
                           LINK
                        </button>
                        <button className="py-4 bg-emerald-500/10 rounded-[16px] sm:rounded-[24px] border border-emerald-500/20 text-emerald-500 font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-2">
                           <CheckCircle className="w-3.5 h-3.5" />
                           READY
                        </button>
                     </div>
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
