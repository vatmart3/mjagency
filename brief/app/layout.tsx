import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mjagency.eu"),
  title: "Brief projet — MJAGENCY",
  description:
    "Neuf étapes, environ quatre minutes : décrivez le site que vous voulez, voyez-le prendre forme, et recevez une première direction sous 24 h.",
  openGraph: {
    title: "Brief projet — MJAGENCY",
    description:
      "Décrivez votre futur site en 9 étapes. On vous recontacte sous 24 h avec une première direction.",
    locale: "fr_FR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${instrument.variable} ${geist.variable} ${geistMono.variable}`}>
      <body className="grain antialiased">{children}</body>
    </html>
  );
}
