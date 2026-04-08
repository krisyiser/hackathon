"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus,
  Send,
  X,
  CheckCircle2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Post {
  id: number;
  user: string;
  content: string;
  likes: number;
  liked: boolean;
  replies: number;
  created_at: string;
}

export function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, user: 'Elena M.', content: 'Increíble la rapidez de respuesta en la Línea 9 hoy.', likes: 24, liked: false, replies: 2, created_at: '2m' },
    { id: 2, user: 'Marco Polo', content: '¿Alguien sabe por qué hay tanto humo en Bellas Artes?', likes: 12, liked: true, replies: 5, created_at: '5m' },
    { id: 3, user: 'Sara G.', content: 'Cuidado en el transbordo de Pantitlán, mucha saturación.', likes: 45, liked: false, replies: 8, created_at: '10m' },
  ]);

  const [isPosting, setIsPosting] = useState(false);
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
      user: 'Tú', // In a real app, this would be the profile name
      content: newContent,
      likes: 0,
      liked: false,
      replies: 0,
      created_at: 'Ahora'
    };

    setPosts([newPost, ...posts]);
    setNewContent('');
    setIsPosting(false);
    triggerToast();
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-transparent px-8 pt-40 pb-48 no-scrollbar relative">
      
      {/* Header & Post Trigger */}
      <div className="mb-16 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em] mb-2">Voz Global</h2>
          <p className="text-4xl font-extrabold text-white tracking-tighter uppercase italic leading-none">Pulso Comunidad</p>
        </div>
        <button 
          onClick={() => setIsPosting(true)}
          className="w-16 h-16 rounded-3xl glass-premium flex items-center justify-center text-cyan-400 border-cyan-500/20 hover:scale-110 active:scale-95 transition-all shadow-lg shadow-cyan-500/10"
        >
           <Plus className="w-8 h-8" strokeWidth={3} />
        </button>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {isPosting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center px-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg glass-card-premium p-8 rounded-[48px] border-white/20"
            >
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-white tracking-tight">Nuevo Mensaje</h3>
                  <button onClick={() => setIsPosting(false)} className="text-white/40 hover:text-white">
                     <X className="w-6 h-6" />
                  </button>
               </div>
               
               <textarea 
                 value={newContent}
                 onChange={(e) => setNewContent(e.target.value)}
                 placeholder="¿Qué está pasando en la red?"
                 className="w-full h-40 bg-white/5 rounded-3xl p-6 text-white placeholder:text-white/20 border-none outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none font-medium mb-8"
                 autoFocus
               />

               <button 
                 onClick={handlePublish}
                 className="w-full py-6 bg-cyan-500 rounded-3xl text-black font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all active:scale-[0.98]"
               >
                  <Send className="w-6 h-6" strokeWidth={3} />
                  Publicar
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts Feed */}
      <div className="space-y-8">
        {posts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card-premium p-8 rounded-[48px] border-white/5 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-cyan-500/10 transition-colors" />
            
            <div className="flex flex-col gap-6 relative">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-rose-500 p-0.5">
                    <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center text-[10px] font-black text-white">
                       {post.user.charAt(0)}
                    </div>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-lg font-black text-white tracking-tight">{post.user}</span>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{post.created_at} atrás</span>
                 </div>
              </div>

              <p className="text-xl font-bold text-white/80 leading-relaxed tracking-tight">
                &ldquo;{post.content}&rdquo;
              </p>

              <div className="flex items-center gap-8 pt-4 border-t border-white/5">
                 <button 
                   onClick={() => handleLike(post.id)}
                   className="flex items-center gap-3 group/btn transition-all active:scale-90"
                 >
                    <Heart className={cn("w-6 h-6 transition-all", post.liked ? "text-rose-500 fill-rose-500" : "text-white/20 group-hover/btn:text-rose-500")} />
                    <span className={cn("text-sm font-black transition-all", post.liked ? "text-white" : "text-white/40")}>{post.likes}</span>
                 </button>
                 
                 <button className="flex items-center gap-3 group/btn">
                    <MessageCircle className="w-6 h-6 text-white/20 group-hover/btn:text-cyan-400 transition-colors" />
                    <span className="text-sm font-black text-white/40 group-hover/btn:text-white transition-colors">{post.replies}</span>
                 </button>
                 
                 <button className="ml-auto">
                    <Share2 className="w-6 h-6 text-white/10 hover:text-white transition-colors" />
                 </button>
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
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[400] glass-premium px-8 py-4 rounded-full border-cyan-500/30 flex items-center gap-3"
          >
             <CheckCircle2 className="w-5 h-5 text-cyan-400" />
             <span className="text-xs font-black text-white uppercase tracking-widest">Mensaje Enviado</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
