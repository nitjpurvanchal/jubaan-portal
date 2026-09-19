import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jubaan-portal.vercel.app"),
  title: "JUBAAN — The Cultural Club of NIT Jalandhar | Bodhi Circuit",
  description:
    "JUBAAN (Jharkhand Uttar Pradesh Bihar Association And Networks) — a cultural portal celebrating heritage, anchored on the sacred Bodhi Circuit of Lord Buddha. हमारी विरासत, हमारी जुबानी",
  icons: {
    icon: "/logo/jubaan-logo-64.png",
    apple: "/logo/jubaan-logo-192.png",
  },
  openGraph: {
    title: "JUBAAN — The Cultural Club of NIT Jalandhar",
    description:
      "Walk the Bodhi Circuit of our heritage. हमारी विरासत, हमारी जुबानी",
    images: [{ url: "/logo/jubaan-logo-512.png", width: 512, height: 512 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0c07",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-ink text-cream font-sans min-h-screen flex flex-col texture-grain antialiased">
        <Suspense fallback={null}>
          <PageLoader />
        </Suspense>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
