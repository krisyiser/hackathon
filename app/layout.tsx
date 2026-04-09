import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "MOTUS CITY | Resilient Mobility CDMX",
  description: "Plataforma de reporte ciudadano con IA para una metrópolis conectada.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MOTUS CITY",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-slate-950 text-white selection:bg-blue-500/30 overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}

// Force Deploy: Wed Apr  8 21:00:01 CST 2026

// Update Sync: Wed Apr  8 22:07:32 CST 2026

// Final Payload Sync: Wed Apr  8 22:59:27 CST 2026

// Final Deploy Sync: Wed Apr  8 23:14:43 CST 2026
