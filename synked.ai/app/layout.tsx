import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/Footer";
import { Navbar1 } from "@/components/navbar1";

const fontHeading = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600", "700"],
});

const fontBody = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Synked.ai — AI Agent Automation Studio",
  description:
    "We design, deploy, and continuously manage intelligent AI agents that automate workflows, handle customer interactions, and integrate seamlessly into your existing systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        fontHeading.variable,
        fontBody.variable,
        fontMono.variable,
        "antialiased",
      )}
    >
      <body className="min-h-screen flex flex-col font-sans text-espresso bg-off-white">
        {/* <Navbar1 /> */}
        <main className="flex-1">{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
