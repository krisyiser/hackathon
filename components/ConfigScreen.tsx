"use client";

import React, { useState } from 'react';
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
  Award,
  Zap,
  Trash2,
  Users,
  Droplet,
  Dna
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Global hook/state reference would be better, but for this demo I'll handle it locally and pass to parent if needed.
// However, I'll assume the user wants it to WORK visually. 
// I'll add a simple message system to tell the parent (page.tsx) to change theme.

export function ConfigScreen({ onThemeChange }: { onThemeChange: (theme: string) => void }) {
  const [profile, setProfile] = useState({
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

  const triggerFeedback = () => {
    setHasChanged(true);
    if (navigator.vibrate) navigator.vibrate(10);
    setTimeout(() => setHasChanged(false), 1500);
  };

  const badges = [
    { icon: Zap, label: 'Early Responder', color: 'text-amber-400' },
    { icon: Medal, label: 'Heroe Urbano', color: 'text-cyan-400' },
    { icon: Award, label: 'Colaborador Oro', color: 'text-rose-500' }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-40 pb-48 no-scrollbar bg-transparent relative">
      
      {/* Reversible Identity Card */}
      <div className="mb-28 perspective-1000 relative z-10">
        <motion.div 
          className="relative w-full h-[540px] preserve-3d cursor-pointer"
          animate={{ 
            rotateY: isFlipped ? 180 : 0,
            z: isFlipped ? 50 : 0 
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => !isEditing && setIsFlipped(!isFlipped)}
          style={{ zIndex: isFlipped ? 50 : 10 }}
        >
          {/* FRONT: Badge Showcase */}
          <div className="absolute inset-0 backface-hidden glass-card-premium rounded-[54px] p-10 flex flex-col items-center justify-between border-white/20 shadow-2xl z-20 overflow-hidden">
            <div className="flex flex-col items-center flex-1 justify-center">
               <div className="relative mb-8">
                  <div className="absolute -inset-8 bg-gradient-to-tr from-cyan-500/30 to-rose-500/30 rounded-full blur-3xl animate-pulse" />
                  <div className="relative w-40 h-40 rounded-[56px] glass-premium p-4 border-white/20 overflow-hidden">
                    <div className="w-full h-full rounded-[42px] bg-gradient-to-tr from-slate-900 to-black flex items-center justify-center relative overflow-hidden">
                       <User className="w-20 h-20 text-white opacity-20" />
                       <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-transparent" />
                    </div>
                  </div>
               </div>
               
               <div className="text-center">
                 <h2 className="text-3xl font-black text-white tracking-tight leading-tight">{profile.nombre}</h2>
                 <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mt-4 block">Identidad Verificada</span>
               </div>
            </div>

            {/* Badge Showcase (Replaced the chip) */}
            <div className="w-full flex items-center justify-center gap-4 py-6 border-t border-white/10 mt-8">
               {badges.map((badge, i) => (
                 <div key={i} className="flex flex-col items-center gap-2">
                    <div className={cn("w-14 h-14 rounded-2xl glass-premium flex items-center justify-center", badge.color)}>
                       <badge.icon className="w-6 h-6" strokeWidth={3} />
                    </div>
                    <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">{badge.label.split(' ')[0]}</span>
                 </div>
               ))}
            </div>

            <div className="absolute bottom-6 flex items-center gap-2 text-white/20 font-black text-[9px] tracking-widest uppercase">
               <RotateCw className="w-3 h-3" /> Ver Expediente Técnico
            </div>
          </div>

          {/* BACK: Editable Info */}
          <div 
            className="absolute inset-0 backface-hidden glass-card-premium rounded-[54px] p-10 flex flex-col justify-between border-white/20 shadow-2xl bg-black/80"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="space-y-4 overflow-y-auto no-scrollbar pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] opacity-60 text-left">Expediente Detallado</h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-2 rounded-full glass-premium border-cyan-500/30 text-[10px] font-black text-cyan-400 uppercase tracking-widest active:scale-95 transition-all"
                >
                  {isEditing ? 'Guardar' : 'Editar'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: User, label: 'Nombre Completo', value: profile.nombre, key: 'nombre' },
                  { icon: Mail, label: 'Correo Operativo', value: profile.correo, key: 'correo' },
                  { icon: MapPin, label: 'Dirección Base', value: profile.direccion, key: 'direccion' },
                  { icon: Calendar, label: 'Edad', value: profile.edad, key: 'edad' },
                  { icon: Dna, label: 'Género', value: profile.genero, key: 'genero' },
                  { icon: Droplet, label: 'Tipo de Sangre', value: profile.tipoSangre, key: 'tipoSangre' },
                ].map((field, i) => (
                  <div key={i} className="flex flex-col gap-1 p-4 rounded-3xl bg-white/5 border border-white/5">
                     <div className="flex items-center gap-2 mb-1">
                        <field.icon className="w-3 h-3 text-white/40" />
                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{field.label}</span>
                     </div>
                     {isEditing ? (
                       <input 
                         type="text"
                         value={profile[field.key as keyof typeof profile]}
                         onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                         className="bg-transparent border-none p-0 text-sm font-bold text-white focus:ring-0 w-full"
                       />
                     ) : (
                       <span className="text-sm font-bold text-white tracking-tight">{field.value}</span>
                     )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-12">
        
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

      {/* Sync Notification */}
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
