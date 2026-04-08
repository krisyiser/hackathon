"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabType } from '@/types/navigation';
import { BottomNav } from '@/components/BottomNav';
import { ReportScreen } from '@/components/ReportScreen';
import { MapScreen } from '@/components/MapScreen';
import { IncidentsScreen } from '@/components/IncidentsScreen';
import { CommunityScreen } from '@/components/CommunityScreen';
import { ConfigScreen } from '@/components/ConfigScreen';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('reporte');

  const renderScreen = () => {
    switch (activeTab) {
      case 'mapa': return <MapScreen />;
      case 'incidentes': return <IncidentsScreen />;
      case 'reporte': return <ReportScreen />;
      case 'comunidad': return <CommunityScreen />;
      case 'configuracion': return <ConfigScreen />;
      default: return <ReportScreen />;
    }
  };

  return (
    <main className="relative h-[100dvh] w-screen bg-black overflow-hidden selection:bg-white/20 flex flex-col font-sans">
      
      {/* Premium Apple-style Overlights */}
      <div className="overlight overlight-cyan opacity-25" />
      <div className="overlight overlight-rose opacity-15" />

      {/* Modern Premium Branding (Spanish - Mobile Responsive) */}
      <div className="fixed top-8 left-6 md:top-12 md:left-10 z-50 pointer-events-none mix-blend-difference max-w-[80vw]">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-white">MOTUS<span className="text-cyan-400">.</span></h1>
          <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2">
             <div className="w-6 md:w-8 h-[2px] bg-white opacity-40 shrink-0" />
             <span className="text-[10px] md:text-[12px] font-bold text-white uppercase tracking-[0.2em] md:tracking-[0.3em] truncate">Centro de Resiliencia CDMX</span>
          </div>
        </motion.div>
      </div>

      {/* Dynamic Content Viewport */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(20px)', scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full flex flex-col"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Bottom Navigation Bar (Glass) */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Side Gradients */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/60 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/60 to-transparent pointer-events-none z-10" />
    </main>
  );
}
