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
          setError("CREDENCIALES INVÁLIDAS");
          setStatus('idle');
          if (navigator.vibrate) navigator.vibrate([100, 100]);
        }
      } catch (err) {
        setError("ERROR DE CONEXIÓN");
        setStatus('idle');
      }
    } else {
      setStatus('success');
      setTimeout(() => {
        setMode('login');
        setStatus('idle');
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[900] bg-black flex flex-col items-center justify-center p-6 sm:p-10 overflow-hidden h-[100dvh]">
      
      {/* HUD Background System */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[140px]" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px]" />

      {/* COMPACT MAIN CONTAINER */}
      <motion.div 
        layout
        className="w-full max-w-sm sm:max-w-md relative z-10 flex flex-col items-center"
      >
        {/* SMALLER LOGO HUD */}
        <div className="relative group mb-6 sm:mb-8">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[32px] sm:rounded-[40px] glass-premium flex items-center justify-center border-white/20 shadow-2xl backdrop-blur-3xl overflow-hidden">
                <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 animate-pulse" strokeWidth={3} />
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-1 w-full animate-scan" />
            </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white italic tracking-tighter uppercase leading-none mb-1 select-none">MOTUS</h1>
        <p className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-[0.4em] italic mb-8 sm:mb-10">Intelligence Node</p>

        <AnimatePresence mode="wait">
          <motion.form 
            key={mode}
            onSubmit={handleAuthAction}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full space-y-4 sm:space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                    {mode === 'login' ? <Fingerprint className="w-4 h-4 text-rose-500" /> : mode === 'register' ? <UserPlus className="w-4 h-4 text-cyan-400" /> : <KeyRound className="w-4 h-4 text-amber-500" />}
                    {mode === 'login' ? 'ENLACE' : mode === 'register' ? 'REGISTRO' : 'RECUPERAR'}
                </h2>
                <span className="text-[9px] font-mono text-white/10 uppercase tracking-tighter italic">V3.2.0</span>
            </div>

            <div className="space-y-3">
              {mode === 'register' && (
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-cyan-400 transition-colors">
                      <UserCircle className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-[24px] py-4 pl-14 pr-6 text-sm text-white font-bold focus:bg-white/[0.08] focus:border-cyan-400/50 outline-none transition-all placeholder:text-white/5"
                    placeholder="OPERADOR"
                    required
                  />
                </div>
              )}

              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-cyan-400 transition-colors">
                    <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-[24px] py-4 pl-14 pr-6 text-sm text-white font-bold focus:bg-white/[0.08] focus:border-cyan-400/50 outline-none transition-all placeholder:text-white/5"
                  placeholder="ID ENLACE (EMAIL)"
                  required
                />
              </div>

              {mode !== 'forgot' && (
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-cyan-400 transition-colors">
                      <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      "w-full bg-white/[0.03] border border-white/10 rounded-[24px] py-4 pl-14 pr-6 text-sm text-white font-bold focus:bg-white/[0.08] focus:border-cyan-400/50 outline-none transition-all placeholder:text-white/5",
                      error && "border-rose-500 animate-shake"
                    )}
                    placeholder="CÓDIGO DE ACCESO"
                    required
                  />
                </div>
              )}

              {mode === 'register' && (
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-cyan-400 transition-colors">
                      <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-[24px] py-4 pl-14 pr-6 text-sm text-white font-bold focus:bg-white/[0.08] focus:border-cyan-400/50 outline-none transition-all placeholder:text-white/5"
                    placeholder="VALIDAR"
                    required
                  />
                </div>
              )}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-3 bg-rose-500/10 rounded-[16px] border border-rose-500/20 text-center">
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={status === 'loading'}
              className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.5em] rounded-full text-xs shadow-[0_15px_40px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 overflow-hidden relative"
            >
              <div className="relative z-10 flex items-center gap-3">
                {status === 'loading' ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'ESTABLECER ENLACE' : mode === 'register' ? 'SINCRONIZAR' : 'ENVIAR'}</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              {status === 'success' && <motion.div layoutId="flare" className="absolute inset-0 bg-emerald-500 z-20 shadow-[0_0_50px_rgba(16,185,129,0.8)]" />}
            </button>

            {/* COMPACT LINKS SECTION */}
            <div className="space-y-4 pb-2">
                {mode === 'login' && (
                   <div className="flex flex-col gap-5">
                      <div className="flex items-center justify-center gap-8">
                         <button onClick={() => setMode('forgot')} type="button" className="text-[10px] font-black text-white/30 hover:text-cyan-400 uppercase tracking-widest transition-colors">¿OLVIDASTE TU CÓDIGO?</button>
                         <button onClick={() => setMode('register')} type="button" className="text-[10px] font-black text-white/30 hover:text-white uppercase tracking-widest transition-colors">REGÍSTRATE</button>
                      </div>

                      <div className="flex items-center gap-4">
                         <div className="h-px flex-1 bg-white/5" />
                         <span className="text-[8px] font-black text-white/10 uppercase tracking-widest">NODOS EXTERNOS</span>
                         <div className="h-px flex-1 bg-white/5" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                         <button type="button" onClick={onLogin} className="flex items-center justify-center gap-3 py-3 rounded-[16px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all active:scale-95">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Google</span>
                         </button>
                         <button type="button" onClick={onLogin} className="flex items-center justify-center gap-3 py-3 rounded-[16px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all active:scale-95">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1877F2]" />
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Facebook</span>
                         </button>
                      </div>
                   </div>
                )}
                {mode !== 'login' && (
                  <button onClick={() => setMode('login')} type="button" className="w-full py-4 rounded-2xl border border-white/5 text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:bg-white/5 transition-all">REGRESAR AL NODO</button>
                )}
            </div>
          </motion.form>
        </AnimatePresence>
      </motion.div>

      {/* COMPACT FOOTER */}
      <div className="absolute bottom-6 flex flex-col items-center gap-1 opacity-20 scale-75">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-rose-500" />
          <span className="text-[10px] font-bold tracking-widest text-white uppercase italic">DECRYPT_AUTH_v3.2</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { transform: translateY(-10px); opacity: 0; } 50% { opacity: 0.5; } 100% { transform: translateY(110px); opacity: 0; } }
        .animate-scan { animation: scan 4s linear infinite; }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
      `}</style>
    </div>
  );
}
