import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

const displayFont = Space_Grotesk({
  variable: "--font-exosim-display",
  subsets: ["latin"],
  display: "swap",
});

const interfaceFont = Inter({
  variable: "--font-exosim-interface",
  subsets: ["latin"],
  display: "swap",
});

const dataFont = JetBrains_Mono({
  variable: "--font-exosim-data",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ExoSim — Exoplanet Transit Lab",
  description:
    "An interactive 3D simulator for exploring exoplanet transits, orbital geometry, and telescope light curves.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${interfaceFont.variable} ${dataFont.variable}`}
      >
        {children}
      </body>
    </html>
  );
}