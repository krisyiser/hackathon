import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["100", "300", "400", "600", "700", "900"], variable: "--font-montserrat" });

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
      <body className={`${montserrat.variable} font-sans bg-black text-white selection:bg-cyan-500/30 overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
