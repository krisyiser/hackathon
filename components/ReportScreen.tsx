"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  TrafficCone, 
  Users, 
  Mic, 
  Check, 
  Zap,
  Leaf,
  Plus
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { IncidentType } from '@/types';
import { calculateExpiry } from '@/hooks/useRealtimeReports';
import { useVoiceReport } from '@/hooks/useVoiceReport';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CDMX_CENTER: [number, number] = [19.4326, -99.1332];

export function ReportScreen() {
  const [isPressing, setIsPressing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IncidentType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ripples, setRipples] = useState<{ id: string; x: number; y: number; delay: number }[]>([]);
  const { startListening, isListening } = useVoiceReport();
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTapTime = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  const d = isMobile ? 125 : 160;

  const categories = [
    { id: 'seguridad' as IncidentType, icon: ShieldAlert, label: 'SEGURIDAD', color: '#F21314', angle: -90 },
    { id: 'emergencia' as IncidentType, icon: Zap, label: 'EMERGENCIA', color: '#FF6B00', angle: -20 },
    { id: 'obstruccion' as IncidentType, icon: TrafficCone, label: 'OBSTRUCCIÓN', color: '#F2FD14', angle: 50 },
    { id: 'saturacion' as IncidentType, icon: Users, label: 'SATURACIÓN', color: '#02D701', angle: 130 },
    { id: 'entorno' as IncidentType, icon: Leaf, label: 'ENTORNO', color: '#14C9D9', angle: 200 },
  ];

  // REAL MOBILE TOUCH SELECTION LOGIC
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPressing) return;

    // Detect element under finger for touch devices
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const categoryEl = element?.closest('[data-category-id]');
    
    if (categoryEl) {
      const catId = categoryEl.getAttribute('data-category-id') as IncidentType;
      if (catId !== selectedCategory) {
        setSelectedCategory(catId);
        if (navigator.vibrate) navigator.vibrate(15);
      }
    } else {
      setSelectedCategory(null);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent default to stop scrolling/pull-to-refresh
    if (e.cancelable) e.preventDefault();
    
    const centerX = e.clientX;
    const centerY = e.clientY;
    const batchId = Date.now();
    
    const newRipples = [0, 150, 300].map((delay, i) => ({
      id: `${batchId}-${i}`,
      x: centerX,
      y: centerY,
      delay: delay / 1000
    }));

    setRipples(prev => [...prev, ...newRipples]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => !newRipples.find(nr => nr.id === r.id)));
    }, 2000);

    if (navigator.vibrate) navigator.vibrate(30);

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapTime.current < DOUBLE_TAP_DELAY) {
      startListening();
      if (navigator.vibrate) navigator.vibrate([30, 30, 30]);
      lastTapTime.current = 0;
      return;
    }

    lastTapTime.current = now;

    pressTimer.current = setTimeout(() => {
      setIsPressing(true);
      if (navigator.vibrate) navigator.vibrate(60);
    }, 350);
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
      linea: 'REPORTE_GESTOR_INTELIGENTE',
      intensidad: 5,
      lat: CDMX_CENTER[0] + (Math.random() - 0.5) * 0.015,
      lng: CDMX_CENTER[1] + (Math.random() - 0.5) * 0.015,
      expires_at: calculateExpiry(type).toISOString()
    });

    if (!error) {
      setShowSuccess(true);
      if (navigator.vibrate) navigator.vibrate([100, 50, 150]);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center px-10 select-none overflow-hidden touch-none"
      onPointerMove={handlePointerMove}
      ref={containerRef}
    >
      
      {/* Fullscreen Ripple Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 15, opacity: 0 }}
              transition={{ duration: 1.5, delay: ripple.delay, ease: "easeOut" }}
              className="absolute rounded-full border-[2px] border-rose-500/30"
              style={{
                width: 100,
                height: 100,
                left: ripple.x - 50,
                top: ripple.y - 50,
                boxShadow: '0 0 40px rgba(242, 19, 20, 0.2)'
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex flex-col items-center justify-center z-10">
        
        <div className={cn(
          "absolute inset-0 rounded-full blur-3xl transition-all duration-1000",
          isListening ? "bg-rose-500/20 scale-125" : "bg-white/5 opacity-20 scale-110"
        )} />
        
        {/* Radial Nodes */}
        <AnimatePresence>
          {isPressing && (
            <>
              {categories.map((cat) => (
                <motion.div
                  key={cat.id}
                  data-category-id={cat.id}
                  initial={{ scale: 0, opacity: 0, filter: 'blur(10px)' }}
                  animate={{ 
                    scale: selectedCategory === cat.id ? 1.6 : 1, 
                    opacity: 1,
                    filter: 'blur(0px)',
                    x: Math.cos(cat.angle * (Math.PI / 180)) * d,
                    y: Math.sin(cat.angle * (Math.PI / 180)) * d
                  }}
                  exit={{ scale: 0, opacity: 0, filter: 'blur(10px)' }}
                  className={cn(
                    "absolute w-16 h-16 rounded-full glass-premium flex flex-col items-center justify-center shadow-2xl transition-all duration-300 pointer-events-auto",
                    selectedCategory === cat.id ? "border-white/60" : "border-white/10 opacity-40 bg-white/5"
                  )}
                  style={{ 
                    boxShadow: selectedCategory === cat.id ? `0 0 20px ${cat.color}66` : 'none'
                  }}
                >
                   <div 
                     className="w-full h-full rounded-full flex items-center justify-center pointer-events-none transition-all"
                     style={{ 
                       backgroundColor: selectedCategory === cat.id ? cat.color : 'rgba(255,255,255,0.05)',
                       color: selectedCategory === cat.id ? '#000' : 'rgba(255,255,255,0.4)'
                     }}
                   >
                      <cat.icon className="w-8 h-8" strokeWidth={3} />
                   </div>
                   <AnimatePresence>
                     {selectedCategory === cat.id && (
                       <motion.span 
                         initial={{ opacity: 0, y: 5 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="absolute -bottom-10 text-[12px] font-black uppercase tracking-widest whitespace-nowrap"
                         style={{ color: cat.color }}
                       >
                         {cat.label}
                       </motion.span>
                     )}
                   </AnimatePresence>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        <button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className={cn(
            "relative z-10 w-44 h-44 sm:w-56 sm:h-56 rounded-[56px] sm:rounded-[80px] transition-all duration-700 flex items-center justify-center overflow-hidden active:scale-95 group select-none touch-none",
            isPressing ? "bg-white/20 scale-[0.85] shadow-[0_0_100px_rgba(255,255,255,0.2)]" : "glass-premium hover:bg-white/10",
            isListening && "border-rose-500 shadow-[0_0_60px_rgba(242,19,20,0.4)]"
          )}
          style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
        >
          {showSuccess ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
               <div className="p-6 sm:p-8 bg-emerald-500/30 rounded-full border border-emerald-500/50">
                  <Check className="w-16 h-16 sm:w-20 sm:h-20 text-white" strokeWidth={4} />
               </div>
            </motion.div>
          ) : (
            <div className="relative flex flex-col items-center">
              {isListening ? (
                <Mic className="w-16 h-16 sm:w-20 sm:h-20 text-rose-500 animate-pulse" strokeWidth={3} />
              ) : (
                <Plus className={cn(
                  "w-20 h-20 sm:w-24 h-24 transition-all duration-700",
                  isPressing ? "text-white rotate-45 scale-125" : "text-white/40"
                )} strokeWidth={2} />
              )}
            </div>
          )}
          
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[scan_3s_linear_infinite]" />
        </button>

        <AnimatePresence>
          {!isPressing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-24 z-10 text-[13px] font-black uppercase tracking-[0.4em] text-white opacity-60 text-center whitespace-pre-wrap leading-relaxed select-none"
            >
              {isListening ? "Escuchando Voz..." : "Mantén: Reporte\n2 Toques: Voz"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-24 flex flex-col items-center select-none">
         <div className="flex gap-3 mb-4">
            {[...Array(5)].map((_,i) => <div key={i} className="w-2 h-2 bg-white rounded-full opacity-40 shadow-xl" />)}
         </div>
      </div>
    </div>
  );
}
