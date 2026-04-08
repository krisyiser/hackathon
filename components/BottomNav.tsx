"use client";

import React from 'react';
import { 
  Map as MapIcon, 
  Newspaper, 
  Users, 
  Settings, 
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabType } from '@/types/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function BottomNav({ activeTab, onTabChange }: { activeTab: TabType; onTabChange: (tab: TabType) => void }) {
  const tabs: { id: TabType; icon: React.ElementType; label: string; color: string; inactive: string }[] = [
    { id: 'mapa', icon: MapIcon, label: 'Mapa', color: '#14C9D9', inactive: 'rgba(20, 201, 217, 0.15)' },
    { id: 'incidentes', icon: Newspaper, label: 'Feed', color: '#F2FD14', inactive: 'rgba(242, 253, 20, 0.15)' },
    { id: 'reporte', icon: LayoutGrid, label: 'Reportar', color: '#F21314', inactive: 'rgba(242, 19, 20, 0.15)' },
    { id: 'comunidad', icon: Users, label: 'Pulso', color: '#02D701', inactive: 'rgba(2, 215, 1, 0.15)' },
    { id: 'configuracion', icon: Settings, label: 'Perfil', color: '#1340FF', inactive: 'rgba(19, 64, 255, 0.15)' },
  ];

  return (
    <div className="fixed bottom-10 left-0 right-0 z-[100] px-8 pointer-events-none">
      <div className="mx-auto max-w-sm glass-premium bg-white/90 dark:bg-slate-950/90 rounded-[40px] px-2 py-2 flex items-center justify-between shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] pointer-events-auto h-20">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-500 rounded-[32px] group",
                isActive ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-white/40 dark:hover:text-white"
              )}
            >
              <div 
                className={cn(
                  "p-2.5 rounded-2xl transition-all duration-500",
                  isActive && "scale-110",
                  isActive ? "bg-slate-200/50 dark:bg-white/10" : "bg-transparent"
                )}
                style={{ 
                  color: isActive ? tab.color : 'inherit',
                  filter: isActive ? `drop-shadow(0 0 8px ${tab.color})` : 'none'
                }}
              >
                <tab.icon className="w-6 h-6" strokeWidth={isActive ? 3 : 2} />
              </div>
              
              <AnimatePresence>
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-[10px] font-black uppercase tracking-widest leading-none mt-1"
                    style={{ color: tab.color }}
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </div>
  );
}
