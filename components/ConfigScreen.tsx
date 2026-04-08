"use client";

import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Mail, 
  Calendar, 
  ChevronRight, 
  LogOut, 
  Save,
  Bell,
  ShieldCheck,
  Activity,
  Smartphone,
  Camera,
  RotateCw,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ConfigScreen() {
  const [profile, setProfile] = useState({
    nombre: 'Gabriel Ruiz',
    correo: 'gabriel.ruiz@motus.mx',
    direccion: 'Av. Paseo de la Reforma, CDMX',
    edad: '28',
    id: 'MOTUS-9AC8220'
  });

  // Settings States
  const [settings, setSettings] = useState({
    notifications: 'Solo Críticas',
    encrypted: true,
    haptic: 'Fuerte',
    interface: 'Apple Glass'
  });

  const [isFlipped, setIsFlipped] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const toggleEncrypted = () => {
    setSettings(prev => ({ ...prev, encrypted: !prev.encrypted }));
    triggerFeedback();
  };

  const cycleNotifications = () => {
    const options = ['Solo Críticas', 'Todas', 'Apagadas'];
    const next = options[(options.indexOf(settings.notifications) + 1) % options.length];
    setSettings(prev => ({ ...prev, notifications: next }));
    triggerFeedback();
  };

  const cycleHaptic = () => {
    const options = ['Fuerte', 'Medio', 'Suave'];
    const next = options[(options.indexOf(settings.haptic) + 1) % options.length];
    setSettings(prev => ({ ...prev, haptic: next }));
    triggerFeedback();
  };

  const cycleInterface = () => {
    const options = ['Apple Glass', 'Minimal Line', 'High Contrast'];
    const next = options[(options.indexOf(settings.interface) + 1) % options.length];
    setSettings(prev => ({ ...prev, interface: next }));
    triggerFeedback();
  };

  const triggerFeedback = () => {
    setHasChanged(true);
    if (navigator.vibrate) navigator.vibrate(10);
    setTimeout(() => setHasChanged(false), 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-40 pb-48 no-scrollbar bg-black relative">
      
      {/* Reversible Identity Card Container */}
      <div className="mb-28 perspective-1000 relative z-10">
        <motion.div 
          className="relative w-full h-[520px] preserve-3d cursor-pointer"
          animate={{ 
            rotateY: isFlipped ? 180 : 0,
            z: isFlipped ? 50 : 0 
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ zIndex: isFlipped ? 50 : 10 }}
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden glass-card-premium rounded-[54px] p-10 flex flex-col items-center justify-center border-white/20 shadow-2xl z-20">
            <div className="relative mb-10">
              <div className="absolute -inset-8 bg-gradient-to-tr from-cyan-500/30 to-rose-500/30 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-48 h-48 rounded-[64px] glass-premium p-4 border-white/20 overflow-hidden">
                <div className="w-full h-full rounded-[50px] bg-gradient-to-tr from-slate-900 to-black flex items-center justify-center relative overflow-hidden">
                   <User className="w-24 h-24 text-white opacity-20" />
                   <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-transparent" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-5 rounded-3xl shadow-2xl border-4 border-black transition-transform hover:scale-110">
                <Cpu className="w-8 h-8 text-black" strokeWidth={3} />
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-4xl font-black text-white tracking-tight leading-tight">{profile.nombre}</h2>
              <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.5em] mt-6 block italic">Identidad Ciudadana</span>
            </div>

            <div className="absolute bottom-10 flex items-center gap-3 text-white/20 font-black text-[10px] tracking-widest uppercase">
               <RotateCw className="w-4 h-4" /> Tocar para Detalles
            </div>
          </div>

          {/* BACK */}
          <div 
            className="absolute inset-0 backface-hidden glass-card-premium rounded-[54px] p-10 flex flex-col justify-between border-white/20 shadow-2xl bg-black/60"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="space-y-4">
              <h3 className="text-[12px] font-black text-white uppercase tracking-[0.4em] mb-10 text-center opacity-60">Expediente Encriptado</h3>
              
              {[
                { icon: User, label: 'Enlace', value: profile.nombre },
                { icon: Mail, label: 'Contacto', value: profile.correo },
                { icon: MapPin, label: 'Ubicación', value: profile.direccion },
                { icon: Calendar, label: 'Ciclo', value: profile.edad + ' Años' },
                { icon: Cpu, label: 'Protocolo ID', value: profile.id },
              ].map((field, i) => (
                <div key={i} className="flex flex-col gap-1 p-5 rounded-3xl bg-white/5 border border-white/5">
                   <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{field.label}</span>
                   <span className="text-base font-bold text-white tracking-tight">{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Settings Sections */}
      <div className="space-y-12">
        
        {/* PRIVACY */}
        <div>
          <h3 className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em] mb-8 ml-6">Seguridad y Privacidad</h3>
          <div className="space-y-4">
            {/* Notifications */}
            <button
              onClick={cycleNotifications}
              className="w-full glass-card-premium p-8 rounded-[40px] flex items-center justify-between group transition-all duration-500 hover:bg-white/[0.06] border-white/5 active:scale-[0.98]"
            >
              <div className="flex items-center gap-8">
                <div className="p-5 rounded-[24px] border border-white/10 shadow-xl transition-all group-hover:scale-110 text-cyan-400 bg-white/5">
                  <Bell className="w-8 h-8" strokeWidth={3} />
                </div>
                <div className="flex flex-col items-start leading-none">
                   <span className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-2">Notificaciones Push</span>
                   <span className="text-xl font-bold text-white">{settings.notifications}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full glass-premium flex items-center justify-center text-white/20 group-hover:text-cyan-400 transition-all">
                 <RotateCw className="w-5 h-5" />
              </div>
            </button>

            {/* Encrypted Mode */}
            <button
              onClick={toggleEncrypted}
              className="w-full glass-card-premium p-8 rounded-[40px] flex items-center justify-between group transition-all duration-500 hover:bg-white/[0.06] border-white/5 active:scale-[0.98]"
            >
              <div className="flex items-center gap-8">
                <div className={cn(
                  "p-5 rounded-[24px] border border-white/10 shadow-xl transition-all group-hover:scale-110",
                  settings.encrypted ? "text-rose-500 bg-rose-500/10" : "text-white/20 bg-white/5"
                )}>
                  <ShieldCheck className="w-8 h-8" strokeWidth={3} />
                </div>
                <div className="flex flex-col items-start leading-none">
                   <span className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-2">Modo Encriptado</span>
                   <span className={cn("text-xl font-bold", settings.encrypted ? "text-white" : "text-white/40")}>
                    {settings.encrypted ? 'Protocolo Alpha' : 'Bajo / Off'}
                   </span>
                </div>
              </div>
              <div className={cn(
                "w-14 h-8 rounded-full transition-all relative p-1",
                settings.encrypted ? "bg-rose-500" : "bg-white/10"
              )}>
                 <div className={cn(
                   "w-6 h-6 bg-white rounded-full transition-all shadow-lg",
                   settings.encrypted ? "translate-x-6" : "translate-x-0"
                 )} />
              </div>
            </button>
          </div>
        </div>

        {/* SYSTEM */}
        <div>
          <h3 className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em] mb-8 ml-6">Preferencias del Sistema</h3>
          <div className="space-y-4">
            {/* Haptic */}
            <button
              onClick={cycleHaptic}
              className="w-full glass-card-premium p-8 rounded-[40px] flex items-center justify-between group transition-all duration-500 hover:bg-white/[0.06] border-white/5 active:scale-[0.98]"
            >
              <div className="flex items-center gap-8">
                <div className="p-5 rounded-[24px] border border-white/10 shadow-xl transition-all group-hover:scale-110 text-amber-500 bg-white/5">
                  <Activity className="w-8 h-8" strokeWidth={3} />
                </div>
                <div className="flex flex-col items-start leading-none">
                   <span className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-2">Motor Háptico</span>
                   <span className="text-xl font-bold text-white">{settings.haptic}</span>
                </div>
              </div>
              <div className="flex gap-1.5">
                 {[1,2,3].map(i => (
                   <div key={i} className={cn("w-1.5 h-6 rounded-full transition-all", 
                     (settings.haptic === 'Suave' && i === 1) || 
                     (settings.haptic === 'Medio' && i <= 2) || 
                     (settings.haptic === 'Fuerte' && i <= 3) 
                     ? "bg-amber-500" : "bg-white/10"
                   )} />
                 ))}
              </div>
            </button>

            {/* Interface */}
            <button
              onClick={cycleInterface}
              className="w-full glass-card-premium p-8 rounded-[40px] flex items-center justify-between group transition-all duration-500 hover:bg-white/[0.06] border-white/5 active:scale-[0.98]"
            >
              <div className="flex items-center gap-8">
                <div className="p-5 rounded-[24px] border border-white/10 shadow-xl transition-all group-hover:scale-110 text-white bg-white/5">
                  <Smartphone className="w-8 h-8" strokeWidth={3} />
                </div>
                <div className="flex flex-col items-start leading-none">
                   <span className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-2">Estilo de Interfaz</span>
                   <span className="text-xl font-bold text-white">{settings.interface}</span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-white transition-all" strokeWidth={4} />
            </button>
          </div>
        </div>
        
        {/* Logout */}
        <div className="pt-20 pb-10">
           <button className="w-full py-12 glass-card-premium rounded-[54px] flex items-center justify-center gap-6 text-rose-500 font-black text-base uppercase tracking-[0.6em] border-rose-500/20 hover:bg-rose-500/10 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl">
              <LogOut className="w-8 h-8" strokeWidth={3} />
              Cerrar Sesión
           </button>
        </div>
      </div>

      {/* Quick Sync Toast */}
      <AnimatePresence>
        {hasChanged && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[250] glass-premium px-8 py-4 rounded-full border-cyan-500/30 flex items-center gap-3 shadow-2xl"
          >
             <CheckCircle2 className="w-5 h-5 text-cyan-400" strokeWidth={3} />
             <span className="text-xs font-black text-white uppercase tracking-widest">Sincronizado</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center opacity-20 py-16">
         <p className="text-[10px] font-black tracking-[0.5em] uppercase text-cyan-400 italic">MOTUS CONFIGURATION ENGINE ACTIVE</p>
      </div>

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}
