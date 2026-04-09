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
  Activity,
  Plus
} from 'lucide-react';
import { IncidentType } from '@/types';
import { useVoiceReport } from '@/hooks/useVoiceReport';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ReportScreen() {
  const [isPressing, setIsPressing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IncidentType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ripples, setRipples] = useState<{ id: string; x: number; y: number; delay: number }[]>([]);
  const { startListening, stopListening, isListening } = useVoiceReport();
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTapTime = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonCenterRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  const d = isMobile ? 125 : 160;

  const categories = [
    { id: 'seguridad' as IncidentType, icon: ShieldAlert, label: 'SEGURIDAD', color: '#F21314', angle: -90 },
    { id: 'emergencia' as IncidentType, icon: Zap, label: 'EMERGENCIA', color: '#FF6B00', angle: -20 },
    { id: 'obstruccion' as IncidentType, icon: TrafficCone, label: 'OBSTRUCCIÓN', color: '#F2FD14', angle: 50 },
    { id: 'saturacion' as IncidentType, icon: Users, label: 'SATURACIÓN', color: '#02D701', angle: 130 },
    { id: 'entorno' as IncidentType, icon: Activity, label: 'ENTORNO', color: '#14C9D9', angle: 200 },
  ];

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    buttonCenterRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    setRipples(prev => [...prev, { id: Date.now().toString(), x: e.clientX, y: e.clientY, delay: 0 }]);

    const now = Date.now();
    if (now - lastTapTime.current < 300) {
      if (isListening) stopListening(); else startListening();
      lastTapTime.current = 0;
      return;
    }
    lastTapTime.current = now;

    pressTimer.current = setTimeout(() => {
      setIsPressing(true);
      if (navigator.vibrate) navigator.vibrate(40);
    }, 250);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPressing || !buttonCenterRef.current) return;

    const dx = e.clientX - buttonCenterRef.current.x;
    const dy = e.clientY - buttonCenterRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (distance > 60) {
      let closest = categories[0];
      let minDiff = 360;

      categories.forEach(cat => {
        let diff = Math.abs(angle - cat.angle);
        if (diff > 180) diff = 360 - diff;
        if (diff < minDiff) {
          minDiff = diff;
          closest = cat;
        }
      });

      if (minDiff < 45) {
        if (selectedCategory !== closest.id) {
          setSelectedCategory(closest.id);
          if (navigator.vibrate) navigator.vibrate(10);
        }
      } else {
        setSelectedCategory(null);
      }
    } else {
      setSelectedCategory(null);
    }
  };

  const handlePointerUp = async () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (isPressing && selectedCategory) {
      await submitReport(selectedCategory);
    }
    setIsPressing(false);
    setSelectedCategory(null);
    buttonCenterRef.current = null;
  };

  const submitReport = async (type: IncidentType) => {
    const win = window as unknown as { lat_global?: number; lng_global?: number; };
    const reportData = {
      latitud: win.lat_global || 19.4326,
      longitud: win.lng_global || -99.1332,
      tipo: type
    };

    setShowSuccess(true);
    if (navigator.vibrate) navigator.vibrate([100, 50, 150]);
    setIsPressing(false);
    setSelectedCategory(null);

    try {
      const fd = new FormData();
      fd.append("latitud", reportData.latitud.toString());
      fd.append("longitud", reportData.longitud.toString());
      fd.append("tipo", reportData.tipo);
      fd.append("titulo", "");
      fd.append("descripcion", "");
      
      const response = await fetch("https://lookitag.com/motus/controlador/recibir_reporte.php", { 
        method: "POST", 
        body: fd
      });

      const responseText = await response.text();
      console.log("📡 Respuesta bruta del servidor:", responseText);

      if (response.ok) {
        console.log("✅ Reporte procesado correctamente.");
      } else {
        console.error("❌ Error de servidor:", response.status, responseText);
      }
    } catch (e) {
      console.warn("⚠️ Error de conexión con el endpoint central:", e);
    }

    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 pt-32 sm:pt-40 pb-48 bg-black select-none touch-none overflow-hidden relative report-screen-container" ref={containerRef}>
      
      <div className="w-full mb-8 sm:mb-20 px-2 flex items-end justify-between shrink-0 relative z-20">
        <div className="flex-1 min-w-0 pr-4">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-2 sm:mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
             <span className="text-[10px] font-black text-rose-500/80 uppercase tracking-widest truncate">Central de Reporte Táctico</span>
          </motion.div>
          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.9] break-words">Emisión<br/><span className="text-white/20">de Alerta.</span></h3>
        </div>
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl glass-premium flex items-center justify-center border-white/10 shadow-2xl shrink-0"><Zap className="w-7 h-7 sm:w-10 sm:h-10 text-rose-500 animate-pulse" strokeWidth={3} /></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full">
        <div className="absolute inset-0 pointer-events-none z-0">
          <AnimatePresence>
            {ripples.map(r => (
              <motion.div key={r.id} initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 20, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute rounded-full border-[2px] border-rose-500/30" style={{ width: 100, height: 100, left: r.x - 50, top: r.y - 50 }} onAnimationComplete={() => setRipples(prev => prev.filter(p => p.id !== r.id))} />
            ))}
          </AnimatePresence>
        </div>

        <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex flex-col items-center justify-center z-10 no-select">
          <div className={cn("absolute inset-0 rounded-full blur-3xl transition-all duration-1000", isListening ? "bg-rose-500/20 scale-125" : "bg-white/5 opacity-10 scale-110")} />
          
          {/* Categorías Radiales - Siempre montadas para evitar parpadeo */}
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              animate={{ 
                scale: isPressing ? (selectedCategory === cat.id ? 1.4 : 1) : 0, 
                opacity: isPressing ? (selectedCategory === cat.id ? 1 : 0.4) : 0,
                x: isPressing ? Math.cos(cat.angle * (Math.PI / 180)) * d : 0,
                y: isPressing ? Math.sin(cat.angle * (Math.PI / 180)) * d : 0
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.5 }}
              className={cn(
                "absolute w-16 h-16 rounded-full glass-premium flex items-center justify-center border-white/10 pointer-events-none",
                selectedCategory === cat.id && "border-white/60 bg-white/20"
              )}
              style={{ boxShadow: selectedCategory === cat.id ? `0 0 30px ${cat.color}66` : 'none' }}
            >
               <div className="w-full h-full rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: selectedCategory === cat.id ? cat.color : 'rgba(255,255,255,0.05)', color: selectedCategory === cat.id ? '#000' : 'rgba(255,255,255,0.4)' }}>
                  <cat.icon className="w-7 h-7" strokeWidth={3} />
               </div>
               {selectedCategory === cat.id && (
                 <span className="absolute -bottom-10 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap" style={{ color: cat.color }}>{cat.label}</span>
               )}
            </motion.div>
          ))}

          <button
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={cn(
              "relative z-10 w-44 h-44 sm:w-56 sm:h-56 rounded-[56px] sm:rounded-[80px] transition-all duration-500 flex items-center justify-center overflow-hidden active:scale-95 group no-select touch-none",
              isPressing ? "bg-white/20 scale-[0.8] shadow-[0_0_100px_rgba(255,255,255,0.2)]" : "glass-premium hover:bg-white/5",
              isListening && "border-rose-500 shadow-[0_0_60px_rgba(242,19,20,0.5)]"
            )}
          >
            {showSuccess ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-6 bg-emerald-500/30 rounded-full border border-emerald-500/50"><Check className="w-16 h-16 sm:w-20 sm:h-20 text-white" strokeWidth={4} /></motion.div>
            ) : (
              <div className="relative flex flex-col items-center">
                {isListening ? <Mic className="w-16 h-16 text-rose-500 animate-pulse" strokeWidth={3} /> : <Plus className={cn("w-20 h-20 transition-all duration-700", isPressing ? "text-white rotate-45 scale-125" : "text-white/30")} strokeWidth={2} />}
              </div>
            )}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[scan_3s_linear_infinite]" />
          </button>
          
          <div className={cn("absolute -bottom-24 z-10 text-[11px] font-black uppercase tracking-[0.4em] text-white transition-opacity duration-300 text-center whitespace-pre-wrap leading-relaxed no-select", isPressing ? "opacity-0" : "opacity-40")}>
            {isListening ? "Transmisión Activa..." : "PULSA: Dial de Reporte\nDOBLE: Reporte por Voz"}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .no-select {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
        }
        .report-screen-container {
          touch-action: none !important;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}
