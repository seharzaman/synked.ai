import type { Metadata } from "next";
import { AboutPage } from "./AboutPage";

export const metadata: Metadata = {
  title: "About — Synked.ai",
  description:
    "We synk businesses with the future of intelligence. Learn about our mission, vision, values, and team.",
};

export default function Page() {
  return <AboutPage />;
}
