"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { MapScreen } from "@/components/MapScreen";
import { ReportScreen } from "@/components/ReportScreen";
import { IncidentsScreen } from "@/components/IncidentsScreen";
import { CommunityScreen } from "@/components/CommunityScreen";
import { ConfigScreen } from "@/components/ConfigScreen";
import { SplashScreen } from "@/components/SplashScreen";
import { LoginScreen } from "@/components/LoginScreen";
import { TabType } from "@/types/navigation";

type AppState = "splash" | "login" | "app";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("splash");
  const [activeTab, setActiveTab] = useState<TabType>("reporte");
  const [theme, setTheme] = useState("apple-glass");

  const handleLoginSuccess = () => {
    localStorage.setItem('motus_auth', 'true');
    setAppState("app");
  };

  const renderView = () => {
    switch (activeTab) {
      case "mapa": return <MapScreen />;
      case "reporte": return <ReportScreen />;
      case "incidentes": return <IncidentsScreen />;
      case "comunidad": return <CommunityScreen />;
      case "configuracion": return <ConfigScreen onThemeChange={setTheme} />;
      default: return <MapScreen />;
    }
  };

  return (
    <main className={`relative h-[100dvh] w-full flex flex-col theme-${theme} transition-all duration-700 bg-black overflow-hidden`}>
      <AnimatePresence mode="wait">
        
        {/* State 1: Splash */}
        {appState === "splash" && (
          <motion.div 
            key="splash" 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <SplashScreen onComplete={() => setAppState("login")} />
          </motion.div>
        )}

        {/* State 2: Login */}
        {appState === "login" && (
          <motion.div 
            key="login" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 0.8 }}
          >
            <LoginScreen onLogin={handleLoginSuccess} />
          </motion.div>
        )}

        {/* State 3: Core App */}
        {appState === "app" && (
          <motion.div 
            key="app" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}
