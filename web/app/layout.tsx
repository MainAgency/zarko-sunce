import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver } from "@/components/RevealObserver";
import { Splash } from "@/components/Splash";
import { seoRootDefaults } from "@/lib/seo";

// Nohemi (Fontshare) is the site face. Only these three cuts are bundled, so
// light (300) text renders in Regular. The generated metric-matched fallback
// is off: its metrics come out at ~24% size, which shrinks glyphs Nohemi lacks
// (the → arrows) to near-invisible.
const nohemi = localFont({
  src: [
    { path: "./fonts/Nohemi-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/Nohemi-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/Nohemi-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-nohemi",
  display: "swap",
  adjustFontFallback: false,
});

// Only the logo and the Novosti portal use the heavy brand face.
const display = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  ...seoRootDefaults,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f2ee",
};

/** Runs before paint so a saved dark theme never flashes light. Default is light. */
const themeScript = `try{if(localStorage.getItem("theme")==="dark"){document.documentElement.dataset.theme="dark"}}catch(e){}`;
/** Marks the splash as running before paint, so the page cannot scroll out from under it. */
const splashScript = `document.documentElement.dataset.splash="on";`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="hr"
      suppressHydrationWarning
      className={`${nohemi.variable} ${display.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript + splashScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}[data-reveal] .reveal-mask{clip-path:none!important}[data-reveal] .reveal-inner{transform:none!important}.zs-splash{display:none}`}</style>
        </noscript>
        <Splash />
        <Header />
        {/* Clips sideways overflow (marquees, reveals) without touching <html>/<body>,
            so the fixed header keeps the viewport as its containing block on iOS. */}
        <div className="flex flex-1 flex-col overflow-x-clip">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <RevealObserver />
      </body>
    </html>
  );
}
