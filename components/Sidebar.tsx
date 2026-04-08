"use client";

import { motion } from 'framer-motion';
import { ShieldAlert, TrafficCone, Users, LayoutDashboard, Map as MapIcon, Settings, BarChart3, Bell } from 'lucide-react';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const { reports } = useRealtimeReports();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Control Center' },
    { icon: MapIcon, label: 'Tactical Map', active: true },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Bell, label: 'Notifications' },
    { icon: Settings, label: 'Configuration' }
  ];

  return (
    <div className="hidden lg:flex flex-col w-[380px] h-screen bg-slate-950/80 backdrop-blur-3xl border-r border-white/5 z-20 relative overflow-hidden">
      {/* Brand */}
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            <ShieldAlert className="w-6 h-6 text-slate-950" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white lowercase italic">Motus<span className="text-blue-500">_</span>City</h1>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300",
              item.active 
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Report Feed */}
      <div className="mt-8 flex-1 flex flex-col px-4 min-h-0">
        <div className="flex items-center justify-between mb-4 px-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Incident_Queue</h2>
          <span className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">{reports.length}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pb-8">
          {reports.length === 0 ? (
            <div className="text-center py-12 opacity-20 border-2 border-dashed border-slate-800 rounded-3xl mx-2">
               <p className="text-[10px] font-mono tracking-widest uppercase">Scanning_Network...</p>
            </div>
          ) : (
            reports.map((report) => (
              <motion.div 
                layout
                key={report.id}
                className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                    report.type === 'inseguridad' ? 'bg-rose-500/20 text-rose-500' : 'bg-blue-500/20 text-blue-500'
                  )}>{report.type}</span>
                  <span className="text-[10px] font-mono text-slate-500 italic">{new Date(report.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                </div>
                <h4 className="text-slate-300 text-sm font-bold truncate tracking-tight">{report.linea}</h4>
                <div className="mt-3 h-1 bg-slate-900 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 w-full" style={{ width: `${(report.intensidad/5)*100}%` }} />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Footer / Stats */}
      <div className="p-6 border-t border-white/5 bg-slate-950/40">
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse glow-emerald" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Global_Stability_98%</span>
        </div>
      </div>
    </div>
  );
}
