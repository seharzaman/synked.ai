import type { Metadata } from "next";
import { Suspense } from "react";
import { DemoBuilderPage } from "./DemoBuilderPage";

export const metadata: Metadata = {
  title: "AI System Builder — Synked.ai",
  description:
    "Design your AI agent system visually. Drag and drop components to build your custom AI architecture.",
};

export default function Page() {
  return (
    <Suspense>
      <DemoBuilderPage />
    </Suspense>
  );
}
