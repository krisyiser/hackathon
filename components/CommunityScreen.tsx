"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Sparkles,
  Send,
  Plus
} from 'lucide-react';
import { Comment } from '@/types/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function CommunityScreen() {
  const [comments, setComments] = useState<Comment[]>([
    { id: '1', user: 'Gabriel_RD', content: 'Línea 7 presenta saturación crítica en trasbordo Mixcoac. Consideren rutas en MB.', created_at: new Date().toISOString(), likes: 42 },
    { id: '2', user: 'Sofi_Mobility', content: '¡Cuidado! Zócalo cerrado por evento masivo. El acceso por calle Madero está bloqueado.', created_at: new Date(Date.now() - 3600000).toISOString(), likes: 128 },
    { id: '3', user: 'Xavier_Urban', content: 'Tip de hoy: MB Línea 1 está operando con normalidad y los vagones están semivacíos.', created_at: new Date(Date.now() - 7200000).toISOString(), likes: 89 }
  ]);
  const [newComment, setNewComment] = useState('');

  const handlePost = () => {
    if (!newComment.trim()) return;
    const post: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      user: 'Tú',
      content: newComment,
      created_at: new Date().toISOString(),
      likes: 0
    };
    setComments([post, ...comments]);
    setNewComment('');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-black px-8 pt-40 pb-48 no-scrollbar relative">
      <div className="mb-16 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-[12px] font-black text-white uppercase tracking-[0.4em] mb-2 opacity-60">Voz Global</h2>
          <h3 className="text-4xl font-black text-white tracking-tight">Pulso Comunidad</h3>
        </div>
        <div className="w-16 h-16 rounded-[24px] glass-premium flex items-center justify-center border-white/20">
           <Users className="w-8 h-8 text-emerald-400" strokeWidth={3} />
        </div>
      </div>

      <div className="space-y-12">
        {/* Apple-style Post Composer */}
        <div className="glass-card-premium p-10 rounded-[48px] border-white/10 relative group transition-all duration-700 hover:bg-white/[0.08]">
          <div className="flex items-start gap-6 mb-10">
             <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-xl ring-4 ring-white/10">
                TÚ
             </div>
             <div className="flex-1">
                <textarea 
                   value={newComment}
                   onChange={(e) => setNewComment(e.target.value)}
                   placeholder="Comparte una actualización..."
                   className="w-full bg-transparent border-none text-white placeholder:text-white/40 text-xl font-bold focus:ring-0 resize-none px-0 min-h-[80px]"
                />
             </div>
          </div>
          <div className="flex items-center justify-between pt-8 border-t border-white/10">
             <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full glass-premium flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer border-white/10">
                   <Plus className="w-6 h-6" strokeWidth={3} />
                </div>
             </div>
             <button 
                onClick={handlePost}
                disabled={!newComment.trim()}
                className="px-10 py-4 bg-white text-black rounded-[28px] text-[13px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
             >
                Publicar
             </button>
          </div>
        </div>

        {/* Post Stream */}
        <div className="space-y-8">
           {comments.map((comment, idx) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card-premium p-10 rounded-[48px] group hover:bg-white/[0.06] transition-all border-white/10"
              >
                 <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 rounded-full glass-premium border-white/20 flex items-center justify-center text-white group-hover:border-cyan-500/50 transition-all font-black text-[12px]">
                          {comment.user.charAt(0)}
                       </div>
                       <div className="flex flex-col">
                          <span className="text-lg font-black text-white hover:text-cyan-400 transition-colors leading-none">{comment.user}</span>
                          <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mt-2">Corresponsal verificado</span>
                       </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-white uppercase opacity-40">{new Date(comment.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                 </div>
                 
                 <p className="text-xl text-white font-semibold leading-tight mb-10 px-1 hover:text-cyan-100 transition-all tracking-tight">
                    {comment.content}
                 </p>

                 <div className="flex items-center justify-between gap-10 pt-8 border-t border-white/10">
                    <div className="flex gap-10">
                       <button className="flex items-center gap-3 text-white/40 hover:text-rose-500 transition-all group-hover:text-white/80">
                          <Heart className={cn("w-6 h-6", comment.likes > 50 && "fill-rose-500 text-rose-500")} strokeWidth={3} />
                          <span className="text-[12px] font-black">{comment.likes}</span>
                       </button>
                       <button className="flex items-center gap-3 text-white/40 hover:text-cyan-400 transition-all group-hover:text-white/80">
                          <MessageCircle className="w-6 h-6" strokeWidth={3} />
                          <span className="text-[12px] font-black">Compartir</span>
                       </button>
                    </div>
                    <button className="p-4 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all border border-transparent hover:border-white/10">
                       <Share2 className="w-5 h-5" />
                    </button>
                 </div>
              </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
}
