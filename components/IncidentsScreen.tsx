"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';
import { ShieldAlert, TrafficCone, Users, Zap, ChevronRight, Activity } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function IncidentsScreen() {
  const { reports } = useRealtimeReports();
  const recentReports = [...reports]
    .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  const categoryConfigs = {
    seguridad: { icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/20', label: 'SEGURIDAD' },
    emergencia: { icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/20', label: 'EMERGENCIA' },
    obstruccion: { icon: TrafficCone, color: 'text-amber-500', bg: 'bg-amber-500/20', label: 'OBSTRUCCIÓN' },
    saturacion: { icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/20', label: 'SATURACIÓN' },
    entorno: { icon: Activity, color: 'text-cyan-500', bg: 'bg-cyan-500/20', label: 'ENTORNO' }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-black px-8 pt-40 pb-48 no-scrollbar relative">
      <div className="mb-16 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-[12px] font-black text-white uppercase tracking-[0.4em] mb-2 opacity-60">Inteligencia en Vivo</h2>
          <h3 className="text-4xl font-black text-white tracking-tight">Incidentes Recientes</h3>
        </div>
        <div className="w-16 h-16 rounded-[24px] glass-premium flex items-center justify-center border-white/20">
           <Activity className="w-8 h-8 text-cyan-400 animate-pulse" strokeWidth={3} />
        </div>
      </div>

      <div className="space-y-8">
        <AnimatePresence>
          {recentReports.map((report, idx) => {
            const config = categoryConfigs[report.type as keyof typeof categoryConfigs] || categoryConfigs.entorno;
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card-premium p-8 rounded-[40px] group hover:bg-white/[0.06] transition-all border-white/20"
              >
                 <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-6">
                       <div className={cn("p-5 rounded-[24px] transition-transform duration-700 group-hover:scale-110 shadow-lg", config.bg, config.color)}>
                          <config.icon className="w-8 h-8" strokeWidth={3} />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[12px] font-black text-white uppercase tracking-[0.2em]">{config.label}</span>
                          <span className="text-xl font-black text-white uppercase tracking-tight mt-1 leading-tight">{report.linea}</span>
                       </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[11px] font-black text-white uppercase opacity-40">{new Date(report.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                       <div className="flex gap-1.5 mt-3">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={cn("w-1.5 h-4 rounded-full transition-all duration-1000", i < report.intensidad ? config.color.replace('text', 'bg') : 'bg-white/10')} />
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <span className="text-[11px] font-black text-white/40 tracking-widest uppercase italic">Validación Verificada</span>
                    <button className="flex items-center gap-3 text-[12px] font-black text-white uppercase hover:text-cyan-400 transition-colors">
                       Ver Protocolo <ChevronRight className="w-4 h-4" strokeWidth={4} />
                    </button>
                 </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-40 -left-40 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[160px] pointer-events-none" />
    </div>
  );
}
