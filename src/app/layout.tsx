import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ADIPA · Monitoreo de Inversión Publicitaria",
  description:
    "Monitoreo de inversión publicitaria por país y programa — ADIPA",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-fondo text-marino">
        <NavBar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
        <footer className="text-center text-xs text-marino/50 py-6">
          ADIPA · Datos de ejemplo (mock) — no conectado a BigQuery / Meta / Google Ads
        </footer>
      </body>
    </html>
  );
}
