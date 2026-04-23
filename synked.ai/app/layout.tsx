import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono-space",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Synked.ai — Synk Your Business with AI",
    template: "%s | Synked.ai",
  },
  description:
    "We design, deploy, and continuously manage intelligent AI agents that automate workflows, handle customer interactions, and integrate seamlessly into your existing systems.",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${spaceMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
