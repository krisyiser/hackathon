"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus
} from 'lucide-react';

export function CommunityScreen() {
  const [comments] = useState([
    { id: 1, user: 'Elena M.', content: 'Increíble la rapidez de respuesta en la Línea 9 hoy.', likes: 24, created_at: '2m' },
    { id: 2, user: 'Marco Polo', content: '¿Alguien sabe por qué hay tanto humo en Bellas Artes?', likes: 12, created_at: '5m' },
    { id: 3, user: 'Sara G.', content: 'Cuidado en el transbordo de Pantitlán, mucha saturación.', likes: 45, created_at: '10m' },
  ]);

  return (
    <div className="flex-1 overflow-y-auto bg-black px-8 pt-40 pb-48 no-scrollbar relative">
      <div className="mb-16 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-[12px] font-black text-white uppercase tracking-[0.4em] mb-2 opacity-60">Voz Global</h2>
          <p className="text-4xl font-extrabold text-white tracking-tighter uppercase italic leading-none">Pulso Comunidad</p>
        </div>
        <button className="w-16 h-16 rounded-2xl glass-premium flex items-center justify-center text-white border-white/10 hover:border-cyan-500/50 transition-all">
           <Plus className="w-8 h-8" />
        </button>
      </div>

      <div className="space-y-8">
        {comments.map((comment, idx) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card-premium p-8 rounded-[48px] border-white/5 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
            
            <div className="flex flex-col gap-6 relative">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-rose-500 p-0.5">
                    <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center text-[10px] font-black text-white">
                       {comment.user.charAt(0)}
                    </div>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-lg font-black text-white tracking-tight">{comment.user}</span>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{comment.created_at} atrás</span>
                 </div>
              </div>

              <p className="text-xl font-bold text-white/80 leading-relaxed tracking-tight">
                &ldquo;{comment.content}&rdquo;
              </p>

              <div className="flex items-center gap-8 pt-4">
                 <button className="flex items-center gap-3 group/btn">
                    <Heart className="w-6 h-6 text-white/20 group-hover/btn:text-rose-500 transition-colors" />
                    <span className="text-sm font-black text-white/40 group-hover/btn:text-white transition-colors">{comment.likes}</span>
                 </button>
                 <button className="flex items-center gap-3 group/btn">
                    <MessageCircle className="w-6 h-6 text-white/20 group-hover/btn:text-cyan-400 transition-colors" />
                    <span className="text-sm font-black text-white/40 group-hover/btn:text-white transition-colors">Responder</span>
                 </button>
                 <button className="ml-auto">
                    <Share2 className="w-6 h-6 text-white/10 hover:text-white transition-colors" />
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
