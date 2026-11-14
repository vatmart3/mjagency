import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { site } from "@/content/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Header from "@/components/ui/Header";
import Cursor from "@/components/ui/Cursor";
import Grain from "@/components/ui/Grain";
import Loader from "@/components/ui/Loader";
import StickyCTA from "@/components/ui/StickyCTA";
import PageTransition from "@/components/ui/PageTransition";
import ContactPanel from "@/components/contact/ContactPanel";
import Footer from "@/components/sections/Footer";
import StaticPreview from "@/components/providers/StaticPreview";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: "Jérémy Vatuone" }, { name: "Matheis Farrieux" }],
  keywords: [
    "MJ LAB",
    "Sète",
    "Frontignan",
    "Bassin de Thau",
    "création de site internet",
    "e-commerce",
    "agence web",
    "SaaS",
    "agents IA",
    "achat-revente",
    "live Twitch TikTok",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#F5F0E9",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  slogan: site.signature,
  description: site.description,
  email: site.contact.email,
  telephone: site.contact.phone,
  founders: site.founders.map((f) => ({ "@type": "Person", name: `${f.firstName} ${f.lastName}` })),
  address: { "@type": "PostalAddress", addressLocality: "Sète", addressRegion: "Occitanie", addressCountry: "FR" },
  areaServed: site.location.cities.map((c) => ({ "@type": "City", name: c })),
  sameAs: site.social.filter((s) => s.url).map((s) => s.url),
};

/* Avant le premier pixel : un visiteur déjà venu ne revoit pas le loader. */
const visitedScript = `try{if(localStorage.getItem('mjlab-visited')==='1')document.documentElement.dataset.visited='1'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${poppins.variable} ${inter.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: visitedScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <Loader />
        <SmoothScroll />
        <StaticPreview />
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <StickyCTA />
        <ContactPanel />
        <PageTransition />
        <Cursor />
        <Grain />
      </body>
    </html>
  );
}
