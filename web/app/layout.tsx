import type { Metadata, Viewport } from "next";
import "./globals.css";

import { seoRootDefaults } from "@/lib/seo";

// Local fonts get loaded here (next/font/local from web/fonts) and their
// variables added to <html className=…>.

export const metadata: Metadata = {
  ...seoRootDefaults,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="hr" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {/* Providers wrap here once there are any. */}
        {/* <Header /> mounts here. */}
        <main className="flex-1">{children}</main>
        {/* <Footer /> mounts here. */}
      </body>
    </html>
  );
}
