"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ChevronRight, Activity, Terminal, UserPlus, Fingerprint, ShieldCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('gabriel.ruiz@motus.mx');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    // Simulated latency for tactical feel
    await new Promise(r => setTimeout(r, 1200));

    if (mode === 'login') {
      try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        const response = await fetch("https://lookitag.com/motus/controlador/login.php", { 
          method: "POST", 
          body: formData 
        });

        const body = await response.text();
        if (!body.toLowerCase().includes("error")) {
          setStatus('success');
          setTimeout(onLogin, 800);
        } else {
          setError("ACCESO DENEGADO: CREDENCIALES INVÁLIDAS");
          setStatus('idle');
          if (navigator.vibrate) navigator.vibrate([100, 100]);
        }
      } catch (err) {
        setError("ERROR DE ENLACE: SERVIDOR NO DISPONIBLE");
        setStatus('idle');
      }
    } else if (mode === 'register') {
      if (password !== confirmPassword) {
        setError("FALLO DE SEGURIDAD: LOS CÓDIGOS NO COINCIDEN");
        setStatus('idle');
        return;
      }
      setStatus('success');
      setTimeout(() => {
        setMode('login');
        setStatus('idle');
        setError(null);
      }, 1500);
    } else {
      // Forgot mode
      setStatus('success');
      setTimeout(() => {
        setMode('login');
        setStatus('idle');
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[900] bg-black flex flex-col items-center justify-center px-6 overflow-hidden font-sans">
      
      {/* HUD Background System */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px]" />

      {/* HEADER LOGO SECTION */}
      <motion.div 
        layout
        className="w-full max-w-lg mb-12 flex flex-col items-center relative z-10"
      >
        <div className="relative group mb-8">
           <div className="absolute -inset-6 bg-cyan-400/20 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative w-28 h-28 rounded-[40px] glass-premium flex items-center justify-center border-white/20 shadow-[0_0_50px_rgba(34,211,238,0.15)] backdrop-blur-3xl">
              <Activity className="w-14 h-14 text-cyan-400 animate-pulse" strokeWidth={3} />
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 to-transparent" />
              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-1 w-full animate-scan" />
           </div>
        </div>
        <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none select-none">MOTUS</h1>
        <div className="flex items-center gap-4 mt-6">
           <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-cyan-400/40" />
           <p className="text-[11px] font-black text-cyan-400/80 uppercase tracking-[0.4em] italic">Intelligence Node</p>
           <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-cyan-400/40" />
        </div>
      </motion.div>

      {/* MAIN AUTH CORE */}
      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          <motion.form 
            key={mode}
            onSubmit={handleAuthAction}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* View Title */}
            <div className="flex items-center justify-between pb-2">
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Fingerprint className="w-4 h-4 text-rose-500" />
                  {mode === 'login' ? 'Protocolo de Enlace' : mode === 'register' ? 'Alta de Operador' : 'Recuperación de Enlace'}
               </span>
               <span className="text-[9px] font-mono text-cyan-400/40 uppercase">SCT-PRTCL-09</span>
            </div>

            <div className="space-y-4">
               {mode === 'register' && (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-cyan-400 transition-colors">
                       <UserPlus className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-[32px] py-6 pl-16 pr-6 text-white font-bold focus:bg-white/[0.08] focus:border-cyan-400/50 outline-none transition-all placeholder:text-white/10"
                      placeholder="Nombre del Operador"
                      required
                    />
                 </motion.div>
               )}

               <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-cyan-400 transition-colors">
                     <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-[32px] py-6 pl-16 pr-6 text-white font-bold focus:bg-white/[0.08] focus:border-cyan-400/50 outline-none transition-all placeholder:text-white/10"
                    placeholder="Identificador Operativo"
                    required
                  />
               </div>

               {mode !== 'forgot' && (
                 <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-cyan-400 transition-colors">
                       <Lock className="w-5 h-5" />
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(
                        "w-full bg-white/[0.03] border border-white/10 rounded-[32px] py-6 pl-16 pr-6 text-white font-bold focus:bg-white/[0.08] focus:border-cyan-400/50 outline-none transition-all placeholder:text-white/10",
                        error && "border-rose-500 animate-shake"
                      )}
                      placeholder="Código de Enlace"
                      required
                    />
                 </div>
               )}

               {mode === 'register' && (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-cyan-400 transition-colors">
                       <ShieldCheck className="w-5 h-5" />
                    </div>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-[32px] py-6 pl-16 pr-6 text-white font-bold focus:bg-white/[0.08] focus:border-cyan-400/50 outline-none transition-all placeholder:text-white/10"
                      placeholder="Validar Código"
                      required
                    />
                 </motion.div>
               )}
            </div>

            {/* Error/Feedback Messaging */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center p-5 bg-rose-500/10 rounded-[24px] border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                   <span className="text-[11px] font-black text-rose-500 uppercase tracking-widest italic text-center leading-tight">
                    {error}
                   </span>
                </motion.div>
              )}
              {status === 'success' && mode !== 'login' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center p-5 bg-emerald-500/10 rounded-[24px] border border-emerald-500/20">
                   <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest italic text-center leading-tight">
                    PROTOCOL_STATE: SUCCESS. VOLVIENDO AL ENLACE...
                   </span>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={status === 'loading'}
              className="w-full py-7 bg-white text-black font-black uppercase tracking-[0.5em] rounded-full text-[10px] shadow-[0_20px_50px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group disabled:opacity-50 overflow-hidden relative"
            >
              <div className="relative z-10 flex items-center gap-4">
                {status === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    <span>Estableciendo Túnel</span>
                  </>
                ) : (
                  <>
                    {mode === 'login' ? 'Establecer Enlace' : mode === 'register' ? 'Sincronizar Operador' : 'Enviar Código Temporal'}
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              {status === 'success' && <motion.div layoutId="flare" className="absolute inset-0 bg-emerald-500 z-20 shadow-[0_0_50px_rgba(16,185,129,0.8)]" />}
            </button>

            {mode === 'login' && (
              <div className="space-y-6 pt-6">
                <div className="flex items-center gap-6">
                   <div className="h-px flex-1 bg-white/5" />
                   <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">External Nodes</span>
                   <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <button type="button" onClick={onLogin} className="flex items-center justify-center gap-4 py-5 rounded-[28px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition-all group active:scale-95">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#EA4335]/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-2 h-2 rounded-full bg-[#EA4335]" />
                      </div>
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-white transition-colors">Google</span>
                   </button>
                   <button type="button" onClick={onLogin} className="flex items-center justify-center gap-4 py-5 rounded-[28px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition-all group active:scale-95">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#1877F2]/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-2 h-2 rounded-full bg-[#1877F2]" />
                      </div>
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-white transition-colors">Facebook</span>
                   </button>
                </div>
              </div>
            )}

            <div className="flex flex-col items-center gap-5 pt-6">
               <div className="flex items-center gap-4 w-full">
                  <div className="h-px flex-1 bg-white/5" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/20" />
                  <div className="h-px flex-1 bg-white/5" />
               </div>
               
               {mode === 'login' ? (
                 <div className="flex flex-col items-center gap-4">
                   <button 
                    type="button" 
                    onClick={() => setMode('forgot')}
                    className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-cyan-400 transition-colors"
                  >
                    Olvidé mi código operativo
                  </button>
                   <button 
                    type="button" 
                    onClick={() => setMode('register')}
                    className="group flex flex-col items-center"
                  >
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-white transition-colors">Solicitar Registro de Operador</span>
                    <div className="h-[2px] w-0 group-hover:w-full bg-cyan-400 transition-all duration-500 mt-1" />
                  </button>
                 </div>
               ) : (
                 <button 
                  type="button" 
                  onClick={() => setMode('login')}
                  className="px-8 py-3 rounded-full border border-cyan-400/30 text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] hover:bg-cyan-400 hover:text-black transition-all active:scale-95"
                >
                  Regresar al Enlace
                </button>
               )}
            </div>
          </motion.form>
        </AnimatePresence>
      </div>

      {/* FOOTER SYSTEM STATE */}
      <div className="absolute bottom-10 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 text-white/5">
          <Terminal className="w-4 h-4 text-rose-500/50" />
          <span className="text-[9px] font-mono tracking-[0.2em]">DECRYPTING_SECURE_AUTH_V2</span>
        </div>
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(110px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
}
