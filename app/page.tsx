import dynamic from 'next/dynamic';
import { ActionSheet } from '@/components/ActionSheet';

// Import Map with no SSR for Leaflet
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-screen bg-slate-950 animate-pulse" />
});

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-between min-h-screen">
      <Map />
      <ActionSheet />
      
      {/* HUD Elements */}
      <div className="fixed top-8 left-8 z-10 pointer-events-none">
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500 bg-clip-text text-transparent tracking-tighter mix-blend-difference drop-shadow-sm">
          MOTUS<span className="text-blue-500">.</span>CITY
        </h1>
        <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.3em] font-mono leading-none">CDMX RESILIENT HUB v0.1</p>
      </div>

      {/* Safety Concierge (Aesthetics) */}
      <div className="fixed top-8 right-8 z-10 flex flex-col items-end gap-2 text-right">
        <div className="px-4 py-2 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl">
          <p className="text-[10px] text-blue-400 font-bold uppercase">Estado de Red</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs text-white/80 font-medium">Estable</span>
          </div>
        </div>
      </div>
    </main>
  );
}
