"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ChevronRight, Activity, Terminal, UserPlus, Fingerprint, ShieldCheck, KeyRound, UserCircle } from 'lucide-react';
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

    // Tactical delay
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
        setError("CÓDIGOS DE SEGURIDAD NO COINCIDEN");
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
      setStatus('success');
      setTimeout(() => {
        setMode('login');
        setStatus('idle');
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[900] bg-black flex flex-col items-center justify-center px-6 overflow-hidden safe-area-inset">
      
      {/* HUD Background System */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />

      {/* DYNAMIC FORM CONTAINER */}
      <motion.div 
        layout
        className="w-full max-w-md relative z-10 flex flex-col items-center"
      >
        {/* LOGO HUD */}
        <div className="relative group mb-12">
            <div className="absolute -inset-6 bg-cyan-400/20 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[40px] glass-premium flex items-center justify-center border-white/20 shadow-[0_0_50px_rgba(34,211,238,0.2)] backdrop-blur-3xl">
                <Activity className="w-12 h-12 sm:w-14 sm:h-14 text-cyan-400 animate-pulse" strokeWidth={3} />
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-1 w-full animate-scan" />
            </div>
        </div>

        <h1 className="text-5xl sm:text-6xl font-black text-white italic tracking-tighter uppercase leading-none mb-2 select-none">MOTUS</h1>
        <p className="text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.5em] italic mb-10">Intelligence Node</p>

        <AnimatePresence mode="wait">
          <motion.form 
            key={mode}
            onSubmit={handleAuthAction}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full space-y-6"
          >
            {/* Context Title */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                    {mode === 'login' ? <Fingerprint className="w-5 h-5 text-rose-500" /> : mode === 'register' ? <UserPlus className="w-5 h-5 text-cyan-400" /> : <KeyRound className="w-5 h-5 text-amber-500" />}
                    {mode === 'login' ? 'Establecer Enlace' : mode === 'register' ? 'Nuevo Registro' : 'Recuperar Enlace'}
                </h2>
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-tighter">PROTO_AUTH_v3.2</span>
            </div>

            <div className="space-y-4">
              {mode === 'register' && (
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-cyan-400 transition-colors">
                      <UserCircle className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-[28px] py-5 pl-16 pr-6 text-white font-bold focus:bg-white/[0.08] focus:border-cyan-400/50 outline-none transition-all placeholder:text-white/10"
                    placeholder="Nombre del Operador"
                    required
                  />
                </div>
              )}

              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-cyan-400 transition-colors">
                    <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-[28px] py-5 pl-16 pr-6 text-white font-bold focus:bg-white/[0.08] focus:border-cyan-400/50 outline-none transition-all placeholder:text-white/10"
                  placeholder="ID de Enlace (Email)"
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
                      "w-full bg-white/[0.03] border border-white/10 rounded-[28px] py-5 pl-16 pr-6 text-white font-bold focus:bg-white/[0.08] focus:border-cyan-400/50 outline-none transition-all placeholder:text-white/10",
                      error && "border-rose-500 animate-shake"
                    )}
                    placeholder="Código de Seguridad"
                    required
                  />
                </div>
              )}

              {mode === 'register' && (
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-cyan-400 transition-colors">
                      <ShieldCheck className="w-5 h-5" />
                  </div>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-[28px] py-5 pl-16 pr-6 text-white font-bold focus:bg-white/[0.08] focus:border-cyan-400/50 outline-none transition-all placeholder:text-white/10"
                    placeholder="Validar Código"
                    required
                  />
                </div>
              )}
            </div>

            {/* FEEDBACK */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-500/10 rounded-[24px] border border-rose-500/20">
                  <span className="text-[11px] font-black text-rose-500 uppercase tracking-widest italic text-center block leading-tight">{error}</span>
                </motion.div>
              )}
              {status === 'success' && mode !== 'login' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-500/10 rounded-[24px] border border-emerald-500/20">
                  <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest italic text-center block leading-tight">PROTO_SUCCESS. REDIRECCIONANDO AL NODO...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={status === 'loading'}
              className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.6em] rounded-full text-xs shadow-[0_20px_60px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group disabled:opacity-50 overflow-hidden relative"
            >
              <div className="relative z-10 flex items-center gap-4">
                {status === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    <span>Estableciendo Túnel</span>
                  </>
                ) : (
                  <>
                    {mode === 'login' ? 'Establecer Enlace' : mode === 'register' ? 'Sincronizar' : 'Enviar temporal'}
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              {status === 'success' && <motion.div layoutId="flare" className="absolute inset-0 bg-emerald-500 z-20 shadow-[0_0_50px_rgba(16,185,129,0.8)]" />}
            </button>

            {/* LINKS SECTION - REFINED */}
            <div className="pt-6 space-y-8">
                {mode === 'login' ? (
                   <div className="grid grid-cols-1 gap-6">
                      <div className="flex items-center justify-between gap-4">
                         <button onClick={() => setMode('forgot')} type="button" className="text-[11px] font-black text-white/30 hover:text-cyan-400 uppercase tracking-widest transition-colors flex items-center gap-2">
                             <KeyRound className="w-4 h-4" /> ¿OLVIDASTE TU CÓDIGO?
                         </button>
                         <button onClick={() => setMode('register')} type="button" className="text-[11px] font-black text-white/30 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                             <UserPlus className="w-4 h-4" /> REGÍSTRATE
                         </button>
                      </div>

                      <div className="flex items-center gap-6">
                         <div className="h-px flex-1 bg-white/5" />
                         <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">External Connect</span>
                         <div className="h-px flex-1 bg-white/5" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <button type="button" onClick={onLogin} className="flex items-center justify-center gap-4 py-4 rounded-[24px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all group active:scale-95">
                            <div className="w-2 h-2 rounded-full bg-[#EA4335]" />
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Google</span>
                         </button>
                         <button type="button" onClick={onLogin} className="flex items-center justify-center gap-4 py-4 rounded-[24px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all group active:scale-95">
                            <div className="w-2 h-2 rounded-full bg-[#1877F2]" />
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Facebook</span>
                         </button>
                      </div>
                   </div>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setMode('login')}
                    className="w-full py-4 rounded-3xl border border-white/10 text-[11px] font-black text-white/60 uppercase tracking-[0.4em] hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                  >
                    Regresar al Enlace Principal
                  </button>
                )}
            </div>
          </motion.form>
        </AnimatePresence>
      </motion.div>

      {/* FOOTER SYSTEM STATE */}
      <div className="absolute bottom-10 flex flex-col items-center gap-4 opacity-30">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-rose-500" />
          <span className="text-[9px] font-mono tracking-[0.2em] text-white">DECRYPTING_SECURE_AUTH_v3.2</span>
        </div>
        <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(110px); opacity: 0; }
        }
        .animate-scan { animation: scan 4s linear infinite; }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .safe-area-inset {
            padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}
