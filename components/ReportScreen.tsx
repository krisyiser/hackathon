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
  Plus,
  Camera,
  X,
  Send,
  ChevronRight
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [ripples, setRipples] = useState<{ id: string; x: number; y: number; delay: number }[]>([]);
  const { startListening, stopListening, isListening } = useVoiceReport();
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTapTime = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonCenterRef = useRef<{ x: number; y: number } | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    tipo: 'entorno' as IncidentType,
    titulo: '',
    descripcion: '',
    foto: null as File | null,
    fotoPreview: null as string | null
  });

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    // Auto-collapse button after 3 seconds
    const timer = setTimeout(() => setIsExpanded(false), 3500);
    return () => clearTimeout(timer);
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
      await submitReport({ tipo: selectedCategory, titulo: '', descripcion: '' });
    }
    setIsPressing(false);
    setSelectedCategory(null);
    buttonCenterRef.current = null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        foto: file,
        fotoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const submitReport = async (data: { tipo: IncidentType, titulo: string, descripcion: string, foto?: File | null }) => {
    const win = window as unknown as { lat_global?: number; lng_global?: number; };
    const latitud = win.lat_global || 19.4326;
    const longitud = win.lng_global || -99.1332;

    setShowSuccess(true);
    if (navigator.vibrate) navigator.vibrate([100, 50, 150]);
    setIsPressing(false);
    setSelectedCategory(null);
    setIsFormOpen(false);

    try {
      const fd = new FormData();
      fd.append("latitud", latitud.toString());
      fd.append("longitud", longitud.toString());
      fd.append("tipo", data.tipo);
      fd.append("titulo", data.titulo);
      fd.append("descripcion", data.descripcion);
      if (data.foto) fd.append("foto", data.foto);

      const response = await fetch("https://lookitag.com/motus/controlador/recibir_reporte.php", {
        method: "POST",
        body: fd
      });

      const responseText = await response.text();
      console.log("📡 Respuesta bruta del servidor:", responseText);
    } catch (e) {
      console.warn("⚠️ Error de envío:", e);
    }

    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 pt-10 sm:pt-16 pb-48 bg-black select-none touch-none overflow-hidden relative report-screen-container" ref={containerRef}>

      {/* HEADER HUD */}
      <div className="w-full mb-2 sm:mb-10 px-2 flex items-center justify-between shrink-0 relative z-20">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase italic leading-[0.9] break-words">Emisión<br /><span className="text-white/20">de Alerta.</span></h3>
        </div>

        {/* BOTÓN DINÁMICO REPORTE AVANZADO */}
        <motion.button
          onClick={() => setIsFormOpen(true)}
          initial={false}
          animate={{
            width: isExpanded ? (isMobile ? '190px' : '240px') : '64px',
            backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 30, 30, 0.1)'
          }}
          className="h-16 sm:h-20 rounded-2xl glass-premium flex items-center px-4 border-white/10 shadow-2xl shrink-0 active:scale-95 transition-all overflow-hidden relative group"
        >
          <div className="flex items-center gap-3 w-full justify-center">
            <div className="relative flex-shrink-0">
              <Zap className={cn("w-7 h-7 sm:w-8 sm:h-8 text-rose-500 transition-all", isExpanded ? "animate-none" : "animate-pulse")} strokeWidth={4} />
              {!isExpanded && <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />}
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-[10px] font-black text-white whitespace-nowrap tracking-widest uppercase italic"
                >
                  Reporte Avanzado
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full">
        <div className="absolute inset-0 pointer-events-none z-0">
          <AnimatePresence>
            {ripples.map(r => (
              <motion.div key={r.id} initial={{ scale: 0, opacity: 1 }} animate={{ scale: 25, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute rounded-full border-[4px] border-rose-500 bg-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.5)]" style={{ width: 100, height: 100, left: r.x - 50, top: r.y - 50 }} onAnimationComplete={() => setRipples(prev => prev.filter(p => p.id !== r.id))} />
            ))}
          </AnimatePresence>
        </div>

        <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex flex-col items-center justify-center z-10 no-select">
          <div className={cn("absolute inset-0 rounded-full blur-3xl transition-all duration-1000", isListening ? "bg-rose-500/20 scale-125" : "bg-white/5 opacity-10 scale-110")} />

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
              isPressing ? "bg-white/20 scale-[0.8] shadow-[0_0_100px_rgba(255,255,255,0.2)]" : "glass-premium border-white/5",
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

          <div className={cn("absolute -bottom-16 z-10 text-[11px] font-black uppercase tracking-[0.4em] text-white transition-opacity duration-300 text-center whitespace-pre-wrap leading-relaxed no-select", isPressing ? "opacity-0" : "opacity-40")}>
            {isListening ? "Transmisión Activa..." : "PULSA: Dial de Reporte\nDOBLE: Reporte por Voz"}
          </div>
        </div>
      </div>

      {/* FULL REPORT MODAL v2.0 PREMIUM */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[500] bg-black flex flex-col no-scrollbar overflow-y-auto"
          >
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-rose-500/10 to-transparent pointer-events-none" />

            {/* NAVBAR MODAL */}
            <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-3xl px-6 py-8 flex items-center justify-between border-b border-white/5">
              <div className="flex flex-col">
                <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Reporte detallado</h4>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="w-14 h-14 rounded-2xl glass-premium flex items-center justify-center border-white/10 active:scale-90 transition-transform"><X className="text-white w-6 h-6" /></button>
            </div>

            <div className="p-6 space-y-12 flex-1 pb-4 relative z-10">

              {/* CATEGORY SELECTOR TACTICAL */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-emerald-400" />
                  <label className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Tipo de Incidente</label>
                </div>
                <div className="flex justify-between items-start w-full gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFormData(prev => ({ ...prev, tipo: cat.id }))}
                      className={cn(
                        "relative flex-1 aspect-[3/4] max-h-[100px] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300",
                        formData.tipo === cat.id ? "glass-premium border-2 border-white scale-105 shadow-2xl" : "bg-white/10 border border-white/30 opacity-80"
                      )}
                    >
                      {formData.tipo === cat.id && (
                        <motion.div layoutId="glow" className="absolute inset-0 blur-xl opacity-60" style={{ backgroundColor: cat.color }} />
                      )}
                      <cat.icon className="w-5 h-5 sm:w-7 sm:h-7 relative z-10" style={{ color: formData.tipo === cat.id ? cat.color : '#fff' }} strokeWidth={3} />
                      <span className="text-[7px] sm:text-[9px] font-bold tracking-widest uppercase text-white relative z-10 truncate w-full px-1 text-center">{cat.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* INPUT FIELDS HUD STYLE */}
              <div className="space-y-10">
                <div className="relative group">
                  <label className={cn(
                    "absolute left-6 transition-all font-bold text-[10px] uppercase tracking-[0.3em] z-10 px-2 bg-black/60 rounded-full",
                    formData.titulo ? "-top-3 text-cyan-400" : "top-5 text-white/80"
                  )}>Título del Suceso</label>
                  <div className="rounded-[32px] glass-premium p-1 border-2 border-white/30 focus-within:border-cyan-400 bg-white/10 transition-all relative">
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                      placeholder={formData.titulo ? "" : "Identifique el incidente..."}
                      className="w-full bg-black/50 rounded-[28px] px-6 py-6 text-xl text-white placeholder:text-white/40 outline-none font-bold italic tracking-tight"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className={cn(
                    "absolute left-6 transition-all font-bold text-[10px] uppercase tracking-[0.3em] z-10 px-2 bg-black/60 rounded-full",
                    formData.descripcion ? "-top-3 text-cyan-400" : "top-5 text-white/80"
                  )}>Bitácora de Detalles</label>
                  <div className="rounded-[32px] glass-premium p-1 border-2 border-white/30 focus-within:border-cyan-400 bg-white/10 transition-all relative">
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                      placeholder={formData.descripcion ? "" : "Relate los hechos observados..."}
                      rows={5}
                      className="w-full bg-black/50 rounded-[28px] px-6 py-6 text-lg text-white placeholder:text-white/40 outline-none font-bold italic resize-none leading-[1.6]"
                    />
                  </div>
                </div>
              </div>

              {/* CAMERA INTERFACE */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-emerald-400" />
                  <label className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Captura de Evidencia</label>
                </div>
                <div className="relative aspect-video rounded-[40px] overflow-hidden border border-white/10 bg-white/5 group transition-all active:scale-[0.98]">
                  <input type="file" accept="image/*" capture="environment" className="absolute inset-0 opacity-0 z-20 cursor-pointer" onChange={handleFileChange} />

                  {formData.fotoPreview ? (
                    <img src={formData.fotoPreview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Preview" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                      <div className="relative w-20 h-20 flex items-center justify-center">
                        <Camera className="w-10 h-10 text-white animate-pulse" />
                        <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full animate-spin-slow" />
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] font-bold text-white tracking-[0.4em] uppercase italic">Iniciar Captura</span>
                        <p className="text-[8px] text-white/30 font-bold mt-2 tracking-widest italic">SOPORTA: JPEG, RAW, PNG</p>
                      </div>
                    </div>
                  )}
                  {/* HUD Elements over Camera */}
                  <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-rose-500/50" />
                  <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-rose-500/50" />
                  <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-rose-500/50" />
                  <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-rose-500/50" />
                </div>

                {formData.foto && (
                  <button
                    onClick={() => setFormData(p => ({ ...p, foto: null, fotoPreview: null }))}
                    className="flex items-center gap-2 mx-auto text-rose-500 text-[10px] font-black uppercase tracking-widest pt-2 active:scale-95"
                  >
                    <X className="w-4 h-4" /> Eliminar Evidencia
                  </button>
                )}
              </div>
            </div>

            <div className="w-full pb-32 px-6 pt-2 z-20">
              <button
                onClick={() => submitReport(formData)}
                className="w-full h-20 bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-[0.4em] rounded-[32px] shadow-[0_20px_60px_rgba(16,185,129,0.3)] active:scale-95 transition-all flex items-center justify-center gap-4 group"
              >
                <div className="flex items-center gap-4 text-base">
                  <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={3} />
                  ENVIAR
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
