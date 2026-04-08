"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Mail, 
  Calendar, 
  ChevronRight, 
  LogOut, 
  Activity, 
  Smartphone, 
  RotateCw, 
  CheckCircle2, 
  Medal, 
  Trash2, 
  Users, 
  Droplet, 
  Dna,
  ShieldAlert,
  Zap,
  TrafficCone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ConfigScreen({ onThemeChange }: { onThemeChange: (theme: string) => void }) {
  const [profile] = useState({
    nombre: 'Gabriel Ruiz',
    correo: 'gabriel.ruiz@motus.mx',
    direccion: 'Av. Paseo de la Reforma, CDMX',
    edad: '28',
    genero: 'Masculino',
    tipoSangre: 'O+',
    id: 'MOTUS-9AC8220'
  });

  const [settings, setSettings] = useState({
    vibracion: 'Fuerte',
    interfaz: 'Apple Glass',
    notificaciones: 'Solo Críticas'
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    seguridad: true,
    emergencia: true,
    obstruccion: true,
    saturacion: true,
    entorno: true
  });

  // Load persistence
  useEffect(() => {
    const saved = localStorage.getItem('motus_notification_prefs');
    if (saved) {
      try {
        setNotificationPrefs(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading prefs", e);
      }
    }
  }, []);

  // Sync with global marcadores in ubicacion.js and save
  useEffect(() => {
    localStorage.setItem('motus_notification_prefs', JSON.stringify(notificationPrefs));

    const activeMarkers = Object.entries(notificationPrefs)
      .filter(([, enabled]) => enabled)
      .map(([key]) => key);
    
    // Update global variable for ubicacion.js
    (window as unknown as { marcadores: string[] }).marcadores = activeMarkers;
    
    // Also trigger the send if global function exists
    const win = window as unknown as { enviarCoordenadas?: () => void };
    if (typeof win.enviarCoordenadas === 'function') {
      win.enviarCoordenadas();
    }
  }, [notificationPrefs]);

  const [isFlipped, setIsFlipped] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const cycleVibracion = () => {
    const options = ['Fuerte', 'Medio', 'Suave', 'Apagada'];
    const next = options[(options.indexOf(settings.vibracion) + 1) % options.length];
    setSettings(prev => ({ ...prev, vibracion: next }));
    triggerFeedback();
  };

  const cycleInterface = () => {
    const options = ['Apple Glass', 'Modo Nocturno', 'Alto Contraste', 'Modo Claro'];
    const next = options[(options.indexOf(settings.interfaz) + 1) % options.length];
    const themeMap: Record<string, string> = {
      'Apple Glass': 'apple-glass',
      'Modo Nocturno': 'nocturno',
      'Alto Contraste': 'alto-contraste',
      'Modo Claro': 'claro'
    };
    setSettings(prev => ({ ...prev, interfaz: next }));
    onThemeChange(themeMap[next]);
    triggerFeedback();
  };

  const toggleNotification = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    triggerFeedback();
  };

  const triggerFeedback = () => {
    setHasChanged(true);
    if (navigator.vibrate) navigator.vibrate(10);
    setTimeout(() => setHasChanged(false), 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-40 pb-48 no-scrollbar bg-transparent relative">
      
      {/* Reversible Identity Card Container */}
      <div className="mb-28 perspective-1000 relative z-10">
        <motion.div 
          className="relative w-full h-[540px] preserve-3d cursor-pointer"
          animate={{ 
            rotateY: isFlipped ? 180 : 0,
            z: isFlipped ? 50 : 0 
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => {
            if (!isEditing) setIsFlipped(!isFlipped);
          }}
          style={{ zIndex: isFlipped ? 50 : 10 }}
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden glass-card-premium rounded-[54px] p-10 flex flex-col items-center justify-center border-white/20 shadow-2xl z-20 overflow-hidden">
            <div className="relative mb-10">
               <div className="absolute -inset-8 bg-gradient-to-tr from-cyan-500/30 to-rose-500/30 rounded-full blur-3xl animate-pulse" />
               <div className="relative w-48 h-48 rounded-[64px] glass-premium p-4 border-white/20">
                  <div className="w-full h-full rounded-[50px] bg-gradient-to-tr from-slate-900 to-black flex items-center justify-center relative overflow-hidden">
                     <User className="w-24 h-24 text-white opacity-20" />
                     <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-transparent" />
                  </div>
                  
                  {/* Badge in Bottom Right */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-2xl border-4 border-black">
                     <Medal className="w-8 h-8 text-cyan-600" strokeWidth={3} />
                  </div>
               </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-4xl font-black text-white tracking-tight leading-tight">{profile.nombre}</h2>
              <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.5em] mt-6 block italic">Operador Élite</span>
            </div>

            {/* Amber Pulsing Rotation Icon ONLY */}
            <div className="absolute bottom-10 text-amber-500 animate-pulse">
               <RotateCw className="w-8 h-8" strokeWidth={3} />
            </div>
          </div>

          {/* BACK */}
          <div 
            className="absolute inset-0 backface-hidden glass-card-premium rounded-[54px] p-10 flex flex-col justify-between border-white/20 shadow-2xl bg-black/80"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12" /> {/* Spacer */}
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] opacity-40">Expediente</h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(!isEditing);
                  }}
                  className="px-6 py-2 rounded-full glass-premium border-cyan-500/30 text-[10px] font-black text-cyan-400 uppercase tracking-widest"
                >
                  {isEditing ? 'Guardar' : 'Editar'}
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-8">
                {[
                  { icon: User, label: 'Nombre Completo', value: profile.nombre, key: 'nombre' },
                  { icon: Mail, label: 'Correo Operativo', value: profile.correo, key: 'correo' },
                  { icon: MapPin, label: 'Dirección Base', value: profile.direccion, key: 'direccion' },
                  { icon: Calendar, label: 'Edad', value: profile.edad, key: 'edad' },
                  { icon: Dna, label: 'Género', value: profile.genero, key: 'genero' },
                  { icon: Droplet, label: 'Tipo de Sangre', value: profile.tipoSangre, key: 'tipoSangre' },
                ].map((field, i) => (
                  <div 
                    key={i} 
                    className="flex flex-col gap-1 p-4 rounded-3xl bg-white/5 border border-white/5"
                    onClick={(e) => isEditing && e.stopPropagation()}
                  >
                     <div className="flex items-center gap-2 mb-1">
                        <field.icon className="w-3 h-3 text-white/40" />
                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{field.label}</span>
                     </div>
                     {isEditing ? (
                       <input 
                         type="text"
                         defaultValue={field.value}
                         className="bg-transparent border-none p-0 text-sm font-bold text-white focus:ring-0 w-full outline-none"
                         autoFocus={i === 0}
                         onClick={(e) => e.stopPropagation()}
                       />
                     ) : (
                       <span className="text-sm font-bold text-white tracking-tight">{field.value}</span>
                     )}
                  </div>
                ))}
              </div>
              
              {/* Amber Pulsing Rotation Icon ONLY (Back) */}
              <div className="pt-4 flex items-center justify-center text-amber-500 animate-pulse">
                 <RotateCw className="w-8 h-8" strokeWidth={3} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-12">
        
        {/* PERSONALIZATION */}
        <div>
          <h3 className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em] mb-8 ml-6">Personalización Operativa</h3>
          <div className="space-y-4">
            
            {/* Notification Vibration */}
            <button
              onClick={cycleVibracion}
              className="w-full glass-card-premium p-8 rounded-[40px] flex items-center justify-between group transition-all duration-500 hover:bg-white/[0.06] border-white/5 active:scale-[0.98]"
            >
              <div className="flex items-center gap-8">
                <div className="p-5 rounded-[24px] border border-white/10 shadow-xl transition-all group-hover:scale-110 text-amber-500 bg-white/5">
                  <Activity className="w-8 h-8" strokeWidth={3} />
                </div>
                <div className="flex flex-col items-start leading-none">
                   <span className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-2">Vibración de notificación</span>
                   <span className="text-xl font-bold text-white">{settings.vibracion}</span>
                </div>
              </div>
              <div className="flex gap-1.5">
                 {[1,2,3].map(i => (
                   <div key={i} className={cn("w-1.5 h-6 rounded-full transition-all", 
                     (settings.vibracion === 'Suave' && i === 1) || 
                     (settings.vibracion === 'Medio' && i <= 2) || 
                     (settings.vibracion === 'Fuerte' && i <= 3) 
                     ? "bg-amber-500" : "bg-white/10"
                   )} />
                 ))}
              </div>
            </button>

            {/* Display Mode */}
            <button
              onClick={cycleInterface}
              className="w-full glass-card-premium p-8 rounded-[40px] flex items-center justify-between group transition-all duration-500 hover:bg-white/[0.06] border-white/5 active:scale-[0.98]"
            >
              <div className="flex items-center gap-8">
                <div className="p-5 rounded-[24px] border border-white/10 shadow-xl transition-all group-hover:scale-110 text-white bg-white/5">
                  <Smartphone className="w-8 h-8" strokeWidth={3} />
                </div>
                <div className="flex flex-col items-start leading-none">
                   <span className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-2">Modo de Pantalla</span>
                   <span className="text-xl font-bold text-white">{settings.interfaz}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full glass-premium flex items-center justify-center text-white/40">
                <ChevronRight className="w-6 h-6" strokeWidth={3} />
              </div>
            </button>
          </div>
        </div>

        {/* NOTIFICATION CATEGORIES */}
        <div>
          <h3 className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em] mb-8 ml-6">Filtros de Alerta Real</h3>
          <div className="glass-card-premium rounded-[44px] border-white/5 divide-y divide-white/5 overflow-hidden">
            {[
              { id: 'seguridad', icon: ShieldAlert, label: 'Seguridad Crítica', color: 'text-rose-500' },
              { id: 'emergencia', icon: Zap, label: 'Respuesta Emergencia', color: 'text-orange-500' },
              { id: 'obstruccion', icon: TrafficCone, label: 'Obstrucción de Vía', color: 'text-amber-500' },
              { id: 'saturacion', icon: Users, label: 'Saturación Flujo', color: 'text-emerald-500' },
              { id: 'entorno', icon: Activity, label: 'Anomalías Entorno', color: 'text-cyan-500' },
            ].map((pref) => (
              <button
                key={pref.id}
                onClick={() => toggleNotification(pref.id as keyof typeof notificationPrefs)}
                className="w-full flex items-center justify-between p-8 hover:bg-white/[0.02] transition-colors active:scale-[0.99] group"
              >
                <div className="flex items-center gap-6">
                  <div className={cn("p-3 rounded-2xl bg-white/5 transition-all group-hover:scale-110", pref.color)}>
                    <pref.icon className="w-5 h-5" strokeWidth={3} />
                  </div>
                  <span className="text-base font-bold text-white tracking-tight">{pref.label}</span>
                </div>
                <div className={cn(
                  "w-14 h-8 rounded-full p-1.5 transition-all duration-500 flex items-center shadow-inner",
                  notificationPrefs[pref.id as keyof typeof notificationPrefs] ? "bg-cyan-500" : "bg-white/10"
                )}>
                  <motion.div 
                    animate={{ x: notificationPrefs[pref.id as keyof typeof notificationPrefs] ? 24 : 0 }}
                    className="w-5 h-5 bg-white rounded-full shadow-lg"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ACCOUNT MANAGEMENT */}
        <div>
          <h3 className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em] mb-8 ml-6">Gestión de Enlace</h3>
          <div className="space-y-4">
             <button className="w-full h-24 glass-card-premium rounded-[40px] flex items-center gap-8 px-8 border-white/5 hover:bg-white/[0.04] transition-all group active:scale-95">
                <div className="w-12 h-12 rounded-2xl glass-premium flex items-center justify-center text-cyan-400">
                   <Users className="w-6 h-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-[0.3em] text-white">Cambiar de Cuenta</span>
             </button>

             <button className="w-full h-24 glass-card-premium rounded-[40px] flex items-center gap-8 px-8 border-rose-500/10 hover:bg-rose-500/5 transition-all group active:scale-95">
                <div className="w-12 h-12 rounded-2xl glass-premium flex items-center justify-center text-rose-500">
                   <Trash2 className="w-6 h-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-[0.3em] text-rose-500">Eliminar Perfil</span>
             </button>
          </div>
        </div>
        
        {/* Logout */}
        <div className="pt-20 pb-10">
           <button className="w-full py-12 glass-card-premium rounded-[54px] flex items-center justify-center gap-6 text-white font-black text-base uppercase tracking-[0.6em] border-white/10 hover:bg-white/5 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl">
              <LogOut className="w-8 h-8" strokeWidth={3} />
              Cerrar Protocolo
           </button>
        </div>
      </div>

      {/* Sync Toast */}
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

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}
