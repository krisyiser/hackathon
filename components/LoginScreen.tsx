"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ChevronRight, Activity, Terminal } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('gabriel.ruiz@motus.mx');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(false);

    // Simulate Network Delay
    setTimeout(() => {
      if (password === 'demo') {
        onLogin();
      } else {
        setError(true);
        setIsVerifying(false);
        if (navigator.vibrate) navigator.vibrate([100, 100]);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[900] bg-black flex flex-col items-center justify-center px-6">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-rose-900/10 blur-[160px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg mb-12 flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-[32px] glass-premium flex items-center justify-center border-white/20 mb-8 shadow-2xl">
           <Activity className="w-10 h-10 text-cyan-400" strokeWidth={3} />
        </div>
        <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">MOTUS</h1>
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] text-center italic">Sistema de Movilidad Inteligente</p>
      </motion.div>

      <motion.form 
        onSubmit={handleLogin}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="space-y-4">
           {/* Email Input */}
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

           {/* Password Input */}
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
                  error && "border-rose-500/50 animate-shake"
                )}
                placeholder="Código de Enlace"
                required
              />
           </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
               <span className="text-[11px] font-black text-rose-500 uppercase tracking-widest italic">Código Inválido. Intento Registrado.</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          disabled={isVerifying}
          className="w-full py-7 bg-white text-black font-black uppercase tracking-[0.6em] rounded-full text-xs shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
        >
          {isVerifying ? (
            <div className="flex items-center gap-3">
               <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
               <span>Verificando</span>
            </div>
          ) : (
            <>
              Establecer Enlace
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="pt-8 flex flex-col items-center gap-4">
           <button type="button" className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-white transition-colors">Olvidé mi código operativo</button>
           <div className="flex items-center gap-3 text-white/10">
              <Terminal className="w-4 h-4" />
              <span className="text-[8px] font-mono lowercase">v2.0.4-build.stable</span>
           </div>
        </div>
      </motion.form>
    </div>
  );
}
