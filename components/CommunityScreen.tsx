"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Send,
  CheckCircle2,
  Image as ImageIcon,
  Smile,
  MapPin
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Post {
  id: number;
  user: string;
  handle: string;
  avatar: string;
  content: string;
  likes: number;
  liked: boolean;
  replies: number;
  created_at: string;
}

export function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>([
    { 
      id: 1, 
      user: 'Elena Martínez', 
      handle: '@elena_m', 
      avatar: 'EM',
      content: 'Increíble la rapidez de respuesta en la Línea 9 hoy. Reporté un objeto en vías y en 3 minutos ya estaban atendiendo. ¡Gran trabajo! 🚇✨ #MetroCDMX', 
      likes: 24, 
      liked: false, 
      replies: 2, 
      created_at: '2m' 
    },
    { 
      id: 2, 
      user: 'Marco Polo', 
      handle: '@marcopolo_df', 
      avatar: 'MP',
      content: '¿Alguien sabe por qué hay tanto humo en Bellas Artes?🚨⚠️', 
      likes: 112, 
      liked: true, 
      replies: 15, 
      created_at: '15m' 
    },
    { 
      id: 3, 
      user: 'Sara Guerrero', 
      handle: '@sara_g', 
      avatar: 'SG',
      content: 'Cuidado en el transbordo de Pantitlán, mucha saturación en las escaleras eléctricas de la L1. Tomen precauciones. #AlertaVial', 
      likes: 45, 
      liked: false, 
      replies: 8, 
      created_at: '45m' 
    },
  ]);

  const [newContent, setNewContent] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleLike = (id: number) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const handlePublish = () => {
    if (!newContent.trim()) return;
    
    const newPost: Post = {
      id: Date.now(),
      user: 'Usuario Motus',
      handle: '@tu_usuario',
      avatar: 'TU',
      content: newContent,
      likes: 0,
      liked: false,
      replies: 0,
      created_at: 'Ahora'
    };

    setPosts([newPost, ...posts]);
    setNewContent('');
    triggerToast();
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-black pt-24 sm:pt-28 pb-48 no-scrollbar relative font-sans">
      
      {/* Header (Responsive Minimal) */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-black text-white italic tracking-tighter uppercase">Pulso Urbano</h2>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full glass-premium flex items-center justify-center text-blue-400">
           <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {/* INLINE COMPOSER Responsive */}
      <div className="p-5 sm:p-8 border-b border-white/5 relative">
        <div className="flex gap-4 sm:gap-6">
           <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white shrink-0 border border-white/10 text-xs sm:text-base">
             TU
           </div>

           <div className="flex-1">
             <div className="relative rounded-[24px] sm:rounded-[32px] transition-all duration-500 p-[1px] sm:p-[2px] overflow-hidden bg-gradient-to-tr from-blue-600/40 via-blue-400/20 to-cyan-400/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <div className="bg-black rounded-[23px] sm:rounded-[30px] p-4 sm:p-6">
                   <textarea 
                     value={newContent}
                     onChange={(e) => setNewContent(e.target.value)}
                     placeholder="¿Qué está pasando?"
                     className="w-full bg-transparent text-lg sm:text-xl text-white placeholder:text-white/20 border-none outline-none focus:ring-0 resize-none font-medium no-scrollbar min-h-[60px] sm:min-h-[100px]"
                   />
                </div>
                <div className="absolute inset-0 pointer-events-none blur-2xl bg-blue-500/5 animate-pulse" />
             </div>
             
             <div className="flex items-center justify-between pt-4 sm:pt-6 mt-2">
                <div className="flex gap-4 sm:gap-6 text-blue-400 opacity-60">
                   <button className="hover:text-blue-300 transition-colors"><ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" /></button>
                   <button className="hover:text-blue-300 transition-colors"><Smile className="w-5 h-5 sm:w-6 sm:h-6" /></button>
                </div>
                <button 
                  onClick={handlePublish}
                  className="px-6 sm:px-10 py-2.5 sm:py-4 bg-[#007AFF] text-white font-black rounded-full text-xs sm:text-base transition-all active:scale-95 uppercase tracking-widest shadow-[0_0_30px_rgba(0,122,255,0.4)]"
                >
                  Publicar
                </button>
             </div>
           </div>
        </div>
      </div>

      {/* Feed Responsive */}
      <div className="flex flex-col">
        {posts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-b border-white/5 p-5 sm:p-8 transition-colors cursor-pointer group hover:bg-white/[0.01]"
          >
            <div className="flex gap-4 sm:gap-6">
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-slate-950 flex items-center justify-center text-[10px] sm:text-xs font-black border border-white/5 text-white shrink-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent" />
                {post.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <span className="font-black text-white text-base sm:text-lg tracking-tight truncate">{post.user}</span>
                  <span className="text-white/20 text-xs sm:text-sm">·</span>
                  <span className="text-white/20 text-[10px] sm:text-sm font-bold">{post.created_at}</span>
                </div>

                <p className="text-base sm:text-[19px] text-white/90 leading-relaxed mb-4 sm:mb-6 font-medium whitespace-pre-wrap">
                  {post.content}
                </p>

                <div className="flex items-center gap-8 sm:gap-14 text-white/30">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                    className={cn("flex items-center gap-2 sm:gap-4 group/icon transition-all active:scale-90", post.liked ? "text-rose-500" : "hover:text-rose-500")}
                  >
                    <div className={cn("p-2 sm:p-4 rounded-full transition-all", post.liked ? "bg-rose-500/10 scale-110" : "group-hover/icon:bg-rose-500/10")}>
                      <Heart className={cn("w-5 h-5 sm:w-6 sm:h-6", post.liked && "fill-rose-500")} />
                    </div>
                    <span className="text-xs sm:text-md font-black">{post.likes}</span>
                  </button>

                  <button className="flex items-center gap-2 sm:gap-4 group/icon hover:text-blue-400 transition-colors">
                    <div className="p-2 sm:p-4 rounded-full group-hover/icon:bg-blue-400/10 transition-colors">
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-xs sm:text-md font-black">{post.replies}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[400] bg-[#007AFF] text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full flex items-center gap-3 sm:gap-4 shadow-[0_0_50px_rgba(0,122,255,0.4)] font-black uppercase text-[10px] sm:text-sm tracking-[0.2em]"
          >
             <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
             Transmitido
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
