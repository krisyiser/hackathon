import dynamic from 'next/dynamic';
import { ActionSheet } from '@/components/ActionSheet';
import { Sidebar } from '@/components/Sidebar';

// Import Map with no SSR for Leaflet
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-screen bg-slate-950 animate-pulse" />
});

export default function Home() {
  return (
    <main className="flex min-h-screen bg-slate-950 overflow-hidden relative font-sans">
      {/* Web Layout: Sidebar */}
      <Sidebar />

      {/* Main Viewport */}
      <div className="flex-1 relative overflow-hidden">
        <Map />
        
        {/* HUD Elements Overlay */}
        <div className="absolute top-8 right-8 z-10 flex flex-col items-end gap-3 pointer-events-none group">
          <div className="px-6 py-3 bg-slate-950/80 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-2xl flex items-center gap-6 group-hover:scale-[1.02] transition-transform duration-500">
            <div className="flex flex-col items-end border-r border-white/10 pr-6 mr-2">
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] leading-none mb-1">Network_Status</p>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-white font-mono font-bold tracking-tighter">12ms_LATENCY</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] leading-none mb-1">Active_Zone</p>
              <span className="text-[12px] text-white font-mono font-bold tracking-tighter uppercase whitespace-nowrap italic">MEXICO CITY (CDMX) HUB</span>
            </div>
          </div>
        </div>

        <div className="absolute top-8 left-8 z-10 block lg:hidden">
          <h1 className="text-3xl font-black bg-gradient-to-br from-white via-blue-400 to-indigo-600 bg-clip-text text-transparent tracking-tighter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] uppercase italic">Motus_City</h1>
        </div>

        {/* Action Button for Voice (Floating) */}
        <div className="absolute bottom-10 right-10 z-10 hidden lg:block group">
          <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity" />
          <button 
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:scale-110 active:scale-95 transition-all text-white border-2 border-blue-400/50"
            title="System Command"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          </button>
        </div>

        {/* Mobile Layout: ActionSheet Drawer */}
        <div className="lg:hidden">
          <ActionSheet />
        </div>
      </div>
    </main>
  );
}
