import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NavigationScroll } from "@/components/layout/NavigationScroll";
import { site } from "@/content/site";
import { DEFAULT_THEME, themeBootstrap } from "@/lib/theme-preference";
import "./globals.css";
const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  ),
  title: {
    default: site.title + " — Detailed for construction",
    template: "%s | " + site.title,
  },
  description: site.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: site.title,
    description: site.description,
    images: [{ url: "/images/social-preview.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/brand/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body
        className={`${sans.variable} ${mono.variable} font-sans antialiased`}
      >
        <a
          href="#main"
          className="fixed z-50 top-3 left-3 -translate-y-30 focus:translate-y-0 bg-ink text-paper px-5 py-3"
        >
          Skip to content
        </a>
        <Header />
        <NavigationScroll />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
